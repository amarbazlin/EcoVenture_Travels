const CACHE_NAME = "ecoventure-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
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
self.addEventListener("fetch", event => {
  if (event.request.url.includes(".json")) {
    // Network first (for dynamic tour data)
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    // Cache first (for static assets)
    event.respondWith(
      caches.match(event.request).then(response =>
        response || fetch(event.request)
      )
    );
  }
});
