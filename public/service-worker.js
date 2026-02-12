'use strict';

const CACHE_NAME = 'v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cached response is available
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background Sync
self.addEventListener('sync', (event) => {
    if (event.tag == 'sync-updates') {
        event.waitUntil(
            // Perform action to sync here, e.g. sending data to the server
            fetch('/update-data').then(
                (response) => response.json()
            ).then(
                (data) => console.log('Data synced:', data)
            )
        );
    }
});
