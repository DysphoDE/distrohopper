'use strict';
/* DistroHopper – Start, Spielschleife, Speichern */
(function () {
  const U = DH.util;

  function start(hotData) {
    const G = DH.game;
    let hadSave = G.load();
    if (hotData && hotData.save) {
      try { G.loadFrom(JSON.parse(hotData.save)); hadSave = true; } catch (e) { /* egal */ }
    }
    const S = G.S;
    const awaySec = (Date.now() - S.lastSave) / 1000;
    // Laufzeit nicht durch Abwesenheit „verbrauchen“: Buffs verfallen normal.
    DH.fx.init();
    DH.term.init();
    DH.ui.init();
    DH.events.init();

    if (!hadSave) {
      DH.content.banner.forEach((l) => DH.term.println(l, 'ps'));
      DH.term.println('DistroHopper 1.0 · tty1', 'dim');
      DH.term.println('Willkommen bei Ubuntu! Linux für Menschen.', 'ok');
      DH.term.println('Klick oder tippe ins Terminal, um Code zu schreiben. Jede Zeile bringt Bytes.', '');
      DH.term.println('Bytes kaufen Hardware. Hardware schreibt Code. Du siehst, wohin das führt.', 'dim');
      // Kurzes Boot-Intro beim allerersten Start
      DH.ui.bootAnim('ubuntu', () => {
        setTimeout(() => DH.ui.tuxSay('Hallo! Ich bin Tux. Klick aufs Terminal und schreib ein bisschen Code!', 7000), 500);
      }, { intro: true });
    } else {
      DH.term.println('Willkommen zurück, ' + G.distro().user + '. Letzter Login: ' + new Date(S.lastSave).toLocaleString('de-DE'), 'dim');
      DH.term.neofetch();
    }

    // Offline-Fortschritt
    if (hadSave && awaySec > 60) {
      if (awaySec > 8 * 3600) S.stats.longAway = true;
      const res = G.offlineGain(awaySec);
      if (res.gain > 0) {
        setTimeout(() => DH.ui.offlineModal(awaySec, res.gain, res.eff, () => { G.earn(res.gain); G.checkAchievements(); }), 700);
      }
    }
    // Täglicher Bonus (nicht beim allerersten Start – da gibt es genug Neues); auch für Tabs, die über Mitternacht offen bleiben
    const dailyToast = () => {
      const daily = G.dailyCheck();
      if (!daily || daily.first) return;
      DH.ui.toast({ icon: DH.sprites.url('box'), kicker: 'Uptime-Serie: ' + daily.streak + (daily.streak === 1 ? ' Tag' : ' Tage'), title: 'Tägliches apt upgrade installiert', text: 'Produktion ×' + U.trimDec(daily.mult, 1) + ' für 15 Minuten. Komm morgen wieder, dann wird es mehr!', kind: 'gold', dur: 7000 });
      DH.term.println('[  OK  ] Tägliche Updates installiert (Serie: ' + daily.streak + '). Keine Neustarts erforderlich. Unglaublich.', 'ok');
      G.checkAchievements();
    };
    setTimeout(dailyToast, 1500);
    setInterval(dailyToast, 60000);
    G.checkAchievements();

    // Hot-Reload (Artifact-Umgebung)
    try { if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => ({ save: JSON.stringify(G.S) })); } catch (e) { /* egal */ }

    loop();
    setInterval(step, 1000);           // läuft auch im Hintergrund-Tab (gedrosselt)
    setInterval(() => G.save(), 15000);
    setInterval(() => { G.checkAchievements(); if (G.autoBuy()) DH.ui.updateShop(true); }, 1000);
    setInterval(DH.ui.clock, 10000);
    DH.ui.clock();
    document.addEventListener('visibilitychange', () => { if (document.hidden) G.save(); else step(); });
    window.addEventListener('pagehide', () => G.save());
    window.addEventListener('beforeunload', () => G.save());

    // Service-Worker (nur, wenn über http(s) ausgeliefert und nicht eingebettet)
    if ('serviceWorker' in navigator && location.protocol.startsWith('http') && window.top === window.self && !/(^localhost$|^127\.|claude\.ai$|claudeusercontent)/.test(location.hostname)) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  let lastWall = Date.now();
  function step() {
    const G = DH.game;
    const now = Date.now();
    const dt = (now - lastWall) / 1000;
    lastWall = now;
    if (dt <= 0) return 0;
    if (dt > 120) {
      // Rechner schlief oder Tab war lange im Hintergrund → wie offline behandeln
      const res = G.offlineGain(dt);
      if (res.gain > 0) {
        G.earn(res.gain);
        DH.ui.toast({ icon: DH.sprites.url('tux'), title: 'Wieder da!', text: 'In ' + U.dur(dt) + ' Abwesenheit: +' + U.bytes(res.gain) + ' (Offline-Effizienz ' + U.pct(res.eff) + ')', kind: 'gold', dur: 6000 });
      }
      if (dt > 8 * 3600) G.S.stats.longAway = true;
      return 0;
    }
    G.tick(dt);
    return dt;
  }

  let lastFrame = performance.now();
  let uiAcc = 0;
  function loop() {
    requestAnimationFrame(loop);
    const t = performance.now();
    const fdt = Math.min(0.1, (t - lastFrame) / 1000);
    lastFrame = t;
    step();
    DH.events.tick(fdt);
    DH.fx.frame(fdt);
    DH.ui.frame(fdt);
    uiAcc += fdt;
    if (uiAcc >= 0.1) { uiAcc = 0; DH.ui.update(); }
  }

  function boot() {
    const hot = window.claude && window.claude.hot;
    if (hot && hot.ready) hot.ready(start);
    else start((hot && hot.data) || {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
