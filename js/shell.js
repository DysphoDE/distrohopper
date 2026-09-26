'use strict';
/* DistroHopper – Mini-Shell mit Easter Eggs */
(function () {
  const SH = DH.shell = { history: [], hIdx: -1, mode: 'sh', vimFails: 0 };
  const T = () => DH.term;
  const out = (t, c) => T().println(t, c);
  const outH = (h, c) => T().println(h, c, true);
  const G = () => DH.game;

  const PM = ['apt', 'apt-get', 'pacman', 'dnf', 'yum', 'zypper', 'emerge', 'nix-env', 'nix', 'apk', 'xbps-install', 'pkg', 'yay', 'paru', 'pamac', 'snap', 'flatpak', 'winget', 'brew', 'installpkg'];
  const CMDS = ['help', 'clear', 'ls', 'cat', 'cd', 'pwd', 'whoami', 'uname', 'uptime', 'neofetch', 'fastfetch', 'sudo', 'cowsay', 'fortune', 'vim', 'nano', 'emacs', 'exit',
    'history', 'echo', 'date', 'cal', 'ping', 'top', 'htop', 'systemctl', 'man', 'git', 'matrix', 'hack', 'tux', 'lolcat', 'df', 'free', 'ssh', 'reboot', 'save', 'stats', 'lsb_release', 'hop', 'curl', 'rm', 'sl', 'make', 'xyzzy', 'quack'];

  SH.complete = (s) => {
    const parts = s.split(' ');
    if (parts.length > 1) {
      const files = ['todo.txt', 'README.md', 'witze.txt', '.bashrc', '/etc/os-release'];
      const last = parts[parts.length - 1];
      const m = files.filter((f) => f.startsWith(last));
      if (m.length === 1) { parts[parts.length - 1] = m[0]; return parts.join(' '); }
      return s;
    }
    const m = CMDS.filter((c) => c.startsWith(s));
    if (m.length === 1) return m[0] + ' ';
    if (m.length > 1) out(m.join('  '), 'dim');
    return s;
  };

  function prompt() { return T().ps1(); }

  SH.promptText = () => (SH.mode === 'vim' ? ':' : prompt());

  SH.run = (raw) => {
    const input = raw.trim();
    if (SH.mode === 'vim') return vim(input);
    T().cmd(input);
    if (!input) return;
    SH.history.push(input);
    if (SH.history.length > 50) SH.history.shift();
    SH.hIdx = -1;
    exec(input);
  };

  function exec(input) {
    const S = G().S, U = DH.util, d = G().distro();
    const low = input.toLowerCase().replace(/\s+/g, ' ');
    const [cmd, ...args] = input.split(/\s+/);
    const a = args.join(' ');
    const c = cmd.toLowerCase();

    // ---- Spezialfälle zuerst
    if (/^sudo make me a sandwich$/.test(low)) { out('Okay.', 'ok'); secret('sandwich'); return; }
    if (/^make me a sandwich$/.test(low)) { out('Mach es doch selbst.', 'err'); return; }
    if (/^sudo rm -rf \/ --no-preserve-root/.test(low) || /^sudo rm -rf --no-preserve-root \//.test(low)) { return nuke(); }
    if (/^(sudo )?rm -rf \/(\*)?$/.test(low) || /^(sudo )?rm -rf \/ /.test(low)) {
      out('rm: Es ist gefährlich, rekursiv auf „/“ zu arbeiten.', 'err');
      out('rm: Benutzen Sie --no-preserve-root, um diese Sicherheitsmaßnahme zu umgehen.', 'err');
      secret('rmrf'); return;
    }
    if (/hannah.?montana/.test(low) && (/install|-s |add|emerge|-ia/.test(low))) return hannah();
    if (/^(sudo )?(give|gib) (me|mir) (bytes|geld|money)|^(motherlode|rosebud|iddqd|idkfa|kaching)$/.test(low)) {
      out(c === 'iddqd' ? 'God Mode aktiviert. (Nicht wirklich.)' : 'Schummler! Na gut, hier ist 1 Byte.', 'warn');
      G().earn(1); secret('cheat'); return;
    }
    if (/^(42|was ist die antwort.*|what is the answer.*|the answer)$/.test(low) || /leben.*universum/.test(low)) {
      out('42.', 'ok'); out('Aber was war nochmal die Frage?', 'dim'); secret('answer'); return;
    }
    if (/^(make )?(coffee|kaffee)|^brew (coffee|kaffee)|^teapot/.test(low)) {
      out('HTTP/1.1 418 I’m a teapot', 'warn'); out('Dieses Terminal kann keinen Kaffee kochen. Es ist eine Teekanne.', 'dim'); secret('teapot'); return;
    }
    if (/^(typewriter|schreibmaschine)$/.test(low)) {
      out('Klack-klack-klack … *ding*', 'ok'); out('Tastatur-Sound „Schreibmaschine“ freigeschaltet (System → Optionen).', 'dim'); secret('typewriter'); return;
    }
    if (low === 'git push --force' || low === 'git push -f' || /git push .*(--force|-f).*main/.test(low)) {
      out('To github.com:du/produktion.git', 'dim'); out(' + a1b2c3d...0000000 main -> main (forced update)', 'warn');
      out('Das hast du nicht wirklich getan. Die Kollegen sind informiert.', 'err'); secret('forcepush'); return;
    }

    switch (c) {
      case 'help': case 'hilfe': case '?':
        out('DistroHopper-Shell – verfügbare Befehle:', 'ok');
        out('  help  clear  ls  cat  cd  pwd  whoami  uname  uptime  neofetch', '');
        out('  top  systemctl  history  echo  date  cal  ping  man  git  df  free', '');
        out('  cowsay  fortune  tux  lolcat  save  stats  exit', '');
        out('…und ein paar Befehle, die hier nicht stehen. Probier ruhig herum.', 'dim');
        return;
      case 'clear': case 'reset': T().clear(); return;
      case 'cls': out('Das ist kein DOS. Aber gut, ausnahmsweise.', 'dim'); setTimeout(() => T().clear(), 600); return;
      case 'dir': out('Das ist kein DOS. Trotzdem:', 'dim'); // fallthrough
      case 'ls': case 'll': case 'la': {
        const all = /a/.test(a) || c === 'la' || c === 'll';
        const f = ['Dokumente/', 'Downloads/', 'isos/', 'memes/', 'node_modules/', 'README.md', 'todo.txt', 'witze.txt', 'wirklich_final_v3_FINAL.odt'];
        if (all) f.unshift('.', '..', '.bashrc', '.config/', '.dotfiles.git/', '.ssh/', '.bartoel');
        outH(f.map((x) => (x.endsWith('/') ? `<span class="t-kw">${x}</span>` : x)).join('  '));
        return;
      }
      case 'cd':
        if (!a || a === '~') return;
        if (a === '..' || a === '/') { out('Du hast keine Berechtigung, dein Zuhause zu verlassen.', 'dim'); return; }
        out('cd: ' + a + ': Du bist schon da, wo du hin willst. Im Herzen.', 'dim');
        return;
      case 'pwd': out('/home/' + d.user); return;
      case 'whoami': out(d.user + ' – ein Mensch, der sein OS öfter wechselt als seine Socken.'); return;
      case 'uname':
        out(/a/.test(a) ? `Linux ${d.id} 6.${S.hops % 20}.0-distrohopper #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux` : 'Linux');
        return;
      case 'uptime': out(`up ${U.dur(G().runSeconds())} seit dem letzten Hop, insgesamt ${U.dur(S.stats.playTime)} gespielt, load average: ${(Math.random() * 4).toFixed(2)}`); return;
      case 'neofetch': case 'fastfetch': case 'screenfetch': T().neofetch(); secret('neofetch'); return;
      case 'lsb_release': out('Distributor ID: ' + d.name); out('Description:    ' + d.name + ' – ' + d.tag); return;
      case 'cat': return cat(a);
      case 'sudo': return sudo(a);
      case 'sl': return sl();
      case 'cowsay': return cowsay(a || 'Muuuh. Ich bin eine Kuh in einem Terminal.');
      case 'fortune': out(U.pick(DH.content.fortunes), 'kw'); secret('fortune'); return;
      case 'vim': case 'vi': case 'nvim': return vimStart();
      case 'nano': out('GNU nano – endlich ein Editor für Menschen. Leider gibt es hier nichts zu bearbeiten.', 'dim'); return;
      case 'emacs':
        out('Starte Emacs …', 'dim'); out('Lade Betriebssystem … Lade Mail-Client … Lade Tetris … Lade Psychotherapeut (M-x doctor) …', 'dim');
        out('Emacs benötigt für die Bedienung 3 weitere Finger. Abgebrochen.', 'warn'); secret('emacs'); return;
      case 'exit': case 'logout': case 'quit':
        out('Hier gibt es kein Entkommen. …Na gut.', 'dim'); setTimeout(() => DH.ui.closeShell(), 500); return;
      case 'history': SH.history.slice(-15).forEach((h, i) => out(String(SH.history.length - Math.min(15, SH.history.length) + i + 1).padStart(4) + '  ' + h, 'dim')); return;
      case 'echo': out(a.replace(/\$USER/g, d.user).replace(/\$SHELL/g, '/usr/bin/fish').replace(/^["']|["']$/g, '')); return;
      case 'date': out(new Date().toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'medium' })); return;
      case 'cal': return cal();
      case 'ping': return ping(a || 'localhost');
      case 'top': case 'htop': case 'btop': return top();
      case 'systemctl': return systemctl();
      case 'man': out(a ? `Keine Handbuchseite für „${a}“. Versuch’s mit dem Arch-Wiki.` : 'Welche Handbuchseite möchten Sie?', 'dim'); return;
      case 'git': return git(a);
      case 'matrix': case 'cmatrix': DH.fx.matrix(8); out('Wach auf, Neo …', 'ok'); secret('matrix'); return;
      case 'hack': case 'hollywood': case 'hacker': return hack();
      case 'tux': DH.content.tuxAscii.forEach((l) => out(l, 'art')); out('  Das bin ich!', 'ok'); return;
      case 'lolcat': return lolcat(a || 'Regenbogen macht alles schneller!');
      case 'df': out('Dateisystem   Größe  Benutzt  Verf.  Verw%  Eingehängt auf'); out('/dev/nvme0n1p2  931G    930G     1G   99%  /', 'warn'); out('# Wahrscheinlich die ISOs.', 'dim'); return;
      case 'free': out('Speicher: gesamt 7,6Gi · benutzt 7,5Gi (Chrome: 7,4Gi)', 'warn'); return;
      case 'ssh': out('ssh: connect to host ' + (a || 'localhost') + ' port 22: Permission denied (publickey).', 'err'); return;
      case 'reboot': case 'shutdown': case 'poweroff': case 'halt': return reboot();
      case 'save': G().save(); out('Spielstand gespeichert.', 'ok'); return;
      case 'stats': out(`Bytes: ${U.bytes(S.bytes)} · Rate: ${U.rate(G().bps)} · Klicks: ${U.num(S.stats.clicks)} · Bart: ${U.num(S.beard)} · Hops: ${S.hops}`); return;
      case 'hop': case 'distro': out('Zum Distro-Wechseln: Tab „Hop“ öffnen. GRUB wartet schon.', 'dim'); return;
      case 'curl': case 'wget':
        if (/wttr/.test(a)) { out('Wetterbericht: Überall', 'ok'); out('   ☁  Bewölkt mit Aussicht auf Kernel-Panic, 13 °C'); return; }
        out('curl: (6) Konnte Host nicht auflösen. Es ist immer DNS.', 'err'); return;
      case 'rm': out('rm: Nö.', 'err'); return;
      case 'xyzzy': out('Nichts passiert.', 'dim'); secret('xyzzy'); return;
      case 'plugh': out('Eine hohle Stimme sagt „Narr“.', 'dim'); return;
      case 'quack': case 'duck': out('    __', 'kw'); out('___( o)>  Quack!', 'kw'); out('\\ <_. )', 'kw'); out(' `---\'', 'kw'); return;
      case 'hello': case 'hallo': case 'hi': case 'moin': case 'servus': out(DH.util.pick(['Hallo! Schön, dass du da bist.', 'Moin!', 'Servus! Schon was kompiliert heute?', 'Hallo Welt! …Entschuldigung, alte Gewohnheit.'])); return;
      case 'linux': out('Was du als Linux bezeichnest, heißt eigentlich GNU/Linux – oder, wie ich es neuerdings nenne: GNU plus Linux.', 'dim'); return;
      case 'windows': out('Fenster? Die sind zum Lüften da.', 'dim'); return;
      case 'rtfm': out('Welches Manual? Es gibt keins. Lies den Quellcode.', 'dim'); return;
      case 'make': out('make: *** Kein Ziel angegeben und keine „Makefile“ gefunden. Schluss.', 'err'); return;
      case 'yes': for (let i = 0; i < 8; i++) out('y'); out('^C', 'dim'); return;
      case 'bash': case 'zsh': case 'fish': case 'sh': out('Du bist bereits in einer Shell. In einer Shell. Shellception.', 'dim'); return;
      case 'python': case 'python3': case 'node': out('>>> print("Hallo")', 'dim'); out('Hallo'); out('>>> exit()', 'dim'); return;
      case 'kill': case 'killall': out('Tux lässt sich nicht beenden. Tux ist ewig.', 'warn'); return;
      default:
        if (PM.includes(c)) return pkgmgr(c, a);
        out(`${cmd}: Befehl nicht gefunden.` + (Math.random() < 0.5 ? ' Meintest du „' + U.pick(['sl', 'fortune', 'cowsay', 'neofetch', 'help']) + '“?' : ''), 'err');
    }
  }

  function secret(id) {
    const fresh = G().secret(id);
    return fresh;
  }

  function cat(f) {
    const d = G().distro();
    switch (f) {
      case 'todo.txt':
        ['TODO:', ' [x] Distro wechseln', ' [x] Distro wechseln', ' [ ] Dotfiles committen', ' [ ] Vim beenden', ' [ ] Das Jahr des Linux-Desktops herbeiführen', ' [x] Distro wechseln'].forEach((l) => out(l)); return;
      case 'README.md': out('# DistroHopper', 'kw'); out('Ein Idle-Game. Klicke, kaufe, hoppe. Bart wachsen lassen.'); out('Lizenz: GPL (Gute-Pinguin-Lizenz)', 'dim'); return;
      case 'witze.txt': out(DH.util.pick(DH.content.fortunes)); return;
      case '.bashrc': out("alias ls='sl'  # hehe", 'dim'); out("alias please='sudo'"); out("export EDITOR=vim  # Hilfe"); return;
      case '/etc/os-release': out('NAME="' + d.name + '"'); out('PRETTY_NAME="' + d.name + ' (' + d.tag + ')"'); out('HOME_URL="https://distrowatch.com"'); return;
      case '/etc/shadow': out('cat: /etc/shadow: Keine Berechtigung. Netter Versuch.', 'err'); return;
      case '/proc/cpuinfo': out('model name : Tux Quantum 9000 @ 4.20GHz'); out('flags      : fpu vme sse2 avx512 kaffee mate'); return;
      case '': out('cat: Warte auf Eingabe … Miau?', 'dim'); return;
      default: out('cat: ' + f + ': Datei oder Verzeichnis nicht gefunden', 'err');
    }
  }

  function sudo(a) {
    const d = G().distro();
    if (a === '!!') { const last = SH.history[SH.history.length - 2]; if (last) { out('sudo ' + last, 'dim'); return exec('sudo ' + last); } return; }
    if (!a) { out('usage: sudo -h | -K | -k | -V', 'dim'); return; }
    const [c, ...r] = a.split(/\s+/);
    if (PM.includes(c)) return pkgmgr(c, r.join(' '), true);
    if (c === 'su' || c === '-i' || c === '-s') { out('Root-Shell verweigert. Tux passt auf.', 'err'); return; }
    out('[sudo] Passwort für ' + d.user + ': ********', 'dim');
    setTimeout(() => {
      out(d.user + ' ist nicht in der sudoers-Datei. Dieser Vorfall wird gemeldet.', 'err');
      secret('sudo');
    }, 700);
  }

  function pkgmgr(c, a) {
    const d = G().distro();
    const own = d.pm.split(' ').filter((x) => x !== 'sudo')[0];
    const same = c === own || (own === 'apt' && c === 'apt-get') || (own === 'dnf' && c === 'yum') || (own === 'pacman' && ['yay', 'paru'].includes(c)) || (own === 'nix-env' && c === 'nix');
    if (c === 'snap') { out('snap wird gestartet … bitte warten … bitte warten … bitte warten …', 'dim'); setTimeout(() => out('Fertig. (Hat nur 47 Sekunden gedauert.)', 'ok'), 1200); return; }
    if (c === 'flatpak') { out('Flatpak: 2,3 GB Laufzeitumgebungen werden heruntergeladen, um einen Taschenrechner zu installieren …', 'dim'); return; }
    if (!same) {
      out(`${c}: Befehl nicht gefunden.`, 'err');
      out(`Falsche Distro, Kollege. Du nutzt ${d.name}. Hier heißt das „${d.pm}“.`, 'warn');
      secret('wrongpm');
      return;
    }
    if (/-syu|upgrade|update|-u\b|--sync/.test(a.toLowerCase())) {
      out(':: Paketdatenbanken werden synchronisiert …', 'dim');
      setTimeout(() => out('Das System ist auf dem neuesten Stand. Glückwunsch, das passiert selten.', 'ok'), 600);
      return;
    }
    if (!a) { out('Was soll ich denn installieren? Gebäude gibt’s im Tab „Pakete“.', 'dim'); return; }
    out(`Fehler: Ziel nicht gefunden: ${a.split(' ').pop()}`, 'err');
    out('Tipp: Gebäude und Upgrades installierst du im Tab „Pakete“.', 'dim');
  }

  function hannah() {
    const S = G().S;
    out('Paketlisten werden gelesen … Fertig', 'dim');
    out('Die folgenden NEUEN Pakete werden installiert: hannah-montana-linux', '');
    setTimeout(() => {
      out('✨ Best of both worlds! ✨', 'ok');
      if (!S.unlocked.hannah) {
        S.unlocked.hannah = true;
        out('Neue Distro im GRUB-Menü freigeschaltet: Hannah Montana Linux', 'warn');
        DH.audio.fanfare();
        DH.bus.emit('distroUnlocked', 'hannah');
      } else out('Ist schon installiert. Du bist ein echter Fan.', 'dim');
      secret('hannah');
    }, 800);
  }

  function sl() {
    DH.ui.train();
    secret('sl');
  }

  function cowsay(text) {
    text = text.slice(0, 60);
    const line = '-'.repeat(text.length + 2);
    [' ' + '_'.repeat(text.length + 2), '< ' + text + ' >', ' ' + line, '        \\   ^__^', '         \\  (oo)\\_______', '            (__)\\       )\\/\\', '                ||----w |', '                ||     ||']
      .forEach((l) => out(l, 'kw'));
    secret('cowsay');
  }

  function lolcat(text) {
    const cols = ['#ff5f6d', '#ffa94d', '#ffd166', '#5ee08f', '#5ce1e6', '#7aa2f7', '#c792ea'];
    const h = [...text].map((ch, i) => `<span style="color:${cols[i % cols.length]}">${DH.util.esc(ch)}</span>`).join('');
    outH(h);
  }

  function cal() {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const title = now.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
    out('   ' + title, 'ok');
    out('Mo Di Mi Do Fr Sa So', 'dim');
    const first = (new Date(y, m, 1).getDay() + 6) % 7;
    const days = new Date(y, m + 1, 0).getDate();
    let row = '   '.repeat(first);
    for (let dd = 1; dd <= days; dd++) {
      row += String(dd).padStart(2) + ' ';
      if ((first + dd) % 7 === 0) { out(row); row = ''; }
    }
    if (row) out(row);
  }

  function ping(host) {
    out(`PING ${host} 56(84) Bytes an Daten.`);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      const t = host.includes('localhost') || host.startsWith('127.') ? (Math.random() * 0.05).toFixed(3) : (10 + Math.random() * 40).toFixed(1);
      out(`64 Bytes von ${host}: icmp_seq=${i} ttl=64 Zeit=${t} ms`);
      if (i >= 4) {
        clearInterval(iv);
        out(`--- ${host} Ping-Statistiken --- 4 Pakete übertragen, 4 empfangen, 0% Paketverlust`, 'dim');
      }
    }, 350);
  }

  function top() {
    const g = G(), S = g.S, U = DH.util;
    out('  PID  NAME                      ANZ   B/s            ANTEIL', 'ok');
    const rows = DH.data.buildings.filter((b) => S.b[b.id] > 0).map((b) => ({ b, v: g.perUnit[b.id] * S.b[b.id] * g.prodMult * g.prodBuff }))
      .sort((x, y) => y.v - x.v).slice(0, 10);
    if (!rows.length) { out('  (noch keine Prozesse – kauf erst mal ein Bash-Skript)', 'dim'); return; }
    rows.forEach((r, i) => out(`${String(1000 + r.b.idx * 37).padStart(5)}  ${r.b.name.padEnd(24).slice(0, 24)} ${String(S.b[r.b.id]).padStart(5)}  ${U.rate(r.v).padEnd(14)} ${U.pct(r.v / Math.max(1e-9, g.bps), 1)}`));
  }

  function systemctl() {
    const S = G().S;
    DH.data.buildings.filter((b) => S.b[b.id] > 0).slice(0, 8).forEach((b) => {
      outH(`<span class="t-ok">●</span> ${DH.content.pkg[b.id]}.service – ${DH.util.esc(b.name)} <span class="t-ok">active (running)</span>`);
    });
    outH('<span class="t-err">●</span> work-life-balance.service – <span class="t-err">failed</span>');
  }

  function git(a) {
    const l = a.toLowerCase();
    if (l.startsWith('blame')) { out('^a1b2c3d (Kevin 2019-04-01) // TODO: fixen', 'warn'); out('Es war Kevin. Es ist immer Kevin.', 'dim'); return; }
    if (l.startsWith('status')) { out('Auf Branch main'); out('Änderungen, die nicht zum Commit vorgemerkt sind:', 'warn'); out('	geändert:       leben.txt', 'err'); return; }
    if (l.startsWith('commit')) { out('[main 1337c0d] ' + (a.match(/-m\s+["']?([^"']+)/) || [0, 'fix'])[1]); out(' 1 file changed, 1 insertion(+), 1337 deletions(-)', 'dim'); return; }
    if (l.startsWith('log')) { ['a1b2c3d fix', 'e4f5a6b fix 2', 'c7d8e9f wirklich finaler fix', '0a1b2c3 bitte funktionier'].forEach((x) => out(x, 'kw')); return; }
    if (l.startsWith('push')) { out('Alles aktuell. Oder alles kaputt. Schwer zu sagen.', 'dim'); return; }
    out('git: „' + a + '“ ist kein git-Befehl. Siehe „git --help“. Oder weine leise.', 'err');
  }

  function hack() {
    const lines = [
      ['Initialisiere Hollywood-Hacker-Modus …', 'dim'], ['Umgehe Firewall … [OK]', 'ok'], ['Verbinde mit dem Mainframe (192.168.0.256) …', ''],
      ['Entschlüssele 128-Bit … 256-Bit … 4096-Bit … [OK]', 'ok'], ['Zweite Person tippt jetzt mit auf der Tastatur …', 'warn'],
      ['Lade GUI-Oberfläche in Visual Basic, um die IP-Adresse zu verfolgen …', ''], ['ENHANCE! … ENHANCE! …', 'warn'], ['ICH BIN DRIN.', 'ok'],
    ];
    lines.forEach(([l, c], i) => setTimeout(() => out(l, c), i * 320));
    setTimeout(() => { DH.fx.matrix(3); secret('hack'); }, lines.length * 320);
  }

  function reboot() {
    out('Das System wird JETZT neu gestartet!', 'warn');
    const crt = document.getElementById('crt');
    crt.classList.add('crt-off');
    setTimeout(() => {
      crt.classList.remove('crt-off');
      T().clear();
      out('[  OK  ] Hast du es schon mit Aus- und Einschalten versucht? Hat funktioniert.', 'ok');
      secret('reboot');
    }, 1400);
  }

  function nuke() {
    const dirs = ['/bin', '/boot', '/etc', '/home/' + G().distro().user + '/memes', '/lib', '/opt', '/usr', '/var', '/home/' + G().distro().user + '/.dotfiles'];
    out('[sudo] Passwort: ********', 'dim');
    dirs.forEach((dd, i) => setTimeout(() => out('entferne ' + dd + ' …', 'err'), 300 + i * 220));
    setTimeout(() => {
      out('Kernel panic - not syncing: Es ist nichts mehr da.', 'err');
      document.getElementById('crt').classList.add('crt-off');
      DH.audio.error();
    }, 300 + dirs.length * 220);
    setTimeout(() => {
      document.getElementById('crt').classList.remove('crt-off');
      T().clear();
      out('…nur ein Scherz. Alles ist noch da. Diesmal.', 'ok');
      secret('rmrf2');
    }, 2200 + dirs.length * 220);
  }

  /* ---- Vim-Falle ---- */
  function vimStart() {
    SH.mode = 'vim';
    SH.vimFails = 0;
    T().clear();
    for (let i = 0; i < 6; i++) out('~', 'dim');
    out('VIM - Vi IMproved · Version 9.1 · „Viel Glück beim Beenden“', 'kw');
    out('-- NORMAL --', 'warn');
    DH.ui.updatePrompt();
  }
  function vim(input) {
    T().println(':' + input, 'dim');
    const q = input.replace(/^:/, '').trim();
    if (['q', 'q!', 'wq', 'x', 'qa', 'qa!', 'wq!', 'zz', 'ZZ'].includes(q) || input === 'ZZ') {
      SH.mode = 'sh';
      T().clear();
      out('Vim wurde beendet. Du gehörst jetzt zu einer sehr kleinen Elite.', 'ok');
      secret('vimexit');
      DH.ui.updatePrompt();
      return;
    }
    SH.vimFails++;
    const msgs = ['E37: Kein Schreibvorgang seit der letzten Änderung (füge ! hinzu zum Erzwingen)', 'E492: Kein Editor-Befehl: ' + q, 'E488: Überschüssige Zeichen', 'Tipp mal „:q!“. Oder zieh den Stecker.'];
    out(SH.vimFails >= 3 ? msgs[3] : msgs[(Math.random() * 3) | 0], SH.vimFails >= 3 ? 'warn' : 'err');
    if (/exit|quit|hilfe|help|raus/.test(q)) out('Nett gefragt. Hilft aber nicht.', 'dim');
  }
})();
