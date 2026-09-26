'use strict';
/* DistroHopper – Spieldaten: Gebäude, Upgrades, Distros, Dotfiles, Erfolge, Kosmetik */
(function () {
  const D = DH.data = {};
  const SPRITE_TINTS = ['#f4f6f9', '#b8d4ff', '#ffe08a', '#c7f5b0', '#ffc2de', '#d7c2ff', '#9ff0f2', '#ffd0a1', '#f4f6f9', '#b8d4ff', '#ffe08a', '#ffffff'];

  /* =========================================================== GEBÄUDE */
  // cost = Grundpreis, bps = Bytes/s pro Stück
  D.buildings = [
    { id: 'bash', name: 'Bash-Skript', plural: 'Bash-Skripte', short: 'Bash-Skripte', cost: 15, bps: 0.1, bg: '#12201a',
      desc: 'Ein Einzeiler, der „nur mal kurz“ etwas testen sollte. Läuft seit 2009 in Produktion.',
      tux: 'Ein Bash-Skript! Die vermehren sich wie Kaninchen. Nur mit mehr Anführungszeichen-Fehlern.',
      tiers: [
        ['set -euo pipefail', 'Deine Skripte brechen jetzt ab, wenn etwas schiefgeht. Also ständig. Aber mit Stil.'],
        ['Shebang-Zeile', '#!/usr/bin/env bash – jetzt weiß das Skript endlich, wer es ist.'],
        ['ShellCheck', 'Ein Linter, der dich 400-mal pro Datei auf fehlende Anführungszeichen hinweist. Zu Recht.'],
      ] },
    { id: 'cron', name: 'Cronjob', plural: 'Cronjobs', short: 'Cronjobs', cost: 100, bps: 1, bg: '#221c12',
      desc: 'Läuft jede Minute. Niemand weiß mehr, warum. Niemand traut sich, ihn zu löschen.',
      tux: 'Ein Cronjob. Stell ihn auf „* * * * *“ und vergiss ihn. Für immer.',
      tiers: [
        ['crontab -e', 'Du hast aus Versehen nano als Editor gewählt. Egal, es läuft.'],
        ['@reboot', 'Startet auch nach dem Neustart. Wie der Bösewicht in einem Horrorfilm.'],
        ['systemd-Timer', 'Wie Cronjobs, nur mit 30 Zeilen Unit-Datei mehr. Fortschritt!'],
      ] },
    { id: 'pi', name: 'Raspberry Pi', plural: 'Raspberry Pis', short: 'Raspberry Pis', cost: 1100, bps: 8, bg: '#2a1220',
      desc: 'Für ein Projekt gekauft, dann in der Schublade vergessen. Produziert trotzdem fleißig.',
      tux: 'Ein Raspberry Pi! Statistisch gesehen leben 80 % davon in Schubladen.',
      tiers: [
        ['Kühlkörper', 'Ein winziges Stück Alu. Die Temperatur sinkt von „Lava“ auf „Sauna“.'],
        ['Pi-hole', 'Blockiert Werbung im ganzen Netzwerk. Und versehentlich das Online-Banking deiner Eltern.'],
        ['Pi-Cluster', 'Zwölf Pis in einem Acrylturm. Rechenleistung wie ein Laptop von 2012, sieht aber fantastisch aus.'],
      ] },
    { id: 'intern', name: 'Praktikant', acc: 'Praktikanten', plural: 'Praktikanten', short: 'Praktikanten', cost: 12000, bps: 47, bg: '#1d2130',
      desc: 'Arbeitet für Pizza, Club-Mate und die vage Aussicht auf „Erfahrung“.',
      tux: 'Ein Praktikant! Gib ihm bloß keine Root-Rechte. …Zu spät, oder?',
      tiers: [
        ['Kaffeemaschinen-Einweisung', 'Die wichtigste Schulung des ganzen Praktikums. Mit Zertifikat.'],
        ['Root-Rechte', 'Was soll schon schiefgehen? (Bitte nicht „sudo rm -rf /“ tippen, Kevin.)'],
        ['Mentoring', 'Ein Senior erklärt git rebase. Beide verstehen es danach weniger als vorher.'],
      ] },
    { id: 'thinkpad', name: 'Alter ThinkPad', acc: 'alten ThinkPad', plural: 'alte ThinkPads', short: 'ThinkPads', cost: 130000, bps: 260, bg: '#1a1a1e',
      desc: 'Unzerstörbar. Hat drei Besitzer, zwei Kaffeeunfälle und einen Umzug im Regen überlebt.',
      tux: 'Ein ThinkPad. Damit kann man einen Nagel in die Wand schlagen und danach weiterarbeiten.',
      tiers: [
        ['Roter TrackPoint', 'Der kleine rote Knubbel. Nur echte Profis wissen ihn zu schätzen.'],
        ['Sticker-Sammlung', 'Jeder Sticker erhöht die Leistung um 3 %. Wissenschaftlich erwiesen*. (*nicht)'],
        ['Libreboot', 'Proprietäres BIOS? Nicht mit dir. Freiheit bis zur letzten Firmware-Zeile.'],
      ] },
    { id: 'homelab', name: 'Homelab', plural: 'Homelabs', short: 'Homelabs', cost: 1.4e6, bps: 1400, bg: '#142030',
      desc: 'Ein Serverschrank im Keller. Stromrechnung? Welche Stromrechnung?',
      tux: 'Ein Homelab! Die Nachbarn wundern sich schon über das Brummen im Keller.',
      tiers: [
        ['Proxmox', 'Virtuelle Maschinen in virtuellen Maschinen. It’s VMs all the way down.'],
        ['USV', 'Deine Server überleben jetzt jeden Stromausfall. Dein Kühlschrank nicht.'],
        ['Kabelmanagement', 'Zum ersten Mal seit Jahren sieht man die Rückseite des Racks. Sie ist wunderschön.'],
      ] },
    { id: 'docker', name: 'Docker-Container', plural: 'Docker-Container', short: 'Container', cost: 2e7, bps: 7800, bg: '#0f2640',
      desc: '„Läuft auf meinem Rechner.“ – „Gut, dann verschiffen wir eben deinen Rechner.“',
      tux: 'Container! Ich lebe übrigens auch in einem. Nennt sich Zoo-Gehege.',
      tiers: [
        ['Alpine-Base-Image', 'Das Image ist jetzt 5 MB groß. Die node_modules darin 2 GB.'],
        ['docker-compose', 'Zwölf Container mit einem Befehl starten. Und mit einem Tippfehler alle stoppen.'],
        ['Multi-Stage-Builds', 'Wie Matroschkas, nur aus YAML.'],
      ] },
    { id: 'k8s', name: 'Kubernetes-Cluster', plural: 'Kubernetes-Cluster', short: 'Cluster', cost: 3.3e8, bps: 44000, bg: '#121f48',
      desc: 'Um einen Container zu verwalten, braucht man zwölf YAML-Dateien und einen Therapeuten.',
      tux: 'Kubernetes. Griechisch für „Steuermann“. Oder für „Warum ist schon wieder alles CrashLoopBackOff?“',
      tiers: [
        ['Helm-Charts', 'YAML, das YAML erzeugt. Wir haben die Kontrolle verloren.'],
        ['Autoscaling', 'Skaliert automatisch hoch. Deine Cloud-Rechnung auch.'],
        ['Service Mesh', 'Ein Netz aus Sidecars, das niemand versteht, aber alle im Lebenslauf haben.'],
      ] },
    { id: 'community', name: 'Open-Source-Community', plural: 'Communitys', short: 'Communitys', cost: 5.1e9, bps: 260000, bg: '#26163a',
      desc: 'Tausende Freiwillige, die sich über Einrückung streiten – und nebenbei die Welt am Laufen halten.',
      tux: 'Die Community! Tausende Menschen, die gratis arbeiten und sich trotzdem über alles beschweren. Herrlich.',
      tiers: [
        ['Code of Conduct', 'Weniger Flamewars, mehr Commits. Fast.'],
        ['Hacktoberfest', 'Tausende Pull Requests, die ein Leerzeichen in der README korrigieren. Jeder zählt!'],
        ['Chaos Communication Congress', 'Vier Tage, 15.000 Nerds, null Stunden Schlaf. Die Produktivität explodiert.'],
      ] },
    { id: 'datacenter', name: 'Rechenzentrum', plural: 'Rechenzentren', short: 'Rechenzentren', cost: 7.5e10, bps: 1.6e6, bg: '#0e1e28',
      desc: 'Klimaanlage auf Anschlag, Gehörschutz Pflicht. Riecht nach warmem Staub und Fortschritt.',
      tux: 'Ein Rechenzentrum! Endlich ist es mal richtig kalt hier. Fast wie zu Hause in der Antarktis.',
      tiers: [
        ['Warmgang/Kaltgang', 'Die Luft strömt jetzt in die richtige Richtung. Meistens.'],
        ['Flüssigkühlung', 'Wasser und Elektronik. Was soll da schon passieren?'],
        ['Eigenes Kraftwerk', 'Du bist jetzt dein eigener Stromanbieter. Die Stadtwerke rufen nicht mehr an.'],
      ] },
    { id: 'maintainer', name: 'Kernel-Maintainer', plural: 'Kernel-Maintainer', short: 'Maintainer', cost: 1e12, bps: 1e7, bg: '#2a1c0e',
      desc: 'Liest jeden deiner Patches. Antwortet in GROSSBUCHSTABEN. Hat trotzdem meistens recht.',
      tux: 'Ein Kernel-Maintainer! Pssst, nicht so laut – er reviewt gerade.',
      tiers: [
        ['Mailingliste', 'Code-Review per E-Mail wie 1995. Funktioniert erschreckend gut.'],
        ['Signed-off-by', 'Eine Zeile, die sagt: Ich übernehme die Verantwortung. Mutig.'],
        ['Merge-Window', 'Zwei Wochen, in denen alles erlaubt ist. Danach nur noch Tränen und Bugfixes.'],
      ] },
    { id: 'beowulf', name: 'Beowulf-Cluster', plural: 'Beowulf-Cluster', short: 'Beowulfs', cost: 1.4e13, bps: 6.5e7, bg: '#12262a',
      desc: 'Stell dir einen Beowulf-Cluster aus DENEN vor! (Alte Slashdot-Nutzer weinen jetzt vor Rührung.)',
      tux: 'Ein Beowulf-Cluster! Damit hättest du 2003 auf Slashdot Legendenstatus gehabt.',
      tiers: [
        ['InfiniBand', 'Netzwerk so schnell, dass die Pakete ankommen, bevor sie verschickt wurden.'],
        ['MPI', 'Die Computer reden endlich miteinander. Mehr als du mit deinen Kollegen.'],
        ['TOP500-Platz', 'Dein Cluster steht in der Liste der schnellsten Supercomputer. Knapp hinter einem Wetterdienst.'],
      ] },
    { id: 'ai', name: 'KI-Coding-Assistent', acc: 'KI-Coding-Assistenten', plural: 'KI-Assistenten', short: 'KI-Assistenten', cost: 1.7e14, bps: 4.3e8, bg: '#22183a',
      desc: 'Schreibt Code in Sekunden und erklärt ihn dir mit großem Selbstbewusstsein. Manchmal stimmt es sogar.',
      tux: 'Ein KI-Assistent! Er sagt, er kann mich ersetzen. Niedlich.',
      tiers: [
        ['Prompt-Engineering', 'Du sagst jetzt „bitte“. Die Codequalität steigt um 12 %.'],
        ['Riesiges Kontextfenster', 'Er kennt jetzt dein ganzes Repo. Leider auch deine Commit-Messages.'],
        ['Halluzinationsfilter', 'Erfindet keine Bibliotheken mehr. Nur noch gelegentlich Funktionen.'],
      ] },
    { id: 'quantum', name: 'Quantencomputer', plural: 'Quantencomputer', short: 'Quantencomputer', cost: 2.1e15, bps: 2.9e9, bg: '#0c1432',
      desc: 'Die Bits sind gleichzeitig 0, 1 und kaputt – bis jemand nachschaut.',
      tux: 'Ein Quantencomputer! Ich bin mir gleichzeitig sicher und unsicher, was der macht.',
      tiers: [
        ['Fehlerkorrektur', 'Von 1.000 Qubits sind jetzt 3 zuverlässig. Ein Durchbruch!'],
        ['Verschränkung', 'Zwei Qubits, eine Seele. Stürzt eins ab, weiß es das andere sofort.'],
        ['Schrödingers Backup', 'Das Backup existiert und existiert nicht. Wie jedes Backup, eigentlich.'],
      ] },
    { id: 'satellite', name: 'Orbital-Rechenzentrum', plural: 'Orbital-Rechenzentren', short: 'Orbital-RZs', cost: 2.6e16, bps: 2.1e10, bg: '#070b1f',
      desc: 'Server im Orbit. Kühlung gratis, Latenz leider in Lichtsekunden.',
      tux: 'Server im Weltall! Endlich ist keiner mehr in der Nähe, der mich einfach neu startet.',
      tiers: [
        ['Solarsegel', 'Unbegrenzt Strom, solange die Sonne scheint. Also immer. Weltraum!'],
        ['Laser-Uplink', 'Daten per Laser zur Erde. Bitte nicht in den Strahl schauen.'],
        ['Weltraumschrott-Recycling', 'Aus alten Satelliten werden neue Server. Nachhaltig!'],
      ] },
    { id: 'dyson', name: 'Dyson-Sphäre', plural: 'Dyson-Sphären', short: 'Dyson-Sphären', cost: 3.1e17, bps: 1.5e11, bg: '#2a1400',
      desc: 'Eine Hülle um die Sonne. Endlich genug Strom für Chrome mit 40 Tabs.',
      tux: 'Eine Dyson-Sphäre. Und immer noch kein funktionierender Druckertreiber.',
      tiers: [
        ['Stellare Kühlung', 'Die Sonne kühlt jetzt deine Server. Wir haben aufgehört zu fragen, wie.'],
        ['Photonen-Pipeline', 'Jedes Photon arbeitet jetzt für dich. Mindestlohn: 0,0 Joule.'],
        ['Zweite Sonne', 'Eine Sphäre war nicht genug. Die Nachbarsterne werden nervös.'],
      ] },
    { id: 'matrix', name: 'Simulations-Cluster', plural: 'Simulations-Cluster', short: 'Simulationen', cost: 7.1e19, bps: 1.1e12, bg: '#001a0a',
      desc: 'Du bist dir nicht mehr sicher, ob du den Code schreibst – oder der Code dich.',
      tux: 'Moment mal. Bin ich… simuliert? Egal, solange es Fisch gibt.',
      tiers: [
        ['Rote Pille', 'Du siehst jetzt den Code. Grüne Schrift, läuft von oben nach unten. Klischee!'],
        ['Déjà-vu-Patch', 'Eine schwarze Katze läuft zweimal vorbei. Das ist kein Bug, das ist ein Feature.'],
        ['Architekten-Zugang', 'Du kannst jetzt Naturgesetze per Pull Request ändern. Bitte mit Tests.'],
      ] },
    { id: 'multiverse', name: 'Multiversums-Fork', plural: 'Multiversums-Forks', short: 'Multiversen', cost: 1.2e22, bps: 8.3e12, bg: '#16062a',
      desc: 'git fork universe. In einem der Universen ist endlich das Jahr des Linux-Desktops.',
      tux: 'Ein Multiversum! Irgendwo da draußen gibt es ein Universum, in dem Pinguine fliegen.',
      tiers: [
        ['Paralleluniversen-Branches', 'In Universum #4.718 hast du Tabs benutzt. Es war schrecklich.'],
        ['Kosmischer Merge', 'Zwei Realitäten zusammenführen. Merge-Konflikte in der Raumzeit.'],
        ['git push --force (Realität)', 'Du hast gerade die Realität überschrieben. Ups.'],
      ] },
    { id: 'universe', name: 'Kernel des Universums', plural: 'Universums-Kernel', short: 'Universen', cost: 1.9e24, bps: 6.4e13, bg: '#05030c',
      desc: 'Du hast den Quellcode der Realität gefunden. Er ist in C geschrieben. Natürlich.',
      tux: 'Du hast Root-Rechte auf das Universum. Bitte, bitte kein rm -rf.',
      tiers: [
        ['printk(Urknall)', 'Debug-Ausgabe für den Urknall. Endlich weiß man, was da eigentlich passiert ist.'],
        ['Kosmische Syscalls', 'Die Gravitation ist jetzt ein Systemaufruf. Mit Rechteverwaltung.'],
        ['sudo universe', 'Du bist jetzt root. Von allem.'],
      ] },
  ];
  const BPS_SCALE = 1.25; // etwas flotterer Einstieg als beim Keks-Vorbild
  D.bIndex = {};
  D.buildings.forEach((b, i) => { b.idx = i; b.bps *= BPS_SCALE; D.bIndex[b.id] = b; });

  /* =========================================================== UPGRADES */
  const U = [];
  const TIER_AT = [1, 5, 25, 50, 100, 150, 200, 250, 300, 350, 400];
  const TIER_COST = [10, 50, 500, 5e4, 5e6, 5e8, 5e10, 5e12, 5e14, 5e16, 5e18];
  const GENERIC_TIERS = [
    null, null, null,
    ['{s}: In Rust neu geschrieben', 'Blazingly fast™ und memory-safe. Du erzählst es jedem, der nicht schnell genug wegläuft.'],
    ['{s}: Enterprise Edition', 'Gleiche Software, dreifacher Preis, doppelte Leistung. Support nur per Fax.'],
    ['{s} mit KI™', 'Jetzt mit KI! Niemand weiß, was sie tut, aber der Aktienkurs steigt.'],
    ['{s} auf der Blockchain', 'Jede Operation braucht jetzt zwölf Bestätigungen und einen Wal. Aber dezentral!'],
    ['{s}: Handoptimiertes Assembler', 'Jemand hat die heißen Schleifen in Assembler neu geschrieben. Er spricht seitdem nur noch Hex.'],
    ['{s}: Gesegnet vom Kernel-Team', 'Ein Maintainer hat „Looks good to me“ geschrieben. Du hast den Screenshot eingerahmt.'],
    ['{s}: Quantenverschränkt', 'Funktioniert in allen Zuständen gleichzeitig. Außer bei der Demo.'],
    ['{s} aus dem Paralleluniversum', 'Importiert aus einer Realität, in der alles schon fertig ist. Ohne Lizenz.'],
  ];

  D.buildings.forEach((b) => {
    for (let t = 0; t < TIER_AT.length; t++) {
      const hand = b.tiers[t];
      const gen = GENERIC_TIERS[t];
      const name = hand ? hand[0] : gen[0].replace('{s}', b.short);
      const flavor = hand ? hand[1] : gen[1];
      U.push({
        id: 't_' + b.id + '_' + (t + 1), type: 'tier', b: b.id, tier: t + 1, need: TIER_AT[t],
        name, flavor, cost: b.cost * TIER_COST[t], icon: { tier: b.id, t: t + 1 },
      });
    }
  });

  // Synergien: a profitiert +5 % je b, b profitiert +0,1 % je a
  const SYN = [
    ['bash', 'cron', 'Skripte im Crontab', 'Endlich laufen deine Skripte, während du schläfst. Und während du wach bist. Und immer.'],
    ['pi', 'homelab', 'Pi im Serverschrank', 'Der Raspberry Pi ist jetzt offiziell Teil der Infrastruktur. Er ist sehr stolz.'],
    ['intern', 'ai', 'Praktikant fragt die KI', 'Doppelte Geschwindigkeit, halbes Verständnis. Die Commits sehen aber toll aus.'],
    ['thinkpad', 'community', 'Sticker-Tauschbörse', 'Die Community verteilt Sticker, die ThinkPads werden schneller. So funktioniert das nun mal.'],
    ['docker', 'k8s', 'Pods voller Container', 'Container in Pods in Nodes in Clustern. Wie Matroschkas, nur teurer.'],
    ['cron', 'datacenter', 'Nächtliche Batch-Jobs', 'Um 3 Uhr nachts arbeitet das Rechenzentrum für dich. Und heizt nebenbei die Stadt.'],
    ['community', 'maintainer', 'Flammende Mailingliste', 'Eine sehr deutliche E-Mail an die Liste. Danach arbeiten alle doppelt so schnell. Aus Angst.'],
    ['homelab', 'datacenter', 'Vom Keller ins Rechenzentrum', 'Dein Homelab ist jetzt „Edge Computing“. Klingt gleich viel teurer.'],
    ['maintainer', 'ai', 'KI-Patchreview', 'Die KI reviewt Kernel-Patches, der Maintainer reviewt die KI. Niemand schläft.'],
    ['beowulf', 'quantum', 'Hybrid-Cluster', 'Klassische und Quanten-Nodes Seite an Seite. Sie verstehen sich nicht, aber es läuft.'],
    ['satellite', 'dyson', 'Orbitale Stromleitung', 'Ein Kabel von der Sonne zu deinen Satelliten. Die Verlängerungsschnur war teuer.'],
    ['matrix', 'multiverse', 'Simulierte Universen', 'Jede Simulation bekommt ihr eigenes Universum. Und jedes Universum eine Simulation.'],
    ['quantum', 'universe', 'Quanten-Syscalls', 'Der Kernel des Universums rechnet jetzt in Qubits. Gott würfelt doch.'],
    ['bash', 'universe', 'Der Einzeiler des Universums', 'Die gesamte Realität lässt sich jetzt mit einem Bash-Einzeiler steuern. Ohne Anführungszeichen.'],
  ];
  SYN.forEach(([a, b, name, flavor], i) => {
    const A = D.bIndex[a], B = D.bIndex[b];
    const need = i < 8 ? 15 : 25;
    U.push({
      id: 's_' + a + '_' + b, type: 'syn', a, b, need, name, flavor,
      cost: (A.cost * 10 + B.cost) * 25 * (i < 8 ? 1 : 4), icon: { sprite: 'link', map: { G: ['#5ce1e6', '#ffd23f', '#3ddc84', '#ff8fc7', '#a86fff', '#ff7b25'][i % 6] } },
    });
  });

  // Klick-Upgrades
  const CLICK = [
    ['k1', 'Mechanische Tastatur', 'Klickkraft ×2', 'Endlich hört jeder im Raum, wie produktiv du bist.', 100, { mult: 2 }, { clicks: 5 }],
    ['k2', 'Cherry MX Blue', 'Klickkraft ×2', 'Laut. Sehr laut. Deine Mitbewohner planen bereits deinen Tod.', 500, { mult: 2 }, { clicks: 30, req: 'k1' }],
    ['k3', 'IBM Model M', 'Klickkraft ×2', 'Wiegt 2,5 kg, tippt sich wie ein Traum und übersteht einen Atomkrieg.', 10000, { mult: 2 }, { clicks: 150, req: 'k2' }],
    ['k4', 'Vim-Tastenkürzel', '+1 % der B/s pro Klick', 'hjkl statt Pfeiltasten. Du bist 3 % schneller und 100 % unerträglicher.', 1e5, { pct: 0.01 }, { bytes: 3e4 }],
    ['k5', 'Tastatur-Makros', '+1 % der B/s pro Klick', 'Eine Taste, 47 Aktionen. Du hast vergessen, was sie alle tun.', 1e7, { pct: 0.01 }, { bytes: 3e6 }],
    ['k6', 'Neo2-Layout', '+1 % der B/s pro Klick', 'Das ergonomische Layout. Hat dich drei Monate Produktivität gekostet, die du nie zurückbekommst.', 1e9, { pct: 0.01 }, { bytes: 3e8 }],
    ['k7', 'Split-Tastatur mit 36 Tasten', '+1 % der B/s pro Klick', 'Wo ist die Zahlenreihe? Auf Ebene 3, natürlich.', 1e11, { pct: 0.01 }, { bytes: 3e10 }],
    ['k8', 'Selbstgelötete Tastatur', '+1 % der B/s pro Klick', 'Jede Diode von Hand gelötet. Drei Tasten gehen nicht – du nennst es „Charakter“.', 1e13, { pct: 0.01 }, { bytes: 3e12 }],
    ['k9', 'Handballenauflage aus Mondgestein', '+1 % der B/s pro Klick', 'Deine Handgelenke waren noch nie so weit gereist.', 1e15, { pct: 0.01 }, { bytes: 3e14 }],
    ['k10', 'Neuro-Interface', '+1 % der B/s pro Klick', 'Du denkst den Code. Leider auch die Tippfehler.', 1e17, { pct: 0.01 }, { bytes: 3e16 }],
    ['k11', 'Telepathisches Tippen', '+1 % der B/s pro Klick', 'Deine Tastatur weiß, was du tippen willst, bevor du es weißt. Unheimlich.', 1e19, { pct: 0.01 }, { bytes: 3e18 }],
    ['k12', 'Tastatur aus dem Paralleluniversum', '+1 % der B/s pro Klick', 'Hat eine Taste für „Bug beheben“. Funktioniert nur dort.', 1e21, { pct: 0.01 }, { bytes: 3e20 }],
  ];
  const KEYL = ['M', 'B', 'IBM', 'HJK', 'Q', 'NEO', '36', 'DIY', 'MON', 'Ψ', '???', '∞'];
  CLICK.forEach(([id, name, fx, flavor, cost, eff, unl], i) => {
    U.push({ id, type: 'click', name, fx, flavor, cost, ...eff, unl, icon: { key: KEYL[i] === 'Ψ' ? 'PSI' : KEYL[i] === '∞' ? '8' : KEYL[i], tint: SPRITE_TINTS[i % SPRITE_TINTS.length] } });
  });

  // Produktions-Upgrades: Koffein & Setup
  const PROD = [
    ['c1', 'Filterkaffee', 0.05, 'Schmeckt nach Büro und Verzweiflung. Wirkt trotzdem.', 5000, 'coffee', null],
    ['c2', 'Club-Mate', 0.10, 'Das Nationalgetränk der Hackerszene. Schmeckt nach Tee, den jemand angezündet hat.', 5e5, 'mate', null],
    ['e1', 'Zweiter Monitor', 0.10, 'Links der Code, rechts die Doku. In Wahrheit: links der Code, rechts YouTube.', 5e6, 'monitor', null],
    ['c3', 'Energy-Drink', 0.10, 'Dein Herz schlägt jetzt im Takt der CPU. 4,2 GHz.', 5e7, 'coffee', { U: '#3ddc84', w: '#3d8bff' }],
    ['e2', 'Gaming-Stuhl mit RGB', 0.10, 'RGB erhöht bekanntlich die Leistung um 10 %. Das ist Physik.', 5e8, 'monitor', { b: '#ff5fb4', c: '#5ce1e6' }],
    ['c4', 'Siebträger-Espressomaschine', 0.15, 'Kostet mehr als dein Rechner. Du redest über Mahlgrade wie über Compiler-Flags.', 5e9, 'coffee', { w: '#c9d1db', U: '#3b2a1f' }],
    ['e3', 'Stehschreibtisch', 0.10, 'Du stehst jetzt. Einmal. Dann nie wieder. Aber er ist da.', 5e10, 'monitor', { b: '#a8693a' }],
    ['c5', 'Cold Brew', 0.15, '24 Stunden gezogen, 3 Sekunden getrunken.', 5e11, 'coffee', { w: '#5ce1e6' }],
    ['e4', 'Noise-Cancelling-Kopfhörer', 0.10, 'Endlich hörst du die Welt nicht mehr. Nur noch den Lüfter.', 5e12, 'monitor', { b: '#2b303b', c: '#ffd23f' }],
    ['c6', 'Koffeintabletten', 0.20, 'Du hast den Kaffee wegrationalisiert. Die Tasse vermisst dich.', 5e13, 'pill', null],
    ['e5', 'Ultrawide-Monitor', 0.15, '49 Zoll. Du musst den Kopf drehen, um die Uhr zu sehen.', 5e14, 'monitor', { b: '#1f47a3', c: '#b7f36b' }],
    ['c7', 'Espresso intravenös', 0.20, 'Direkt in die Blutbahn. Dein Arzt hat aufgehört zu fragen.', 5e15, 'pill', { r: '#6a3e1d', R: '#3b2a1f' }],
    ['e6', 'Klimaanlage im Arbeitszimmer', 0.15, 'Sommer? Kennst du nur noch aus Erzählungen.', 5e16, 'monitor', { b: '#5ce1e6', c: '#f4f6f9' }],
    ['c8', 'Kaffee-Kubernetes', 0.25, 'Jede Tasse läuft in ihrem eigenen Pod. Der Barista heißt jetzt „Controller“.', 5e17, 'coffee', { w: '#3d8bff' }],
    ['e7', 'Serverraum als Schlafzimmer', 0.20, 'Warm, laut, blinkend. Du schläfst wie ein Baby.', 5e18, 'monitor', { b: '#101826', c: '#3ddc84' }],
    ['c9', 'Mate aus dem Orbit', 0.25, 'In der Schwerelosigkeit gebraut. Die Kohlensäure hat eigene Bahnen.', 5e19, 'mate', { u: '#1e8f9c', U: '#0c3b3b' }],
    ['e8', 'Eigene Glasfaser zum DE-CIX', 0.20, 'Dein Ping ist negativ. Die Pakete kommen an, bevor du sie abschickst.', 5e20, 'monitor', { b: '#ff7b25', c: '#fff4b0' }],
    ['c10', 'Singularitäts-Espresso', 0.30, 'Die Tasse hat eine eigene Schwerkraft. Der Löffel ist verschwunden.', 5e21, 'coffee', { w: '#a86fff', U: '#11131a' }],
    ['e9', 'Holodeck-Arbeitsplatz', 0.25, 'Du arbeitest jetzt am Strand. Der Sand ist simuliert, die Deadline nicht.', 5e22, 'monitor', { b: '#a86fff', c: '#ffd23f' }],
    ['c11', 'Koffein-Quantenschaum', 0.30, 'Gleichzeitig heiß und kalt. Schrödingers Latte.', 5e23, 'coffee', { w: '#ffd23f', U: '#a86fff' }],
    ['c12', 'Das letzte Stück Pizza', 0.35, 'Niemand hat es genommen. Aus Höflichkeit. Jetzt gehört es dir, und mit ihm unendliche Macht.', 5e25, 'pizza', null],
  ];
  PROD.forEach(([id, name, add, flavor, cost, sprite, map]) => {
    U.push({ id, type: 'prod', name, add, flavor, cost, unl: { bytes: cost / 5 }, icon: { sprite, map } });
  });

  // Katzen: verstärken den Erfolgs-Bonus
  const CATS = [
    ['cat1', 'Katze auf der Tastatur', 'Sie schreibt „jjjjjjjjjjjjj“ in deinen Code. Die Tests laufen trotzdem durch.', 10, 5e5],
    ['cat2', 'Katze im Serverschrank', 'Sie hat den wärmsten Platz im Haus gefunden. Und fährt nachts die Lüfter hoch.', 25, 5e8],
    ['cat3', 'Katze als Rubber Duck', 'Du erklärst ihr deinen Code. Sie schaut dich verächtlich an. Bug gefunden.', 45, 5e11],
    ['cat4', 'Schrödingers Katze', 'Sie ist gleichzeitig im Karton und auf deiner Tastatur. Hauptsächlich auf der Tastatur.', 65, 5e14],
    ['cat5', 'Katze mit Root-Rechten', 'Niemand hat sie ihr gegeben. Sie hatte sie einfach.', 90, 5e17],
    ['cat6', 'Nyan Cat', 'Regenbogen-Leistung. Die Melodie wirst du nie wieder los.', 115, 5e20],
    ['cat7', 'Der Internet-Katzen-Konsens', 'Alle Katzenvideos des Internets arbeiten jetzt für dich. Das ist sehr viel Rechenleistung.', 140, 5e23],
  ];
  const CAT_TINT = [null, { o: '#9ba5b3', O: '#5b6474' }, { o: '#2b303b' }, { o: '#a86fff' }, { o: '#ffd23f' }, { o: '#ff8fc7' }, { o: '#5ce1e6' }];
  CATS.forEach(([id, name, flavor, ach, cost], i) => {
    U.push({ id, type: 'cat', name, flavor, cost, unl: { ach }, add: 0.5, icon: { sprite: 'cat', map: CAT_TINT[i] } });
  });

  // Enten & Bugs
  U.push(
    { id: 'duck1', type: 'duck', name: 'Quietsche-Gummiente', flavor: 'Steht jetzt auf deinem Monitor. Hört dir zu. Urteilt nicht.', cost: 7.7e4, unl: { ducks: 1 }, freq: 1.15, icon: { sprite: 'duck' } },
    { id: 'duck2', type: 'duck', name: 'Rubber-Duck-Debugging-Kurs', flavor: 'Zertifizierter Enten-Flüsterer. Steht jetzt auf LinkedIn.', cost: 7.7e7, unl: { ducks: 5 }, dur: 1.15, icon: { sprite: 'duck', map: { y: '#ff8fc7', Y: '#cf3f8c', e: '#fff' } } },
    { id: 'duck3', type: 'duck', name: 'Ente mit LED-Augen', flavor: 'Blinkt bei jedem Segfault. Also im Takt.', cost: 7.7e10, unl: { ducks: 15 }, freq: 1.15, icon: { sprite: 'duck', map: { y: '#5ce1e6', Y: '#1e8f9c' } } },
    { id: 'duck4', type: 'duck', name: 'Goldene Ente', flavor: 'Aus massivem Gold. Quietscht in Dur.', cost: 7.7e13, unl: { ducks: 40 }, dur: 1.2, pow: 1.2, icon: { sprite: 'duck', map: { y: '#ffe066', Y: '#c98a00', e: '#fffbe0' } } },
    { id: 'duck5', type: 'duck', name: 'Enten-Schwarm', flavor: 'Es sind so viele. Sie beobachten dich. Aber auf eine gute Art.', cost: 7.7e16, unl: { ducks: 100 }, freq: 1.2, dur: 1.1, icon: { sprite: 'duck', map: { y: '#a86fff', Y: '#5a2aa6' } } },
    { id: 'bug1', type: 'bug', name: 'Fliegenklatsche', flavor: 'Analog, zuverlässig, befriedigend. Bugs geben doppelt so viel.', cost: 2e4, unl: { bugs: 1 }, bugMult: 2, icon: { sprite: 'bugA' } },
    { id: 'bug2', type: 'bug', name: 'Bug-Bounty-Programm', flavor: 'Fremde finden jetzt deine Bugs. Gegen Bezahlung. In Bytes.', cost: 2e7, unl: { bugs: 10 }, bugMult: 2, icon: { sprite: 'bugA', map: { r: '#3ddc84', R: '#17864c' } } },
    { id: 'bug3', type: 'bug', name: 'Valgrind', flavor: 'Findet jedes Speicherleck. Dauert nur 40-mal so lange.', cost: 2e10, unl: { bugs: 25 }, bugFreq: 1.3, icon: { sprite: 'bugA', map: { r: '#3d8bff', R: '#1f47a3' } } },
    { id: 'bug4', type: 'bug', name: 'Unit-Tests', flavor: '100 % Coverage! Getestet wird allerdings nur, ob die Tests laufen.', cost: 2e13, unl: { bugs: 60 }, bugMult: 3, icon: { sprite: 'bugA', map: { r: '#ffd23f', R: '#e39a12' } } },
    { id: 'bug5', type: 'bug', name: 'Formale Verifikation', flavor: 'Mathematisch bewiesen bugfrei. Außer der Beweis hat einen Bug.', cost: 2e16, unl: { bugs: 150 }, bugMult: 3, bugFreq: 1.2, icon: { sprite: 'bugA', map: { r: '#a86fff', R: '#5a2aa6' } } },
  );

  // Glaubenskriege (nur eins pro Gruppe und Run)
  D.switchGroups = {
    editor: { name: 'Editor-Krieg', desc: 'Die älteste Fehde der IT. Wähle weise – für diesen Run.' },
    indent: { name: 'Einrückung', desc: 'Tabs oder Spaces? Freundschaften sind daran zerbrochen.' },
    init: { name: 'Init-System', desc: 'Wer startet deine Dienste? Und wie viele Mails wird es dazu geben?' },
    desktop: { name: 'Desktop-Umgebung', desc: 'Womit sollen deine Fenster aussehen?' },
    shell: { name: 'Shell', desc: 'Wo tippst du deine Befehle?' },
  };
  const SW = [
    ['sw_vim', 'editor', 'Vim', 'Klickkraft ×2', 'Du wirst ihn nie wieder verlassen. Buchstäblich.', { click: 2 }, ['VIM', '#019733']],
    ['sw_emacs', 'editor', 'Emacs', 'Produktion +15 %', 'Ein großartiges Betriebssystem. Nur ein guter Editor fehlt.', { prod: 1.15 }, ['EMX', '#7f5ab6']],
    ['sw_nano', 'editor', 'nano', 'Alle Kosten −6 %', 'Ehrlich, einfach, ohne Handbuch. Die Nerds schauen dich schief an.', { cost: 0.94 }, ['NAN', '#4a4a4a']],
    ['sw_tabs', 'indent', 'Tabs', 'Gebäude −6 %', 'Ein Zeichen, konfigurierbare Breite, effizient. Logisch.', { bCost: 0.94 }, ['→|', '#3d8bff']],
    ['sw_spaces', 'indent', 'Spaces', 'Produktion +12 %', 'Laut einer Umfrage verdienen Spaces-Nutzer mehr Geld. Das zählt!', { prod: 1.12 }, ['···', '#ff7b25']],
    ['sw_systemd', 'init', 'systemd', 'Produktion +15 %', 'Startet alles parallel. Auch deine Kaffeemaschine. Und deine Waschmaschine.', { prod: 1.15 }, ['SD', '#30d475']],
    ['sw_openrc', 'init', 'OpenRC', 'Buffs halten 30 % länger', 'Klassisch, schlank, und du darfst es jedem erzählen.', { buffDur: 1.3 }, ['RC', '#54487a']],
    ['sw_runit', 'init', 'runit', 'Klickkraft +60 %', 'Drei Shellskripte und ein Traum.', { click: 1.6 }, ['RUN', '#478061']],
    ['sw_kde', 'desktop', 'KDE Plasma', 'Upgrades −12 %', 'Es gibt eine Einstellung für alles. Auch für die Einstellungen.', { uCost: 0.88 }, ['KDE', '#1d99f3']],
    ['sw_gnome', 'desktop', 'GNOME', 'Produktion +15 %', 'Minimalistisch. Die Knöpfe wurden entfernt, damit du dich konzentrierst.', { prod: 1.15 }, ['GNO', '#4a86cf']],
    ['sw_xfce', 'desktop', 'Xfce', 'Enten erscheinen 30 % öfter', 'Läuft auch auf einem Toaster. Die Ente fühlt sich wohl.', { duckFreq: 1.3 }, ['XFC', '#2284f2']],
    ['sw_hypr', 'desktop', 'Hyprland', 'Klickkraft ×1,8', 'Animationen! Blur! Rundungen! Du postest jetzt Screenshots auf r/unixporn.', { click: 1.8 }, ['HYP', '#00c8c8']],
    ['sw_bash', 'shell', 'bash', 'Produktion +10 %', 'Der Standard. Langweilig, aber überall.', { prod: 1.1 }, ['BSH', '#3c3c3c']],
    ['sw_zsh', 'shell', 'zsh + Oh My Zsh', 'Erfolgs-Bonus +25 %', '300 Plugins, 4 Sekunden Startzeit. Aber hübsch!', { achEff: 1.25 }, ['ZSH', '#c5a200']],
    ['sw_fish', 'shell', 'fish', 'IRC-Belohnungen ×2', 'Die freundliche Shell. Endlich ist mal jemand nett zu dir.', { ircMult: 2 }, ['><>', '#ff7b25']],
  ];
  const SW_UNLOCK = { editor: 2e4, indent: 2e7, init: 3e9, desktop: 5e11, shell: 5e13 };
  SW.forEach(([id, group, name, fx, flavor, eff, icon]) => {
    const unl = SW_UNLOCK[group];
    U.push({ id, type: 'switch', group, name, fx, flavor, eff, cost: unl * 3, unl: { bytes: unl }, icon: { letter: icon[0], bg: icon[1] } });
  });

  // Das Finale
  U.push({
    id: 'final', type: 'final', name: 'Das Jahr des Linux-Desktops',
    fx: 'Beendet das Spiel. (Na ja. Fast.)',
    flavor: 'Seit 1999 jedes Jahr angekündigt. Jetzt ist es so weit. Wirklich. Diesmal wirklich.',
    cost: 1e28, unl: { bytes: 1e26, beard: 3000, visited: 10 }, icon: { sprite: 'calendar' },
  });

  D.upgrades = U;
  D.uIndex = {};
  U.forEach((u, i) => { u.order = i; D.uIndex[u.id] = u; });

  /* =========================================================== DISTROS */
  D.distros = [
    { id: 'ubuntu', name: 'Ubuntu', color: '#E95420', color2: '#77216F', need: 0, pm: 'sudo apt install', hat: 'beanie', user: 'tux',
      tag: 'Linux für Menschen.', desc: 'Der Klassiker. Solide, freundlich, mit gelegentlichen Snap-Paketen, die zum Starten eine Kaffeepause brauchen.',
      perks: [['Keine Boni, keine Mali. Ehrlich.', 0]], mods: {} },
    { id: 'mint', name: 'Linux Mint', color: '#87CF3E', color2: '#1f4d17', need: 2, pm: 'sudo apt install', hat: 'mint', user: 'minty',
      tag: 'Frisch wie Minze.', desc: 'Wie Ubuntu, nur mit weniger Drama und mehr Minze. Deine Eltern könnten es benutzen. Tun sie aber nicht.',
      perks: [['Produktion +25 %', 1]], mods: { prod: 1.25 } },
    { id: 'fedora', name: 'Fedora', color: '#51A2DA', color2: '#294172', need: 5, pm: 'sudo dnf install', hat: 'fedora', user: 'fedorable',
      tag: 'Bleeding Edge, mit Pflaster.', desc: 'Immer die neuesten Pakete. Manchmal auch die neuesten Bugs. Der Hut ist Pflicht.',
      perks: [['Upgrades −30 %', 1], ['Produktion +10 %', 1], ['Gebäude +5 %', -1]], mods: { uCost: 0.7, prod: 1.1, bCost: 1.05 } },
    { id: 'debian', name: 'Debian', color: '#D70A53', color2: '#4a0620', need: 12, pm: 'sudo apt install', hat: 'swirl', user: 'stable',
      tag: 'Stabil. Sehr stabil. Zu stabil?', desc: 'Die Mutter vieler Distros. Die Pakete sind so gut abgehangen, sie haben Rentenanspruch.',
      perks: [['Produktion +75 %', 1], ['Enten 50 % seltener', -1], ['IRC-Nachrichten 50 % seltener', -1]], mods: { prod: 1.75, duckFreq: 0.5, ircFreq: 0.5 } },
    { id: 'arch', name: 'Arch Linux', color: '#1793D1', color2: '#0b3552', need: 20, pm: 'sudo pacman -S', hat: 'cap', user: 'btw',
      tag: 'I use Arch btw.', desc: 'Du installierst alles selbst, liest das Wiki und erzählst es jedem. Wirklich jedem.',
      perks: [['Klickkraft ×3', 1], ['„btw“-Blasen: anklicken für Produktion +77 % (30 s)', 1], ['Gebäude +10 %', -1]], mods: { click: 3, bCost: 1.1 }, special: 'btw' },
    { id: 'manjaro', name: 'Manjaro', color: '#35BF5C', color2: '#12401f', need: 35, pm: 'sudo pamac install', hat: 'hardhat', user: 'manja',
      tag: 'Arch für Menschen mit Freizeit.', desc: 'Arch, aber mit Installer. Und mit Updates, die zwei Wochen abhängen. Wie Käse.',
      perks: [['Offline-Produktion ×2', 1], ['Produktion +35 %', 1], ['Klickkraft −25 %', -1]], mods: { offline: 2, prod: 1.35, click: 0.75 } },
    { id: 'opensuse', name: 'openSUSE', color: '#73BA25', color2: '#173f4f', need: 55, pm: 'sudo zypper install', hat: 'gecko', user: 'geeko',
      tag: 'Das Chamäleon mit YaST.', desc: 'Deutsche Wertarbeit aus Nürnberg. YaST konfiguriert alles – auch Dinge, die du nicht wusstest.',
      perks: [['Gebäude −20 %', 1], ['Produktion +30 %', 1]], mods: { bCost: 0.8, prod: 1.3 } },
    { id: 'popos', name: 'Pop!_OS', color: '#48B9C7', color2: '#574f4a', need: 85, pm: 'sudo apt install', hat: 'headset', user: 'pop',
      tag: 'Tiling und Gaming.', desc: 'Kacheln, Grafikkarten-Treiber und eine Rakete im Logo. Was will man mehr?',
      perks: [['Produktion +40 %', 1], ['Klickkraft +40 %', 1], ['Buffs halten 25 % länger', 1]], mods: { prod: 1.4, click: 1.4, buffDur: 1.25 } },
    { id: 'kali', name: 'Kali Linux', color: '#557C94', color2: '#0b0f1a', need: 130, pm: 'sudo apt install', hat: 'shades', user: 'root',
      tag: 'Ich bin drin.', desc: 'Für Penetrationstests. Du benutzt es aber hauptsächlich, weil der Drache cool aussieht.',
      perks: [['Enten 3× so häufig', 1], ['Enten-Effekte +50 %', 1], ['Bugs 2× so häufig', 1], ['Produktion −30 %', -1]], mods: { duckFreq: 3, duckPow: 1.5, bugFreq: 2, prod: 0.7 } },
    { id: 'gentoo', name: 'Gentoo', color: '#8A7FD4', color2: '#27213f', need: 190, pm: 'sudo emerge --ask', hat: 'wizard', user: 'larry',
      tag: 'Kompiliert. Immer noch.', desc: 'Alles aus dem Quellcode, mit -O3 -march=native -funroll-loops. Die Kuh heißt Larry.',
      perks: [['Produktion startet bei 50 %', -1], ['+4 % Produktion pro Minute Laufzeit (max. ×6)', 1]], mods: {}, special: 'gentoo' },
    { id: 'alpine', name: 'Alpine Linux', color: '#2C8FC2', color2: '#062c40', need: 280, pm: 'sudo apk add', hat: 'ski', user: 'musl',
      tag: 'Klein, sicher, musl.', desc: 'Das Base-Image ist 5 MB groß. Dein Ego danach 5 GB.',
      perks: [['Alle Kosten −35 %', 1], ['Produktion −10 %', -1]], mods: { bCost: 0.65, uCost: 0.65, prod: 0.9 } },
    { id: 'nixos', name: 'NixOS', color: '#7EBAE4', color2: '#3b5a96', need: 450, pm: 'nix-env -iA nixos.', hat: 'snow', user: 'nix',
      tag: 'Deklarativ glücklich.', desc: 'Dein ganzes System in einer Datei. Reproduzierbar. Irgendwann verstehst du sogar die Syntax.',
      perks: [['Start mit 15 % deiner Gebäude aus dem letzten Run', 1], ['Produktion +25 %', 1]], mods: { prod: 1.25 }, special: 'nix' },
    { id: 'slackware', name: 'Slackware', color: '#9aa4b0', color2: '#1d1d1d', need: 700, pm: 'sudo installpkg', hat: 'pipe', user: 'bob',
      tag: 'Die älteste lebende Distro.', desc: 'Seit 1993. Abhängigkeiten löst du selbst, wie ein echter Mensch.',
      perks: [['Gebäude −45 %', 1], ['Produktion +50 %', 1], ['Upgrades +150 %', -1], ['Synergien wirkungslos', -1]], mods: { bCost: 0.55, uCost: 2.5, prod: 1.5 }, special: 'nosyn' },
    { id: 'void', name: 'Void Linux', color: '#478061', color2: '#16291e', need: 1100, pm: 'sudo xbps-install -S', hat: 'ninja', user: 'void',
      tag: 'Ohne systemd ins Nichts.', desc: 'runit, musl, Rolling Release. Und die Gewissheit, anders zu sein.',
      perks: [['Buffs halten doppelt so lange', 1], ['IRC-Nachrichten 2× so häufig', 1], ['Produktion +40 %', 1]], mods: { buffDur: 2, ircFreq: 2, prod: 1.4 } },
    { id: 'cachyos', name: 'CachyOS', color: '#00CCAA', color2: '#0b3b3b', need: 1800, pm: 'sudo pacman -S', hat: 'headset', user: 'cachy',
      tag: 'Optimiert bis zum letzten Takt.', desc: 'Arch, aber für x86-64-v4 kompiliert, mit eigenem Kernel-Scheduler. Deine CPU schnurrt.',
      perks: [['Produktion ×2,5', 1], ['Gebäude +15 %', -1]], mods: { prod: 2.5, bCost: 1.15 } },
    { id: 'rhel', name: 'Red Hat Enterprise Linux', short: 'RHEL', color: '#EE0000', color2: '#3b0000', need: 3000, pm: 'sudo dnf install', hat: 'redhat', user: 'admin',
      tag: 'Mit Support-Vertrag.', desc: 'Enterprise! Zertifiziert, auditiert, abonniert. Der Support ruft zurück. Irgendwann.',
      perks: [['Produktion ×4', 1], ['Abo-Gebühr: 1 % deiner Bytes pro Minute', -1]], mods: { prod: 4 }, special: 'subscription' },
    { id: 'freebsd', name: 'FreeBSD', color: '#D1302B', color2: '#3d0d0c', need: 5000, pm: 'sudo pkg install', hat: 'horns', user: 'beastie',
      tag: 'Kein Linux. Wir drücken ein Auge zu.', desc: 'Technisch gesehen gar keine Linux-Distro. Aber der kleine Daemon ist so süß.',
      perks: [['Produktion ×3,5', 1], ['Klickkraft −50 %', -1]], mods: { prod: 3.5, click: 0.5 } },
    { id: 'lfs', name: 'Linux From Scratch', short: 'LFS', color: '#FF9A1F', color2: '#3a2200', need: 8000, pm: './configure && make && make install #', hat: 'hardhat', user: 'builder',
      tag: 'Alles selbst gebaut.', desc: 'Kein Paketmanager, keine Gnade. Nur du, ein Compiler und sehr viel Zeit.',
      perks: [['Produktion −50 %', -1], ['Hop-Ertrag ×3', 1]], mods: { prod: 0.5, hopMult: 3 } },
    { id: 'hannah', name: 'Hannah Montana Linux', short: 'Hannah Montana', color: '#FF5FB4', color2: '#5a1a4c', need: 0, secret: true, pm: 'sudo apt install', hat: 'bow', user: 'hannah',
      tag: 'Best of both worlds!', desc: 'Eine echte Distro aus dem Jahr 2009. Ja, wirklich. Alles ist pink und du bist glücklich.',
      perks: [['Klickkraft ×5', 1], ['Enten 2× so häufig', 1], ['Produktion +50 %', 1], ['Alles ist pink', 0]], mods: { click: 5, duckFreq: 2, prod: 1.5 } },
    { id: 'windows', name: 'Fenster 11', color: '#2F8FEB', color2: '#0a2a55', need: 0, secret: true, grub: 'Windows Boot Manager (auf /dev/nvme0n1p1)', pm: 'winget install', hat: 'clip', user: 'Benutzer',
      tag: 'Die dunkle Seite.', desc: 'Bist du dir sicher? Deine Barthaare könnten ausfallen. Updates kommen, wann sie wollen.',
      perks: [['Produktion ×0,5', -1], ['Klickkraft ×1,5 (Office-Erfahrung)', 1], ['Zwangsupdates', -1]], mods: { prod: 0.5, click: 1.5 }, special: 'updates' },
  ];
  D.dIndex = {};
  D.distros.forEach((d, i) => { d.idx = i; D.dIndex[d.id] = d; });

  /* =========================================================== DOTFILES (dauerhafte Upgrades, Karma) */
  // parent = Voraussetzung. dir = reiner Ordner (kein Kauf).
  D.dotfiles = [
    { id: 'home', path: '~/', dir: true },
    { id: 'bashrc', path: '.bashrc', parent: 'home', cost: 1, fx: 'Klickkraft ×2 (dauerhaft)', flavor: 'alias klick="klick --doppelt"', eff: { click: 2 } },
    { id: 'profile', path: '.profile', parent: 'home', cost: 2, fx: 'Jeder Run startet mit 10 Bash-Skripten und 3 Cronjobs', flavor: 'export PATH="$HOME/.startkapital:$PATH"', eff: { start: { bash: 10, cron: 3 } } },
    { id: 'aliases', path: '.bash_aliases', parent: 'bashrc', cost: 15, fx: '+2 % der B/s pro Klick', flavor: 'alias fix="git commit -am \'fix\' && git push -f"', eff: { clickPct: 0.02 } },
    { id: 'hushlogin', path: '.hushlogin', parent: 'home', cost: 5, fx: 'Gebäude −5 %', flavor: 'Keine Begrüßung mehr beim Login. Sofort an die Arbeit.', eff: { bCost: 0.95 } },
    { id: 'beardoil', path: '.bartoel', parent: 'home', cost: 8, fx: 'Barthaare 20 % wirksamer', flavor: 'Duftnote: „Serverraum im Herbst“.', eff: { beardEff: 0.2 } },
    { id: 'beardcomb', path: '.bartkamm', parent: 'beardoil', cost: 120, fx: 'Barthaare 30 % wirksamer', flavor: 'Aus recycelten Tastenkappen.', eff: { beardEff: 0.3 } },
    { id: 'beardwax', path: '.bartwachs', parent: 'beardcomb', cost: 2500, fx: 'Barthaare 50 % wirksamer', flavor: 'Hält auch bei Kernel-Panics.', eff: { beardEff: 0.5 } },
    { id: 'config', path: '.config/', parent: 'home', dir: true },
    { id: 'autostart', path: 'autostart/buyall.desktop', parent: 'config', cost: 3, fx: '„Alles kaufen“-Knopf für Upgrades', flavor: '[Desktop Entry] Exec=kauf-alles --sofort', eff: { buyAll: true } },
    { id: 'i3', path: 'i3/config', parent: 'config', cost: 10, fx: 'Produktion +15 %', flavor: 'Tiling-WM: Du sparst 0,3 Sekunden pro Fensterwechsel. Das summiert sich!', eff: { prod: 1.15 } },
    { id: 'tmux', path: 'tmux/tmux.conf', parent: 'config', cost: 6, fx: 'Offline-Produktion 25 % → 50 %', flavor: 'Die Session läuft weiter, auch wenn du gehst. Wie ein treuer Hund.', eff: { offline: 0.25 } },
    { id: 'nohup', path: 'systemd/user/nohup.service', parent: 'tmux', cost: 60, fx: 'Offline-Produktion +25 % und max. Offline-Zeit 72 h', flavor: 'Nichts hält deine Prozesse auf. Nicht einmal du.', eff: { offline: 0.25, offlineCap: 72 } },
    { id: 'nvim', path: 'nvim/init.lua', parent: 'config', cost: 25, fx: 'Klickkraft ×3', flavor: '2.400 Zeilen Lua. Du hast seit Wochen keinen Code mehr geschrieben – nur Config.', eff: { click: 3 } },
    { id: 'starship', path: 'starship.toml', parent: 'config', cost: 18, fx: 'Produktion +10 % & hübscher Prompt', flavor: '🚀 Dein Prompt zeigt jetzt Git-Status, Akku, Wetter und Mondphase.', eff: { prod: 1.1, prompt: true } },
    { id: 'gitconfig', path: 'git/config', parent: 'config', cost: 20, fx: 'Upgrades −12 %', flavor: '[alias] yolo = push --force', eff: { uCost: 0.88 } },
    { id: 'fastfetch', path: 'fastfetch/config.jsonc', parent: 'config', cost: 40, fx: 'Erfolge 50 % wirksamer', flavor: 'Jeder Screenshot beginnt jetzt mit deinem Systeminfo-Logo. Wie es sich gehört.', eff: { achEff: 0.5 } },
    { id: 'fish', path: 'fish/config.fish', parent: 'config', cost: 75, fx: 'Produktion +25 %', flavor: 'Die Friendly Interactive Shell. Endlich ist mal jemand nett zu dir.', eff: { prod: 1.25 } },
    { id: 'hypr', path: 'hypr/hyprland.conf', parent: 'i3', cost: 180, fx: 'Produktion +40 %', flavor: 'animations { enabled = yes, bezier = wobble… } Die Fenster tanzen jetzt.', eff: { prod: 1.4 } },
    { id: 'cronup', path: 'cron/autobuy-upgrades', parent: 'autostart', cost: 90, fx: 'Auto-Kauf für Upgrades (umschaltbar)', flavor: '*/1 * * * * kauf-alles --wenn-leistbar', eff: { autoUpg: true } },
    { id: 'cronbld', path: 'cron/autobuy-gebaeude', parent: 'cronup', cost: 600, fx: 'Auto-Kauf für Gebäude (umschaltbar)', flavor: 'Kauft immer das Gebäude mit dem besten Preis-Leistungs-Verhältnis. Klüger als du.', eff: { autoBld: true } },
    { id: 'ducks', path: 'ducks/duck.conf', parent: 'config', cost: 12, fx: 'Enten erscheinen 25 % öfter', flavor: 'quack_interval = "häufiger bitte"', eff: { duckFreq: 1.25 } },
    { id: 'golden', path: 'ducks/golden.conf', parent: 'ducks', cost: 70, fx: 'Enten-Effekte halten 30 % länger', flavor: 'gold = true\nquietsch = "in Dur"', eff: { buffDur: 1.3 } },
    { id: 'swarm', path: 'ducks/swarm.conf', parent: 'golden', cost: 400, fx: 'Enten bleiben doppelt so lange sichtbar & +20 % häufiger', flavor: 'Sie sind überall. Und sie sind golden.', eff: { duckLife: 2, duckFreq: 1.2 } },
    { id: 'irssi', path: 'irssi/config', parent: 'config', cost: 15, fx: 'IRC-Nachrichten 30 % häufiger & Belohnungen ×2', flavor: '/join #distrohopper', eff: { ircFreq: 1.3, ircMult: 2 } },
    { id: 'ssh', path: '.ssh/', parent: 'home', dir: true },
    { id: 'sshconfig', path: 'config', parent: 'ssh', cost: 30, fx: 'Gebäude −8 %', flavor: 'Host * \n  ServerAliveInterval 60', eff: { bCost: 0.92 } },
    { id: 'knownhosts', path: 'known_hosts', parent: 'sshconfig', cost: 250, fx: 'Gebäude −10 %', flavor: 'Du kennst jetzt alle Server der Welt persönlich.', eff: { bCost: 0.9 } },
    { id: 'authkeys', path: 'authorized_keys', parent: 'knownhosts', cost: 3000, fx: 'Gebäude −12 %', flavor: 'Ed25519 überall. Passwörter sind für Anfänger.', eff: { bCost: 0.88 } },
    { id: 'local', path: '.local/bin/', parent: 'home', dir: true },
    { id: 'bugspray', path: 'bugspray', parent: 'local', cost: 10, fx: 'Bugs geben 3× so viel', flavor: '#!/bin/sh\nexec valgrind "$@"', eff: { bugMult: 3 } },
    { id: 'quizbot', path: 'quizbot', parent: 'local', cost: 35, fx: 'Quiz-Belohnungen ×3', flavor: 'Du hast das Arch-Wiki auswendig gelernt. Bzw. ein Skript hat es.', eff: { quizMult: 3 } },
    { id: 'turbo', path: 'turbo-hop', parent: 'local', cost: 150, fx: 'Barthaare beim Hop +15 %', flavor: 'dd if=distro.iso of=/dev/sdb bs=64M oflag=direct status=progress', eff: { hopMult: 1.15 } },
    { id: 'makefile', path: 'Makefile', parent: 'home', cost: 50, fx: 'Jeder Run startet zusätzlich mit 5 Raspberry Pis, 3 Praktikanten und 1 ThinkPad', flavor: 'all: setup\n\tmake -j$(nproc) produktiv', eff: { start: { pi: 5, intern: 3, thinkpad: 1 } } },
    { id: 'flake', path: 'flake.nix', parent: 'makefile', cost: 900, fx: 'Behalte 5 % deiner Gebäude beim Hop', flavor: 'Deklarativ, reproduzierbar, unverständlich.', eff: { keep: 0.05 } },
    { id: 'gnupg', path: '.gnupg/', parent: 'home', cost: 1200, fx: 'Barthaare beim Hop +25 %', flavor: 'Alles signiert. Sogar deine Einkaufsliste.', eff: { hopMult: 1.25 } },
    { id: 'cache', path: '.cache/  (rm -rf)', parent: 'home', cost: 8000, fx: 'Produktion ×2', flavor: '37 GB Platz freigeräumt. Das System atmet auf.', eff: { prod: 2 } },
    { id: 'emacsd', path: '.emacs.d/', parent: 'home', cost: 20000, fx: 'Produktion ×2 & Klickkraft ×2', flavor: 'Du hast Emacs so lange konfiguriert, dass es jetzt ein Betriebssystem ist.', eff: { prod: 2, click: 2 } },
    { id: 'dotgit', path: '.dotfiles.git', parent: 'home', cost: 60000, fx: 'Alle Kosten −15 %', flavor: 'Deine Dotfiles haben jetzt ein eigenes Repo mit 1.300 Sternen.', eff: { bCost: 0.85, uCost: 0.85 } },
  ];
  D.dfIndex = {};
  D.dotfiles.forEach((d) => { D.dfIndex[d.id] = d; });

  /* =========================================================== KOSMETIK */
  D.schemes = [
    { id: 'distro', name: 'Distro-Standard', unl: null, c: null },
    { id: 'phosphor', name: 'Phosphor-Grün', unl: { hops: 1 }, c: { bg: '#050d06', fg: '#6dff8b', dim: '#2f7a3f', prompt: '#b6ffc5', ok: '#6dff8b', err: '#ff6b6b', warn: '#e5ff6d', str: '#b6ffc5', glow: 'rgba(109,255,139,.45)' } },
    { id: 'amber', name: 'Bernstein-CRT', unl: { bytes: 1e12 }, c: { bg: '#0f0a02', fg: '#ffb640', dim: '#8a5e1c', prompt: '#ffd28a', ok: '#ffd28a', err: '#ff7a4a', warn: '#fff08a', str: '#ffe0a8', glow: 'rgba(255,182,64,.45)' } },
    { id: 'gruvbox', name: 'Gruvbox', unl: { ach: 20 }, c: { bg: '#282828', fg: '#ebdbb2', dim: '#928374', prompt: '#fabd2f', ok: '#b8bb26', err: '#fb4934', warn: '#fe8019', str: '#83a598', glow: 'rgba(235,219,178,.15)' } },
    { id: 'dracula', name: 'Dracula', unl: { ach: 35 }, c: { bg: '#282a36', fg: '#f8f8f2', dim: '#6272a4', prompt: '#ff79c6', ok: '#50fa7b', err: '#ff5555', warn: '#f1fa8c', str: '#8be9fd', glow: 'rgba(189,147,249,.2)' } },
    { id: 'nord', name: 'Nord', unl: { visited: 5 }, c: { bg: '#2e3440', fg: '#d8dee9', dim: '#616e88', prompt: '#88c0d0', ok: '#a3be8c', err: '#bf616a', warn: '#ebcb8b', str: '#81a1c1', glow: 'rgba(136,192,208,.18)' } },
    { id: 'solarized', name: 'Solarized Dark', unl: { upgrades: 150 }, c: { bg: '#002b36', fg: '#93a1a1', dim: '#586e75', prompt: '#b58900', ok: '#859900', err: '#dc322f', warn: '#cb4b16', str: '#2aa198', glow: 'rgba(42,161,152,.15)' } },
    { id: 'catppuccin', name: 'Catppuccin Mocha', unl: { ach: 60 }, c: { bg: '#1e1e2e', fg: '#cdd6f4', dim: '#6c7086', prompt: '#f5c2e7', ok: '#a6e3a1', err: '#f38ba8', warn: '#fab387', str: '#89dceb', glow: 'rgba(203,166,247,.2)' } },
    { id: 'tokyo', name: 'Tokyo Night', unl: { beard: 250 }, c: { bg: '#1a1b26', fg: '#c0caf5', dim: '#565f89', prompt: '#7aa2f7', ok: '#9ece6a', err: '#f7768e', warn: '#e0af68', str: '#7dcfff', glow: 'rgba(122,162,247,.2)' } },
    { id: 'matrix', name: 'Matrix', unl: { secret: 'matrix' }, c: { bg: '#000000', fg: '#00ff41', dim: '#008f11', prompt: '#d1ffd6', ok: '#00ff41', err: '#ff003c', warn: '#b3ff00', str: '#9dff9d', glow: 'rgba(0,255,65,.55)' } },
    { id: 'pink', name: 'Best of both worlds', unl: { visitedId: 'hannah' }, c: { bg: '#2a0d22', fg: '#ffd1ec', dim: '#b0609a', prompt: '#ff5fb4', ok: '#ff9fd6', err: '#ff4d6d', warn: '#ffe066', str: '#fcb3ff', glow: 'rgba(255,95,180,.4)' } },
  ];
  D.sounds = [
    { id: 'rubber', name: 'Gummidom (Büro-Tastatur)', unl: null },
    { id: 'blue', name: 'Cherry MX Blue', unl: { clicks: 500 } },
    { id: 'brown', name: 'Cherry MX Brown', unl: { clicks: 2500 } },
    { id: 'red', name: 'Cherry MX Red', unl: { clicks: 7500 } },
    { id: 'topre', name: 'Topre (Thock!)', unl: { clicks: 20000 } },
    { id: 'modelm', name: 'IBM Model M (Knickfeder)', unl: { upgrade: 'k3' } },
    { id: 'typewriter', name: 'Schreibmaschine', unl: { secret: 'typewriter' } },
    { id: 'silent', name: 'Lautlos (Feigling)', unl: null },
  ];
  D.hats = [
    { id: 'auto', name: 'Passend zur Distro', unl: null },
    { id: 'none', name: 'Oben ohne', unl: null },
  ];

  /* =========================================================== ERFOLGE */
  const A = [];
  const ach = (id, cat, name, desc, check, extra) => A.push(Object.assign({ id, cat, name, desc, check }, extra || {}));

  // Bytes insgesamt
  [
    [1e3, 'Hallo Welt', 'Das erste Kilobyte. Jede Reise beginnt mit printf.'],
    [6.4e5, '640K sollten reichen', 'Sollten sie. Taten sie aber nicht.'],
    [1.44e6, 'Diskette voll', '1,44 MB. Das Speichern-Symbol lebt weiter.'],
    [8e6, 'Eight Megabytes And Constantly Swapping', 'So viel RAM brauchte Emacs damals. Heute: der Cursor in Slack.'],
    [7e8, 'CD gebrannt', '700 MB. Mit Nero. Beschriftet mit Edding.'],
    [4.7e9, 'DVD-Rohling', 'Groß genug für eine Linux-ISO. Knapp.'],
    [2.5e10, 'Blu-ray', 'Eine ganze Blu-ray voller Code. Niemand wird sie abspielen.'],
    [1e11, 'node_modules', 'Größer als dein node_modules-Ordner. Knapp.'],
    [1e12, 'Terabyte-Club', 'Eine ganze Festplatte. Hauptsächlich Log-Dateien.'],
    [1e14, 'Hundert Terabyte', 'Dein Downloads-Ordner hat eine eigene Postleitzahl.'],
    [1e15, 'Petabyte-Pionier', 'So viel wie das gesamte Internet von 1995. Ungefähr.'],
    [1e18, 'Exabyte-Experte', 'Du produzierst mehr Daten als ein Großkonzern. Und weniger Werbung.'],
    [1e21, 'Zettabyte-Zauberer', 'Das gesamte Internet von heute. In deinem Keller.'],
    [1e24, 'Yottabyte-Yogi', 'Dafür gibt es eigentlich gar keinen Anwendungsfall mehr.'],
    [1e27, 'Ronnabyte-Rockstar', 'Diese Einheit wurde erst 2022 erfunden. Für dich.'],
    [1e30, 'Quettabyte-Quälgeist', 'Das Ende der SI-Präfixe. Du hast die Einheiten durchgespielt.'],
    [1e33, 'Jenseits der Einheiten', 'Hierfür gibt es kein Wort. Die Wissenschaft ist ratlos.'],
  ].forEach(([n, name, desc], i) => ach('b' + i, 'bytes', name, desc + ' (' + fmtB(n) + ' insgesamt erzeugt)', (S) => S.allBytes >= n, { prog: (S) => [S.allBytes, n], fmt: 'b' }));

  // Rate
  [
    [1, 'Es lebt!', '1 B/s. Langsam, aber es atmet.'],
    [7e3, '56k-Modem', 'Piiiiep-krrrrrr-dödödö. 7 KB/s wie 1998.'],
    [1.6e4, 'ISDN', 'Zwei Kanäle! 128 kbit! Der Fortschritt!'],
    [2e6, 'DSL 16.000', 'Endlich kann man Musik herunterladen. Legal natürlich.'],
    [1.25e7, 'Fast Ethernet', '100 Mbit. So schnell war das Firmennetz 2005.'],
    [1.25e8, 'Gigabit', 'Dein Router ist jetzt der Flaschenhals. Wie immer.'],
    [1.25e9, '10GbE', 'Dein Switch hat mehr Lüfter als ein Rechenzentrum.'],
    [6.4e10, 'PCIe 5.0 x16', 'So schnell ist nur die Grafikkarte. Und jetzt du.'],
    [2e12, 'DE-CIX', 'So viel Traffic wie der größte Internetknoten der Welt in Frankfurt.'],
    [1e15, 'Glasfaser zum Mond', 'Latenz: 1,3 Sekunden. Bandbreite: ja.'],
    [1e18, 'Subraum-Kommunikation', 'Star Trek hat es versprochen. Du hast geliefert.'],
    [1e21, 'Tachyonen-Uplink', 'Die Daten kommen an, bevor du sie brauchst.'],
    [1e24, 'Die Bandbreite Gottes', 'Mehr geht nicht. Oder doch?'],
  ].forEach(([n, name, desc], i) => ach('r' + i, 'rate', name, desc + ' (' + fmtB(n) + '/s)', (S, G) => G.bpsBase >= n, { prog: (S, G) => [G.bpsBase, n], fmt: 'r' }));

  // Klicks
  [
    [1, 'Erster Tastendruck', 'Du hast das Terminal berührt. Es war schön.'],
    [100, 'Aufgewärmt', '100 Klicks. Die Finger sind warm.'],
    [1000, 'Tastatur-Krieger', '1.000 Klicks. Die Leertaste zittert.'],
    [5000, 'Hacker-Typer', '5.000 Klicks. Du siehst aus wie in einem Hollywood-Film.'],
    [15000, 'Sehnenscheidenentzündung', '15.000 Klicks. Bitte mach mal eine Pause.'],
    [50000, 'Mechanischer Tod', '50.000 Klicks. Deine Tastatur hat ein Testament gemacht.'],
    [150000, 'Die Finger Gottes', '150.000 Klicks. Wir sind beeindruckt und besorgt.'],
  ].forEach(([n, name, desc], i) => ach('c' + i, 'click', name, desc, (S) => S.stats.clicks >= n, { prog: (S) => [S.stats.clicks, n] }));
  ach('cb0', 'click', 'Klick-Millionär', '1 MB allein durch Klicken erzeugt.', (S) => S.stats.clickBytes >= 1e6);
  ach('cb1', 'click', 'Klick-Milliardär', '1 GB allein durch Klicken erzeugt.', (S) => S.stats.clickBytes >= 1e9);
  ach('cb2', 'click', 'Klick-Magnat', '1 PB allein durch Klicken erzeugt.', (S) => S.stats.clickBytes >= 1e15);
  ach('cb3', 'click', 'Der Klick, der die Welt bewegte', '1 ZB allein durch Klicken erzeugt.', (S) => S.stats.clickBytes >= 1e21);

  // Gebäude
  const B1 = {
    bash: 'Hallo, Shell', cron: '* * * * *', pi: 'Himbeere gepflückt', intern: 'Frischfleisch', thinkpad: 'Rote Nase',
    homelab: 'Keller-König', docker: 'Container-Schiff', k8s: 'Steuermann', community: 'Willkommen in der Community', datacenter: 'Klimawandel',
    maintainer: 'Patch akzeptiert', beowulf: 'Stell dir vor…', ai: 'Hallo, Kollege KI', quantum: 'Quantensprung', satellite: 'Abgehoben',
    dyson: 'Sonnenanbeter', matrix: 'Rote oder blaue Pille?', multiverse: 'Multiversal', universe: 'Root des Universums',
  };
  const B100 = {
    bash: 'Skript-Kiddie', cron: 'Zeitreisender', pi: 'Schubladen-Imperium', intern: 'Praktikanten-Armee', thinkpad: 'Lenovo-Lager',
    homelab: 'Stromnetz überlastet', docker: 'Hafen Hamburg', k8s: 'YAML-Ingenieur', community: 'Benevolent Dictator', datacenter: 'Cloud-Anbieter',
    maintainer: 'Linus wäre stolz', beowulf: 'Slashdot-Legende', ai: 'Singularität light', quantum: 'Superposition', satellite: 'Sternenflotte',
    dyson: 'Kardaschow Typ II', matrix: 'Der Architekt', multiverse: 'Ricks Garage', universe: 'Allmächtig',
  };
  D.buildings.forEach((b) => {
    ach('bl1_' + b.id, 'bld', B1[b.id], 'Besitze 1 ' + (b.acc || b.name) + '.', (S) => S.b[b.id] >= 1);
    ach('bl50_' + b.id, 'bld', b.short + ' im Rudel', 'Besitze 50 ' + b.plural + '.', (S) => S.b[b.id] >= 50, { prog: (S) => [S.b[b.id], 50] });
    ach('bl100_' + b.id, 'bld', B100[b.id], 'Besitze 100 ' + b.plural + '.', (S) => S.b[b.id] >= 100, { prog: (S) => [S.b[b.id], 100] });
    ach('bl200_' + b.id, 'bld', b.short + '-Monopol', 'Besitze 200 ' + b.plural + '.', (S) => S.b[b.id] >= 200, { hard: true, prog: (S) => [S.b[b.id], 200] });
  });
  [[100, 'Sammler'], [500, 'Hardware-Horter'], [1000, 'Rechenzentrums-Besitzer'], [2500, 'Infrastruktur-Imperium'], [5000, 'Der Große Horter']].forEach(([n, name], i) =>
    ach('bt' + i, 'bld', name, 'Besitze insgesamt ' + n + ' Gebäude gleichzeitig.', (S, G) => G.totalBuildings >= n, { prog: (S, G) => [G.totalBuildings, n] }));
  ach('ball', 'bld', 'Vollständiges Setup', 'Besitze von jedem Gebäudetyp mindestens eins.', (S) => D.buildings.every((b) => S.b[b.id] >= 1));

  // Upgrades
  [[10, 'Aufgerüstet'], [50, 'Tuning-Freak'], [100, 'Upgrade-Süchtig'], [175, 'Jedes Paket installiert'], [250, 'apt upgrade --all']].forEach(([n, name], i) =>
    ach('u' + i, 'upg', name, 'Kaufe ' + n + ' Upgrades in einem Run.', (S, G) => G.upgradesOwned >= n, { prog: (S, G) => [G.upgradesOwned, n] }));
  ach('usw', 'upg', 'Glaubenskrieger', 'Entscheide dich in allen fünf Glaubenskriegen.', (S) => ['editor', 'indent', 'init', 'desktop', 'shell'].every((g) => S.choices[g]));

  // Hops
  [[1, 'Distro-Hopper', 'Du hast zum ersten Mal die Distro gewechselt. Es wird nicht das letzte Mal sein.'],
    [3, 'Unentschlossen', 'Drei Hops. Irgendwas passt immer nicht.'],
    [7, 'Chronischer Hopper', 'Sieben Hops. Deine USB-Sticks haben Namen.'],
    [15, 'ISO-Sammler', '15 Hops. Dein Ventoy-Stick ist voll.'],
    [30, 'Nomade', '30 Hops. Du hast keine Heimat. Nur Partitionen.'],
    [60, 'Hop-Legende', '60 Hops. DistroWatch hat dir eine eigene Seite gewidmet.'],
    [100, 'Der ewige Hopper', '100 Hops. Du bist der Grund, warum es so viele Distros gibt.'],
  ].forEach(([n, name, desc], i) => ach('h' + i, 'hop', name, desc, (S) => S.hops >= n, { prog: (S) => [S.hops, n] }));
  ach('hfast', 'hop', 'Speedrun', 'Hoppe weniger als 10 Minuten nach dem letzten Hop (mit Barthaar-Gewinn).', (S) => S.stats.fastHop);
  ach('hbig', 'hop', 'Großer Sprung', 'Erhalte bei einem einzigen Hop mindestens 100 Barthaare.', (S) => S.stats.bestHop >= 100);
  ach('hbig2', 'hop', 'Gigantischer Sprung', 'Erhalte bei einem einzigen Hop mindestens 10.000 Barthaare.', (S) => S.stats.bestHop >= 10000);

  // Distros
  const DN = {
    ubuntu: ['Menschlichkeit', 'Ubuntu heißt „Menschlichkeit gegenüber anderen“. Und „Snap-Pakete“.'],
    mint: ['Frischer Atem', 'Linux Mint gebootet. Es riecht nach Minze.'],
    fedora: ['Hut ab!', 'Fedora gebootet. Der Hut steht dir.'],
    debian: ['Stabil wie ein Fels', 'Debian gebootet. Deine Pakete sind jetzt zwei Jahre alt und unzerstörbar.'],
    arch: ['I use Arch btw', 'Arch Linux gebootet. Du hast es bereits drei Leuten erzählt.'],
    manjaro: ['Arch für Faule', 'Manjaro gebootet. Die Arch-Nutzer gucken dich komisch an.'],
    opensuse: ['Grüner Gecko', 'openSUSE gebootet. YaST hat dich bereits konfiguriert.'],
    popos: ['Pop!', 'Pop!_OS gebootet. Die Rakete ist gestartet.'],
    kali: ['Ich bin drin', 'Kali gebootet. Du hast dich direkt selbst gehackt.'],
    gentoo: ['emerge --world', 'Gentoo gebootet. Kompilierzeit bisher: 3 Tage.'],
    alpine: ['Gipfelstürmer', 'Alpine gebootet. So klein, so fein.'],
    nixos: ['Deklarativ glücklich', 'NixOS gebootet. Du verstehst jetzt 12 % der Syntax.'],
    slackware: ['Slack off', 'Slackware gebootet. Willkommen im Jahr 1993.'],
    void: ['Ins Leere', 'Void gebootet. Kein systemd weit und breit.'],
    cachyos: ['Maximal optimiert', 'CachyOS gebootet. Deine CPU dankt es dir.'],
    rhel: ['Enterprise-Ready', 'RHEL gebootet. Das Abo läuft.'],
    freebsd: ['Das ist kein Linux!', 'FreeBSD gebootet. Beastie winkt dir zu.'],
    lfs: ['Aus dem Nichts', 'Linux From Scratch gebootet. Du hast den Compiler mit dem Compiler kompiliert.'],
    hannah: ['Best of Both Worlds', 'Hannah Montana Linux gebootet. Du bereust nichts.'],
    windows: ['Verräter!', 'Du hast Fenster 11 gebootet. Die Community ist enttäuscht.'],
  };
  D.distros.forEach((d) => {
    const [name, desc] = DN[d.id];
    ach('d_' + d.id, 'distro', name, desc, (S) => (S.visited[d.id] || 0) > 0, { secret: d.secret, icon: 'd_' + d.id });
  });
  ach('dall', 'distro', 'DistroWatch-Komplettist', 'Besuche alle regulären Distros.', (S) => D.distros.every((d) => d.secret || S.visited[d.id]));

  // Bart
  [[1, 'Flaum', 'Dein erstes Barthaar. Man sieht es kaum, aber es ist da.'],
    [10, 'Dreitagebart', '10 Barthaare. Sieht nach durchgemachter Nacht aus.'],
    [50, 'Hipster-Bart', '50 Barthaare. Du trinkst jetzt Flat White.'],
    [250, 'Holzfäller', '250 Barthaare. Du könntest einen Baum fällen. Mit Bash.'],
    [1000, 'Graubart', '1.000 Barthaare. Du erinnerst dich an die Zeit vor systemd.'],
    [5000, 'Unix-Guru', '5.000 Barthaare. Menschen pilgern zu dir, um Fragen zu stellen.'],
    [25000, 'Zauberer', '25.000 Barthaare. Du tippst keine Befehle mehr – du sprichst Zauber.'],
    [100000, 'Legende der Mailingliste', '100.000 Barthaare. In deinem Bart leben drei Kernel-Maintainer.'],
    [1e6, 'Der Bart, der die Welt umspannt', 'Eine Million Barthaare. Er reicht bis zum DE-CIX.'],
  ].forEach(([n, name, desc], i) => ach('br' + i, 'beard', name, desc, (S) => S.beard >= n, { prog: (S) => [S.beard, n] }));
  [[1, 'Punktsieg', 'Gib zum ersten Mal Karma für eine Dotfile aus.'], [10, 'Konfigurations-Junkie', 'Besitze 10 Dotfiles.'], [25, 'Dotfile-Sammler', 'Besitze 25 Dotfiles.']].forEach(([n, name, desc], i) =>
    ach('df' + i, 'beard', name, desc, (S) => Object.keys(S.dotfiles).length >= n, { prog: (S) => [Object.keys(S.dotfiles).length, n] }));
  ach('dfall', 'beard', 'Perfekter Rice', 'Besitze alle Dotfiles. r/unixporn liegt dir zu Füßen.', (S) => D.dotfiles.every((d) => d.dir || S.dotfiles[d.id]));

  // Enten, Bugs, IRC, Quiz
  [[1, 'Quack!', 'Klicke eine goldene Gummiente.'], [7, 'Entenflüsterer', 'Klicke 7 Enten.'], [27, 'Enten-Debugger', 'Klicke 27 Enten.'],
    [77, 'Entenhausen', 'Klicke 77 Enten.'], [250, 'Der Herr der Enten', 'Klicke 250 Enten.'], [777, 'Quack Quack Quack', 'Klicke 777 Enten.']]
    .forEach(([n, name, desc], i) => ach('dk' + i, 'event', name, desc, (S) => S.stats.ducks >= n, { prog: (S) => [S.stats.ducks, n] }));
  [[1, 'Kammerjäger', 'Zerquetsche einen Bug.'], [10, 'Debugger', 'Zerquetsche 10 Bugs.'], [50, 'Bugfix-Maschine', 'Zerquetsche 50 Bugs.'],
    [200, 'Zero Bugs', 'Zerquetsche 200 Bugs. (Es gibt immer noch welche.)'], [1000, 'Insektenvernichter', 'Zerquetsche 1.000 Bugs.']]
    .forEach(([n, name, desc], i) => ach('bg' + i, 'event', name, desc, (S) => S.stats.bugs >= n, { prog: (S) => [S.stats.bugs, n] }));
  [[1, 'IRC-Neuling', 'Beantworte eine IRC-Nachricht.'], [15, 'Stammgast in #linux', 'Beantworte 15 IRC-Nachrichten.'], [60, 'Channel-Operator', 'Beantworte 60 IRC-Nachrichten.'], [150, 'Netsplit-Überlebender', 'Beantworte 150 IRC-Nachrichten.']]
    .forEach(([n, name, desc], i) => ach('irc' + i, 'event', name, desc, (S) => S.stats.irc >= n, { prog: (S) => [S.stats.irc, n] }));
  [[1, 'Klugscheißer', 'Beantworte eine Quizfrage richtig.'], [10, 'Wandelndes Wiki', 'Beantworte 10 Quizfragen richtig.'], [40, 'Arch-Wiki auf zwei Beinen', 'Beantworte 40 Quizfragen richtig.'], [100, 'Allwissend', 'Beantworte 100 Quizfragen richtig.']]
    .forEach(([n, name, desc], i) => ach('qz' + i, 'event', name, desc, (S) => S.stats.quizRight >= n, { prog: (S) => [S.stats.quizRight, n] }));
  ach('combo', 'event', 'Koffein-Overdose', 'Habe Koffein-Rausch und Flow-Zustand gleichzeitig aktiv.', (S, G) => G.hasBuff('frenzy') && G.hasBuff('clickfrenzy'));
  ach('combo3', 'event', 'Totale Eskalation', 'Habe drei verschiedene positive Buffs gleichzeitig aktiv.', (S, G) => G.positiveBuffs >= 3);
  ach('btw10', 'event', 'Hab ich schon erwähnt…?', 'Erzähle 10-mal, dass du Arch benutzt (btw-Blasen).', (S) => S.stats.btw >= 10);
  ach('upd', 'event', 'Bitte Computer nicht ausschalten', 'Überlebe ein Zwangsupdate.', (S) => S.stats.updates >= 1, { secret: true });

  // Zeit & Sonstiges
  ach('t1', 'misc', 'Eine Stunde Uptime', 'Spiele insgesamt eine Stunde.', (S) => S.stats.playTime >= 3600, { prog: (S) => [S.stats.playTime, 3600], fmt: 't' });
  ach('t2', 'misc', 'Zehn Stunden Uptime', 'Spiele insgesamt zehn Stunden.', (S) => S.stats.playTime >= 36000, { prog: (S) => [S.stats.playTime, 36000], fmt: 't' });
  ach('t3', 'misc', 'Hundert Stunden Uptime', 'Spiele insgesamt hundert Stunden. Geh mal raus. Es gibt da einen gelben Ball.', (S) => S.stats.playTime >= 360000, { prog: (S) => [S.stats.playTime, 360000], fmt: 't' });
  ach('streak3', 'misc', 'Uptime: 3 Tage', 'Spiele an drei Tagen hintereinander.', (S) => (S.daily.best || 0) >= 3, { prog: (S) => [S.daily.streak || 0, 3] });
  ach('streak7', 'misc', 'Uptime: 1 Woche', 'Spiele sieben Tage hintereinander. Dein Server wäre stolz.', (S) => (S.daily.best || 0) >= 7, { prog: (S) => [S.daily.streak || 0, 7] });
  ach('streak30', 'misc', 'Uptime: 30 Tage', 'Einen Monat ohne Neustart. Ähm, ohne Pause.', (S) => (S.daily.best || 0) >= 30, { prog: (S) => [S.daily.streak || 0, 30] });
  ach('night', 'misc', 'Nachteule', 'Spiele zwischen 2 und 5 Uhr nachts.', (S) => S.stats.night, { secret: true });
  ach('offline', 'misc', 'Der Server läuft auch ohne mich', 'Kehre nach mindestens 8 Stunden Abwesenheit zurück.', (S) => S.stats.longAway, { secret: true });
  ach('idle', 'misc', 'Faultier', 'Erreiche 1 MB in einem Run, ohne ein einziges Mal zu klicken.', (S) => S.runClicks === 0 && S.runBytes >= 1e6, { secret: true });
  ach('purist', 'misc', 'Bash-Purist', 'Erreiche 1 GB in einem Run, während Bash-Skripte über 90 % deiner Produktion liefern.', (S, G) => S.runBytes >= 1e9 && G.bpsBase > 0 && G.perUnit.bash * S.b.bash * G.prodMult >= G.bpsBase * 0.9, { secret: true });
  ach('rich', 'misc', 'Sparfuchs', 'Habe mehr als eine Stunde Produktion auf dem Konto.', (S, G) => G.bpsBase > 100 && S.bytes >= G.bpsBase * 3600);
  ach('tux', 'misc', 'Pinguin-Piesacker', 'Stupse Tux 25-mal an.', (S) => S.stats.tuxPokes >= 25, { secret: true });
  ach('bulk', 'misc', 'Großeinkauf', 'Kaufe 100 Gebäude auf einmal.', (S) => S.stats.bulk100);
  ach('allupg', 'misc', 'Nichts mehr zu kaufen', 'Kaufe alle derzeit verfügbaren Upgrades mit „Alles kaufen“.', (S) => S.stats.buyAllUsed, { secret: true });
  ach('win', 'misc', 'Das Jahr des Linux-Desktops', 'Du hast es geschafft. Es ist wirklich passiert.', (S) => S.won, { hard: true });

  // Geheime Shell-Befehle
  const SECRETS = [
    ['sudo', 'Dieser Vorfall wird gemeldet', 'Versuche, sudo zu benutzen, ohne in der sudoers-Datei zu stehen.'],
    ['sandwich', 'Okay.', 'sudo make me a sandwich.'],
    ['rmrf', 'Netter Versuch', 'Versuche, rm -rf / auszuführen.'],
    ['rmrf2', 'Wahnsinnig mutig', 'Führe rm -rf / --no-preserve-root aus. Mit sudo.'],
    ['sl', 'Choo Choo!', 'Vertippe dich bei ls. Oder auch nicht.'],
    ['vimexit', 'Vim beendet!', 'Beende Vim. Du gehörst zu einer kleinen Elite.'],
    ['cowsay', 'Muuuh', 'Lass eine Kuh sprechen.'],
    ['fortune', 'Glückskeks', 'Lass dir die Zukunft vorhersagen.'],
    ['matrix', 'Folge dem weißen Kaninchen', 'Betritt die Matrix.'],
    ['hack', 'Hollywood-Hacker', 'Hacke dich ins Mainframe. Mit zwei Leuten an einer Tastatur.'],
    ['teapot', 'I’m a teapot', 'Bitte ein Terminal, Kaffee zu kochen.'],
    ['xyzzy', 'Nichts passiert', 'Ein Zauberwort aus der Urzeit der Computerspiele.'],
    ['konami', '30 Leben', '↑ ↑ ↓ ↓ ← → ← → B A'],
    ['wrongpm', 'Falsche Distro, Kollege', 'Benutze den Paketmanager einer anderen Distro.'],
    ['emacs', 'Betriebssystem gestartet', 'Starte Emacs im Terminal.'],
    ['forcepush', 'Das hast du nicht getan', 'git push --force auf main.'],
    ['answer', 'Die Antwort', 'Frage nach dem Leben, dem Universum und dem ganzen Rest.'],
    ['cheat', 'Schummler!', 'Versuche, dir Bytes zu erschummeln.'],
    ['hannah', 'Geheime Distro', 'Finde die geheimste Distro von allen.'],
    ['neofetch', 'Screenshot-fertig', 'Zeige deine Systeminfos, wie es sich gehört.'],
    ['typewriter', 'Klack-klack-ding!', 'Finde die Schreibmaschine.'],
    ['reboot', 'Hast du es schon mit Aus- und Einschalten versucht?', 'Versuche einen Neustart.'],
    ['firmware', 'Firmware-Tourist', 'Starte im GRUB-Menü etwas, das keine Distro ist.'],
  ];
  SECRETS.forEach(([id, name, desc]) => ach('s_' + id, 'secret', name, desc, (S) => !!S.secrets[id], { secret: true }));

  D.achievements = A;
  D.aIndex = {};
  A.forEach((a, i) => { a.order = i; D.aIndex[a.id] = a; });
  D.achCats = {
    bytes: ['Speicherplatz', '#ffd23f'], rate: ['Bandbreite', '#5ce1e6'], click: ['Tastatur', '#ff8fc7'], bld: ['Hardware', '#3ddc84'],
    upg: ['Upgrades', '#a86fff'], hop: ['Hops', '#ff7b25'], distro: ['Distros', '#3d8bff'], beard: ['Bart & Dotfiles', '#d9a066'],
    event: ['Ereignisse', '#ef3e4a'], misc: ['Sonstiges', '#9ba5b3'], secret: ['Geheim', '#b7f36b'],
  };

  function fmtB(n) { return DH.util ? DH.util.bytes(n) : String(n); }
})();

