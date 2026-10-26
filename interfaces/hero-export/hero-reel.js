// Hero reel — vanilla JS. Mount: <div id="hero-reel">…</div> markup from hero.html, then include this script.
(function () {
  const R = document.getElementById('hero-reel'); if (!R) return;
  const stage = R.querySelector('[data-k="stage"]');
  const fit = () => { const w = R.clientWidth, h = R.clientHeight; if (!w || !h) return;
    const s = w < h ? w / 1150 : Math.max(w / 1920, h / 1080);
    stage.style.transform = 'translate(-50%,-50%) scale(' + s.toFixed(4) + ')'; };
  new ResizeObserver(fit).observe(R); fit();
  const self = { props: { speed: 0.8 } };
  (function build(R) {
    const T = 18.2, EO = 'cubic-bezier(.16,.84,.24,1)', E1 = 'cubic-bezier(.7,0,.2,1)', L = 'linear';
    // Preserve scene choreography while giving the flat slide montage a brisker pace.
    const toTime = t => t <= 4.4 ? t / 2.4 : t <= 9.1 ? 4.4 / 2.4 + (t - 4.4) * 1.3 / 4.7 : 4.4 / 2.4 + 1.3 + (t - 9.1) / 1.6;
    const fromTime = t => t <= 4.4 / 2.4 ? t * 2.4 : t <= 4.4 / 2.4 + 1.3 ? 4.4 + (t - 4.4 / 2.4) * 4.7 / 1.3 : 9.1 + (t - 4.4 / 2.4 - 1.3) * 1.6;
    const duration = toTime(T);
    const q = k => R.querySelector('[data-k="' + k + '"]');
    const anims = self.anims = [];
    const tl = (el, keys) => {
      if (!el) return;
      const fr = [];
      if (keys[0][0] > 0) fr.push(Object.assign({}, keys[0][1], { offset: 0 }));
      keys.forEach(([t, p, e]) => fr.push(Object.assign({}, p, { offset: Math.min(1, toTime(t) / duration), easing: e || E1 })));
      if (keys[keys.length - 1][0] < T) fr.push(Object.assign({}, keys[keys.length - 1][1], { offset: 1 }));
      anims.push(el.animate(fr, { duration: duration * 1000, iterations: Infinity, fill: 'both' }));
    };
    const clock = q('clock').animate([{ opacity: 0 }, { opacity: 0 }], { duration: duration * 1000, iterations: Infinity });
    anims.push(clock);

    // Only the right-hand words move; the label and the text window keep a fixed width.
    tl(q('wordDrum'), [
      [9.1, { transform: 'translateY(0em)' }, L],
      [9.43, { transform: 'translateY(0em)' }, 'cubic-bezier(.45,0,.2,1)'],
      [9.675, { transform: 'translateY(-1.3em)' }, L],
      [10.005, { transform: 'translateY(-1.3em)' }, 'cubic-bezier(.45,0,.2,1)'],
      [10.25, { transform: 'translateY(-2.6em)' }, L],
      [10.58, { transform: 'translateY(-2.6em)' }, 'cubic-bezier(.45,0,.2,1)'],
      [10.825, { transform: 'translateY(-3.9em)' }, L],
      [11.4, { transform: 'translateY(-3.9em)' }, L]
    ]);


    const pb = (sc, x, y) => `translate(960px,540px) scale(${sc}) rotateX(38deg) rotateZ(-24deg) translate(${x}px,${y}px)`;
    tl(q('planeB'), [[4.4, { transform: pb(1.45, 260, -180) }, 'cubic-bezier(.25,.6,.35,1)'], [9.1, { transform: pb(1, -260, 160) }]]);

    const P = (x, y, r, s) => `translate(${x - 205}px,${y - 432}px) rotate(${r}deg) scale(${s})`;
    const D = [[690, 400, -26], [1000, 330, 16], [1250, 600, -12], [820, 760, 22], [1130, 880, -30]];
    const H = [[510, 530], [810, 560], [1110, 530], [1410, 560], [960, 1400]];
    D.forEach(([x, y, r], i) => {
      const [hx, hy] = H[i], d = i * 0.07, hs = i === 4 ? 0 : 1;
      tl(q('ph' + i), [
        [11.4, { transform: P(960, 560, r * 0.3, 0.28), opacity: 0 }, EO],
        [11.85, { transform: P(x, y, r, 0.5), opacity: 1 }, L],
        [12.2, { transform: P(x + (x - 960) * 0.08, y + (y - 560) * 0.08, r * 1.1, 0.52), opacity: 1 }, L]
      ]);
    });

    const pe = (sc, x, y) => `translate(960px,540px) rotateX(24deg) rotateY(-16deg) rotateZ(-12deg) scale(${sc}) translate(${x}px,${y}px)`;
    tl(q('planeE'), [[12.2, { transform: pe(0.74, 160, 60) }, L], [13.4, { transform: pe(0.9, -120, -40) }]]);

    tl(q('titleF'), [[13.4, { transform: 'translateY(-260px)' }, EO], [13.95, { transform: 'translateY(0px)' }]]);
    tl(q('phF'), [[13.4, { transform: 'translate(812px,1180px) scale(.72)' }, EO], [14.15, { transform: 'translate(812px,400px) scale(.72)' }, L], [14.6, { transform: 'translate(812px,370px) scale(.72)' }]]);

    tl(q('ringG'), [[14.6, { transform: 'translateZ(1000px) rotateX(20deg)' }, L], [18.2, { transform: 'translateZ(1000px) rotateX(-112deg)' }]]);

    const st = document.timeline.currentTime;
    anims.forEach(a => { a.startTime = st; });

    const SC = [['A', 4.4], ['B', 9.1], ['C', 11.4], ['D', 12.2], ['E', 13.4], ['F', 14.6], ['G', 18.2]];
    const sEls = [...R.querySelectorAll('[data-s]')], wEls = [...R.querySelectorAll('[data-w]')];
    let cur = '', cw = -1;
    const tick = () => {
      const t = fromTime(((clock.currentTime || 0) / 1000) % duration);
      const sc = (SC.find(s => t < s[1]) || SC[0])[0];
      if (sc !== cur) { cur = sc; sEls.forEach(el => { el.style.display = el.dataset.s.split(' ').includes(sc) ? 'block' : 'none'; }); }
      const w = sc === 'C' ? Math.min(3, Math.floor((t - 9.1) / 0.575)) : 0;
      if (w !== cw) { cw = w; wEls.forEach(el => { el.style.display = +el.dataset.w === w ? 'inline-block' : 'none'; }); }
      self.raf = requestAnimationFrame(tick);
    };
    tick();

    window.__heroSeek = t => anims.forEach(a => { a.pause(); a.currentTime = toTime(t) * 1000; });
    const rate = self.props.speed ?? 1;
    anims.forEach(a => { a.playbackRate = rate; });
    self.io = new IntersectionObserver(es => { const on = es[0].isIntersecting; anims.forEach(a => on ? a.play() : a.pause()); });
    self.io.observe(R);
    const reviewTime = new URLSearchParams(location.search).get('reviewTime');
    if (reviewTime !== null) requestAnimationFrame(() => requestAnimationFrame(() => window.__heroSeek(+reviewTime || 0)));

  }
  ).call(self, R);
})();
