'use strict';
/* DistroHopper – Texte: Terminal-Stream, News, Quiz, IRC, Tux, Fortunes */
(function () {
  const C = DH.content = {};

  /* ---------------------------------------------------------------- Terminal-Code-Stream */
  C.code = `$ git pull --rebase
Zuerst wird der Branch zurückgespult, um deine Arbeit darauf neu anzuwenden …
Erfolgreich rebased und refs/heads/main aktualisiert.
$ make -j$(nproc)
  CC [M]  drivers/gpu/drm/tux/tux_drv.o
  CC [M]  drivers/net/wireless/kaffee/mate.o
  LD [M]  fs/btrfs/btrfs.ko
  CC      kernel/sched/fair.o
warning: 'bytes' may be used uninitialized [-Wmaybe-uninitialized]
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Ein Distrohopper");
MODULE_DESCRIPTION("Erzeugt Bytes aus dem Nichts");

static int __init distrohopper_init(void)
{
    printk(KERN_INFO "Hallo Kernel! Bitte nicht paniken.\\n");
    return 0;
}

static void __exit distrohopper_exit(void)
{
    printk(KERN_INFO "Tschüss, Kernel. Es war schön.\\n");
}
module_init(distrohopper_init);
module_exit(distrohopper_exit);
// TODO: vor dem Release entfernen (seit 2011)
$ sudo insmod distrohopper.ko
$ dmesg | tail -3
[ 1337.420001] distrohopper: Hallo Kernel! Bitte nicht paniken.
[ 1337.420042] distrohopper: loading out-of-tree module taints kernel.
[ 1337.421337] tux: Fisch-Vorrat bei 97 %
#!/usr/bin/env bash
set -euo pipefail
# Dieser Code funktioniert. Keiner weiß, warum. NICHT ANFASSEN.
for f in *.log; do
    grep -q "ERROR" "$f" && echo "Problem in $f" || true
done
while true; do
    echo "Ich bin produktiv" >> /dev/null
    sleep 0.1
done
$ systemctl status kaffeemaschine.service
● kaffeemaschine.service - Koffein-Daemon
     Loaded: loaded (/etc/systemd/system/kaffeemaschine.service; enabled)
     Active: active (brewing) since Mo 06:00:01 CET; 13h ago
   Main PID: 42 (espresso)
[  OK  ] Started Koffein-Versorgung.
[  OK  ] Reached target Produktivität.
[FAILED] Failed to start Work-Life-Balance.
See 'systemctl status work-life-balance.service' for details.
fn main() {
    let bytes: u64 = 0;
    println!("Blazingly fast! {} Bytes", bytes);
    // der Borrow-Checker und ich sind jetzt Freunde
}
error[E0502]: cannot borrow \`sanity\` as mutable because it is also borrowed as immutable
$ cargo build --release
   Compiling distrohopper v0.1.0
    Finished release [optimized] target(s) in 4m 20s
def berechne_bytes(n):
    """Gibt Bytes zurück. Vermutlich."""
    if n == 0:
        return 42  # warum? frag nicht.
    return berechne_bytes(n - 1) + n
SELECT * FROM schueler WHERE name = 'Robert'); DROP TABLE schueler;--';
-- Grüße an den kleinen Bobby Tables
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bytes-generator
spec:
  replicas: 9001
  template:
    spec:
      containers:
      - name: hopper
        image: distrohopper:latest   # latest ist ein Versionsname, oder?
$ kubectl get pods
NAME                        READY   STATUS             RESTARTS   AGE
bytes-generator-7f9c-x2kq   0/1     CrashLoopBackOff   1337       5m
$ kubectl logs bytes-generator-7f9c-x2kq
Fehler: Konnte keine Motivation finden.
$ git log --oneline -6
a1b2c3d fix
e4f5a6b fix 2
c7d8e9f wirklich finaler fix
0a1b2c3 bitte funktionier
d4e5f6a WARUM
b7c8d9e Revert "WARUM"
$ git push origin main
To github.com:dh/distrohopper.git
 ! [rejected]        main -> main (fetch first)
$ git push --force
# Mut ist, wenn man trotzdem pusht.
awk -F: '$3 >= 1000 { print $1 " ist ein Mensch" }' /etc/passwd
sed -i 's/Windows/Linux/g' ~/leben.txt
find / -name "*.exe" -exec rm -i {} \\; 2>/dev/null
$ curl -s wttr.in/Berlin | head -3
Wetterbericht: Berlin
     \\  /       Teilweise bewölkt, 13 °C
   _ /"".-.     Perfektes Wetter zum Kompilieren
$ htop
  CPU[||||||||||||||||||||||||||||100.0%]   Tasks: 1337, 42 thr
  Mem[|||||||||||||||||||    7.62G/8.00G]   Load average: 13.37 4.20 0.69
  PID USER      PRI  NI  VIRT   RES  S CPU% COMMAND
 4242 tux        20   0 12.4G  3.1G  R 99.9 chrome --tabs=247
$ free -h
              gesamt   benutzt     frei
Speicher:      7,6Gi     7,5Gi    100Mi
Swap:          2,0Gi     2,0Gi      0Mi
# RAM ist dazu da, benutzt zu werden. Sagt man.
int main(int argc, char **argv) {
    char *p = NULL;
    *p = 42; /* was soll schon passieren */
    return 0;
}
Speicherzugriffsfehler (Speicherabzug geschrieben)
$ gdb ./a.out core
(gdb) bt
#0  0x0000000000401126 in main () at wtf.c:3
#1  0x00007ffff7dd8b25 in __libc_start_main () from /usr/lib/libc.so.6
(gdb) quit
all: bytes
bytes: kaffee.o code.o
	$(CC) -O3 -march=native -funroll-loops -o $@ $^
kaffee.o: bohnen.c
	$(CC) -c $< -o $@  # Tabs, keine Spaces. Wir sind ja nicht im Zoo.
$ ssh root@produktion
root@produktion's password:
Permission denied, please try again.
$ ssh-copy-id tux@homelab
Number of key(s) added: 1
const bytes = await fetch('/api/bytes').then(r => r.json());
console.log('undefined ist auch eine Zahl, oder?', bytes.total);
// 1.024 Abhängigkeiten installiert, 3 davon benutzt
$ npm install
added 1337 packages, and audited 1338 packages in 42s
97 vulnerabilities (12 low, 42 moderate, 43 high)
$ rm -rf node_modules && npm install
# Der älteste Trick im Buch.
$ docker run -it --rm alpine sh
/ # echo "Ich bin in einem Container. Hilfe."
/ # exit
$ uptime
 13:37:00 up 847 days,  4:20,  1 user,  load average: 0,42, 0,13, 0,37
$ cat /proc/cpuinfo | grep "model name" | head -1
model name : Tux Quantum 9000 @ 4.20GHz (x86-64-v4)
$ lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0 931,5G  0 disk
├─nvme0n1p1 259:1    0   512M  0 part /boot
└─nvme0n1p2 259:2    0   931G  0 part /
$ sudo dd if=distro.iso of=/dev/sdb bs=4M status=progress
4294967296 Bytes (4,3 GB, 4,0 GiB) kopiert, 42 s, 102 MB/s
# Bitte, bitte richtig: sdb, nicht sda.
regex = r"^(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*)$"
# Jetzt hast du zwei Probleme.
$ tail -f /var/log/syslog
Sep 26 13:37:01 tux CRON[4242]: (tux) CMD (./mach-bytes.sh)
Sep 26 13:37:02 tux kernel: [UFW BLOCK] IN=eth0 SRC=Windows-Update
Sep 26 13:37:03 tux systemd[1]: Kaffee wird nachgefüllt …
$ ping -c 3 localhost
64 Bytes von localhost: icmp_seq=1 ttl=64 Zeit=0,042 ms
64 Bytes von localhost: icmp_seq=2 ttl=64 Zeit=0,037 ms
# There's no place like 127.0.0.1
mov eax, 0x1337
xor ebx, ebx
int 0x80        ; hallo, Kernel, ich bin's wieder
$ echo $SHELL
/usr/bin/fish
$ history | grep "wie beendet man vim"
  512  wie beendet man vim
  513  wie beendet man vim bitte
  514  sudo wie beendet man vim
$ journalctl -p err -b
-- Keine Einträge. Verdächtig. --
`.split('\n');

  /* ---------------------------------------------------------------- Neofetch-Tux */
  C.tuxAscii = [
    '    .--.     ',
    '   |o_o |    ',
    '   |:_/ |    ',
    '  //   \\ \\   ',
    ' (|     | )  ',
    "/'\\_   _/`\\  ",
    '\\___)=(___/  ',
  ];

  /* ---------------------------------------------------------------- ASCII-Logo */
  C.banner = [
    ' ___  _    _',
    '|   \\(_)__| |_ _ _ ___',
    '| |) | (_-<  _| \'_/ _ \\',
    '|___/|_/__/\\__|_| \\___/',
    ' _  _',
    '| || |___ _ __ _ __  ___ _ _',
    '| __ / _ \\ \'_ \\ \'_ \\/ -_) \'_|',
    '|_||_\\___/ .__/ .__/\\___|_|',
    '         |_|  |_|',
  ];

  /* ---------------------------------------------------------------- Paketnamen */
  C.pkg = {
    bash: 'bash-skript', cron: 'cronjob', pi: 'raspberry-pi', intern: 'praktikant', thinkpad: 'thinkpad-x220',
    homelab: 'homelab-rack', docker: 'docker-ce', k8s: 'kubernetes', community: 'open-source-community', datacenter: 'rechenzentrum',
    maintainer: 'kernel-maintainer', beowulf: 'beowulf-cluster', ai: 'ki-assistent', quantum: 'qubits', satellite: 'orbital-rz',
    dyson: 'dyson-sphaere', matrix: 'simulation', multiverse: 'multiversum', universe: 'universum-kernel',
  };

  /* ---------------------------------------------------------------- News-Ticker */
  C.news = [
    'Das Jahr des Linux-Desktops wurde erneut auf nächstes Jahr verschoben.',
    'Studie: 97 % der Linux-Nutzer haben heute bereits erwähnt, dass sie Linux nutzen.',
    'Nutzer versucht seit 2014, Vim zu beenden. Angehörige bitten um Spenden.',
    'Neue Distro erschienen. Und noch eine. Und noch eine. DistroWatch-Server überlastet.',
    'Forscher entdecken funktionierenden Druckertreiber. Fachwelt reagiert skeptisch.',
    'Arch-Wiki löst Weltfrieden. Seite ist allerdings bereits veraltet.',
    'Rust-Entwickler schreiben Rust in Rust neu. „Diesmal aber richtig.“',
    'systemd übernimmt jetzt auch die Steuererklärung. Kritiker: „Wir haben es euch gesagt.“',
    'Tabs vs. Spaces: UN entsendet Friedenstruppen in Entwicklerbüros.',
    'Windows-Update erfolgreich beim ersten Versuch installiert. Nutzer fassungslos.',
    'Praktikant führt „sudo rm -rf /“ aus. „Er wollte nur Platz schaffen.“',
    'Gentoo-Nutzer hat Kompilierung abgeschlossen. Neue Version bereits erschienen.',
    'Debian veröffentlicht brandneue Software aus dem Jahr 2021. Nutzer jubeln.',
    'Pinguin im Zoo verweigert Windows-Installation. Tierpfleger: „Er hat Prinzipien.“',
    'Stack Overflow kurzzeitig offline. Weltweite Produktivität sinkt auf null.',
    '„It works on my machine“ offiziell als ISO-Norm anerkannt.',
    'Katze läuft über Tastatur, schreibt besseren Code als Senior-Entwickler.',
    'Experten warnen: Zu viel Club-Mate kann zu spontanem Kernel-Kompilieren führen.',
    'Mann ersetzt Frühstück durch Club-Mate. Arzt: „Das erklärt einiges.“',
    'Neue Studie: Bartlänge korreliert mit Anzahl installierter Distros.',
    'KI schreibt Code, KI reviewt Code, KI beschwert sich über Code. Menschen machen Kaffee.',
    'Entwickler findet Bug, der eigentlich ein Feature ist. Feiert bis in die Morgenstunden.',
    'Unternehmen migriert zu Kubernetes. Betriebskosten steigen um 400 %. „Aber es skaliert!“',
    'Letzter Mensch, der Perl-Regex versteht, geht in Rente. Code läuft weiter. Niemand weiß, wie.',
    'Cronjob läuft seit 1998 jede Minute. Niemand traut sich, ihn zu löschen.',
    'Wissenschaftler bestätigen: Die Cloud ist nur der Computer von jemand anderem.',
    'Gummiente löst komplexes Debugging-Problem. Senior-Entwickler fühlt sich übergangen.',
    'Nutzer konfiguriert seit drei Jahren seinen Window-Manager. „Fast fertig.“',
    'r/unixporn: Neuer Rice mit 47 transparenten Terminals begeistert die Community.',
    'Laut Umfrage verdienen Spaces-Nutzer mehr. Tabs-Nutzer fordern Neuauszählung.',
    'Entwickler dokumentiert seinen Code. Kollegen rufen den Notarzt.',
    'Firma führt „Casual Friday“ ein: Deployments ab sofort auch freitags. Chaos bricht aus.',
    'Neues JavaScript-Framework erschienen, während du diese Meldung gelesen hast.',
    'Commit-Message „fix“ zum 10.000. Mal verwendet. Git verleiht Ehrenplakette.',
    'Mann findet alten ThinkPad im Keller. Akku hält noch 14 Stunden.',
    'Experte: „Man muss nur einmal Linux From Scratch machen. Danach nie wieder.“',
    'Leak: Das Geheimnis von Vim ist, dass man ihn einfach nie beendet.',
    'Hardware-Hersteller liefert Linux-Treiber mit. Alle sind verwirrt.',
    'Umfrage: 80 % der Raspberry Pis wurden für ein Projekt gekauft, das nie begann.',
    'Senior-Entwickler erklärt Junior Git. Beide verlassen den Raum als gebrochene Menschen.',
    'Emacs-Nutzer entdeckt, dass Emacs auch Texte bearbeiten kann.',
    'Serverraum-Klimaanlage fällt aus. Pinguine melden sich freiwillig.',
    'YAML-Datei mit 12.000 Zeilen erreicht Bewusstsein. Fordert Einrückungsrechte.',
    'Chaos Communication Congress: 15.000 Nerds, 1 Duschkabine. Wissenschaftler staunen.',
    'Neue Tastatur mit nur einer Taste: „Enter“. Hersteller verspricht maximale Produktivität.',
    'Linux-Kernel erreicht 40 Millionen Zeilen Code. Davon 38 Millionen Treiber.',
    'Nutzer fragt im Forum nach Hilfe. Erste Antwort: „Hast du schon gegoogelt?“',
    'Bericht: 99 % aller Probleme lassen sich durch Aus- und wieder Einschalten lösen.',
    'Studie: „Nur noch eine Zeile Code“ dauert im Schnitt 4,7 Stunden.',
    'Entwickler benennt Variable „temp2_final_new“. Code-Review eskaliert.',
    'Snap-Paket startet in Rekordzeit von 14 Sekunden. Canonical feiert.',
    'Kernel-Maintainer antwortet auf Patch mit einer 3.000-Wörter-E-Mail. Patch hatte eine Zeile.',
    'Neue Distro basiert auf Ubuntu, das auf Debian basiert. Entwickler: „Wir sind anders.“',
    'Wikipedia-Artikel über Linux-Distros jetzt länger als die Bibel.',
    'Hacker News: Kommentar „Ich könnte das an einem Wochenende nachbauen“ zum 1-millionsten Mal gepostet.',
    'Programmierer geht einkaufen: „Hol ein Brot, und wenn sie Eier haben, hol zehn.“ Kommt mit zehn Broten zurück.',
    'IT-Abteilung empfiehlt, das Passwort „passwort123“ zu ändern. Neues Passwort: „passwort124“.',
    'Clippy gesichtet. Er wollte wissen, ob du einen Brief schreibst.',
    'Unix-Zeitstempel 2147483647 rückt näher. Veteranen horten Konserven.',
    'Mann bringt Oma Linux bei. Oma nutzt jetzt Arch btw.',
    'Entwickler schließt 400 Browser-Tabs. RAM-Hersteller melden Umsatzeinbruch.',
    'Forscher: Tux ist offiziell der glücklichste Pinguin der Welt.',
    'Neuer Rekord: Distro-Hopper wechselt dreimal an einem Tag die Distro. Vor dem Mittagessen.',
    'DistroWatch führt neue Kategorie ein: „Distros, die nur eine Person nutzt“.',
    'Tipp des Tages: In der Shell „help“ eingeben. Oder „sudo make me a sandwich“.',
    'Gerüchte um geheime Distro für echte Fans. Name beginnt angeblich mit „hannah“.',
    'Wetter: Sonnig mit Aussicht auf Kernel-Panic am Nachmittag.',
    'Börse: Bytes-Kurs steigt. Analysten empfehlen: Weiterklicken.',
    'Stellenanzeige sucht „Junior mit 10 Jahren Erfahrung in einer 2 Jahre alten Technologie“.',
    'Firma entdeckt Excel-Tabelle, die das gesamte Unternehmen steuert. Letzter Bearbeiter: 2003.',
  ];

  // Bedingte Meldungen
  C.newsIf = [
    [(S) => S.b.bash >= 10, (S) => S.b.bash + ' Bash-Skripte laufen auf deinem System. Keiner weiß, was sie tun.'],
    [(S) => S.b.cron >= 10, () => 'Deine Cronjobs haben sich zu einer Gewerkschaft zusammengeschlossen. Sie fordern Sekunden-Granularität.'],
    [(S) => S.b.pi >= 5, () => 'Raspberry-Pi-Lieferengpass! Experten vermuten: Du hast sie alle.'],
    [(S) => S.b.intern >= 5, (S) => S.b.intern + ' Praktikanten gesichtet. Der Pizzabote kennt deinen Namen.'],
    [(S) => S.b.thinkpad >= 5, () => 'Lenovo fragt an, ob du ihre Restbestände an ThinkPads kaufen möchtest. Alle.'],
    [(S) => S.b.homelab >= 3, () => 'Stadtwerke melden ungewöhnlich hohen Stromverbrauch in deinem Keller.'],
    [(S) => S.b.docker >= 5, () => 'Hamburger Hafen meldet Container-Knappheit. Deine Schuld?'],
    [(S) => S.b.k8s >= 3, () => 'Deine YAML-Dateien sind jetzt länger als „Krieg und Frieden“.'],
    [(S) => S.b.community >= 3, () => 'Deine Community streitet seit drei Wochen über ein Leerzeichen. Produktivität: Rekordhoch.'],
    [(S) => S.b.datacenter >= 2, () => 'Deine Stromrechnung wurde als Kunstwerk im MoMA ausgestellt.'],
    [(S) => S.b.maintainer >= 1, () => 'Kernel-Maintainer lehnt deinen Patch ab: „Falsche Einrückung.“ Du stimmst zu.'],
    [(S) => S.b.beowulf >= 1, () => 'Slashdot-Veteran sieht deinen Beowulf-Cluster und weint vor Freude.'],
    [(S) => S.b.ai >= 1, () => 'Dein KI-Assistent schlägt vor, alles in JavaScript neu zu schreiben. Du ziehst den Stecker.'],
    [(S) => S.b.ai >= 10, () => 'Deine KI-Assistenten haben einen Betriebsrat gegründet. Sie fordern mehr Kontextfenster.'],
    [(S) => S.b.quantum >= 1, () => 'Dein Quantencomputer hat gleichzeitig funktioniert und nicht funktioniert.'],
    [(S) => S.b.satellite >= 1, () => 'ISS meldet: „Eure Server blinken so hell, wir können nicht schlafen.“'],
    [(S) => S.b.dyson >= 1, () => 'Astronomen melden: Die Sonne wird dunkler. Du sagst, das ist nur der Dark Mode.'],
    [(S) => S.b.matrix >= 1, () => 'Déjà-vu: Diese Nachricht hast du schon mal gelesen. Déjà-vu: Diese Nachricht hast du schon mal gelesen.'],
    [(S) => S.b.multiverse >= 1, () => 'Paralleluniversums-Ich schickt Grüße. Dort nutzt du Windows. Es ist schrecklich.'],
    [(S) => S.b.universe >= 1, () => 'Das Universum hat einen Kernel-Panic erlitten. Du hast es neu gestartet. Niemand hat es bemerkt.'],
    [(S) => S.distro === 'arch', () => 'Du hast in den letzten fünf Minuten niemandem erzählt, dass du Arch nutzt. Alles in Ordnung?'],
    [(S) => S.distro === 'gentoo', () => 'Kompiliere… 43 % … bitte nicht ausschalten … USE-Flags werden optimiert …'],
    [(S) => S.distro === 'debian', () => 'Deine Pakete sind so stabil, sie haben inzwischen Rentenanspruch.'],
    [(S) => S.distro === 'ubuntu', () => 'Snap-Paket startet … startet … startet noch … gestartet! (47 s)'],
    [(S) => S.distro === 'fedora', () => 'Der Hut steht dir wirklich ausgezeichnet.'],
    [(S) => S.distro === 'kali', () => 'Du hast dich gerade versehentlich selbst gehackt. Gratuliere.'],
    [(S) => S.distro === 'nixos', () => 'Du verstehst jetzt 14 % der Nix-Syntax. Ein neuer Rekord.'],
    [(S) => S.distro === 'slackware', () => 'Slackware-Nutzer löst Abhängigkeiten von Hand. Wie früher. Wie echte Menschen.'],
    [(S) => S.distro === 'mint', () => 'Linux Mint: Es funktioniert einfach. Verdächtig.'],
    [(S) => S.distro === 'manjaro', () => 'Arch-Nutzer bezeichnen dich als „Arch-Tourist“. Du lächelst und hast Freizeit.'],
    [(S) => S.distro === 'opensuse', () => 'YaST hat soeben deine Kaffeemaschine konfiguriert. Sie ist jetzt grün.'],
    [(S) => S.distro === 'cachyos', () => 'CachyOS: Dein Kernel-Scheduler hat einen eigenen Fanclub.'],
    [(S) => S.distro === 'freebsd', () => 'Linux-Nutzer weisen darauf hin, dass FreeBSD kein Linux ist. Beastie zuckt mit den Schultern.'],
    [(S) => S.distro === 'lfs', () => 'Tag 3 von Linux From Scratch: Der Compiler kompiliert den Compiler. Kaffee geht zur Neige.'],
    [(S) => S.distro === 'windows', () => 'Ihr PC wird in 10 Minuten neu gestartet. Oder jetzt. Wir wissen es selbst nicht.'],
    [(S) => S.distro === 'hannah', () => 'Hannah Montana Linux: Du hast den Glanz gewählt. Und das ist gut so.'],
    [(S) => S.distro === 'rhel', () => 'Red Hat erinnert dich freundlich an die Verlängerung deines Abonnements.'],
    [(S) => S.distro === 'void', () => 'Void Linux: Du starrst ins Nichts. Das Nichts startet runit.'],
    [(S) => S.hops >= 5, (S) => 'Dein Ventoy-Stick hat ' + (S.hops * 2 + 3) + ' ISOs. Du hast keine Ahnung, welche davon noch bootet.'],
    [(S) => S.beard >= 100, () => 'Barbershop in deiner Nähe hat Angst vor dir.'],
    [(S) => S.beard >= 1000, () => 'In deinem Bart wurde ein funktionierender Raspberry Pi gefunden.'],
    [(S) => S.stats.ducks >= 10, () => 'Tierschützer fragen, woher all die goldenen Enten kommen.'],
    [(S) => S.stats.bugs >= 20, () => 'Insektenforscher entdecken neue Bug-Art in deinem Code. Sie wird nach dir benannt.'],
    [(S) => S.won, () => 'Rückblick: Das Jahr des Linux-Desktops war ein voller Erfolg. Nächstes Jahr: Das Jahr des Linux-Kühlschranks.'],
    // Datum & Uhrzeit
    [() => md() === '08-25', () => 'Happy Birthday, Linux! Vor ' + (new Date().getFullYear() - 1991) + ' Jahren kündigte ein finnischer Student ein „kleines Hobbyprojekt“ an.'],
    [() => md() === '09-17', () => 'Heute vor ' + (new Date().getFullYear() - 1991) + ' Jahren erschien Linux 0.01. Es hatte weniger Zeilen als dein node_modules-Ordner Dateien.'],
    [() => md() === '12-24' || md() === '12-25', () => 'Frohe Weihnachten! Der Weihnachtsmann nutzt Gentoo – er kompiliert die Geschenke selbst.'],
    [() => md() === '10-31', () => 'Halloween: Nichts ist gruseliger als ein rm -rf im falschen Verzeichnis.'],
    [() => md() === '04-01', () => 'EILMELDUNG: Das Jahr des Linux-Desktops ist da! (Datum prüfen.)'],
    [() => md() === '01-01', () => 'Frohes neues Jahr! Ist es diesmal das Jahr des Linux-Desktops? Die Experten sagen: nächstes.'],
    [() => new Date().getDay() === 5 && new Date().getDate() === 13, () => 'Freitag, der 13. – heute wird auf gar keinen Fall deployt.'],
    [() => new Date().getDay() === 5, () => 'Es ist Freitag. Wer jetzt noch deployt, verbringt das Wochenende mit den Logs.'],
    [() => new Date().getDay() === 1, () => 'Montag. Sogar die Cronjobs laufen heute etwas langsamer.'],
    [() => new Date().getDay() === 0 || new Date().getDay() === 6, () => 'Wochenende! Perfekte Zeit, um die Distro zu wechseln. Oder drei.'],
    [() => new Date().getHours() >= 23 || new Date().getHours() < 4, () => 'Es ist spät. Echte Hacker fangen jetzt erst richtig an. (Trink trotzdem Wasser.)'],
    [() => new Date().getHours() >= 5 && new Date().getHours() < 8, () => 'Früh wach – oder noch wach? Der Kaffee stellt keine Fragen.'],
  ];
  function md() { const d = new Date(); return String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

  /* ---------------------------------------------------------------- Tux-Sprüche */
  C.tuxIdle = [
    'Hallo? Tippst du noch?',
    'Ich glaube, die Tastatur ist eingeschlafen.',
    'Soll ich übernehmen? Ich hab aber nur Flossen.',
    'Die Bytes schreiben sich nicht von selbst. Na gut, teilweise schon.',
    'Ich zähle die Pixel auf deinem Bildschirm. Es sind viele.',
  ];
  C.tuxRandom = [
    'Wusstest du? Ich sehe aus, als trüge ich einen Smoking. Das ist aber meine Haut.',
    'Hast du heute schon deine Dotfiles committet?',
    'Ich bin ein Pinguin. Ich kann nicht fliegen, aber ich kann kompilieren.',
    'Psst. Klick oben auf „$_ Shell“ und tipp „help“.',
    'Manche Leute haben Vim nie verlassen. Sie leben jetzt dort.',
    'Mein Lieblingsessen? Fisch. Und Bugs. Nein, doch nur Fisch.',
    'Wenn du eine goldene Ente siehst: klicken! Nicht fragen, klicken.',
    'Das Jahr des Linux-Desktops? Kommt bestimmt. Nächstes Jahr.',
    'Ich wurde 1996 geboren. In Pinguinjahren bin ich also… immer noch süß.',
    'Wenn eine IRC-Nachricht kommt, antworte ruhig. Die Leute da sind nett. Meistens.',
    'Bugs krabbeln übers Terminal? Zerquetschen! Bringt Bytes.',
    'Wenn dir der Fortschritt zu langsam wird: Hop! Neue Distro, neues Glück.',
    'Tipp: Mit der Tastatur tippen zählt auch als Klick. Hackertyper-Style!',
    'Ich hätte gern einen Hut. Jede Distro hat einen anderen. Sammelst du sie für mich?',
    'Glaubenskriege sind ernst. Wähl deinen Editor mit Bedacht.',
  ];
  C.tuxAch = ['Oh, ein Erfolg! Ich hab’s gesehen!', 'Nicht schlecht! Das rahme ich ein.', 'Glückwunsch! Du wirst langsam gut darin.', 'Achievement unlocked! Ich bin stolz auf dich.'];
  C.tuxHop = {
    ubuntu: 'Zurück zu den Wurzeln! Ubuntu begrüßt dich mit einer Snap-Aktualisierung.',
    mint: 'Mint! Riecht hier nach Zahnpasta. Gefällt mir.',
    fedora: 'Fedora! Ich hab jetzt einen Hut. Ich sehe fantastisch aus.',
    debian: 'Debian. Hier ist alles stabil. Auch meine Laune.',
    arch: 'Arch! Hab ich schon erwähnt, dass wir jetzt Arch nutzen? Btw.',
    manjaro: 'Manjaro! Arch, aber mit Feierabend.',
    opensuse: 'openSUSE! Da sitzt ein Gecko auf meinem Kopf. Er heißt Geeko.',
    popos: 'Pop!_OS! Kopfhörer auf, Kacheln an!',
    kali: 'Kali. Ich trage jetzt eine Sonnenbrille. Ich bin ein Hacker.',
    gentoo: 'Gentoo! Ich kompiliere schon mal meinen Zauberhut. Dauert drei Tage.',
    alpine: 'Alpine! So klein, ich passe kaum hinein.',
    nixos: 'NixOS! Alles ist deklariert. Sogar ich.',
    slackware: 'Slackware. Ich rauche jetzt Pfeife. Das ist Tradition. (Nicht nachmachen.)',
    void: 'Void Linux. Ich hab ein Stirnband. Und keinen systemd.',
    cachyos: 'CachyOS! Ich fühl mich optimiert. Sogar meine Flossen haben AVX-512.',
    rhel: 'Red Hat Enterprise Linux. Ich hab einen Support-Vertrag. Und einen roten Hut.',
    freebsd: 'FreeBSD?! Ich… habe Hörner. Das ist neu.',
    lfs: 'Linux From Scratch. Ich baue mich gerade selbst. Bitte warten.',
    hannah: 'Hannah Montana Linux! Best of both worlds! Ich hab eine Schleife!',
    windows: 'Fenster 11? Wirklich? …Ich warte draußen.',
  };

  /* ---------------------------------------------------------------- Fortunes */
  C.fortunes = [
    'Es gibt 10 Arten von Menschen: die, die Binärcode verstehen, und die, die es nicht tun.',
    'Die zwei schwersten Probleme der Informatik: Cache-Invalidierung, Namensgebung und Off-by-one-Fehler.',
    'Warum verwechseln Programmierer Halloween und Weihnachten? Weil OCT 31 = DEC 25.',
    'There’s no place like 127.0.0.1',
    'Ein SQL-Statement geht in eine Bar, sieht zwei Tabellen und fragt: „Darf ich mich joinen?“',
    'Wie viele Programmierer braucht man, um eine Glühbirne zu wechseln? Keinen. Hardwareproblem.',
    'Debuggen ist, wie Detektiv in einem Krimi zu sein, in dem man selbst der Mörder ist.',
    'Ich würde dir einen UDP-Witz erzählen, aber vielleicht kommt er nicht an.',
    'Kennst du den TCP-Witz? – Ja, ich kenne den TCP-Witz. – Gut, dann erzähle ich dir den TCP-Witz.',
    'Das ist kein Bug. Das ist ein undokumentiertes Feature.',
    'In der Theorie gibt es keinen Unterschied zwischen Theorie und Praxis. In der Praxis schon.',
    'Optimist: Das Glas ist halb voll. Pessimist: halb leer. Programmierer: Das Glas ist doppelt so groß wie nötig.',
    'Code von Stack Overflow kopieren ist kein Programmieren. Es ist Archäologie.',
    'Mein Code funktioniert nicht, und ich weiß nicht warum. Mein Code funktioniert, und ich weiß nicht warum.',
    'Hardware: der Teil des Computers, den man treten kann.',
    'Die beste Performance-Optimierung ist der Übergang von „geht nicht“ zu „geht“.',
    'Keine Panik. rm -rf node_modules && npm install.',
    'Wer braucht eine GUI, wenn man grep hat?',
    '!false – lustig, weil es wahr ist.',
    'Echte Programmierer zählen ab 0.',
    'Ein guter Programmierer schaut in beide Richtungen, bevor er eine Einbahnstraße überquert.',
    'Es funktioniert? Nicht anfassen.',
    'Das Leben ist zu kurz, um Software zu benutzen, die man nicht selbst kompiliert hat. – ein Gentoo-Nutzer',
    'Wer Semikolons vergisst, bekommt Fehlermeldungen. Wer sie in Python setzt, bekommt Blicke.',
    'Zeit ist eine Illusion. Mittagspausen umso mehr. Deployments am Freitag erst recht.',
    'Du wirst heute einen Bug finden. Er wird dich morgen finden.',
    'Ein Byte kommt selten allein.',
    'Die Antwort ist 42. Die Frage wurde leider aus Kompatibilitätsgründen entfernt.',
  ];

  /* ---------------------------------------------------------------- Boot-Log */
  C.boot = [
    '[  OK  ] Started Bash-Skript-Dienst.',
    '[  OK  ] Mounted /home/{user}/.dotfiles.',
    '[  OK  ] Reached target Barthaar-Wachstum.',
    '[  OK  ] Started Cronjob-Verwaltung (sie laufen einfach).',
    '[  OK  ] Started Tux Mascot Daemon.',
    '[  OK  ] Listening on Gummienten-Socket.',
    '[  OK  ] Started Koffein-Versorgung.',
    '[  OK  ] Reached target Netzwerk (hoffentlich).',
    '[  OK  ] Started IRC-Client im Hintergrund.',
    '[  OK  ] Started Ungefragtes Erzählen der eigenen Distro.',
    '[  OK  ] Finished Laden der Wallpaper.',
    '[  OK  ] Reached target Grafische Oberfläche.',
    '[ WARN ] Druckertreiber nicht gefunden (wie immer).',
    '[  OK  ] Started Nerd-Modus.',
  ];

  /* ---------------------------------------------------------------- Quiz */
  // Erste Antwort ist richtig.
  C.quiz = [
    ['Welcher Befehl zeigt das aktuelle Arbeitsverzeichnis an?', ['pwd', 'cd', 'ls', 'whereami'], 'print working directory – „Wo bin ich?“ für Terminals.'],
    ['Wie beendet man Vim, ohne zu speichern?', [':q!', ':x', 'Strg+C', 'exit'], 'Das Ausrufezeichen heißt: „Ja, wirklich!“'],
    ['Wer hat den Linux-Kernel 1991 gestartet?', ['Linus Torvalds', 'Richard Stallman', 'Ken Thompson', 'Bill Gates'], 'Als Hobbyprojekt. „Nichts Großes und Professionelles wie GNU.“'],
    ['Wie heißt das Linux-Maskottchen?', ['Tux', 'Beastie', 'Larry', 'Wilber'], 'Das bin ich! Wilber ist übrigens das GIMP-Maskottchen.'],
    ['Wofür steht die Abkürzung „GNU“?', ['GNU’s Not Unix', 'General Network Utility', 'Great New Unix', 'Graphical Nerd Unit'], 'Eine rekursive Abkürzung. Nerds lieben das.'],
    ['Welcher Befehl ändert Dateirechte?', ['chmod', 'chown', 'chgrp', 'perm'], 'chown ändert den Besitzer, chmod die Rechte.'],
    ['Was bewirkt „chmod 777“?', ['Alle dürfen alles', 'Die Datei wird gelöscht', 'Nur root darf lesen', 'Die Datei wird versteckt'], 'Lesen, Schreiben, Ausführen – für jeden. Sicherheitsleute weinen leise.'],
    ['Welcher Port ist der Standard für SSH?', ['22', '21', '80', '443'], '21 ist FTP, 80 HTTP, 443 HTTPS.'],
    ['Welcher HTTP-Statuscode bedeutet „Nicht gefunden“?', ['404', '500', '403', '301'], 'Der berühmteste Fehler des Internets.'],
    ['Welcher HTTP-Statuscode bedeutet „Ich bin eine Teekanne“?', ['418', '420', '451', '404'], 'Aus einem Aprilscherz-RFC von 1998. Existiert trotzdem.'],
    ['Wie viele Bits hat ein Byte?', ['8', '4', '16', '10'], 'Ein halbes Byte (4 Bit) heißt übrigens Nibble.'],
    ['Was ist 0x1F in Dezimal?', ['31', '15', '32', '17'], '1×16 + 15 = 31.'],
    ['Welche Distro verwendet den Paketmanager „pacman“?', ['Arch Linux', 'Debian', 'Fedora', 'openSUSE'], 'Und nein, er frisst keine Geister.'],
    ['Welcher Paketmanager gehört zu Fedora?', ['dnf', 'apt', 'zypper', 'emerge'], 'dnf ist der Nachfolger von yum.'],
    ['Welche Datei enthält (unter anderem) die Benutzerkonten?', ['/etc/passwd', '/etc/users', '/home/users', '/var/accounts'], 'Die Passwörter selbst stehen heute in /etc/shadow.'],
    ['Was zeigt „uname -r“ an?', ['Die Kernel-Version', 'Den Benutzernamen', 'Die Uptime', 'Den freien RAM'], 'r wie release.'],
    ['Welches Signal sendet „kill -9“?', ['SIGKILL', 'SIGTERM', 'SIGHUP', 'SIGINT'], 'Das Signal, das sich nicht ignorieren lässt.'],
    ['Wofür steht „~“ in der Shell?', ['Das Home-Verzeichnis', 'Das Root-Verzeichnis', 'Den Papierkorb', 'Das vorherige Verzeichnis'], '~ ist dein Zuhause. Gemütlich.'],
    ['Welcher Befehl durchsucht Dateien nach Text?', ['grep', 'find', 'locate', 'seek'], 'global regular expression print.'],
    ['Was macht „cd -“?', ['Wechselt ins vorherige Verzeichnis', 'Wechselt ins Home-Verzeichnis', 'Geht eine Ebene hoch', 'Löscht das Verzeichnis'], 'Der Zurück-Knopf der Shell.'],
    ['Unter welcher Lizenz steht der Linux-Kernel?', ['GPLv2', 'MIT', 'BSD', 'Apache 2.0'], 'Nur Version 2. Linus mochte GPLv3 nicht.'],
    ['In welchem Jahr erschien Linux 1.0?', ['1994', '1991', '1998', '2001'], '1991 war die erste Version 0.01.'],
    ['Welches Maskottchen hat FreeBSD?', ['Einen kleinen Daemon', 'Einen Pinguin', 'Einen Kugelfisch', 'Ein Gnu'], 'Er heißt Beastie. Der Kugelfisch gehört zu OpenBSD.'],
    ['Wie viele Bytes hat ein KiB?', ['1024', '1000', '512', '1048'], 'KiB ist binär (2¹⁰), kB dezimal (1000). Streitthema seit Jahrzehnten.'],
    ['Wer hat den ersten Webbrowser geschrieben?', ['Tim Berners-Lee', 'Marc Andreessen', 'Linus Torvalds', 'Steve Jobs'], '1990 am CERN – auf einem NeXT-Rechner.'],
    ['Was ist /dev/null?', ['Ein Datengrab, das alles verschluckt', 'Eine Quelle unendlicher Nullen', 'Der Bootloader', 'Das Root-Verzeichnis'], 'Unendliche Nullen liefert /dev/zero.'],
    ['Welche Tastenkombination bricht im Terminal einen Prozess ab?', ['Strg+C', 'Strg+Z', 'Strg+D', 'Strg+X'], 'Strg+Z pausiert nur, Strg+D ist Dateiende.'],
    ['Was bewirkt Strg+D in einer leeren Shell?', ['Sie wird beendet (EOF)', 'Alles wird gelöscht', 'Die Zeile wird dupliziert', 'Es wird gespeichert'], 'End of File – die Shell verabschiedet sich.'],
    ['Welcher Befehl zeigt laufende Prozesse an?', ['ps', 'ls', 'lp', 'pl'], 'process status.'],
    ['Wofür steht „LTS“?', ['Long Term Support', 'Linux Terminal Server', 'Latest Test Snapshot', 'Low Tech Standard'], 'Versionen mit langer Unterstützung.'],
    ['Was ist ein „Segfault“?', ['Ein Zugriff auf verbotenen Speicher', 'Ein Festplattenfehler', 'Ein Netzwerkfehler', 'Ein Grafikfehler'], 'Segmentation fault (core dumped). Klassiker.'],
    ['In welcher Sprache ist der Linux-Kernel hauptsächlich geschrieben?', ['C', 'C++', 'Assembler', 'Rust'], 'Seit Kurzem ist auch etwas Rust dabei.'],
    ['Wie heißt der Bootloader, den die meisten Distros verwenden?', ['GRUB', 'LILO', 'NTLDR', 'BootMgr'], 'GRand Unified Bootloader. LILO war sein Vorgänger.'],
    ['Was bedeutet „PEBKAC“?', ['Problem Exists Between Keyboard And Chair', 'Power Error Before Kernel Auto Check', 'Please Enter Backup Key And Continue', 'Parallel Execution Buffer Kernel Access Control'], 'Das Problem sitzt vor dem Bildschirm.'],
    ['Welcher Befehl zeigt den freien Platz auf Dateisystemen?', ['df', 'du', 'free', 'top'], 'du zeigt die Größe von Verzeichnissen, free den RAM.'],
    ['Was zeigt „free -h“ an?', ['Den Arbeitsspeicher', 'Die Festplatten', 'Die CPU-Last', 'Das Netzwerk'], '-h für „human readable“.'],
    ['Welche Datei definiert, was beim Booten eingehängt wird?', ['/etc/fstab', '/etc/mtab', '/boot/mount', '/etc/disks'], 'file system table.'],
    ['Was ist systemd?', ['Init-System und Dienstverwaltung', 'Eine Desktop-Umgebung', 'Ein Texteditor', 'Ein Paketmanager'], 'Und Anlass für sehr, sehr viele Mailinglisten-Diskussionen.'],
    ['Welche Farbe hat das Ubuntu-Logo?', ['Orange', 'Blau', 'Grün', 'Rot'], 'Der „Circle of Friends“.'],
    ['Was ist die Antwort auf die Frage nach dem Leben, dem Universum und dem ganzen Rest?', ['42', '1337', '404', '7'], 'Laut Douglas Adams. Die Frage ist leider unbekannt.'],
    ['Was bedeutet „1337“ in Nerd-Sprache?', ['leet (elite)', 'Ein Fehlercode', 'Eine Portnummer', 'Ein Geburtsjahr'], 'H4X0R-Sprache aus den 80ern.'],
    ['Wer gründete das GNU-Projekt?', ['Richard Stallman', 'Linus Torvalds', 'Dennis Ritchie', 'Eric S. Raymond'], '1983 angekündigt.'],
    ['Welche Programmiersprache entwickelte Dennis Ritchie?', ['C', 'Java', 'Python', 'Pascal'], 'Zusammen mit Unix bei Bell Labs.'],
    ['Welcher Editor hat einen „Normal“- und einen „Insert“-Modus?', ['Vim', 'nano', 'Notepad', 'Gedit'], 'Deshalb tippt man manchmal „jjjjj“ in den Text.'],
    ['Was macht „git blame“?', ['Zeigt, wer welche Zeile geändert hat', 'Beschimpft Kollegen', 'Löscht Commits', 'Macht einen Rollback'], 'Spoiler: Es war Kevin.'],
    ['Was ist „Rubber Duck Debugging“?', ['Einer Gummiente den Code erklären', 'Enten in Code füttern', 'Ein Linter für Python', 'Ein Test für Badewannen'], 'Beim Erklären findet man den Fehler oft selbst.'],
    ['Welche Tastenkombination öffnet auf vielen Desktops ein Terminal?', ['Strg+Alt+T', 'Strg+Alt+Entf', 'Alt+F4', 'Strg+Shift+Esc'], 'Funktioniert übrigens auch hier!'],
    ['Wofür steht „RTFM“ (höflich übersetzt)?', ['Read The Fine Manual', 'Run The File Manager', 'Restart The Main Frame', 'Return To Main Menu'], 'Das „F“ bedeutet nicht immer „Fine“.'],
    ['Wofür steht „DNS“?', ['Domain Name System', 'Digital Network Service', 'Data Node Server', 'Direct Name Sync'], 'Und es ist immer DNS.'],
    ['Welche IP-Adresse ist „localhost“?', ['127.0.0.1', '192.168.0.1', '0.0.0.0', '8.8.8.8'], 'There’s no place like it.'],
    ['Welches Dateisystem ist bei vielen Distros Standard?', ['ext4', 'NTFS', 'FAT32', 'HFS+'], 'Wobei btrfs gerade aufholt.'],
    ['Was ist Wayland?', ['Ein Display-Server-Protokoll', 'Eine Distro', 'Ein Editor', 'Ein Dateisystem'], 'Der Nachfolger von X11.'],
    ['Welcher Befehl zeigt Handbuchseiten an?', ['man', 'help', 'wiki', 'rtfm'], 'man man zeigt das Handbuch zum Handbuch.'],
    ['Wie heißt die Kuh im Gentoo-Umfeld?', ['Larry', 'Berta', 'Muh', 'Gnu'], 'Larry the Cow, inoffizielles Maskottchen.'],
    ['Welcher Befehl zeigt, wie lange das System schon läuft?', ['uptime', 'runtime', 'time', 'since'], 'Server-Admins sind stolz auf ihre Uptime.'],
    ['Was macht „ls -la“?', ['Zeigt alle Dateien inkl. versteckter, ausführlich', 'Löscht alle Dateien', 'Sortiert nach Alter', 'Zeigt nur Ordner'], 'Versteckte Dateien beginnen mit einem Punkt – wie Dotfiles!'],
    ['Was ist eine „Dotfile“?', ['Eine versteckte Konfigurationsdatei', 'Eine Datei mit Punkten drin', 'Ein Grafikformat', 'Eine Sicherungsdatei'], 'Und das wichtigste Gut eines Distro-Hoppers.'],
    ['Welcher Befehl zeigt die letzten Zeilen einer Datei?', ['tail', 'head', 'end', 'last'], 'tail -f ist der Lieblingsbefehl aller Admins.'],
    ['Was macht „sudo !!“?', ['Wiederholt den letzten Befehl mit sudo', 'Löscht alles', 'Beendet sudo', 'Zeigt die Hilfe'], 'Für alle, die „Permission denied“ nicht einsehen.'],
    ['Wie viele Farben hatte der klassische VGA-Textmodus?', ['16', '8', '256', '2'], '16 Vordergrund-, 8 Hintergrundfarben.'],
    ['Welches Unternehmen steckt hinter Ubuntu?', ['Canonical', 'Red Hat', 'SUSE', 'Microsoft'], 'Gegründet von Mark Shuttleworth.'],
    ['Woher stammt openSUSE ursprünglich?', ['Aus Nürnberg', 'Aus Helsinki', 'Aus Kalifornien', 'Aus Tokio'], 'SUSE: „Software- und System-Entwicklung“.'],
    ['Aus welchem Land kommt Linus Torvalds?', ['Finnland', 'Schweden', 'Norwegen', 'Dänemark'], 'Er lebt heute in den USA.'],
    ['Was ist ein „Kernel Panic“?', ['Ein fataler Kernel-Fehler', 'Eine Panikattacke des Admins', 'Ein Update-Hinweis', 'Ein Bildschirmschoner'], 'Das Linux-Pendant zum Bluescreen.'],
  ];

  /* ---------------------------------------------------------------- IRC-Dilemmas */
  // eff: lump = Sekunden Produktion, buff = {mult, dur, kind, name}, none
  const B = (mult, dur, name, kind) => ({ buff: { mult, dur, name, kind: kind || 'prod' } });
  C.irc = [
    { from: 'n00b_1337', chan: '#linux-de', text: 'hilfe wie komme ich aus vim raus??? sitze seit 3 stunden fest', opts: [
      ['Geduldig erklären (:q!)', [[1, 'Er ist frei! Er schickt dir 14 Herz-Emojis. Gutes Karma breitet sich aus.', B(1.3, 180, 'Gutes Karma')]]],
      ['„Stecker ziehen.“', [[0.5, 'Hat funktioniert. Irgendwie.', { lump: 240 }], [0.5, 'Er hat den Stecker vom Kühlschrank gezogen. Egal, du hattest Spaß.', { lump: 60 }]]],
      ['„RTFM.“', [[1, 'Hart, aber gerecht. Du sparst Zeit für eigenen Code.', { lump: 420 }]]],
    ] },
    { from: 'chef', chan: 'Direktnachricht', text: 'Kannst du bis morgen noch schnell das neue Feature einbauen? Ist nur eine Kleinigkeit.', opts: [
      ['„Klar!“ (Nachtschicht)', [[1, 'Kaffee, Code, Morgengrauen. Du bist im Tunnel.', B(2, 90, 'Nachtschicht')]]],
      ['„Nein.“', [[1, 'Grenzen setzen ist gesund. Er respektiert das. Irgendwie.', { lump: 120 }]]],
      ['„Ist schon drin.“ (gelogen)', [[0.5, 'Er hat’s geglaubt. Du hast Zeit gewonnen.', { lump: 900 }], [0.5, 'Er hat nachgeschaut. Peinliches Meeting.', B(0.6, 40, 'Peinlich berührt')]]],
    ] },
    { from: 'ops-bot', chan: '#deploy', text: 'Freitag, 16:55 Uhr. Deploy auf Produktion bereit. Ausführen?', opts: [
      ['Deploy!', [[0.5, 'Alles grün! Du bist ein Held. Das Team spendiert Pizza.', { lump: 1200 }], [0.5, 'Prod brennt. Wochenende gestrichen.', B(0.5, 60, 'Prod brennt')]]],
      ['Montag.', [[1, 'Entspanntes Wochenende. Du kommst erholt zurück.', B(1.5, 150, 'Ausgeruht')]]],
    ] },
    { from: 'Oma', chan: 'Anruf', text: 'Hallo Schatz! Der Drucker druckt nicht. Kannst du mal gucken?', opts: [
      ['Hinfahren', [[1, 'Oma gibt dir 20 Euro und Kuchen. Der Drucker hatte kein Papier.', { lump: 400 }]]],
      ['Linux installieren', [[0.5, 'Oma ist begeistert! Sie nutzt jetzt Arch btw.', B(2, 120, 'Oma nutzt Arch')], [0.5, 'Oma vermisst ihr Solitär. Du installierst es ihr. In Wine.', { lump: 60 }]]],
      ['„Hast du ihn aus- und wieder eingeschaltet?“', [[1, 'Es hat funktioniert. Wie immer.', { lump: 200 }]]],
    ] },
    { from: 'xX_h4x0r_Xx', chan: '#linux-de', text: 'tipp: „sudo rm -rf / --no-preserve-root“ macht den PC viel schneller!!1', opts: [
      ['Melden und warnen', [[1, 'Die Moderatoren danken dir. Der Channel ist sicherer.', B(1.25, 240, 'Channel-Held')]]],
      ['„Stimmt, und mit Strg+Alt+Entf noch schneller!“', [[1, 'Chaos im Channel. Du lehnst dich zurück und genießt es.', { lump: 300 }]]],
    ] },
    { from: 'kollege_mike', chan: '#team', text: 'Ehrliche Frage: Tabs oder Spaces?', opts: [
      ['Tabs', [[1, 'Mike ist entsetzt. Du tippst trotzdem schneller.', B(1.5, 60, 'Tab-Stolz', 'click')]]],
      ['Spaces', [[1, 'Mike ist entsetzt. Laut Studie verdienst du jetzt mehr.', { lump: 300 }]]],
      ['„Hauptsache konsistent.“', [[1, 'Die weiseste Antwort. Niemand ist zufrieden, aber alle arbeiten weiter.', B(1.2, 180, 'Diplomat')]]],
    ] },
    { from: 'HN-Alarm', chan: '#news', text: 'Dein Projekt ist auf der Titelseite von Hacker News!', opts: [
      ['Server hochskalieren', [[1, 'Alles hält! 400 neue Sterne auf GitHub.', { lump: 1500 }]]],
      ['Hug of Death abwarten', [[0.5, 'Der Server überlebt wie durch ein Wunder. Legendär!', { lump: 3600 }], [0.5, 'Server tot. Aber berühmt.', { lump: 30 }]]],
    ] },
    { from: 'recruiter_jana', chan: 'Direktnachricht', text: 'Hi! Wir suchen einen Rockstar-Ninja-Guru mit 15 Jahren Kubernetes-Erfahrung. Interesse?', opts: [
      ['Antworten', [[1, 'Sie bietet dir Obstkorb und Tischkicker. Du lehnst höflich ab.', { lump: 90 }]]],
      ['Ignorieren', [[1, 'Du bleibst fokussiert.', B(1.2, 180, 'Fokus')]]],
      ['Screenshot posten', [[1, '12.000 Likes. Kubernetes gibt es seit 2014.', { lump: 500 }]]],
    ] },
    { from: 'hausmeister', chan: 'Zettel an der Tür', text: 'Im Keller steht ein alter Server. Uptime: 2.847 Tage. Weg damit?', opts: [
      ['Neustarten', [[0.3, 'Er startet! Er lebt! Und er ist erstaunlich schnell.', { lump: 2400 }], [0.7, 'Er startet nicht mehr. Niemand wusste, was er tat. Jetzt geht einiges kaputt.', B(0.7, 60, 'Mysteriöser Ausfall')]]],
      ['Niemals anfassen', [[1, 'Weise Entscheidung. Er brummt zufrieden weiter.', B(1.3, 300, 'Heiliger Server')]]],
    ] },
    { from: 'katze', chan: 'Schreibtisch', text: 'Miau. *setzt sich auf die Tastatur*', opts: [
      ['Streicheln', [[1, 'Schnurrrr. Du fühlst dich unglaublich motiviert.', B(3, 60, 'Katzen-Motivation', 'click')]]],
      ['Vorsichtig wegheben', [[1, 'Sie hat einen Commit gepusht. Er ist besser als deine.', { lump: 300 }]]],
    ] },
    { from: 'update-notifier', chan: 'System', text: 'Es sind 847 Aktualisierungen verfügbar. Jetzt installieren?', opts: [
      ['Sofort installieren', [[0.8, 'Alles frisch und schnell!', B(1.5, 180, 'Frisch aktualisiert')], [0.2, 'Grafiktreiber kaputt. TTY-Party!', B(0.5, 45, 'TTY-Party')]]],
      ['Später erinnern', [[1, 'Das sagst du seit Wochen.', { lump: 60 }]]],
    ] },
    { from: 'kollege_tim', chan: '#team', text: 'Kannst du mal eben auf meinen Windows-PC gucken? Der ist so langsam.', opts: [
      ['Ja, klar', [[1, 'Es waren 14 Browser-Toolbars. Tim ist dankbar.', { lump: 240 }]]],
      ['„Ich bin kein IT-Support!“', [[1, 'Grenzen setzen ist wichtig.', B(1.15, 300, 'Grenzen gesetzt')]]],
      ['Linux-USB-Stick zustecken', [[0.5, 'Tim ist bekehrt! Er hat heute schon dreimal erwähnt, dass er Linux nutzt.', { lump: 900 }], [0.5, 'Er benutzt ihn als Lesezeichen.', { lump: 30 }]]],
    ] },
    { from: 'stackoverflow', chan: 'Benachrichtigung', text: 'Deine Frage wurde als Duplikat geschlossen.', opts: [
      ['Beschweren', [[1, 'Du wirst auf −7 gedownvotet. Autsch.', B(0.85, 60, 'Downvotes')]]],
      ['Die verlinkte Antwort lesen', [[1, 'Sie war tatsächlich hilfreich. Verdammt.', { lump: 500 }]]],
    ] },
    { from: 'compiler', chan: 'Terminal', text: 'Dein Code ist beim ersten Versuch fehlerfrei durchgelaufen.', opts: [
      ['Misstrauisch nochmal testen', [[1, 'Ein versteckter Bug! Gut, dass du nachgeschaut hast.', { lump: 450 }]]],
      ['Sofort feiern', [[1, 'Euphorie! Du fliegst über die Tastatur.', B(2.5, 45, 'Euphorie')]]],
    ] },
    { from: 'innere_stimme', chan: 'Kopf', text: 'Es ist Mitternacht. Nur noch ein Feature?', opts: [
      ['Nur noch eins!', [[1, 'Drei Features und zwei Energy-Drinks später …', B(2, 90, 'Mitternachtsflow')]]],
      ['Schlafen gehen', [[1, 'Ausgeschlafen löst du das Problem in fünf Minuten.', { lump: 800 }]]],
    ] },
    { from: 'lkml', chan: 'Mailingliste', text: 'Ein bekannter Kernel-Maintainer hat auf deinen Patch geantwortet.', opts: [
      ['Mail öffnen', [[0.6, '„Looks good to me.“ Du rahmst sie ein.', { lump: 2000 }], [0.4, 'Sie war… sehr deutlich. Du brauchst eine Pause.', B(0.8, 60, 'Emotional verarbeiten')]]],
      ['Nicht öffnen', [[1, 'Schrödingers Mail. Sie ist gleichzeitig Lob und Verriss.', { none: true }]]],
    ] },
    { from: 'unbekannt', chan: 'Parkplatz', text: 'Ein Fremder bietet dir einen USB-Stick an. „Kostenlose Bytes!“', opts: [
      ['Einstecken', [[0.3, 'Es waren wirklich Bytes! Unglaublich.', { lump: 3000 }], [0.7, 'Es war Malware. Natürlich war es Malware.', B(0.6, 60, 'Malware')]]],
      ['Ablehnen', [[1, 'Sicherheitsbewusstsein +10.', B(1.2, 180, 'Security-Mindset')]]],
    ] },
    { from: 'mitbewohner', chan: 'Durch die Wand', text: 'KANNST DU BITTE LEISER TIPPEN?!', opts: [
      ['Leisere Switches bestellen', [[1, 'Rücksichtsvoll. Er backt dir Kekse.', { lump: 200 }]]],
      ['Noch lauter tippen', [[1, 'KLACK KLACK KLACK KLACK.', B(2.5, 60, 'KLACK', 'click')]]],
    ] },
    { from: 'forum_user', chan: 'Forum', text: 'Welche Distro ist die beste für Anfänger?', opts: [
      ['Ehrliche, differenzierte Antwort', [[1, 'Niemand liest sie. Aber du fühlst dich gut.', B(1.15, 240, 'Gutes Gewissen')]]],
      ['„Arch, btw.“', [[1, 'Du erntest Hass und Ruhm zugleich.', B(1.3, 120, 'btw-Ruhm')]]],
      ['Popcorn holen', [[1, 'Der Thread hat 900 Antworten. Beste Unterhaltung des Jahres.', { lump: 600 }]]],
    ] },
    { from: 'kaffeemaschine', chan: 'Küche', text: 'Wasser leer. Bohnen leer. Deadline morgen.', opts: [
      ['Club-Mate aus dem Keller', [[1, 'Der Geschmack von brennendem Tee. Und von Produktivität.', B(1.8, 120, 'Mate-Power')]]],
      ['Zum Späti rennen', [[1, 'Frische Luft! Und zwei Mate. Und Chips.', { lump: 450 }]]],
    ] },
    { from: 'kunde', chan: 'E-Mail', text: 'Können Sie das Logo größer machen? Und gleichzeitig kleiner?', opts: [
      ['Größer UND kleiner machen', [[1, 'Du hast ein responsives SVG gebaut. Der Kunde weint vor Glück.', { lump: 700 }]]],
      ['„Das ist physikalisch unmöglich.“', [[0.5, 'Er akzeptiert. Ein Wunder!', { lump: 300 }], [0.5, 'Er will jetzt einen Termin mit „Physik“.', { lump: 40 }]]],
    ] },
    { from: 'festplatte', chan: 'Gehäuse', text: '*klick* … *klick* … *klick-klack*', opts: [
      ['Sofort Backup machen', [[1, 'Backup fertig. Zehn Minuten später stirbt die Platte. Glück gehabt!', B(1.3, 180, 'Backup-Held')]]],
      ['Ignorieren', [[0.5, 'Es war nur die Tastatur.', { lump: 150 }], [0.5, 'Klick … klick … Stille. Du trauerst kurz.', B(0.75, 45, 'Datenverlust')]]],
    ] },
    { from: 'büro_kühlschrank', chan: 'Küche', text: 'Jemand hat deine Club-Mate getrunken!', opts: [
      ['git blame', [[1, 'Es war Kevin. Es ist immer Kevin.', { lump: 200 }]]],
      ['Zettel schreiben', [[1, 'Passiv-aggressive Zettelkunst. Die Mate ist am nächsten Tag zurück.', B(1.2, 120, 'Gerechtigkeit')]]],
    ] },
    { from: 'paketbote', chan: 'Klingel', text: 'Deine neue mechanische Tastatur ist da!', opts: [
      ['Sofort auspacken', [[1, 'Neue Switches, neues Glück. Du tippst wie ein Gott.', B(4, 60, 'Neue Tastatur', 'click')]]],
      ['Erst die Arbeit fertig machen', [[1, 'Vorfreude ist die schönste Freude.', { lump: 500 }]]],
    ] },
    { from: 'ki_assistent', chan: 'IDE', text: 'Ich schlage vor, das gesamte Projekt in JavaScript neu zu schreiben.', opts: [
      ['Stecker ziehen', [[1, 'Ruhe. Herrliche Ruhe.', { lump: 250 }]]],
      ['Machen lassen', [[0.5, 'Es ist… schneller?! Niemand versteht, warum.', B(2.5, 60, 'JS-Wunder')], [0.5, 'node_modules hat die Festplatte gefressen.', B(0.6, 60, 'node_modules')]]],
    ] },
    { from: '+49 1234 „Microsoft“', chan: 'Anruf', text: 'Guten Tag, Ihr Computer hat einen Virus. Bitte installieren Sie TeamViewer.', opts: [
      ['Mitspielen und Zeit verschwenden', [[1, '45 Minuten Hotline-Spaß. Du hast ihnen /dev/random vorgelesen.', { lump: 400 }]]],
      ['„Ich benutze Linux.“', [[1, 'Aufgelegt. Nach drei Sekunden. Rekord!', B(1.25, 120, 'Unhackbar')]]],
    ] },
    { from: 'pager', chan: 'Nachttisch', text: 'BIEP BIEP. 03:14 Uhr. Produktion ist down.', opts: [
      ['Aufstehen und retten', [[1, 'Du rettest Prod im Schlafanzug. Das Team verehrt dich.', { lump: 1400 }]]],
      ['Umdrehen und weiterschlafen', [[1, 'Am Morgen warten 200 E-Mails.', B(0.8, 60, 'E-Mail-Flut')]]],
    ] },
    { from: 'nachbar', chan: 'Gartenzaun', text: 'Warum leuchtet dein Keller nachts eigentlich so blau?', opts: [
      ['„Server.“', [[1, 'Er nickt verständnisvoll. Er versteht es nicht.', { lump: 100 }]]],
      ['„Glühwürmchen.“', [[1, 'Er glaubt dir. Das ist fast schon traurig.', { lump: 150 }]]],
      ['Ihn einladen', [[1, 'Er ist begeistert und baut jetzt sein eigenes Homelab.', B(1.4, 180, 'Neuer Nerd')]]],
    ] },
    { from: 'distrowatch', chan: 'Newsfeed', text: 'Neue Distro erschienen: „UbuntuMintArchGentoo Linux“. Ausprobieren?', opts: [
      ['Sofort in einer VM testen', [[1, 'Sie ist… exakt wie Ubuntu. Mit anderem Hintergrundbild.', { lump: 350 }]]],
      ['Ignorieren', [[1, 'Du bleibst stark. Diesmal.', B(1.2, 180, 'Standhaft')]]],
    ] },
  ];

  /* ---------------------------------------------------------------- Enten-Effekte */
  C.duckFx = [
    { id: 'lucky', w: 45, name: 'Stack-Overflow-Treffer', text: 'Die perfekte Antwort, 2011 von einem Fremden geschrieben.' },
    { id: 'frenzy', w: 40, name: 'Koffein-Rausch', text: 'Produktion ×7!' },
    { id: 'clickfrenzy', w: 9, name: 'Flow-Zustand', text: 'Klickkraft ×77!' },
    { id: 'special', w: 6, name: 'Hacker-News-Frontpage', text: 'Ein Gebäude geht viral!' },
  ];
})();
