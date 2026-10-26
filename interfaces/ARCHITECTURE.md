# Архитектура `/interfaces/`

Подсайт статический: в production его обслуживает nginx, без Node-, Python- или tmux-процесса.

## Публичные точки

- `index.html` — страница и навигация;
- `support.js` — runtime устаревших `<x-dc>`, `<dc-import>` и `<x-import>`;
- `NewCasesClean.dc.html` и вложенные `New*.dc.html` — кейсы «Квартал» и «Учёт»;
- `case-reel.js`, `dash-reel.js`, `original-deck-reel.js` — анимированные custom elements;
- `hero-export/`, `assets/`, `deck/`, `hero-slides/`, `img/` — опубликованные медиа.

`trash/`, исходники, README и локальные команды не публикуются.

## Новый код

`app/` — единственное место для нового browser-JavaScript:

```text
app/
  core/activity.js       lifecycle: viewport и скрытая вкладка
  checks/verify-links.sh проверка ссылок до деплоя
```

Не клади в `app/` приватные данные или черновики: nginx публикует этот каталог намеренно.

## Правила

1. Подключай существующие компоненты к общему lifecycle по одному.
2. Не меняй дизайн и DOM-разметку во время технического переноса.
3. В `disconnectedCallback` отменяй rAF, observers и таймеры.
4. Тяжёлые анимации работают в пределах 300px от viewport и только при видимой вкладке.
5. Перед деплоем запускай `./interfaces/app/checks/verify-links.sh`, `git diff --check` и `bash -n deploy.sh`.
