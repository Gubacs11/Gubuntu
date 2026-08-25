"use strict";

// Canonical persisted player shape. Keep game defaults here so profile creation,
// migration and destructive reset cannot drift apart.
globalThis.GubuntuPlayerState=(()=>{
  const clone=value=>JSON.parse(JSON.stringify(value));
  const isObject=value=>value&&typeof value==="object"&&!Array.isArray(value);

  function createDefaultChaosWorksState(){
    return {
      version:2,cash:500,scrap:0,factoryLevel:1,totalProduced:0,totalSold:0,totalScrapped:0,totalEarned:0,
      bestValue:0,bestQuality:0,worstQuality:100,legendaryFound:0,prototypeFound:0,anomalousFound:0,
      unlockedTiers:[1],selectedRecipe:"bolt",
      upgrades:{precisionTooling:0,qualityControl:0,experimentalEngineering:0,betterMaterials:0,advancedScanner:0,fasterConveyor:0,warehouseExpansion:0,collectorNetwork:0,anomalyResearch:0,materialRecovery:0},
      economy:{totalProductionCost:0,totalRevenue:0,totalProfit:0,totalScrapValue:0,bestSale:0,biggestLoss:0},
      archive:{discovered:[],highQualityByType:{},highValueByType:{},extremeByType:{},rareTraits:[],rarestTrait:null,rarityCounts:{COMMON:0,UNCOMMON:0,RARE:0,EPIC:0,LEGENDARY:0,PROTOTYPE:0,ANOMALOUS:0},firstLegendary:null,firstPrototype:null,firstAnomalous:null},
      records:{},keptProducts:[],recentProducts:[],
      productionSettings:{autoSell:false,sellAbove:1000,autoScrap:false,scrapBelow:20,autoKeep:false,keepMinimumRarity:"LEGENDARY",alertMinimumRarity:"PROTOTYPE",protectDiscoveries:true,allowSpecialAutomation:false,pauseOnLegendary:true},
      rewardFlags:{rare:false,legendary:false,anomalous:false}
    };
  }

  function normalizeChaosWorksState(value){
    const defaults=createDefaultChaosWorksState(),state=isObject(value)?value:{};const legacyAutoKeep=state.productionSettings?.autoKeepRare===true,legacyAlert=state.productionSettings?.alertAnomalous===true,hadEconomy=isObject(state.economy);mergeMissingDefaults(state,defaults);state.version=2;
    ["cash","scrap","factoryLevel","totalProduced","totalSold","totalScrapped","totalEarned","bestValue","bestQuality","legendaryFound","prototypeFound","anomalousFound"].forEach(key=>state[key]=Math.max(key==="factoryLevel"?1:0,Math.floor(Number(state[key])||0)));state.worstQuality=Math.max(0,Math.min(100,Number.isFinite(Number(state.worstQuality))?Number(state.worstQuality):100));
    state.unlockedTiers=[...new Set((Array.isArray(state.unlockedTiers)?state.unlockedTiers:[1]).map(Number).filter(value=>Number.isInteger(value)&&value>0))];if(!state.unlockedTiers.includes(1))state.unlockedTiers.unshift(1);
    state.selectedRecipe=["bolt","gear","bearing","spring"].includes(state.selectedRecipe)?state.selectedRecipe:"bolt";
    state.upgrades=isObject(state.upgrades)?state.upgrades:{};Object.keys(defaults.upgrades).forEach(key=>state.upgrades[key]=Math.max(0,Math.min(5,Math.floor(Number(state.upgrades[key])||0))));
    state.economy=isObject(state.economy)?state.economy:{};mergeMissingDefaults(state.economy,defaults.economy);if(!hadEconomy){state.economy.totalRevenue=state.totalEarned;state.economy.totalProfit=state.totalEarned}Object.keys(defaults.economy).forEach(key=>state.economy[key]=key==="totalProfit"?(Number.isFinite(Number(state.economy[key]))?Number(state.economy[key]):0):Math.max(0,Number.isFinite(Number(state.economy[key]))?Number(state.economy[key]):0));
    state.archive=isObject(state.archive)?state.archive:{};mergeMissingDefaults(state.archive,defaults.archive);["discovered","rareTraits"].forEach(key=>state.archive[key]=[...new Set((Array.isArray(state.archive[key])?state.archive[key]:[]).filter(value=>typeof value==="string"))].slice(-120));["highQualityByType","highValueByType","extremeByType","rarityCounts"].forEach(key=>state.archive[key]=isObject(state.archive[key])?state.archive[key]:{});Object.keys(defaults.archive.rarityCounts).forEach(key=>state.archive.rarityCounts[key]=Math.max(0,Math.floor(Number(state.archive.rarityCounts[key])||0)));
    state.records=isObject(state.records)?state.records:{};state.keptProducts=(Array.isArray(state.keptProducts)?state.keptProducts:[]).filter(item=>isObject(item)&&typeof item.id==="string").map(item=>({...item,locked:item.locked===true,favorite:item.favorite===true})).slice(-70);state.recentProducts=(Array.isArray(state.recentProducts)?state.recentProducts:[]).filter(item=>isObject(item)&&typeof item.id==="string").slice(0,16);
    state.productionSettings=isObject(state.productionSettings)?state.productionSettings:{};mergeMissingDefaults(state.productionSettings,defaults.productionSettings);if(legacyAutoKeep)state.productionSettings.autoKeep=true;if(legacyAlert)state.productionSettings.alertMinimumRarity="ANOMALOUS";["autoSell","autoScrap","autoKeep","protectDiscoveries","allowSpecialAutomation","pauseOnLegendary"].forEach(key=>state.productionSettings[key]=state.productionSettings[key]===true);const sellAbove=Number(state.productionSettings.sellAbove),scrapBelow=Number(state.productionSettings.scrapBelow);state.productionSettings.sellAbove=Math.max(0,Number.isFinite(sellAbove)?sellAbove:1000);state.productionSettings.scrapBelow=Math.max(0,Math.min(100,Number.isFinite(scrapBelow)?scrapBelow:20));const rarities=Object.keys(defaults.archive.rarityCounts);state.productionSettings.keepMinimumRarity=rarities.includes(state.productionSettings.keepMinimumRarity)?state.productionSettings.keepMinimumRarity:"LEGENDARY";state.productionSettings.alertMinimumRarity=rarities.includes(state.productionSettings.alertMinimumRarity)?state.productionSettings.alertMinimumRarity:"PROTOTYPE";delete state.productionSettings.autoKeepRare;delete state.productionSettings.alertAnomalous;
    state.rewardFlags=isObject(state.rewardFlags)?state.rewardFlags:{};mergeMissingDefaults(state.rewardFlags,defaults.rewardFlags);return state;
  }

  function createDefaultPlayer(options={}){
    const seasonId=String(options.seasonId||"neon-genesis-1");
    return {
      id:String(options.id||""),name:String(options.name||"Játékos"),avatar:String(options.avatar||"👾"),color:String(options.color||"#31f5ff"),
      coins:100,xp:0,plays:0,totalWins:0,totalLosses:0,currentStreak:0,bestStreak:0,rank:"ÚJONC",
      inventory:[],achievements:[],favorites:[],gameStats:{},openRoadMissions:{},daily:null,lastGame:null,lastPlayedAt:null,
      playTimeMs:0,coinsEarned:0,activity:{},equipped:{},launchPrefs:{},
      vehicles:["compact"],secrets:[],tuning:{},openRoadGarage:{},openRoadJobs:{completed:0,gold:0,bestRatings:{}},
      tdProgress:{xp:0,level:1,unlockedMaps:["neon"],unlockedLoadouts:["standard"],completedContracts:[],bestScores:{}},
      cardLounge:{reputation:0,level:1,tablesUnlocked:["casual"],dailyProfit:0,bestSession:0,repToday:0,repDay:"",dailyRepClaims:[],contractProgress:{},completedContracts:[],cosmetics:[]},
      fishing:{rod:1,bait:1,total:0,sold:0,bestValue:0,bucket:[],dex:{},area:"pond",shop:{}},
      salvager:{scrap:0,xp:0,level:1,unlocks:["pistol"],securedInventory:[],weapon:"pistol",gadget:"none",skin:"ion-blue",runs:0,extractions:0,deaths:0,bestScrap:0,bestDepth:0,bosses:0,logsFound:0,objectivesCompleted:0,secretRooms:0,bossKillsByType:{mira:0,colossus:0,stalker:0},fastestBossKill:0,noDamageBossKills:0},
      voidMiner:{credits:0,upgrades:{drill:0,battery:0,cargo:0,suit:0,light:0,scanner:0,mobility:0},stats:{runs:0,extractions:0,failedRuns:0,deepestDepth:0,totalValue:0,blocksMined:0,artifactsFound:0,fullCargoExtractions:0},discoveries:{resources:[],creatures:[],zones:[],artifacts:[],rooms:[],logs:[]},artifacts:[]},
      starfarer:{atlas:[],favorites:[],upgrades:{scanner:0,tank:0,engine:0,shield:0,cargo:0,probe:0,lab:0},inventory:{},colonies:[],missions:{claimed:[],produced:{},voidScans:0,totalRelics:0},codex:{fragments:[]},factions:{},transmissions:[],eventLog:[],galacticNews:[],market:{owned:[],history:[],purchases:0},living:{logs:[],morale:72,tension:18,trust:50,chatter:""},consequence:{voidScans:0,rareScans:0,catastrophes:0,patterns:[]},research:{points:0,unlocked:[]},bridgeChoices:[],miraState:"Helpful",fuel:8,resources:0,totalScans:0,bestValue:0,sector:"inner"},
      chaosWorks:createDefaultChaosWorksState(),
      subscription:{plan:"free",status:"free",autoRenew:false},
      battlePass:{seasonId,xp:0,claimedFree:[],claimedPremium:[]}
    };
  }

  function mergeMissingDefaults(target,defaults){
    for(const [key,value] of Object.entries(defaults)){
      if(target[key]===undefined)target[key]=clone(value);
      else if(isObject(value)&&isObject(target[key]))mergeMissingDefaults(target[key],value);
    }
    return target;
  }

  function replacePlayerState(target,options={}){
    if(!isObject(target))throw new TypeError("Player state target must be an object");
    const preserved={};
    for(const key of options.preserveKeys||[])if(Object.prototype.hasOwnProperty.call(target,key))preserved[key]=clone(target[key]);
    const fresh=createDefaultPlayer({...options,...preserved});
    for(const key of Object.keys(target))delete target[key];
    Object.assign(target,fresh,preserved);
    return target;
  }

  function resetPlayerState(target,options={}){
    const baseAvatars=options.baseAvatars||["👾"],baseColors=options.baseColors||["#31f5ff"];
    const avatar=baseAvatars.includes(target.avatar)?target.avatar:baseAvatars[0];
    const color=baseColors.includes(target.color)?target.color:baseColors[0];
    return replacePlayerState(target,{...options,avatar,color,preserveKeys:["id","name","favorites","launchPrefs","subscription"]});
  }

  return Object.freeze({createDefaultPlayer,createDefaultChaosWorksState,normalizeChaosWorksState,mergeMissingDefaults,replacePlayerState,resetPlayerState});
})();
