// Guarda a app no telemóvel para funcionar sem internet
const CACHE='plano-nov-v3';
const FILES=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./atum.jpg", "./bolonhesa.jpg", "./bowl.jpg", "./caril.jpg", "./frango.jpg", "./fruta-tremocos.jpg", "./jantar-omelete.jpg", "./jantar-peixe.jpg", "./jantar-peru.jpg", "./overnight.jpg", "./ovos.jpg", "./panquecas.jpg", "./papas.jpg", "./pescada.jpg", "./salmao.jpg", "./shake.jpg", "./skyr-fruta.jpg", "./taca.jpg", "./tostas.jpg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const isPage=e.request.mode==='navigate'||e.request.url.endsWith('.html')||e.request.url.endsWith('/');
  if(isPage){ // página: tenta sempre a versão nova primeiro, usa a guardada sem internet
    e.respondWith(fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return res;}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{
    if(res&&(res.ok||res.type==='opaque')){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return res;})));
});
