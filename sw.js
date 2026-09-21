const CACHE = "blipola-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./js/app.js",
  "./js/blipola.js",
  "./js/learning-engine.js",
  "./js/learning-context.js",
  "./js/skills.js",
  "./js/events.js",
  "./js/adapters.js",
  "./js/kindergarten-adapter.js",
  "./js/dialogue.js",
  "./js/hints.js",
  "./js/missions.js",
  "./js/progress.js",
  "./js/parent.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
