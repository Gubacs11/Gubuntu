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

test("Canonical new player contains every clean progression default",()=>{
  const context=load("player-state.js"),fresh=context.GubuntuPlayerState.createDefaultPlayer({id:"new-id",name:"Teszt",seasonId:"season-test"});
  assert.equal(fresh.id,"new-id");assert.equal(fresh.name,"Teszt");assert.equal(fresh.coins,100);assert.equal(fresh.xp,0);assert.equal(fresh.rank,"ÚJONC");
  assert.deepEqual([...fresh.inventory],[]);assert.deepEqual([...fresh.achievements],[]);assert.deepEqual({...fresh.gameStats},{});
  assert.deepEqual([...fresh.vehicles],["compact"]);assert.equal(fresh.tdProgress.level,1);assert.deepEqual([...fresh.cardLounge.tablesUnlocked],["casual"]);
  assert.equal(fresh.fishing.rod,1);assert.deepEqual([...fresh.fishing.bucket],[]);assert.equal(fresh.salvager.level,1);assert.deepEqual([...fresh.salvager.unlocks],["pistol"]);
  assert.equal(fresh.voidMiner.credits,0);assert.deepEqual([...fresh.voidMiner.discoveries.resources],[]);assert.equal(fresh.starfarer.fuel,8);assert.deepEqual([...fresh.starfarer.atlas],[]);
  assert.equal(fresh.battlePass.seasonId,"season-test");assert.equal(fresh.battlePass.xp,0);assert.equal(fresh.playTimeMs,0);assert.deepEqual({...fresh.activity},{});
});

test("Canonical reset removes all known and unknown progression while preserving identity and entitlement",()=>{
  const {createDefaultPlayer,resetPlayerState}=load("player-state.js").GubuntuPlayerState;
  const player=createDefaultPlayer({id:"keep-id",name:"Keep Name",seasonId:"season-test"}),reference=player;
  Object.assign(player,{coins:99999,xp:42000,plays:88,totalWins:55,totalLosses:12,achievements:["all"],inventory:["avatar-crown","theme-royal"],gameStats:{snake:{plays:30,wins:20}},openRoadMissions:{city:true},vehicles:["compact","scarab"],secrets:["moon"],tuning:{scarab:{engine:4}},openRoadGarage:{scarab:{mileage:999}},openRoadJobs:{completed:50,gold:40,bestRatings:{race:"GOLD"}},activity:{"2026-08-25":12},playTimeMs:999999,coinsEarned:8888,equipped:{cabinet:"gold"},unknownFutureProgress:{level:9001},avatar:"😎",color:"#c36bff"});
  player.starfarer={atlas:[{id:"planet"}],colonies:[{id:"colony"}],upgrades:{scanner:9}};player.fishing={bucket:[{fish:"boss"}],dex:{boss:1},shop:{cooler:9}};
  player.salvager={xp:9000,unlocks:["everything"],runs:90};player.voidMiner={credits:5000,upgrades:{drill:4},discoveries:{resources:["void"]},stats:{blocksMined:999}};
  player.tdProgress={xp:8000,level:40,unlockedMaps:["all"],completedContracts:["boss"]};player.cardLounge={reputation:999,tablesUnlocked:["vip"],completedContracts:["all"]};player.chaosWorks={cash:99999,totalProduced:500,keptProducts:[{id:"old"}],unknownChaosProgress:true};
  player.battlePass={seasonId:"season-test",xp:1900,claimedFree:[1,2],claimedPremium:[1]};player.favorites=["snake"];player.launchPrefs={snake:{difficulty:"hard"}};player.subscription={plan:"premium",status:"active",autoRenew:true,provider:"test"};
  resetPlayerState(player,{seasonId:"season-test",baseAvatars:["👾","🤖"],baseColors:["#31f5ff","#ff3eb5"]});
  assert.strictEqual(player,reference);assert.equal(player.id,"keep-id");assert.equal(player.name,"Keep Name");assert.deepEqual([...player.favorites],["snake"]);assert.equal(player.subscription.plan,"premium");
  assert.equal(player.coins,100);assert.equal(player.xp,0);assert.equal(player.plays,0);assert.equal(player.rank,"ÚJONC");assert.equal(player.avatar,"👾");assert.equal(player.color,"#31f5ff");
  assert.equal("unknownFutureProgress" in player,false);assert.deepEqual([...player.inventory],[]);assert.deepEqual({...player.equipped},{});assert.deepEqual({...player.gameStats},{});
  assert.deepEqual([...player.vehicles],["compact"]);assert.equal(player.openRoadJobs.completed,0);assert.equal(player.starfarer.atlas.length,0);assert.equal(player.fishing.bucket.length,0);assert.equal(player.salvager.xp,0);assert.equal(player.voidMiner.credits,0);assert.equal(player.tdProgress.level,1);assert.equal(player.cardLounge.reputation,0);assert.equal(player.chaosWorks.cash,500);assert.equal(player.chaosWorks.totalProduced,0);assert.equal(player.chaosWorks.unknownChaosProgress,undefined);assert.equal(player.battlePass.xp,0);assert.equal(player.playTimeMs,0);
});

