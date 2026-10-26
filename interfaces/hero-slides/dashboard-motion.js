(function () {
if (customElements.get('dash-reel')) return;
if (!document.querySelector('link[data-golos]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.dataset.golos = ''; l.href = 'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&display=swap'; document.head.appendChild(l); }
const EZ = 'cubic-bezier(.76,0,.18,1)', OUT = 'cubic-bezier(.16,1,.3,1)';
const BLUE = '#4361EE', YEL = '#FFB627', PUR = '#9B5CFF', GRN = '#22B26A', RED = '#EF5050', INK = '#14162B', MUT = '#6B7090', LINE = 'rgba(20,22,43,.08)';
const W = 1640, H = 1000;
const CSS = `
:host{display:block;position:relative;width:100%;height:100%;overflow:hidden;background:#121212;font-family:'Golos Text',Manrope,system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
.stage{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;perspective:2600px;perspective-origin:50% 40%}
.glow{position:absolute;left:960px;top:560px;width:1700px;height:1200px;margin:-600px 0 0 -850px;border-radius:50%;background:radial-gradient(closest-side,rgba(67,97,238,.26),rgba(155,92,255,.06) 60%,transparent)}
.win{position:absolute;left:${(1920 - W) / 2}px;top:${(1080 - H) / 2}px;width:${W}px;height:${H}px;border-radius:30px;overflow:hidden;display:grid;grid-template-columns:220px 1fr;box-shadow:0 60px 140px rgba(0,0,0,.55),inset 0 0 0 1px rgba(255,255,255,.5);transform-origin:50% 50%;transition:transform 1.2s ${EZ};
  background:radial-gradient(520px 420px at 88% 8%,rgba(67,97,238,.55),transparent 70%),radial-gradient(560px 480px at 8% 96%,rgba(155,92,255,.42),transparent 70%),radial-gradient(520px 420px at 62% 78%,rgba(255,182,39,.42),transparent 70%),radial-gradient(420px 360px at 36% 30%,rgba(120,210,255,.4),transparent 70%),#E6E9F6}
.glass{background:linear-gradient(135deg,rgba(255,255,255,.72),rgba(255,255,255,.42));backdrop-filter:blur(26px) saturate(170%);-webkit-backdrop-filter:blur(26px) saturate(170%);border:1px solid rgba(255,255,255,.75);box-shadow:0 10px 30px rgba(40,48,110,.10),inset 0 1px 0 rgba(255,255,255,.9)}
.side{margin:14px 0 14px 14px;border-radius:22px;padding:22px 14px;display:flex;flex-direction:column;gap:4px}
.logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:19px;color:${INK};margin:0 6px 22px}
.logo i{width:28px;height:28px;border-radius:9px;background:linear-gradient(135deg,${BLUE},${PUR})}
.nav{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;font-size:14px;font-weight:500;color:#4A4E68;transition:background .4s,color .4s}
.nav b{width:14px;height:14px;border-radius:4px;border:2px solid currentColor;opacity:.7}
.nav em{margin-left:auto;font-style:normal;font-size:11px;font-weight:700;padding:2px 7px;border-radius:7px;background:rgba(67,97,238,.12);color:${BLUE}}
.nav.act{background:rgba(255,255,255,.9);color:${BLUE};font-weight:600;box-shadow:0 4px 14px rgba(67,97,238,.15)}
.sep{height:1px;background:${LINE};margin:10px 6px}
.upd{margin-top:auto;padding:12px;border-radius:14px;background:rgba(255,255,255,.6);font-size:12px;color:${MUT};line-height:1.4}.upd b{display:block;color:${INK};font-size:13px}
.main{padding:14px 14px 14px 14px;display:flex;flex-direction:column;gap:12px;min-width:0}
.top{display:flex;align-items:center;gap:12px;height:56px;padding:0 10px 0 20px;border-radius:18px}
.top h1{font-size:24px;font-weight:700;color:${INK};letter-spacing:-.02em;white-space:nowrap}
.chip{padding:7px 12px;border-radius:10px;background:rgba(255,255,255,.7);font-size:12px;font-weight:600;color:#4A4E68;white-space:nowrap}
.chip.on{background:${INK};color:#fff}
.btn{margin-left:auto;padding:9px 16px;border-radius:11px;background:${BLUE};color:#fff;font-size:13px;font-weight:600;white-space:nowrap}
.av{width:36px;height:36px;border-radius:50%;background:#fff;color:${BLUE};display:grid;place-items:center;font-size:13px;font-weight:700}
.g{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}
.c{border-radius:18px;padding:16px 18px;position:relative;overflow:hidden}
.k{display:flex;flex-direction:column}
.k .l{font-size:12.5px;font-weight:600;color:${MUT};white-space:nowrap}
.k .v{font-size:30px;font-weight:700;letter-spacing:-.03em;color:${INK};margin-top:4px;line-height:1}
.k .s{margin-top:auto;font-size:11px;color:${MUT};display:flex;gap:5px;align-items:center;white-space:nowrap}.k .s b{font-weight:700;padding:2px 6px;border-radius:6px}
.k svg{position:absolute;right:14px;top:16px}
.k svg path{fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.4s ${EZ} .3s}
.k.on svg path{stroke-dashoffset:0}
.ct{font-size:14px;font-weight:700;color:${INK}}
.cs{font-size:11.5px;color:${MUT};margin-top:2px}
.leg{display:flex;flex-direction:column;gap:5px;font-size:11.5px;color:${MUT}}.leg span{display:flex;align-items:center;gap:7px;white-space:nowrap}.leg i{width:9px;height:9px;border-radius:3px;flex:none}.leg b{color:${INK};font-weight:700}
.an{opacity:0;transform:translateY(40px) scale(.97);transition:opacity .5s,transform .8s ${OUT}}
.an.on{opacity:1;transform:none}
.an.off{opacity:0;transform:translateY(-24px);transition:opacity .3s,transform .45s ${EZ}}
.bars{display:flex;align-items:flex-end;gap:18px;height:190px;margin-top:16px;padding-left:30px;position:relative}
.bars .grid{position:absolute;left:30px;right:0;height:1px;background:${LINE}}
.bars .yl{position:absolute;left:0;font-size:10.5px;color:${MUT};transform:translateY(50%)}
.bc{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end;position:relative;z-index:1}
.bp{display:flex;gap:5px;align-items:flex-end;height:100%}
.bp i{display:block;width:16px;border-radius:8px 8px 3px 3px;height:0;transition:height 1s ${OUT}}
.bp i:nth-child(1){background:linear-gradient(180deg,#6F86FF,${BLUE})}.bp i:nth-child(2){background:rgba(67,97,238,.22)}.bp i:nth-child(3){background:linear-gradient(180deg,#FFD27A,${YEL})}
.bc small{font-size:10.5px;color:${MUT};position:absolute;bottom:-20px}
.ring{position:relative;flex:none}
.ring svg{display:block;transform:rotate(-90deg)}
.ring circle{fill:none;transition:stroke-dashoffset 1.4s ${OUT}}
.ring .t{position:absolute;inset:0;display:grid;place-items:center;font-weight:700;color:${INK}}
.tbl .hd,.tbl .r{display:grid;grid-template-columns:1.9fr .8fr .7fr .9fr 1fr;align-items:center;gap:8px}
.tbl .hd{font-size:11px;color:${MUT};padding:10px 12px 6px;font-weight:600}
.tbl .r{padding:8px 12px;border-radius:11px;font-size:13px;color:${INK};margin-bottom:5px;background:rgba(255,255,255,.62);opacity:0;transform:translateX(40px);transition:opacity .45s,transform .7s ${OUT}}
.tbl .r.on{opacity:1;transform:none}
.tbl .r b{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mb{position:relative;height:6px;border-radius:3px;background:rgba(20,22,43,.08)}.mb i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;width:0;transition:width 1s ${OUT} .2s}
.tbl .r.on .mb i,.an.on .mb i{width:var(--w)}
.st{justify-self:start;padding:3px 9px;border-radius:7px;font-size:11px;font-weight:700}
.lnw{position:relative;margin-top:10px}
.lnw path{fill:none;stroke-linecap:round;stroke-linejoin:round}
.lnw .ln{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.8s ${EZ}}
.lnw .ar{opacity:0;transition:opacity 1s .6s}
.age{display:flex;flex-direction:column;gap:11px;margin-top:14px}
.age div{display:grid;grid-template-columns:44px 1fr 34px;align-items:center;gap:8px;font-size:11.5px;color:${MUT}}.age b{color:${INK};text-align:right}
.fn{display:flex;flex-direction:column;gap:7px;margin-top:14px}
.fn div{position:relative;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font-size:12px;font-weight:600;color:#fff;overflow:hidden}
.fn div span{position:relative;z-index:1;white-space:nowrap}.fn div::before{content:"";position:absolute;inset:0;width:var(--w);border-radius:10px;background:var(--c)}
.fn div{background:rgba(255,255,255,.5);color:${INK}}
`;
const HIRE = [18, 22, 25, 19, 21, 19], FIRE = [9, 11, 12, 10, 12, 11], VAC = [14, 12, 16, 11, 9, 8], MON = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
const TURN = [1.4, 2.9, 4.6, 6.2, 7.9, 9.3], PLAN = [1.9, 3.7, 5.6, 7.5, 9.3, 11.2];
const DEP = [['Маркетинг и коммуникации', '14,2%', 14.2, '9', 'Выше плана', RED, '#FDE6E6'], ['Операционная поддержка', '12,9%', 12.9, '8', 'Внимание', '#C98A00', '#FFF3D6'], ['Проектный офис', '11,8%', 11.8, '7', 'Внимание', '#C98A00', '#FFF3D6'], ['Цифровые сервисы', '9,6%', 9.6, '6', 'В норме', GRN, '#E2F6EB'], ['HR и правовое', '7,4%', 7.4, '4', 'В норме', GRN, '#E2F6EB'], ['Финансы и закупки', '6,1%', 6.1, '3', 'В норме', GRN, '#E2F6EB']];
const ring = (id, size, sw, pct, color, label, fs, track) => { const r = (size - sw) / 2, c = 2 * Math.PI * r; return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${track || 'rgba(20,22,43,.08)'}" stroke-width="${sw}"></circle><circle data-ring="${id}" data-c="${c}" data-p="${pct}" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}"></circle></svg><div class="t" style="font-size:${fs}px">${label}</div></div>`; };
function linePath(arr, w, h, max, min = 0) { return arr.map((v, i) => `${i ? 'L' : 'M'}${(i / (arr.length - 1) * w).toFixed(1)},${(h - (v - min) / (max - min) * h).toFixed(1)}`).join(' '); }
const kpi = (l, v, dec, s, up, sp, col, suf = '') => { const mx = Math.max(...sp), mn = Math.min(...sp); return `<div class="c k glass an" data-g="1"><svg width="64" height="26" viewBox="-2 -2 68 30"><path pathLength="1" d="${linePath(sp, 64, 26, mx, mn)}" stroke="${col}"></path></svg><div class="l">${l}</div><div class="v" data-n="${v}" data-dec="${dec}" data-suf="${suf}">0</div><div class="s"><b style="color:${up ? GRN : RED};background:${up ? '#E2F6EB' : '#FDE6E6'}">${up ? '↑' : '↓'} ${s}</b>к маю</div></div>`; };

const dashActivity = window.InterfaceActivity || {
  observe(element, onChange) {
    let inZone = true, externallyPaused = false, active;
    const update = () => { const next = inZone && !externallyPaused && !document.hidden; if (next === active) return; active = next; onChange(next); };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(es => { inZone = es.some(e => e.isIntersecting); update(); }, { root: null, rootMargin: '300px 0px', threshold: 0 }) : null;
    observer ? observer.observe(element) : update();
    const onVisibility = () => update(); document.addEventListener('visibilitychange', onVisibility);
    return { setExternallyPaused(v) { externallyPaused = Boolean(v); update(); }, disconnect() { observer && observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); } };
  }
};

class DashReel extends HTMLElement {
  static get observedAttributes() { return ['speed']; }
  set speed(v) { this._speed = parseFloat(v) || 1; } get speed() { return this._speed || 1; }
  set visible(v) { this.setExternalPaused(!v); } get visible() { return this._running; }
  attributeChangedCallback(n, o, v) { if (n === 'speed') this._speed = parseFloat(v) || 1; }
  connectedCallback() { if (!this.shadowRoot) this.attachShadow({ mode: 'open' }); setTimeout(() => { if (this.isConnected && !this._built) this.build(); }, 0); }
  disconnectedCallback() { this._built = false; this.gen = (this.gen || 0) + 1; cancelAnimationFrame(this._raf); this._ro && this._ro.disconnect(); this._activity && this._activity.disconnect(); this.shadowRoot.innerHTML = ''; }
  build() {
    this._built = true; this.gen = (this.gen || 0) + 1;
    const lw = 410, lh = 300;
    this.shadowRoot.innerHTML = `<style>${CSS}</style><div class="stage"><div class="glow"></div><div class="win">
      <aside class="side glass an" data-g="0"><div class="logo"><i></i>HR-аналитика</div>
        <div class="nav act" data-nav="0"><b></b>Кадровый состав</div><div class="nav" data-nav="1"><b></b>Текучесть<em>6</em></div><div class="nav" data-nav="2"><b></b>Подбор<em>42</em></div><div class="nav" data-nav="3"><b></b>Фонд оплаты труда</div><div class="nav" data-nav="4"><b></b>Обучение</div><div class="nav" data-nav="5"><b></b>Вовлеченность</div>
        <div class="sep"></div><div class="nav"><b></b>Загрузка данных</div><div class="nav"><b></b>Настройки</div>
        <div class="upd"><b>Данные обновлены</b>30.06.2026, 09:00<br>источник: 1С ЗУП</div></aside>
      <div class="main">
        <div class="top glass an" data-g="0"><h1>Ключевые показатели по персоналу</h1><span class="chip on">Январь — июнь 2026</span><span class="chip">Все подразделения</span><span class="chip">Сравнить с 2025</span><span class="btn">Загрузить Excel</span><span class="av">HR</span></div>
        <div class="g" style="height:118px">
          ${kpi('Занятые ставки', 716, 0, '1,8%', 1, [690, 694, 701, 698, 706, 716], BLUE)}${kpi('Всего ставок', 953.7, 1, '0,4%', 1, [948, 949, 951, 950, 952, 953.7], PUR)}${kpi('Среднесписочная', 699.8, 1, '2,1%', 1, [671, 680, 684, 690, 693, 699.8], BLUE)}
          ${kpi('Средний возраст', 35.9, 1, '0,3%', 0, [36.4, 36.3, 36.1, 36.2, 36, 35.9], YEL)}${kpi('Открытые вакансии', 42, 0, '6,5%', 0, [58, 55, 61, 52, 45, 42], RED)}${kpi('ФОТ, млн ₽', 412.6, 1, '3,2%', 1, [380, 386, 392, 398, 405, 412.6], GRN)}
        </div>
        <div class="g" style="height:300px">
          <div class="c glass an" data-g="2" style="grid-column:span 3"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div class="ct">Прием, увольнения и вакансии</div><div class="cs">человек в месяц</div></div><div class="leg" style="flex-direction:row;gap:14px"><span><i style="background:${BLUE}"></i>Принято <b>124</b></span><span><i style="background:rgba(67,97,238,.22)"></i>Уволено <b>65</b></span><span><i style="background:${YEL}"></i>Вакансии</span></div></div>
            <div class="bars">${[0, 10, 20, 30].map(v => `<i class="grid" style="bottom:${v / 30 * 100}%"></i><span class="yl" style="bottom:${v / 30 * 100}%">${v}</span>`).join('')}${MON.map((m, i) => `<div class="bc"><div class="bp"><i data-h="${HIRE[i] / 30 * 100}" data-k="${i}"></i><i data-h="${FIRE[i] / 30 * 100}" data-k="${i}"></i><i data-h="${VAC[i] / 30 * 100}" data-k="${i}"></i></div><small>${m}</small></div>`).join('')}</div></div>
          <div class="c glass an" data-g="2" style="display:flex;flex-direction:column;align-items:flex-start"><div class="ct">Укомплектованность</div><div class="cs">июнь 2026</div><div style="align-self:center;margin:14px 0 12px">${ring('a', 128, 18, .751, YEL, '75,1%', 22)}</div><div class="leg"><span><i style="background:${YEL}"></i><b>716</b> занято</span><span><i style="background:rgba(20,22,43,.12)"></i><b>238</b> свободно</span></div></div>
          <div class="c glass an" data-g="2" style="display:flex;flex-direction:column;align-items:flex-start"><div class="ct">Гендерный состав</div><div class="cs">458 человек</div><div style="align-self:center;margin:14px 0 12px">${ring('b', 128, 18, .64, BLUE, '64%', 22, '#A9B8F8')}</div><div class="leg"><span><i style="background:${BLUE}"></i><b>293</b> женщины</span><span><i style="background:#A9B8F8"></i><b>165</b> мужчины</span></div></div>
          <div style="display:flex;flex-direction:column;gap:12px;min-height:0">
            <div class="c glass an" data-g="2" style="flex:1;display:flex;flex-direction:column"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div class="cs" style="margin:0;font-weight:600">Общая текучесть</div>${ring('c', 46, 6, .413, PUR, '', 11)}</div><div style="margin-top:auto;font-size:28px;font-weight:700;letter-spacing:-.03em;color:${INK};line-height:1" data-n="9.3" data-dec="1" data-suf="%">0</div><div class="cs">план на год 22,4%</div></div>
            <div class="c glass an" data-g="2" style="flex:1;display:flex;flex-direction:column"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div class="cs" style="margin:0;font-weight:600">Текучесть новичков</div>${ring('d', 46, 6, .13, GRN, '', 11)}</div><div style="margin-top:auto;font-size:28px;font-weight:700;letter-spacing:-.03em;color:${INK};line-height:1" data-n="2.9" data-dec="1" data-suf="%">0</div><div class="cs">план на год 22,2%</div></div>
          </div>
        </div>
        <div class="g" style="flex:1;min-height:0">
          <div class="c glass an" data-g="3" style="grid-column:span 2"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div class="ct">Текучесть нарастающим итогом</div><div class="cs">% от среднесписочной</div></div><div class="leg" style="flex-direction:row;gap:12px"><span><i style="background:${PUR}"></i>Факт</span><span><i style="background:#B9BED6"></i>План</span></div></div>
            <div class="lnw"><svg width="${lw}" height="${lh + 20}" viewBox="-10 -10 ${lw + 20} ${lh + 20}"><defs><linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PUR}" stop-opacity=".32"></stop><stop offset="1" stop-color="${PUR}" stop-opacity="0"></stop></linearGradient></defs>
              ${[0, 1, 2, 3].map(k => `<line x1="0" x2="${lw}" y1="${k * lh / 3}" y2="${k * lh / 3}" stroke="rgba(20,22,43,.07)"></line>`).join('')}
              <path class="ln" pathLength="1" d="${linePath(PLAN, lw, lh, 12)}" stroke="#B9BED6" stroke-width="3" stroke-dasharray="1"></path>
              <path class="ar" d="${linePath(TURN, lw, lh, 12)} L${lw},${lh} L0,${lh} Z" fill="url(#gf)" stroke="none"></path>
              <path class="ln" pathLength="1" d="${linePath(TURN, lw, lh, 12)}" stroke="${PUR}" stroke-width="4"></path>
              ${TURN.map((v, i) => `<circle class="ar" cx="${i / 5 * lw}" cy="${lh - v / 12 * lh}" r="5" fill="#fff" stroke="${PUR}" stroke-width="3"></circle>`).join('')}</svg></div></div>
          <div style="display:flex;flex-direction:column;gap:12px;min-height:0">
            <div class="c glass an" data-g="3" style="flex:1"><div class="ct">Возраст</div><div class="age">${[['до 25', 8], ['25–34', 38], ['35–44', 31], ['45–54', 16], ['55+', 7]].map(([a, v], i) => `<div><span>${a}</span><span class="mb"><i style="--w:${v / 38 * 100}%;background:${i === 1 ? BLUE : '#A9B8F8'}"></i></span><b>${v}%</b></div>`).join('')}</div></div>
            <div class="c glass an" data-g="3" style="flex:1"><div class="ct">Воронка подбора</div><div class="fn">${[['Отклики', '1 240', 100, '#A9B8F8'], ['Интервью', '318', 62, '#7C93FA'], ['Офферы', '131', 34, BLUE]].map(([a, b, w, c]) => `<div style="--w:${w}%;--c:${c}"><span style="color:${w > 50 ? '#fff' : INK}">${a}</span><span>${b}</span></div>`).join('')}</div></div>
          </div>
          <div class="c glass an tbl" data-g="3" style="grid-column:span 3;padding:16px 14px"><div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0 4px"><div><div class="ct">Текучесть по подразделениям</div><div class="cs">январь — июнь, сортировка по риску</div></div><span class="chip">6 из 14</span></div>
            <div class="hd"><span>Подразделение</span><span>Текучесть</span><span>Уволено</span><span>Динамика</span><span>Статус</span></div>
            ${DEP.map(d => `<div class="r"><b>${d[0]}</b><span style="font-weight:700">${d[1]}</span><span>${d[3]}</span><span class="mb"><i style="--w:${d[2] / 14.2 * 100}%;background:${d[5]}"></i></span><span class="st" style="color:${d[5]};background:${d[6]}">${d[4]}</span></div>`).join('')}</div>
        </div>
      </div></div></div>`;
    const R = this.shadowRoot; this.$ = s => R.querySelector(s); this.$$ = s => [...R.querySelectorAll(s)];
    this.stage = this.$('.stage'); this.win = this.$('.win');
    const fit = () => { const w = this.clientWidth, h = this.clientHeight; if (!w || !h) return; const s = Math.min(w / 1920, h / 1080); this.stage.style.transform = `translate(${(w - 1920 * s) / 2}px,${(h - 1080 * s) / 2}px) scale(${s})`; };
    this._ro = new ResizeObserver(fit); this._ro.observe(this); fit();
    this.clock = 0; this.waiters = []; this.counters = []; this._last = 0;
    this._tick = () => {
      const n = performance.now(), dt = Math.min(n - this._last, 100); this._last = n;
      this.clock += dt * this.speed;
      const due = this.waiters.filter(x => x.t <= this.clock); this.waiters = this.waiters.filter(x => x.t > this.clock); due.forEach(x => x.r());
      this.counters = this.counters.filter(c => { const p = Math.min(1, (this.clock - c.t0) / 1300), e = 1 - Math.pow(1 - p, 3); c.el.textContent = (c.to * e).toLocaleString('ru-RU', { minimumFractionDigits: c.dec, maximumFractionDigits: c.dec }) + c.suf; return p < 1; });
      if (this.heroLive) {
        const t=this.clock/1000;
        this.$$('[data-n]').forEach((el,i)=>{const base=+el.dataset.n,dec=+el.dataset.dec||0;const v=base*(1+.025*Math.sin(t*1.1+i*.65));el.textContent=v.toLocaleString('ru-RU',{minimumFractionDigits:dec,maximumFractionDigits:dec})+(el.dataset.suf||'')});
        this.$$('.bp i').forEach((el,i)=>{el.style.transition='none';el.style.height=(+el.dataset.h*(.83+.17*Math.sin(t*1.5+i*.6)))+'%'});
        this.$$('[data-ring]').forEach((el,i)=>{const p=+el.dataset.p+.018*Math.sin(t*1.2+i);el.style.strokeDashoffset=String(+el.dataset.c*(1-p))});
        this.$$('.ln,.ar').forEach((el,i)=>{const original=el.dataset.heroPath||(el.dataset.heroPath=el.getAttribute('d'));if(!original)return;let point=0;el.setAttribute('d',original.replace(/([ML])([\d.]+),([\d.]+)/g,(all,cmd,x,y)=>{const n=point++;return cmd+x+','+(+y+Math.sin(t*1.3+n*.8+i*.4)*7).toFixed(2)}))});
        this.$$('.k svg path').forEach((el,i)=>{const original=el.dataset.heroPath||(el.dataset.heroPath=el.getAttribute('d'));if(!original)return;let point=0;el.setAttribute('d',original.replace(/([ML])(-?[\d.]+),(-?[\d.]+)/g,(all,cmd,x,y)=>cmd+x+','+(+y+Math.sin(t*1.4+point++*.8+i)*2).toFixed(2)))});
      }
      this._raf = requestAnimationFrame(this._tick);
    };
    this._activity = dashActivity.observe(this, active => this._setRunning(active));
    const gen = this.gen;
    (async () => { await this.w(200); while (gen === this.gen) await this.loop(); })();
  }
  _setRunning(active) { if (this._running === active) return; this._running = active; if (!active) { cancelAnimationFrame(this._raf); this._raf = 0; return; } this._last = performance.now(); this._raf = requestAnimationFrame(this._tick); }
  setExternalPaused(paused) { this._activity && this._activity.setExternallyPaused(paused); }
  w(ms) { return new Promise(r => this.waiters.push({ t: this.clock + ms, r })); }
  cam(o, dur = 1.2, instant) {
    const k = o.k || 1, x = o.x ?? W / 2, y = o.y ?? H / 2;
    const t = `translate3d(${-k * (x - W / 2) + (o.tx || 0)}px,${-k * (y - H / 2) + (o.ty || 0)}px,${o.tz || 0}px) rotateX(${o.rx || 0}deg) rotateY(${o.ry || 0}deg) rotateZ(${o.rz || 0}deg) scale(${k})`;
    this.win.style.transition = instant ? 'none' : `transform ${dur}s ${EZ}`; this.win.style.transform = t; if (instant) this.win.offsetWidth;
  }
  async group(g, step = 110) {
    const els = this.$$(`.an[data-g="${g}"]`);
    for (const el of els) {
      el.classList.remove('off'); el.classList.add('on');
      el.querySelectorAll('[data-n]').forEach(n => this.counters.push({ el: n, to: +n.dataset.n, dec: +n.dataset.dec, suf: n.dataset.suf || '', t0: this.clock + 200 }));
      if (el.dataset.n) this.counters.push({ el, to: +el.dataset.n, dec: +el.dataset.dec, suf: el.dataset.suf || '', t0: this.clock + 200 });
      el.querySelectorAll('[data-ring]').forEach(c => setTimeout(() => c.style.strokeDashoffset = String(+c.dataset.c * (1 - +c.dataset.p)), 250));
      await this.w(step);
    }
  }
  bars() { this.$$('.bp i').forEach(b => { b.style.transitionDelay = (+b.dataset.k * 80) + 'ms'; b.style.height = b.dataset.h + '%'; }); }
  line() { this.$$('.ln').forEach(p => p.style.strokeDashoffset = '0'); this.$$('.ar').forEach(p => p.style.opacity = '1'); }
  async rows() { for (const r of this.$$('.tbl .r')) { r.classList.add('on'); await this.w(110); } }
  reset() {
    this.$$('.an').forEach(e => { e.classList.remove('on', 'off'); });
    this.$$('.tbl .r').forEach(r => r.classList.remove('on'));
    this.$$('.bp i').forEach(b => { b.style.transitionDelay = '0ms'; b.style.height = '0'; });
    this.$$('[data-ring]').forEach(c => c.style.strokeDashoffset = c.dataset.c);
    this.$$('.ln').forEach(p => p.style.strokeDashoffset = '1'); this.$$('.ar').forEach(p => p.style.opacity = '0');
    this.$$('[data-n]').forEach(n => n.textContent = '0');
    this.$$('[data-nav]').forEach((n, i) => n.classList.toggle('act', i === 0));
  }
  async loop() {
    if (!this.heroReady) {
      this.heroReady = true;
      await Promise.all([0,1,2,3].map(g=>this.group(g,25)));
      this.bars(); this.line(); await this.rows();
      this.heroLive=true;

    }
    await this.w(1000000);
  }

}
customElements.define('dash-reel', DashReel);
})();
