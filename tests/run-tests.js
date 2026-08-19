"use strict";

const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const root=path.resolve(__dirname,"..");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const build=Number(read("app.js").match(/const BUILD_NUMBER\s*=\s*(\d+)/)?.[1]);
const tests=[];
const test=(name,fn)=>tests.push([name,fn]);
const load=(file,context={})=>{
  context.console||=console;context.Math||=Math;context.Date||=Date;
  vm.createContext(context);vm.runInContext(read(file),context,{filename:file});return context;
};

test("Fisher-Yates preserves the input and its elements",()=>{
  const context=load("games/shared-random.js");
  const input=[1,2,3,4,5],before=[...input],result=context.shuffle(input,()=>.25);
  assert.deepEqual(input,before);assert.deepEqual([...result].sort((a,b)=>a-b),before);
  assert.notStrictEqual(result,input);
});

test("Fisher-Yates handles empty and one-element arrays",()=>{
  const {shuffle}=load("games/shared-random.js");
  assert.deepEqual([...shuffle([])],[]);assert.deepEqual([...shuffle([42])],[42]);
});

test("Fisher-Yates has no extreme three-item permutation bias",()=>{
  const {shuffle}=load("games/shared-random.js"),counts=new Map();
  for(let i=0;i<60000;i++){const key=[...shuffle([0,1,2])].join("");counts.set(key,(counts.get(key)||0)+1);}
  assert.equal(counts.size,6);const values=[...counts.values()];
  assert.ok(Math.min(...values)>8500,`minimum bucket ${Math.min(...values)}`);
  assert.ok(Math.max(...values)<11500,`maximum bucket ${Math.max(...values)}`);
});

test("Blackjack and Poker receive valid shuffled decks",()=>{
  const context=load("games/shared-random.js");
  vm.runInContext(read("games/card-games-shared.js"),context,{filename:"games/card-games-shared.js"});
  for(const game of ["blackjack","poker"]){
    const deck=vm.runInContext("newDeck()",context);assert.equal(deck.length,52,`${game} deck length`);
    assert.equal(new Set(deck.map(card=>`${card.rank}${card.suit}`)).size,52,`${game} unique cards`);
    assert.deepEqual([...new Set(deck.map(card=>card.suit))].sort(),["♠","♣","♥","♦"].sort());
  }
});

