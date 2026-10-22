// Lingua service worker: always tries the network first (so new lessons show up right away)
// and falls back to the last saved copy when there is no internet.
const CACHE = "lingua-v2";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(
    // "no-cache" asks the server every time, so a new version shows up right away instead of after the 10-minute browser cache
    fetch(r.mode === "navigate" ? new Request(r.url, { cache: "no-cache", credentials: "same-origin" }) : new Request(r, { cache: "no-cache" })).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
      return res;
    }).catch(() => caches.match(r, { ignoreSearch: r.mode === "navigate" }).then(hit => hit || (r.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});
