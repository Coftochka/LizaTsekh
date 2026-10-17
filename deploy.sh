#!/usr/bin/env bash
# Fast deployment: synchronise static files and reload nginx.
# Usage:
#   1. Fill in .env
#   2. ./deploy.sh
<<<<<<< HEAD

git pull
=======
>>>>>>> a4f3b49b87d8db81dcf0c0a8aac96ea9a1b9bf01

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
SSH_PASSWORD="${SSH_PASSWORD:-}"
NGINX_SITE_NAME="${NGINX_SITE_NAME:-lizatsekh.ru}"
LEGACY_TMUX_SESSION="${LEGACY_TMUX_SESSION:-${TMUX_SESSION:-liza-portfolio}}"

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

echo "Устанавливаю конфигурацию nginx и применяю изменения..."
"${AUTH_COMMAND[@]}" ssh "${SSH_OPTIONS[@]}" "$TARGET" \
  bash -s -- "$REMOTE_DIR" "$NGINX_SITE_NAME" "$LEGACY_TMUX_SESSION" <<'REMOTE_SCRIPT'
set -Eeuo pipefail

<<<<<<< HEAD
echo "Готово. Сервер запущен в tmux-сессии: $TMUX_SESSION"
echo "Логи на сервере: tmux attach -t $TMUX_SESSION"

git add * 
git commit -m "Изменения с компа лизы"
git push

=======
remote_dir="$1"
site_name="$2"
legacy_tmux_session="$3"
source_config="$remote_dir/nginx/$site_name.conf"
installed_config="/etc/nginx/sites-available/$site_name"
enabled_config="/etc/nginx/sites-enabled/$site_name"

if [[ ! -f "$source_config" ]]; then
  echo "Не найден nginx-конфиг: $source_config" >&2
  exit 1
fi

# -n prevents a deployment from hanging on a sudo password prompt. Configure
# the remote account with passwordless sudo for these nginx administration
# commands before using this script.
sudo -n install -m 644 "$source_config" "$installed_config"
sudo -n ln -sfn "$installed_config" "$enabled_config"
sudo -n /usr/sbin/nginx -t

# Retire the legacy Python listener if it is still present; nginx must own
# ports 80 and 443. Its absence is expected after the first nginx deployment.
if tmux has-session -t "$legacy_tmux_session" 2>/dev/null; then
  tmux kill-session -t "$legacy_tmux_session"
fi

sudo -n systemctl enable nginx
sudo -n systemctl reload-or-restart nginx
REMOTE_SCRIPT

echo "Готово. Nginx обслуживает сайт. Логи: sudo tail -f /var/log/nginx/access.log"
>>>>>>> a4f3b49b87d8db81dcf0c0a8aac96ea9a1b9bf01
