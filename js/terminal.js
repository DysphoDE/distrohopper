'use strict';
/* DistroHopper – Das CRT-Terminal: Hackertyper-Stream + eingeschobene Systemzeilen */
(function () {
  const T = DH.term = {};
  const MAX_LINES = 70;
  let box, cur = null, segs = [], segIdx = 0, segPos = 0, codeIdx = 0, cursor;
  let order = [];

  T.init = () => {
    box = document.getElementById('crt-lines');
    cursor = document.createElement('span');
    cursor.className = 'cursor';
    order = shuffledOrder();
    newLine();
  };

  // Code-Stream in Blöcken mischen, damit nicht jeder Run gleich aussieht
  function shuffledOrder() {
    const code = DH.content.code;
    const blocks = [];
    let blk = [];
    code.forEach((l, i) => {
      blk.push(i);
      const next = code[i + 1];
      if (next === undefined || (next.startsWith('$ ') && blk.length > 2) || (l === '' && blk.length > 2)) { blocks.push(blk); blk = []; }
    });
    if (blk.length) blocks.push(blk);
    return DH.util.shuffle(blocks).flat();
  }

  function ps1() {
    const d = DH.game.distro();
    // starship.toml-Dotfile: schicker Prompt im Stil von Oh My Zsh
    if (DH.game.flags && DH.game.flags.prompt) return '➜ ' + d.user + ' ~ git:(main) ✗';
    return d.user + '@' + d.id + ':~$';
  }
  T.ps1 = ps1;

  function parse(line) {
    if (line.startsWith('$ ')) return [{ t: ps1() + ' ', c: 'ps', instant: true }, { t: line.slice(2), c: 'cmd' }];
    let m;
    if ((m = line.match(/^(\[\s*OK\s*\])(.*)$/))) return [{ t: m[1], c: 'ok' }, { t: m[2], c: '' }];
    if ((m = line.match(/^(\[(FAILED| WARN )\])(.*)$/))) return [{ t: m[1], c: m[2] === 'FAILED' ? 'err' : 'warn' }, { t: m[3], c: '' }];
    if (/^\s*(#(?!include|!)|\/\/|--|;|\(gdb\))/.test(line)) return [{ t: line, c: 'dim' }];
    if (/(error|Fehler|fehler|rejected|denied|CrashLoop|vulnerabilities|Speicherzugriffsfehler)/.test(line)) return [{ t: line, c: 'err' }];
    if (/(warning|warn:)/i.test(line)) return [{ t: line, c: 'warn' }];
    if (/^\s*(#include|#!\/)/.test(line)) return [{ t: line, c: 'kw' }];
    return [{ t: line, c: '' }];
  }

  function newLine() {
    const code = DH.content.code;
    if (codeIdx >= order.length) { codeIdx = 0; order = shuffledOrder(); }
    const text = code[order[codeIdx++]];
    const el = document.createElement('div');
    el.className = 'ln';
    segs = parse(text).map((s) => {
      const sp = document.createElement('span');
      if (s.c) sp.className = 't-' + s.c;
      el.appendChild(sp);
      return { t: s.t, sp, node: null, instant: s.instant };
    });
    segIdx = 0; segPos = 0;
    // sofort sichtbare Segmente (Prompt)
    while (segIdx < segs.length && segs[segIdx].instant) { segs[segIdx].sp.textContent = segs[segIdx].t; segIdx++; }
    el.appendChild(cursor);
    box.appendChild(el);
    cur = el;
    trim();
    if (segIdx >= segs.length || segs.every((s) => !s.t.length)) { /* leere Zeile */ }
  }

  function trim() {
    while (box.childElementCount > MAX_LINES) box.removeChild(box.firstElementChild);
  }

  // n Zeichen tippen
  T.type = (n) => {
    let guard = 0;
    while (n > 0 && guard++ < 400) {
      if (segIdx >= segs.length) { newLine(); continue; }
      const s = segs[segIdx];
      if (!s.node) { s.node = document.createTextNode(''); s.sp.appendChild(s.node); }
      const rest = s.t.length - segPos;
      if (rest <= 0) { segIdx++; segPos = 0; if (segIdx >= segs.length) { newLine(); n--; } continue; }
      const k = Math.min(rest, n);
      s.node.appendData(s.t.substr(segPos, k));
      segPos += k; n -= k;
      if (segPos >= s.t.length) { segIdx++; segPos = 0; }
    }
    if (segIdx >= segs.length) newLine();
  };

  // Fertige Zeile vor der aktuellen Tippzeile einschieben
  T.println = (text, cls, html) => {
    if (!box) return;
    const el = document.createElement('div');
    el.className = 'ln' + (cls ? ' ' + cls.split(' ').map((c) => 't-' + c).join(' ') : '');
    if (html) el.innerHTML = text; else el.textContent = text;
    box.insertBefore(el, cur);
    trim();
    return el;
  };
  T.cmd = (cmd) => {
    const el = document.createElement('div');
    el.className = 'ln';
    const p = document.createElement('span'); p.className = 't-ps'; p.textContent = ps1() + ' ';
    const c = document.createElement('span'); c.className = 't-cmd'; c.textContent = cmd;
    el.append(p, c);
    box.insertBefore(el, cur);
    trim();
  };
  // Alles leeren und frisch mit neuer Tippzeile beginnen (z. B. nach dem Hop)
  T.reset = () => {
    if (!box) return;
    box.innerHTML = '';
    newLine();
  };
  T.clear = () => {
    if (!box) return;
    while (box.firstElementChild && box.firstElementChild !== cur) box.removeChild(box.firstElementChild);
  };

  // Paket-Installation im Distro-Stil anzeigen
  T.install = (bid, n) => {
    const d = DH.game.distro();
    const pkg = DH.content.pkg[bid] || bid;
    const names = n > 1 ? pkg + ' (×' + n + ')' : pkg;
    if (d.id === 'windows') {
      T.println('Microsoft Store wird geöffnet … Anmeldung erforderlich … ' + names + ' installiert.', 'dim');
      return;
    }
    if (d.id === 'lfs') {
      T.cmd('cd ' + pkg + '-src && ./configure && make -j$(nproc) && make install');
      return;
    }
    T.cmd(d.pm + ' ' + pkg);
    const lines = {
      apt: 'Richte ' + names + ' ein …',
      pacman: '(1/1) Installiere ' + names + '              [####################] 100%',
      dnf: 'Installiert: ' + names + '  Komplett!',
      zypper: '(1/1) Installiere: ' + names + ' ............[fertig]',
      emerge: '>>> Emerging (1 of 1) dev-nerd/' + names + ' … kompiliert in 3 h 12 min',
      nix: 'installing \'' + names + '\' → /nix/store/' + Math.random().toString(36).slice(2, 10) + '-' + pkg,
      apk: '(1/1) Installing ' + names + ' … OK: 5 MiB in 1 packages',
      xbps: names + ': installed successfully.',
      pkg: 'Installing ' + names + ' … done',
      installpkg: 'Installing package ' + names + '.txz … PACKAGE DESCRIPTION: ' + pkg,
      pamac: 'Transaktion erfolgreich abgeschlossen: ' + names,
      winget: names + ' erfolgreich installiert',
    };
    const key = d.pm.includes('apt') ? 'apt' : d.pm.includes('pacman') ? 'pacman' : d.pm.includes('dnf') ? 'dnf' : d.pm.includes('zypper') ? 'zypper'
      : d.pm.includes('emerge') ? 'emerge' : d.pm.includes('nix') ? 'nix' : d.pm.includes('apk') ? 'apk' : d.pm.includes('xbps') ? 'xbps'
        : d.pm.includes('installpkg') ? 'installpkg' : d.pm.includes('pamac') ? 'pamac' : d.pm.includes('pkg') ? 'pkg' : 'apt';
    T.println(lines[key], 'dim');
  };

  T.neofetch = () => {
    const G = DH.game, S = G.S, U = DH.util, d = G.distro();
    const art = DH.content.tuxAscii;
    const info = [
      ['', `<span class="t-ps">${U.esc(d.user)}</span>@<span class="t-ps">${U.esc(d.id)}</span>`],
      ['', '-'.repeat(d.user.length + d.id.length + 1)],
      ['OS', U.esc(d.name) + ' x86_64'],
      ['Kernel', '6.' + (S.hops % 20) + '.' + (S.hops * 7 % 30) + '-distrohopper'],
      ['Uptime', U.dur(G.runSeconds())],
      ['Pakete', U.num(G.totalBuildings) + ' (' + d.pm.split(' ').filter((x) => x !== 'sudo')[0].replace(/^\.\//, '') + ')'],
      ['Shell', S.choices.shell ? DH.data.uIndex[S.choices.shell].name : 'bash 5.2'],
      ['Editor', S.choices.editor ? DH.data.uIndex[S.choices.editor].name : 'noch unentschlossen'],
      ['Bart', U.num(S.beard) + ' Haare'],
      ['Bytes/s', U.rate(G.bps)],
      ['Hops', U.num(S.hops)],
    ];
    const n = Math.max(art.length, info.length);
    for (let i = 0; i < n; i++) {
      const a = (art[i] || '').padEnd(14, ' ');
      const inf = info[i];
      const right = inf ? (inf[0] ? `<span class="t-ps">${inf[0]}</span>: ${inf[1]}` : inf[1]) : '';
      T.println(`<span class="t-art">${U.esc(a)}</span>${right}`, '', true);
    }
    T.println('<span style="color:#ef3e4a">███</span><span style="color:#3ddc84">███</span><span style="color:#ffd23f">███</span><span style="color:#3d8bff">███</span><span style="color:#a86fff">███</span><span style="color:#5ce1e6">███</span>', '', true);
  };
})();
