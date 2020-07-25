var cacheName = 'randomBeep-v0.0.11';

var filesToCache = [
  './',
  './index.html',
  './js/main.js',
  './css/framework.min.css',  
  './img/icon.png',
  './img/icon-48x48.png',
  './img/icon-96x96.png',
  './img/icon-128x128.png',
  './img/icon-144x144.png',
  './img/icon-192x192.png',
  './img/icon-512x512.png',
  './sound/alert.ogg',
  './sound/gong.ogg',
  './sound/1.mp3',
  './sound/2.mp3',
  './sound/3.mp3'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install_');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate_');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key.startsWith('randomBeep-')){
          if (key !== cacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
