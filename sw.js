const CACHE_NAME = 'dj-booth-cache-v2';
const ASSETS = [
  'index.html',
  'manifest.json',
  'config.json', // <-- Cacheamos el JSON de configuración para soporte offline completo
  'sw.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});