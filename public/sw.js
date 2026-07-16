self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // A minimal fetch handler is strictly required for Chromium PWA installability.
  // We leave it empty to allow the browser to handle network requests natively.
});
