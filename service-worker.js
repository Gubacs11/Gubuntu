"use strict";

const APP_VERSION="1.0.0";
const BUILD_NUMBER=128;
const CACHE_PREFIX="gubuntu-arcade-";
importScripts(`./offline-manifest.js?v=${BUILD_NUMBER}`);
const SHELL_CACHE=GubuntuOfflineManifest.cacheName(APP_VERSION,BUILD_NUMBER);
const RUNTIME_CACHE=`${CACHE_PREFIX}runtime-v${APP_VERSION}-build${BUILD_NUMBER}`;
const REQUIRED_SHELL=GubuntuOfflineManifest.assets(BUILD_NUMBER);
const LARGE_ASSET=/\/(?:fish-species-[^/]+|neon-salvager-weapons)\.png$/;

self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(SHELL_CACHE);
    await cache.addAll(REQUIRED_SHELL);
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
  const cache=await caches.open(cacheName),cached=await cache.match(request);
  if(cached)return cached;
  const response=await fetch(request);
  if(response.ok)await cache.put(request,response.clone());
  return response;
};

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).catch(async()=>{const cache=await caches.open(SHELL_CACHE);return cache.match("./index.html");}));
    return;
  }
  const url=new URL(event.request.url);
  event.respondWith(cacheFirst(event.request,LARGE_ASSET.test(url.pathname)?RUNTIME_CACHE:SHELL_CACHE));
});
