#!/usr/bin/env bash
# Upload the portfolio and restart its HTTPS server in tmux.
# Usage:
#   1. Fill in .env
#   2. ./deploy.sh
git pull

set -Eeuo pipefail

# Configuration belongs in .env and must not be committed.
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

if [[ -z "$SERVER_USER" || -z "$SERVER_HOST" ]]; then
  echo "Укажите сервер: SERVER_USER=имя SERVER_HOST=адрес bash deploy.sh" >&2
  exit 2
fi

for command in ssh sftp; do
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
    echo "Для SSH_PASSWORD установите sshpass или удалите SSH_PASSWORD и используйте SSH-ключ/ввод пароля." >&2
    exit 1
  }
  export SSHPASS="$SSH_PASSWORD"
  AUTH_COMMAND=(sshpass -e)
  trap 'unset SSHPASS' EXIT
fi

echo "Загружаю файлы по SFTP..."
"${AUTH_COMMAND[@]}" sftp -P "$SSH_PORT" -o StrictHostKeyChecking=accept-new "$TARGET" <<SFTP_COMMANDS
cd $REMOTE_DIR
put -R * 
SFTP_COMMANDS

echo "Перезапускаю tmux-сессию '$TMUX_SESSION'..."
"${AUTH_COMMAND[@]}" ssh "${SSH_OPTIONS[@]}" "$TARGET" \
  "tmux kill-session -t '$TMUX_SESSION' 2>/dev/null || true; \
   tmux new-session -d -s '$TMUX_SESSION' 'cd \"$REMOTE_DIR\" && exec python3 server.py'"

echo "Готово. Сервер запущен в tmux-сессии: $TMUX_SESSION"
echo "Логи на сервере: tmux attach -t $TMUX_SESSION"
