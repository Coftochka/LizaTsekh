(function () {
if (customElements.get('original-deck-reel')) return;
if (!document.querySelector('style[data-nekst]')) {
  const f = document.createElement('style'); f.dataset.nekst = '';
  const u = p => new URL(p, document.baseURI).href;
  f.textContent = `@font-face{font-family:'Nekst SemiBold';src:url('${u('deck/Nekst-SemiBold.woff2')}') format('woff2')}@font-face{font-family:'Nekst Medium';src:url('${u('deck/Nekst-Medium.woff2')}') format('woff2')}`;
  document.head.appendChild(f);
}
const EZ = 'cubic-bezier(.76,0,.18,1)';
const CSS = `
:host{display:block;position:relative;width:100%;height:100%;overflow:hidden;background:#121212}
.stage{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;perspective:2400px;perspective-origin:50% 40%}
.glow{position:absolute;left:960px;top:560px;width:1500px;height:1100px;margin:-550px 0 0 -750px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,164,27,.16),rgba(255,164,27,.04) 60%,transparent)}
.lap{position:absolute;left:218px;top:96px;width:1484px;height:888px;transform-origin:742px 429px;transform-style:preserve-3d;transition:transform 1.1s ${EZ}}
.lid{position:absolute;left:0;top:0;width:1484px;height:858px;border-radius:38px 38px 8px 8px;background:#161618;box-shadow:0 0 0 2px #2c2c30 inset,0 60px 120px rgba(0,0,0,.6)}
.lid::before{content:"";position:absolute;left:50%;top:9px;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:#2e3036}
.base{position:absolute;left:-108px;top:856px;width:1700px;height:32px;border-radius:4px 4px 30px 30px;background:linear-gradient(180deg,#d9dce2,#9da2ab)}
.base::after{content:"";position:absolute;left:50%;top:0;width:220px;height:11px;margin-left:-110px;border-radius:0 0 12px 12px;background:#b8bcc4}
.screen{position:absolute;left:22px;top:22px;width:1440px;height:810px;border-radius:10px;overflow:hidden;background:#dfe6f7}
.slide{position:absolute;left:0;top:0;width:1920px;height:1080px;transform:scale(.75);transform-origin:0 0;font-family:Manrope,'Helvetica Neue',Arial,sans-serif;color:#1E1E1E;overflow:hidden}
.bgimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.e{position:absolute;box-sizing:border-box;overflow:hidden}
.glass{background-color:rgba(255,255,255,.6);border:1.5px solid rgba(255,255,255,.9);box-shadow:0 20px 50px rgba(42,54,165,.10)}
.fill{border:0}
.txt{overflow:visible}
.ava{display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#E3E8F4,#C9D2E8);color:#2A36A5;font-family:'Nekst SemiBold';letter-spacing:-.02em}
.hdr{background:linear-gradient(160deg,#23308F 0%,#2A36A5 40%,#3D4FD6 75%,#4E63EA 100%);display:flex;align-items:center;padding-left:28px;color:#fff;font-family:'Nekst SemiBold';font-size:21px;white-space:nowrap}
.tab{display:flex;align-items:center;justify-content:center;gap:10px;white-space:nowrap;font-weight:700;font-size:17px}
.tab .tn{font-family:'Nekst SemiBold';font-weight:400;font-size:15px}
.tab .dt{width:9px;height:9px;border-radius:50%;background:currentColor;display:block}
.pill{display:flex;align-items:center;justify-content:center;white-space:nowrap;font-weight:700}
.nk{font-family:'Nekst SemiBold';letter-spacing:-.02em;line-height:1}
.nm b{display:block;font-family:'Nekst Medium';font-weight:400;line-height:1.1}
.nm span{display:block;margin-top:.35em;font-size:.67em;line-height:1.3;color:#5B6270}
.nm i{display:inline-block;font-style:normal;margin-top:.5em;padding:.26em .52em;border-radius:.5em;background:rgba(42,54,165,.07);border:1px solid rgba(42,54,165,.12);font-family:'Nekst Medium';font-size:.56em;line-height:1.25;color:#2A36A5}
.zi{display:flex;flex-direction:column;justify-content:center;gap:10px;padding:16px 20px;font-size:18px;line-height:1.3}
.zi i{font-style:normal;align-self:flex-start;padding:4px 11px;border-radius:10px;font-family:'Nekst SemiBold';font-size:14px}
.t14{font-size:14px;line-height:1.28}.t16{font-size:16px;font-weight:700}
.lab{font-size:14px;line-height:1.2;color:#5B6270}
.segs{display:flex;gap:4px}.segs i{flex:1;height:6px;border-radius:3px}
.pnl{padding:20px 22px;display:flex;flex-direction:column}
.pnl .h{font-family:'Nekst Medium';font-size:22px;color:#2A36A5}
.row{padding:7px 12px;border-radius:12px;background:rgba(255,255,255,.75);font-size:15px;line-height:1.25}
.kv{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:10px 0;border-top:1px solid rgba(42,54,165,.12)}.kv span{font-size:16px;color:#5B6270}.kv b{font-family:'Nekst Medium';font-weight:400;font-size:19px;text-align:right}
.chip{display:inline-flex;border-radius:7px;overflow:hidden;font-size:12px;font-weight:700}.chip b{padding:2px 6px;background:#E8EDFB;color:#2A36A5}.chip span{padding:2px 7px;background:#F4F6FC;color:#2A36A5}
.blk{padding:20px 22px;display:flex;flex-direction:column;gap:12px}
.blk .hd{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.blk .hd b{font-family:'Nekst Medium';font-weight:400;font-size:23px;line-height:1.15;color:#2A36A5}
.blk .hd em{font-style:normal;font-family:'Nekst SemiBold';font-size:46px;line-height:.9;color:#2A36A5;white-space:nowrap}.blk .hd em small{font-family:'Nekst Medium';font-size:17px;margin-left:5px}
.unit{display:flex;flex-direction:column;gap:10px;padding:16px 18px;border-radius:22px;background:rgba(255,255,255,.55);min-height:640px}.unit .rr{flex:1}
.unit .un{display:flex;justify-content:space-between;font-size:16px;font-weight:700}
.unit .cs{display:flex;flex-wrap:wrap;gap:4px}
.unit .rr{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 12px;border-radius:14px;background:rgba(255,255,255,.85)}
.unit .rr div{display:flex;flex-direction:column;gap:2px}.unit .rr div b{font-size:15px}.unit .rr div span{font-size:12px;color:#2A36A5;font-weight:700}
.unit .rr em{font-style:normal;font-family:'Nekst SemiBold';font-size:20px}
`;
const INI = n => n.split(' ').slice(0, 2).map(w => w[0]).join('');
const P = [
  ['Анна Соколова', 'Директор по профессиональному обучению', 'L19', 'Партнёр по вопросам развития'],
  ['Мария Орлова', 'Директор по управленческому обучению', 'L19', 'Партнёр по вопросам развития'],
  ['Илья Белов', 'Директор по цифровым продуктам обучения', 'L18', ''],
  ['Ольга Морозова', 'Директор центра сервисов обучения', 'L19', ''],
  ['Елена Громова', 'Руководитель регионального офиса', 'L19', 'с 2027: директор по операционной поддержке и филиалам'],
  ['Дарья Лебедева', 'Руководитель отдела по персоналу и правовой поддержке', 'L18', ''],
  ['Ксения Волкова', 'Руководитель планово-экономического отдела', 'L18', 'в процессе передачи функции в общий центр'],
  ['Павел Зимин', 'Технический директор', 'L18', ''],
  ['Наталья Ершова', 'Советник по хозяйственной части', 'L18', 'позиция пересматривается с 01.01.2027']
];
const GOOD = '#3FB55A', MID = '#2E67D7', WARN = '#E0A060', BAD = '#FF6D6D', OFF = 'rgba(42,54,165,0.12)';
const LV = { 'Высокий': 3, 'Высокая': 3, 'Средний': 2, 'Средняя': 2, 'Низкий': 1, 'Низкая': 1 };
const TONE = { up: [null, WARN, MID, GOOD], risk: [null, GOOD, WARN, BAD] };
const INK = { [GOOD]: '#23853A', [MID]: '#2A36A5', [WARN]: '#B86E22', [BAD]: '#D94848' };
const PROT = { 'Высокий': ['#E3F6E7', '#23853A'], 'Средний': ['#E8EDFB', '#2A36A5'], 'Низкий': ['#FBEBDD', '#9A5A1A'] };
const TABS = ['Оргструктура', 'Защищенность позиций', 'Профессиональное обучение', 'Управленческое обучение', 'Цифровая среда', 'Сервисы обучения', 'Операционная поддержка', 'HR и правовое', 'Финансы'];
const nmHtml = (i, tag) => `<b>${P[i][0]}</b><span>${P[i][1]}</span>${tag && P[i][3] ? `<i>${P[i][3]}</i>` : ''}`;
const chips = s => s.map(c => { const [g, n] = c.split(' '); return `<span class="chip"><b>${g}</b><span>${n}</span></span>`; }).join('');
const PR = [
  ['Карпов Сергей Андреевич', 'Президент университета', '—', 'L21', 'Низкий', 'Соколова А.С., директор по профессиональному обучению (L19)', '1-2 года', '—', -1],
  ['Соколова Анна Сергеевна', 'Директор по профессиональному обучению', '—', 'L19', 'Средний', 'Кириллов Д.О., руководитель учебного отдела (L16); Яковлева И.П., руководитель учебного отдела филиала (L16)', '1-2 года', '—', 0],
  ['Орлова Мария Игоревна', 'Директор по управленческому обучению', '—', 'L19', 'Высокий', 'Тихонова В.А., руководитель отдела развития персонала филиала (L15)', 'готов', '—', 1],
  ['Белов Илья Романович', 'Директор по цифровым продуктам обучения', '—', 'L18', 'Низкий', '—', '—', 'Субботина К.В., главный специалист группы поддержки цифрового обучения (L14)', 2],
  ['Морозова Ольга Петровна', 'Директор центра сервисов обучения', '—', 'L19', 'Низкий', 'Соколова А.С., директор по профессиональному обучению (L19)', 'готов', 'Егорова Н.М., руководитель отдела договоров, расчетов и отчетности (L16)', 3],
  ['Громова Елена Витальевна', 'Руководитель регионального офиса', 'Оптимизация ШЕ: перевод на позицию директора по операционной поддержке и филиалам', 'L19', 'Средний', '—', '—', '—', 4],
  ['Зимин Павел Борисович', 'Технический директор', 'Подчинение директору по операционной поддержке', 'L18', 'Средний', 'Лапин М.Г., ведущий инженер университета (L13)', '1-2 года', 'Лапин М.Г., ведущий инженер университета (L13)', 7],
  ['Лебедева Дарья Олеговна', 'Руководитель отдела по персоналу и правовой поддержке', 'Правовая функция переходит к директору по операционной поддержке', 'L18', 'Средний', '—', '—', 'Фомина Т.В., главный специалист отдела (L15); Гусева А.С., главный специалист отдела (L14)', 5],
  ['Волкова Ксения Андреевна', 'Руководитель планово-экономического отдела', '—', 'L18', 'Низкий', '—', '—', '—', 6]
];
const PROF = [
  { i: 0, name: 'Соколова Анна Сергеевна', role: 'Директор по профессиональному обучению', unit: 'Дирекция', age: '46', ten: '8 лет 3 месяца', inr: '2 года 4 месяца', edu: ['Сибирский технологический университет, Менеджмент организации (в отраслях тяжелой промышленности)'],
    ind: ['Средний', 'Средний', 'Низкий', 'Низкая'], kpi: '101,8%', kn: 101.8, catRec: 'Потенциальный', catCur: 'Профессионал', s360: 'Средний / 81.4', r360: [['3.1', 75.2], ['3.4', 79.6], ['3.8', 95.1]], traj: ['Средняя', 'Средняя', 'Ниже средней'],
    rec: ['Не включать в HiPo', 'Потенциальный сотрудник', 'Включить в HiPro', 'Включить в резерв предприятия'], pt: 'Вертикальное, Горизонтальное', pos: 'Президент университета, Директор центра сервисов обучения', pr: '1-2 года, Готов',
    prev: ['Не включать в HiPo', 'Включить в резерв предприятия'], res: [['Кириллов Денис Олегович', 'Руководитель отдела', '1-2 года'], ['Яковлева Ирина Павловна', 'Руководитель отдела', '1-2 года']],
    strong: [['Нацеленность на результат', 'Находит новые пути к цели, если привычные не срабатывают'], ['Развитие', 'Меняет подход к работе с учетом обратной связи']],
    dev: [['Развитие бизнеса', 'Переводит стратегические цели в понятные команде задачи'], ['Безопасность', 'Добивается от других соблюдения правил охраны труда']],
    career: ['Руководитель направления обучения компании в регионе присутствия'],
    ach: ['Главным результатом года стала собранная команда экспертов, способная закрывать задачи полного цикла. Настроено взаимодействие между ключевыми подразделениями внутри направления и со смежными функциями, что помогает спокойно проходить любые изменения. Команда обеспечила стабильность процессов во время реорганизации: объединение каталогов, единые подходы, работа с тарифами. Вовлеченность направления за прошлый год выше 65%, выполнение плана 103%'],
    comment: 'Анна — надежный и последовательный руководитель, которого очень уважает команда. Ее главная точка роста — переход от роли операционного менеджера к роли стратегического партнера бизнеса: для этого нужно развивать стратегическое мышление, влияние и проектный подход. При системной работе над этими зонами она заметно усилит вклад обучения в результаты бизнеса и закрепится как лидер изменений.',
    ipr: ['Сформирован', 'Не сформирован'], eng: '68%' },
  { i: 1, name: 'Орлова Мария Игоревна', role: 'Директор по управленческому обучению', unit: 'Дирекция, г. Москва', age: '49', ten: '18 лет 6 месяцев', inr: '1 год 10 месяцев', edu: ['Уральский государственный университет, Экономика труда и управление персоналом'],
    ind: ['Высокий', 'Высокий', 'Низкий', 'Средняя'], kpi: '106,4%', kn: 106.4, catRec: 'Потенциальный', catCur: 'Потенциальный', s360: 'Средний / 78.3', r360: [['3.0', 58.4], ['3.4', 82.7], ['3.2', 72.9]], traj: ['Средняя', 'Средняя', 'Средняя'],
    rec: ['Не включать в HiPo', 'Включить в HiPro', 'Потенциальный сотрудник', 'Включить в резерв предприятия'], pt: 'Горизонтальное', pos: 'Руководитель направления методологии обучения', pr: 'Готов',
    prev: ['Включить в резерв функции', 'Вернуться к обсуждению через год'], res: [['Тихонова Вера Андреевна', 'Руководитель отдела', 'готов']],
    strong: [['Нацеленность на результат', 'Ставит высокую планку для своей работы и работы коллег'], ['Цифровая грамотность', 'Работает в корпоративных сервисах с учетом правил безопасности']],
    dev: [['Организация работы', 'Проверяет, что команда одинаково поняла задачу'], ['Развитие команды', 'Поддерживает в команде рабочий настрой']],
    career: ['В ближайшее время рассматриваю роль, связанную с управлением талантами и развитием организации — на стыке оценки, диагностики и обучения. Интересна позиция, где можно влиять на кадровую стратегию, строить сквозные процессы и принимать решения на основе данных.', 'Также готова рассмотреть роль руководителя функции обучения и развития, где пригодится опыт управления и экспертиза в разных HR-направлениях'],
    ach: ['запуск уровневых программ для руководителей', 'экосистема «Коллеги учат коллег»: марафон для наставников, практикумы с тренерами по лидерству, встречи с менторами для молодежи', 'ИИ-помощник по развитию и диалоги о развитии по итогам оценки 360', 'регулярные HR-клубы'],
    comment: 'Мария показывает сильный результат и обладает потенциалом, но заметно отстает в управленческих компетенциях и ценностном поведении. Нужна целенаправленная поддержка и развитие. Без этого ее эффективность как руководителя команды останется ограниченной.',
    ipr: ['Сформирован', 'Не сформирован'], eng: '74%' },
  { i: 7, name: 'Зимин Павел Борисович', role: 'Технический директор', unit: 'Дирекция', age: '52', ten: '16 лет 9 месяцев', inr: '2 года 6 месяцев', edu: ['Красноярский педагогический университет, Педагогика и психология', 'Петербургский университет управления, Государственное управление', 'Северный индустриальный институт, Промышленное строительство'],
    ind: ['Средний', 'Средний', 'Низкий', 'Средняя'], kpi: '105,9%', kn: 105.9, catRec: 'Профессионал', catCur: 'Потенциальный', s360: 'Средний / 80.6', r360: [['3.0', 65.1], ['3.4', 77.9], ['4.0', 97.6]], traj: ['Средняя', 'Средняя', 'Высокая'],
    rec: ['Не включать в HiPo', 'Изменить категорию на «Профессионал»', 'Соответствие должности'], pt: '—', pos: '—', pr: '—',
    prev: ['Не включать в HiPo', 'Готовить резерв', 'Изменить категорию: Профессионал', 'Соответствие должности'], res: [['Лапин Максим Георгиевич', 'Главный специалист', '1-2 года']],
    strong: [['Безопасность', 'Учитывает правила безопасности при принятии решений'], ['Эффективная коммуникация', 'Открыто высказывает позицию по рабочим вопросам']],
    dev: [['Развитие', 'Сам развивает профессиональные навыки и компетенции'], ['Цифровая грамотность', 'Повышает эффективность работы с помощью корпоративных сервисов']],
    career: ['Развивать компетенции в инженерном обеспечении эксплуатации и ремонтов.'],
    ach: ['Ремонты учебных корпусов идут по графику 2026 года. Подготовлены планы ремонтов со сметами и коммерческими предложениями на 2027 год полностью и на 2028 год частично. Повышено качество технического обслуживания. Разработаны нормы времени на обслуживание инженерных систем и зданий, они используются в договорной работе. Работа в области снабжения стала системнее и устойчивее.'],
    comment: 'Павел показывает высокий результат, работает системно и открыто аргументирует позицию, команда его уважает. Приоритеты развития: гибче реагировать на изменения, активнее согласовывать работу со смежными подразделениями с учетом их загрузки и шире применять цифровые решения в ежедневных процессах. Также стоит последовательнее проявлять корпоративные ценности в повседневных решениях.',
    ipr: ['Выполнен', 'Сформирован'], eng: '71%' }
];
const segs = (v, k) => { const l = LV[v] || 0, c = TONE[k][l] || OFF; return `<div class="segs">${[1, 2, 3].map(s => `<i style="background:${s <= l ? c : OFF}"></i>`).join('')}</div>`; };

class DeckReel extends HTMLElement {
  static get observedAttributes() { return ['speed']; }
  set speed(v) { this._speed = parseFloat(v) || 1; } get speed() { return this._speed || 1; }
  attributeChangedCallback(n, o, v) { if (n === 'speed') this._speed = parseFloat(v) || 1; }
  connectedCallback() { if (!this.shadowRoot) this.attachShadow({ mode: 'open' }); setTimeout(() => { if (this.isConnected && !this._built) this.build(); }, 0); }
  disconnectedCallback() { this._built = false; this.gen = (this.gen || 0) + 1; cancelAnimationFrame(this._raf); this._ro && this._ro.disconnect(); this._activity && this._activity.disconnect(); this.shadowRoot.innerHTML = ''; }
  build() {
    this._built = true; this.gen = (this.gen || 0) + 1;
    this.shadowRoot.innerHTML = `<style>${CSS}:host([data-interface-paused]) *{animation-play-state:paused!important}</style><div class="stage"><div class="glow"></div><div class="lap"><div class="base"></div><div class="lid"><div class="screen"><div class="slide"><img class="bgimg" src="deck/glass-bg.jpg" alt=""></div></div></div></div></div>`;
    const R = this.shadowRoot; this.stage = R.querySelector('.stage'); this.lap = R.querySelector('.lap'); this.slide = R.querySelector('.slide'); this.els = {};
    const fit = () => { const w = this.clientWidth, h = this.clientHeight; if (!w || !h) return; const s = Math.min(w / 1920, h / 1080); this.stage.style.transform = `translate(${(w - 1920 * s) / 2}px,${(h - 1080 * s) / 2}px) scale(${s})`; };
    this._ro = new ResizeObserver(fit); this._ro.observe(this); fit();
    this.clock = 0; this.waiters = []; this._last = 0;
    this._tick = () => { const n = performance.now(), dt = Math.min(n - this._last, 100); this._last = n; this.clock += dt * this.speed * 1.5; const due = this.waiters.filter(x => x.t <= this.clock); this.waiters = this.waiters.filter(x => x.t > this.clock); due.forEach(x => x.r()); this._raf = requestAnimationFrame(this._tick); };
    if ((this.previewStatic || this['preview-static'] || this.hasAttribute('preview-static'))) {
      this.show(this.sTitle()); this.cam('front', {instant:true});
      this.lap.style.transform = 'scale(.88)';
      return;
    }
    this._activity = (window.InterfaceActivity || { observe: (element, onChange) => { onChange(true); return { disconnect() {}, setExternallyPaused() {} }; } }).observe(this, active => this._setRunning(active));
    const gen = this.gen;
    (async () => { await this.w(200); while (gen === this.gen) await this.loop(); })();
  }
  _setRunning(active) {
    if (this._running === active) return;
    this._running = active;
    if (!active) { cancelAnimationFrame(this._raf); this._raf = 0; return; }
    this._last = performance.now(); this._raf = requestAnimationFrame(this._tick);
  }
  setExternalPaused(paused) { this._activity && this._activity.setExternallyPaused(paused); }
  w(ms) { return new Promise(r => this.waiters.push({ t: this.clock + ms, r })); }
  pr(i) { this.dispatchEvent(new CustomEvent('principle', { detail: i, bubbles: true, composed: true })); }
  cam(n, o = {}) {
    const C = { enter: 'translate3d(0,760px,-300px) rotateX(55deg) rotateY(0deg) scale(.8)', wide: 'translate3d(0,10px,0) rotateX(14deg) rotateY(-20deg) rotateZ(2deg) scale(.9)', front: 'none', left: 'rotateX(6deg) rotateY(14deg) scale(.96)', right: 'rotateX(6deg) rotateY(-14deg) scale(.96)', exit: 'translate3d(0,-900px,-400px) rotateX(-40deg) scale(.8)' };
    let t = C[n];
    if (n === 'zoom') { const k = o.k || 2, lx = 22 + o.x * .75, ly = 22 + o.y * .75; t = `translate3d(${-k * (lx - 742)}px,${-k * (ly - 429)}px,0) rotateX(${o.rx || 4}deg) rotateY(${o.ry || -6}deg) scale(${k})`; }
    this.lap.style.transition = o.instant ? 'none' : `transform ${(o.dur || 1.1) / 1.5}s ${EZ}`; this.lap.style.transform = t; if (o.instant) this.lap.offsetWidth;
  }
  tr(d) { const t = `.9s ${EZ} ${d}ms`; return `left ${t},top ${t},width ${t},height ${t},border-radius ${t},font-size ${t},transform ${t},background-color .6s ${d}ms,color .6s ${d}ms,opacity .4s ${d}ms`; }
  style(el, p) {
    const s = el.style;
    if (p.x != null) s.left = p.x + 'px'; if (p.y != null) s.top = p.y + 'px';
    if (p.w != null) s.width = p.w + 'px'; s.height = p.h != null ? p.h + 'px' : 'auto';
    if (p.r != null) s.borderRadius = p.r + 'px'; if (p.bg) s.backgroundColor = p.bg; if (p.c) s.color = p.c;
    if (p.fs) s.fontSize = p.fs + 'px'; if (p.z != null) s.zIndex = p.z;
    s.transform = `scale(${p.sc ?? 1})`;
  }
  show(map) {
    const keep = k => k === 'hdr' || k.startsWith('tab');
    const old = Object.keys(this.els).filter(k => !keep(k) || !map[k]);
    old.forEach((k, i) => { const el = this.els[k]; const d = Math.min(i * 6, 180); el.style.transition = `opacity .28s ${d}ms, transform .4s ${EZ} ${d}ms`; el.style.opacity = '0'; el.style.transform = 'translateY(-28px)'; delete this.els[k]; setTimeout(() => el.remove(), 700); });
    const lag = old.length ? 420 : 0;
    Object.entries(map).forEach(([k, p]) => {
      const o = p.o ?? 1;
      let el = this.els[k];
      if (el && keep(k)) {
        el.style.transition = this.tr(p.d || 0); this.style(el, p);
        if (p.html != null && p.html !== el._html) { el._html = p.html; el.innerHTML = p.html; }
        el.style.opacity = String(o); return;
      }
      el = document.createElement('div'); el.className = 'e ' + (p.t || 'glass');
      if (p.html != null) { el.innerHTML = p.html; el._html = p.html; }
      el.style.transition = 'none'; this.style(el, p); el.style.opacity = '0'; el.style.transform = 'translateY(46px)';
      this.slide.appendChild(el); this.els[k] = el; el.offsetWidth;
      const d = lag + (p.d || 0);
      el.style.transition = `opacity .5s ${d}ms, transform .75s ${EZ} ${d}ms`;
      el.style.opacity = String(o); el.style.transform = `scale(${p.sc ?? 1})`;
    });
  }
  ava(m, i, x, y, s, r, d = 0) { m['ph' + i] = { t: 'ava', x, y, w: s, h: s, r, fs: Math.round(s * .36), html: INI(P[i][0]), z: 2, d }; }
  hdr(a, m) {
    m.hdr = { t: 'hdr', x: 56, y: 44, w: 1808, h: 64, r: 32, html: 'Корпоративный университет', z: 2 };
    let x = 1854;
    for (let i = 8; i >= 0; i--) {
      const on = i === a, w = on ? Math.round(74 + TABS[i].length * 9.4) : 46; x -= w;
      const n = i < 2 ? '' : String(i - 1).padStart(2, '0');
      const ic = n ? `<span class="tn">${n}</span>` : '<span class="dt"></span>';
      m['tab' + i] = { t: 'tab', x, y: 53, w, h: 46, r: 23, bg: on ? '#FFFFFF' : 'rgba(255,255,255,0.16)', c: on ? '#2A36A5' : '#FFFFFF', html: on ? ic + `<span>${TABS[i]}</span>` : ic, d: (8 - i) * 16, z: 3 };
      x -= 6;
    }
    return m;
  }
  sTitle() {
    return { titleSource: { t: 'fill', x: 0, y: 0, w: 1920, h: 1080, z: 4,
      html: '<div style="position:absolute;inset:0;overflow:hidden"><img src="deck/committee-title-source.png" alt="Кадровый комитет, 2026" style="position:absolute;max-width:none;width:115%;height:132.78%;left:-13.885%;top:-18.672%"></div>' } };
  }
  sOrg() {
    const m = this.hdr(0, {});
    m.ttl = { t: 'txt nk', x: 56, y: 146, w: 1500, fs: 60, c: '#1E1E1E', html: 'Организационная структура <span style="color:#2E67D7">2026-2027</span>', z: 2 };
    P.forEach((p, i) => {
      const c = i % 3, r = Math.floor(i / 3), x = 56 + c * 608, y = 240 + r * 268, d = (c + r) * 40;
      m['card' + i] = { x, y, w: 592, h: 252, r: 36, bg: 'rgba(255,255,255,0.6)', z: 1, d };
      this.ava(m, i, x + 22, y + 42, 168, 40, d);
      m['nm' + i] = { t: 'txt nm', x: x + 218, y: y + (p[3] ? 46 : 74), w: 350, fs: 27, html: nmHtml(i, true), z: 2, d: d + 60 };
      m['gr' + i] = { t: 'pill nk', x: x + 136, y: y + 180, w: 58, h: 32, r: 14, bg: '#2A36A5', c: '#FFFFFF', fs: 17, html: p[2], z: 3, d: d + 80 };
    });
    return m;
  }
  sZones() {
    const m = this.hdr(0, {});
    m.ttl = { t: 'txt nk', x: 56, y: 146, w: 1100, fs: 60, c: '#1E1E1E', html: 'Зоны ответственности', z: 2 };
    m.leg = { x: 1180, y: 134, w: 684, h: 64, r: 20, z: 2, d: 300, html: `<div style="display:flex;align-items:center;gap:12px;padding:0 20px;height:100%"><span style="width:28px;height:16px;border-radius:6px;background:linear-gradient(135deg,#2A36A5,#4F5FE6);flex:none"></span><span style="font-size:18px;line-height:1.3"><b style="font-family:'Nekst Medium';font-weight:400;color:#2A36A5">Партнёр по вопросам развития</b> – учебных решений, запросов и форматов</span></div>` };
    const Z = [
      [['Партнёр бизнеса по запросам, качеству и эффекту обучения', 'p'], ['Учебные решения по рабочим профессиям на основе профстандартов'], ['Очная и практическая подготовка персонала дивизионов'], ['Каталог программ']],
      [['Учебные решения по лидерским и корпоративным навыкам по запросу центра талантов'], ['Партнёр бизнеса по запросам, качеству и эффекту обучения', 'p'], ['Подготовка руководителей и каталог программ'], ['Единая модель работы системы обучения для всех аудиторий', '2026']],
      [['Цифровые сервисы для обучения и поддержки сотрудника'], ['База знаний: учебный портал и конструкторы контента'], ['Поиск и внедрение лучших цифровых практик']],
      [['Сбор потребности в обучении по всем предприятиям, все форматы профподготовки'], ['Сервисный центр организации обучения для группы компаний'], ['Бюджет и отчетность по обучению']],
      [['Проекты функции «Обучение»: автоматизация планирования, аналитика'], ['Корпоративные программы для студентов и молодых специалистов'], ['Операционная эффективность университета'], ['Директор по операционной поддержке и филиалам, L19: хозяйственная деятельность', '2027']]
    ];
    for (let i = 0; i < 5; i++) {
      const x = 56 + i * 364, y = 240, d = i * 60;
      m['card' + i] = { x, y, w: 348, h: 792, r: 36, bg: 'rgba(255,255,255,0.6)', z: 1, d };
      this.ava(m, i, x + 24, y + 24, 76, 22, d);
      m['nm' + i] = { t: 'txt nm', x: x + 114, y: y + 30, w: 220, fs: 22, html: `<b>${P[i][0]}</b><span style="color:#2E67D7;font-family:'Nekst SemiBold'">${P[i][2]}</span>`, z: 2, d: d + 40 };
      m['rl' + i] = { t: 'txt', x: x + 24, y: y + 114, w: 300, fs: 17, c: '#5B6270', html: P[i][1], z: 2, d: d + 80 };
      const n = Z[i].length, top = y + 172, H = 792 - 172 - 14, ih = (H - (n - 1) * 8) / n;
      Z[i].forEach(([t, tag], j) => {
        const blue = tag === 'p', grad = tag && tag !== 'p';
        m[`z${i}${j}`] = { t: 'fill zi', x: x + 14, y: top + j * (ih + 8), w: 320, h: ih, r: 24, bg: blue ? '#2A36A5' : grad ? '#3346C8' : 'rgba(255,255,255,0.8)', c: blue || grad ? '#FFFFFF' : '#1E1E1E', z: 2, d: d + 180 + j * 70,
          html: (blue ? '<i style="background:#fff;color:#2A36A5">Партнёр по вопросам развития</i>' : grad ? `<i style="background:#fff;color:#2A36A5">с ${tag}</i>` : '') + `<div>${t}</div>` };
      });
    }
    return m;
  }
  sProt() {
    const m = this.hdr(1, {});
    m.ttl = { t: 'txt nk', x: 56, y: 146, w: 1100, fs: 60, c: '#1E1E1E', html: 'Защищенность позиций', z: 2 };
    m.sum = { x: 1264, y: 132, w: 600, h: 86, r: 24, z: 2, d: 200, html: `<div style="padding:16px 22px;display:flex;flex-direction:column;gap:12px"><div style="display:flex;height:14px;gap:4px"><i style="flex:1;border-radius:7px;background:${GOOD}"></i><i style="flex:4;border-radius:7px;background:${MID}"></i><i style="flex:4;border-radius:7px;background:${WARN}"></i></div><div style="display:flex;gap:24px;font-size:16px;color:#5B6270">${[['Высокий', GOOD, 1], ['Средний', MID, 4], ['Низкий', WARN, 4]].map(([l, c, n]) => `<span style="display:flex;align-items:center;gap:8px"><i style="width:10px;height:10px;border-radius:5px;background:${c}"></i>${l}<b style="color:#1E1E1E">${n}</b></span>`).join('')}</div></div>` };
    const X = [76, 512, 608, 924, 1110, 1408, 1544];
    const H = ['ФИО, должность в&nbsp;текущей структуре', 'Грейд', 'Изменения с&nbsp;01.01.2027', 'Уровень защищенности', 'Преемник', 'Срок готовности резерва', 'Оперативный резерв'];
    m.thd = { t: 'txt', x: 0, y: 236, w: 1920, h: 40, z: 2, html: H.map((t, k) => `<span style="position:absolute;left:${X[k]}px;width:${k === 5 ? 120 : 300}px;font-size:14px;font-weight:700;color:#5B6270;line-height:1.2">${t}</span>`).join('') };
    PR.forEach((r, i) => {
      const y = 282 + i * 80, d = i * 40, [bg, ink] = PROT[r[4]];
      m['card' + (r[8] < 0 ? 'x' : r[8])] = { x: 56, y, w: 1808, h: 72, r: 22, bg: 'rgba(255,255,255,0.6)', z: 1, d };
      if (r[8] >= 0) this.ava(m, r[8], 76, y + 10, 52, 16, d);
      else m.phx = { t: 'ava', x: 76, y: y + 10, w: 52, h: 52, r: 14, fs: 18, html: 'КС', z: 2, d };
      m['nm' + (r[8] < 0 ? 'x' : r[8])] = { t: 'txt', x: 142, y: y + 15, w: 360, z: 2, d, html: `<div style="font-size:17px;font-weight:700;line-height:1.2">${r[0]}</div><div style="font-size:14px;line-height:1.2;color:#5B6270">${r[1]}</div>` };
      m['pg' + i] = { t: 'txt nk', x: X[1], y: y + 26, w: 80, fs: 20, c: '#2A36A5', html: r[3], z: 2, d: d + 60 };
      m['pc' + i] = { t: 'txt t14', x: X[2], y: y + 12, w: 300, h: 48, c: '#2A36A5', html: r[2], z: 2, d: d + 80 };
      m['st' + i] = { t: 'pill', x: X[3], y: y + 18, w: 120, h: 36, r: 14, bg, c: ink, fs: 16, html: r[4], z: 2, d: 300 + i * 50 };
      m['ps' + i] = { t: 'txt t14', x: X[4], y: y + 8, w: 282, h: 56, html: r[5], z: 2, d: d + 120 };
      m['pt' + i] = { t: 'txt t16', x: X[5], y: y + 26, w: 120, html: r[6], z: 2, d: d + 140 };
      m['pr' + i] = { t: 'txt t14', x: X[6], y: y + 8, w: 300, h: 56, html: r[7], z: 2, d: d + 160 };
    });
    m.fn = { t: 'txt', x: 76, y: 1008, w: 1500, fs: 14, c: '#5B6270', html: '* С&nbsp;01.01.2027 позиция «советник» сокращается&nbsp;— ставка используется как резерв на&nbsp;руководящую позицию', z: 2, d: 500 };
    return m;
  }
  sDept() {
    const m = this.hdr(2, {});
    m.ttl = { t: 'txt nk', x: 500, y: 154, w: 1364, fs: 40, c: '#1E1E1E', html: '<span style="color:#776CF6;font-size:.5em;margin-right:18px">01</span>Профессиональное обучение и рабочие компетенции', z: 2 };
    m.card0 = { x: 56, y: 132, w: 420, h: 318, r: 40, bg: '#2A36A5', z: 1 };
    this.ava(m, 0, 84, 160, 120, 24); m.ph0.bg = '#FFFFFF';
    m.gr0 = { t: 'pill nk', x: 384, y: 160, w: 64, h: 36, r: 16, bg: '#FFFFFF', c: '#2A36A5', fs: 18, html: 'L19', z: 3 };
    m.nm0 = { t: 'txt nm', x: 84, y: 306, w: 360, fs: 26, c: '#FFFFFF', html: `<b>${P[0][0]}</b><span style="color:#C2E5FF">${P[0][1]}</span>`, z: 2, d: 100 };
    const G = [['L17', 1], ['L16', 3], ['L15', 7], ['L14', 3], ['L13', 33], ['L11', 2]];
    m.grc = { x: 56, y: 466, w: 420, h: 566, r: 40, z: 1, d: 120, html: `<div style="padding:24px 28px"><div style="display:flex;justify-content:space-between;align-items:baseline"><span class="lab" style="font-size:16px">Команда, ШЕ</span><span class="nk" style="font-size:46px;color:#2A36A5">49</span></div>${G.map(([g, v], k) => `<div style="position:absolute;left:28px;right:28px;top:${112 + k * 72}px;display:flex;justify-content:space-between;font-family:'Nekst Medium';font-size:18px"><span>${g}</span><span style="color:#2A36A5">${v}</span></div>`).join('')}</div>` };
    G.forEach(([g, v], k) => { m['gb' + k] = { t: 'fill', x: 84, y: 466 + 144 + k * 72, w: Math.max(10, 364 * v / 33), h: 12, r: 6, bg: '#2E67D7', z: 2, d: 350 + k * 60 }; });
    const unit = u => `<div class="unit"><div class="un"><span>${u[0]}</span><span style="color:#2A36A5">${u[1]} ШЕ</span></div><div class="cs">${chips(u[2])}</div>${u[3].map(r => `<div class="rr"><div><b>${r[0]}</b><span>${r[1]}</span></div><em>${r[2]}</em></div>`).join('')}</div>`;
    const B = [
      ['Преподаватели и методисты', '27', 666, [['Учебный отдел (Север)', '21', ['L16 1', 'L14 1', 'L13 19'], [['Руководитель отдела', 'L16', 1], ['Преподаватели и специалисты', 'L13', 13], ['Методисты', 'L14 1, L13 6', 7]]], ['Учебный отдел (Запад)', '6', ['L16 1', 'L15 1', 'L13 4'], [['Руководитель отдела', 'L16', 1], ['Теоретическая подготовка', 'L13', 3], ['Методическая экспертиза', 'L15 1, L13 1', 2]]]]],
      ['Тренажерные центры', '12', 333, [['Отдел практической подготовки', '12', ['L16 1', 'L14 2', 'L13 9'], [['Руководитель отдела', 'L16', 1], ['Учебный полигон', 'L14 1, L13 4', 5], ['Тренажерный центр', 'L14 1, L13 5', 6]]]]],
      ['Оценка и развитие компетенций', '10', 333, [['Отдел оценки и развития', '10', ['L17 1', 'L15 6', 'L13 1', 'L11 2'], [['Руководитель отдела', 'L17', 1], ['Оценка компетенций', 'L15 5', 5], ['Развитие компетенций', 'L15 1, L13 1, L11 2', 4]]]]]
    ];
    let bx = 500;
    B.forEach(([t, n, bw, units], k) => {
      m['b' + k] = { t: 'glass blk', x: bx, y: 232, w: bw, h: 800, r: 40, z: 1, d: 180 + k * 90, html: `<div class="hd"><b>${t}</b><em>${n}<small>ШЕ</small></em></div><div style="display:grid;grid-template-columns:repeat(${units.length},minmax(0,1fr));gap:12px">${units.map(unit).join('')}</div>` };
      bx += bw + 16;
    });
    return m;
  }
  sProfile(k) {
    const p = PROF[k], i = p.i, m = this.hdr(k === 2 ? 6 : 2 + k, {});
    m.lp = { x: 56, y: 132, w: 330, h: 900, r: 40, z: 1 };
    this.ava(m, i, 80, 156, 180, 32);
    m.lpi = { t: 'txt', x: 80, y: 360, w: 282, z: 2, d: 120, html: `<div class="lab" style="font-size:15px">Должность</div><div style="font-size:21px;font-weight:700;color:#2A36A5;line-height:1.25;margin:4px 0 20px">${p.role}</div><div class="lab" style="font-size:15px">Подразделение</div><div style="font-size:19px;line-height:1.3;margin:4px 0 18px">${p.unit}</div><div class="kv"><span>Возраст</span><b>${p.age}</b></div><div class="kv"><span>Стаж в&nbsp;компании</span><b>${p.ten}</b></div><div class="kv" style="margin-bottom:18px"><span>В&nbsp;должности</span><b>${p.inr}</b></div><div class="lab" style="font-size:15px;margin-bottom:6px">Образование</div>${p.edu.map(e => `<div style="font-size:${p.edu.length > 1 ? 14 : 16}px;line-height:1.35;margin-bottom:6px">${e}</div>`).join('')}` };
    m.pname = { t: 'txt nk', x: 404, y: 150, w: 800, fs: 46, html: p.name, z: 2 };
    [['Уровень защищенности', 'up'], ['Общий балл потенциала', 'up'], ['Риск ухода', 'risk'], ['Мобильность', 'up']].forEach(([l, tk], j) => {
      const v = p.ind[j], c = TONE[tk][LV[v]];
      m['ind' + j] = { x: 1234 + j * 160, y: 132, w: 150, h: 110, r: 22, z: 2, d: 120 + j * 60, html: `<div style="padding:12px 16px 14px;display:flex;flex-direction:column;gap:8px"><div class="lab" style="font-size:13px;min-height:32px">${l}</div><div class="nk" style="font-size:24px;color:${INK[c]}">${v}</div>${segs(v, tk)}</div>` };
    });
    const tr = v => { const l = v === 'Высокая' ? 3 : v === 'Средняя' ? 2 : 1, s = [null, ['#FBE7D3', '#B86E22'], ['#E3ECFA', '#2A36A5'], ['#DDF2E1', '#23853A']][l]; return `<span style="padding:4px 12px;border-radius:10px;background:${s[0]};color:${s[1]};font-size:15px;font-weight:700">${v}</span>`; };
    const roles = ['Руководитель', 'Коллеги', 'Подчиненные'];
    m.c1 = { t: 'glass pnl', x: 404, y: 258, w: 363, h: 648, r: 32, z: 2, d: 180, html: `<div class="h">Результаты оценки</div><div style="display:flex;flex-direction:column;gap:10px;margin:12px 0 16px"><div><div class="lab">Категория, рекомендуемая руководителем</div><div style="font-size:19px;font-weight:700">${p.catRec}</div></div><div><div class="lab">Текущая категория</div><div style="font-size:19px;font-weight:700">${p.catCur}</div></div></div>
      <div style="padding:14px 18px 16px;border-radius:22px;background:linear-gradient(135deg,#2A36A5,#3346C8 45%,#4F5FE6 75%,#2E67D7);color:#fff;display:flex;flex-direction:column;gap:8px"><div style="font-size:14px;color:#C2E5FF">Индивидуальный КПЭ в&nbsp;2025 году</div><div class="nk" style="font-size:40px">${p.kpi}</div><div style="position:relative;height:6px;border-radius:3px;background:rgba(255,255,255,.25)"><div style="position:absolute;left:0;top:0;bottom:0;width:${(p.kn / 120 * 100).toFixed(1)}%;border-radius:3px;background:#fff"></div><div style="position:absolute;left:83.3%;top:-4px;width:2px;height:14px;background:#fff"></div></div></div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:16px"><div class="lab">Итоговый балл 360° / оценка по&nbsp;ценностям</div><div style="font-size:19px;font-weight:700">${p.s360}</div>${p.r360.map((r, q) => `<div style="display:grid;grid-template-columns:100px 78px 1fr;align-items:center;gap:8px"><span class="lab">${roles[q]}</span><span style="font-family:'Nekst Medium';font-size:16px">${r[0]} / ${r[1]}</span><span style="position:relative;height:6px;border-radius:3px;background:${OFF}"><span style="position:absolute;left:0;top:0;bottom:0;width:${r[1]}%;border-radius:3px;background:${MID}"></span></span></div>`).join('')}</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:16px"><div class="lab">Склонность к&nbsp;карьерной траектории</div>${['Управленческая', 'Проектная', 'Экспертная'].map((l, q) => `<div style="display:flex;justify-content:space-between;align-items:center;font-size:16px">${l}${tr(p.traj[q])}</div>`).join('')}</div>` };
    const rows = (a, fs) => a.map(t => `<div class="row" style="font-size:${fs}px">${t}</div>`).join('');
    m.c2a = { t: 'glass pnl', x: 783, y: 258, w: 389, h: 214, r: 32, z: 2, d: 240, html: `<div class="h" style="margin-bottom:10px">Рекомендация руководителя</div><div style="display:flex;flex-direction:column;gap:5px">${rows(p.rec, 15)}</div>` };
    m.c2b = { t: 'fill pnl', x: 783, y: 486, w: 389, h: 224, r: 32, bg: '#2A36A5', c: '#FFFFFF', z: 2, d: 300, html: `<div class="h" style="color:#fff">Потенциальная позиция</div><div style="font-size:14px;color:#C2E5FF;margin-top:12px">Новая должность</div><div style="font-family:'Nekst Medium';font-size:19px;line-height:1.2;margin-top:4px">${p.pos}</div><div style="margin-top:auto;display:grid;grid-template-columns:1fr 1fr;gap:6px"><div style="padding:8px 12px;border-radius:14px;background:rgba(255,255,255,.14)"><div style="font-size:13px;color:#C2E5FF">Тип продвижения</div><b style="font-size:15px">${p.pt}</b></div><div style="padding:8px 12px;border-radius:14px;background:rgba(255,255,255,.14)"><div style="font-size:13px;color:#C2E5FF">Готовность</div><b style="font-size:15px">${p.pr}</b></div></div>` };
    m.c2c = { t: 'glass pnl', x: 783, y: 724, w: 389, h: 182, r: 32, z: 2, d: 360, html: `<div class="h" style="margin-bottom:10px">Решение предыдущего КК</div><div style="display:flex;flex-direction:column;gap:5px">${rows(p.prev, p.prev.length > 2 ? 13 : 15)}</div>` };
    m.resv = { x: 404, y: 922, w: 768, h: 110, r: 32, z: 2, d: 420, html: `<div style="height:100%;display:flex;align-items:center;gap:18px;padding:0 14px 0 24px"><div style="font-family:'Nekst Medium';font-size:22px;color:#2A36A5;width:84px;flex:none">Резерв</div><div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:10px">${p.res.map(([a, b, c]) => `<div style="padding:8px 14px;border-radius:16px;background:rgba(255,255,255,.75)"><div style="font-size:15px;font-weight:700;line-height:1.2">${a}</div><div style="font-size:13px;color:#5B6270">${b}, <b style="color:#2A36A5">${c}</b></div></div>`).join('')}</div></div>` };
    const sec = (t, items) => `<div style="display:flex;flex-direction:column;gap:6px"><div class="lab" style="padding-bottom:4px;border-bottom:1px solid rgba(42,54,165,.12)">${t}</div>${items.map(it => `<div style="display:flex;gap:10px;align-items:flex-start">${items.length > 1 ? '<i style="flex:none;width:6px;height:6px;margin-top:7px;border-radius:3px;background:#2E67D7"></i>' : ''}<div style="font-size:14.5px;line-height:1.38">${it}</div></div>`).join('')}</div>`;
    const ink = v => v === 'Выполнен' ? '#23853A' : v === 'Сформирован' ? '#2A36A5' : '#B86E22';
    m.c3 = { t: 'glass pnl', x: 1188, y: 258, w: 676, h: 774, r: 36, z: 2, d: 300, html: `<div style="display:flex;flex-direction:column;gap:14px;height:100%"><div class="h" style="font-size:24px">Дополнительная информация</div>${sec('Сильные компетенции', p.strong.map(([a, b]) => `<b style="color:#2A36A5">${a}: </b>${b}`))}${sec('Направления развития', p.dev.map(([a, b]) => `<b style="color:#2A36A5">${a}: </b>${b}`))}${sec('Карьерные ожидания', p.career)}${sec('Достижения в&nbsp;работе за&nbsp;последний год', p.ach)}${sec('Комментарий руководителя', [p.comment])}<div style="margin-top:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${[['ИПР прошлого года', p.ipr[0], ink(p.ipr[0])], ['ИПР текущего года', p.ipr[1], ink(p.ipr[1])], ['Вовлеченность команды', p.eng, '#1E1E1E']].map(([a, b, c]) => `<div style="padding:10px 14px;border-radius:16px;background:rgba(255,255,255,.75)"><div class="lab" style="font-size:13px">${a}</div><div style="font-size:16px;font-weight:700;color:${c}">${b}</div></div>`).join('')}</div></div>` };
    return m;
  }
  async loop() {
    this.pr(-1); this.cam('enter', { instant: true });
    this.show(this.sTitle()); await this.w(100); this.cam('wide', { dur: 1.3 }); await this.w(2300);
    this.pr(1); this.cam('front'); this.show(this.sOrg()); await this.w(2600);
    this.cam('right'); this.show(this.sZones()); await this.w(2600);
    this.pr(0); this.cam('zoom', { x: 1380, y: 76, k: 2.3, rx: 6, ry: -8 }); await this.w(1200);
    this.show(this.sProt()); await this.w(1700);
    this.pr(3); this.cam('zoom', { x: 1000, y: 560, k: 1.75, rx: 4, ry: 8 }); await this.w(2600);
    this.pr(2); this.cam('front'); this.show(this.sProfile(0)); await this.w(2400);
    this.cam('zoom', { x: 960, y: 560, k: 1.12, rx: 3, ry: -10 }); this.show(this.sProfile(1)); await this.w(2200);
    this.cam('zoom', { x: 960, y: 560, k: 1.12, rx: 3, ry: 10 }); this.show(this.sProfile(2)); await this.w(1800);
    this.pr(3); this.cam('zoom', { x: 1550, y: 190, k: 2.4, rx: 6, ry: -6 }); await this.w(2300);
    this.pr(-1); this.cam('exit', { dur: 1 }); await this.w(900);
  }
}
customElements.define('original-deck-reel', DeckReel);
})();
