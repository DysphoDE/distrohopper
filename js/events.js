'use strict';
/* DistroHopper – Zufallsereignisse: Enten, Bugs, IRC, btw, Zwangsupdates */
(function () {
  const E = DH.events = {};
  const U = DH.util;
  let layer;
  const actors = [];
  const timers = { duck: 75, bug: 35, irc: 150, btw: 30, upd: 120, tux: 40 };
  let ircPending = null; // {left}
  let recentIrc = [], recentQuiz = [];

  E.init = () => {
    layer = document.getElementById('actors');
    const S = DH.game.S;
    // Neulinge: erste Ente etwas früher
    if (S.stats.ducks === 0) timers.duck = 55;
    if (S.stats.irc === 0) timers.irc = 110;
  };

  E.tick = (dt) => {
    const G = DH.game, S = G.S;
    if (DH.ui.blocking()) return; // während Overlays nichts spawnen
    dt = Math.min(dt, 1);
    const d = G.distro();
    timers.duck -= dt * G.duckFreq;
    if (timers.duck <= 0) { timers.duck = U.rand(90, 230); spawnDuck(); }
    if (S.b.bash + S.b.cron > 0 || S.runBytes > 50) {
      timers.bug -= dt * G.bugFreq;
      if (timers.bug <= 0) { timers.bug = U.rand(40, 95); spawnBug(); }
    }
    if (!ircPending) {
      timers.irc -= dt * G.ircFreq;
      if (timers.irc <= 0) { timers.irc = U.rand(170, 340); spawnIrc(); }
    } else {
      ircPending.left -= dt;
      DH.ui.setIrcTime(ircPending.left);
      if (ircPending.left <= 0) { ircPending = null; DH.ui.hideIrc(); }
    }
    if (d.special === 'btw') {
      timers.btw -= dt;
      if (timers.btw <= 0) { timers.btw = U.rand(35, 75); spawnBtw(); }
    }
    if (d.special === 'updates') {
      timers.upd -= dt;
      if (timers.upd <= 0) { timers.upd = U.rand(150, 280); DH.ui.windowsUpdate(); }
    }
    for (let i = actors.length - 1; i >= 0; i--) {
      const a = actors[i];
      a.t += dt;
      if (a.t >= a.life) { a.escape && a.escape(); a.el.remove(); actors.splice(i, 1); continue; }
      a.update(a);
    }
  };

  function vw() { return window.innerWidth; }
  function vh() { return window.innerHeight; }

  /* ------------------------------------------------------------ Ente */
  function spawnDuck(forced) {
    const G = DH.game;
    const el = U.h('button', { class: 'actor duck', type: 'button', 'aria-label': 'Goldene Gummiente – anklicken!' }, U.h('img', { src: DH.sprites.url('duck'), alt: '' }));
    layer.appendChild(el);
    const fromLeft = Math.random() < 0.5;
    const y0 = vh() * U.rand(0.18, 0.6);
    const life = 13 * G.duckLife;
    const a = {
      el, t: 0, life,
      update(a) {
        const k = a.t / a.life;
        const x = fromLeft ? U.lerp(-70, vw() + 10, k) : U.lerp(vw() + 10, -70, k);
        const y = y0 + Math.sin(a.t * 2.4) * 18;
        const r = Math.sin(a.t * 3) * 8;
        const fade = a.t < 0.4 ? a.t / 0.4 : a.t > a.life - 1 ? (a.life - a.t) : 1;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg) scaleX(${fromLeft ? 1 : -1})`;
        el.style.opacity = fade;
        if (Math.random() < 0.06) DH.fx.sparks(x + 30, y + 30, 1, '#fff4b0');
      },
    };
    el.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      catchDuck(ev.clientX, ev.clientY);
      el.remove();
      const i = actors.indexOf(a); if (i >= 0) actors.splice(i, 1);
    });
    actors.push(a);
    a.update(a);
    const S = G.S;
    if (!S.tut.duck) {
      S.tut.duck = 1;
      DH.ui.tuxSay('Eine goldene Gummiente! Schnell draufklicken – sie bringt Boni!', 6000);
    } else if (Math.random() < 0.3 && !forced) DH.ui.tuxSay(U.pick(['Da! Eine goldene Ente!', 'Quack? QUACK! Schnell klicken!', 'Ente in Sicht!']), 3000);
  }
  E.spawnDuck = spawnDuck;

  function catchDuck(x, y) {
    const G = DH.game, S = G.S;
    S.stats.ducks++;
    DH.audio.quack();
    DH.ui.vibrate([20, 40, 20]);
    let fx = U.weighted(DH.content.duckFx);
    const res = G.duckEffect(fx.id) || {};
    if (res.fallback) fx = DH.content.duckFx.find((x) => x.id === res.fallback) || fx;
    DH.fx.sparks(x, y, 26, '#ffd23f');
    DH.fx.confetti(24, x, y);
    let title = fx.name, text = fx.text;
    if (fx.id === 'lucky') { text = '+' + U.bytes(res.amount) + ' – ' + fx.text; DH.fx.text(x, y - 20, '+' + U.bytes(res.amount), '#ffd23f', 34, { big: true, max: 1.6 }); }
    else if (fx.id === 'special' && res.building) { text = res.building.name + ': Produktion ×' + U.num(res.mult, 1) + '!'; DH.fx.text(x, y - 20, title, '#ffd23f', 28, { big: true, max: 1.6 }); }
    else DH.fx.text(x, y - 20, title + '!', '#ffd23f', 28, { big: true, max: 1.6 });
    DH.ui.toast({ icon: DH.sprites.url('duck'), title: 'Quack! ' + title, text, kind: 'gold' });
    DH.term.println('[quack] ' + title + ' – ' + text, 'warn');
    G.checkAchievements();
  }

  /* ------------------------------------------------------------ Bug */
  function spawnBug() {
    const crt = document.getElementById('crt');
    if (!crt) return;
    const r = crt.getBoundingClientRect();
    if (r.width < 80 || r.height < 60 || r.bottom < 0 || r.top > vh()) return;
    const el = U.h('button', { class: 'actor bug', type: 'button', 'aria-label': 'Bug – zerquetschen!' }, U.h('img', { src: DH.sprites.url('bugA'), alt: '' }));
    layer.appendChild(el);
    const edge = U.randInt(0, 3);
    const pad = 20;
    const pts = [
      [U.rand(r.left + pad, r.right - pad), r.top - 10],
      [r.right + 10, U.rand(r.top + pad, r.bottom - pad)],
      [U.rand(r.left + pad, r.right - pad), r.bottom + 10],
      [r.left - 10, U.rand(r.top + pad, r.bottom - pad)],
    ];
    const [x0, y0] = pts[edge];
    const [x1, y1] = pts[(edge + 2) % 4];
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const life = Math.max(5, dist / 55);
    const ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI + 90;
    const imgA = DH.sprites.url('bugA'), imgB = DH.sprites.url('bugB');
    const img = el.firstChild;
    let frame = 0;
    const a = {
      el, t: 0, life,
      update(a) {
        const k = a.t / a.life;
        const wig = Math.sin(a.t * 9) * 5;
        const x = U.lerp(x0, x1, k) - 24 + Math.cos(ang * Math.PI / 180) * wig;
        const y = U.lerp(y0, y1, k) - 24 + Math.sin(ang * Math.PI / 180) * wig;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${ang + Math.sin(a.t * 9) * 8}deg)`;
        const f = Math.floor(a.t * 8) % 2;
        if (f !== frame) { frame = f; img.src = f ? imgB : imgA; }
      },
      escape() { DH.term.println('[ WARN ] Ein Bug ist nach Produktion entkommen. Er wird sich wohlfühlen.', 'warn'); },
    };
    el.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      squash(ev.clientX, ev.clientY);
      el.remove();
      const i = actors.indexOf(a); if (i >= 0) actors.splice(i, 1);
    });
    actors.push(a);
    a.update(a);
    if (!DH.game.S.tut.bug) { DH.game.S.tut.bug = 1; DH.ui.tuxSay('Ein Bug krabbelt übers Terminal! Zerquetsch ihn, das gibt Bytes!', 5500); }
  }
  E.spawnBug = spawnBug;

  function squash(x, y) {
    const G = DH.game, S = G.S;
    S.stats.bugs++;
    const v = G.bugReward();
    G.earn(v);
    DH.audio.squash();
    DH.fx.sparks(x, y, 16, '#7ee787');
    DH.fx.text(x, y - 10, 'Bug gefixt! +' + U.bytes(v), '#7ee787', 24, { max: 1.3 });
    const splat = U.h('div', { class: 'splat', style: { left: (x - 20) + 'px', top: (y - 20) + 'px' } });
    layer.appendChild(splat);
    setTimeout(() => splat.remove(), 900);
    if (DH.ui.vibrate) DH.ui.vibrate(18);
    G.checkAchievements();
  }

  /* ------------------------------------------------------------ IRC */
  function spawnIrc() {
    ircPending = { left: 60 };
    DH.ui.showIrc();
    DH.audio.ping();
    if (!DH.game.S.tut.irc) { DH.game.S.tut.irc = 1; DH.ui.tuxSay('Pling! Oben in der Leiste wartet eine IRC-Nachricht. Antworte, bevor sie verschwindet!', 6500); }
  }
  E.spawnIrc = spawnIrc;
  E.openIrc = () => {
    if (!ircPending) return;
    ircPending = null;
    DH.ui.hideIrc();
    const G = DH.game, S = G.S;
    const quiz = Math.random() < 0.45;
    if (quiz) {
      const pool = DH.content.quiz.map((q, i) => i).filter((i) => !recentQuiz.includes(i));
      const i = U.pick(pool);
      recentQuiz.push(i); if (recentQuiz.length > 25) recentQuiz.shift();
      DH.ui.quizDialog(DH.content.quiz[i]);
    } else {
      const pool = DH.content.irc.map((q, i) => i).filter((i) => !recentIrc.includes(i));
      const i = U.pick(pool);
      recentIrc.push(i); if (recentIrc.length > 14) recentIrc.shift();
      DH.ui.ircDialog(DH.content.irc[i]);
    }
  };
  E.hasIrc = () => !!ircPending;

  // Auswirkungen einer IRC-Entscheidung anwenden → Ergebnistext
  E.applyEffect = (eff) => {
    const G = DH.game, U2 = DH.util;
    if (!eff || eff.none) return '';
    if (eff.lump) {
      const v = G.lump(eff.lump) * G.ircMult;
      G.earn(v);
      return '+' + U2.bytes(v);
    }
    if (eff.buff) {
      const b = eff.buff;
      G.addBuff({ id: 'irc_' + b.name, name: b.name, kind: b.kind, mult: b.mult, dur: b.dur, icon: b.mult >= 1 ? 'chat' : 'skull' });
      return (b.kind === 'click' ? 'Klickkraft ' : 'Produktion ') + '×' + U2.trimDec(b.mult, 2) + ' für ' + U2.dur(b.mult >= 1 ? b.dur * G.buffDur : b.dur);
    }
    return '';
  };

  /* ------------------------------------------------------------ btw */
  function spawnBtw() {
    const term = document.getElementById('w-term');
    const r = term.getBoundingClientRect();
    if (r.width < 100) return;
    const el = U.h('button', { class: 'actor btw', type: 'button' }, 'btw, ich nutze Arch');
    layer.appendChild(el);
    const x = U.rand(r.left + 20, Math.max(r.left + 30, r.right - 190));
    const y = U.rand(r.top + 70, Math.max(r.top + 80, r.bottom - 120));
    const a = {
      el, t: 0, life: 8,
      update(a) {
        const s = a.t < 0.25 ? a.t / 0.25 : a.t > a.life - 0.5 ? (a.life - a.t) * 2 : 1;
        el.style.transform = `translate(${x}px, ${y + Math.sin(a.t * 3) * 4}px) scale(${0.6 + 0.4 * s})`;
        el.style.opacity = s;
      },
    };
    el.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      const G = DH.game;
      G.S.stats.btw++;
      G.addBuff({ id: 'btw', name: 'Allen von Arch erzählt', kind: 'prod', mult: 1.77, dur: 30, icon: 'd_arch' });
      DH.audio.coin();
      DH.fx.text(ev.clientX, ev.clientY - 10, 'Alle wissen es jetzt! +77 %', '#5ce1e6', 24);
      el.remove();
      const i = actors.indexOf(a); if (i >= 0) actors.splice(i, 1);
      G.checkAchievements();
    });
    actors.push(a);
    a.update(a);
  }

  E.spawnBtw = spawnBtw;
  E.clearActors = () => { actors.forEach((a) => a.el.remove()); actors.length = 0; ircPending = null; DH.ui.hideIrc(); };
})();
