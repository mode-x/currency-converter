const CACHE_NAME = 'app-cache-v1'
const urlsToCache = [
  '/',
  '/assets/css/app.css'
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(function (response) {
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
