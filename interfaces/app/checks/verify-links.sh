#!/usr/bin/env bash
set -Eeuo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
interfaces_dir="$project_dir/interfaces"
errors=0

check_file() {
  if [[ ! -f "$interfaces_dir/$1" ]]; then
    echo "Не найден файл: /interfaces/$1" >&2
    errors=1
  fi
}

while IFS= read -r name; do check_file "$name.dc.html"; done < <(
  rg -o 'dc-import[[:space:]][^>]*name="[^"]+"' "$interfaces_dir" --glob '*.html' --glob '!trash/**' |
    sed -E 's/.*name="([^"]+)".*/\1/' | sort -u
)

while IFS= read -r path; do check_file "$path"; done < <(
  rg -o '(from|src)="\./[^"]+"' "$interfaces_dir/index.html" |
    sed -E 's/.*="\.\/([^"?]+).*/\1/' | sort -u
)

[[ "$errors" -eq 0 ]] || exit 1
echo "Проверка ссылок interfaces пройдена."
