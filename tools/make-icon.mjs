// Erzeugt icon.svg aus dem Pixel-Tux (sprites.js)
import fs from 'node:fs'; import vm from 'node:vm';
globalThis.window = undefined;
vm.runInThisContext(fs.readFileSync('js/util.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/sprites.js', 'utf8'));
const { P, S } = DH.sprites;
const rows = S.tuxBig; const hat = S.hat_beanie;
const W = 26, top = 9;
let rects = '';
// Gleichfarbige Pixel einer Zeile zu einem Rechteck zusammenfassen
const put = (r, dy) => r.forEach((row, y) => {
  let x = 0;
  while (x < row.length) {
    const ch = row[x];
    if (ch === '.' || !P[ch]) { x++; continue; }
    let w = 1;
    while (row[x + w] === ch) w++;
    rects += `<rect x="${x + 11}" y="${y + dy}" width="${w}" height="1.02" fill="${P[ch]}"/>`;
    x += w;
  }
});
put(rows, top + 3);
put(hat, top + 3 + 2 - (hat.length - 1));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" shape-rendering="crispEdges"><rect width="48" height="48" rx="10" fill="#1a0f14"/><rect x="2" y="2" width="44" height="44" rx="8" fill="#E95420" opacity=".22"/>${rects}</svg>`;
fs.writeFileSync('icon.svg', svg);
console.log('icon.svg', svg.length);

// ---- PNG-Icons (192/512) für Homescreen/PWA, ohne Zusatzpakete ----
import zlib from 'node:zlib';
const crcTable = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size) {
  const px = Buffer.alloc(size * size * 4);
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  // Hintergrund: dunkel mit Ubuntu-Orange-Schimmer, abgerundete Ecken
  const R = size * 0.2;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = Math.max(0, R - x, x - (size - 1 - R)), dy = Math.max(0, R - y, y - (size - 1 - R));
    const inside = dx * dx + dy * dy <= R * R;
    const i = (y * size + x) * 4;
    if (!inside) continue;
    const t = y / size;
    px[i] = 26 + 60 * (1 - t); px[i + 1] = 15 + 18 * (1 - t); px[i + 2] = 20 + 10 * (1 - t); px[i + 3] = 255;
  }
  // Tux + Mütze (26×40 Raster) mittig, pixelgenau skaliert
  const grid = Array.from({ length: 40 }, () => Array(26).fill(null));
  const stamp = (rows, dy) => rows.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.' && P[ch] && grid[y + dy]) grid[y + dy][x] = P[ch]; }));
  stamp(S.tuxBig, 12); stamp(S.hat_beanie, 12 + 2 - (S.hat_beanie.length - 1));
  const scale = Math.floor(size * 0.8 / 40);
  const ox = Math.floor((size - 26 * scale) / 2), oy = Math.floor((size - 40 * scale) / 2);
  for (let gy = 0; gy < 40; gy++) for (let gx = 0; gx < 26; gx++) {
    const c = grid[gy][gx]; if (!c) continue;
    const [r, g, b] = hex(c);
    for (let yy = 0; yy < scale; yy++) for (let xx = 0; xx < scale; xx++) {
      const i = ((oy + gy * scale + yy) * size + ox + gx * scale + xx) * 4;
      px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 255;
    }
  }
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) { raw[y * (size * 4 + 1)] = 0; px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
for (const s of [192, 512, 180]) { const f = s === 180 ? 'apple-touch-icon.png' : `icon-${s}.png`; fs.writeFileSync(f, png(s)); console.log(f); }
