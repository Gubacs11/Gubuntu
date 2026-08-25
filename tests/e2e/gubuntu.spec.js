"use strict";

const {test,expect}=require("@playwright/test");

const STORE="gubuntu-arcade-v1";
const FLAGSHIPS=new Set(["voidminer","salvager","starfarer","openroad","fishing"]);

function collectRuntimeErrors(page,errors=[]){
  page.on("pageerror",error=>errors.push(`Uncaught ${error.stack||error.message}`));
  page.on("console",message=>{if(message.type()==="error")errors.push(`console.error: ${message.text()}`)});
  return errors;
}

async function preparePage(page,{name="E2E PLAYER",device="desktop"}={}){
  await page.addInitScript(()=>localStorage.setItem("gubuntu-ui-settings",JSON.stringify({reducedMotion:true,graphicsProfile:"low",sound:false,deviceMode:"auto"})));
  await page.goto("/");
  await expect(page.locator("#player-screen")).toBeVisible();await expect(page.locator("#boot-screen")).toHaveCount(0);await expect(page.locator("#device-dialog")).toHaveAttribute("open","");await page.locator(`[data-device-choice="${device}"]`).click();
  await page.locator("#new-player-btn").click();await page.locator("#player-name").fill(name);await page.locator("#profile-form button[type=submit]").click();
  await expect(page.locator("#arcade-screen")).toBeVisible();
}

async function openSavedProfile(page,id,device="desktop"){
  await page.goto("/");await expect(page.locator("#player-screen")).toBeVisible();await expect(page.locator("#boot-screen")).toHaveCount(0);await expect(page.locator("#device-dialog")).toHaveAttribute("open","");await page.locator(`[data-device-choice="${device}"]`).click();
  await page.locator(`[data-id="${id}"]`).click();await expect(page.locator("#arcade-screen")).toBeVisible();
}

async function launchAndClose(page,id){
  try{
    const card=page.locator(`[data-game-card="${id}"]`);await card.scrollIntoViewIfNeeded();await card.press("Enter");
    await expect(page.locator("#game-dialog")).toHaveAttribute("open","");
    await expect.poll(async()=>page.locator("#game-stage").evaluate(node=>({children:node.children.length,text:node.textContent.trim().length,canvas:node.querySelectorAll("canvas").length})),{message:`FAIL: ${id} — game stage remained empty`}).toMatchObject({children:expect.any(Number)});
    const rendered=await page.locator("#game-stage").evaluate(node=>node.children.length>0&&(node.textContent.trim().length>0||node.querySelector("canvas,svg,img,button,input"))!==null);
    expect(rendered,`FAIL: ${id} — game stage remained empty`).toBe(true);
    await page.locator('#game-dialog [data-close="game-dialog"]').click();await expect(page.locator("#game-dialog")).not.toHaveAttribute("open","");await expect(page.locator("#game-grid")).toBeVisible();
  }catch(error){throw new Error(`FAIL: ${id}\n${error.message}`)}
}

test("quick-launches every declared game and safely reopens flagships",async({page})=>{
  const errors=collectRuntimeErrors(page);await preparePage(page);
  const ids=await page.evaluate(()=>Object.keys(GubuntuOfflineManifest.gameModules));
  expect(ids.length).toBeGreaterThan(0);
  for(const id of ids)await test.step(`launch ${id}`,()=>launchAndClose(page,id));
  for(const id of ids.filter(id=>FLAGSHIPS.has(id)))await test.step(`reopen ${id}`,()=>launchAndClose(page,id));
  expect(errors,errors.join("\n")).toEqual([]);
  await page.close({runBeforeUnload:false});
});

test("valid progression survives save migration and reload",async({page,context})=>{
  const errors=collectRuntimeErrors(page);await preparePage(page,{name:"PERSIST"});
  const id=await page.evaluate(()=>{const save=JSON.parse(localStorage.getItem("gubuntu-arcade-v1"));const player=save.profiles[0];player.coins=777;player.xp=345;player.starfarer.atlas=[{id:"persisted-planet",name:"KEEP"}];player.voidMiner.credits=44;localStorage.setItem("gubuntu-arcade-v1",JSON.stringify(save));return player.id});
  await page.close({runBeforeUnload:false});const restored=await context.newPage();collectRuntimeErrors(restored,errors);await openSavedProfile(restored,id);
  const saved=await restored.evaluate(()=>JSON.parse(localStorage.getItem("gubuntu-arcade-v1")));
  expect(saved.profiles[0].coins).toBe(777);expect(saved.profiles[0].xp).toBe(345);expect(saved.profiles[0].starfarer.atlas[0].id).toBe("persisted-planet");expect(saved.profiles[0].voidMiner.credits).toBe(44);expect(()=>JSON.stringify(saved)).not.toThrow();expect(errors,errors.join("\n")).toEqual([]);await restored.close({runBeforeUnload:false});
});

