const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/assets/css/app.css'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});