// 网络优先：在线尽快拿到新版本，离线回退到已缓存资源。
// 以后修改 index.html / manifest / 图标时，请同步升级此版本号。
const CACHE = "vocabflash-cache-v3";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
 event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith("vocabflash-cache-") && key !== CACHE).map(key => caches.delete(key)));
  await self.clients.claim();
 })());
});

self.addEventListener("fetch", event => {
 const request = event.request;
 if(request.method !== "GET" || new URL(request.url).origin !== self.location.origin)return;
 event.respondWith((async () => {
  try {
   const response = await fetch(request, {cache:"no-cache"});
   if(response.ok){
    const cache = await caches.open(CACHE);
    await cache.put(request,response.clone());
   }
   return response;
  } catch(e){
   const cached = await caches.match(request);
   if(cached)return cached;
   if(request.mode === "navigate")return (await caches.match("./index.html")) || Response.error();
   return Response.error();
  }
 })());
});