test("actual reset UI erases cross-game and unknown progression permanently",async({page,context})=>{
  const errors=collectRuntimeErrors(page);await preparePage(page,{name:"RESET"});
  const id=await page.evaluate(()=>{const save=JSON.parse(localStorage.getItem("gubuntu-arcade-v1")),p=save.profiles[0];Object.assign(p,{coins:9000,xp:8000,plays:70,inventory:["avatar-crown"],achievements:["all"],gameStats:{snake:{plays:30,wins:20}},openRoadMissions:{city:true},vehicles:["compact","scarab"],openRoadJobs:{completed:20,gold:10,bestRatings:{}},tdProgress:{xp:900,level:6,unlockedMaps:["all"]},cardLounge:{reputation:800,tablesUnlocked:["vip"]},starfarer:{atlas:[{id:"old"}],colonies:[{id:"old"}]},fishing:{bucket:[{fish:"old"}],dex:{old:1}},salvager:{xp:700,unlocks:["rail"]},voidMiner:{credits:900,upgrades:{drill:4},stats:{blocksMined:999}},battlePass:{seasonId:"neon-genesis-1",xp:1700,claimedFree:[1]},activity:{today:5},playTimeMs:123456,equipped:{cabinet:"gold"},unknownFutureProgress:{level:99},avatar:"😎",color:"#c36bff",subscription:{plan:"premium",status:"active",autoRenew:true}});localStorage.setItem("gubuntu-arcade-v1",JSON.stringify(save));return p.id});
  await page.close({runBeforeUnload:false});const resetPage=await context.newPage();collectRuntimeErrors(resetPage,errors);await openSavedProfile(resetPage,id);await resetPage.locator('[data-nav="profile"]').click();resetPage.once("dialog",dialog=>dialog.accept());await resetPage.locator("#reset-player").click();
  const assertClean=async target=>{const p=await target.evaluate(()=>JSON.parse(localStorage.getItem("gubuntu-arcade-v1")).profiles[0]);expect(p.id).toBe(id);expect(p.name).toBe("RESET");expect(p.subscription.plan).toBe("premium");expect(p.coins).toBe(100);expect(p.xp).toBe(0);expect(p.plays).toBe(0);expect(p.inventory).toEqual([]);expect(p.achievements).toEqual([]);expect(p.gameStats).toEqual({});expect(p.vehicles).toEqual(["compact"]);expect(p.starfarer.atlas).toEqual([]);expect(p.fishing.bucket).toEqual([]);expect(p.salvager.xp).toBe(0);expect(p.voidMiner.credits).toBe(0);expect(p.tdProgress.level).toBe(1);expect(p.cardLounge.reputation).toBe(0);expect(p.battlePass.xp).toBe(0);expect(p.unknownFutureProgress).toBeUndefined();expect(p.avatar).toBe("👾");expect(p.color).toBe("#31f5ff")};
  await assertClean(resetPage);await resetPage.close({runBeforeUnload:false});const reloaded=await context.newPage();collectRuntimeErrors(reloaded,errors);await openSavedProfile(reloaded,id);await assertClean(reloaded);expect(errors,errors.join("\n")).toEqual([]);await reloaded.close({runBeforeUnload:false});
});

for(const viewport of [{width:1920,height:1080},{width:360,height:800},{width:390,height:844},{width:412,height:915},{width:844,height:390}]){
  test(`layout remains usable at ${viewport.width}x${viewport.height}`,async({browser})=>{
    const mobile=viewport.width<=844&&viewport.height<=915&&viewport.width!==1920,context=await browser.newContext({viewport,isMobile:mobile,hasTouch:mobile}),page=await context.newPage(),errors=collectRuntimeErrors(page);
    await preparePage(page,{name:`VIEW${viewport.width}`,device:mobile?"mobile":"desktop"});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2),"document has horizontal overflow").toBe(true);
    if(mobile){await expect(page.locator("#toggle-sidebar")).toBeVisible();await page.locator("#toggle-sidebar").click();await expect(page.locator("#arcade-sidebar")).toBeVisible();await page.locator('#arcade-sidebar [data-nav="settings"]').click()}else{await expect(page.locator("#arcade-sidebar")).toBeVisible();await page.locator("#open-settings").click()}
    const box=await page.locator("#settings-dialog").boundingBox();expect(box).not.toBeNull();expect(box.x+box.width).toBeGreaterThan(0);expect(box.x).toBeLessThan(viewport.width);await page.locator('[data-close="settings-dialog"]').click();await expect(page.locator("#settings-dialog")).not.toHaveAttribute("open","");
    await launchAndClose(page,"guess");expect(errors,errors.join("\n")).toEqual([]);await context.close();
  });
}

test("service worker shell and flagship modules work offline",async({page,context})=>{
  const errors=collectRuntimeErrors(page);await preparePage(page,{name:"OFFLINE"});const id=await page.evaluate(()=>JSON.parse(localStorage.getItem("gubuntu-arcade-v1")).profiles[0].id);await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForTimeout(500);await page.close({runBeforeUnload:false});await context.setOffline(true);const offlinePage=await context.newPage();collectRuntimeErrors(offlinePage,errors);await openSavedProfile(offlinePage,id);
  for(const gameId of ["voidminer","starfarer","openroad"])await launchAndClose(offlinePage,gameId);
  expect(errors,errors.join("\n")).toEqual([]);await context.setOffline(false);await offlinePage.close({runBeforeUnload:false});
});
