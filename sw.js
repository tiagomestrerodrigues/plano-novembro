// Guarda a app no telemóvel para funcionar sem internet
const CACHE='plano-nov-v1';
const FILES=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./img/atum.jpg", "./img/bolonhesa.jpg", "./img/bowl.jpg", "./img/caril.jpg", "./img/frango.jpg", "./img/fruta-tremocos.jpg", "./img/jantar-omelete.jpg", "./img/jantar-peixe.jpg", "./img/jantar-peru.jpg", "./img/overnight.jpg", "./img/ovos.jpg", "./img/panquecas.jpg", "./img/papas.jpg", "./img/pescada.jpg", "./img/salmao.jpg", "./img/shake.jpg", "./img/skyr-fruta.jpg", "./img/taca.jpg", "./img/tostas.jpg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{
    if(res&&(res.ok||res.type==='opaque')){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return res;}).catch(()=>caches.match('./index.html'))));
});