test("Chaos Works generator creates bounded, finite, product-specific components",()=>{
  const context={GubuntuGames:{register:()=>{}}};load("games/chaos-works.js",context);const core=context.ChaosWorksCore;let seed=123456;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  for(const type of Object.keys(core.PRODUCT_TYPES))for(let i=0;i<80;i++){const product=core.generateProduct(type,rng);assert.equal(product.type,type);assert.ok(product.quality>=0&&product.quality<=100);assert.ok(Number.isFinite(product.value)&&product.value>=0);assert.ok(Object.keys(product.stats).length>=4);for(const value of Object.values(product.stats))assert.ok(Number.isFinite(value)&&value>=-5&&value<=105);assert.ok(["COMMON","UNCOMMON","RARE","EPIC","LEGENDARY","PROTOTYPE","ANOMALOUS"].includes(product.rarity));}
});

test("Chaos Works quality is weighted toward the middle",()=>{
  const context={GubuntuGames:{register:()=>{}}};load("games/chaos-works.js",context);const {rollQuality}=context.ChaosWorksCore;let seed=7;const rng=()=>{seed=(seed*1103515245+12345)>>>0;return seed/4294967296},values=Array.from({length:5000},()=>rollQuality(rng,{})),middle=values.filter(value=>value>=30&&value<=75).length,extreme=values.filter(value=>value<10||value>95).length;assert.ok(middle>extreme*5,`${middle} middle vs ${extreme} extreme`);
});

test("Chaos Works traits, anomalies, and records are deterministic and meaningful",()=>{
  const playerContext=load("player-state.js"),context={GubuntuGames:{register:()=>{}}};load("games/chaos-works.js",context);const core=context.ChaosWorksCore,base={strength:50,precision:50,corrosion:50,weight:50},modified=core.applyTraits(base,["reinforced"],()=>.5);assert.ok(modified.strength>base.strength);assert.ok(modified.weight>base.weight);
  const anomaly=core.generateProduct("bearing",()=>.999,{forceAnomaly:true,traits:["impossible"]});assert.equal(anomaly.rarity,"ANOMALOUS");assert.ok(anomaly.anomaly?.description);const state=playerContext.GubuntuPlayerState.createDefaultChaosWorksState(),first=core.updateArchive(state,anomaly);assert.ok(first.includes("mostValuable"));assert.equal(state.archive.firstAnomalous.id,anomaly.id);const weaker={...anomaly,id:"weaker",value:1,quality:1,rarityScore:1};core.updateArchive(state,weaker);assert.equal(state.records.mostValuable.id,anomaly.id);
});

