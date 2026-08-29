/* Angler's Arrows — service worker (network-first for HTML so updates reach players) */
const CACHE = "anglers-arrows-1.26.0";
const ASSETS = [
  ".","index.html","manifest.webmanifest",
  "icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png",
  "icons/apple-touch-icon.png","icons/favicon.png","icons/mark-96.png"
];
self.addEventListener("install",(e)=>{
  e.waitUntil(caches.open(CACHE).then((c)=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",(e)=>{
  e.waitUntil(
    caches.keys().then((keys)=>Promise.all(keys.filter((k)=>k!==CACHE).map((k)=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener("fetch",(e)=>{
  const req=e.request;
  if(req.method!=="GET"||new URL(req.url).origin!==location.origin) return;
  const url=new URL(req.url);
  const isDoc = req.mode==="navigate" || req.destination==="document" ||
                url.pathname.endsWith("/") || url.pathname.endsWith("index.html");
  if(isDoc){
    // network-first: always try to load the latest page, fall back to cache offline
    e.respondWith(
      fetch(req).then((res)=>{ const copy=res.clone(); caches.open(CACHE).then((c)=>c.put(req,copy)).catch(()=>{}); return res; })
        .catch(()=>caches.match(req).then((r)=>r||caches.match("index.html")))
    );
    return;
  }
  // assets: cache-first (fast + offline), then network (and cache what we fetch, e.g. fish photos)
  e.respondWith(
    caches.match(req).then((cached)=>cached||fetch(req).then((res)=>{
      const copy=res.clone(); caches.open(CACHE).then((c)=>c.put(req,copy)).catch(()=>{}); return res;
    }).catch(()=>caches.match("index.html")))
  );
});
