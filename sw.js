const CACHE_NAME = 'app-cache-v1'
const urlsToCache = [
  '/currency-converter/'
  // '../assets/css/w3.css',
  // '../assets/css/app.css',
  // '../assets/js/initializer.js',
  // '../assets/js/idb.js',
  // '../assets/js/db.js',
  // '../assets/js/converter.js',
  // 'https://fonts.googleapis.com/css?family=Gothic+A1',
  // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
  // 'https://free.currencyconverterapi.com/api/v5/currencies'
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
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
        .then((response) => {
          // if (response === undefined) {
          // } else if (response.status === 403) {
          //   return fetch('/static/nkatar_logo.png')
          // } else if (response.status === 404) {
          //   return fetch('/static/nkatar_logo.png')
          // }
          return response
        })
        .catch((error) => {
          console.log(error)
        })
    })
  )
})
