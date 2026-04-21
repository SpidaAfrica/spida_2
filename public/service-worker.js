/* ==============================================
   SPIDA TRACTORS — SERVICE WORKER
   Handles offline caching and background sync.
============================================== */

const CACHE_NAME    = "spida-tractors-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/static/js/main.chunk.js",
  "/static/js/bundle.js",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

/* ---- Install: cache static shell ---- */
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail on individual asset errors
      });
    })
  );
});

/* ---- Activate: clear old caches ---- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ---- Fetch: network-first for API, cache-first for assets ---- */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never cache API calls
  if (url.hostname.includes("api.spida") || url.pathname.includes("/api/")) {
    event.respondWith(fetch(request).catch(() => new Response(
      JSON.stringify({ success: false, message: "Offline — please check your connection" }),
      { headers: { "Content-Type": "application/json" } }
    )));
    return;
  }

  // Never cache Paystack or Twilio
  if (url.hostname.includes("paystack") || url.hostname.includes("twilio")) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, toCache));
        return response;
      }).catch(() => caches.match("/index.html")); // fallback to app shell
    })
  );
});

/* ---- Background sync for offline actions (future use) ---- */
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-requests") {
    // Placeholder for future offline request queuing
    console.log("Background sync triggered");
  }
});

/* ---- Push notifications (future use) ---- */
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title   = data.title   || "Spida Tractors";
  const options = {
    body:    data.body    || "You have a new notification",
    icon:    "/icons/icon-192x192.png",
    badge:   "/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    data:    { url: data.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || "/")
  );
});
