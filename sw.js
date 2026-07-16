const CACHE_NAME = 'v1_caracas_club_booth';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './config.json',
  './manifest.json'
];

// Instalar el Service Worker y almacenar archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activar y eliminar cachés antiguas si las hay
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia: Intentar Red, si falla o tarda, usar Caché
self.addEventListener('fetch', (event) => {
  // Ignoramos peticiones externas como las de Firebase para que no interfiera con el tiempo real
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, clonamos y actualizamos la caché
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request)) // Si no hay internet, sirve lo guardado
  );
});
