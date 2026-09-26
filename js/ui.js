'use strict';
/* DistroHopper – Oberfläche: HUD, Shop, Panels, Tooltips, Tux, Ticker */
(function () {
  const UI = DH.ui = {};
  const U = DH.util, SP = DH.sprites, D = DH.data;
  const G = () => DH.game;
  const E = {};
  let qty = '1';
  let upgKey = null;
  const bldRows = {};
  let blocking = 0;
  let tipState = null; // {kind, id, el, pinned}
  let unseenAch = 0;
  let lastClickAt = Date.now();
  let idleSaid = false;
  const wideMQ = window.matchMedia('(min-width: 1180px)');
  const narrowMQ = window.matchMedia('(max-width: 759.98px)');
  const hoverMQ = window.matchMedia('(hover: hover) and (pointer: fine)');

  UI.blocking = () => blocking > 0;
  UI.block = (on) => { blocking = Math.max(0, blocking + (on ? 1 : -1)); };
  UI.isWide = () => wideMQ.matches;
  UI.isNarrow = () => narrowMQ.matches;
  const canHover = () => hoverMQ.matches;

  /* ================================================================= Init */
  UI.init = () => {
    const ids = ['app', 'bar-bytes', 'bar-rate', 'bar-buffs', 'bar-distro', 'bar-distro-ico', 'brand-tux', 'irc-btn', 'irc-ico', 'irc-time', 'mute-btn', 'mute-ico', 'clock',
      'tk-text', 'ticker', 'term-title', 'shell-btn', 'term-collapse', 'cnt-bytes', 'cnt-rate', 'cnt-click', 'cnt-raw', 'term-buffs', 'crt', 'crt-hint', 'shell-form', 'shell-in', 'ps1',
      'tux', 'bubble', 'distro-chip', 'beard-chip', 'kbd', 'tabs', 'w-center', 'p-setup', 'p-ach', 'p-hop', 'p-sys', 'w-shop', 'shop-title', 'buy-qty', 'upg-grid', 'upg-count',
      'buy-all', 'autobuy-wrap', 'autobuy-upg', 'autobld-wrap', 'autobuy-bld', 'bld-list', 'bld-count', 'tip', 'toasts', 'wall-logo', 'badge-shop', 'badge-ach', 'badge-hop'];
    ids.forEach((id) => { E[id.replace(/-(\w)/g, (m, c) => c.toUpperCase())] = document.getElementById(id); });

    const S = G().S;
    qty = S.settings.qty || '1';
    U.settings.notation = S.settings.notation;

    E.brandTux.src = SP.url('tux');
    E.ircIco.src = SP.url('chat');
    // Tab-Icons
    const tabIcons = { shop: 'box', setup: 'monitor', ach: 'trophy', hop: 'disc', sys: 'gear' };
    E.tabs.querySelectorAll('.tab').forEach((b) => { b.querySelector('img').src = SP.url(tabIcons[b.dataset.tab]); });

    buildKeyboard();
    buildBuildings();
    bindEvents();
    UI.applyTheme();
    applySettings();
    UI.setTab(S.settings.tab || (UI.isNarrow() ? 'shop' : 'setup'), true);
    UI.renderPanels();
    tickerNext();
    if (S.stats.clicks > 0) E.crtHint.hidden = true;
  };

  /* ================================================================= Theme */
  function hexToRgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgba(hex, a) { const [r, g, b] = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; }
  function lum(hex) { const [r, g, b] = hexToRgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
  function mix(a, b, t) { const A = hexToRgb(a), B = hexToRgb(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }

  UI.applyTheme = () => {
    const S = G().S, d = G().distro();
    const st = document.documentElement.style;
    st.setProperty('--accent', d.color);
    st.setProperty('--accent-2', SP.shade(d.color, 0.35));
    st.setProperty('--accent-ink', lum(d.color) > 0.36 ? '#0d1016' : '#ffffff');
    st.setProperty('--accent-soft', rgba(d.color, 0.16));
    st.setProperty('--wall1', d.color);
    st.setProperty('--wall2', d.color2);
    document.body.classList.toggle('pink', d.id === 'hannah');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mix(d.color2, '#07090d', 0.7));
    applyScheme();
    // Wallpaper-Logo
    const wl = E.wallLogo.getContext('2d');
    wl.clearRect(0, 0, 32, 32);
    wl.imageSmoothingEnabled = false;
    const logo = SP.canvas('d_' + d.id);
    if (logo) wl.drawImage(logo, 0, 0, 32, 32);
    E.barDistro.textContent = d.short || d.name;
    E.barDistroIco.src = SP.url('d_' + d.id);
    E.termTitle.textContent = d.user + '@' + d.id + ': ~';
    const pmName = d.pm.split(' ').filter((x) => x !== 'sudo')[0];
    E.shopTitle.textContent = '~/pakete — ' + pmName;
    UI.updatePrompt();
    updateChips();
    drawTux(true);
    DH.audio.musicSong(d.id);
  };

  function applyScheme() {
    const S = G().S, d = G().distro();
    const st = document.documentElement.style;
    let sc = D.schemes.find((x) => x.id === S.settings.scheme);
    if (!sc || !schemeUnlocked(sc)) sc = D.schemes[0];
    let c = sc.c;
    if (!c) {
      c = {
        bg: mix(d.color2, '#030405', 0.86), fg: mix(d.color, '#ffffff', 0.82), dim: mix(d.color, '#7a8390', 0.55),
        prompt: SP.shade(d.color, 0.3), ok: '#7ee787', err: '#ff7b72', warn: '#e3b341', str: mix(d.color, '#ffffff', 0.55), glow: rgba(d.color, 0.32),
      };
    }
    st.setProperty('--t-bg', c.bg); st.setProperty('--t-fg', c.fg); st.setProperty('--t-dim', c.dim); st.setProperty('--t-prompt', c.prompt);
    st.setProperty('--t-ok', c.ok); st.setProperty('--t-err', c.err); st.setProperty('--t-warn', c.warn); st.setProperty('--t-str', c.str); st.setProperty('--t-glow', c.glow);
  }
  UI.applyScheme = applyScheme;

  function unlockOk(un) {
    if (!un) return true;
    const S = G().S, g = G();
    if (un.hops != null && S.hops < un.hops) return false;
    if (un.bytes != null && S.allBytes < un.bytes) return false;
    if (un.ach != null && g.nAch < un.ach) return false;
    if (un.visited != null && g.visitedCount() < un.visited) return false;
    if (un.upgrades != null && S.stats.upgradesBought < un.upgrades) return false;
    if (un.beard != null && S.beard < un.beard) return false;
    if (un.secret && !S.secrets[un.secret]) return false;
    if (un.visitedId && !S.visited[un.visitedId]) return false;
    if (un.clicks != null && S.stats.clicks < un.clicks) return false;
    if (un.upgrade && !S.u[un.upgrade] && !S.stats['had_' + un.upgrade]) return false;
    return true;
  }
  function unlockText(un) {
    if (!un) return '';
    if (un.hops != null) return un.hops + ' Hop' + (un.hops > 1 ? 's' : '');
    if (un.bytes != null) return U.bytes(un.bytes) + ' insgesamt';
    if (un.ach != null) return un.ach + ' Erfolge';
    if (un.visited != null) return un.visited + ' Distros besucht';
    if (un.upgrades != null) return un.upgrades + ' Upgrades gekauft';
    if (un.beard != null) return un.beard + ' Barthaare';
    if (un.secret) return 'Geheimnis';
    if (un.visitedId) return 'Geheime Distro';
    if (un.clicks != null) return U.num(un.clicks) + ' Klicks';
    if (un.upgrade) return 'Upgrade „' + (D.uIndex[un.upgrade] || {}).name + '“';
    return '';
  }
  const schemeUnlocked = (sc) => unlockOk(sc.unl);
  UI.soundUnlocked = (s) => unlockOk(s.unl);

  /* ================================================================= Tastatur */
  const KB = [
    ['^', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ß', '⌫:w15'],
    ['⇥:w15', 'Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü'],
    ['⇪:w15', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä', '↵:w15'],
    ['⇧:w2', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '-', '⇧:w15'],
    ['Strg:w15', '❖', 'Alt', '␣:w6', 'AltGr', 'Strg:w15'],
  ];
  const keyMap = {};
  const allKeys = [];
  function buildKeyboard() {
    E.kbd.innerHTML = '';
    KB.forEach((row, ri) => {
      const r = U.h('div', { class: 'kbd-row' + (ri === 0 ? ' num' : '') });
      row.forEach((k) => {
        const [lab, w] = k.split(':');
        const el = U.h('span', { class: 'key' + (w ? ' ' + w : '') }, lab === '␣' ? '' : lab);
        r.appendChild(el);
        if (!keyMap[lab]) keyMap[lab] = el;
        allKeys.push(el);
      });
      E.kbd.appendChild(r);
    });
  }
  const specialKeys = { ' ': '␣', Backspace: '⌫', Enter: '↵', Tab: '⇥', Shift: '⇧', CapsLock: '⇪', Control: 'Strg', Alt: 'Alt', AltGraph: 'AltGr', Meta: '❖', Dead: '^' };
  function flashKey(el) {
    if (!el) return;
    el.classList.add('on');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('on'), 90);
  }
  function flashRandomKeys(n = 1) {
    for (let i = 0; i < n; i++) flashKey(allKeys[(Math.random() * allKeys.length) | 0]);
  }

  /* ================================================================= Events */
  function bindEvents() {
    // Klick aufs Terminal
    E.crt.addEventListener('pointerdown', (e) => {
      if (e.target.closest('#shell-form')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      DH.audio.init();
      doClick(e.clientX, e.clientY, false);
    });
    E.crt.addEventListener('contextmenu', (e) => e.preventDefault());
    // Auch die virtuelle Tastatur tippt Code
    E.kbd.addEventListener('pointerdown', (e) => {
      const k = e.target.closest('.key');
      if (!k || (e.pointerType === 'mouse' && e.button !== 0)) return;
      e.preventDefault();
      DH.audio.init();
      doClick(e.clientX, e.clientY, true);
      flashKey(k);
    });

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', () => DH.audio.init(), { once: true });

    // Tabs
    E.tabs.addEventListener('click', (e) => {
      const b = e.target.closest('.tab');
      if (b) { UI.setTab(b.dataset.tab); DH.audio.beep && null; }
    });
    wideMQ.addEventListener('change', () => { if (UI.isWide() && E.app.dataset.tab === 'shop') UI.setTab('setup'); });

    // Kaufmenge
    E.buyQty.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      qty = b.dataset.q;
      G().S.settings.qty = qty;
      E.buyQty.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      updateShop();
    });
    E.buyQty.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x.dataset.q === qty));

    E.buyAll.addEventListener('click', () => {
      const n = G().buyAllUpgrades();
      if (n > 0) {
        DH.audio.upgrade();
        UI.toast({ icon: SP.url('box'), title: n + ' Upgrade' + (n > 1 ? 's' : '') + ' installiert', text: 'sudo kauf-alles --sofort ✓', dur: 2500 });
        if (G().visibleUpgrades().filter((u) => u.type !== 'switch' && u.type !== 'final').length === 0) { G().S.stats.buyAllUsed = true; }
        G().checkAchievements();
      } else DH.audio.error();
    });
    E.autobuyUpg.addEventListener('change', () => { G().S.settings.autoUpg = E.autobuyUpg.checked; });
    E.autobuyBld.addEventListener('change', () => { G().S.settings.autoBld = E.autobuyBld.checked; });

    // Upgrades
    E.upgGrid.addEventListener('click', (e) => {
      const b = e.target.closest('.upg');
      if (!b) return;
      const id = b.dataset.id;
      if (canHover()) { buyUpgrade(id, b); return; }
      if (tipState && tipState.pinned && tipState.id === id) { buyUpgrade(id, b); return; }
      showTip('upg', id, b, true);
    });
    E.upgGrid.addEventListener('pointerover', (e) => {
      if (!canHover()) return;
      const b = e.target.closest('.upg');
      if (b) { showTip('upg', b.dataset.id, b); b.classList.remove('new'); G().S.seen['u_' + b.dataset.id] = 1; }
    });
    E.upgGrid.addEventListener('pointerleave', () => { if (canHover()) hideTip(); });

    // Terminal-Chips
    E.distroChip.addEventListener('click', () => UI.setTab('hop'));
    document.getElementById('ws-distro').addEventListener('click', () => UI.setTab('hop'));
    E.beardChip.addEventListener('click', () => UI.setTab('hop'));
    E.tux.addEventListener('pointerdown', (e) => { e.preventDefault(); pokeTux(); });

    E.shellBtn.addEventListener('click', () => UI.toggleShell());
    E.termCollapse.addEventListener('click', () => {
      const on = !document.body.classList.contains('term-collapsed');
      document.body.classList.toggle('term-collapsed', on);
      E.termCollapse.textContent = on ? '▴' : '▾';
      E.termCollapse.setAttribute('aria-label', on ? 'Terminal vergrößern' : 'Terminal verkleinern');
    });
    E.muteBtn.addEventListener('click', () => {
      const S = G().S;
      S.settings.sound = !S.settings.sound;
      DH.audio.init();
      DH.audio.setEnabled(S.settings.sound);
      updateMute();
      const cb = document.getElementById('set-sound');
      if (cb) cb.checked = S.settings.sound;
    });
    E.ircBtn.addEventListener('click', () => DH.events.openIrc());
    E.ticker.addEventListener('click', tickerNext);
    document.getElementById('brand').addEventListener('click', () => UI.aboutModal());

    // Shell
    const submitShell = () => {
      const v = E.shellIn.value;
      E.shellIn.value = '';
      DH.shell.run(v);
      UI.updatePrompt();
    };
    E.shellForm.addEventListener('submit', (e) => { e.preventDefault(); submitShell(); });
    E.shellIn.addEventListener('keydown', (e) => {
      const SH = DH.shell;
      if (e.key === 'Enter') { e.preventDefault(); submitShell(); return; }
      if (e.key === 'Escape') { e.preventDefault(); UI.closeShell(); return; }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!SH.history.length) return;
        SH.hIdx = SH.hIdx < 0 ? SH.history.length - 1 : Math.max(0, SH.hIdx - 1);
        E.shellIn.value = SH.history[SH.hIdx];
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (SH.hIdx < 0) return;
        SH.hIdx++;
        if (SH.hIdx >= SH.history.length) { SH.hIdx = -1; E.shellIn.value = ''; } else E.shellIn.value = SH.history[SH.hIdx];
      } else if (e.key === 'Tab') {
        e.preventDefault();
        E.shellIn.value = SH.complete(E.shellIn.value);
      } else if (e.key.length === 1) {
        DH.audio.key();
        const k = keyMap[e.key.toUpperCase()]; flashKey(k);
      }
    });

    // Tooltip schließen bei Tipp daneben (Touch)
    document.addEventListener('pointerdown', (e) => {
      if (!tipState || !tipState.pinned) return;
      if (e.target.closest('#tip') || (tipState.el && tipState.el.contains(e.target))) return;
      hideTip();
    }, true);
    window.addEventListener('resize', () => { hideTip(); setupSized = false; });
    ['p-setup', 'p-ach', 'p-hop', 'p-sys'].forEach((id) => document.getElementById(id).addEventListener('scroll', () => { if (tipState && !tipState.pinned) hideTip(); }, { passive: true }));
    document.getElementById('p-shop').addEventListener('scroll', () => { if (tipState) hideTip(); }, { passive: true });
  }

  UI.isTab = (t) => {
    const cur = E.app.dataset.tab;
    if (t === 'shop') return UI.isWide() || cur === 'shop';
    if (t === 'setup' && UI.isWide() && cur === 'shop') return true;
    return cur === t;
  };

  UI.setTab = (t, silent) => {
    if (UI.isWide() && t === 'shop') t = 'setup';
    E.app.dataset.tab = t;
    G().S.settings.tab = t;
    E.tabs.querySelectorAll('.tab').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === t ? 'true' : 'false'));
    hideTip();
    if (t === 'ach') { unseenAch = 0; UI.renderAch(); }
    if (t === 'hop') { G().S.tut.hopSeen = true; G().S.tut.hopAck = G().S.hops; UI.renderHop(); }
    if (t === 'sys') UI.renderSys();
    if (t === 'setup') setupSized = false;
    if (t === 'shop') updateShop(true);
    if (!silent) DH.audio.key('rubber');
    UI.updateBadges();
  };

  /* ================================================================= Klicken */
  let clickTimes = [];
  function doClick(x, y, fromKey) {
    const now = performance.now();
    // Gleitfenster: höchstens 40 Klicks pro Sekunde (Mehrfinger-Taps bleiben erlaubt)
    while (clickTimes.length && now - clickTimes[0] > 1000) clickTimes.shift();
    if (clickTimes.length >= 40) return;
    clickTimes.push(now);
    const g = G(), S = g.S;
    const v = g.doClick();
    lastClickAt = Date.now(); idleSaid = false;
    DH.term.type(U.randInt(2, 6));
    if (S.settings.particles) {
      DH.fx.text(x, y - 8, '+' + U.bytes(v), g.clickBuff > 1 ? '#ffd23f' : '#ffe8a3', g.clickBuff > 1 ? 28 : 22);
      DH.fx.bits(x, y, fromKey ? 2 : 4);
    }
    DH.audio.key();
    E.crt.classList.add('flash');
    clearTimeout(E.crt._ft);
    E.crt._ft = setTimeout(() => E.crt.classList.remove('flash'), 60);
    if (!fromKey) flashRandomKeys(U.randInt(1, 2));
    if (!E.crtHint.hidden) E.crtHint.hidden = true;
    if (S.stats.clicks % 12 === 0) tuxBounce();
  }
  UI.vibrate = (ms) => { if (G().S.settings.vibrate && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* egal */ } } };

  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiPos = 0;
  let keyClicks = [];
  function onKey(e) {
    // Konami
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === konami[konamiPos]) {
      konamiPos++;
      if (konamiPos === konami.length) {
        konamiPos = 0;
        if (G().secret('konami')) {
          G().addBuff({ id: 'konami', name: '30 Leben', kind: 'prod', mult: 3, dur: 30, icon: 'star' });
          UI.toast({ icon: SP.url('star'), title: '30 Leben erhalten!', text: 'Bringt hier eigentlich nichts. Aber: Produktion ×3 für 30 s.', kind: 'gold' });
          DH.audio.fanfare();
        }
      }
    } else konamiPos = k === konami[0] ? 1 : 0;

    if (e.ctrlKey && e.altKey && (e.key === 't' || e.key === 'T')) { e.preventDefault(); UI.toggleShell(); return; }
    const tgt = e.target;
    if (tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.tagName === 'SELECT')) return;
    if (UI.blocking() || document.querySelector('#overlay-root > *')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const S = G().S;
    if (!S.settings.keysAsClicks) return;
    if (e.repeat) return;
    if (/^(F\d+|Escape|Tab|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|PageUp|PageDown|Home|End|Insert|Delete|Shift|Control|Alt|Meta|CapsLock|AltGraph|ContextMenu|Unidentified)$/.test(e.key)) return;
    const ae = document.activeElement;
    if ((e.key === ' ' || e.key === 'Enter') && ae && ae !== document.body && ae !== E.crt) return;
    // max 20 Tasten-Klicks pro Sekunde
    const now = performance.now();
    keyClicks = keyClicks.filter((t) => now - t < 1000);
    if (keyClicks.length >= 20) return;
    keyClicks.push(now);
    if (e.key === ' ') e.preventDefault();
    const r = E.crt.getBoundingClientRect();
    const x = r.width > 20 ? U.rand(r.left + r.width * 0.2, r.right - r.width * 0.2) : window.innerWidth / 2;
    const y = r.height > 20 ? U.rand(r.top + r.height * 0.3, r.bottom - r.height * 0.25) : 140;
    DH.audio.init();
    doClick(x, y, true);
    const lab = specialKeys[e.key] || e.key.toUpperCase();
    flashKey(keyMap[lab]);
  }

  /* ================================================================= Shell */
  UI.toggleShell = () => { if (E.shellForm.hidden) UI.openShell(); else UI.closeShell(); };
  UI.openShell = () => {
    E.shellForm.hidden = false;
    E.crt.classList.add('shell-open');
    E.shellBtn.classList.add('on');
    if (document.body.classList.contains('term-collapsed')) E.termCollapse.click();
    UI.updatePrompt();
    E.shellIn.focus();
    if (!G().S.tut.shell) {
      G().S.tut.shell = 1;
      DH.term.println('Willkommen in der DistroHopper-Shell. Tippe „help“. (Esc schließt.)', 'ok');
    }
  };
  UI.closeShell = () => {
    E.shellForm.hidden = true;
    E.crt.classList.remove('shell-open');
    E.shellBtn.classList.remove('on');
    E.shellIn.blur();
    if (DH.shell.mode === 'vim') { /* Vim bleibt offen – man kommt nicht raus! */ }
  };
  UI.updatePrompt = () => { if (E.ps1) E.ps1.textContent = DH.shell.promptText(); };

  /* ================================================================= Gebäude */
  function buildBuildings() {
    E.bldList.innerHTML = '';
    D.buildings.forEach((b) => {
      const row = U.h('button', { class: 'bld', type: 'button', 'data-id': b.id, style: { '--bg-b': b.bg } },
        U.h('img', { src: SP.url(b.id), alt: '' }),
        U.h('span', { class: 'bld-main' },
          U.h('span', { class: 'bld-name' }, b.name),
          U.h('span', { class: 'bld-cost' }, U.h('span', { class: 'cv' }, ''), U.h('span', { class: 'q' }, '')),
          U.h('span', { class: 'bld-rate' }, '')),
        U.h('span', { class: 'bld-count' }, '0'),
        U.h('span', { class: 'bld-info', role: 'button', 'aria-label': 'Details' }, 'i'));
      row.addEventListener('click', (e) => {
        if (e.target.closest('.bld-info')) { e.stopPropagation(); showTip('bld', b.id, row, true); return; }
        buyBuilding(b.id, row, e);
      });
      row.addEventListener('pointerenter', () => { if (canHover()) showTip('bld', b.id, row); });
      row.addEventListener('pointerleave', () => { if (canHover()) hideTip(); });
      E.bldList.appendChild(row);
      bldRows[b.id] = {
        row, img: row.querySelector('img'), name: row.querySelector('.bld-name'), cost: row.querySelector('.cv'), q: row.querySelector('.q'),
        rate: row.querySelector('.bld-rate'), count: row.querySelector('.bld-count'), state: '',
      };
    });
  }

  function buyBuilding(id, row, e) {
    const g = G(), S = g.S;
    const b = D.bIndex[id];
    if (!g.revealed(b)) return;
    const n = g.qtyFor(id, qty);
    const got = g.buyBuilding(id, n);
    if (!got) { DH.audio.error(); DH.fx.shakeEl(row); return; }
    DH.audio.buy();
    UI.vibrate(8);
    row.classList.remove('pulse'); void row.offsetWidth; row.classList.add('pulse');
    const r = row.getBoundingClientRect();
    if (S.settings.particles) DH.fx.sparks(e && e.clientX ? e.clientX : r.left + 30, e && e.clientY ? e.clientY : r.top + 20, 10, b.bg === '#1a1a1e' ? '#ef3e4a' : '#ffd23f');
    DH.term.install(id, got);
    if (!S.seen['b_' + id]) {
      S.seen['b_' + id] = 1;
      UI.tuxSay(b.tux, 5200);
      tuxHappy();
    }
    updateShop(true);
    g.checkAchievements();
    if (tipState && tipState.kind === 'bld') refreshTip();
  }

  function updateShop(force) {
    if (!force && !UI.isTab('shop')) return;
    const g = G(), S = g.S;
    let lockedShown = false;
    let owned = 0;
    for (const b of D.buildings) {
      const r = bldRows[b.id];
      const rev = g.revealed(b);
      let state;
      if (rev) state = 'rev';
      else if (!lockedShown) { state = 'lock'; lockedShown = true; }
      else state = 'hide';
      if (S.b[b.id] > 0) owned++;
      if (state === 'hide') { if (r.state !== 'hide') { r.row.hidden = true; r.state = 'hide'; } continue; }
      if (r.row.hidden) r.row.hidden = false;
      if (state === 'lock') {
        if (r.state !== 'lock') {
          r.row.className = 'bld locked';
          r.img.src = SP.url(b.id);
          U.setText(r.name, '???');
          U.setText(r.rate, 'Noch nicht entdeckt');
          U.setText(r.count, '');
          r.state = 'lock';
        }
        U.setText(r.cost, U.bytes(b.cost * g.bCostMult));
        U.setText(r.q, '');
        continue;
      }
      if (r.state !== 'rev') { r.state = 'rev'; U.setText(r.name, b.name); r.row.classList.remove('locked'); }
      const n = g.qtyFor(b.id, qty);
      const cost = g.bCost(b.id, n);
      const can = S.bytes >= cost;
      // classList statt className, damit laufende Animationen (pulse/shake) nicht abgeschnitten werden
      if (r.row.classList.contains('can') !== can) { r.row.classList.toggle('can', can); r.row.classList.toggle('cant', !can); }
      else if (!r.row.classList.contains('can') && !r.row.classList.contains('cant')) r.row.classList.add(can ? 'can' : 'cant');
      U.setText(r.cost, U.bytes(cost));
      U.setText(r.q, n > 1 ? '×' + n : '');
      U.setText(r.count, S.b[b.id] ? String(S.b[b.id]) : '0');
      const per = g.perUnit[b.id] * g.prodMult;
      U.setText(r.rate, S.b[b.id] ? '+' + U.rate(per) + ' je Stück · ' + U.rate(per * S.b[b.id]) + ' gesamt' : '+' + U.rate(per) + ' je Stück');
    }
    U.setText(E.bldCount, owned ? U.num(g.totalBuildings) + ' insgesamt' : '');
    // Top-Deal: kürzeste Amortisationszeit (Preis ÷ Zusatzproduktion) unter den entdeckten Gebäuden
    let best = null, bestP = Infinity;
    if (S.settings.bestDeal !== false && g.totalBuildings >= 3) {
      for (const b of D.buildings) {
        if (!g.revealed(b)) continue;
        const p = g.bCost(b.id) / Math.max(1e-12, g.perUnit[b.id] * g.prodMult);
        if (p < bestP) { bestP = p; best = b.id; }
      }
    }
    for (const b of D.buildings) bldRows[b.id].row.classList.toggle('best', b.id === best);
    updateUpgrades();
  }
  UI.updateShop = updateShop;

  /* ================================================================= Upgrades */
  function upgIcon(u) {
    const ic = u.icon || {};
    if (ic.tier) return SP.tierIcon(ic.tier, ic.t);
    if (ic.key) return SP.keyIcon(ic.key, ic.tint);
    if (ic.letter) return SP.letterIcon(ic.letter, ic.bg, '#fff');
    if (ic.sprite) return SP.url(ic.sprite, ic.map ? { map: ic.map } : null);
    return SP.url('box');
  }
  UI.upgIcon = upgIcon;

  function updateUpgrades() {
    const g = G(), S = g.S;
    const list = g.visibleUpgrades();
    const key = list.map((u) => u.id).join(',');
    if (key !== upgKey) {
      upgKey = key;
      E.upgGrid.innerHTML = '';
      E.upgGrid.classList.toggle('is-empty', !list.length);
      if (!list.length) E.upgGrid.appendChild(U.h('div', { class: 'upg-empty' }, 'Keine Upgrades verfügbar. Kauf mehr Hardware, dann tauchen neue auf.'));
      list.forEach((u) => {
        const b = U.h('button', {
          class: 'upg' + (u.type === 'switch' ? ' upg-sw' : '') + (u.type === 'final' ? ' final' : '') + (S.seen['u_' + u.id] ? '' : ' new'),
          type: 'button', 'data-id': u.id, 'aria-label': u.name,
        }, U.h('img', { src: upgIcon(u), alt: '' }));
        E.upgGrid.appendChild(b);
      });
    }
    let can = 0;
    for (const el of E.upgGrid.children) {
      const u = D.uIndex[el.dataset && el.dataset.id];
      if (!u) continue;
      const ok = S.bytes >= g.uCost(u);
      if (ok && u.type !== 'switch') can++;
      if (el.classList.contains('can') !== ok) el.classList.toggle('can', ok);
    }
    U.setText(E.upgCount, list.length ? can + ' leistbar · ' + list.length + ' verfügbar' : '');
    E.buyAll.hidden = !(g.flags.buyAll && can > 0);
    E.autobuyWrap.hidden = !g.flags.autoUpg;
    E.autobldWrap.hidden = !g.flags.autoBld;
    E.autobuyUpg.checked = !!S.settings.autoUpg;
    E.autobuyBld.checked = !!S.settings.autoBld;
    UI._canUpg = can;
  }

  function buyUpgrade(id, el) {
    const g = G();
    const u = D.uIndex[id];
    if (!u) return;
    if (u.type === 'final') {
      if (g.S.bytes < g.uCost(u)) { DH.audio.error(); DH.fx.shakeEl(el); return; }
      hideTip();
      UI.confirm({
        title: 'Das Jahr des Linux-Desktops ausrufen?', icon: SP.url('calendar'),
        text: 'Du investierst ' + U.bytes(g.uCost(u)) + ' in das größte Versprechen der IT-Geschichte. Danach geht es weiter – aber nichts wird mehr sein wie vorher.',
        ok: 'Jetzt ist es so weit!', onOk: () => { if (g.buyUpgrade(id)) { DH.audio.fanfare(); } },
      });
      return;
    }
    if (u.type === 'switch' && g.S.bytes >= g.uCost(u)) {
      const others = D.upgrades.filter((x) => x.group === u.group && x.id !== u.id).map((x) => x.name).join(', ');
      hideTip();
      UI.confirm({
        title: D.switchGroups[u.group].name + ': ' + u.name + '?', icon: upgIcon(u),
        text: u.fx + '. Damit sind ' + others + ' für diesen Run raus. Glaubenskriege kennen keine Kompromisse.',
        ok: 'Ich wähle ' + u.name, onOk: () => { if (g.buyUpgrade(id)) { DH.audio.upgrade(); UI.toast({ icon: upgIcon(u), title: u.name + ' gewählt', text: 'Du hast dich im Glaubenskrieg „' + D.switchGroups[u.group].name + '“ positioniert.' }); g.checkAchievements(); updateShop(true); } },
      });
      return;
    }
    if (!g.buyUpgrade(id)) { DH.audio.error(); DH.fx.shakeEl(el); return; }
    DH.audio.upgrade();
    const r = el.getBoundingClientRect();
    if (g.S.settings.particles) DH.fx.sparks(r.left + r.width / 2, r.top + r.height / 2, 16, '#a86fff');
    DH.term.println('[  OK  ] Upgrade installiert: ' + u.name, 'ok');
    g.S.seen['u_' + id] = 1;
    hideTip();
    updateShop(true);
    g.checkAchievements();
  }

  /* ================================================================= Tooltips / Popover */
  function effText(u) {
    const g = G();
    switch (u.type) {
      case 'tier': { const b = D.bIndex[u.b]; return b.plural + ' produzieren doppelt so viel.'; }
      case 'syn': { const A = D.bIndex[u.a], B = D.bIndex[u.b]; return A.plural + ' +5 % je ' + B.name + ' · ' + B.plural + ' +0,1 % je ' + A.name + '.'; }
      case 'click': return u.fx + '.';
      case 'prod': return 'Gesamtproduktion +' + Math.round(u.add * 100) + ' %.';
      case 'cat': return 'Bonus durch Erfolge (Nerd-Cred) +50 %.';
      case 'duck': {
        const p = [];
        if (u.freq) p.push('Enten erscheinen ' + Math.round((u.freq - 1) * 100) + ' % öfter');
        if (u.dur) p.push('Enten-Effekte halten ' + Math.round((u.dur - 1) * 100) + ' % länger');
        if (u.pow) p.push('Enten-Effekte +' + Math.round((u.pow - 1) * 100) + ' %');
        return p.join(' · ') + '.';
      }
      case 'bug': {
        const p = [];
        if (u.bugMult) p.push('Bugs geben ' + u.bugMult + '× so viel');
        if (u.bugFreq) p.push('Bugs krabbeln ' + Math.round((u.bugFreq - 1) * 100) + ' % öfter');
        return p.join(' · ') + '.';
      }
      case 'switch': return u.fx + '.';
      case 'final': return u.fx;
      default: return '';
    }
  }

  function tipUpg(id) {
    const g = G(), S = g.S, u = D.uIndex[id];
    if (!u) return '';
    const cost = g.uCost(u);
    const can = S.bytes >= cost;
    const kind = { tier: 'Upgrade · ' + (D.bIndex[u.b] || {}).plural, syn: 'Synergie', click: 'Tastatur', prod: 'Produktion', cat: 'Katze', duck: 'Gummiente', bug: 'Debugging', switch: 'Glaubenskrieg · ' + (D.switchGroups[u.group] || {}).name, final: 'Das Finale' }[u.type] || 'Upgrade';
    let extra = '';
    if (u.type === 'switch') {
      const others = D.upgrades.filter((x) => x.group === u.group && x.id !== u.id).map((x) => x.name).join(', ');
      extra = `<div class="tip-row">Schließt für diesen Run aus: <b>${U.esc(others)}</b></div>`;
    }
    if (u.type === 'final') extra = `<div class="tip-row">Voraussetzungen: ${U.num(u.unl.beard)} Barthaare, ${u.unl.visited} besuchte Distros ✓</div>`;
    const wait = !can && g.bps > 0 ? `<div class="tip-row">Noch <b>${U.dur((cost - S.bytes) / g.bps)}</b> bei aktueller Rate</div>` : '';
    return `<div class="tip-h"><img src="${upgIcon(u)}" alt=""><div><div class="tip-k">${U.esc(kind)}</div><div class="tip-t">${U.esc(u.name)}</div></div><div class="tip-cost ${can ? '' : 'no'}">${U.bytes(cost)}</div></div>
      <div class="tip-fx">${U.esc(effText(u))}</div>${extra}${wait}<div class="tip-fl">„${U.esc(u.flavor)}“</div>`;
  }
  function tipBld(id) {
    const g = G(), S = g.S, b = D.bIndex[id];
    if (!g.revealed(b)) return `<div class="tip-h"><img src="${SP.url(b.id, { silhouette: '#2b303b' })}" alt=""><div><div class="tip-k">Hardware</div><div class="tip-t">???</div></div></div><div class="tip-row">Verdiene mehr Bytes, um dieses Gebäude zu entdecken.</div>`;
    const n = g.qtyFor(id, qty);
    const cost = g.bCost(id, n);
    const per = g.perUnit[id] * g.prodMult;
    const tot = per * S.b[id];
    const share = g.bpsBase > 0 ? tot / g.bpsBase : 0;
    const nextT = [1, 5, 25, 50, 100, 150, 200, 250, 300, 350, 400].find((x) => x > S.b[id]);
    return `<div class="tip-h"><img src="${SP.url(b.id)}" alt=""><div><div class="tip-k">Hardware · ${S.b[id]} Stück</div><div class="tip-t">${U.esc(b.name)}</div></div><div class="tip-cost ${S.bytes >= cost ? '' : 'no'}">${U.bytes(cost)}${n > 1 ? ' <small>(×' + n + ')</small>' : ''}</div></div>
      <div class="tip-row">Pro Stück: <b>${U.rate(per)}</b></div>
      ${S.b[id] ? `<div class="tip-row">Zusammen: <b>${U.rate(tot)}</b> (${U.pct(share, 1)} deiner Produktion)</div>` : ''}
      ${nextT ? `<div class="tip-row">Nächstes Upgrade ab <b>${nextT}</b> Stück</div>` : ''}
      ${S.bytes < cost && g.bps > 0 ? `<div class="tip-row">Leistbar in <b>${U.dur((cost - S.bytes) / g.bps)}</b></div>` : ''}
      <div class="tip-row">Amortisiert sich in <b>${U.dur(g.bCost(id) / Math.max(1e-12, per))}</b></div>
      <div class="tip-fl">„${U.esc(b.desc)}“</div>`;
  }
  function tipAch(id) {
    const S = G().S, a = D.aIndex[id];
    const on = !!S.ach[id];
    const hidden = a.secret && !on;
    const cat = D.achCats[a.cat];
    const when = on ? new Date(S.ach[id]).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
    let prog = '';
    if (!on && !hidden && a.prog) {
      const [cur, max] = a.prog(S, G());
      const f = a.fmt === 'b' ? U.bytes : a.fmt === 'r' ? U.rate : a.fmt === 't' ? U.dur : (v) => U.num(v);
      const p = a.fmt === 'b' || a.fmt === 'r' ? Math.log10(Math.max(1, cur)) / Math.log10(Math.max(10, max)) : cur / max;
      prog = `<div class="tip-row" style="display:flex;gap:8px;align-items:center"><span class="progress" style="min-width:0"><i style="--p:${(U.clamp(p, 0, 1) * 100).toFixed(1)}%"></i></span><b style="white-space:nowrap">${f(Math.min(cur, max))} / ${f(max)}</b></div>`;
    }
    return `<div class="tip-h"><img src="${achIcon(a, on)}" alt=""><div><div class="tip-k">${U.esc(cat[0])}${a.secret ? ' · geheim' : ''}</div><div class="tip-t">${hidden ? '???' : U.esc(a.name)}</div></div></div>
      <div class="tip-row">${hidden ? 'Ein geheimer Erfolg. Probier Dinge aus, die man nicht ausprobieren sollte.' : U.esc(a.desc)}</div>
      ${prog}<div class="tip-row">${on ? '<span class="good">✓ Freigeschaltet am ' + when + '</span> · +1 % Produktion' : '<span class="muted">Noch gesperrt</span>'}</div>`;
  }
  function tipDot(id) {
    const S = G().S, d = D.dfIndex[id];
    const owned = !!S.dotfiles[id];
    const avail = G().dotfileAvailable(d);
    return `<div class="tip-h"><img src="${SP.url('floppy')}" alt=""><div><div class="tip-k">Dotfile · dauerhaft</div><div class="tip-t">${U.esc(d.path)}</div></div><div class="tip-cost" style="color:var(--karma)">${U.num(d.cost)} Karma</div></div>
      <div class="tip-fx">${U.esc(d.fx)}</div>
      <div class="tip-row">${owned ? '<span class="good">✓ Installiert</span>' : !avail ? '<span class="bad">Benötigt zuerst die übergeordnete Datei.</span>' : S.karma >= d.cost ? '<span class="good">Leistbar</span>' : '<span class="muted">Noch ' + U.num(d.cost - S.karma) + ' Karma</span>'}</div>
      <div class="tip-fl" style="font-family:var(--f-crt);font-size:15px;font-style:normal;white-space:pre-wrap">${U.esc(d.flavor)}</div>`;
  }
  function tipDistro(id) {
    const g = G(), S = g.S, d = D.dIndex[id];
    const un = g.distroUnlocked(d);
    return `<div class="tip-h"><img src="${SP.url('d_' + d.id, un ? null : { silhouette: '#2b303b' })}" alt=""><div><div class="tip-k">Distro${S.visited[id] ? ' · besucht ×' + S.visited[id] : ''}</div><div class="tip-t">${U.esc(d.name)}</div></div></div>
      <div class="tip-row" style="color:${d.color};font-weight:700">${U.esc(d.tag)}</div>
      <div class="tip-row">${U.esc(d.desc)}</div>
      <ul class="perks">${d.perks.map((p) => `<li class="p${p[1]}">${U.esc(p[0])}</li>`).join('')}</ul>
      ${un ? '' : `<div class="tip-row bad">Benötigt ${U.num(d.need)} Barthaare (du hast ${U.num(S.beard)}).</div>`}`;
  }
  const TIPS = { upg: tipUpg, bld: tipBld, ach: tipAch, dot: tipDot, distro: tipDistro };

  function showTip(kind, id, el, pinned) {
    tipState = { kind, id, el, pinned: !!pinned };
    if (kind === 'upg' && el) { el.classList.remove('new'); G().S.seen['u_' + id] = 1; }
    E.tip.innerHTML = TIPS[kind](id) + (pinned ? tipAction(kind, id) : '');
    E.tip.style.pointerEvents = pinned ? 'auto' : 'none';
    E.tip.hidden = false;
    placeTip();
    if (pinned) {
      const btn = E.tip.querySelector('[data-act]');
      if (btn) btn.addEventListener('click', () => tipAct(kind, id));
    }
  }
  function tipAction(kind, id) {
    const g = G(), S = g.S;
    if (kind === 'upg') {
      const u = D.uIndex[id];
      const ok = S.bytes >= g.uCost(u);
      return `<div style="margin-top:10px;display:flex;gap:8px;align-items:center"><button class="btn btn-accent" data-act="buy" ${ok ? '' : 'disabled'} style="flex:1">${ok ? 'Kaufen' : 'Zu teuer'}</button><span class="muted" style="font-size:11px">oder nochmal tippen</span></div>`;
    }
    if (kind === 'dot') {
      const d = D.dfIndex[id];
      if (S.dotfiles[id]) return '';
      const ok = S.karma >= d.cost && g.dotfileAvailable(d);
      return `<div style="margin-top:10px"><button class="btn btn-accent" data-act="buy" ${ok ? '' : 'disabled'} style="width:100%">Installieren (${U.num(d.cost)} Karma)</button></div>`;
    }
    return '';
  }
  function tipAct(kind, id) {
    if (kind === 'upg') { const el = E.upgGrid.querySelector(`[data-id="${id}"]`); buyUpgrade(id, el || E.upgGrid); }
    if (kind === 'dot') { UI.buyDotfile(id); hideTip(); }
  }
  function refreshTip() {
    if (!tipState || E.tip.hidden) return;
    if (tipState.el && !document.body.contains(tipState.el)) { hideTip(); return; }
    if (tipState.pinned) return; // Buttons nicht zerstören
    const html = TIPS[tipState.kind](tipState.id);
    if (E.tip._h !== html) { E.tip.innerHTML = html; E.tip._h = html; }
  }
  function placeTip() {
    const el = tipState && tipState.el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const tw = E.tip.offsetWidth, th = E.tip.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    let x, y;
    if (tipState.pinned || UI.isNarrow()) {
      x = r.left + r.width / 2 - tw / 2;
      y = r.top - th - 10;
      if (y < 8) y = r.bottom + 10;
    } else {
      x = r.left - tw - 12;
      if (x < 8) x = r.right + 12;
      y = r.top + r.height / 2 - th / 2;
    }
    x = U.clamp(x, 8, vw - tw - 8);
    y = U.clamp(y, 8, vh - th - 8);
    E.tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  }
  function hideTip() { tipState = null; if (E.tip) { E.tip.hidden = true; E.tip._h = ''; } }
  UI.hideTip = hideTip;
  UI.showTip = showTip;

  /* ================================================================= Zähler & Buffs */
  let lastBuffKey = '';
  let lastDiscover = 0;
  let sysTick = 0;
  UI.update = () => {
    const g = G(), S = g.S;
    U.setText(E.cntBytes, U.bytes(S.bytes, true));
    U.setText(E.cntRate, U.rate(g.bps));
    E.cntRate.style.color = g.prodBuff > 1.01 ? 'var(--gold)' : g.prodBuff < 0.99 ? 'var(--bad)' : '';
    U.setText(E.cntClick, '+' + U.bytes(g.click));
    U.setText(E.cntRaw, S.bytes < 1e15 ? U.group(S.bytes) + ' Bytes' : S.bytes.toExponential(4).replace('.', ',') + ' Bytes');
    U.setText(E.barBytes, U.bytes(S.bytes));
    U.setText(E.barRate, U.rate(g.bps));
    updateBuffs();
    updateShop();
    UI.updateBadges();
    updateChips();
    if (UI.isTab('hop')) updateHop();
    if (UI.isTab('setup')) updateSetupStats();
    if (UI.isTab('sys') && ++sysTick % 10 === 1) updateSys();
    refreshTip();
    // Tutorial-Hinweise
    if (!S.tut.buy && S.bytes >= 15 && g.totalBuildings === 0) {
      S.tut.buy = 1;
      UI.toast({ icon: SP.url('bash'), title: 'Dein erstes Bash-Skript', text: UI.isWide() ? 'Rechts im Paket-Fenster kaufen – es tippt dann für dich weiter.' : 'Im Tab „Pakete“ kaufen – es tippt dann für dich weiter.', kind: 'hint', dur: 7000 });
    }
    if (!S.tut.hop && g.canHop()) {
      S.tut.hop = 1;
      UI.toast({ icon: SP.url('disc'), title: 'Distro-Hop möglich!', text: 'Du hast genug Bytes für dein erstes Barthaar. Im Tab „Hop“ kannst du die Distro wechseln und dauerhafte Boni sammeln.', kind: 'hint', dur: 9000 });
      UI.tuxSay('Pssst! Du kannst jetzt hoppen. Neue Distro, Barthaare, Dotfiles – schau mal in den Hop-Tab!', 6000);
    }
    // Neue Distros erreichbar? (höchstens alle 4 s eine Meldung)
    if (g.canHop() && Date.now() - lastDiscover > 4000) {
      for (const d of D.distros) {
        if (d.secret || d.need === 0 || S.seen['d_' + d.id] || !g.distroUnlocked(d)) continue;
        S.seen['d_' + d.id] = 1;
        lastDiscover = Date.now();
        UI.toast({ icon: SP.url('d_' + d.id), kicker: S.beard >= d.need ? 'Distro freigeschaltet' : 'Beim nächsten Hop verfügbar', title: d.name, text: d.tag + ' – ' + d.perks.map((p) => p[0]).slice(0, 2).join(', '), kind: 'hint', dur: 6500, onClick: () => UI.setTab('hop') });
        S.tut.hopAck = -1;
        break;
      }
    }
    // Neu entdeckte Hardware (einmalig, höchstens alle 4 s eine Meldung)
    if (Date.now() - lastDiscover > 4000) {
      for (const b of D.buildings) {
        if (S.seen['r_' + b.id] || b.idx < 2 || !g.revealed(b)) continue;
        S.seen['r_' + b.id] = 1;
        lastDiscover = Date.now();
        UI.toast({ icon: SP.url(b.id), kicker: 'Neue Hardware entdeckt', title: b.name, text: b.desc, dur: 4500 });
        break;
      }
    }
    // Erstes leistbares Upgrade
    if (!S.tut.upg && (UI._canUpg || 0) > 0) {
      S.tut.upg = 1;
      const u = g.visibleUpgrades().find((x) => S.bytes >= g.uCost(x));
      UI.toast({ icon: u ? upgIcon(u) : SP.url('box'), title: 'Dein erstes Upgrade!', text: 'Upgrades (oben im Paket-Fenster) verbessern Klicks oder Hardware dauerhaft für diesen Run.', kind: 'hint', dur: 6500 });
    }
    // Erster Glaubenskrieg
    if (!S.tut.sw && g.upgradeVisible(D.uIndex.sw_vim)) {
      S.tut.sw = 1;
      UI.toast({ icon: SP.letterIcon('VIM', '#019733', '#fff'), kicker: 'Glaubenskrieg', title: 'Vim, Emacs oder nano?', text: 'Upgrades mit ⚔ schließen sich gegenseitig aus – du wählst eine Seite pro Run. Nach dem Hop darfst du neu entscheiden.', kind: 'hint', dur: 8000 });
    }
    // Musik-Tipp nach ein paar Minuten
    if (!S.tut.music && !S.settings.music && S.stats.playTime > 240 && S.stats.clicks > 50) {
      S.tut.music = 1;
      UI.tuxSay('Psst: Unter System → Optionen gibt es Chiptune-Musik. Jede Distro klingt anders!', 7000);
    }
    // Idle-Kommentar
    if (!idleSaid && Date.now() - lastClickAt > 60000 && S.stats.clicks > 20) { idleSaid = true; UI.tuxSay(U.pick(DH.content.tuxIdle), 4000); }
  };

  function updateBuffs() {
    const g = G(), S = g.S, now = Date.now();
    const act = S.buffs.filter((b) => b.end > now);
    // Dauerhafte Distro-Anzeigen als „Buff“
    const sp = g.distro().special;
    if (sp === 'gentoo') act.push({ id: 'gentoo', name: 'USE-Flags optimiert', kind: 'prod', mult: Math.round(g.gentooMult * 100) / 100, end: now + 1e9, dur: 1e9, icon: 'd_gentoo', perm: g.gentooMult >= 6 ? 'max.' : 'kompiliert …' });
    if (sp === 'subscription') act.push({ id: 'rhel', name: 'Support-Abo aktiv', kind: 'prod', mult: 4, end: now + 1e9, dur: 1e9, icon: 'd_rhel', perm: '−1 %/min' });
    const key = act.map((b) => b.id + b.mult).join('|');
    if (key !== lastBuffKey) {
      lastBuffKey = key;
      const compact = act.length > 3;
      const mk = (b, short) => {
        const cls = 'buff' + (b.mult < 1 ? ' bad' : b.id === 'frenzy' || b.id === 'clickfrenzy' || b.id === 'special' ? ' gold' : '');
        const ic = b.icon ? (D.bIndex[b.icon] || SP.S[b.icon] ? SP.url(b.icon) : SP.url('star')) : SP.url('star');
        const mult = b.mult === 0 ? '⏸' : '×' + U.trimDec(b.mult, b.mult < 10 ? 2 : 0);
        return U.h('span', { class: cls, 'data-id': b.id, title: b.name + ' ' + mult }, U.h('img', { src: ic, alt: '' }), U.h('span', { class: 'bn' }, short ? mult : b.name + ' ' + mult), U.h('span', { class: 'bt' }, ''));
      };
      E.termBuffs.innerHTML = ''; E.barBuffs.innerHTML = '';
      act.forEach((b) => E.termBuffs.appendChild(mk(b, compact)));
      act.slice(0, 5).forEach((b) => E.barBuffs.appendChild(mk(b, true)));
      if (act.length > 5) E.barBuffs.appendChild(U.h('span', { class: 'buff more' }, '+' + (act.length - 5)));
    }
    for (const box of [E.termBuffs, E.barBuffs]) {
      for (const el of box.children) {
        const b = act.find((x) => x.id === el.dataset.id);
        if (!b) continue;
        const left = (b.end - now) / 1000;
        U.setText(el.lastChild, b.perm || U.clockDur(left));
        el.style.setProperty('--p', b.perm ? '100%' : Math.max(0, Math.min(100, (left / b.dur) * 100)) + '%');
      }
    }
  }

  function updateChips() {
    const g = G(), S = g.S, d = g.distro();
    const dk = d.id + S.hops;
    if (E.distroChip._k !== dk) {
      E.distroChip._k = dk;
      E.distroChip.innerHTML = '';
      E.distroChip.append(U.h('img', { src: SP.url('d_' + d.id), alt: '' }), (d.short || d.name));
    }
    const bk = S.beard + '|' + Math.round(g.beardMult * 100);
    if (E.beardChip._k !== bk) {
      E.beardChip._k = bk;
      E.beardChip.innerHTML = '';
      E.beardChip.append(U.h('img', { src: SP.url('beard'), alt: '' }), U.h('b', null, U.num(S.beard)), U.h('span', { class: 'ck' }, ' +' + U.num((g.beardMult - 1) * 100) + ' %'));
    }
  }

  let badgeTick = 0;
  UI.updateBadges = () => {
    const g = G(), S = g.S;
    const shopVisible = UI.isTab('shop');
    // Ist der Shop nicht sichtbar, aktualisiert updateShop() die Zahl nicht – hier ohne DOM nachrechnen (2×/s)
    if (!shopVisible && ++badgeTick % 5 === 0) {
      UI._canUpg = g.visibleUpgrades().filter((u) => u.type !== 'switch' && u.type !== 'final' && S.bytes >= g.uCost(u)).length;
    }
    const can = UI._canUpg || 0;
    const bShop = !shopVisible && can > 0;
    E.badgeShop.hidden = !bShop;
    if (bShop) U.setText(E.badgeShop, String(Math.min(99, can)));
    E.badgeAch.hidden = !(unseenAch > 0 && !UI.isTab('ach'));
    if (!E.badgeAch.hidden) U.setText(E.badgeAch, String(Math.min(99, unseenAch)));
    // Punkt am Hop-Tab: erster möglicher Hop, neue Distro erreichbar, oder Hop lohnt sich deutlich
    const worth = g.pendingHairs() >= Math.max(3, S.beard * 0.5);
    const hopDot = g.canHop() && !UI.isTab('hop') && (!S.tut.hopSeen || S.tut.hopAck === -1 || (worth && S.tut.hopAck !== S.hops));
    E.badgeHop.hidden = !hopDot;
    E.badgeHop.className = 'badge dot';
    // Anfänger: Punkt am Paket-Tab, solange Hardware leistbar ist
    if (!shopVisible && !bShop && g.totalBuildings < 3 && S.bytes >= g.bCost('bash')) { E.badgeShop.hidden = false; E.badgeShop.className = 'badge dot'; E.badgeShop.textContent = ''; }
    else E.badgeShop.className = 'badge';
  };

  /* ================================================================= IRC-Knopf */
  UI.showIrc = () => { E.ircBtn.hidden = false; };
  UI.hideIrc = () => { E.ircBtn.hidden = true; };
  UI.setIrcTime = (s) => U.setText(E.ircTime, Math.max(0, Math.ceil(s)) + ' s');

  function updateMute() {
    const on = G().S.settings.sound;
    E.muteIco.src = SP.url(on ? 'speaker' : 'speakerOff');
    E.muteBtn.setAttribute('aria-label', on ? 'Ton ausschalten' : 'Ton einschalten');
  }

  function applySettings() {
    const S = G().S;
    U.settings.notation = S.settings.notation;
    DH.audio.enabled = S.settings.sound;
    DH.audio.vol = S.settings.vol;
    DH.audio.setEnabled(S.settings.sound);
    DH.audio.setVolume(S.settings.vol);
    const snd = D.sounds.find((x) => x.id === S.settings.keySound);
    DH.audio.keyKind = snd && UI.soundUnlocked(snd) ? snd.id : 'rubber';
    DH.audio.musicVolume(S.settings.mvol);
    DH.audio.musicSet(!!S.settings.music);
    DH.fx.enabled = S.settings.particles;
    DH.fx.shake = S.settings.shake;
    document.body.classList.toggle('no-crt', !S.settings.crt);
    E.ticker.hidden = !S.settings.news;
    updateMute();
  }
  UI.applySettings = applySettings;

  /* ================================================================= Uhr & Ticker */
  UI.clock = () => {
    const d = new Date();
    U.setText(E.clock, String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'));
    const h = d.getHours();
    if (h >= 2 && h < 5 && !G().S.stats.night) { G().S.stats.night = true; G().checkAchievements(); }
  };

  let tkTimer = null, tkType = null;
  function tickerNext() {
    const S = G().S;
    const conds = DH.content.newsIf.filter(([c]) => { try { return c(S); } catch (e) { return false; } });
    let msg;
    if (conds.length && Math.random() < 0.45) msg = U.pick(conds)[1](S);
    else msg = U.pick(DH.content.news);
    clearInterval(tkType);
    let i = 0;
    E.tkText.textContent = '';
    const caret = U.h('span', { class: 'tk-caret' });
    const txt = document.createTextNode('');
    E.tkText.append(txt, caret);
    tkType = setInterval(() => {
      i += 2;
      txt.data = msg.slice(0, i);
      if (i >= msg.length) { clearInterval(tkType); setTimeout(() => caret.remove(), 1500); }
    }, 22);
    clearTimeout(tkTimer);
    tkTimer = setTimeout(tickerNext, Math.max(8000, msg.length * 110));
  }

  /* ================================================================= Toasts */
  UI.toast = (o) => {
    const el = U.h('div', { class: 'toast' + (o.kind ? ' toast--' + o.kind : ''), role: 'status' },
      o.icon ? U.h('img', { src: o.icon, alt: '' }) : null,
      U.h('div', null, o.kicker ? U.h('div', { class: 'tk' }, o.kicker) : null, U.h('div', { class: 'tt' }, o.title), o.text ? U.h('div', { class: 'tx' }, o.text) : null));
    E.toasts.appendChild(el);
    while (E.toasts.children.length > (UI.isNarrow() ? 2 : 3)) E.toasts.firstChild.remove();
    const kill = () => { el.classList.add('out'); setTimeout(() => el.remove(), 260); };
    el.addEventListener('click', () => { kill(); if (o.onClick) o.onClick(); });
    setTimeout(kill, o.dur || 4600);
  };

  /* ================================================================= Tux */
  const tux = { blink: 0, nextBlink: 3, happy: 0, bob: 0, t: 0 };
  let tuxCtx = null;
  const HAT_DY = { shades: -8, pipe: -11, ninja: -8, headset: -4 };
  function currentHat() {
    const S = G().S, d = G().distro();
    const h = S.settings.hat;
    if (h === 'none') return null;
    if (h === 'crown') return S.won ? 'crown' : d.hat;
    if (h && h !== 'auto') return h;
    return d.hat;
  }
  function drawTux(force) {
    if (!E.tux) return;
    if (!tuxCtx) { tuxCtx = E.tux.getContext('2d'); E.tux.width = 26; E.tux.height = 40; }
    const ctx = tuxCtx;
    const frame = tux.happy > 0 ? 'tuxHappy' : tux.blink > 0 ? 'tuxBlink' : 'tuxBig';
    const bob = tux.bob;
    const key = frame + bob + currentHat();
    if (!force && E.tux._k === key) return;
    E.tux._k = key;
    ctx.clearRect(0, 0, 26, 40);
    const top = 12 + bob;
    SP.draw(ctx, frame, 0, top, 1);
    const hat = currentHat();
    if (hat && SP.S['hat_' + hat]) {
      const rows = SP.S['hat_' + hat].length;
      const dy = HAT_DY[hat] != null ? top + HAT_DY[hat] : top + 2 - (rows - 1);
      SP.draw(ctx, 'hat_' + hat, 0, dy, 1);
    }
  }
  UI.drawTux = drawTux;
  function tuxBounce() { E.tux.classList.remove('hop'); void E.tux.offsetWidth; E.tux.classList.add('hop'); }
  function tuxHappy() { tux.happy = 1.2; tuxBounce(); }
  UI.tuxHappy = tuxHappy;
  let bubbleTimer = null;
  let lastSay = 0;
  UI.tuxSay = (text, ms = 4000) => {
    lastSay = Date.now();
    E.bubble.textContent = text;
    E.bubble.hidden = false;
    E.bubble.style.animation = 'none'; void E.bubble.offsetWidth; E.bubble.style.animation = '';
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => { E.bubble.hidden = true; }, ms);
  };
  const pokeLines = ['Hey!', 'Das kitzelt!', 'Ich bin kein Button!', 'Hör auf, mich anzustupsen!', 'Klick lieber das Terminal!', '*quak*? Nein, ich bin ein Pinguin.', 'Na gut, noch einmal.', 'Ich rufe gleich den Kernel-Maintainer!'];
  function pokeTux() {
    const S = G().S;
    S.stats.tuxPokes++;
    tuxHappy();
    DH.audio.coin();
    UI.tuxSay(pokeLines[Math.min(pokeLines.length - 1, Math.floor(S.stats.tuxPokes / 3)) % pokeLines.length], 2200);
    G().checkAchievements();
  }
  let tuxChat = 70;
  UI.frame = (dt) => {
    tux.t += dt;
    if (tux.happy > 0) tux.happy -= dt;
    if (tux.blink > 0) tux.blink -= dt;
    tux.nextBlink -= dt;
    if (tux.nextBlink <= 0) { tux.blink = 0.14; tux.nextBlink = U.rand(2.5, 5.5); }
    tux.bob = Math.sin(tux.t * 2.2) > 0.6 ? 1 : 0;
    drawTux();
    tuxChat -= dt;
    if (tuxChat <= 0) {
      tuxChat = U.rand(120, 220);
      if (Date.now() - lastSay > 30000 && !UI.blocking()) UI.tuxSay(U.pick(DH.content.tuxRandom), 5500);
    }
    // Setup-Szene mit 30 fps reicht völlig und schont den Akku
    setupAcc += dt;
    if (UI.isTab('setup') && setupAcc >= 1 / 30) { renderSetup(setupAcc); setupAcc = 0; }
  };
  let setupAcc = 0;

  /* ================================================================= Panels */
  UI.renderPanels = () => { UI.renderSetupShell(); UI.renderAch(); UI.renderHop(); UI.renderSys(); };

  /* ----------------------------------------------------------- Setup */
  let setupCv, setupCtx, setupSized = false, setupT = 0;
  // Pro Run erreichbar: alles außer den Glaubenskriegen, davon je Gruppe eins
  const REACHABLE_UPG = D.upgrades.filter((u) => u.type !== 'switch').length + Object.keys(D.switchGroups).length;
  const floaters = [];
  UI.renderSetupShell = () => {
    const P = E.pSetup;
    P.innerHTML = '';
    P.append(
      U.h('div', { class: 'ph' }, U.h('div', null, U.h('h2', null, 'Dein Setup'), U.h('div', { class: 'sub' }, 'Alles, was für dich Bytes schaufelt – live aus dem Serverraum.'))),
      U.h('div', { class: 'setup-stats', id: 'setup-stats' },
        stat('Produktion', 'st-bps'), stat('Pro Klick', 'st-click'), stat('Hardware', 'st-bld'), stat('Upgrades', 'st-upg'), stat('Laufzeit', 'st-run')),
      U.h('div', { class: 'setup-wrap', id: 'setup-wrap' }, U.h('canvas', { id: 'setup-cv' }), U.h('div', { class: 'setup-empty', id: 'setup-empty' }, U.h('div', null, U.h('b', null, 'Noch ziemlich leer hier.'), 'Kauf dein erstes Bash-Skript im Paket-Fenster – dann zieht hier Leben ein.'))),
    );
    setupCv = document.getElementById('setup-cv');
    setupCtx = setupCv.getContext('2d');
    setupSized = false;
  };
  function stat(k, id) { return U.h('div', { class: 'stat' }, U.h('div', { class: 'k' }, k), U.h('div', { class: 'v', id }, '–')); }
  function updateSetupStats() {
    const g = G(), S = g.S;
    const q = (id) => document.getElementById(id);
    U.setText(q('st-bps'), U.rate(g.bps));
    U.setText(q('st-click'), U.bytes(g.click));
    U.setText(q('st-bld'), U.num(g.totalBuildings));
    U.setText(q('st-upg'), g.upgradesOwned + ' / ' + REACHABLE_UPG);
    U.setText(q('st-run'), U.dur(g.runSeconds()));
  }
  function renderSetup(dt) {
    if (!setupCv) return;
    const g = G(), S = g.S;
    const owned = D.buildings.filter((b) => S.b[b.id] > 0);
    const empty = document.getElementById('setup-empty');
    if (empty) empty.hidden = owned.length > 0;
    if (!owned.length) floaters.length = 0;
    const narrow = UI.isNarrow();
    const ROW = narrow ? 48 : 58;
    const w = setupCv.parentElement.clientWidth;
    const h = Math.max(200, owned.length * ROW);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (!setupSized || setupCv._w !== w || setupCv._h !== h) {
      setupCv.width = Math.round(w * dpr); setupCv.height = Math.round(h * dpr);
      setupCv.style.height = h + 'px';
      setupCv._w = w; setupCv._h = h; setupSized = true;
    }
    setupT += dt;
    const ctx = setupCtx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);
    const labelW = narrow ? 104 : 150;
    const scale = narrow ? 2 : 2.5;
    const sz = 16 * scale;
    const gap = narrow ? 26 : 32;
    owned.forEach((b, ri) => {
      const y = ri * ROW;
      const grd = ctx.createLinearGradient(0, 0, w, 0);
      grd.addColorStop(0, b.bg); grd.addColorStop(0.7, 'rgba(0,0,0,0.15)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd; ctx.fillRect(0, y, w, ROW - 2);
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(0, y + ROW - 2, w, 2);
      // Boden-Linie
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(labelW, y + ROW - 8, w - labelW, 4);
      // Beschriftung
      ctx.fillStyle = '#e6edf3';
      ctx.font = (narrow ? '17px' : '20px') + ' VT323, monospace';
      ctx.fillText(b.short.length > 14 && narrow ? b.short.slice(0, 13) + '…' : b.short, 10, y + ROW / 2 - 2);
      ctx.fillStyle = '#ffd166';
      ctx.font = (narrow ? '20px' : '24px') + ' VT323, monospace';
      ctx.fillText('×' + U.num(S.b[b.id]), 10, y + ROW / 2 + (narrow ? 16 : 20));
      const avail = w - labelW - 12;
      const fit = Math.max(1, Math.floor((avail - sz) / gap) + 1);
      const n = S.b[b.id];
      const show = Math.min(n, fit);
      const more = n - show;
      for (let i = 0; i < show; i++) {
        const bob = Math.round(Math.sin(setupT * 3 + i * 0.9 + ri * 1.7) * 1.5);
        const x = labelW + i * gap;
        if (more > 0 && i === show - 1) break;
        SP.draw(ctx, b.id, x, y + (ROW - sz) / 2 - 3 + bob, scale);
      }
      if (more > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '22px VT323, monospace';
        ctx.fillText('+' + U.num(more + 1), labelW + (show - 1) * gap + 4, y + ROW / 2 + 7);
      }
      // aufsteigende Bytes
      if (Math.random() < dt * Math.min(4, 0.6 + show * 0.15) && S.settings.particles) {
        const i = U.randInt(0, Math.max(0, show - (more > 0 ? 2 : 1)));
        floaters.push({ x: labelW + i * gap + sz / 2, y: y + 12, t: 0, ch: Math.random() < 0.5 ? '0' : '1' });
      }
    });
    ctx.font = '14px VT323, monospace';
    for (let i = floaters.length - 1; i >= 0; i--) {
      const f = floaters[i];
      f.t += dt;
      if (f.t > 1.2) { floaters.splice(i, 1); continue; }
      ctx.globalAlpha = 1 - f.t / 1.2;
      ctx.fillStyle = '#7ee787';
      ctx.fillText(f.ch, f.x, f.y - f.t * 22);
    }
    ctx.globalAlpha = 1;
    if (floaters.length > 120) floaters.splice(0, floaters.length - 120);
  }

  /* ----------------------------------------------------------- Erfolge */
  function achIcon(a, on) {
    const cc = D.achCats[a.cat][1];
    if (!on) return SP.url(a.icon || (a.id.startsWith('bl1_') || a.id.startsWith('bl50_') || a.id.startsWith('bl100_') || a.id.startsWith('bl200_') ? a.id.split('_')[1] : 'trophy'));
    if (a.icon) return SP.url(a.icon);
    if (a.cat === 'bld' && a.id.includes('_')) return SP.url(a.id.split('_')[1]);
    const catSprite = { event: a.id.startsWith('dk') ? 'duck' : a.id.startsWith('bg') ? 'bugA' : a.id.startsWith('irc') ? 'chat' : a.id.startsWith('qz') ? 'star' : 'trophy', beard: a.id.startsWith('df') ? 'floppy' : 'beard', hop: 'disc', secret: 'star' }[a.cat];
    if (catSprite && catSprite !== 'trophy') return SP.url(catSprite);
    return SP.url('trophy', { map: { y: cc, Y: SP.shade(cc, -0.35), e: SP.shade(cc, 0.55) } });
  }
  UI.achIcon = achIcon;
  let achRendered = false;
  UI.renderAch = (freshId) => {
    const S = G().S, g = G();
    const P = E.pAch;
    const total = D.achievements.length;
    const got = g.nAch;
    P.innerHTML = '';
    P.append(U.h('div', { class: 'ph' }, U.h('div', null, U.h('h2', null, 'Erfolge'), U.h('div', { class: 'sub' }, 'Jeder Erfolg gibt +1 % Produktion (Nerd-Cred). Katzen-Upgrades verstärken das.'))));
    const pct = got / total;
    P.append(U.h('div', { class: 'ach-sum' },
      U.h('div', { class: 'big-num', style: { color: 'var(--gold)' } }, got + ' / ' + total),
      U.h('div', { class: 'progress', style: { '--p': (pct * 100).toFixed(1) + '%' } }, U.h('i')),
      U.h('div', { class: 'muted' }, 'Bonus: ×' + U.trimDec(g.achMult, 2))));
    const cats = Object.keys(D.achCats);
    cats.forEach((c) => {
      const list = D.achievements.filter((a) => a.cat === c);
      const n = list.filter((a) => S.ach[a.id]).length;
      P.append(U.h('div', { class: 'sec-h' }, U.h('span', null, D.achCats[c][0]), U.h('span', { class: 'sec-sub' }, n + ' / ' + list.length)));
      const grid = U.h('div', { class: 'ach-grid' });
      list.forEach((a) => {
        const on = !!S.ach[a.id];
        const t = U.h('button', { class: 'ach ' + (on ? 'on' : 'off') + (a.secret ? ' secret' : '') + (freshId === a.id ? ' fresh' : ''), type: 'button', style: { '--cc': D.achCats[c][1] }, 'aria-label': on || !a.secret ? a.name : 'Geheimer Erfolg' },
          (a.secret && !on) ? null : U.h('img', { src: achIcon(a, on), alt: '' }));
        t.addEventListener('pointerenter', () => { if (canHover()) showTip('ach', a.id, t); });
        t.addEventListener('pointerleave', () => { if (canHover()) hideTip(); });
        t.addEventListener('click', () => { if (!canHover()) showTip('ach', a.id, t, true); });
        grid.appendChild(t);
      });
      P.append(grid);
    });
    achRendered = true;
  };

  /* ----------------------------------------------------------- Hop */
  UI.renderHop = () => {
    const g = G(), S = g.S, d = g.distro();
    const P = E.pHop;
    P.innerHTML = '';
    P.append(U.h('div', { class: 'ph' }, U.h('div', null, U.h('h2', null, 'Distro-Hop'), U.h('div', { class: 'sub' }, 'Neu installieren, Bart wachsen lassen, Dotfiles mitnehmen.'))));

    const grid = U.h('div', { class: 'hop-grid' });
    // Aktuelle Distro
    grid.append(U.h('div', { class: 'card distro-card' },
      U.h('img', { class: 'distro-logo', src: SP.url('d_' + d.id), alt: '' }),
      U.h('div', { style: { minWidth: 0 } },
        U.h('div', { class: 'muted', style: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em' } }, 'Aktuell installiert'),
        U.h('h3', null, d.name), U.h('div', { class: 'tag' }, d.tag),
        U.h('ul', { class: 'perks' }, d.perks.map((p) => U.h('li', { class: 'p' + p[1] }, p[0]))),
        U.h('div', { class: 'muted', style: { marginTop: '8px', fontSize: '11.5px' }, id: 'hop-run' }, ''))));
    // Bart & Karma
    const por = U.h('canvas', { id: 'portrait', width: 32, height: 32 });
    grid.append(U.h('div', { class: 'card beard-card' }, por,
      U.h('div', { style: { minWidth: 0 } },
        U.h('div', { class: 'muted', style: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em' } }, 'Dein Bart'),
        U.h('div', { class: 'big-num beard', id: 'hop-beard' }, U.num(S.beard)),
        U.h('dl', { class: 'kv' },
          U.h('dt', null, 'Produktion'), U.h('dd', { id: 'hop-bmult' }, ''),
          U.h('dt', null, 'Karma'), U.h('dd', { id: 'hop-karma', style: { color: 'var(--karma)' } }, ''),
          U.h('dt', null, 'Hops'), U.h('dd', null, U.num(S.hops))))));
    P.append(grid);
    drawPortrait(por);

    // Hop-Karte
    const hop = U.h('div', { class: 'card hop-card', style: { marginTop: '10px' } },
      U.h('div', { class: 'hop-gain' },
        U.h('div', null, U.h('div', { class: 'lbl' }, 'Beim Hop erhältst du'), U.h('div', { class: 'big-num beard', id: 'hop-gain' }, '+0')),
        U.h('div', null, U.h('div', { class: 'lbl' }, 'Karma'), U.h('div', { class: 'big-num karma', id: 'hop-gain-k' }, '+0')),
        U.h('div', { style: { flex: '1', minWidth: '160px' } },
          U.h('div', { class: 'lbl', id: 'hop-next-l' }, 'Nächstes Barthaar'),
          U.h('div', { class: 'progress beard', id: 'hop-prog' }, U.h('i')),
          U.h('div', { class: 'hop-note', id: 'hop-next' }, ''))),
      U.h('div', { class: 'btn-row' }, U.h('button', { class: 'btn btn-accent btn-lg', id: 'hop-btn', type: 'button' }, U.h('img', { src: SP.url('disc'), alt: '' }), 'GRUB öffnen & Distro wechseln')),
      U.h('div', { class: 'hop-note' }, 'Beim Hop werden Bytes, Hardware, Upgrades und Glaubenskriege zurückgesetzt. Du behältst Barthaare, Karma, Dotfiles, Erfolge und freigeschaltete Distros. Danach läuft alles 3 Minuten lang ×2,5 („Frisch installiert“).'));
    P.append(hop);
    hop.querySelector('#hop-btn').addEventListener('click', () => UI.openGrub());

    // Endziel
    const fin = D.uIndex.final;
    const goal = U.h('div', { class: 'card goal-card', style: { marginTop: '10px' } },
      U.h('div', { class: 'goal-h' }, U.h('img', { src: SP.url('calendar'), alt: '' }),
        U.h('div', null, U.h('div', { class: 'lbl' }, S.won ? 'Erreicht!' : 'Endziel'), U.h('div', { class: 'goal-t' }, 'Das Jahr des Linux-Desktops'))),
      U.h('div', { class: 'goal-rows', id: 'goal-rows' }));
    P.append(goal);
    goal.dataset.cost = fin.cost;

    // Hop-Historie
    if (S.hopLog && S.hopLog.length) {
      P.append(U.h('div', { class: 'sec-h' }, U.h('span', null, 'Letzte Hops'), U.h('span', { class: 'sec-sub' }, 'die jüngsten zuerst')));
      const hl = U.h('div', { class: 'card hop-log' });
      S.hopLog.slice().reverse().forEach((h) => {
        const a = D.dIndex[h.from], b = D.dIndex[h.to];
        if (!a || !b) return;
        hl.append(U.h('div', { class: 'hl-row' },
          U.h('span', { class: 'hl-n' }, '#' + h.n),
          U.h('img', { src: SP.url('d_' + a.id), alt: '' }), U.h('span', { class: 'hl-arrow' }, '→'), U.h('img', { src: SP.url('d_' + b.id), alt: '' }),
          U.h('span', { class: 'hl-name' }, b.short || b.name),
          U.h('span', { class: 'hl-gain' }, '+' + U.num(h.gain)),
          U.h('span', { class: 'hl-meta' }, U.dur(h.sec) + ' · ' + U.bytes(h.bytes))));
      });
      P.append(hl);
    }

    // Distros
    P.append(U.h('div', { class: 'sec-h' }, U.h('span', null, 'Distros'), U.h('span', { class: 'sec-sub' }, Object.keys(S.visited).filter((k) => D.dIndex[k]).length + ' besucht')));
    const dg = U.h('div', { class: 'distro-grid' });
    D.distros.forEach((x) => {
      if (x.secret && !S.visited[x.id] && !(x.id === 'hannah' && S.unlocked.hannah)) return;
      const un = g.distroUnlocked(x);
      const el = U.h('button', { class: 'dg' + (x.id === d.id ? ' cur' : '') + (un ? '' : ' locked') + (S.visited[x.id] ? ' visited' : ''), type: 'button' },
        U.h('img', { src: SP.url('d_' + x.id), alt: '' }), U.h('span', null, x.short || x.name),
        U.h('small', null, x.id === d.id ? 'aktuell' : S.visited[x.id] ? '✓ besucht' : un ? (S.beard >= x.need ? 'bereit' : 'nach Hop') : U.num(x.need) + ' Haare'));
      el.addEventListener('pointerenter', () => { if (canHover()) showTip('distro', x.id, el); });
      el.addEventListener('pointerleave', () => { if (canHover()) hideTip(); });
      el.addEventListener('click', () => { if (!canHover()) showTip('distro', x.id, el, true); });
      dg.appendChild(el);
    });
    P.append(dg);

    // Dotfiles
    P.append(U.h('div', { class: 'sec-h' }, U.h('span', null, 'Dotfiles'), U.h('span', { class: 'sec-sub', id: 'dot-sum' }, ''), U.h('span', { class: 'sp' }), U.h('span', { class: 'sec-sub', style: { color: 'var(--karma)' }, id: 'dot-karma' }, '')));
    P.append(U.h('div', { class: 'muted', style: { fontSize: '12px', marginBottom: '8px' } }, 'Deine Konfiguration zieht mit auf jede neue Distro um. Dauerhafte Boni, bezahlt mit Karma.'));
    const tree = U.h('div', { class: 'tree', id: 'dot-tree' });
    P.append(tree);
    renderTree();
    updateHop();
  };

  function drawPortrait(cv) {
    const S = G().S;
    const b = S.beard;
    const stage = b <= 0 ? 0 : b < 10 ? 1 : b < 50 ? 2 : b < 250 ? 3 : b < 1000 ? 4 : b < 5000 ? 5 : b < 25000 ? 6 : b < 100000 ? 7 : 8;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, 32, 32);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(SP.portrait(stage, '#4a3322', G().distro().color), 0, 0);
  }

  function treeLines() {
    // Baum aus parent-Beziehungen
    const kids = {};
    D.dotfiles.forEach((d) => { if (d.parent) (kids[d.parent] = kids[d.parent] || []).push(d); });
    const out = [];
    const walk = (node, prefix, last, depth) => {
      out.push({ d: node, prefix: depth === 0 ? '' : prefix + (last ? '└── ' : '├── ') });
      const ch = kids[node.id] || [];
      ch.forEach((c, i) => walk(c, depth === 0 ? '' : prefix + (last ? '    ' : '│   '), i === ch.length - 1, depth + 1));
    };
    walk(D.dfIndex.home, '', true, 0);
    return out;
  }
  function renderTree() {
    const tree = document.getElementById('dot-tree');
    if (!tree) return;
    const S = G().S, g = G();
    tree.innerHTML = '';
    treeLines().forEach(({ d, prefix }) => {
      const owned = !!S.dotfiles[d.id];
      const avail = g.dotfileAvailable(d);
      const can = !d.dir && !owned && avail && S.karma >= d.cost;
      const cls = 'tr' + (d.dir ? ' dir' : '') + (owned ? ' owned' : '') + (can ? ' can' : '') + (!d.dir && !avail ? ' locked' : '') + (!d.dir && !owned && avail && !can ? ' poor' : '');
      const el = U.h(d.dir ? 'div' : 'button', { class: cls, type: d.dir ? null : 'button' },
        U.h('span', { class: 'br' }, prefix),
        U.h('span', { class: 'fn' }, d.path),
        d.dir ? null : U.h('span', { class: 'fx' }, d.fx),
        d.dir ? null : U.h('span', { class: 'cost' }, owned ? '✓' : [U.h('img', { src: SP.url('karma'), alt: '' }), U.num(d.cost)]));
      if (!d.dir) {
        el.addEventListener('click', () => {
          if (canHover()) UI.buyDotfile(d.id);
          else showTip('dot', d.id, el, true);
        });
        el.addEventListener('pointerenter', () => { if (canHover()) showTip('dot', d.id, el); });
        el.addEventListener('pointerleave', () => { if (canHover()) hideTip(); });
      }
      tree.appendChild(el);
    });
    const tot = D.dotfiles.filter((x) => !x.dir).length;
    U.setText(document.getElementById('dot-sum'), Object.keys(S.dotfiles).length + ' / ' + tot + ' installiert');
  }
  UI.buyDotfile = (id) => {
    const g = G(), d = D.dfIndex[id];
    if (g.S.dotfiles[id]) return;
    if (!g.dotfileAvailable(d)) { DH.audio.error(); UI.toast({ icon: SP.url('lock'), title: 'Abhängigkeit fehlt', text: 'Installiere zuerst die übergeordnete Datei.', kind: 'bad', dur: 3000 }); return; }
    if (!g.buyDotfile(id)) { DH.audio.error(); UI.toast({ icon: SP.url('karma'), title: 'Zu wenig Karma', text: 'Hoppe, um mehr Karma zu sammeln.', kind: 'bad', dur: 2500 }); return; }
    DH.audio.upgrade();
    UI.toast({ icon: SP.url('floppy'), title: d.path + ' installiert', text: d.fx, kind: 'hint', dur: 3500 });
    DH.term.println('[  OK  ] ~/' + d.path.replace(/\s.*$/, '') + ' verlinkt (stow). ' + d.fx, 'ok');
    renderTree();
    updateShop(true);
    g.checkAchievements();
  };

  let lastKarma = -1;
  function updateHop() {
    const g = G(), S = g.S;
    const q = (id) => document.getElementById(id);
    if (!q('hop-gain')) return;
    const gain = g.hopGain();
    U.setText(q('hop-gain'), '+' + U.num(gain));
    U.setText(q('hop-gain-k'), '+' + U.num(gain));
    U.setText(q('hop-beard'), U.num(S.beard));
    U.setText(q('hop-bmult'), '+' + U.num((g.beardMult - 1) * 100) + ' %');
    U.setText(q('hop-karma'), U.num(S.karma));
    U.setText(q('dot-karma'), U.num(S.karma) + ' Karma');
    U.setText(q('hop-run'), 'Läuft seit ' + U.dur(g.runSeconds()) + ' · ' + U.bytes(S.runBytes) + ' erzeugt');
    const have = g.hairsFor(S.allBytes);
    const cur = g.bytesForHairs(have), next = g.bytesForHairs(have + 1);
    const p = have < 1 ? S.allBytes / g.bytesForHairs(1) : (S.allBytes - cur) / Math.max(1, next - cur);
    q('hop-prog').style.setProperty('--p', (U.clamp(p, 0, 1) * 100).toFixed(1) + '%');
    U.setText(q('hop-next'), have < 1 ? 'Erstes Barthaar bei ' + U.bytes(g.bytesForHairs(1)) + ' insgesamt (noch ' + U.bytes(g.bytesForHairs(1) - S.allBytes) + ')' : 'Noch ' + U.bytes(next - S.allBytes) + ' bis zum nächsten Barthaar');
    const btn = q('hop-btn');
    const can = g.canHop();
    if (btn.disabled === can) btn.disabled = !can;
    if (gain > 0 && g.hopMult > 1) U.setText(q('hop-next-l'), 'Nächstes Barthaar (Hop-Bonus ×' + U.trimDec(g.hopMult, 2) + ')');
    if (S.karma !== lastKarma) { lastKarma = S.karma; renderTree(); }
    // Endziel-Fortschritt
    const gr = q('goal-rows');
    if (gr) {
      const fin = D.uIndex.final;
      const visited = g.visitedCount();
      const rows = [
        ['Barthaare', S.beard, fin.unl.beard, U.num(S.beard) + ' / ' + U.num(fin.unl.beard)],
        ['Besuchte Distros', visited, fin.unl.visited, visited + ' / ' + fin.unl.visited],
        ['Bytes in einem Run', S.runBytes, fin.cost, U.bytes(S.runBytes) + ' / ' + U.bytes(fin.cost)],
      ];
      const html = S.won ? '<div class="goal-row done">✓ Geschafft. Tux trägt jetzt eine Krone.</div>' : rows.map(([k, v, max, t]) => {
        const p = max > 1e6 ? Math.log10(Math.max(1, v)) / Math.log10(max) : v / max;
        return `<div class="goal-row${v >= max ? ' done' : ''}"><span>${v >= max ? '✓ ' : ''}${k}</span><span class="progress"><i style="--p:${(U.clamp(p, 0, 1) * 100).toFixed(1)}%"></i></span><b>${t}</b></div>`;
      }).join('');
      U.setHTML(gr, html);
    }
  }
  UI.updateHop = updateHop;

  /* ----------------------------------------------------------- System */
  UI.renderSys = () => {
    const g = G(), S = g.S, d = g.distro();
    const P = E.pSys;
    P.innerHTML = '';
    P.append(U.h('div', { class: 'ph' }, U.h('div', null, U.h('h2', null, 'System'), U.h('div', { class: 'sub' }, 'Statistiken, Optionen und dein Spielstand.'))));

    // Neofetch (die Zahlen aktualisiert updateSys() live, ohne das Panel neu aufzubauen)
    const neo = U.h('div', { class: 'neo' },
      U.h('pre', null, DH.content.tuxAscii.join('\n')),
      U.h('div', { class: 'info' }, U.h('div', { id: 'neo-info' }),
        U.h('div', { style: { marginTop: '6px' } }, ['#ef3e4a', '#3ddc84', '#ffd23f', '#3d8bff', '#a86fff', '#5ce1e6', '#f4f6f9'].map((c) => U.h('span', { class: 'swatch', style: { background: c } })))));
    P.append(neo);
    updateSys();

    // Optionen
    P.append(U.h('div', { class: 'sec-h' }, 'Optionen'));
    const L = U.h('div', { class: 'card set-list' });
    const toggle = (label, sub, key, after) => {
      const inp = U.h('input', { type: 'checkbox', id: 'set-' + key });
      inp.checked = !!S.settings[key];
      inp.addEventListener('change', () => { S.settings[key] = inp.checked; applySettings(); if (after) after(); });
      L.append(U.h('div', { class: 'set-row' }, U.h('label', { class: 'lab', for: 'set-' + key }, label, sub ? U.h('small', null, sub) : null), U.h('span', { class: 'switch' }, inp, U.h('i'))));
    };
    toggle('Sound', 'Synthetisierte Klicks, Quaken und Fanfaren', 'sound', () => { DH.audio.init(); });
    const vol = U.h('input', { type: 'range', min: 0, max: 1, step: 0.05, id: 'set-vol', 'aria-label': 'Lautstärke' });
    vol.value = S.settings.vol;
    vol.addEventListener('input', () => { S.settings.vol = +vol.value; DH.audio.setVolume(+vol.value); });
    vol.addEventListener('change', () => DH.audio.key());
    L.append(U.h('div', { class: 'set-row' }, U.h('label', { class: 'lab', for: 'set-vol' }, 'Lautstärke'), vol));
    toggle('Chiptune-Musik', 'Prozedural erzeugt – jede Distro hat ihre eigene Melodie', 'music', () => { DH.audio.init(); DH.audio.musicSong(G().S.distro); });
    const mv = U.h('input', { type: 'range', min: 0, max: 1, step: 0.05, id: 'set-mvol', 'aria-label': 'Musiklautstärke' });
    mv.value = S.settings.mvol;
    mv.addEventListener('input', () => { S.settings.mvol = +mv.value; DH.audio.musicVolume(+mv.value); });
    L.append(U.h('div', { class: 'set-row' }, U.h('label', { class: 'lab', for: 'set-mvol' }, 'Musiklautstärke'), mv));
    // Tastatur-Sound
    const ks = U.h('select', { id: 'set-keys' });
    D.sounds.forEach((s) => {
      const ok = UI.soundUnlocked(s);
      const o = U.h('option', { value: s.id, disabled: !ok }, s.name + (ok ? '' : ' 🔒 ' + unlockText(s.unl)));
      if (S.settings.keySound === s.id) o.selected = true;
      ks.append(o);
    });
    ks.addEventListener('change', () => { S.settings.keySound = ks.value; applySettings(); DH.audio.init(); DH.audio.key(); });
    L.append(U.h('div', { class: 'set-row' }, U.h('label', { class: 'lab', for: 'set-keys' }, 'Tastatur-Sound', U.h('small', null, 'Weitere Switches schaltest du durch Klicken frei')), ks));
    // Zahlenformat
    const nf = U.h('select', { id: 'set-notation' });
    [['si', 'Bytes (KB, MB, GB …)'], ['bin', 'Binär (KiB, MiB, GiB …)'], ['short', 'Kurz (Tsd., Mio., Mrd. …)'], ['sci', 'Wissenschaftlich (1,23e9)']].forEach(([v, t]) => {
      const o = U.h('option', { value: v }, t); if (S.settings.notation === v) o.selected = true; nf.append(o);
    });
    nf.addEventListener('change', () => { S.settings.notation = nf.value; applySettings(); UI.renderSys(); updateShop(true); if (nf.value === 'bin') UI.toast({ icon: SP.url('floppy'), title: 'KiB statt KB', text: 'Endlich darf man sich darüber streiten. 1 KiB = 1024 Bytes.', dur: 3500 }); });
    L.append(U.h('div', { class: 'set-row' }, U.h('label', { class: 'lab', for: 'set-notation' }, 'Zahlenformat'), nf));
    toggle('Tastatur als Klick', 'Jeder Tastendruck tippt Code (Hackertyper-Stil)', 'keysAsClicks');
    toggle('Top-Deal markieren', 'Hebt das Gebäude mit dem besten Preis-Leistungs-Verhältnis hervor', 'bestDeal', () => updateShop(true));
    toggle('Partikel & schwebende Zahlen', null, 'particles');
    toggle('CRT-Scanlines', null, 'crt');
    toggle('Wackeln bei Fehlern', null, 'shake');
    toggle('Vibration (Handy)', null, 'vibrate');
    toggle('News-Ticker', null, 'news');
    P.append(L);

    // Kosmetik
    P.append(U.h('div', { class: 'sec-h' }, 'Terminal-Farbschema'));
    const sw = U.h('div', { class: 'swatches' });
    D.schemes.forEach((sc) => {
      const ok = schemeUnlocked(sc);
      const c = sc.c || { bg: mix(d.color2, '#030405', 0.86), fg: mix(d.color, '#ffffff', 0.82), prompt: SP.shade(d.color, 0.3), ok: '#7ee787', err: '#ff7b72', str: '#a5d6ff' };
      const b = U.h('button', { class: 'sw' + (S.settings.scheme === sc.id ? ' on' : '') + (ok ? '' : ' locked'), type: 'button', style: { background: c.bg, color: c.fg } },
        U.h('span', null, sc.name),
        U.h('span', { class: 'pal' }, [c.prompt, c.ok, c.err, c.str || c.fg].map((x) => U.h('i', { style: { background: x } }))),
        ok ? null : U.h('small', null, '🔒 ' + unlockText(sc.unl)));
      b.addEventListener('click', () => {
        if (!ok) { DH.audio.error(); return; }
        S.settings.scheme = sc.id; applyScheme(); UI.renderSys(); DH.audio.key();
      });
      sw.append(b);
    });
    P.append(sw);

    P.append(U.h('div', { class: 'sec-h' }, 'Tux-Hut'));
    const hs = U.h('select', { id: 'set-hat', 'aria-label': 'Tux-Hut' });
    const hatOpts = [['auto', 'Passend zur Distro'], ['none', 'Oben ohne']];
    const seenHats = new Set();
    D.distros.forEach((x) => { if (S.visited[x.id] && !seenHats.has(x.hat)) { seenHats.add(x.hat); hatOpts.push([x.hat, 'Hut von ' + (x.short || x.name)]); } });
    if (S.won) hatOpts.push(['crown', '👑 Krone des Linux-Desktops']);
    hatOpts.forEach(([v, t]) => { const o = U.h('option', { value: v }, t); if ((S.settings.hat || 'auto') === v) o.selected = true; hs.append(o); });
    hs.addEventListener('change', () => { S.settings.hat = hs.value; drawTux(true); tuxHappy(); });
    P.append(U.h('div', { class: 'card set-list' }, U.h('div', { class: 'set-row' }, U.h('div', { class: 'lab' }, 'Kopfbedeckung für Tux', U.h('small', null, 'Hüte sammelst du, indem du Distros besuchst')), hs)));

    // Spielstand
    P.append(U.h('div', { class: 'sec-h' }, 'Spielstand'));
    const ta = U.h('textarea', { id: 'save-ta', placeholder: 'Hier erscheint dein Export – oder füge einen Spielstand ein …', spellcheck: 'false', 'aria-label': 'Spielstand-Text' });
    const saveCard = U.h('div', { class: 'card', style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
      U.h('div', { class: 'muted', style: { fontSize: '12px' } }, 'Automatisch gespeichert alle 15 Sekunden im Browser. Für Backups oder den Umzug aufs Handy: exportieren und woanders einfügen.'),
      U.h('div', { class: 'btn-row' },
        btn('Jetzt speichern', () => { g.save(); UI.toast({ icon: SP.url('floppy'), title: 'Gespeichert', text: 'Alles sicher in localStorage.', dur: 2000 }); }),
        btn('Exportieren', () => {
          ta.value = g.exportSave(); ta.select();
          if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(() => UI.toast({ icon: SP.url('floppy'), title: 'In die Zwischenablage kopiert', dur: 2200 })).catch(() => {});
        }),
        btn('Importieren', () => {
          if (!ta.value.trim()) { UI.toast({ icon: SP.url('lock'), title: 'Nichts zum Importieren', text: 'Füge zuerst einen exportierten Spielstand ins Textfeld ein.', kind: 'bad' }); return; }
          UI.confirm({ title: 'Spielstand importieren?', icon: SP.url('floppy'), text: 'Dein aktueller Fortschritt wird überschrieben.', ok: 'Importieren', onOk: () => {
            try { g.importSave(ta.value); location.reload(); } catch (e) { UI.toast({ icon: SP.url('skull'), title: 'Import fehlgeschlagen', text: 'Das sieht nicht nach einem DistroHopper-Spielstand aus.', kind: 'bad' }); }
          } });
        })),
      ta,
      U.h('div', { class: 'btn-row' }, btn('Alles zurücksetzen …', () => UI.confirm({
        title: 'Wirklich alles löschen?', icon: SP.url('skull'), danger: true,
        text: 'Bart, Karma, Dotfiles, Erfolge – alles weg. Wie rm -rf ~, nur mit Nachfrage. Das kann nicht rückgängig gemacht werden.',
        ok: 'Ja, alles löschen', onOk: () => { g.wipe(true); location.reload(); },
      }), 'btn-danger')));
    P.append(saveCard);

    // Über
    P.append(U.h('div', { class: 'sec-h' }, 'Über DistroHopper'));
    P.append(U.h('div', { class: 'card about', html: `
      <p><b>DistroHopper</b> – das Idle-Game für Leute, die ihr Betriebssystem öfter wechseln als ihre Socken.</p>
      <h3>So spielst du</h3>
      <ul>
        <li>Klick oder tippe aufs <b>Terminal</b> (am PC zählt jede Taste) – so schreibst du Code und verdienst Bytes.</li>
        <li>Kauf <b>Hardware &amp; Helfer</b>, die automatisch Bytes produzieren, und <b>Upgrades</b>, die sie verbessern.</li>
        <li>Klick <b>goldene Gummienten</b>, zerquetsch <b>Bugs</b>, beantworte <b>IRC-Nachrichten</b>.</li>
        <li><b>Hop</b>: Wechsle die Distro. Du verlierst den Run, bekommst aber <b>Barthaare</b> (dauerhafter Bonus) und <b>Karma</b> für <b>Dotfiles</b>. Jede Distro spielt sich anders.</li>
        <li>Ganz am Ende wartet <b>das Jahr des Linux-Desktops</b>.</li>
      </ul>
      <h3>Tastenkürzel</h3>
      <p><kbd>Strg</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> Shell öffnen · <kbd>Esc</kbd> Shell/Dialog schließen · beliebige Taste = Klick</p>
      <p class="muted">Alle Grafiken, Sounds und Texte wurden für dieses Spiel erstellt. Distro-Namen gehören ihren jeweiligen Projekten; dies ist eine liebevolle Parodie. Tux ist das Maskottchen des Linux-Kernels.</p>` }));
  };
  function updateSys() {
    const el = document.getElementById('neo-info');
    if (!el) return;
    const g = G(), S = g.S, d = g.distro();
    const info = [
      ['', `${d.user}@${d.id}`], ['OS', d.name], ['Uptime', U.dur(S.stats.playTime)], ['Hops', U.num(S.hops)], ['Bart', U.num(S.beard) + ' Haare'],
      ['Bytes (Run)', U.bytes(S.runBytes)], ['Bytes (gesamt)', U.bytes(S.allBytes)], ['Rekord-Rate', U.rate(S.stats.maxBps)],
      ['Klicks', U.num(S.stats.clicks) + ' (' + U.bytes(S.stats.clickBytes) + ')'], ['Enten', U.num(S.stats.ducks)], ['Bugs', U.num(S.stats.bugs)],
      ['IRC / Quiz', U.num(S.stats.irc) + ' / ' + U.num(S.stats.quizRight) + ' richtig'], ['Erfolge', g.nAch + ' / ' + D.achievements.length],
      ['Upgrades', U.num(S.stats.upgradesBought) + ' gekauft'], ['Gebäude', U.num(S.stats.buildingsBought) + ' gekauft'],
      ['Uptime-Serie', (S.daily.streak || 0) + ' Tag(e), Rekord ' + (S.daily.best || 0)],
    ];
    U.setHTML(el, info.map(([k, v]) => '<div>' + (k ? '<b>' + U.esc(k) + '</b>: ' + U.esc(v) : '<b>' + U.esc(v) + '</b>') + '</div>').join(''));
  }
  UI.updateSys = updateSys;
  function btn(label, fn, cls) { const b = U.h('button', { class: 'btn ' + (cls || ''), type: 'button' }, label); b.addEventListener('click', fn); return b; }

  // Scrollposition beim Neuzeichnen der Panels erhalten (sonst springt z. B. die Erfolgsliste nach oben)
  const PANEL_EL = { renderAch: 'pAch', renderHop: 'pHop', renderSys: 'pSys' };
  Object.keys(PANEL_EL).forEach((fn) => {
    const orig = UI[fn];
    UI[fn] = (...args) => {
      const el = E[PANEL_EL[fn]];
      const top = el ? el.scrollTop : 0;
      orig(...args);
      if (el) el.scrollTop = top;
    };
  });

  /* ================================================================= Bus-Reaktionen */
  let lastAchSnd = 0;
  DH.bus.on('achievement', (a) => {
    if (!UI.isTab('ach')) unseenAch++;
    if (Date.now() - lastAchSnd > 700) { lastAchSnd = Date.now(); DH.audio.achievement(); }
    UI.toast({ icon: achIcon(a, true), kicker: 'Erfolg freigeschaltet · +1 %', title: a.name, text: a.desc, kind: 'ach', dur: 5200, onClick: () => UI.setTab('ach') });
    DH.term.println('[  OK  ] Erfolg freigeschaltet: ' + a.name, 'ok');
    if (Math.random() < 0.3) UI.tuxSay(U.pick(DH.content.tuxAch), 2800);
    tuxHappy();
    if (UI.isTab('ach')) UI.renderAch(a.id);
  });
  DH.bus.on('fee', (fee) => { DH.term.println('[RHEL] Abo-Gebühr abgebucht: −' + U.bytes(fee) + ' (Support ruft zurück. Irgendwann.)', 'warn'); });
  DH.bus.on('distroUnlocked', () => { if (UI.isTab('hop')) UI.renderHop(); });
  DH.bus.on('buffEnd', (b) => { if (b.id === 'fresh') DH.term.println('[ INFO ] Die frische Installation ist jetzt eingelebt.', 'dim'); });
})();
