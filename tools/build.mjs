// Baut DistroHopper zu Einzeldateien:
//   dist/distrohopper.html  – eigenständig, per Doppelklick spielbar
//   dist/artifact.html      – Variante ohne <html>/<head>/<body> (für die Artifact-Veröffentlichung)
// Aufruf: node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const html = read('index.html');
const css = read('css/style.css');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
const js = scripts.map((s) => `/* ---- ${s} ---- */\n` + read(s)).join('\n');
const icon = 'data:image/svg+xml;base64,' + Buffer.from(read('icon.svg')).toString('base64');
const safeJs = js.replace(/<\/script/gi, '<\\/script');

const app = html.slice(html.indexOf('<!--APP-->') + '<!--APP-->'.length, html.indexOf('<!--/APP-->')).trim();
const fonts = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Pixelify+Sans:wght@400;500;600;700&family=VT323&display=swap">';

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });

// 1) Eigenständige Datei
let standalone = html
  .replace('<link rel="stylesheet" href="css/style.css">', `<style>\n${css}\n</style>`)
  .replace(/<link rel="manifest"[^>]*>\n?/, '')
  .replace(/<link rel="icon"[^>]*>/, `<link rel="icon" href="${icon}">`)
  .replace(/<link rel="apple-touch-icon"[^>]*>/, `<link rel="apple-touch-icon" href="${icon}">`);
standalone = standalone.slice(0, standalone.indexOf('<!--SCRIPTS-->')) + `<script>\n${safeJs}\n</script>\n` + standalone.slice(standalone.indexOf('<!--/SCRIPTS-->') + '<!--/SCRIPTS-->'.length);
fs.writeFileSync(path.join(root, 'dist/distrohopper.html'), standalone);

// 2) Artifact-Variante (das Gerüst mit doctype/head/body kommt von der Plattform)
const artifact = `<title>DistroHopper</title>
<meta name="description" content="DistroHopper – das Idle-Game für Leute, die ihr Betriebssystem öfter wechseln als ihre Socken.">
<meta name="theme-color" content="#07090d">
${fonts}
<style>
${css}
</style>
${app}
<script>
${safeJs}
</script>
`;
fs.writeFileSync(path.join(root, 'dist/artifact.html'), artifact);

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(0) + ' KB';
console.log('dist/distrohopper.html', kb(standalone));
console.log('dist/artifact.html    ', kb(artifact));
