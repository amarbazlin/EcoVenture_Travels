const CACHE_NAME = "ecoventure-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/categories.json", // Add this to pre-cache the data file
  "/Cycling_Vietnam.avif",
  "/coasta_rica.webp",
  "/baltics.avif",
  "/italy.avif",
  "/croatia.avif",
  "/sl_cycling.avif",
  "/nepal_hiking.webp",
  "/peru_hiking.webp",
  "/italy_hiking.webp",
  "/morocco_hiking.webp",
  "/slovakia_hiking.webp",
  "/albania_hiking.webp",
  "/nepal_climbing.webp",
  "/morocco_climbing.webp",
  "/protugal_climbing.webp",
  "/albania_climbing.webp",
  "/spain_climbing.webp",
  "/ecuador_climbing.webp",
  "/montenegro_rafting.webp",
  "/france_rafting.webp",
  "/croatia_rafting.webp",
  "/greece_swim.webp",
  "/uk_swim.webp",
  "/finland_swim.webp",
  "/italy_wild.webp",
  "/ecuador_wild.webp",
  "/romania_wild.webp",
  "/malaysia_wild.webp"
];

// Install event → cache essential assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});
self.addEventListener("push", event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "EcoVenture Update!";
  const options = {
    body: data.body || "A new tour is now available.",
    icon: "/icons/tour-icon.png",
    badge: "/icons/tour-badge.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});


// Activate event → clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});

// Fetch event → network first for JSON, cache first for static
// Fetch event → network first for JSON, cache first for static
self.addEventListener("fetch", event => {
  if (event.request.url.includes(".json")) {
    // Network first (for dynamic tour data)
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    // Cache first, then network, and cache the new response
    event.respondWith(
      caches.match(event.request).then(response => {
        // If the resource is in the cache, return it
        if (response) {
          return response;
        }

        // If not, fetch it from the network
        return fetch(event.request).then(networkResponse => {
          // Check if we received a valid response
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          // Important: Clone the response because it's a stream
          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return networkResponse;
        });
      })
    );
  }
});
