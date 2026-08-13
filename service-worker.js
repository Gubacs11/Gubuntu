"use strict";

const APP_VERSION="1.0.0";
const BUILD_NUMBER=121;
const CACHE_NAME=`gubuntu-arcade-v${APP_VERSION}-build${BUILD_NUMBER}`;
const APP_SHELL=["./","./index.html","./styles.css?v=121","./void-miner.js?v=121","./app.js?v=121","./assets/neon-salvager-weapons.png","./assets/fish-species-freshwater.png","./assets/fish-species-ocean.png","./assets/fish-species-legendary.png","./assets/fish-species-arcade.png","./assets/fish-species-bosses.png","./manifest.json","./icons/gubuntu.ico","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(
        APP_SHELL.map(file => cache.add(file))
      )
    )
  );
});

self.addEventListener("message",event=>{if(event.data?.type==="SKIP_WAITING")self.skipWaiting();});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).catch(()=>caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}
    return response;
  })));
});
