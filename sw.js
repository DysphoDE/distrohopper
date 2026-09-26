/* DistroHopper – Service-Worker: offline spielbar */
const CACHE = 'distrohopper-v3';
const FILES = ['./', 'index.html', 'css/style.css', 'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'manifest.webmanifest',
  'js/util.js', 'js/sprites.js', 'js/data.js', 'js/content.js', 'js/game.js', 'js/audio.js', 'js/fx.js',
  'js/terminal.js', 'js/shell.js', 'js/events.js', 'js/ui.js', 'js/overlays.js', 'js/main.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((r) => {
    if (r.ok && new URL(e.request.url).origin === location.origin) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); }
    return r;
  }).catch(() => caches.match(e.request).then((m) => m || caches.match('index.html'))));
});
