(function () {
if (customElements.get('case-reel')) return;
const FONT = '-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Helvetica Neue",Helvetica,Arial,sans-serif';
const THEMES = {
  rag: { bg: '#121212', accent: '#FFA41B', ui: 'oklch(0.56 0.21 268)', name: 'RAG-бот РСВ', letter: 'R' },
  meet: { bg: '#121212', accent: '#FFA41B', ui: 'oklch(0.60 0.19 38)', name: 'Совещания РСВ', letter: 'С' }
};
const CSS = `
:host{display:block;position:relative;width:100%;height:100%;overflow:hidden;background:var(--bg);font-family:Manrope,${FONT};-webkit-font-smoothing:antialiased}
*{box-sizing:border-box;margin:0;padding:0}
.bg{display:none}.portrait .features,.portrait .cards{display:none}.portrait .phone{transform:none!important}.portrait .cursor{display:none}
.stage{position:absolute;left:0;top:0;width:1280px;height:720px;transform-origin:0 0;color:#F3F1EC;perspective:1700px;perspective-origin:50% 45%}
.glow{position:absolute;left:706px;top:360px;width:900px;height:900px;margin:-450px 0 0 -450px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,164,27,.20),rgba(255,164,27,.06) 55%,transparent);opacity:0;transform:scale(.6);transition:opacity 1.2s,transform 1.6s cubic-bezier(.2,.8,.2,1),left 1.6s cubic-bezier(.65,0,.2,1)}
.glow.on{opacity:1;transform:scale(1)}
.title{position:absolute;left:88px;right:88px;top:0;bottom:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:22px;pointer-events:none}
.title>*{opacity:0;transform:translateY(90px) skewY(5deg);transition:opacity .5s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.16,1,.3,1)}
.title.out>*{opacity:0;transform:translateY(-70px) skewY(-3deg);transition-duration:.5s,.6s}
.title.on>*{opacity:1;transform:none}
.title.on>:nth-child(2){transition-delay:.1s}.title.on>:nth-child(3){transition-delay:.22s}
.eyebrow{font-size:20px;font-weight:500;color:var(--accent);text-transform:uppercase;letter-spacing:.08em}
.title h1{font-size:120px;line-height:.9;font-weight:300;letter-spacing:-.06em;text-transform:uppercase}
.title h1.sm{font-size:96px;line-height:.94}
.title p{font-size:28px;color:#8F8C86;font-weight:400;letter-spacing:-.01em}
.features{position:absolute;left:88px;top:50%;transform:translate(-30px,-50%);width:420px;list-style:none;display:flex;flex-direction:column;gap:18px;opacity:0;transition:opacity .7s,transform .9s cubic-bezier(.2,.8,.2,1)}
.features.on{opacity:1;transform:translate(0,-50%)}
.features li{position:relative;font-size:36px;line-height:1.08;font-weight:300;letter-spacing:-.045em;text-wrap:balance;opacity:0;transform:translateY(34px);filter:blur(10px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform 1s cubic-bezier(.16,1,.3,1),filter .8s}
.features.on li{opacity:1;transform:none;filter:blur(0)}
.features.on li:nth-child(2){transition-delay:.08s}.features.on li:nth-child(3){transition-delay:.16s}.features.on li:nth-child(4){transition-delay:.24s}
.features li .w{display:inline-block;color:rgba(243,241,236,.18);transition:color .5s ease;transition-delay:0s}
.features li.on .w{color:#F3F1EC;transition-delay:calc(var(--i) * 45ms)}
.phone{position:absolute;left:545px;top:34px;width:322px;height:652px;border-radius:56px;background:#0B0B0B;padding:4px;border:4px solid #111;box-shadow:0 0 0 1px #5A5752,0 40px 100px rgba(0,0,0,.65);opacity:0;transform-style:preserve-3d;transition:opacity .5s,transform .95s cubic-bezier(.7,0,.2,1)}
.phone.on{opacity:1}
.phone.fast{transition:opacity .4s,transform .8s cubic-bezier(.16,1,.3,1)}
.screen{position:relative;width:100%;height:100%;border-radius:48px;overflow:hidden;background:#f2f2f6;display:flex;flex-direction:column;color:#1d1d1f;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',Helvetica,Arial,sans-serif}
.island{position:absolute;left:50%;top:10px;width:92px;height:27px;margin-left:-46px;border-radius:20px;background:#000;z-index:3}
.status{height:46px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:6px 26px 0 30px;font-size:14px;font-weight:600}
.sb{display:flex;gap:3px;align-items:flex-end}.sb i{display:block;width:4px;background:#1d1d1f;border-radius:1px}
.sb i:nth-child(1){height:6px}.sb i:nth-child(2){height:9px}.sb i:nth-child(3){height:12px}
.sb b{display:block;width:22px;height:11px;border-radius:3px;border:1.5px solid #1d1d1f;margin-left:5px;position:relative}
.sb b::after{content:"";position:absolute;inset:1.5px;right:5px;background:#1d1d1f;border-radius:1px}
.head{flex:none;display:flex;align-items:center;gap:10px;padding:6px 16px 10px;border-bottom:.5px solid rgba(0,0,0,.1);background:rgba(255,255,255,.7)}
.ava{width:34px;height:34px;border-radius:50%;background:var(--ui);color:#fff;display:grid;place-items:center;font-weight:600;font-size:15px}
.head b{display:block;font-size:14px;font-weight:600}.head small{display:block;font-size:11.5px;color:#8F8C86}
.msgs{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;gap:7px;padding:12px 11px;overflow:hidden}
.m{max-width:84%;padding:8px 11px;border-radius:18px;font-size:12.5px;line-height:1.4;opacity:0;transform:translateY(14px) scale(.94);transition:opacity .3s,transform .4s cubic-bezier(.2,.9,.25,1.2);flex:none}
.m.on{opacity:1;transform:none}
.m.bot{align-self:flex-start;background:#fff;color:#1d1d1f;box-shadow:0 1px 1px rgba(0,0,0,.04);border-bottom-left-radius:6px;transform-origin:0 100%}
.m.user{align-self:flex-end;background:var(--ui);color:#fff;border-bottom-right-radius:6px;transform-origin:100% 100%}
.m b{font-weight:600}.m .g{color:#6e6e73}
.m ul{list-style:none;margin-top:4px;display:flex;flex-direction:column;gap:2px}.m li::before{content:"• ";color:var(--ui)}
.m .src{margin-top:7px;display:flex;align-items:center;gap:7px;padding:6px 8px;border-radius:10px;background:#f2f2f6;font-size:11px;color:#3a3a3c}
.doc{flex:none;width:14px;height:17px;border-radius:3px;background:var(--ui);position:relative}
.doc::after{content:"";position:absolute;right:0;top:0;width:5px;height:5px;background:rgba(0,0,0,.35);border-bottom-left-radius:2px}
.m .warn{display:block;margin-bottom:6px;padding:6px 8px;border-radius:10px;background:oklch(0.95 0.05 85);color:oklch(0.45 0.1 70);font-size:11.5px}
.m .ib{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:8px}
.m .ib span{display:block;text-align:center;padding:7px 4px;border-radius:10px;background:#f2f2f6;color:var(--ui);font-weight:600;font-size:11.5px;transition:background .3s,color .3s}
.m .ib span.hit{background:var(--ui);color:#fff}
.m .file{display:flex;align-items:center;gap:8px;padding:4px 0}.m .file .doc{width:22px;height:27px}
.m .file small{display:block;font-size:10.5px;color:#8F8C86}
.dots{display:flex;gap:4px;padding:3px 2px}.dots i{width:6px;height:6px;border-radius:50%;background:#b0b0b8;animation:dot 1s infinite}
.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}
@keyframes dot{0%,60%,100%{transform:none;opacity:.5}30%{transform:translateY(-3px);opacity:1}}
.kbd{flex:none;display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 10px;max-height:0;overflow:hidden;transition:max-height .5s cubic-bezier(.2,.8,.2,1),padding .5s}
.kbd.on{max-height:60px;padding:6px 10px 2px}
.kbd.one{grid-template-columns:1fr}
.kbd span{display:block;text-align:center;padding:9px 4px;border-radius:12px;background:#fff;box-shadow:0 1px 1px rgba(0,0,0,.06);font-size:12px;font-weight:500}
.input{flex:none;display:flex;align-items:center;gap:8px;padding:8px 12px 26px}
.field{flex:1;min-width:0;height:34px;border-radius:17px;background:#fff;border:.5px solid rgba(0,0,0,.08);display:flex;align-items:center;padding:0 13px;font-size:12.5px;white-space:nowrap;overflow:hidden}
.ph{color:#a1a1a6}.tx{overflow:hidden;text-overflow:ellipsis}.tx:empty{display:none}
.caret{width:1.5px;height:16px;background:var(--ui);margin-left:1px;opacity:0}
.field.typing .caret{opacity:1;animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.send{flex:none;width:34px;height:34px;border-radius:50%;background:var(--ui);position:relative}
.send::after{content:"";position:absolute;left:50%;top:50%;width:9px;height:9px;border-left:2px solid #fff;border-top:2px solid #fff;transform:translate(-50%,-25%) rotate(45deg)}
.cards{position:absolute;inset:0;pointer-events:none;perspective:1400px}
.card{position:absolute;border-radius:28px;padding:24px 26px;background:#1A1A1A;border:1px solid rgba(243,241,236,.1);box-shadow:0 40px 90px rgba(0,0,0,.55);opacity:0;transform:translate3d(60px,90px,-200px) rotateX(-38deg) rotateY(-18deg) scale(.85);transition:opacity .35s,transform .7s cubic-bezier(.2,1.3,.35,1)}
.card.on{opacity:1;transform:none}
.card.off{opacity:0;transform:translate3d(0,-60px,-120px) rotateX(20deg) scale(.9);transition:opacity .4s,transform .6s cubic-bezier(.6,0,.4,1)}
.lab{font-size:13px;font-weight:600;color:#8F8C86;text-transform:uppercase;letter-spacing:.08em}
.num{font-size:72px;font-weight:300;letter-spacing:-.06em;line-height:1;margin:10px 0 16px}.num span{font-size:28px;letter-spacing:-.03em;color:#8F8C86;margin-left:8px}
.bar{position:relative;height:6px;border-radius:3px;background:rgba(243,241,236,.1);margin-bottom:16px}
.bar i{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:3px;background:var(--accent);transition:width 1.4s cubic-bezier(.2,.8,.2,1) .35s}
.card.on .bar i{width:var(--v)}
.bar em{position:absolute;top:-5px;width:2px;height:16px;background:#F3F1EC;border-radius:1px}
.row{display:flex;justify-content:space-between;font-size:16px;padding:6px 0;color:#8F8C86;border-top:1px solid rgba(243,241,236,.08)}.row b{font-weight:500;color:#F3F1EC}
.cols{display:flex;align-items:flex-end;gap:22px;height:160px;margin-top:16px}
.col{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:stretch;gap:8px;height:100%}
.col i{display:block;border-radius:12px;background:var(--accent);height:0;transition:height 1.2s cubic-bezier(.2,.8,.2,1) .3s}
.col:first-child i{background:rgba(243,241,236,.16)}
.card.on .col i{height:var(--h)}
.col b{font-size:28px;font-weight:300;letter-spacing:-.04em}.col small{font-size:13px;color:#8F8C86}
.srcc{display:flex;gap:16px;align-items:center}.srcc .doc{width:42px;height:52px;border-radius:7px}.srcc .doc::after{width:13px;height:13px;border-bottom-left-radius:5px}
.srcc b{display:block;font-size:18px;font-weight:500;letter-spacing:-.01em;line-height:1.25}.srcc small{display:block;font-size:14px;color:#8F8C86;margin-top:3px}
.pill{display:inline-block;padding:7px 14px;border-radius:999px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:#FFA41B;color:#0B0B0B;margin-bottom:16px}
.big{font-size:28px;font-weight:300;letter-spacing:-.04em;line-height:1.15}
.chk{display:flex;flex-direction:column;gap:10px;margin-top:14px}
.chk div{display:flex;align-items:center;gap:12px;font-size:16px;opacity:0;transform:translateX(-12px);transition:opacity .4s,transform .5s cubic-bezier(.2,.8,.2,1)}
.card.on .chk div{opacity:1;transform:none;transition-delay:calc(var(--d) * 1s)}
.chk em{flex:none;width:22px;height:22px;border-radius:50%;background:var(--accent);position:relative}
.chk em::after{content:"";position:absolute;left:7px;top:4px;width:5px;height:10px;border-right:2px solid #0B0B0B;border-bottom:2px solid #0B0B0B;transform:rotate(45deg)}
.chk span{color:#8F8C86;width:96px;flex:none}.chk b{font-weight:500}
.dcard{width:270px;padding:18px 20px}
.cursor{position:absolute;left:1100px;top:760px;width:38px;height:38px;margin:-19px 0 0 -19px;border-radius:50%;background:rgba(243,241,236,.22);border:2px solid rgba(243,241,236,.9);box-shadow:0 6px 18px rgba(0,0,0,.4);transition:left .5s cubic-bezier(.45,0,.2,1),top .5s cubic-bezier(.45,0,.2,1),transform .18s,opacity .4s;opacity:0;z-index:10}
.cursor.on{opacity:1}.cursor.tap{transform:scale(.72)}
.ring{position:absolute;width:38px;height:38px;margin:-19px 0 0 -19px;border-radius:50%;border:2px solid var(--ui);animation:ring .6s ease-out forwards;z-index:9}
@keyframes ring{from{transform:scale(.6);opacity:1}to{transform:scale(2);opacity:0}}
`;

class CaseReel extends HTMLElement {
  static get observedAttributes() { return ['speed', 'scenario']; }
  set scenario(v) { this.setAttribute('scenario', v); }
  get scenario() { return this.getAttribute('scenario'); }
  set speed(v) { this._speed = parseFloat(v) || 1; }
  get speed() { return this._speed || 1; }
  attributeChangedCallback(n, o, v) {
    if (n === 'speed') this._speed = parseFloat(v) || 1;
    if (n === 'scenario' && this._built && o !== v) { this._teardown(); this._build(); }
  }
  connectedCallback() { if (!this.shadowRoot) this.attachShadow({ mode: 'open' }); setTimeout(() => { if (this.isConnected && !this._built) this._build(); }, 0); }
  disconnectedCallback() { this._teardown(); }
  _teardown() {
    this._built = false; this.gen = (this.gen || 0) + 1; this.waiters = [];
    cancelAnimationFrame(this._raf); this._ro && this._ro.disconnect(); this._io && this._io.disconnect();
    if (this.shadowRoot) this.shadowRoot.innerHTML = '';
  }
  _build() {
    this._built = true; this.gen = (this.gen || 0) + 1;
    const sc = THEMES[this.scenario] ? this.scenario : 'rag', T = THEMES[sc];
    ['bg', 'accent', 'ui'].forEach(k => this.style.setProperty('--' + k, T[k]));
    this.shadowRoot.innerHTML = `<style>${CSS}</style>
<div class="bg"><i class="blob b1"></i><i class="blob b2"></i><i class="blob b3"></i></div>
<div class="stage">
  <div class="glow"></div>
  <div class="title"><div class="eyebrow"></div><h1></h1><p></p></div>
  <ul class="features"></ul>
  <div class="phone"><div class="screen"><div class="island"></div>
    <div class="status"><span>9:41</span><span class="sb"><i></i><i></i><i></i><b></b></span></div>
    <div class="head"><div class="ava">${T.letter}</div><div><b>${T.name}</b><small>бот</small></div></div>
    <div class="msgs"></div><div class="kbd"></div>
    <div class="input"><div class="field"><span class="ph">Сообщение</span><span class="tx"></span><span class="caret"></span></div><div class="send"></div></div>
  </div></div>
  <div class="cards"></div>
  <div class="cursor"></div>
</div>`;
    const R = this.shadowRoot; this.$ = s => R.querySelector(s);
    this.stage = this.$('.stage');
    const fit = () => {
      const w = this.clientWidth, h = this.clientHeight; if (!w || !h) return;
      const portrait = w / h < 1.15; this.stage.classList.toggle('portrait', portrait);
      const s = portrait ? Math.min(w / 420, h / 740) : Math.min(w / 1280, h / 720); this.s = s;
      this.stage.style.transform = `translate(${w / 2 - (portrait ? 706 : 640) * s}px,${(h - 720 * s) / 2}px) scale(${s})`;
    };
    this._ro = new ResizeObserver(fit); this._ro.observe(this); fit();
    this.visible = true;
    this._io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; }); this._io.observe(this);
    this.clock = 0; this.waiters = []; let last = performance.now();
    const tick = () => {
      const n = performance.now(), dt = Math.min(n - last, 100); last = n;
      if (this.visible) this.clock += dt * this.speed * 1.45;
      const due = this.waiters.filter(x => x.t <= this.clock); this.waiters = this.waiters.filter(x => x.t > this.clock);
      due.forEach(x => x.r());
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
    if ((this.previewStatic || this['preview-static'] || this.hasAttribute('preview-static'))) {
      this.reset(); this.on('.phone'); this.cam('front', true);
      this.msg('bot', sc === 'rag' ? '<b>Ответ по документам РСВ</b><br>Показатель достигнут на 87%.<br><br>Источник: дашборд КПЭ ↗' : '<b>Заседание правления</b><br>Пятница · 14:00<br><br>Участники и повестка подтверждены.<br>Документы готовы ✓');
      this.$('.phone').style.transform = 'translateX(-170px) scale(.94)';
      cancelAnimationFrame(this._raf); return;
    }
    const gen = this.gen;
    (async () => { while (gen === this.gen) { this.reset(); await this[sc](); } })();
  }
  cam(n, fast) {
    const C = {
      enter: 'translate3d(40px,520px,-200px) rotateX(62deg) rotateZ(-18deg) scale(.8)',
      rise: 'translate3d(30px,10px,0) rotateX(22deg) rotateY(-26deg) rotateZ(8deg) scale(.96)',
      front: 'none',
      right: 'translate3d(-30px,0,0) rotateY(-18deg) rotateX(6deg) rotateZ(1deg)',
      left: 'translate3d(20px,0,0) rotateY(22deg) rotateX(5deg) rotateZ(-2deg)',
      zoom: 'translate3d(70px,-170px,120px) rotateX(8deg) scale(1.3)',
      exit: 'translate3d(0,-620px,-300px) rotateX(-50deg) rotateZ(12deg) scale(.8)'
    };
    const p = this.$('.phone'); p.classList.toggle('fast', !!fast); p.style.transform = C[n];
    const g = this.$('.glow'); if (g) g.style.left = (n === 'right' ? 640 : n === 'left' ? 760 : 706) + 'px';
  }
  w(ms) { return new Promise(r => this.waiters.push({ t: this.clock + ms, r })); }
  on(sel, v = true) { const e = typeof sel === 'string' ? this.$(sel) : sel; e && e.classList.toggle('on', v); return e; }
  reset() {
    this.$('.msgs').innerHTML = ''; this.$('.cards').innerHTML = ''; this.$('.kbd').innerHTML = '';
    ['.title', '.features', '.phone', '.kbd', '.cursor', '.glow'].forEach(s => this.on(s, false)); this.$('.title').classList.remove('out');
    const p = this.$('.phone'); p.style.transition = 'none'; this.cam('enter'); p.offsetWidth; p.style.transition = '';
  }
  async title(eb, h, p, sm) {
    const t = this.$('.title'); t.children[0].textContent = eb || ''; t.children[1].innerHTML = h; t.children[1].className = sm ? 'sm' : ''; t.children[2].textContent = p || '';
    t.classList.remove('out'); this.on(t);
  }
  async titleOut() { const t = this.$('.title'); t.classList.add('out'); await this.w(650); this.on(t, false); t.classList.remove('out'); }
  feats(list) { this.$('.features').innerHTML = list.map(x => `<li>${x.split(' ').map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(' ')}</li>`).join(''); }
  feat(i) { [...this.$('.features').children].forEach((li, j) => li.classList.toggle('on', i === j)); }
  msg(side, html) {
    const box = this.$('.msgs'), el = document.createElement('div');
    el.className = 'm ' + side; el.innerHTML = html; box.appendChild(el);
    while (box.children.length > 12) box.firstChild.remove();
    el.offsetWidth; el.classList.add('on'); return el;
  }
  async typing(ms) { const el = this.msg('bot', '<span class="dots"><i></i><i></i><i></i></span>'); await this.w(ms); el.remove(); }
  pos(el) {
    const a = el.getBoundingClientRect(), b = this.stage.getBoundingClientRect(), s = this.s || 1;
    return [(a.left + a.width / 2 - b.left) / s, (a.top + a.height / 2 - b.top) / s];
  }
  async tap(el) {
    const c = this.$('.cursor'), [x, y] = this.pos(el);
    this.on(c); c.style.left = x + 'px'; c.style.top = y + 'px';
    await this.w(650); c.classList.add('tap');
    const r = document.createElement('div'); r.className = 'ring'; r.style.left = x + 'px'; r.style.top = y + 'px'; this.stage.appendChild(r);
    setTimeout(() => r.remove(), 700);
    await this.w(160); c.classList.remove('tap'); await this.w(180);
  }
  async type(text, { cps = 34, paste = false, bubble } = {}) {
    const f = this.$('.field'), tx = this.$('.tx'), ph = this.$('.ph');
    ph.style.display = 'none'; f.classList.add('typing');
    if (paste) { await this.w(300); tx.textContent = text.replace(/\n/g, ' '); }
    else for (let i = 1; i <= text.length; i++) { tx.textContent = text.slice(0, i); await this.w(1000 / cps); }
    await this.w(200); await this.tap(this.$('.send'));
    f.classList.remove('typing'); tx.textContent = ''; ph.style.display = '';
    this.msg('user', bubble || text);
    await this.w(300); this.on('.cursor', false);
  }
  kbd(list) { const k = this.$('.kbd'); k.className = 'kbd' + (list.length === 1 ? ' one' : ''); k.innerHTML = list.map(x => `<span>${x}</span>`).join(''); k.offsetWidth; this.on(k); }
  card(html, x, y, w, cls = '') {
    const el = document.createElement('div'); el.className = 'card ' + cls; el.innerHTML = html;
    el.style.left = x + 'px'; el.style.top = y + 'px'; if (w) el.style.width = w + 'px';
    this.$('.cards').appendChild(el); el.offsetWidth; el.classList.add('on'); return el;
  }
  async clearCards() { [...this.$('.cards').children].forEach(c => { c.classList.remove('on'); c.classList.add('off'); }); await this.w(550); this.$('.cards').innerHTML = ''; }
  async outro(eb, h, p) {
    await this.clearCards(); this.on('.features', false); this.on('.cursor', false); this.on('.glow', false);
    this.cam('exit'); await this.w(500); this.on('.phone', false); await this.w(500);
    this.title(eb, h, p, true); await this.w(3600); await this.titleOut(); await this.w(500);
  }

  async rag() {
    const src = '<div class="src"><i class="doc"></i>Дашборд КПЭ РСВ на 24.04.26.pdf, стр. 1</div>';
    this.feats(['Отвечает обычным языком', 'Показывает источник', 'Помнит контекст', 'Предупреждает о неточном совпадении']);
    this.on('.glow'); this.on('.phone'); this.cam('rise', true); await this.w(700); this.on('.features'); this.feat(0); await this.w(1100);
    this.cam('front'); await this.w(1300);
    await this.type('/start', { cps: 12 });
    await this.typing(900);
    this.msg('bot', 'Привет! Я помогу найти ответ в документах Президентской платформы. Напишите вопрос обычным сообщением.<ul><li>Какой процент россиян знает о платформе?</li><li>Сколько участников у проекта «Лидеры России»?</li><li>Каков статус КПЭ по охватам в СМИ?</li></ul>');
    await this.w(400); this.kbd(['🆕 Новый чат', '💡 Примеры']);
    this.cam('left'); await this.w(1900); this.cam('front'); await this.w(900);
    await this.type('Какой охват в СМИ на 24 апреля?');
    await this.typing(1300);
    this.msg('bot', '<b>Охват в СМИ на 24.04.26 составил 1 003 млн.</b><br>КПЭ на 1 мая — 1 205 млн, годовой целевой показатель — 1 321 млн.<br>📈 С января показатель вырос с 252 млн до 1 003 млн.' + src);
    await this.w(300); this.cam('zoom'); await this.w(2000); this.cam('right'); await this.w(500);
    this.card('<div class="lab">Охват в СМИ на 24.04.26</div><div class="num">1 003<span>млн</span></div><div class="bar" style="--v:76%"><i></i><em style="left:91%"></em></div><div class="row"><span>КПЭ на 1 мая</span><b>1 205 млн</b></div><div class="row"><span>Цель на год</span><b>1 321 млн</b></div>', 905, 120, 320);
    await this.w(1900); this.feat(1);
    this.card('<div class="srcc"><i class="doc"></i><div><b>Дашборд КПЭ РСВ<br>на 24.04.26.pdf</b><small>Источник, стр. 1</small></div></div>', 860, 470, 330);
    await this.w(2600); await this.clearCards();
    this.feat(2); this.cam('front'); await this.w(1000);
    await this.type('А по публикациям как?');
    await this.typing(1100);
    this.msg('bot', '<b>Публикации в СМИ на 24.04.26 — 36,2 тыс.</b><br>КПЭ на 1 мая — 42,3 тыс., годовой целевой показатель — 49 тыс.<br>📈 С января: с 5,3 тыс. до 36,2 тыс.' + src);
    await this.w(300); this.cam('zoom'); await this.w(1800); this.cam('right'); await this.w(500);
    this.card('<div class="lab">Публикации в СМИ</div><div class="cols"><div class="col"><i style="--h:15%"></i><b>5,3</b><small>январь</small></div><div class="col"><i style="--h:100%"></i><b>36,2</b><small>24 апреля</small></div></div>', 905, 170, 300);
    await this.w(3000); await this.clearCards();
    this.feat(3); this.on('.kbd', false); this.cam('left'); await this.w(1200);
    await this.type('Каковы планы по «Сенежу» на 2027 год?');
    await this.typing(1400);
    this.msg('bot', '<span class="warn">Точных данных не нашёл — ниже ответ из косвенно релевантных документов. Рекомендую проверить.</span>Есть данные по Мастерской «Сенеж» за 2026 год: 16,6 тыс. участников (КПЭ 13,5), 45 мероприятий (КПЭ 24). Планы на 2027 год в документах не указаны.' + src);
    await this.w(300); this.cam('zoom'); await this.w(2200); this.cam('right'); await this.w(500);
    this.card('<span class="pill">Низкая релевантность</span><div class="big">Предупреждает и не придумывает цифры</div>', 905, 200, 310);
    await this.w(3400);
    await this.w(1800);
  }

  async meet() {
    this.feats(['Принимает запрос в свободной форме', 'Уточняет, если нужно', 'Показывает итог', 'Готовит документы']);
    this.on('.glow'); this.on('.phone'); this.cam('rise', true); await this.w(700); this.on('.features'); this.feat(0); await this.w(1000);
    this.cam('front'); await this.w(700);
    this.msg('bot', '<b>📋 Создание нового заседания</b><br>Отправьте информацию в свободной форме: тему, дату и время, место, участников и повестку с докладчиками.');
    await this.w(1500);
    await this.type('Совещание по бюджету на 2026 год, 15 марта в 10:00, зал Коллегия…', {
      paste: true,
      bubble: 'Совещание по бюджету на 2026 год<br>15 марта в 10:00, зал Коллегия<br>Участники: Бетин, Гусев И.П., Деев<br>Повестка:<br>1. Итоги года — Гусев<br>2. Планирование бюджета — Деев<br>3. Организационные вопросы — Бетин'
    });
    await this.w(300); this.cam('zoom'); await this.w(1700); this.cam('right'); await this.w(500);
    this.card('<div class="lab">Распознано</div><div class="chk">' +
      [['Тема', 'Бюджет на 2026 год'], ['Дата', '15 марта'], ['Время', '10:00'], ['Место', 'Зал Коллегия'], ['Участники', '3 человека'], ['Повестка', '3 пункта']]
        .map((r, i) => `<div style="--d:${0.25 + i * 0.22}"><em></em><span>${r[0]}</span><b>${r[1]}</b></div>`).join('') + '</div>', 900, 150, 320);
    await this.w(3400); await this.clearCards();
    this.feat(1); this.cam('left'); await this.typing(1000);
    this.msg('bot', 'Уточните участника <b>Деев</b>:<br>1. Деев Андрей Сергеевич, начальник управления<br>2. Деев Павел Олегович, советник<br>3. Деев Илья Романович, аналитик<br><span class="g">Введите номер</span>');
    await this.w(1600); this.cam('front'); await this.w(900);
    await this.type('1', { cps: 6 });
    this.feat(2); await this.typing(1100);
    const pv = this.msg('bot', '<b>Проверьте данные:</b><br><span class="g">Название:</span> Совещание по бюджету на 2026 год<br><span class="g">Дата:</span> 15 марта<br><span class="g">Время:</span> 10:00<br><span class="g">Место:</span> зал Коллегия<br><span class="g">Участники:</span> Бетин, Гусев И.П., Деев А.С.<br><span class="g">Повестка:</span> 3 пункта<div class="ib"><span>Редактировать</span><span>Подтвердить</span></div>');
    await this.w(300); this.cam('zoom'); await this.w(2200);
    const ok = pv.querySelectorAll('.ib span')[1];
    await this.tap(ok); ok.classList.add('hit'); await this.w(400); this.on('.cursor', false);
    this.cam('right'); this.feat(3); await this.typing(1300);
    this.msg('bot', '<b>Документы готовы</b><div class="file"><i class="doc"></i><div>Повестка заседания.docx<small>DOCX</small></div></div><div class="file"><i class="doc"></i><div>Список участников.docx<small>DOCX</small></div></div>');
    await this.w(300);
    const d = (n, x, y, r) => this.card(`<div class="srcc"><i class="doc"></i><div><b>${n}</b><small>Готов к отправке</small></div></div>`, x, y, 0, 'dcard').style.rotate = r + 'deg';
    d('Повестка заседания', 905, 170, -3); await this.w(350);
    d('Список участников', 935, 330, 2);
    await this.w(900);
    this.msg('bot', 'Что дальше?'); this.kbd(['Новое заседание']);
    await this.w(2600);
    await this.w(1800);
  }
}
customElements.define('case-reel', CaseReel);
})();
