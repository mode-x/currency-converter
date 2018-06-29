const CACHE_NAME = 'app-cache-v1'
const urlsToCache = [
  './index.html',
  './app_shell.html',
  'assets/css/w3.css',
  'assets/css/app.css',
  'assets/js/initializer.js',
  'assets/js/idb.js',
  'assets/js/db.js',
  'assets/js/converter.js',
  'https://fonts.googleapis.com/css?family=Gothic+A1',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://free.currencyconverterapi.com/api/v5/currencies'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache).catch(err => console.log(err))
      })
  )
})

self.addEventListener('fetch', (event) => {
  let requestUrl = new URL(event.request.url)
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/currency-converter/') {
      event.respondWith(caches.match('./index.html'))
      return
    }
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
