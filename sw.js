const CACHE_NAME = 'mstraders-cache-v3'; // Bumped to v3 to trigger a fresh update
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png' 
];

// Install Event - Cache files & Force Update
self.addEventListener('install', event => {
  self.skipWaiting(); // <--- Forces the phone to install the new version immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(err => console.error('Cache installation failed. Is a file missing?', err))
  );
});

// Activate Event - Clean up old caches & Take Control
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // <--- Forces the new version to take over the screen immediately
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event - Serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
