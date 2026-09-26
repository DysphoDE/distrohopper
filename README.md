# DistroHopper

Das Idle-/Clicker-Game für Leute, die ihr Betriebssystem öfter wechseln als ihre Socken.

Tippe Code ins Terminal, kauf Hardware und Helfer (vom Bash-Skript bis zum Kernel des Universums),
wechsle die Distro, lass dir einen Bart wachsen – bis zum **Jahr des Linux-Desktops**.

## Spielen

**Direkt im Browser:** https://dysphode.github.io/distrohopper/ (funktioniert auf PC und Handy, lässt sich als App installieren)

- **Einfach so:** `dist/distrohopper.html` doppelklicken. Eine Datei, keine Installation.
- **Aus dem Quellcode:** einen statischen Server im Projektordner starten und `index.html` öffnen:

  ```bash
  python3 tools/devserver.py 8765
  ```

  Dann http://localhost:8765 aufrufen. (Über `file://` geht `index.html` auch, nur Service-Worker/PWA nicht.)
- **Handy:** Die Seite über einen Webserver ausliefern und im Browser „Zum Startbildschirm hinzufügen“ – das Spiel ist eine PWA und läuft dann im Vollbild, auch offline.

Der Spielstand liegt im `localStorage` des Browsers. Unter *System → Spielstand* lässt er sich exportieren
und auf einem anderen Gerät wieder einfügen.

## Was drinsteckt

| Bereich | Inhalt |
|---|---|
| Hardware & Helfer | 19 Gebäude, jeweils mit 11 Upgrade-Stufen |
| Upgrades | ~290 – Tastatur, Koffein, Setup, Katzen, Enten, Debugging, Synergien, Glaubenskriege |
| Distros | 18 reguläre + 2 geheime, jede mit eigenen Boni/Mali, Farben, Tux-Hut und Musik |
| Dotfiles | dauerhafter Fortschritt als Verzeichnisbaum (`~/.bashrc`, `~/.config/…`), bezahlt mit Karma |
| Ereignisse | goldene Gummienten, krabbelnde Bugs, IRC-Dilemmas, Nerd-Quiz, Arch-„btw“, Zwangsupdates |
| Shell | echte Mini-Shell (`Strg+Alt+T`) mit Easter Eggs – `help` ist ein guter Anfang |
| Erfolge | ~230, davon einige geheim; jeder gibt +1 % Produktion |
| Kosmetik | Terminal-Farbschemata, Tastatur-Sounds, Hüte für Tux |

Alle Grafiken sind Pixel-Art aus Zeichenrastern (`js/sprites.js`), alle Sounds und die Chiptune-Musik
werden live per WebAudio synthetisiert – es gibt keine Asset-Dateien.

## Projektstruktur

```
index.html          Grundgerüst
css/style.css       Aussehen (Tiling-WM-Look, drei Layouts: Desktop, Tablet, Handy)
js/util.js          Zahlenformat (KB/MB/…, KiB, Kurz, wissenschaftlich), DOM, Event-Bus
js/sprites.js       Pixel-Art + Renderer
js/data.js          Gebäude, Upgrades, Distros, Dotfiles, Erfolge, Kosmetik
js/content.js       Texte: Terminal-Stream, News, Quiz, IRC, Tux-Sprüche, Fortunes
js/game.js          Spiellogik ohne DOM (auch in Node lauffähig)
js/audio.js         Soundeffekte und Musik (WebAudio)
js/fx.js            Partikel, schwebende Zahlen, Konfetti, Matrix-Regen
js/terminal.js      Das CRT-Terminal
js/shell.js         Mini-Shell mit Easter Eggs
js/events.js        Enten, Bugs, IRC, btw, Zwangsupdates
js/ui.js            Oberfläche: HUD, Shop, Panels, Tooltips, Tux
js/overlays.js      Dialoge, GRUB, Boot-Animation, Finale
js/main.js          Start, Spielschleife, Speichern, Offline-Fortschritt
sw.js, manifest.webmanifest, icon.svg   PWA
```

## Werkzeuge

```bash
node tools/build.mjs      # baut dist/distrohopper.html (eigenständig) und dist/artifact.html
node tools/sim.mjs 5 40 90   # Balance-Simulation: Klicks/s, Stunden, aktive Minuten pro Run
node tools/make-icon.mjs  # erzeugt icon.svg aus dem Pixel-Tux
```

`tools/sprites.html` zeigt alle Sprites vergrößert (über den Dev-Server öffnen).

## Balance in Kürze

- Barthaare werden aus den insgesamt erzeugten Bytes berechnet – im Log-Raum konkav, damit frühe Hops
  sich lohnen und das Spätspiel nicht explodiert. Bart-Bonus: `1 + 0,25 · Haare^0,6`.
- Distros schalten sich über Barthaare frei (der anstehende Hop zählt mit).
- Finale: 10 RB in einem Run, 3.000 Barthaare, 10 besuchte Distros. Laut Simulation für aktive
  Spieler nach etwa 6–10 Stunden erreichbar, gemütlich mit Offline-Fortschritt in ein bis zwei Wochen.
