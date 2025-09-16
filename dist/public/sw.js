const CACHE_NAME = 'kabab-house-v1';
const urlsToCache = [
  '/',
  '/menu',
  '/online-order',
  '/about-us',
  '/contact',
  '/src/index.css',
  '/src/main.tsx'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});