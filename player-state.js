"use strict";

// Canonical persisted player shape. Keep game defaults here so profile creation,
// migration and destructive reset cannot drift apart.
globalThis.GubuntuPlayerState=(()=>{
  const clone=value=>JSON.parse(JSON.stringify(value));
  const isObject=value=>value&&typeof value==="object"&&!Array.isArray(value);

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

  return Object.freeze({createDefaultPlayer,mergeMissingDefaults,replacePlayerState,resetPlayerState});
})();
