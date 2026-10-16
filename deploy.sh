#!/usr/bin/env bash
# Fast deployment: synchronise changes with rsync and restart tmux.
# Usage:
#   1. Fill in .env
#   2. ./deploy2.sh

set -Eeuo pipefail

git pull

ENV_FILE="${ENV_FILE:-.env}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

SERVER_USER="${SERVER_USER:-}"
SERVER_HOST="${SERVER_HOST:-}"
SSH_PORT="${SSH_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/home/coftochka/liza-tsekh}"
TMUX_SESSION="${TMUX_SESSION:-liza-portfolio}"
SSH_PASSWORD="${SSH_PASSWORD:-}"
PORTFOLIO_CLIENT_TIMEOUT="${PORTFOLIO_CLIENT_TIMEOUT:-15}"

if [[ -z "$SERVER_USER" || -z "$SERVER_HOST" ]]; then
  echo "Заполните SERVER_USER и SERVER_HOST в .env." >&2
  exit 2
fi

for command in ssh rsync; do
  command -v "$command" >/dev/null || {
    echo "Не найдена команда: $command" >&2
    exit 1
  }
done

case "$REMOTE_DIR" in
  /*) ;;
  *) echo "REMOTE_DIR должен быть абсолютным путём." >&2; exit 2 ;;
esac

TARGET="${SERVER_USER}@${SERVER_HOST}"
SSH_OPTIONS=(-p "$SSH_PORT" -o BatchMode=no -o StrictHostKeyChecking=accept-new)
AUTH_COMMAND=()

if [[ -n "$SSH_PASSWORD" ]]; then
  command -v sshpass >/dev/null || {
    echo "Для SSH_PASSWORD установите sshpass или используйте SSH-ключ." >&2
    exit 1
  }
  export SSHPASS="$SSH_PASSWORD"
  AUTH_COMMAND=(sshpass -e)
  trap 'unset SSHPASS' EXIT
fi

echo "Синхронизирую изменённые файлы через rsync..."
# --delete deliberately omitted: remote-only files will not be removed.
"${AUTH_COMMAND[@]}" rsync -azO --human-readable --progress \
  --exclude='.env' \
  --exclude='.git/' \
  --exclude='.agents/' \
  --exclude='access.log.jsonl' \
  --exclude='__pycache__/' \
  --exclude='*.pyc' \
  -e "ssh -p $SSH_PORT -o BatchMode=no -o StrictHostKeyChecking=accept-new" \
  ./ "$TARGET:$REMOTE_DIR/"

echo "Перезапускаю tmux-сессию '$TMUX_SESSION'..."
"${AUTH_COMMAND[@]}" ssh "${SSH_OPTIONS[@]}" "$TARGET" \
  bash -s -- "$REMOTE_DIR" "$TMUX_SESSION" "$PORTFOLIO_CLIENT_TIMEOUT" <<'REMOTE_SCRIPT'
set -Eeuo pipefail

remote_dir="$1"
tmux_session="$2"
client_timeout="$3"

# An absent session is normal on the first deploy. Only stop one that exists,
# then create exactly one fresh session.
if tmux has-session -t "$tmux_session" 2>/dev/null; then
  tmux kill-session -t "$tmux_session"
fi

tmux_command=$(printf \
  'cd %q && while true; do python3 server.py --client-timeout %q; status=$?; echo "Server exited ($status); restarting in 3 seconds..."; sleep 3; done' \
  "$remote_dir" "$client_timeout")
tmux new-session -d -s "$tmux_session" "$tmux_command"
REMOTE_SCRIPT

echo "Готово. Сервер запущен в tmux-сессии: $TMUX_SESSION"
echo "Логи на сервере: tmux attach -t $TMUX_SESSION"
