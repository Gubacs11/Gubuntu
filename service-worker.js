"use strict";

const APP_VERSION="1.0.0";
const BUILD_NUMBER=126;
const CACHE_PREFIX="gubuntu-arcade-";
const SHELL_CACHE=`${CACHE_PREFIX}shell-v${APP_VERSION}-build${BUILD_NUMBER}`;
const RUNTIME_CACHE=`${CACHE_PREFIX}runtime-v1`;
const REQUIRED_SHELL=[
  "./","./index.html","./styles.css?v=126","./games/game-registry.js?v=126",
  "./games/card-games-shared.js?v=126","./app.js?v=126","./manifest.json","./icons/gubuntu.ico","./icons/icon-192.png",
  "./icons/icon-512.png","./icons/icon-maskable-512.png"
];
const OPTIONAL_ASSETS=[];
const LARGE_ASSET=/\/(?:fish-species-[^/]+|neon-salvager-weapons)\.png$/;

self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(SHELL_CACHE);
    await cache.addAll(REQUIRED_SHELL);
    await Promise.allSettled(OPTIONAL_ASSETS.map(asset=>cache.add(asset)));
  })());
});

self.addEventListener("message",event=>{if(event.data?.type==="SKIP_WAITING")self.skipWaiting();});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==SHELL_CACHE&&key!==RUNTIME_CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

const cacheFirst=async(request,cacheName)=>{
  const cached=await caches.match(request);
  if(cached)return cached;
  const response=await fetch(request);
  if(response.ok){const cache=await caches.open(cacheName);await cache.put(request,response.clone());}
  return response;
};

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).catch(()=>caches.match("./index.html")));
    return;
  }
  const url=new URL(event.request.url);
  event.respondWith(cacheFirst(event.request,LARGE_ASSET.test(url.pathname)?RUNTIME_CACHE:SHELL_CACHE));
});
