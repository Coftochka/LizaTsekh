(() => {
  if (customElements.get('stat-roll')) return;
  const STATS = [
    { n: '1К+', l: 'слайдов' },
    { n: '50+', l: 'проектов' },
    { n: '48ч', l: 'средний срок' },
  ];
  const EASE = 'cubic-bezier(.75,0,.15,1)', DUR = 420, STAG = 32, HOLD = 900;
  const css = `
    :host{display:block;width:100%;height:100%;container-type:size;background:radial-gradient(120% 120% at 28% 18%,rgba(140,124,114,.55) 0%,rgba(70,62,58,.42) 45%,rgba(30,25,23,.6) 100%);color:#FFFFFF;overflow:hidden}
    .stage{position:relative;width:100%;height:100%}
    .stage::before{content:'';position:absolute;inset:0;border-radius:50%;background:radial-gradient(70% 60% at 85% 95%,rgba(255,164,27,.38),transparent 70%),radial-gradient(45% 30% at 30% 12%,rgba(255,255,255,.32),transparent 70%);box-shadow:inset 0 1.2cqw 2cqw rgba(255,255,255,.22),inset 0 -1.5cqw 3cqw rgba(0,0,0,.35),inset 0 0 0 .35cqw rgba(255,255,255,.14);pointer-events:none;z-index:2}
    .stage::after{content:'';position:absolute;left:12%;top:5%;width:46%;height:20%;border-radius:50%;background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,0));filter:blur(.6cqw);transform:rotate(-14deg);pointer-events:none;z-index:2}
    .layer{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
    .blk{display:flex;flex-direction:column;align-items:flex-end}
    .row{display:flex;align-items:flex-end}
    .num{color:#FFFFFF;font-family:var(--nf,'Unbounded'),sans-serif;font-weight:var(--nw,600);font-size:var(--ns,30cqw);line-height:.86;letter-spacing:var(--nl,-.04em);text-shadow:0 .6cqw 3cqw rgba(0,0,0,.25)}
    .unit{font-family:Oswald,sans-serif;font-weight:700;font-size:9cqw;line-height:.86;margin-left:2cqw;margin-bottom:1.2cqw;color:#FFA41B}
    .lab{font-family:Manrope,sans-serif;font-weight:500;font-size:6cqw;line-height:1;letter-spacing:-.01em;color:#F3F1EC;margin-top:0;overflow:hidden;padding:.1em 0}
    .lab .t{display:inline-block;white-space:nowrap;will-change:transform}
    .m{display:inline-block;overflow:hidden;padding:.06em 0;vertical-align:bottom}
    .c{display:inline-block;will-change:transform;white-space:pre}
  `;
  const chars = (t) => [...t].map(ch => `<span class="m"><span class="c">${ch === ' ' ? '&nbsp;' : ch}</span></span>`).join('');
  class StatRoll extends HTMLElement {
    connectedCallback() {
      if (this._r) return;
      this._r = this.attachShadow({ mode: 'open' });
      if (!document.querySelector('link[data-oswald]')) {
        const l = document.createElement('link'); l.rel = 'stylesheet'; l.dataset.oswald = '';
        l.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Unbounded:wght@600&family=Russo+One&family=Tektur:wght@700&display=swap';
        document.head.appendChild(l);
        const f = document.createElement('style');
        f.textContent = "@font-face{font-family:'Druk Cond Super';src:url('" + new URL('fonts/druk-cond-super.otf', document.baseURI).href + "') format('opentype');font-weight:900;font-display:block}@font-face{font-family:'Tungsten Bold';src:url('" + new URL('fonts/Tungsten-Bold.woff2', document.baseURI).href + "') format('woff2');font-weight:700;font-display:block}";
        document.head.appendChild(f);
      }
      this._r.innerHTML = `<style>${css}</style><div class="stage"></div>`;
      this.stage = this._r.querySelector('.stage');
      this.i = 0;
      this.applyFont();
      this.cur = this.make(STATS[0]);
      this.stage.appendChild(this.cur);
      this.timer = setTimeout(() => this.next(), HOLD);
    }
    static get observedAttributes() { return ['font']; }
    attributeChangedCallback() { this.applyFont(); }
    applyFont() {
      const F = { 'Unbounded': ["'Unbounded'", 600, '30cqw', '-.04em'], 'Tungsten': ["'Tungsten Bold','Druk Cond Super'", 700, '50cqw', '0'], 'Druk': ["'Druk Cond Super'", 900, '54cqw', '0'], 'Tektur': ["'Tektur'", 700, '34cqw', '-.03em'], 'Russo One': ["'Russo One'", 400, '30cqw', '-.03em'] };
      const f = F[this.getAttribute('font')] || F.Unbounded;
      ['--nf', '--nw', '--ns', '--nl'].forEach((k, i) => this.style.setProperty(k, String(f[i])));
    }
    disconnectedCallback() { clearTimeout(this.timer); }
    make(s) {
      const d = document.createElement('div'); d.className = 'layer';
      d.innerHTML = `<div class="blk"><div class="row"><span class="num">${chars(s.n)}</span>${s.u ? `<span class="unit">${chars(s.u)}</span>` : ''}</div><div class="lab"><span class="t">${s.l}</span></div></div>`;
      return d;
    }
    roll(layer, from, to) {
      const groups = [layer.querySelectorAll('.num .c')];
      const lab = layer.querySelector('.lab .t');
      lab.animate([{ transform: `translateX(${from > 0 ? -110 : 0}%)` }, { transform: `translateX(${from > 0 ? 0 : 110}%)` }],
        { duration: DUR, delay: from > 0 ? 140 : 0, easing: EASE, fill: 'both' });
      let last = 0;
      groups.forEach((g, gi) => g.forEach((el, i) => {
        const delay = gi === 2 ? 120 + i * 12 : (gi === 1 ? 160 : 0) + i * STAG;
        last = Math.max(last, delay);
        el.animate([{ transform: `translateY(${from}%)` }, { transform: `translateY(${to}%)` }],
          { duration: gi === 2 ? DUR * .8 : DUR, delay, easing: EASE, fill: 'both' });
      }));
      return last + DUR;
    }
    next() {
      if (document.hidden) { this.timer = setTimeout(() => this.next(), 500); return; }
      this.i = (this.i + 1) % STATS.length;
      const old = this.cur, nu = this.make(STATS[this.i]);
      const t = Math.max(this.roll(old, 0, -112), 0);
      this.cur = nu;
      setTimeout(() => { old.remove(); this.stage.appendChild(nu); const t2 = this.roll(nu, 112, 0); this.timer = setTimeout(() => this.next(), t2 + HOLD); }, t);
    }
  }
  customElements.define('stat-roll', StatRoll);
})();
