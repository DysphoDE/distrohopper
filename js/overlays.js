'use strict';
/* DistroHopper – Overlays: Dialoge, IRC, Quiz, GRUB, Boot-Animation, Zwangsupdate, Finale */
(function () {
  const UI = DH.ui;
  const U = DH.util, SP = DH.sprites, D = DH.data;
  const G = () => DH.game;
  const root = () => document.getElementById('overlay-root');

  /* ================================================================= Modal */
  UI.modal = (o) => {
    const bg = U.h('div', { class: 'modal-bg' + (o.sheet ? ' sheet' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': o.title });
    const m = U.h('div', { class: 'modal' });
    const dismiss = o.dismiss !== false;
    const head = U.h('div', { class: 'modal-h' }, o.icon ? U.h('img', { src: o.icon, alt: '' }) : null, U.h('h3', null, o.title));
    if (dismiss) {
      const x = U.h('button', { class: 'x', type: 'button', 'aria-label': 'Schließen' }, '✕');
      x.addEventListener('click', () => close());
      head.appendChild(x);
    }
    const body = U.h('div', { class: 'modal-b' });
    if (typeof o.body === 'string') body.innerHTML = o.body; else if (o.body) body.appendChild(o.body);
    const foot = U.h('div', { class: 'modal-f' });
    m.append(head, body, foot);
    bg.appendChild(m);
    let closed = false;
    const onKey = (e) => { if (e.key === 'Escape' && dismiss) { e.preventDefault(); close(); } };
    function close() {
      if (closed) return;
      closed = true;
      bg.remove();
      document.removeEventListener('keydown', onKey, true);
      UI.block(false);
      if (o.onClose) o.onClose();
    }
    function setActions(actions) {
      foot.innerHTML = '';
      (actions || []).forEach((a) => {
        const b = U.h('button', { class: 'btn ' + (a.cls || ''), type: 'button' }, a.label);
        b.addEventListener('click', () => { if (a.fn) a.fn(); if (!a.keep) close(); });
        foot.appendChild(b);
      });
      foot.hidden = !actions || !actions.length;
    }
    setActions(o.actions);
    if (dismiss) bg.addEventListener('pointerdown', (e) => { if (e.target === bg) close(); });
    document.addEventListener('keydown', onKey, true);
    root().appendChild(bg);
    UI.block(true);
    UI.hideTip();
    setTimeout(() => { const f = foot.querySelector('.btn-accent') || m.querySelector('button.opt') || foot.querySelector('button'); if (f) f.focus({ preventScroll: true }); }, 50);
    return { close, body, setActions, el: m };
  };

  UI.confirm = (o) => UI.modal({
    title: o.title, icon: o.icon, body: U.h('p', null, o.text),
    actions: [{ label: o.cancel || 'Abbrechen', fn: o.onCancel }, { label: o.ok || 'OK', cls: o.danger ? 'btn-danger' : 'btn-accent', fn: o.onOk }],
  });

  /* ================================================================= IRC-Dilemma */
  UI.ircDialog = (ev) => {
    const g = G();
    const body = U.h('div');
    body.append(U.h('div', { class: 'irc-head' }, U.h('span', null, ev.chan), '·', U.h('b', null, ev.from)));
    body.append(U.h('div', { class: 'irc-msg' }, U.h('span', { class: 'nick' }, '<' + ev.from + '> '), ev.text));
    const opts = U.h('div', { class: 'opts' });
    const result = U.h('div', { class: 'result', hidden: true });
    let dlg;
    ev.opts.forEach(([label, outcomes]) => {
      const b = U.h('button', { class: 'opt', type: 'button' }, label);
      b.addEventListener('click', () => {
        opts.querySelectorAll('button').forEach((x) => { x.disabled = true; });
        b.classList.add('right');
        let r = Math.random(), pick = outcomes[outcomes.length - 1];
        for (const oc of outcomes) { r -= oc[0]; if (r <= 0) { pick = oc; break; } }
        const effTxt = DH.events.applyEffect(pick[2]);
        const neg = pick[2] && pick[2].buff && pick[2].buff.mult < 1;
        result.innerHTML = '';
        result.append(pick[1]);
        if (effTxt) result.append(U.h('span', { class: 'eff' + (neg ? ' neg' : '') }, effTxt));
        result.hidden = false;
        g.S.stats.irc++;
        if (neg) DH.audio.quizBad(); else DH.audio.coin();
        g.checkAchievements();
        dlg.setActions([{ label: 'Schließen', cls: 'btn-accent' }]);
      });
      opts.appendChild(b);
    });
    body.append(opts, result);
    dlg = UI.modal({ title: 'IRC-Nachricht', icon: SP.url('chat'), body, actions: [], sheet: true });
  };

  /* ================================================================= Quiz */
  UI.quizDialog = ([q, answers, expl]) => {
    const g = G(), S = g.S;
    const body = U.h('div');
    body.append(U.h('div', { class: 'irc-head' }, U.h('span', null, '#linux-de'), '·', U.h('b', null, 'QuizBot'), U.h('span', { class: 'sp' }), U.h('span', null, S.stats.quizRight + ' richtig')));
    body.append(U.h('div', { class: 'irc-msg' }, U.h('span', { class: 'nick' }, '<QuizBot> '), q));
    const right = answers[0];
    const opts = U.h('div', { class: 'opts' });
    const result = U.h('div', { class: 'result', hidden: true });
    let dlg;
    U.shuffle(answers).forEach((a) => {
      const b = U.h('button', { class: 'opt', type: 'button' }, a);
      b.addEventListener('click', () => {
        const btns = opts.querySelectorAll('button');
        btns.forEach((x) => { x.disabled = true; if (x.textContent === right) x.classList.add('right'); });
        result.innerHTML = '';
        if (a === right) {
          const v = g.lump(240) * g.quizMult;
          g.earn(v);
          S.stats.quizRight++;
          DH.audio.quizOk();
          result.append(U.h('b', null, 'Richtig! '), expl, U.h('span', { class: 'eff' }, 'Klugscheißer-Bonus: +' + U.bytes(v)));
          const r = b.getBoundingClientRect();
          DH.fx.sparks(r.left + r.width / 2, r.top + r.height / 2, 20, '#5ee08f');
        } else {
          b.classList.add('wrong');
          S.stats.quizWrong++;
          DH.audio.quizBad();
          result.append(U.h('b', null, 'Leider falsch. '), expl);
        }
        result.hidden = false;
        S.stats.irc++;
        g.checkAchievements();
        dlg.setActions([{ label: 'Weiter', cls: 'btn-accent' }]);
      });
      opts.appendChild(b);
    });
    body.append(opts, result);
    dlg = UI.modal({ title: 'Nerd-Quiz', icon: SP.url('star'), body, actions: [], sheet: true });
  };

  /* ================================================================= Offline */
  UI.offlineModal = (sec, gain, eff, onCollect) => {
    const g = G();
    let collected = false;
    const collect = () => { if (collected) return; collected = true; onCollect(); };
    const body = U.h('div');
    body.append(U.h('p', null, 'Während du weg warst (' + U.dur(sec) + '), haben deine Cronjobs brav weitergearbeitet.'));
    body.append(U.h('div', { class: 'big-num', style: { color: 'var(--byte)', margin: '6px 0 8px' } }, '+' + U.bytes(gain)));
    body.append(U.h('p', { class: 'muted', style: { fontSize: '12px' } }, 'Offline-Effizienz: ' + U.pct(eff) + (sec > g.offlineCap * 3600 ? ' · gedeckelt auf ' + g.offlineCap + ' h' : '') + '. Mehr über Dotfiles wie tmux.conf.'));
    UI.modal({
      title: 'Willkommen zurück!', icon: SP.url('tux'), body,
      actions: [{ label: 'Einsammeln', cls: 'btn-accent', fn: () => { collect(); DH.audio.coin(); DH.fx.confetti(40, window.innerWidth / 2, window.innerHeight / 2); } }],
      onClose: collect,
    });
  };

  /* ================================================================= Über */
  UI.aboutModal = () => {
    const g = G();
    UI.modal({
      title: 'DistroHopper', icon: SP.url('tux'),
      body: `<p>Das Idle-Game für Leute, die ihr Betriebssystem öfter wechseln als ihre Socken.</p>
        <p><b>Klicken</b> (oder tippen) schreibt Code → <b>Bytes</b>. Bytes kaufen <b>Hardware</b>, die für dich weitertippt. <b>Upgrades</b> verbessern alles. Irgendwann wechselst du die <b>Distro</b> (Hop): Du fängst neu an, aber dein <b>Bart</b> wächst und deine <b>Dotfiles</b> kommen mit.</p>
        <p class="muted">Tipp: Probier mal die Shell (<kbd>Strg</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd>). Und such die geheime Distro.</p>`,
      actions: [{ label: 'Anleitung & Optionen', fn: () => UI.setTab('sys') }, { label: 'Weiter coden', cls: 'btn-accent' }],
    });
  };

  /* ================================================================= GRUB */
  const JOKES = [
    { id: 'memtest', name: 'Memory test (memtest86+)', msg: 'RAM geprüft: alles in Ordnung. Das Problem sitzt vor dem Bildschirm.' },
    { id: 'uefi', name: 'UEFI Firmware Settings', msg: 'Zugriff verweigert. Secure Boot hält dich für verdächtig.' },
  ];
  UI.openGrub = () => {
    if (document.querySelector('.grub')) return;
    const g = G(), S = g.S;
    const entries = [];
    D.distros.forEach((d) => {
      if (d.id === 'windows') return;
      if (d.secret && !S.unlocked[d.id]) return;
      entries.push({ kind: 'distro', d });
    });
    entries.push({ kind: 'distro', d: D.dIndex.windows });
    JOKES.forEach((j) => entries.push({ kind: 'joke', j }));
    // Vorauswahl: erste freigeschaltete, noch nie besuchte Distro, sonst die beste freigeschaltete
    let sel = entries.findIndex((e) => e.kind === 'distro' && !e.d.secret && g.distroUnlocked(e.d) && !S.visited[e.d.id]);
    if (sel < 0) {
      let bestNeed = -1;
      entries.forEach((e, i) => { if (e.kind === 'distro' && !e.d.secret && g.distroUnlocked(e.d) && e.d.need > bestNeed) { bestNeed = e.d.need; sel = i; } });
    }
    if (sel < 0) sel = 0;

    const ov = U.h('div', { class: 'grub', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'GRUB – Distro wählen' });
    const inner = U.h('div', { class: 'grub-inner' });
    const list = U.h('ul', { class: 'grub-list', role: 'listbox' });
    const info = U.h('div', { class: 'grub-info' });
    const bootBtn = U.h('button', { class: 'grub-btn go', type: 'button' }, 'Booten ⏎');
    const cancelBtn = U.h('button', { class: 'grub-btn', type: 'button' }, 'Abbrechen (Esc)');
    inner.append(
      U.h('div', { class: 'grub-title' }, 'GNU GRUB  Version 2.12-distrohopper'),
      U.h('div', { class: 'grub-box' }, list),
      U.h('div', { class: 'grub-help' }, 'Benutze ↑ und ↓, um einen Eintrag auszuwählen. Enter oder „Booten“ startet ihn. Esc bricht ab.'),
      info,
      U.h('div', { class: 'grub-actions' }, bootBtn, cancelBtn),
    );
    ov.appendChild(inner);
    root().appendChild(ov);
    UI.block(true);
    DH.audio.beep();

    const items = entries.map((e, i) => {
      let name, right = '', lock = false;
      if (e.kind === 'distro') {
        const d = e.d;
        name = d.grub || d.name;
        const un = g.distroUnlocked(d);
        lock = !un;
        right = d.id === S.distro ? '(aktuell)' : !un ? '(gesperrt – ' + U.num(d.need) + ' Barthaare)' : !S.visited[d.id] ? '(neu!)' : '';
      } else { name = e.j.name; }
      const li = U.h('li', { class: lock ? 'lock' : '', role: 'option' }, U.h('span', { class: 'gn' }, (i === sel ? '*' : ' ') + name), U.h('span', { class: 'gr' }, right));
      li.addEventListener('click', () => { if (sel === i) boot(); else select(i); });
      list.appendChild(li);
      return li;
    });

    function select(i) {
      sel = (i + entries.length) % entries.length;
      items.forEach((li, k) => {
        li.classList.toggle('sel', k === sel);
        li.setAttribute('aria-selected', k === sel ? 'true' : 'false');
        li.firstChild.textContent = (k === sel ? '*' : ' ') + li.firstChild.textContent.slice(1);
      });
      items[sel].scrollIntoView({ block: 'nearest' });
      renderInfo();
      DH.audio.key('rubber');
    }
    function renderInfo() {
      const e = entries[sel];
      info.innerHTML = '';
      if (e.kind === 'joke') {
        info.append(U.h('div', { class: 'gi-name' }, e.j.name), U.h('div', null, 'Ein Klassiker in jedem GRUB-Menü. Niemand weiß, wofür.'));
        bootBtn.disabled = false;
        return;
      }
      const d = e.d, un = g.distroUnlocked(d);
      const gain = g.hopGain();
      info.style.setProperty('--gi', d.color);
      info.append(
        U.h('div', { class: 'gi-h' }, U.h('img', { src: SP.url('d_' + d.id, un ? null : { silhouette: '#333' }), alt: '' }), U.h('div', null, U.h('div', { class: 'gi-name' }, d.name), U.h('div', { class: 'gi-tag' }, d.tag))),
        U.h('div', { style: { marginTop: '6px', color: '#aaa' } }, d.desc),
        U.h('ul', null, d.perks.map((p) => U.h('li', { class: 'g' + p[1] }, p[0]))),
        !un ? U.h('div', { class: 'gi-gain', style: { color: '#ff7b72' } }, 'Gesperrt: benötigt ' + U.num(d.need) + ' Barthaare (du hast ' + U.num(S.beard) + ').')
          : !g.canHop() ? U.h('div', { class: 'gi-gain', style: { color: '#ff7b72' } }, 'Kein Hop möglich: Du brauchst mindestens ein neues Barthaar. Erst bei ' + U.bytes(g.bytesForHairs(g.hairsFor(S.allBytes) + (g.pendingHairs() ? 0 : 1))) + ' insgesamt.')
            : U.h('div', { class: 'gi-gain' }, 'Beim Booten: +' + U.num(gain) + ' Barthaare und +' + U.num(gain) + ' Karma. Bytes, Hardware und Upgrades werden zurückgesetzt.'),
      );
      bootBtn.disabled = !un || !g.canHop();
    }
    function close() {
      ov.remove();
      document.removeEventListener('keydown', onKey, true);
      UI.block(false);
    }
    function boot() {
      const e = entries[sel];
      if (e.kind === 'joke') {
        info.innerHTML = '';
        info.append(U.h('div', { class: 'gi-name' }, e.j.name), U.h('div', { style: { color: '#ffd166', marginTop: '8px' } }, e.j.msg));
        DH.audio.beep();
        g.secret('firmware');
        return;
      }
      if (bootBtn.disabled) { DH.audio.error(); DH.fx.shakeEl(info); return; }
      if (e.d.id === 'windows') {
        close();
        UI.confirm({
          title: 'Wirklich Fenster 11 booten?', icon: SP.url('d_windows'), danger: true,
          text: 'Bist du sicher? Deine Barthaare könnten ausfallen. Updates kommen, wann sie wollen. Die Community wird darüber reden.',
          ok: 'Ja, ich will auf die dunkle Seite', cancel: 'Nein, zurück zu GRUB',
          onOk: () => UI.hopTo('windows'),
          onCancel: () => setTimeout(() => UI.openGrub(), 50),
        });
        return;
      }
      close();
      UI.hopTo(e.d.id);
    }
    function onKey(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); select(sel + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(sel - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); boot(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
      e.stopPropagation();
    }
    bootBtn.addEventListener('click', boot);
    cancelBtn.addEventListener('click', close);
    document.addEventListener('keydown', onKey, true);
    select(sel);
  };

  /* ================================================================= Hop ausführen */
  UI.hopTo = (id) => {
    const g = G();
    const from = g.distro();
    const gain = g.hop(id);
    if (gain === false) return;
    DH.events.clearActors();
    UI.hideIrc();
    UI.closeShell();
    g.save();
    UI.bootAnim(id, () => {
      const d = D.dIndex[id];
      UI.applyTheme();
      UI.renderPanels();
      UI.updateShop(true);
      DH.term.reset();
      DH.term.println('Willkommen bei ' + d.name + '! ' + d.tag, 'ok');
      DH.term.neofetch();
      DH.audio.boot();
      UI.toast({ icon: SP.url('d_' + d.id), kicker: 'Hop #' + g.S.hops + (gain ? ' · +' + U.num(gain) + ' Barthaare' : ''), title: 'Willkommen bei ' + d.name + '!', text: d.tag + ' Frisch installiert: 3 Minuten Produktion ×2,5.', kind: 'gold', dur: 6000 });
      setTimeout(() => UI.tuxSay(DH.content.tuxHop[d.id] || 'Neue Distro, neues Glück!', 6000), 600);
      UI.tuxHappy();
      DH.fx.confetti(90);
      g.checkAchievements();
      g.save();
    });
  };

  /* ================================================================= Boot-Animation */
  UI.bootAnim = (id, done, opts) => {
    opts = opts || {};
    const d = D.dIndex[id];
    const ov = U.h('div', { class: 'boot', role: 'status' });
    ov.style.setProperty('--bh', d.color);
    root().appendChild(ov);
    UI.block(true);
    const timers = [];
    let finished = false;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const line = (html, cls) => {
      const el = U.h('div', { class: 'bl' + (cls ? ' ' + cls : ''), html });
      ov.insertBefore(el, skip);
      while (ov.childElementCount > 40) ov.removeChild(ov.firstChild);
      return el;
    };
    const skip = U.h('div', { class: 'skip' }, 'Tippen zum Überspringen');
    ov.appendChild(skip);
    const clear = () => { while (ov.firstChild && ov.firstChild !== skip) ov.removeChild(ov.firstChild); };
    const iso = id + '-latest-x86_64.iso';
    const size = 1.2e9 + Math.random() * 3e9;

    const T0 = opts.intro ? -2250 : 0; // Intro: direkt zum BIOS
    const at0 = at;
    const atR = (ms, fn) => at0(Math.max(0, ms + T0), fn);
    if (!opts.intro) { line('$ wget https://iso.distrohopper.org/' + iso); DH.audio.modem(); }
    const prog = opts.intro ? null : line('');
    for (let i = 0; i <= 14 && !opts.intro; i++) {
      at(120 + i * 95, () => {
        const p = i / 14;
        prog.innerHTML = `${iso}  <span class="bar" style="--p:${(p * 100).toFixed(0)}%"><i></i></span> ${String(Math.round(p * 100)).padStart(3)} %  ${U.bytes(size * p)}  ${U.bytes(420e6 + Math.random() * 900e6)}/s`;
      });
    }
    if (!opts.intro) at(1650, () => { line('$ sudo dd if=' + iso + ' of=/dev/sdb bs=4M status=progress'); line(Math.round(size) + ' Bytes (' + U.bytes(size) + ') kopiert, 3,1 s, ' + U.bytes(size / 3.1) + '/s', 'ok'); line('# sdb. Nicht sda. Ganz sicher sdb.', 'warn'); });
    atR(2250, () => { clear(); ov.style.filter = 'brightness(2)'; setTimeout(() => { ov.style.filter = ''; }, 90); line('DistroBIOS v4.20  (C) 1996 Tux Megatrends Inc.'); line('RAM-Test: 640K OK – sollte für jeden reichen.'); line('Boote von USB-Stick „Ventoy“ …'); });
    atR(2900, () => {
      clear();
      line(`Welcome to <span class="hi">${U.esc(d.name)}</span>!`);
      line('');
    });
    const bl = U.shuffle(DH.content.boot).slice(0, 11);
    bl.forEach((l, i) => atR(3000 + i * 95, () => {
      const html = U.esc(l.replace('{user}', d.user)).replace(/^\[  OK  \]/, '[  <span class="ok">OK</span>  ]').replace(/^\[ WARN \]/, '[ <span class="warn">WARN</span> ]');
      line(html);
    }));
    atR(3000 + bl.length * 95 + 150, () => line(`${U.esc(d.name)} – ${U.esc(d.user)} login: <span class="hi">${U.esc(d.user)}</span> (automatisch)`));
    atR(3000 + bl.length * 95 + 650, finish);
    function finish() {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      ov.classList.add('fade');
      done();
      setTimeout(() => { ov.remove(); UI.block(false); }, 550);
      document.removeEventListener('keydown', onKey, true);
    }
    const onKey = (e) => { e.preventDefault(); e.stopPropagation(); finish(); };
    ov.addEventListener('pointerdown', finish);
    document.addEventListener('keydown', onKey, true);
  };

  /* ================================================================= Zwangsupdate */
  UI.windowsUpdate = () => {
    if (UI.blocking() || document.querySelector('#overlay-root > *')) return;
    const g = G();
    g.addBuff({ id: 'winupdate', name: 'Zwangsupdate', kind: 'prod', mult: 0, dur: 7, fixed: true, icon: 'd_windows' });
    const pct = U.h('span', null, '0');
    const ov = U.h('div', { class: 'winupd', role: 'alert' }, U.h('div', null,
      U.h('div', { class: 'spin' }),
      U.h('h2', null, 'Updates werden installiert … ', pct, ' %'),
      U.h('p', null, 'Schalten Sie den Computer nicht aus. Dies kann eine Weile dauern.'),
      U.h('p', { style: { marginTop: '18px', fontSize: '13px', opacity: 0.6 } }, 'Ihr Computer wird möglicherweise mehrmals neu gestartet. Oder auch nicht. Wer weiß das schon.')));
    root().appendChild(ov);
    UI.block(true);
    DH.audio.windowsUpdate();
    let p = 0;
    const iv = setInterval(() => { p = Math.min(100, p + U.randInt(4, 19)); pct.textContent = p; }, 600);
    setTimeout(() => {
      clearInterval(iv);
      ov.remove();
      UI.block(false);
      g.S.stats.updates++;
      g.checkAchievements();
      DH.term.println('Update abgeschlossen. Neue Features: Werbung im Startmenü, Candy Crush.', 'dim');
    }, 7000);
  };

  /* ================================================================= sl-Zug */
  const TRAIN = [
    '                      (  )  ( )   (@@)   ( )    (@)   ',
    '                (@@@)                                 ',
    '           (   )                                      ',
    '        (@@)          ______________________________  ',
    '      ====          |  TUX-EXPRESS · NÄCHSTER HALT: |  ',
    '  _D _|  |_______   |  JAHR DES LINUX-DESKTOPS      |  ',
    '   |(_)---  |   H\\  |_______________________________|  ',
    '   /     |  |   H |__|  []  []  []  []  []  []  [] |  ',
    '  |      |  |   H  |    DISTROHOPPER   ○  ○  ○     |  ',
    '  |________|___H__/____________________________ ___|  ',
    '  |/ |   |------  ||_|______|______|______|______|_|  ',
    ' _/  | o |=-~~\\  /~~\\  /~~\\  /~~\\  /~~\\  /~~\\  /~~\\ ',
    '  \\_/      \\_O=====O=====O=====O=====O=====O=====O_/  ',
  ];
  UI.train = () => {
    const el = U.h('div', { class: 'train', 'aria-hidden': 'true' }, TRAIN.join('\n'));
    document.body.appendChild(el);
    DH.audio.train();
    el.addEventListener('animationend', () => el.remove());
    setTimeout(() => el.remove(), 7000);
  };

  /* ================================================================= Finale */
  DH.bus.on('won', () => setTimeout(() => UI.ending(), 400));
  UI.ending = () => {
    const g = G();
    const cv = document.createElement('canvas');
    cv.width = 26; cv.height = 40;
    const ctx = cv.getContext('2d');
    SP.draw(ctx, 'tuxHappy', 0, 12, 1);
    SP.draw(ctx, 'hat_crown', 0, 12 + 2 - 9, 1);
    const ov = U.h('div', { class: 'ending', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Finale' });
    const lines = U.h('div', { class: 'lines' });
    const roll = U.h('div', { class: 'roll' });
    const CREDITS = [
      ['Idee, Klicks & unzählige Hops', 'Du'], ['Maskottchen', 'Tux'], ['Debugging', 'Die goldene Gummiente'], ['Bugs', 'Kevin'],
      ['Catering', 'Club-Mate, Filterkaffee, kalte Pizza um 3 Uhr'], ['Infrastruktur', 'Ein Raspberry Pi aus der Schublade'],
      ['Rechtsabteilung', 'GPLv2 (nicht v3, Linus mag das nicht)'], ['Hut-Beschaffung', 'Fedora, Red Hat & ein Gecko namens Geeko'],
      ['Besonderer Dank', 'Allen Distro-Maintainern, den Autorinnen und Autoren des Arch-Wikis, #linux-de, der Stack-Overflow-Antwort von 2011'],
      ['Kein Dank an', 'Druckertreiber'], ['Nächstes Jahr', 'Das Jahr des Linux-Kühlschranks'],
    ];
    CREDITS.forEach(([h, p]) => roll.append(U.h('h4', null, h), U.h('p', null, p)));
    const cont = U.h('button', { class: 'btn btn-accent btn-lg', type: 'button', style: { marginTop: '16px' } }, 'Weiterspielen – mit Krone & doppelter Produktion');
    ov.append(
      U.h('img', { class: 'crown-tux', src: cv.toDataURL(), alt: 'Tux mit Krone' }),
      U.h('h1', null, 'Das Jahr des Linux-Desktops ist da!'),
      lines,
      U.h('div', { class: 'credits' }, roll),
      cont,
    );
    root().appendChild(ov);
    UI.block(true);
    DH.audio.fanfare();
    const msgs = [
      'Marktanteil Linux auf dem Desktop: 100 %.',
      'Oma installiert Gentoo. Freiwillig. Und kompiliert mit -O3.',
      'Alle Druckertreiber funktionieren. Sofort. Ohne Neustart.',
      'Microsoft kündigt das „Windows-Subsystem für … Windows“ an.',
      'Die Nachbarn verstehen endlich, was ein Homelab ist.',
      'Und du? Du erzählst es einfach allen. Btw.',
    ];
    msgs.forEach((m, i) => setTimeout(() => { lines.append(U.h('p', null, m)); DH.audio.coin(); }, 900 + i * 1500));
    const conf = setInterval(() => DH.fx.confetti(50), 1400);
    DH.fx.confetti(160);
    cont.addEventListener('click', () => {
      clearInterval(conf);
      ov.remove();
      UI.block(false);
      g.S.settings.hat = 'crown';
      UI.drawTux(true);
      UI.renderPanels();
      UI.tuxSay('Wir haben es geschafft! Und jetzt… einfach weiter. Es gibt noch Erfolge zu holen.', 7000);
      g.save();
    });
  };
})();
