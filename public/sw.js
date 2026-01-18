// public/sw.js - Minimal service worker to make PWA installable
self.addEventListener('install', event => {
  self.skipWaiting();  // Take control immediately
});

self.addEventListener('activate', event => {
  self.clients.claim();  // Claim clients right away
});

self.addEventListener('fetch', event => {
  // Basic pass-through: fetch from network, fallback if offline (optional upgrade later)
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Offline mode - refresh when back online', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    })
  );
});