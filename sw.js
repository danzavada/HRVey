/* HRVey service worker — offline app shell (cache-first) */
const CACHE = "hrvey-v11";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./vendor/pdf.min.js",
  "./vendor/pdf.worker.min.js",
  "./vendor/xlsx.full.min.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/favicon-16.png",
  "./icons/favicon-32.png",
  "./icons/favicon-180.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function cachePut(req, resp){ const c = resp.clone(); caches.open(CACHE).then(x => x.put(req, c)).catch(() => {}); return resp; }

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const req = e.request;
  const isHTML = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
  if (isHTML) {
    // network-first so the app updates as soon as it's online; fall back to cache offline
    e.respondWith(
      fetch(req).then(r => cachePut(req, r))
        .catch(() => caches.match(req).then(m => m || caches.match("./index.html")))
    );
  } else {
    // assets: cache-first, fill cache on miss
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(r => cachePut(req, r)))
    );
  }
});
