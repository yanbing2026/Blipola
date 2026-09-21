const CACHE = "blipola-v1";
const ASSETS = ["./","./index.html","./manifest.json","./js/app.js","./js/blipola.js","./js/learning-engine.js","./js/dialogue.js","./js/hints.js","./js/missions.js","./js/progress.js","./js/parent.js"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", event => event.respondWith(caches.match(event.request).then(r => r || fetch(event.request))));