test("Chaos Works save normalization preserves progress and bounds collections",()=>{
  const api=load("player-state.js").GubuntuPlayerState,input={cash:900,totalProduced:42,selectedRecipe:"gear",keptProducts:Array.from({length:90},(_,i)=>({id:`p${i}`})),recentProducts:Array.from({length:30},(_,i)=>({id:`r${i}`})),upgrades:{precisionTooling:3}};const state=api.normalizeChaosWorksState(input);assert.equal(state.cash,900);assert.equal(state.totalProduced,42);assert.equal(state.selectedRecipe,"gear");assert.equal(state.upgrades.precisionTooling,3);assert.equal(state.keptProducts.length,70);assert.equal(state.recentProducts.length,12);assert.equal(state.version,1);
});

test("All declared games map to existing, uniquely registering modules",()=>{
  const manifestContext=load("offline-manifest.js"),modules=manifestContext.GubuntuOfflineManifest.gameModules;
  const declared=[...read("app.js").matchAll(/\{id:"([a-z]+)", title:/g)].map(match=>match[1]);
  assert.ok(declared.length>0);assert.deepEqual([...Object.keys(modules)].sort(),[...declared].sort());
  for(const [id,file] of Object.entries(modules)){
    assert.equal(fs.existsSync(path.join(root,"games",file)),true,`${id} module exists`);
    const registrations=[];const context={GubuntuGames:{register:(registered,starter)=>registrations.push([registered,starter])}};
    load(`games/${file}`,context);assert.equal(registrations.length,1,`${id} registers once`);
    assert.equal(registrations[0][0],id);assert.equal(typeof registrations[0][1],"function");
  }
});

test("Initial script order defines offline and shuffle globals before consumers",()=>{
  const scripts=[...read("index.html").matchAll(/<script\s+src="([^"]+)"/g)].map(match=>match[1].split("?")[0]);
  assert.deepEqual(scripts.slice(-6),[
    "offline-manifest.js","games/shared-random.js","games/game-registry.js",
    "games/card-games-shared.js","player-state.js","app.js"
  ]);
  const context=load("offline-manifest.js");
  vm.runInContext(read("games/shared-random.js"),context,{filename:"games/shared-random.js"});
  assert.equal(typeof context.GubuntuOfflineManifest,"object");
  assert.equal(typeof context.shuffle,"function");
});

test("Canonical offline manifest contains every launch dependency",()=>{
  assert.ok(Number.isInteger(build)&&build>0,"app build number");
  const context=load("offline-manifest.js"),manifest=context.GubuntuOfflineManifest,assets=[...manifest.assets(build)];
  for(const file of Object.values(manifest.gameModules))assert.ok(assets.includes(`./games/${file}?v=${build}`),file);
  for(const required of [`./offline-manifest.js?v=${build}`,`./games/shared-random.js?v=${build}`,`./games/game-registry.js?v=${build}`,`./games/card-games-shared.js?v=${build}`,`./player-state.js?v=${build}`,`./app.js?v=${build}`]){assert.ok(assets.includes(required),required);}
  for(const asset of assets){const local=asset.replace(/^\.\//,"").split("?")[0]||"index.html";assert.equal(fs.existsSync(path.join(root,local)),true,local);}
  const worker=read("service-worker.js"),app=read("app.js");
  assert.equal(Number(worker.match(/const BUILD_NUMBER\s*=\s*(\d+)/)?.[1]),build,"service-worker build matches app");
  for(const asset of ["styles.css","offline-manifest.js","games/shared-random.js","games/game-registry.js","games/card-games-shared.js","player-state.js","app.js"]){assert.ok(read("index.html").includes(`${asset}?v=${build}`),`${asset} HTML build`);}
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
  vm.createContext(context);context.importScripts=source=>{
    const file=source.replace(/^\.\//,"").split("?")[0];
    vm.runInContext(read(file),context,{filename:file});
  };
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