test("No biased random comparator sorting remains",()=>{
  const files=["app.js",...fs.readdirSync(path.join(root,"games")).filter(file=>file.endsWith(".js")).map(file=>`games/${file}`)];
  const biased=/\.sort\s*\(\s*\(?[^=\n]*=>\s*(?:Math\.random\(\)|random\(\))\s*-\s*0?\.5/;
  const offenders=files.filter(file=>biased.test(read(file)));assert.deepEqual(offenders,[]);
});

test("Game registry rejects invalid and duplicate registrations",()=>{
  const context={window:{}};load("games/game-registry.js",context);const registry=context.window.GubuntuGames;
  assert.throws(()=>registry.register("",()=>{}),/Invalid game registration/);
  assert.throws(()=>registry.register("bad",null),/Invalid game registration/);
  registry.register("demo",()=>{});assert.equal(registry.has("demo"),true);
  assert.throws(()=>registry.register("demo",()=>{}),/Duplicate game registration/);
});

test("All 21 declared games map to existing, uniquely registering modules",()=>{
  const manifestContext=load("offline-manifest.js"),modules=manifestContext.GubuntuOfflineManifest.gameModules;
  const declared=[...read("app.js").matchAll(/\{id:"([a-z]+)", title:/g)].map(match=>match[1]);
  assert.equal(declared.length,21);assert.deepEqual([...Object.keys(modules)].sort(),[...declared].sort());
  for(const [id,file] of Object.entries(modules)){
    assert.equal(fs.existsSync(path.join(root,"games",file)),true,`${id} module exists`);
    const registrations=[];const context={GubuntuGames:{register:(registered,starter)=>registrations.push([registered,starter])}};
    load(`games/${file}`,context);assert.equal(registrations.length,1,`${id} registers once`);
    assert.equal(registrations[0][0],id);assert.equal(typeof registrations[0][1],"function");
  }
});

test("Canonical offline manifest contains every launch dependency",()=>{
  assert.ok(Number.isInteger(build)&&build>0,"app build number");
  const context=load("offline-manifest.js"),manifest=context.GubuntuOfflineManifest,assets=[...manifest.assets(build)];
  for(const file of Object.values(manifest.gameModules))assert.ok(assets.includes(`./games/${file}?v=${build}`),file);
  for(const required of [`./offline-manifest.js?v=${build}`,`./games/shared-random.js?v=${build}`,`./games/game-registry.js?v=${build}`,`./games/card-games-shared.js?v=${build}`,`./app.js?v=${build}`]){assert.ok(assets.includes(required),required);}
  for(const asset of assets){const local=asset.replace(/^\.\//,"").split("?")[0]||"index.html";assert.equal(fs.existsSync(path.join(root,local)),true,local);}
  const worker=read("service-worker.js"),app=read("app.js");
  assert.equal(Number(worker.match(/const BUILD_NUMBER\s*=\s*(\d+)/)?.[1]),build,"service-worker build matches app");
  for(const asset of ["styles.css","offline-manifest.js","games/shared-random.js","games/game-registry.js","games/card-games-shared.js","app.js"]){assert.ok(read("index.html").includes(`${asset}?v=${build}`),`${asset} HTML build`);}
  assert.match(worker,/GubuntuOfflineManifest\.assets\(BUILD_NUMBER\)/);
  assert.match(app,/GubuntuOfflineManifest\.assets\(BUILD_NUMBER\)/);
});

test("Service worker installs and serves all game modules offline",async()=>{
  const listeners={},stores=new Map(),base="http://localhost/";
  const normalize=value=>new URL(typeof value==="string"?value:value.url,base).href;
  class FakeResponse{constructor(url){this.url=url;this.ok=true;}clone(){return new FakeResponse(this.url);}}
  class FakeCache{
    constructor(){this.entries=new Map();}
    async addAll(paths){for(const asset of paths){const local=new URL(asset,base).pathname.replace(/^\//,"")||"index.html";assert.equal(fs.existsSync(path.join(root,local)),true,local);this.entries.set(normalize(asset),new FakeResponse(normalize(asset)));}}
    async match(request){return this.entries.get(normalize(request));}
    async put(request,response){this.entries.set(normalize(request),response);}
  }
  let online=true;
  const context={URL,console,fetch:async request=>{if(!online)throw new Error("offline");return new FakeResponse(normalize(request));},caches:{
    open:async name=>{if(!stores.has(name))stores.set(name,new FakeCache());return stores.get(name);},
    keys:async()=>[...stores.keys()],delete:async name=>stores.delete(name)
  }};
  context.self={location:{origin:"http://localhost"},clients:{claim:async()=>{}},skipWaiting:()=>{},addEventListener:(type,handler)=>{listeners[type]=handler}};
  vm.createContext(context);vm.runInContext(read("offline-manifest.js"),context,{filename:"offline-manifest.js"});context.importScripts=()=>{};
  vm.runInContext(read("service-worker.js"),context,{filename:"service-worker.js"});
  let installPromise;listeners.install({waitUntil:promise=>{installPromise=promise;}});await installPromise;
  const manifest=context.GubuntuOfflineManifest,cacheName=manifest.cacheName("1.0.0",build),cache=stores.get(cacheName);
  assert.ok(cache);assert.equal(cache.entries.size,manifest.assets(build).length);
  online=false;
  for(const file of Object.values(manifest.gameModules)){
    let responsePromise;listeners.fetch({request:{method:"GET",mode:"cors",url:`${base}games/${file}?v=${build}`},respondWith:promise=>{responsePromise=promise;}});
    const response=await responsePromise;assert.equal(response.ok,true,file);
  }
  stores.set("gubuntu-arcade-shell-v1.0.0-build1",new FakeCache());stores.set("unrelated-app-cache",new FakeCache());
  let activatePromise;listeners.activate({waitUntil:promise=>{activatePromise=promise;}});await activatePromise;
  assert.equal(stores.has("gubuntu-arcade-shell-v1.0.0-build1"),false);assert.equal(stores.has("unrelated-app-cache"),true);
});

test("Text readability no longer uses DOM-wide computed-style observation",()=>{
  const app=read("app.js");assert.doesNotMatch(app,/MutationObserver|normalizeGameText|getComputedStyle/);
  const declarations=[...read("styles.css").matchAll(/font(?:-size)?\s*:\s*(?:calc\(\s*)?(\d+(?:\.\d+)?)px/gi)];
  const micro=declarations.filter(match=>Number(match[1])<10).map(match=>match[0]);assert.deepEqual(micro,[]);
});

(async()=>{
  let passed=0;
  for(const [name,fn] of tests){try{await fn();passed++;console.log(`PASS ${name}`);}catch(error){console.error(`FAIL ${name}`);console.error(error);process.exitCode=1;}}
  console.log(`\n${passed}/${tests.length} tests passed`);
})();
