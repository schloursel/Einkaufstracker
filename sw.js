// Service Worker: App-Dateien aus dem Cache (im Hintergrund aktualisiert), Daten-Dateien zuerst vom Netz.
const VERSION = 'et-v3';
const APP = ['./', 'index.html', 'data.js', 'data-more.js', 'data-recipes.js', 'app/core.js', 'app/ui.js', 'app/home.js', 'app/plan.js', 'app/shop.js', 'app/more.js', 'app/boot.js',
  'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
const DATA = ['offers.js', 'products.js', 'nutrition.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP.concat(DATA)).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  const isData = DATA.some(d => url.pathname.endsWith('/' + d));
  if (isData) {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; }).catch(() => caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
