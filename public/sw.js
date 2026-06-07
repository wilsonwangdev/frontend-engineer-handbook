// Simple service worker for offline caching of static assets.
// Non-intrusive — only caches requests that succeed, never blocks.

const CACHE_NAME = "fe-handbook-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Stale-while-revalidate: return cached version, update cache in background
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const fetched = fetch(event.request).then((response) => {
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        });
        return cached || fetched;
      }),
    ),
  );
});
