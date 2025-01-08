const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
    '/',
    '/404.html', // Your 404 page
    '/index.html', // Your homepage
    '/styles.css', // Add your CSS files here
    '/script.js',  // Add your JavaScript files here
];

// Install the Service Worker and cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Intercept fetch requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Serve from cache, or fetch from network if not in cache
            return response || fetch(event.request);
        }).catch(() => {
            // Fallback to 404 page if offline
            return caches.match('/404.html');
        })
    );
});

// Activate the Service Worker and clean old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
