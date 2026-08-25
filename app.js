"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const storeKey = "gubuntu-arcade-v1";
const backupKey = `${storeKey}-backups`;
const saveVersion = 3;
const APP_VERSION = "1.0.0";
const BUILD_NUMBER = 128;
const avatars = ["👾", "🤖", "👻", "🦊", "🐸", "🧙", "🥷", "🦖"];
const {createDefaultPlayer:makeDefaultPlayer,normalizeChaosWorksState,mergeMissingDefaults,resetPlayerState}=GubuntuPlayerState;

const games = [
  {id:"guess", title:"Számkitaláló", category:"skill", tag:"LOGIKA", icon:"🔢", color:"#31f5ff", cost:0, desc:"Találd meg a titkos számot minél kevesebb tippből!"},
  {id:"rps", title:"Kő • Papír • Olló", category:"luck", tag:"PÁRBAJ", icon:"✊", color:"#ff3eb5", cost:5, desc:"Klasszikus párbaj a gép ellen, három győztes körig."},
  {id:"quiz", title:"Neon Kvíz", category:"skill", tag:"TUDÁS", icon:"🧠", color:"#ffe84c", cost:0, desc:"Hét vegyes vagy igazán nehéz kérdés vár rád."},
  {id:"penalty", title:"Pixel Tizenegyes", category:"skill", tag:"FOCI", icon:"⚽", color:"#72ff77", cost:5, desc:"Ötkörös tizenegyespárbaj erőcsíkkal, kapusvetődéssel és robotrúgásokkal."},
  {id:"slots", title:"Neon Slots", category:"luck", tag:"SZERENCSE", icon:"🎰", color:"#ff3eb5", cost:0, desc:"Pörgesd meg a pixeles hengereket a jackpotért!"},
  {id:"dice", title:"Kocka-labor", category:"luck", tag:"SZERENCSE", icon:"🎲", color:"#8e5bff", cost:0, desc:"Válassz tétet és kockát, majd vadászd a maximális dobást."},
  {id:"memory", title:"Pixel Memória", category:"retro", tag:"RETRO", icon:"🃏", color:"#31f5ff", cost:0, desc:"Találd meg mind a nyolc párt a legkevesebb lépésből."},
  {id:"reaction", title:"Turbo Reakció", category:"retro", tag:"RETRO", icon:"⚡", color:"#ffe84c", cost:0, desc:"Várd meg a zöld jelzést, aztán csapj le villámgyorsan!"},
  {id:"ttt", title:"Neon Amőba", category:"retro", tag:"RETRO", icon:"❎", color:"#72ff77", cost:0, desc:"Három a nyerő. Győzd le a Gubuntu processzorát!"},
  {id:"snake", title:"Neon Snake", category:"retro", tag:"ARCADE", icon:"🐍", color:"#72ff77", cost:0, desc:"Klasszikus kígyó, gyorsuló tempó és pixeles bónuszfalatok."},
  {id:"pac", title:"Pixel Falánk", category:"retro", tag:"ARCADE", icon:"🟡", color:"#ffe84c", cost:0, desc:"Edd meg a pontokat a neon labirintusban, és kerüld el a szellemet!"},
  {id:"wreck", title:"Wreck‑It Pixel Deluxe", category:"retro", tag:"ROMBOLÁS", icon:"🔨", color:"#ff7043", cost:0, desc:"Bontási szerződések, összekapcsolt épületelemek, járműszerepek és látványos láncreakciók."},
  {id:"fishing", title:"Idle Pixel Fishing", category:"retro", tag:"IDLE", icon:"🎣", color:"#28d7d1", cost:0, desc:"Horgássz valódi és arcade-mitikus halakat, méretekkel, traitekkel, értékes fogásokkal."},
  {id:"openroad", title:"Neon Open Road", category:"retro", tag:"OUTLAW", icon:"🏎️", color:"#ff7043", cost:0, desc:"Tizenegy biomos éjszakai autóvilág wanted rendszerrel, valódi munkákkal, sérülésmodellel és gyűjthető ritka járgányokkal."},
  {id:"starfarer", title:"Neon Starfarer", category:"retro", tag:"SPACE", icon:"🚀", color:"#7df9ff", cost:0, desc:"Fedezz fel procedurális bolygókat, építs csillagatlaszt és fejleszd az expedíciós hajódat."},
  {id:"blackjack", title:"Blackjack 21", category:"luck", tag:"KÁRTYA", icon:"🂡", color:"#ff3eb5", cost:0, desc:"Érd el a 21-et, de vigyázz: egy ponttal se menj fölé!"},
  {id:"poker", title:"Videópóker", category:"luck", tag:"KÁRTYA", icon:"🃏", color:"#8e5bff", cost:0, desc:"Tartsd meg a jó lapokat, cserélj egyszer, és építs nyerő kezet."}
  ,{id:"billiards", title:"Neon Billiards", category:"skill", tag:"8-BALL", icon:"🎱", color:"#2de2a6", cost:0, desc:"Valódi fizika, taktikus 8-ball szabályok és helyi kétjátékos vagy AI párbaj."}
  ,{id:"salvager", title:"Neon Salvager", category:"skill", tag:"EXTRACTION", icon:"☢", color:"#ffb547", cost:0, desc:"Elágazó, magalapú állomástérkép, hat taktikai fegyver és többfázisú szektorfőnökök."}
  ,{id:"towerdefense", title:"Neon Grid Defense", category:"skill", tag:"TOWER DEFENSE", icon:"🏰", color:"#31f5ff", cost:0, desc:"Építs specializálható tornyokat, használj aktív képességeket, és védd meg a neon magot 15 módosított hullámon át."}
  ,{id:"voidminer", title:"VOID MINER", category:"skill", tag:"EXTRACTION ROGUELITE", icon:"⛏️", color:"#b56cff", cost:0, desc:"Descend. Extract. Don't get greedy. Mine a procedural abyss, then make it back with the haul."}
  ,{id:"chaosworks", title:"CHAOS WORKS", category:"skill", tag:"FACTORY RNG", icon:"⚙️", color:"#ffb547", cost:0, desc:"Build a factory where every product is different. Manufacture, inspect, sell, scrap and hunt impossible rolls."}
];

const gameScriptPaths=GubuntuOfflineManifest.gameModules;
const gameLoadPromises=new Map();
function ensureGameLoaded(id){
  const ready=window.GubuntuGames?.get(id);if(ready)return Promise.resolve(ready);
  if(gameLoadPromises.has(id))return gameLoadPromises.get(id);
  const file=gameScriptPaths[id];if(!file)return Promise.reject(new Error(`Unknown game module: ${id}`));
  const promise=new Promise((resolve,reject)=>{const script=document.createElement("script");script.src=`games/${file}?v=${BUILD_NUMBER}`;script.async=true;script.onload=()=>{const starter=window.GubuntuGames?.get(id);starter?resolve(starter):reject(new Error(`Game did not register: ${id}`));};script.onerror=()=>reject(new Error(`Game module failed to load: ${id}`));document.head.appendChild(script);}).catch(error=>{gameLoadPromises.delete(id);throw error;});
  gameLoadPromises.set(id,promise);return promise;
}

const shopItems = [
  {id:"avatar-crown",type:"avatar",icon:"😎",name:"MENŐ AVATÁR",desc:"Új választható profilkinézet.",price:180,value:"😎"},
  {id:"avatar-alien",type:"avatar",icon:"👽",name:"ŰRLÉNY AVATÁR",desc:"Egyenesen a neon galaxisból.",price:220,value:"👽"},
  {id:"theme-gold",type:"theme",icon:"🌟",name:"ARANY PROFIL",desc:"Aranyszínű játékoskiemelés.",price:160,value:"#ffe84c"},
  {id:"theme-fire",type:"theme",icon:"🔥",name:"TŰZ PROFIL",desc:"Lángoló narancs profilszín.",price:200,value:"#ff7043"},
  {id:"theme-matrix",type:"theme",icon:"💚",name:"MATRIX PROFIL",desc:"Klasszikus terminálzöld.",price:200,value:"#72ff77"},
  {id:"avatar-card",type:"avatar",icon:"🃏",name:"KÁRTYACÁPA",desc:"Pókerasztalhoz illő avatár.",price:320,value:"🃏"},
  {id:"avatar-racer",type:"avatar",icon:"🏎️",name:"VERSENYZŐ",desc:"Neon benzingőz és pixelpor.",price:360,value:"🏎️"},
  {id:"avatar-dragon",type:"avatar",icon:"🐲",name:"SÁRKÁNY",desc:"Ritka mitikus profilavatár.",price:520,value:"🐲"},
  {id:"theme-ocean",type:"theme",icon:"🌊",name:"ÓCEÁN PROFIL",desc:"Azúrparti kék kiemelés.",price:300,value:"#28d7d1"},
  {id:"theme-volcano",type:"theme",icon:"🌋",name:"MAGMA PROFIL",desc:"Vulkáni vörös kiemelés.",price:340,value:"#ff4b2b"},
  {id:"theme-royal",type:"theme",icon:"💜",name:"ROYAL PROFIL",desc:"Prémium királylila keret.",price:420,value:"#c36bff"}
];
shopItems.push(
  {id:"cabinet-gold",type:"cabinet",icon:"🕹️",name:"ARANY CABINET",desc:"Arany szegély minden játékablakon.",price:480,value:"gold"},
  {id:"frame-plasma",type:"frame",icon:"🟪",name:"PLAZMA PROFILKERET",desc:"Pulzáló neonkeret a játékoskártyán.",price:520,value:"plasma"},
  {id:"background-aurora",type:"background",icon:"🌌",name:"AURORA HÁTTÉR",desc:"Kozmikus menüháttér-paletta.",price:430,value:"space"},
  {id:"ship-solar",type:"shipPaint",icon:"🚀",name:"SOLAR HAJÓFESTÉS",desc:"Napfény-sárga Starfarer festés.",price:390,value:"solar"},
  {id:"car-vapor",type:"carPaint",icon:"🏎️",name:"VAPOR AUTÓFESTÉS",desc:"Rózsaszín-cián Open Road fényezés.",price:390,value:"vapor"},
  {id:"rod-crystal",type:"rodSkin",icon:"🎣",name:"KRISTÁLYBOT",desc:"Ritka horgászbot-skin.",price:330,value:"crystal"},
  {id:"sound-soft",type:"soundPack",icon:"🎵",name:"SOFT CHIPTUNE",desc:"Lágyabb arcade hangkarakter.",price:280,value:"soft"},
  {id:"avatar-phoenix",type:"avatar",icon:"🔥",name:"FŐNIX AVATÁR",desc:"Ritka, késői profiljutalom.",price:650,value:"🦅"}
);

const allowedProfileAvatars=new Set([...avatars,...shopItems.filter(item=>item.type==="avatar").map(item=>item.value)]);
const allowedProfileColors=new Set(["#31f5ff","#ff3eb5","#ffe84c","#72ff77","#8e5bff",...shopItems.filter(item=>item.type==="theme").map(item=>item.value)]);
const safeProfileId=(value,fallback)=>{const id=String(value||"");return /^[A-Za-z0-9_-]{1,80}$/.test(id)?id:fallback};

const BATTLE_PASS_SEASON={id:"neon-genesis-1",name:"NEON GENESIS",number:1,maxLevel:20,xpPerLevel:100,endsAt:"2026-09-30T21:59:59.000Z"};
const BATTLE_PASS_REWARDS=Array.from({length:BATTLE_PASS_SEASON.maxLevel},(_,index)=>{
  const level=index+1;
  const free=level%5===0?{type:"item",value:`bp-free-${level}`,icon:"🎁",label:`SZEZON LÁDA ${level}`}:{type:"coins",value:25+level*5,icon:"●",label:`${25+level*5} ÉRME`};
  const premium=level===20?{type:"item",value:"bp-neon-legend",icon:"👑",label:"NEON LEGENDA KERET"}:level%4===0?{type:"item",value:`bp-premium-${level}`,icon:"✦",label:`PRÉMIUM RELIKVIA ${level}`}:{type:"coins",value:60+level*10,icon:"⚡",label:`${60+level*10} ÉRME`};
  return {level,free,premium};
});

const ranks = [
  [1,"ÚJONC"],[3,"PIXEL TANONC"],[5,"TERMI VENDÉG"],[8,"ÉRMEVADÁSZ"],[10,"BRONZ PILÓTA"],
  [13,"NEON KEZDŐ"],[16,"KOMBO TANULÓ"],[20,"EZÜST JÁTÉKOS"],[24,"ARCADE FUTÁR"],[28,"PIXEL BAJNOKJELÖLT"],
  [32,"NEON VERSENYZŐ"],[36,"KAZETTA LOVAG"],[40,"GÉPTERMI HŐS"],[45,"TURBÓ MESTER"],[50,"ARANY ARCADE-OS"],
  [56,"RETRO STRATÉGA"],[62,"KÉPERNYŐVARÁZSLÓ"],[68,"BOSS-GYALU"],[75,"ARCADE KIRÁLY"],[82,"NEON HADNAGY"],
  [90,"PIXEL MÍTOSZ"],[98,"KOMBO PARANCSNOK"],[106,"CRT ŐRZŐ"],[115,"GUBUNTU ELIT"],[125,"NEON NAGYMESTER"],
  [135,"ARCADE TITÁN"],[145,"PIXEL ORÁKULUM"],[155,"JACKPOT FŐNIX"],[165,"GLITCH LOVAG"],[175,"KOZMIKUS JÁTÉKOS"],
  [185,"NEON FÉLISTEN"],[200,"GUBUNTU LEGENDA"],[215,"VÉGTELEN KREDIT"],[230,"ARCADE ISTENSÉG"],[250,"ÖRÖK PIXEL"]
].map(([level,name])=>({level,xp:(level-1)*100,name}));
ranks.push(
  {level:265,xp:(265-1)*100,name:"DIMENZIÓ VENDÉG"},
  {level:280,xp:(280-1)*100,name:"BOSSZÚTÓ ARCADE"},
  {level:300,xp:(300-1)*100,name:"HYPER NEON"},
  {level:315,xp:(315-1)*100,name:"BOSS HALVADÁSZ"},
  {level:330,xp:(330-1)*100,name:"FŐTERMI ŐRZŐ"},
  {level:350,xp:(350-1)*100,name:"GLITCH MÁGUS"},
  {level:375,xp:(375-1)*100,name:"PIXEL KRAKEN"},
  {level:400,xp:(400-1)*100,name:"KONZOL KIRÁLY"},
  {level:430,xp:(430-1)*100,name:"VÉGTELEN BAJNOK"},
  {level:465,xp:(465-1)*100,name:"NEON KOZMONAUTA"},
  {level:500,xp:(500-1)*100,name:"GUBUNTU AVATAR"},
  {level:550,xp:(550-1)*100,name:"MULTIVERZUM PILÓTA"},
  {level:600,xp:(600-1)*100,name:"KREDITMILLIOMOS"},
  {level:675,xp:(675-1)*100,name:"TERMI FŐBOSS"},
  {level:750,xp:(750-1)*100,name:"PIXEL FÉNYLÉNY"},
  {level:850,xp:(850-1)*100,name:"GUBUNTU ARCHITEKT"},
  {level:1000,xp:(1000-1)*100,name:"ÖRÖK ARCADE ENTITÁS"}
);
const achievements = [
  {id:"first-game",icon:"🕹️",name:"ELSŐ ÉRME",desc:"Játssz le egy teljes kört.",reward:20,test:p=>p.plays>=1},
  {id:"first-win",icon:"🏆",name:"ELSŐ GYŐZELEM",desc:"Nyerd meg az első játékodat.",reward:30,test:p=>p.totalWins>=1},
  {id:"streak-3",icon:"🔥",name:"TŰZBEN",desc:"Érj el 3-as győzelmi sorozatot.",reward:50,test:p=>p.bestStreak>=3},
  {id:"streak-5",icon:"⚡",name:"MEGÁLLÍTHATATLAN",desc:"Érj el 5-ös győzelmi sorozatot.",reward:100,test:p=>p.bestStreak>=5},
  {id:"games-25",icon:"👾",name:"TÖRZSVENDÉG",desc:"Játssz le 25 kört.",reward:100,test:p=>p.plays>=25},
  {id:"collector",icon:"🛍️",name:"GYŰJTŐ",desc:"Szerezz meg 3 bolti tárgyat.",reward:75,test:p=>(p.inventory||[]).length>=3}
];
achievements.push(
  {id:"quiz-perfect",icon:"🧠",name:"HIBÁTLAN ELMÉLET",desc:"Érj el 100%-ot egy kvízmenetben.",reward:90,test:p=>(p.gameStats?.quiz?.perfects||0)>=1},
  {id:"snake-100",icon:"🐍",name:"SZÁZAS KÍGYÓ",desc:"Érj el 100 pontot a Neon Snake-ben.",reward:100,test:p=>(p.gameStats?.snake?.best||0)>=100},
  {id:"penalty-clean",icon:"🥅",name:"ÉRINTHETETLEN KAPU",desc:"Nyerj tizenegyest kapott gól nélkül.",reward:100,test:p=>(p.gameStats?.penalty?.cleanSheets||0)>=1},
  {id:"wreck-combo-20",icon:"🔨",name:"KOMBOGÉP",desc:"Érj el 20-as kombót a Wreck-Itben.",reward:110,test:p=>(p.gameStats?.wreck?.bestCombo||0)>=20},
  {id:"blackjack-natural",icon:"🂡",name:"TERMÉSZETES 21",desc:"Kapj 21-et az első két lapból.",reward:75,test:p=>(p.gameStats?.blackjack?.naturals||0)>=1},
  {id:"starfarer-10",icon:"🪐",name:"CSILLAGTÉRKÉPÉSZ",desc:"Fedezz fel 10 bolygót.",reward:80,test:p=>(p.starfarer?.atlas?.length||0)>=10},
  {id:"starfarer-25",icon:"🌌",name:"MÉLYŰRI KUTATÓ",desc:"Fedezz fel 25 bolygót.",reward:160,test:p=>(p.starfarer?.atlas?.length||0)>=25},
  {id:"starfarer-50",icon:"🚀",name:"GALAKTIKUS KRÓNIKÁS",desc:"Fedezz fel 50 bolygót.",reward:300,test:p=>(p.starfarer?.atlas?.length||0)>=50},
  {id:"openroad-all",icon:"🏁",name:"MINDEN ÚT BEJÁRVA",desc:"Teljesítsd mind a 11 biomküldetést.",reward:220,test:p=>Object.values(p.openRoadMissions||{}).filter(Boolean).length>=11},
  {id:"fishing-legend",icon:"🐉",name:"LEGENDÁS FOGÁS",desc:"Fogj legalább 1000 érme értékű halat.",reward:140,test:p=>(p.fishing?.bestValue||0)>=1000},
  {id:"void-miner-100",icon:"⛏️",name:"DIGGY DIGGY",desc:"Mine 100 blocks in VOID MINER.",reward:80,test:p=>(p.voidMiner?.stats?.blocksMined||0)>=100},
  {id:"void-miner-250",icon:"⬇️",name:"GOING DEEP",desc:"Reach 250 m in VOID MINER.",reward:100,test:p=>(p.voidMiner?.stats?.deepestDepth||0)>=250},
  {id:"void-miner-void",icon:"◉",name:"WHAT COULD GO WRONG?",desc:"Reach THE VOID below 700 m.",reward:180,test:p=>(p.voidMiner?.stats?.deepestDepth||0)>=700},
  {id:"void-miner-greed",icon:"📦",name:"GREED",desc:"Extract with a completely full cargo hold.",reward:120,test:p=>(p.voidMiner?.stats?.fullCargoExtractions||0)>=1}
);
achievements.push(
  {id:"chaos-first-shift",icon:"⚙️",name:"FIRST SHIFT",desc:"Produce 10 Chaos Works products.",reward:60,test:p=>(p.chaosWorks?.totalProduced||0)>=10},
  {id:"chaos-quality",icon:"◆",name:"QUALITY CONTROL",desc:"Produce a quality 90+ component.",reward:80,test:p=>(p.chaosWorks?.bestQuality||0)>=90},
  {id:"chaos-garbage",icon:"☣",name:"ABSOLUTE GARBAGE",desc:"Produce a quality below 5 component.",reward:90,test:p=>(p.chaosWorks?.worstQuality??100)<5},
  {id:"chaos-legendary",icon:"✦",name:"LEGENDARY ASSET",desc:"Find a Legendary component.",reward:140,test:p=>(p.chaosWorks?.legendaryFound||0)>=1},
  {id:"chaos-anomalous",icon:"◉",name:"WHAT DID WE MAKE?",desc:"Find an Anomalous component.",reward:240,test:p=>(p.chaosWorks?.anomalousFound||0)>=1},
  {id:"chaos-mass",icon:"▦",name:"MASS PRODUCTION",desc:"Produce 1,000 components.",reward:320,test:p=>(p.chaosWorks?.totalProduced||0)>=1000},
  {id:"chaos-record",icon:"₲",name:"FACTORY RECORD",desc:"Produce a component worth more than ₲5,000.",reward:180,test:p=>(p.chaosWorks?.bestValue||0)>5000}
);

const quizEasy = [
  ["Melyik bolygó van legközelebb a Naphoz?", ["Vénusz", "Merkúr", "Mars"], 1],
  ["Hány játékos van egy focicsapatban a pályán?", ["9", "10", "11"], 2],
  ["Melyik elem vegyjele az O?", ["Arany", "Oxigén", "Ón"], 1],
  ["Mennyi 12 × 8?", ["86", "92", "96"], 2],
  ["Melyik ország zászlajában van juharlevél?", ["Kanada", "Ausztria", "Japán"], 0],
  ["Hány bit egy bájt?", ["8", "10", "16"], 0],
  ["Melyik a legnagyobb óceán?", ["Atlanti", "Indiai", "Csendes"], 2],
  ["Melyik nyelven készült az eredeti Gubuntu?", ["Python", "Java", "C++"], 0],
  ["Melyik bolygót nevezik vörös bolygónak?", ["Mars", "Jupiter", "Vénusz"], 0],
  ["Hány napos egy szökőév?", ["365", "366", "367"], 1],
  ["Melyik állat emlős?", ["Delfin", "Cápa", "Polip"], 0],
  ["Mi Franciaország fővárosa?", ["Madrid", "Párizs", "Róma"], 1],
  ["Mennyi 15 + 27?", ["42", "41", "43"], 0],
  ["Melyik szín keletkezik a kék és a sárga keveréséből?", ["Lila", "Zöld", "Narancssárga"], 1],
  ["Hány kontinens van a leggyakoribb felosztás szerint?", ["5", "6", "7"], 2],
  ["Melyik hangszernek vannak billentyűi?", ["Zongora", "Hegedű", "Dob"], 0],
  ["Melyik ország fővárosa Berlin?", ["Ausztria", "Németország", "Svájc"], 1],
  ["Mi a víz kémiai képlete?", ["CO₂", "H₂O", "O₂"], 1],
  ["Hány perc egy óra?", ["60", "100", "24"], 0],
  ["Melyik szám páros?", ["17", "21", "24"], 2],
  ["Melyik állat tud repülni?", ["Pingvin", "Sas", "Strucc"], 1],
  ["Melyik évszak követi a nyarat?", ["Tavasz", "Ősz", "Tél"], 1],
  ["Melyik a Naprendszer legnagyobb bolygója?", ["Jupiter", "Szaturnusz", "Föld"], 0],
  ["Mennyi 9 × 7?", ["56", "63", "72"], 1],
  ["Melyik ország pénzneme a jen?", ["Japán", "Kína", "Dél-Korea"], 0],
  ["Mi Magyarország legnagyobb tava?", ["Velencei-tó", "Balaton", "Fertő tó"], 1],
  ["Melyik testrészünk segítségével hallunk?", ["Szem", "Fül", "Orr"], 1],
  ["Hány oldala van egy hatszögnek?", ["5", "6", "8"], 1],
  ["Melyik nyelvet futtatja közvetlenül a böngésző?", ["JavaScript", "Python", "C#"], 0],
  ["Mit jelent a HTML rövidítésben a H betű?", ["Hyper", "High", "Home"], 0],
  ["Melyik fájl tartalmazza általában a weboldal stílusát?", ["CSS", "TXT", "EXE"], 0],
  ["Melyik eszközzel mozgatjuk általában a kurzort?", ["Nyomtató", "Egér", "Hangszóró"], 1],
  ["Melyik billentyű törli általában a kurzor előtti karaktert?", ["Shift", "Backspace", "Tab"], 1],

];
const quizHard = [
  ["Mi a periódusos rendszer 79. eleme?", ["Ezüst", "Arany", "Platina"], 1],
  ["Mennyi a bináris 101101 tízes számrendszerben?", ["41", "45", "53"], 1],
  ["Melyik protokoll oldja fel a domainneveket?", ["FTP", "DNS", "SMTP"], 1],
  ["Melyik ország nyerte az első foci-vb-t?", ["Brazília", "Olaszország", "Uruguay"], 2],
  ["Melyik adatstruktúra működik FIFO elven?", ["Verem", "Sor", "Fa"], 1],
  ["Ki festette a Guernicát?", ["Dalí", "Picasso", "Goya"], 1],
  ["Mi az Avogadro-állandó közelítő értéke?", ["6,022×10²³", "9,81×10²", "3×10⁸"], 0],
  ["Melyik hold kering a Szaturnusz körül?", ["Titan", "Europa", "Phobos"], 0],
  ["Melyik a legkisebb prímszám 100 fölött?", ["101", "103", "107"], 0],
  ["Ki írta A Mester és Margaritát?", ["Bulgakov", "Tolsztoj", "Dosztojevszkij"], 0],
  ["Mi az x² deriváltja?", ["x", "2x", "x³/3"], 1],
  ["Mit jelent a CPU rövidítés?", ["Central Processing Unit", "Core Program Utility", "Computer Primary User"], 0],
  ["Mi a fény sebessége vákuumban közelítőleg?", ["3×10⁸ m/s", "3×10⁶ m/s", "9,81 m/s"], 0],
  ["Melyik bolygón található a Nagy Vörös Folt?", ["Mars", "Jupiter", "Neptunusz"], 1],
  ["Ki dolgozta ki a relativitáselméletet?", ["Isaac Newton", "Albert Einstein", "Nikola Tesla"], 1],
  ["Melyik elem rendszáma 6?", ["Szén", "Oxigén", "Nitrogén"], 0],
  ["Mi a természetes alapú logaritmus alapja?", ["π", "e", "10"], 1],
  ["Melyik számrendszer használja a 0–7 számjegyeket?", ["Bináris", "Oktális", "Hexadecimális"], 1],
  ["Mennyi a hexadecimális FF tízes számrendszerben?", ["255", "256", "225"], 0],
  ["Melyik OSI-réteghez tartozik az IP protokoll?", ["Hálózati réteg", "Alkalmazási réteg", "Fizikai réteg"], 0],
  ["Mit jelent az SQL rövidítés?", ["Structured Query Language", "Simple Question Logic", "System Queue Layer"], 0],
  ["Melyik adatstruktúra működik LIFO elven?", ["Sor", "Verem", "Gráf"], 1],
  ["Mi az 5! értéke?", ["25", "120", "720"], 1],
  ["Melyik képlet írja le Ohm törvényét?", ["U = R × I", "P = m × g", "F = m × a"], 0],
  ["Mi a 64 bináris alakja?", ["1000000", "111111", "100000"], 0],
  ["Melyik rendezési algoritmus átlagos időkomplexitása O(n log n)?", ["Buborékrendezés", "Összefésülő rendezés", "Lineáris keresés"], 1],
  ["Mit tárol egy boolean típus?", ["Egész számot", "Igaz vagy hamis értéket", "Szöveget"], 1],
  ["Mi a deriváltja a sin(x) függvénynek?", ["cos(x)", "-sin(x)", "-cos(x)"], 0],
  ["Mi a deriváltja az eˣ függvénynek?", ["x·eˣ", "eˣ", "ln(x)"], 1],
  ["Mennyi a √144 értéke?", ["10", "12", "14"], 1],
  ["Melyik fizikai mennyiség SI-mértékegysége a watt?", ["Teljesítmény", "Energia", "Feszültség"], 0],
  ["Melyik fizikai mennyiség mértékegysége a pascal?", ["Nyomás", "Erő", "Munka"], 0],
  ["Mi a NAND kapu kimenete, ha mindkét bemenet 1?", ["0", "1", "Nem meghatározható"], 0],
  ["Melyik kapu ad 1-et, ha a bemenetek különböznek?", ["XOR", "AND", "NOR"], 0],
  ["Melyik HTML-elem használható hivatkozás létrehozására?", ["<a>", "<p>", "<div>"], 0],
  ["Melyik CSS-tulajdonság állítja a szöveg színét?", ["background", "color", "font-style"], 1],
  ["Melyik JavaScript-metódus választ ki egy elemet CSS-szelektor alapján?", ["querySelector", "push", "parseInt"], 0],
  ["Mire használható a localStorage?", ["Helyi adatok tartós tárolására", "Videokártya vezérlésére", "Fájlok tömörítésére"], 0],
  ["Melyik HTTP státuszkód jelenti azt, hogy az oldal nem található?", ["200", "404", "500"], 1],
  ["Melyik protokoll használ titkosított webkapcsolatot?", ["HTTP", "HTTPS", "FTP"], 1],
  ["Melyik komponens hajtja végre a program utasításait?", ["CPU", "SSD", "Monitor"], 0],
  ["Mit jelent a RAM rövidítés?", ["Random Access Memory", "Rapid Application Mode", "Read All Memory"], 0],


];

const quizCategoryLabels={mixed:"MIXED",science:"SCIENCE",history:"HISTORY",technology:"TECHNOLOGY",geography:"GEOGRAPHY",sport:"SPORT"};
function quizCategory(question){
  const q=question.toLocaleLowerCase("hu-HU");
  if(/foci|vb-|sport|játékos van egy focicsapat/.test(q))return "sport";
  if(/html|css|javascript|cpu|ram|sql|http|dns|protokoll|adatstruktúra|boolean|localstorage|osi|böngésző|fájl|bit|bájt/.test(q))return "technology";
  if(/főváros|ország|kontinens|óceán|folyó|hegy|tenger|sziget|budapest|duna|európa|afrika|ázsia|amerika/.test(q))return "geography";
  if(/mennyi|szám|prím|deriv|logarit|bináris|hexadecim|faktori|√|oldala|bolyg|elem|oxig|víz|fény|fizikai|hold|naprendszer|avogadro|ohm|watt|pascal|állat|emlős/.test(q))return "science";
  return "history";
}
const makeQuizQuestion=(entry,difficulty,index)=>({question:entry[0],answers:entry[1],correct:entry[2],category:quizCategory(entry[0]),difficulty,explanation:`A helyes válasz: ${entry[1][entry[2]]}.`,key:`${difficulty}-${index}-${entry[0]}`});
const quizQuestions=[
  ...quizEasy.map((entry,index)=>makeQuizQuestion(entry,"easy",index)),
  ...quizHard.map((entry,index)=>makeQuizQuestion(entry,index%3===0?"hard":"medium",index))
];

// A három kombinálható kommentárbank több mint 3000 különböző mondatot ad.
const commentaryBanks={
  win:{a:["Ez igen!","Micsoda kör!","A gép csak pislog!","Pixelpontos játék!","Na, ezt tanítani kellene!","A szerencse felvette a telefont!","Tiszta mestermunka!","Felrobbant a pontszámláló!","A neonfény is neked tapsol!","Megjött a bajnok!","Ezt még a gép is visszanézi!","Hibátlan időzítés!"],b:["A kassza megadta magát","A megérzésed betalált","A téthez bátorság is járt","A pixelek összeálltak","Gubuntu processzora túlmelegedett","Fortuna melléd ült","Az ellenfél kifogyott az ötletekből","A stratégia tökéletes volt","A jackpot szaga érződött","A szerencsemérő kiakadt","A kör a te nevedet viseli","A neonvárosban már rólad beszélnek"],c:["— ezt tedd el emlékbe!","— jöhet a győzelmi kör!","— a bank most csendben marad.","— ennél szebbet rajzolni sem lehet.","— valaki hívja a rekordkönyvet!","— a következő kör már tart tőled.","— ezt még a CRT is megkönnyezte.","— elegáns, gyors, könyörtelen.","— ma te írod a szabályokat.","— az érmék jó helyre kerültek.","— klasszikus arcade-pillanat.","— nagy tét, még nagyobb stílus."]},
  lose:{a:["Ajjaj!","Ez most csípett!","A gép visszavágott!","Majdnem megvolt!","A pixelek fellázadtak!","Fortuna kiment kávézni!","Ez a kör sunyi volt!","A kassza most nevetett!","Egy hajszálon múlt!","A neonfény most pislantott!","A pakli nem volt barátságos!","Kemény menet volt!"],b:["A szerencse rossz kijáratnál szállt le","A tét elgurult a gép alatt","Gubuntu most olvasta a gondolataid","A következő kör bosszút kíván","A kártyák titkos szövetséget kötöttek","A véletlengenerátor túl magabiztos lett","A stratégia jó volt, a végzet gyorsabb","A jackpot másik műszakban dolgozik","A gép most kapott egy pontot","A pixelek rossz sorrendben érkeztek","Az utolsó lépés tréfált meg","A szerencsemérő újrakalibrál"],c:["— fel a fejjel, jöhet a visszavágó!","— a következő már fél tőled.","— ezt írjuk a bemelegítéshez.","— legalább látványos volt.","— a rekordkönyv még nyitva van.","— egy érme néha csak tanulópénz.","— most már tudod, mit ne higgy el a paklinak.","— a gép nem ünnepelhet sokáig.","— innen szép fordítani.","— a bosszúkör mindig hangosabb.","— a neon hajnalig ég.","— még nincs vége a történetnek."]},
  jackpot:{a:["JACKPOT!","MEGA NYEREMÉNY!","LEGENDA SZÜLETETT!","A KASSZA KIÜRÜLT!","NEON CSODA!","TÖKÉLETES TALÁLAT!","A VÁROS FELÉBREDT!","PIXELVIHAR!"],b:["Minden szimbólum neked dolgozott","A valószínűség felmondott","Fortuna személyesen gratulál","A gép most szabadságot kér","Az érmék sorban állnak nálad","A jackpotkapu teljesen kinyílt","A rekordjelző füstöl","A szerencse maximumra tekerve"],c:["— ezt nehéz lesz felülmúlni!","— kezdődhet a konfettieső!","— az egész arcade hallotta.","— ma ingyen meséled a legendát.","— a nagy tét meghajolt előtted.","— ezt nevezik főnyereménynek.","— villogjon minden neon!","— hivatalosan is nagyágyú vagy."]}
};
function arcadeComment(kind="win"){const bank=commentaryBanks[kind]||commentaryBanks.win,pick=a=>a[Math.floor(Math.random()*a.length)];return `<blockquote class="arcade-comment">🎙️ ${pick(bank.a)} ${pick(bank.b)} ${pick(bank.c)}</blockquote>`;}
function wagerHtml(prefix,bet){return `<div class="wager-box"><span>TÉT:</span>${[5,25,50,100,250].map(n=>`<button class="bet-chip ${n===bet?"active":""}" data-wager="${n}">${n}</button>`).join("")}<input id="${prefix}-wager" class="wager-input" type="number" min="1" max="${Math.max(1,currentPlayer.coins)}" value="${bet}" aria-label="Egyedi tét"><button id="${prefix}-set" class="wager-set">OK</button><button id="${prefix}-all" class="wager-set all-in">ALL IN</button></div>`;}
function bindWager(prefix,setter){$$('[data-wager]').forEach(b=>b.onclick=()=>setter(+b.dataset.wager));$(`#${prefix}-set`).onclick=()=>setter(+$(`#${prefix}-wager`).value);$(`#${prefix}-all`).onclick=()=>setter(currentPlayer.coins);}
function safeBet(value){return Math.max(1,Math.min(Math.floor(Number(value)||1),Math.max(1,currentPlayer.coins)));}
function localDateKey(date=new Date()){const year=date.getFullYear(),month=String(date.getMonth()+1).padStart(2,"0"),day=String(date.getDate()).padStart(2,"0");return `${year}-${month}-${day}`;}
function todayKey(){return localDateKey();}
function dailyDefs(){
  return [
    {id:"play3",icon:"🕹️",title:"Melegíts be",desc:"Játssz le 3 teljes kört.",goal:3,field:"plays",reward:[35,20]},
    {id:"win2",icon:"🏆",title:"Dupla győzelem",desc:"Nyerj 2 játékot.",goal:2,field:"wins",reward:[55,30]},
    {id:"coins50",icon:"●",title:"Érmevadász",desc:"Keress ma 50 érmét.",goal:50,field:"coins",reward:[45,25]},
    {id:"openroad1",icon:"🏎️",title:"Országúti sztori",desc:"Teljesíts 1 OpenRoad biom-küldetést.",goal:1,field:"openroad",reward:[70,35]}
  ];
}
function ensureDaily(){
  const day=todayKey();
  if(!currentPlayer.daily||currentPlayer.daily.date!==day)currentPlayer.daily={date:day,plays:0,wins:0,coins:0,openroad:0,claimed:[]};
  currentPlayer.daily.claimed ||= [];
  return currentPlayer.daily;
}
function addDaily(field,amount=1){
  if(!currentPlayer)return;
  const daily=ensureDaily();daily[field]=(daily[field]||0)+amount;
  const completed=dailyDefs().filter(d=>(daily[d.field]||0)>=d.goal&&!daily.claimed.includes(d.id));
  completed.forEach(d=>{daily.claimed.push(d.id);currentPlayer.coins+=d.reward[0];currentPlayer.xp+=d.reward[1];toast(`NAPI KIHÍVÁS: ${d.title} • +${d.reward[0]} ÉRME`);});
}

let data = loadData();
let currentPlayer = null;
let activeGame = null;
let reactionTimer = null;
let activeCleanup = null;
let menuLifeCleanup = null;
let menuLifeApi = null;
let gameLifeCleanup = null;
let gameStartedAt = 0;
let audioCtx = null;
let uiSettings = (()=>{try{return JSON.parse(localStorage.getItem("gubuntu-ui-settings")||"{}");}catch{return {};}})();
let deferredInstallPrompt = null;
let swRegistration = null;
let appInstalled = window.matchMedia?.("(display-mode: standalone)").matches||window.navigator.standalone===true;
let menuQuery="";
let menuSort="recent";
let menuFilter="all";
let menuRafPaused=false;
let progressView="statistics";
let settingsView="visual";
let currentLaunchId=null;
let launchScreenOpen=false;
let gamePauseOpen=false;

// Capability-based device detection; manual choices always win.
const DEVICE_MODES=new Set(["auto","desktop","mobile"]);
const landscapeMobileGames=new Set(["openroad","salvager","starfarer","billiards","voidminer"]);
const mobileControlProfiles={
  openroad:{layout:"driving",labels:{action:"E",boost:"BOOST",brake:"BRAKE",gas:"GAS"}},
  salvager:{layout:"twinStick",labels:{action:"FIRE",action2:"DASH",interact:"USE"}},
  voidminer:{layout:"twinStick",labels:{action:"MINE",action2:"DASH",interact:"USE"}},
  snake:{layout:"dpad"},pac:{layout:"dpad"},fishing:{layout:"simple",labels:{action:"ACTION"}},
  reaction:{layout:"simple",labels:{action:"GO"}},towerdefense:{layout:"direct"},penalty:{layout:"direct"},
  billiards:{layout:"direct"},starfarer:{layout:"direct"},memory:{layout:"direct"},ttt:{layout:"direct"},
  slots:{layout:"direct"},blackjack:{layout:"direct"},poker:{layout:"direct"},dice:{layout:"direct"},
  guess:{layout:"direct"},rps:{layout:"direct"},quiz:{layout:"direct"},wreck:{layout:"direct"},chaosworks:{layout:"direct"}
};
const mobileInput={up:false,down:false,left:false,right:false,action:false,action2:false,fire:false,interact:false,boost:false,brake:false,pause:false,moveX:0,moveY:0,aimX:0,aimY:0,pointers:new Map(),resetters:new Set(),resetSerial:0};
let appliedDeviceMode=null,mountedMobileControlKey="",mobileViewportState={width:innerWidth,height:innerHeight,orientation:innerWidth>=innerHeight?"landscape":"portrait"},mobileLayoutTimer=0;
const deviceCapabilities=()=>{const coarse=matchMedia?.("(pointer: coarse)").matches===true,hoverless=matchMedia?.("(hover: none)").matches===true,touch=(navigator.maxTouchPoints||0)>0,small=Math.min(screen.width||innerWidth,screen.height||innerHeight)<820;return{coarse,hoverless,touch,small,mobile:(coarse&&hoverless&&touch)||(touch&&small)};};
const selectedDeviceMode=()=>DEVICE_MODES.has(uiSettings.deviceMode)?uiSettings.deviceMode:null;
const effectiveDeviceMode=()=>{const selected=selectedDeviceMode();return selected&&selected!=="auto"?selected:(deviceCapabilities().mobile?"mobile":"desktop");};
const isMobileMode=()=>effectiveDeviceMode()==="mobile";
const resolvedGraphicsProfile=()=>{
  const chosen=uiSettings.graphicsProfile||"auto";if(chosen!=="auto")return chosen;
  if(uiSettings.performanceMode)return"low";
  const memory=Number(navigator.deviceMemory||4),cores=Number(navigator.hardwareConcurrency||4),mobile=isMobileMode();
  if(memory<=3||cores<=4)return"low";
  if(mobile||memory<8||cores<8)return"medium";
  return"high";
};
const targetFrameInterval=()=>{const profile=resolvedGraphicsProfile();return profile==="low"?1000/30:profile==="medium"?1000/45:0;};
window.GubuntuPerf={profile:resolvedGraphicsProfile,targetFrameInterval};
function haptic(pattern=8){if(isMobileMode()&&uiSettings.vibration!==false&&navigator.vibrate)navigator.vibrate(pattern);}
function applyDeviceMode(){const mode=effectiveDeviceMode(),graphics=resolvedGraphicsProfile(),changed=mode!==appliedDeviceMode;document.body.dataset.deviceMode=mode;document.body.dataset.graphics=graphics;document.documentElement.classList.toggle("mobile-mode",mode==="mobile");document.documentElement.classList.toggle("desktop-mode",mode==="desktop");if(changed){releaseMobileInput();appliedDeviceMode=mode;mountedMobileControlKey="";syncMobileGameControls(activeGame);}else syncOrientationOverlay(activeGame);}
function setDeviceMode(mode,{closeSelector=true}={}){if(!DEVICE_MODES.has(mode))return;releaseMobileInput();uiSettings.deviceMode=mode;saveUiSettings();applyDeviceMode();renderSettings();if(closeSelector&&$("#device-dialog")?.open)$("#device-dialog").close();toast(`${effectiveDeviceMode().toUpperCase()} CONTROL MODE ACTIVE`);}
// Ask at every app start. A saved choice is retained after selection, but it
// must not silently prevent the player from switching devices on next launch.
function showDeviceSelectorIfNeeded(){const dialog=$("#device-dialog");if(dialog&&!dialog.open)openDialogAnimated(dialog);}

// Shared normalized input. Touch emits the keyboard actions legacy games already consume.
const actionKeys={up:"w",down:"s",left:"a",right:"d",action:" ",action2:"Shift",fire:" ",interact:"e",boost:"Shift",brake:"s",pause:"Escape"};
function emitNormalizedAction(action,pressed){if(!(action in mobileInput)||mobileInput[action]===pressed)return;mobileInput[action]=pressed;const key=actionKeys[action];if(key)window.dispatchEvent(new KeyboardEvent(pressed?"keydown":"keyup",{key,bubbles:true,cancelable:true}));}
function releaseMobileInput(){[...mobileInput.resetters].forEach(reset=>reset());Object.keys(actionKeys).forEach(action=>emitNormalizedAction(action,false));mobileInput.moveX=mobileInput.moveY=mobileInput.aimX=mobileInput.aimY=0;mobileInput.pointers.clear();mobileInput.resetSerial++;}
function bindTouchAction(button,action){
  if(action==="interact"){const reset=()=>button.classList.remove("pressed");mobileInput.resetters.add(reset);button.addEventListener("pointerdown",e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);button.classList.add("pressed");emitNormalizedAction(action,true);queueMicrotask(()=>emitNormalizedAction(action,false));haptic();});const clear=e=>{e.preventDefault();reset();};button.addEventListener("pointerup",clear);button.addEventListener("pointercancel",clear);button.addEventListener("lostpointercapture",clear);return;}
  const activePointers=new Set(),reset=()=>{activePointers.clear();emitNormalizedAction(action,false);button.classList.remove("pressed");},down=e=>{e.preventDefault();if(activePointers.size)return;activePointers.add(e.pointerId);button.setPointerCapture?.(e.pointerId);emitNormalizedAction(action,true);button.classList.add("pressed");haptic();},up=e=>{e.preventDefault();activePointers.delete(e.pointerId);if(!activePointers.size)reset();};mobileInput.resetters.add(reset);button.addEventListener("pointerdown",down);button.addEventListener("pointerup",up);button.addEventListener("pointercancel",up);button.addEventListener("lostpointercapture",up);
}
function makeTouchButton(action,label,className=""){const button=document.createElement("button");button.type="button";button.className=`mobile-action ${className}`;button.dataset.mobileAction=action;button.textContent=label;bindTouchAction(button,action);return button;}
function makeJoystick(kind="move",steering=false){
  const pad=document.createElement("div");pad.className=`mobile-joystick ${kind}`;pad.innerHTML='<i class="joystick-ring"></i><b class="joystick-thumb"></b>';
  const thumb=pad.querySelector("b"),actions=steering?["left","right"]:["left","right","up","down"],digital={left:false,right:false,up:false,down:false};let pointerId=null,geometry=null;
  const remap=value=>{const sign=Math.sign(value),magnitude=Math.abs(value),dead=.15,full=.9;if(magnitude<=dead)return 0;return sign*Math.min(1,(magnitude-dead)/(full-dead));};
  const digitalState=(action,value)=>{const magnitude=Math.abs(value),correctDirection=action==="left"||action==="up"?value<0:value>0,threshold=digital[action]?.16:.28,next=correctDirection&&magnitude>=threshold;if(next!==digital[action]){digital[action]=next;emitNormalizedAction(action,next);}};
  const update=e=>{if(!geometry)return;const {cx,cy,limit}=geometry,dx=e.clientX-cx,dy=e.clientY-cy,length=Math.hypot(dx,dy)||1,scale=Math.min(1,limit/length),rawX=dx*scale/limit,rawY=dy*scale/limit,x=remap(rawX),y=remap(rawY);thumb.style.transform=`translate(${rawX*limit}px,${rawY*limit}px)`;mobileInput[kind==="aim"?"aimX":"moveX"]=x;mobileInput[kind==="aim"?"aimY":"moveY"]=y;if(kind==="aim"||steering)return;digitalState("left",x);digitalState("right",x);digitalState("up",y);digitalState("down",y);};
  const reset=()=>{if(pointerId!==null)mobileInput.pointers.delete(pointerId);pointerId=null;geometry=null;thumb.style.transform="";Object.keys(digital).forEach(action=>digital[action]=false);if(kind!=="aim")actions.forEach(action=>emitNormalizedAction(action,false));mobileInput[kind==="aim"?"aimX":"moveX"]=0;mobileInput[kind==="aim"?"aimY":"moveY"]=0;pad.classList.remove("pressed");};mobileInput.resetters.add(reset);
  pad.addEventListener("pointerdown",e=>{if(pointerId!==null)return;e.preventDefault();const rect=pad.getBoundingClientRect();geometry={cx:rect.left+rect.width/2,cy:rect.top+rect.height/2,limit:rect.width*.38};pointerId=e.pointerId;mobileInput.pointers.set(e.pointerId,kind);pad.setPointerCapture?.(e.pointerId);pad.classList.add("pressed");haptic();update(e);});pad.addEventListener("pointermove",e=>{if(e.pointerId===pointerId)update(e);});const finish=e=>{if(e.pointerId!==undefined&&e.pointerId!==pointerId)return;reset();};pad.addEventListener("pointerup",finish);pad.addEventListener("pointercancel",finish);pad.addEventListener("lostpointercapture",finish);return pad;
}
function syncOrientationOverlay(gameId=activeGame){const overlay=$("#rotate-device-overlay");if(!overlay)return;overlay.hidden=!(isMobileMode()&&landscapeMobileGames.has(gameId)&&innerHeight>innerWidth);}
function commitMobileViewportLayout(){mobileViewportState={width:innerWidth,height:innerHeight,orientation:innerWidth>=innerHeight?"landscape":"portrait"};applyDeviceMode();applyDynamicGameLayout();syncOrientationOverlay();}
function handleStableViewportResize(){const orientation=innerWidth>=innerHeight?"landscape":"portrait",orientationChanged=orientation!==mobileViewportState.orientation,widthDelta=Math.abs(innerWidth-mobileViewportState.width),heightDelta=Math.abs(innerHeight-mobileViewportState.height);syncOrientationOverlay();if(isMobileMode()&&!orientationChanged&&widthDelta<64){mobileViewportState.height=innerHeight;return;}if(!isMobileMode()&&!orientationChanged&&widthDelta<8&&heightDelta<48)return;if(orientationChanged)releaseMobileInput();clearTimeout(mobileLayoutTimer);mobileLayoutTimer=setTimeout(commitMobileViewportLayout,orientationChanged?180:120);}
function handleMobileOrientationChange(){releaseMobileInput();clearTimeout(mobileLayoutTimer);mobileLayoutTimer=setTimeout(commitMobileViewportLayout,180);}
function syncMobileGameControls(gameId=activeGame){
  const layer=$("#mobile-control-layer");if(!layer)return;const profile=mobileControlProfiles[gameId]||{layout:"none"},key=`${effectiveDeviceMode()}:${gameId||"none"}:${profile.layout}`;document.body.dataset.mobileProfile=profile.layout;
  if(key===mountedMobileControlKey){syncOrientationOverlay(gameId);return;}
  releaseMobileInput();mobileInput.resetters.clear();mountedMobileControlKey=key;layer.replaceChildren();layer.className="mobile-control-layer";
  if(!isMobileMode()||!gameId||["none","direct"].includes(profile.layout)){layer.hidden=true;syncOrientationOverlay(gameId);return;}layer.hidden=false;layer.classList.add(`profile-${profile.layout}`);
  if(profile.layout==="driving"){layer.append(makeJoystick("move",true));const cluster=document.createElement("div");cluster.className="mobile-action-cluster driving-actions";cluster.append(makeTouchButton("brake",profile.labels.brake,"brake"),makeTouchButton("boost",profile.labels.boost,"boost"),makeTouchButton("interact",profile.labels.action,"interact"),makeTouchButton("up",profile.labels.gas,"gas"));layer.append(cluster);}
  else if(profile.layout==="twinStick"){layer.append(makeJoystick("move"),makeJoystick("aim"));const cluster=document.createElement("div");cluster.className="mobile-action-cluster shooter-actions";cluster.append(makeTouchButton("fire",profile.labels.action,"fire"),makeTouchButton("boost",profile.labels.action2,"dash"),makeTouchButton("interact",profile.labels.interact,"interact"));layer.append(cluster);}
  else if(profile.layout==="dpad"){const pad=document.createElement("div");pad.className="mobile-dpad";[["up","▲"],["left","◀"],["right","▶"],["down","▼"]].forEach(([action,label])=>pad.append(makeTouchButton(action,label,action)));layer.append(pad);}
  else if(profile.layout==="simple")layer.append(makeTouchButton("action",profile.labels.action,"simple-action"));syncOrientationOverlay(gameId);
}
function setActiveCleanup(fn){
  const previous=activeCleanup;
  activeCleanup=()=>{
    if(previous){try{previous();}catch(err){console.error("Game cleanup failed",err);}}
    if(fn){try{fn();}catch(err){console.error("Game cleanup failed",err);}}
  };
}
function runActiveGameCleanup(){
  clearTimeout(reactionTimer);reactionTimer=null;
  if(gameStartedAt&&currentPlayer&&activeGame){const elapsed=Math.max(0,Date.now()-gameStartedAt);currentPlayer.playTimeMs=(currentPlayer.playTimeMs||0)+elapsed;currentPlayer.gameStats ||= {};const timed=currentPlayer.gameStats[activeGame]||={plays:0,wins:0,losses:0,draws:0,best:null};timed.timeMs=(timed.timeMs||0)+elapsed;gameStartedAt=0;saveData();}
  const cleanup=activeCleanup;activeCleanup=null;activeGame=null;
  if(cleanup){try{cleanup();}catch(err){console.error("Active game cleanup failed",err);}}
  if(gameLifeCleanup){try{gameLifeCleanup();}catch(err){console.error("Game backdrop cleanup failed",err);}gameLifeCleanup=null;}
  releaseMobileInput();syncMobileGameControls(null);
  setMenuPaused(false);
}
function reportRuntimeError(message,error){
  console.error(`[Gubuntu v${APP_VERSION} build ${BUILD_NUMBER}] ${message}`,error);
  try{toast("RENDSZERHIBA: visszatérés a főmenübe");runActiveGameCleanup();}catch(err){console.error("Error recovery failed",err);}
}
const reduceMotion=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
function pulseEl(el,cls="ui-pulse"){if(!el||reduceMotion())return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),520);}
function pixelBurst(x,y,color="#31f5ff"){
  if(reduceMotion()||resolvedGraphicsProfile()==="low")return;
  const host=document.createElement("span");host.className="pixel-burst";host.style.left=`${x}px`;host.style.top=`${y}px`;host.style.setProperty("--burst",color);document.body.appendChild(host);
  setTimeout(()=>host.remove(),620);
}
function setMenuPaused(paused){menuRafPaused=paused;document.body.classList.toggle("menu-paused",paused);}
function updateTopbarCompact(){document.body.classList.toggle("topbar-compact",window.scrollY>80);}
function syncModalScrollLock(){const locked=Boolean(document.querySelector("dialog[open]"));document.documentElement.classList.toggle("modal-open",locked);document.body.classList.toggle("modal-open",locked);}
function openDialogAnimated(dialog,opener=document.activeElement){if(!dialog)return;dialog.dataset.returnFocusId=opener?.id||"";if(dialog.open){dialog.focus?.();syncModalScrollLock();return;}dialog.classList.remove("dialog-leaving");dialog.classList.add("dialog-entering");try{dialog.showModal();syncModalScrollLock();}catch(err){console.error("Dialog open failed",err);return;}requestAnimationFrame(()=>dialog.classList.remove("dialog-entering"));}
function closeDialogAnimated(dialog){if(!dialog?.open)return;if(reduceMotion()){dialog.close();syncModalScrollLock();return;}dialog.classList.add("dialog-leaving");setTimeout(()=>{dialog.classList.remove("dialog-leaving");if(dialog.open)dialog.close();syncModalScrollLock();},180);}


function saveUiSettings(){try{localStorage.setItem("gubuntu-ui-settings",JSON.stringify(uiSettings));}catch(err){console.warn("UI settings save failed",err);}}
function soundEnabled(){return uiSettings.sound!==false;}
function tone(freq=440,duration=.08,type="square",gain=.035,delay=0){
  if(!soundEnabled())return;
  try{
    audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
    const t=audioCtx.currentTime+delay,osc=audioCtx.createOscillator(),amp=audioCtx.createGain();gain*=Math.max(0,Math.min(1,Number(uiSettings.masterVolume??80)/100));
    osc.type=type;osc.frequency.setValueAtTime(freq,t);amp.gain.setValueAtTime(0,t);amp.gain.linearRampToValueAtTime(gain,t+.01);amp.gain.exponentialRampToValueAtTime(.0001,t+duration);
    osc.connect(amp);amp.connect(audioCtx.destination);osc.start(t);osc.stop(t+duration+.02);
  }catch{}
}
function sfx(kind="click"){
  const bank={click:[[620,.045,"square",.018]],coin:[[740,.05,"square",.025],[980,.06,"square",.02,.05]],win:[[523,.08,"triangle",.03],[659,.08,"triangle",.03,.08],[784,.12,"triangle",.035,.16]],lose:[[220,.12,"sawtooth",.025],[155,.16,"sawtooth",.02,.11]],combo:[[880,.05,"square",.025],[1320,.08,"square",.018,.04]],boost:[[180,.08,"sawtooth",.025],[360,.18,"sawtooth",.02,.05]],save:[[320,.06,"triangle",.025],[520,.1,"triangle",.02,.07]],goal:[[660,.06,"square",.03],[990,.11,"square",.026,.07]],boot:[[180,.08,"sawtooth",.018],[360,.06,"square",.014,.13],[540,.08,"triangle",.018,.29]]};
  (bank[kind]||bank.click).forEach(args=>tone(...args));
}
function bootSfx(id){
  const bank={
    starfarer:[[220,.12,"sine",.02],[330,.09,"triangle",.018,.16],[660,.14,"sine",.016,.34],[880,.08,"triangle",.012,.58]],
    openroad:[[110,.18,"sawtooth",.028],[165,.16,"sawtooth",.022,.18],[330,.07,"square",.018,.45],[440,.08,"square",.014,.62]],
    fishing:[[294,.13,"sine",.016],[392,.13,"sine",.014,.2],[196,.18,"triangle",.012,.48],[523,.08,"sine",.012,.72]],
    wreck:[[140,.09,"square",.024],[120,.09,"square",.024,.14],[90,.16,"sawtooth",.022,.31],[420,.05,"square",.014,.55]],
    slots:[[740,.06,"square",.02],[988,.06,"square",.02,.09],[1244,.08,"square",.018,.18],[523,.12,"triangle",.018,.42]],
    blackjack:[[330,.08,"triangle",.017],[440,.08,"triangle",.017,.12],[554,.12,"triangle",.015,.28]],
    poker:[[262,.08,"triangle",.017],[330,.08,"triangle",.017,.12],[494,.12,"triangle",.015,.28]],
    snake:[[330,.05,"square",.018],[392,.05,"square",.018,.08],[494,.07,"square",.016,.16],[262,.1,"square",.014,.36]],
    pac:[[523,.05,"square",.018],[659,.05,"square",.018,.08],[784,.05,"square",.018,.16],[392,.08,"square",.014,.32]]
  };
  (bank[id]||bank.boot||[[220,.08,"square",.016],[440,.08,"square",.014,.16],[660,.1,"triangle",.014,.34]]).forEach(args=>tone(...args));
}
function applySoundButton(){
  const btn=$("#toggle-sound");if(!btn)return;
  btn.innerHTML=`${soundEnabled()?"🔊":"🔇"} <span>HANG</span>`;
  btn.classList.toggle("muted",!soundEnabled());
}
function applyDialogSize(){
  applyDynamicGameLayout();
}
function applyFontSize(){
  applyDynamicGameLayout();
}
function applyDynamicGameLayout(){
  const dialog=$("#game-dialog");if(!dialog)return;
  const width=Math.max(320,window.innerWidth),height=Math.max(480,window.innerHeight),compact=width<640||height<620;
  const scale=Math.max(.78,Math.min(1.16,Math.min(width/1180,height/860)));
  const fontScale=Math.max(1.12,Math.min(1.46,width/880));
  const uiTextScale=Math.max(1.08,Math.min(1.38,width/1400));
  document.documentElement.style.setProperty("--ui-text-scale",uiTextScale.toFixed(3));
  dialog.classList.remove("size-compact","size-normal","size-wide","size-fullscreen","font-small","font-normal","font-large","font-huge");
  dialog.classList.toggle("dynamic-compact",compact);dialog.style.setProperty("--game-scale",scale.toFixed(3));dialog.style.setProperty("--font-scale",fontScale.toFixed(3));dialog.style.setProperty("--sf-font",Math.max(1.12,Math.min(1.42,fontScale)).toFixed(3));
  requestAnimationFrame(()=>window.dispatchEvent(new Event("game-layout-resize")));
}
function applyShopFontSize(){
  const dialog=$("#shop-dialog");if(!dialog)return;
  const size=uiSettings.shopFontSize||uiSettings.fontSize||"normal";
  dialog.classList.remove("font-small","font-normal","font-large","font-huge");
  dialog.classList.add(`font-${size}`);
  $$("[data-shop-font-size]").forEach(btn=>btn.classList.toggle("active",btn.dataset.shopFontSize===size));
}

function readBackups(){
  try{
    const list=JSON.parse(localStorage.getItem(backupKey)||"[]");
    return Array.isArray(list)?list.filter(b=>b&&validSaveShape(b.data)).slice(0,5):[];
  }catch(err){console.warn("Save backup read failed",err);return [];}
}
function validSaveShape(raw){return raw&&typeof raw==="object"&&Array.isArray(raw.profiles);}
function saveFingerprint(raw){
  try{return JSON.stringify({version:Number(raw?.version)||0,profiles:Array.isArray(raw?.profiles)?raw.profiles:[]});}
  catch{return "";}
}
function loadData(){
  try {
    const parsed=JSON.parse(localStorage.getItem(storeKey)) || {profiles:[]};
    if(!validSaveShape(parsed))throw new Error("bad save shape");
    return migrateData(parsed);
  } catch {
    const backup=readBackups().map(b=>b.data).find(validSaveShape);
    if(backup)return migrateData(backup);
    return {version:saveVersion,profiles:[]};
  }
}
function normalizePlayer(p,index=0){
  const fallbackId=`player-${Date.now()}-${index}`;
  p=p&&typeof p==="object"?p:{};
  const defaults=makeDefaultPlayer({id:fallbackId,name:`Játékos ${index+1}`,seasonId:BATTLE_PASS_SEASON.id});
  const objectProgress=["gameStats","openRoadMissions","activity","equipped","launchPrefs","tuning","openRoadGarage","openRoadJobs","tdProgress","cardLounge","fishing","salvager","voidMiner","starfarer","chaosWorks","subscription","battlePass"];
  const arrayProgress=["inventory","achievements","favorites","vehicles","secrets"];
  objectProgress.forEach(key=>{if(!p[key]||typeof p[key]!=="object"||Array.isArray(p[key]))p[key]=defaults[key]});
  arrayProgress.forEach(key=>{if(!Array.isArray(p[key]))p[key]=defaults[key]});
  mergeMissingDefaults(p,defaults);
  p.id=safeProfileId(p.id,fallbackId);
  p.name=String(p.name||`Játékos ${index+1}`).slice(0,40);
  p.coins=Math.max(0,Math.floor(Number(p.coins)||0));
  p.xp=Math.max(0,Math.floor(Number(p.xp)||0));
  p.plays=Math.max(0,Math.floor(Number(p.plays)||0));
  p.totalWins=Math.max(0,Math.floor(Number(p.totalWins)||0));
  p.totalLosses=Math.max(0,Math.floor(Number(p.totalLosses)||0));
  p.currentStreak=Math.max(0,Math.floor(Number(p.currentStreak)||0));
  p.bestStreak=Math.max(p.currentStreak,Math.max(0,Math.floor(Number(p.bestStreak)||0)));
  p.inventory=[...new Set(Array.isArray(p.inventory)?p.inventory.filter(Boolean):[])];
  p.achievements=[...new Set(Array.isArray(p.achievements)?p.achievements.filter(Boolean):[])];
  p.favorites=[...new Set(Array.isArray(p.favorites)?p.favorites.filter(id=>games.some(g=>g.id===id)):[])];
  p.gameStats=p.gameStats&&typeof p.gameStats==="object"?p.gameStats:{};
  Object.keys(p.gameStats).forEach(id=>{const s=p.gameStats[id]&&typeof p.gameStats[id]==="object"?p.gameStats[id]:{};s.plays=Math.max(0,Math.floor(Number(s.plays)||0));s.wins=Math.max(0,Math.floor(Number(s.wins)||0));s.losses=Math.max(0,Math.floor(Number(s.losses)||0));if(s.best!=null&&!Number.isFinite(Number(s.best)))delete s.best;p.gameStats[id]=s;});
  p.openRoadMissions=p.openRoadMissions&&typeof p.openRoadMissions==="object"?p.openRoadMissions:{};
  p.vehicles=[...new Set(p.vehicles.filter(value=>typeof value==="string"))];if(!p.vehicles.includes("compact"))p.vehicles.unshift("compact");
  p.secrets=[...new Set(p.secrets.filter(value=>typeof value==="string"))];
  p.tuning=p.tuning&&typeof p.tuning==="object"&&!Array.isArray(p.tuning)?p.tuning:{};
  p.openRoadGarage=p.openRoadGarage&&typeof p.openRoadGarage==="object"&&!Array.isArray(p.openRoadGarage)?p.openRoadGarage:{};
  p.openRoadJobs=p.openRoadJobs&&typeof p.openRoadJobs==="object"&&!Array.isArray(p.openRoadJobs)?p.openRoadJobs:{};
  p.openRoadJobs.completed=Math.max(0,Math.floor(Number(p.openRoadJobs.completed)||0));p.openRoadJobs.gold=Math.max(0,Math.floor(Number(p.openRoadJobs.gold)||0));p.openRoadJobs.bestRatings=p.openRoadJobs.bestRatings&&typeof p.openRoadJobs.bestRatings==="object"?p.openRoadJobs.bestRatings:{};
  p.tdProgress=p.tdProgress&&typeof p.tdProgress==="object"?p.tdProgress:{};p.tdProgress.xp=Math.max(0,Number(p.tdProgress.xp)||0);p.tdProgress.level=Math.max(1,1+Math.floor(p.tdProgress.xp/180));p.tdProgress.unlockedMaps=[...new Set(["neon",...(Array.isArray(p.tdProgress.unlockedMaps)?p.tdProgress.unlockedMaps:[])])];p.tdProgress.unlockedLoadouts=[...new Set(["standard",...(Array.isArray(p.tdProgress.unlockedLoadouts)?p.tdProgress.unlockedLoadouts:[])])];p.tdProgress.completedContracts=[...new Set(Array.isArray(p.tdProgress.completedContracts)?p.tdProgress.completedContracts:[])];p.tdProgress.bestScores=p.tdProgress.bestScores&&typeof p.tdProgress.bestScores==="object"?p.tdProgress.bestScores:{};
  p.cardLounge=p.cardLounge&&typeof p.cardLounge==="object"?p.cardLounge:{};
  p.cardLounge.reputation=Math.max(0,Math.floor(Number(p.cardLounge.reputation)||0));
  p.cardLounge.level=Math.max(1,1+Math.floor(p.cardLounge.reputation/100));
  p.cardLounge.tablesUnlocked=[...new Set(["casual",...(Array.isArray(p.cardLounge.tablesUnlocked)?p.cardLounge.tablesUnlocked:[])])];
  if(p.cardLounge.level>=2&&!p.cardLounge.tablesUnlocked.includes("neon"))p.cardLounge.tablesUnlocked.push("neon");
  if(p.cardLounge.level>=4&&!p.cardLounge.tablesUnlocked.includes("vip"))p.cardLounge.tablesUnlocked.push("vip");
  p.cardLounge.dailyProfit=Number(p.cardLounge.dailyProfit)||0;p.cardLounge.bestSession=Math.max(0,Number(p.cardLounge.bestSession)||0);
  p.cardLounge.repToday=Math.max(0,Math.min(100,Number(p.cardLounge.repToday)||0));p.cardLounge.repDay=typeof p.cardLounge.repDay==="string"?p.cardLounge.repDay:"";
  p.cardLounge.dailyRepClaims=[...new Set(Array.isArray(p.cardLounge.dailyRepClaims)?p.cardLounge.dailyRepClaims.filter(value=>typeof value==="string"):[])];
  p.cardLounge.contractProgress=p.cardLounge.contractProgress&&typeof p.cardLounge.contractProgress==="object"?p.cardLounge.contractProgress:{};
  p.cardLounge.completedContracts=[...new Set(Array.isArray(p.cardLounge.completedContracts)?p.cardLounge.completedContracts:[])];
  p.cardLounge.cosmetics=[...new Set(Array.isArray(p.cardLounge.cosmetics)?p.cardLounge.cosmetics:[])];
  p.daily=p.daily&&typeof p.daily==="object"?p.daily:null;
  if(p.daily){p.daily.claimed=[...new Set(Array.isArray(p.daily.claimed)?p.daily.claimed:[])];["plays","wins","coins","openroad"].forEach(k=>p.daily[k]=Math.max(0,Math.floor(Number(p.daily[k])||0)));}
  p.lastGame=games.some(g=>g.id===p.lastGame)?p.lastGame:null;
  p.lastPlayedAt=p.lastPlayedAt&&Number.isFinite(Date.parse(p.lastPlayedAt))?p.lastPlayedAt:null;
  p.playTimeMs=Math.max(0,Number(p.playTimeMs)||0);
  p.coinsEarned=Math.max(0,Number(p.coinsEarned)||0);
  p.activity=p.activity&&typeof p.activity==="object"?p.activity:{};
  p.equipped=p.equipped&&typeof p.equipped==="object"?p.equipped:{};
  p.launchPrefs=p.launchPrefs&&typeof p.launchPrefs==="object"&&!Array.isArray(p.launchPrefs)?p.launchPrefs:{};
  p.fishing=p.fishing&&typeof p.fishing==="object"?p.fishing:{};p.fishing.rod=Math.max(1,Math.min(20,Number(p.fishing.rod)||1));p.fishing.bait=Math.max(1,Math.min(20,Number(p.fishing.bait)||1));["total","sold","bestValue"].forEach(key=>p.fishing[key]=Math.max(0,Number(p.fishing[key])||0));p.fishing.bucket=Array.isArray(p.fishing.bucket)?p.fishing.bucket:[];p.fishing.dex=p.fishing.dex&&typeof p.fishing.dex==="object"?p.fishing.dex:{};p.fishing.shop=p.fishing.shop&&typeof p.fishing.shop==="object"?p.fishing.shop:{};p.fishing.area=typeof p.fishing.area==="string"?p.fishing.area:"pond";
  p.starfarer=p.starfarer&&typeof p.starfarer==="object"?p.starfarer:{};["atlas","favorites","colonies","transmissions","eventLog","galacticNews","bridgeChoices"].forEach(key=>p.starfarer[key]=Array.isArray(p.starfarer[key])?p.starfarer[key]:[]);["upgrades","inventory","missions","codex","factions","market","living","consequence","research"].forEach(key=>p.starfarer[key]=p.starfarer[key]&&typeof p.starfarer[key]==="object"&&!Array.isArray(p.starfarer[key])?p.starfarer[key]:defaults.starfarer[key]);p.starfarer.fuel=Math.max(0,Number(p.starfarer.fuel)||0);p.starfarer.resources=Math.max(0,Number(p.starfarer.resources)||0);p.starfarer.totalScans=Math.max(0,Number(p.starfarer.totalScans)||0);p.starfarer.bestValue=Math.max(0,Number(p.starfarer.bestValue)||0);p.starfarer.sector=typeof p.starfarer.sector==="string"?p.starfarer.sector:"inner";
  p.chaosWorks=normalizeChaosWorksState(p.chaosWorks);
  p.salvager=p.salvager&&typeof p.salvager==="object"?p.salvager:{};
  p.salvager.scrap=Math.max(0,Math.floor(Number(p.salvager.scrap)||0));
  p.salvager.xp=Math.max(0,Math.floor(Number(p.salvager.xp)||0));
  p.salvager.level=Math.max(1,1+Math.floor(p.salvager.xp/120));
  p.salvager.unlocks=[...new Set(["pistol",...(Array.isArray(p.salvager.unlocks)?p.salvager.unlocks:[])])];
  p.salvager.securedInventory=Array.isArray(p.salvager.securedInventory)?p.salvager.securedInventory.slice(-60):[];
  p.salvager.weapon=p.salvager.unlocks.includes(p.salvager.weapon)?p.salvager.weapon:"pistol";
  p.salvager.gadget=p.salvager.unlocks.includes(p.salvager.gadget)?p.salvager.gadget:"none";
  p.salvager.skin=["ion-blue","breach-orange","neon-rail","cryo-core","void-pulse","bio-lens"].includes(p.salvager.skin)?p.salvager.skin:"ion-blue";
  ["runs","extractions","deaths","bestScrap","bestDepth","bosses","logsFound","objectivesCompleted","secretRooms"].forEach(key=>p.salvager[key]=Math.max(0,Math.floor(Number(p.salvager[key])||0)));
  p.salvager.bossKillsByType=p.salvager.bossKillsByType&&typeof p.salvager.bossKillsByType==="object"?p.salvager.bossKillsByType:{};
  ["mira","colossus","stalker"].forEach(key=>p.salvager.bossKillsByType[key]=Math.max(0,Math.floor(Number(p.salvager.bossKillsByType[key])||0)));
  p.salvager.fastestBossKill=Math.max(0,Number(p.salvager.fastestBossKill)||0);p.salvager.noDamageBossKills=Math.max(0,Math.floor(Number(p.salvager.noDamageBossKills)||0));
  p.voidMiner=p.voidMiner&&typeof p.voidMiner==="object"?p.voidMiner:{};
  p.voidMiner.credits=Math.max(0,Math.floor(Number(p.voidMiner.credits)||0));
  p.voidMiner.upgrades=p.voidMiner.upgrades&&typeof p.voidMiner.upgrades==="object"?p.voidMiner.upgrades:{};
  ["drill","battery","cargo","suit","light","scanner","mobility"].forEach(key=>p.voidMiner.upgrades[key]=Math.max(0,Math.min(4,Math.floor(Number(p.voidMiner.upgrades[key])||0))));
  p.voidMiner.stats=p.voidMiner.stats&&typeof p.voidMiner.stats==="object"?p.voidMiner.stats:{};
  ["runs","extractions","failedRuns","deepestDepth","totalValue","blocksMined","artifactsFound","fullCargoExtractions"].forEach(key=>p.voidMiner.stats[key]=Math.max(0,Math.floor(Number(p.voidMiner.stats[key])||0)));
  p.voidMiner.discoveries=p.voidMiner.discoveries&&typeof p.voidMiner.discoveries==="object"?p.voidMiner.discoveries:{};
  ["resources","creatures","zones","artifacts","rooms","logs"].forEach(key=>p.voidMiner.discoveries[key]=[...new Set(Array.isArray(p.voidMiner.discoveries[key])?p.voidMiner.discoveries[key].filter(value=>typeof value==="string"):[])]);
  p.voidMiner.artifacts=[...new Set(Array.isArray(p.voidMiner.artifacts)?p.voidMiner.artifacts.filter(value=>typeof value==="string"):[])];
  p.subscription=p.subscription&&typeof p.subscription==="object"?p.subscription:{};
  p.subscription.plan=p.subscription.plan==="premium"?"premium":"free";
  p.subscription.status=p.subscription.plan==="premium"&&p.subscription.status!=="cancelled"?"active":p.subscription.status==="cancelled"?"cancelled":"free";
  p.subscription.autoRenew=p.subscription.plan==="premium"&&p.subscription.status==="active"&&p.subscription.autoRenew!==false;
  p.battlePass=p.battlePass&&typeof p.battlePass==="object"?p.battlePass:{};
  if(p.battlePass.seasonId!==BATTLE_PASS_SEASON.id)p.battlePass={seasonId:BATTLE_PASS_SEASON.id,xp:0,claimedFree:[],claimedPremium:[]};
  p.battlePass.xp=Math.max(0,Math.floor(Number(p.battlePass.xp)||0));
  p.battlePass.claimedFree=[...new Set(Array.isArray(p.battlePass.claimedFree)?p.battlePass.claimedFree.map(Number).filter(Number.isFinite):[])];
  p.battlePass.claimedPremium=[...new Set(Array.isArray(p.battlePass.claimedPremium)?p.battlePass.claimedPremium.map(Number).filter(Number.isFinite):[])];
  p.color=allowedProfileColors.has(p.color)?p.color:"#31f5ff";
  p.avatar=allowedProfileAvatars.has(p.avatar)?p.avatar:"👾";
  p.rank=rankOf(p);
  return p;
}
function migrateData(raw){
  const profiles=Array.isArray(raw?.profiles)?raw.profiles.map(normalizePlayer):[];
  return {version:saveVersion,appVersion:APP_VERSION,build:BUILD_NUMBER,savedAt:raw?.savedAt||new Date().toISOString(),profiles};
}
function saveData(){
  data=migrateData(data);data.version=saveVersion;data.appVersion=APP_VERSION;data.build=BUILD_NUMBER;data.savedAt=new Date().toISOString();
  const nextString=JSON.stringify(data);
  const backups=readBackups();
  try{
    const current=localStorage.getItem(storeKey);
    if(current){
      const parsed=JSON.parse(current);
      const currentPrint=saveFingerprint(parsed),nextPrint=saveFingerprint(data),topPrint=saveFingerprint(backups[0]?.data);
      if(validSaveShape(parsed)&&currentPrint&&currentPrint!==nextPrint&&currentPrint!==topPrint){
        backups.unshift({savedAt:parsed.savedAt||new Date().toISOString(),data:parsed});
      }
    }
  }catch(err){console.warn("Current save could not be backed up",err);}
  try{
    localStorage.setItem(backupKey,JSON.stringify(backups.slice(0,5)));
    localStorage.setItem(storeKey,nextString);
  }catch(err){console.error("Save failed",err);toast("MENTÉS HIBA: a böngésző tárhelye nem írható");}
}
function esc(value){ const node=document.createElement("div"); node.textContent=value; return node.innerHTML; }
function directionPad(){return `<div class="dpad" role="group" aria-label="Irányvezérlés"><button type="button" data-dir="up" aria-label="Fel">↑</button><button type="button" data-dir="left" aria-label="Balra">←</button><button type="button" data-dir="down" aria-label="Le">↓</button><button type="button" data-dir="right" aria-label="Jobbra">→</button></div>`;}
function bindDirections(onDirection){
  const keyMap={ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"};
  const keyHandler=e=>{const direction=keyMap[e.key];if(!direction)return;e.preventDefault();onDirection(direction)};
  const buttons=$$(".dpad [data-dir]"),handlers=buttons.map(button=>{const handler=e=>{e.preventDefault();onDirection(button.dataset.dir)};button.addEventListener("pointerdown",handler);return [button,handler]});
  window.addEventListener("keydown",keyHandler);
  return ()=>{window.removeEventListener("keydown",keyHandler);handlers.forEach(([button,handler])=>button.removeEventListener("pointerdown",handler))};
}
function toast(message){
  const el=$("#toast"),topDialog=$$("dialog[open]").at(-1);
  (topDialog||document.body).appendChild(el);el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);
  toast.timer=setTimeout(()=>{el.classList.remove("show");setTimeout(()=>{if(!el.classList.contains("show"))document.body.appendChild(el);},260);},2200);
}
function setStage(html){$("#game-stage").innerHTML=html;}
function resetGameViewport(){
  const dialog=$("#game-dialog"),stage=$("#game-stage"),playfield=$(".game-playfield");
  [dialog,stage,playfield].forEach(element=>{if(element){element.scrollTop=0;element.scrollLeft=0;}});
}
function menuBgPalettes(){
  return {
    retro:["#31f5ff","#ff3eb5","#ffe84c","#72ff77","#8e5bff"],
    dystopic:["#ff5964","#b47cff","#7df9ff","#77869e","#ffe66d"],
    modern:["#7df9ff","#f8f4ff","#8fb3ff","#72ffb0","#d8e4ff"],
    space:["#7df9ff","#b47cff","#ffe66d","#ff8bd1","#8fb3ff"],
    sunset:["#ff7043","#ffe66d","#ff3eb5","#8e5bff","#31f5ff"]
  };
}
function menuBgStyle(){return uiSettings.menuBgStyle||"retro";}
function menuBgPalette(){return menuBgPalettes()[menuBgStyle()]||menuBgPalettes().retro;}
function applyMenuBgStyle(){
  const style=menuBgStyle();
  document.body.classList.remove("bgstyle-retro","bgstyle-dystopic","bgstyle-modern","bgstyle-space","bgstyle-sunset");
  document.body.classList.add(`bgstyle-${style}`);
  $$('[data-bg-style]').forEach(btn=>{const on=btn.dataset.bgStyle===style;btn.classList.toggle("active",on);btn.setAttribute("aria-pressed",String(on));});
  menuLifeApi?.setStyle?.(style);
}
function applyUiSettings(){
  document.body.classList.toggle("crt-disabled",uiSettings.crt===false);
  document.body.classList.toggle("background-disabled",uiSettings.backgroundAnimation===false);
  document.body.classList.toggle("performance-mode",uiSettings.performanceMode===true);
  document.body.classList.toggle("motion-low",Number(uiSettings.motionIntensity??70)<=20);
  document.documentElement.style.setProperty("--particle-density",String((uiSettings.particleCount??60)/100));
  document.body.dataset.cabinetSkin=currentPlayer?.equipped?.cabinet||"";
  document.body.dataset.frame=currentPlayer?.equipped?.frame||"";
  document.body.dataset.soundPack=currentPlayer?.equipped?.soundPack||"";
  applySoundButton();applyDialogSize();applyFontSize();applyMenuBgStyle();applyDeviceMode();
  menuLifeApi?.setMode?.(uiSettings.menuBgMode||"life");menuLifeApi?.refresh?.();
}


function startMenuLife(){
  if(menuLifeCleanup)return;
  const canvas=$("#menu-life");if(!canvas)return;
  const ctx=canvas.getContext("2d"),cell=12;let colors=menuBgPalette();
  let cols=0,rows=0,grid=[],next=[],particles=[],running=true,raf=0,last=0,lastPaint=0,paint=false,hue=0,mode=uiSettings.menuBgMode||"life",modeTick=0,snake=[],food=null,pong={x:80,y:80,vx:3,vy:2.4},traffic=[],stars=[],matrix=[],radar=0;
  const idx=(x,y)=>y*cols+x;
  const seed=()=>{
    grid=Array(cols*rows).fill(0);next=Array(cols*rows).fill(0);
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(Math.random()<.13||((x+y)%17===0&&Math.random()<.45))grid[idx(x,y)]=1+Math.floor(Math.random()*colors.length);
    [["glider",4,5],["blinker",Math.floor(cols*.72),Math.floor(rows*.32)],["block",Math.floor(cols*.22),Math.floor(rows*.64)]].forEach(([type,x,y])=>{
      const pts=type==="glider"?[[1,0],[2,1],[0,2],[1,2],[2,2]]:type==="blinker"?[[0,0],[1,0],[2,0]]:[[0,0],[1,0],[0,1],[1,1]];
      pts.forEach(([dx,dy])=>{if(x+dx<cols&&y+dy<rows)grid[idx(x+dx,y+dy)]=1+((dx+dy)%colors.length);});
    });
  };
  const resize=()=>{const rect=canvas.getBoundingClientRect(),profile=resolvedGraphicsProfile(),scale=profile==="high"?.75:profile==="medium"?.5:.35;canvas.width=Math.max(240,Math.floor(rect.width*scale));canvas.height=Math.max(180,Math.floor(rect.height*scale));cols=Math.ceil(canvas.width/cell);rows=Math.ceil(canvas.height/cell);resetMode();seed();};
  const burst=(clientX,clientY,big=false)=>{
    const rect=canvas.getBoundingClientRect(),scaleX=canvas.width/Math.max(1,rect.width),scaleY=canvas.height/Math.max(1,rect.height),localX=(clientX-rect.left)*scaleX,localY=(clientY-rect.top)*scaleY,gx=Math.floor(localX/cell),gy=Math.floor(localY/cell),r=big?4:2;
    for(let y=gy-r;y<=gy+r;y++)for(let x=gx-r;x<=gx+r;x++)if(x>=0&&y>=0&&x<cols&&y<rows&&Math.hypot(x-gx,y-gy)<=r+.3)grid[idx(x,y)]=1+((x+y+hue)%colors.length);
    for(let i=0;i<Math.round((big?18:8)*Number(uiSettings.particleCount??60)/60);i++)particles.push({x:localX,y:localY,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,life:24+Math.random()*20,color:colors[(hue+i)%colors.length]});
    hue=(hue+1)%colors.length;
  };
  const step=()=>{
    let live=0;
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      let n=0,c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const xx=(x+dx+cols)%cols,yy=(y+dy+rows)%rows,v=grid[idx(xx,yy)];if(v){n++;c+=v;}}
      const me=grid[idx(x,y)];next[idx(x,y)]=me?(n===2||n===3?me:0):(n===3?Math.max(1,Math.round(c/3)%colors.length):0);if(next[idx(x,y)])live++;
    }
    [grid,next]=[next,grid];if(live<18)seed();
  };
  const resetMode=()=>{
    snake=[{x:Math.floor(cols*.18),y:Math.floor(rows*.52)},{x:Math.floor(cols*.18)-1,y:Math.floor(rows*.52)},{x:Math.floor(cols*.18)-2,y:Math.floor(rows*.52)}];
    food={x:Math.floor(cols*.72),y:Math.floor(rows*.42)};
    pong={x:canvas.width*.34,y:canvas.height*.36,vx:3.2,vy:2.35};
    traffic=Array.from({length:12},(_,i)=>({x:Math.random()*canvas.width,y:i/12*canvas.height,lane:i%4,color:colors[i%colors.length],speed:.8+Math.random()*1.9}));
    stars=Array.from({length:90},(_,i)=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,z:.35+Math.random()*1.8,color:colors[i%colors.length]}));
    matrix=Array.from({length:Math.max(18,Math.floor(canvas.width/28))},(_,i)=>({x:i*28+Math.random()*12,y:Math.random()*canvas.height,speed:1+Math.random()*3,glyph:Math.floor(Math.random()*10)}));
    radar=0;
  };
  const stepMode=()=>{
    modeTick++;
    if(mode==="snake"&&modeTick%3===0&&cols>8&&rows>8){
      const head={...snake[0]},dx=food&&Math.abs(food.x-head.x)>Math.abs(food.y-head.y)?Math.sign(food.x-head.x):0,dy=dx?0:Math.sign((food?.y||head.y)-head.y);
      head.x=(head.x+(dx||1)+cols)%cols;head.y=(head.y+dy+rows)%rows;snake.unshift(head);
      if(food&&head.x===food.x&&head.y===food.y){food={x:2+Math.floor(Math.random()*Math.max(4,cols-4)),y:2+Math.floor(Math.random()*Math.max(4,rows-4))};for(let i=0;i<10;i++)particles.push({x:head.x*cell,y:head.y*cell,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,life:26,color:colors[(hue+i)%colors.length]});}
      else snake=snake.slice(0,Math.min(18,snake.length));
    }
    if(mode==="pong"){
      pong.x+=pong.vx;pong.y+=pong.vy;
      if(pong.x<18||pong.x>canvas.width-18)pong.vx*=-1;
      if(pong.y<18||pong.y>canvas.height-18)pong.vy*=-1;
    }
    if(mode==="traffic")traffic.forEach(car=>{car.y+=car.speed;if(car.y>canvas.height+18){car.y=-20;car.x=Math.random()*canvas.width;car.speed=.8+Math.random()*1.9;}});
    if(mode==="stars")stars.forEach(st=>{st.y+=st.z*1.4;st.x+=st.z*.18;if(st.y>canvas.height+4){st.y=-4;st.x=Math.random()*canvas.width;st.z=.35+Math.random()*1.8;}});
    if(mode==="matrix")matrix.forEach(col=>{col.y+=col.speed*5;if(col.y>canvas.height+80){col.y=-80;col.speed=1+Math.random()*3;col.glyph=Math.floor(Math.random()*10);}});
    if(mode==="radar")radar=(radar+.035)%(Math.PI*2);
  };
  const drawMode=()=>{
    ctx.save();ctx.globalAlpha=.88;
    if(mode==="snake"){
      snake.forEach((p,i)=>{ctx.fillStyle=i?colors[i%colors.length]:"#ffe84c";ctx.fillRect(p.x*cell+1,p.y*cell+1,cell-2,cell-2);});
      if(food){ctx.fillStyle="#ff3eb5";ctx.fillRect(food.x*cell+3,food.y*cell+3,cell-6,cell-6);}
    }else if(mode==="pong"){
      ctx.strokeStyle="rgba(255,232,76,.55)";ctx.lineWidth=3;ctx.strokeRect(28,34,canvas.width-56,canvas.height-68);
      ctx.fillStyle="#31f5ff";ctx.fillRect(44,pong.y-34,8,68);ctx.fillStyle="#ff3eb5";ctx.fillRect(canvas.width-52,canvas.height-pong.y-34,8,68);
      ctx.fillStyle="#ffe84c";ctx.fillRect(pong.x-7,pong.y-7,14,14);
    }else if(mode==="traffic"){
      ctx.strokeStyle="rgba(255,232,76,.28)";ctx.lineWidth=2;for(let x=canvas.width*.18;x<canvas.width;x+=canvas.width*.18){ctx.beginPath();ctx.setLineDash([14,18]);ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
      ctx.setLineDash([]);traffic.forEach(car=>{ctx.fillStyle=car.color;ctx.fillRect(car.x,car.y,18,10);ctx.fillStyle="#f8f4ff";ctx.fillRect(car.x+12,car.y+2,4,2);});
    }else if(mode==="stars"){
      stars.forEach(st=>{ctx.globalAlpha=Math.min(.9,.25+st.z/2);ctx.fillStyle=st.color;ctx.fillRect(st.x,st.y,Math.max(2,st.z*2),Math.max(2,st.z*2));});
      ctx.globalAlpha=.3;ctx.strokeStyle="#7df9ff";for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(0,canvas.height*(i+1)/6);ctx.lineTo(canvas.width,canvas.height*(i+1)/6+Math.sin(modeTick/18+i)*18);ctx.stroke();}
    }else if(mode==="matrix"){
      ctx.font="12px monospace";matrix.forEach((col,i)=>{for(let j=0;j<9;j++){ctx.globalAlpha=Math.max(.08,1-j*.11);ctx.fillStyle=j?"#72ff77":"#f8f4ff";ctx.fillText(String((col.glyph+j+i)%10),col.x,col.y-j*18);}});
    }else if(mode==="radar"){
      const cx=canvas.width/2,cy=canvas.height/2,r=Math.min(canvas.width,canvas.height)*.36;
      ctx.strokeStyle="rgba(49,245,255,.32)";ctx.lineWidth=2;for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,r*i/4,0,Math.PI*2);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(radar)*r,cy+Math.sin(radar)*r);ctx.strokeStyle="#72ff77";ctx.lineWidth=4;ctx.stroke();
      for(let i=0;i<18;i++){const a=i*.9+Math.sin(modeTick/30+i),rr=(i%4+1)*r/5;ctx.fillStyle=colors[i%colors.length];ctx.fillRect(cx+Math.cos(a)*rr-3,cy+Math.sin(a)*rr-3,6,6);}
    }
    ctx.restore();
  };  const draw=now=>{
    if(!running)return;raf=requestAnimationFrame(draw);const profile=resolvedGraphicsProfile();if(menuRafPaused||document.hidden||uiSettings.backgroundAnimation===false||profile==="low")return;
    const frameInterval=profile==="high"?1000/24:1000/12;if(now-lastPaint<frameInterval)return;lastPaint=now;
    if(now-last>170){if(mode==="life")step();stepMode();last=now;}
    ctx.clearRect(0,0,canvas.width,canvas.height);ctx.globalAlpha=.78;
    if(mode==="life")for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const v=grid[idx(x,y)];if(!v)continue;ctx.fillStyle=colors[(v-1)%colors.length];ctx.fillRect(x*cell+2,y*cell+2,cell-4,cell-4);}
    particles=particles.filter(p=>p.life-- >0);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.02;ctx.globalAlpha=Math.max(0,p.life/40);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4);});
    drawMode();ctx.globalAlpha=.16;ctx.strokeStyle="#31f5ff";for(let x=0;x<canvas.width;x+=cell*4){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
  };
  const interactive=e=>e.target.closest?.("button,a,input,textarea,select,dialog,[role='button'],[data-game-card]");
  const down=e=>{if(interactive(e)||$("#arcade-screen")?.classList.contains("hidden"))return;paint=true;document.body.classList.add("conway-drawing");canvas.setPointerCapture?.(e.pointerId);e.preventDefault();burst(e.clientX,e.clientY,true);};
  const move=e=>{if(paint&&!interactive(e))burst(e.clientX,e.clientY,false);};
  const up=e=>{paint=false;document.body.classList.remove("conway-drawing");if(e?.pointerId!=null&&canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);};
  menuLifeApi={
    burstAt:(x,y,big=true)=>burst(x,y,big),
    setMode:next=>{mode=next||"life";particles=[];resetMode();if(mode==="life")seed();},
    setStyle:style=>{uiSettings.menuBgStyle=style||"retro";colors=menuBgPalette();particles=[];resetMode();if(mode==="life")seed();},
    burstEl:(el,big=true)=>{const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,big);},
    refresh:resize
  };
  const visibility=()=>{if(document.hidden)up();setMenuPaused(document.hidden||$("#game-dialog")?.open);};resize();resetMode();document.addEventListener("visibilitychange",visibility);window.addEventListener("pointerdown",down,{passive:false});window.addEventListener("pointermove",move);window.addEventListener("pointerup",up);window.addEventListener("pointercancel",up);window.addEventListener("blur",up);window.addEventListener("resize",resize);raf=requestAnimationFrame(draw);
  menuLifeCleanup=()=>{up();running=false;cancelAnimationFrame(raf);document.removeEventListener("visibilitychange",visibility);window.removeEventListener("pointerdown",down);window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",up);window.removeEventListener("pointercancel",up);window.removeEventListener("blur",up);window.removeEventListener("resize",resize);menuLifeCleanup=null;menuLifeApi=null;};
}

function startGameLife(game){
  if(gameLifeCleanup)gameLifeCleanup();
  if(resolvedGraphicsProfile()!=="high"||uiSettings.backgroundAnimation===false)return;
  const canvases=[$("#game-life-left"),$("#game-life-right")].filter(Boolean);if(!canvases.length)return;
  const palettes={fishing:["#28d7d1","#31f5ff","#72ff77","#d9e5ff"],openroad:["#ff7043","#ffe84c","#8e5bff","#31f5ff"],penalty:["#72ff77","#f8f4ff","#ffe84c","#31f5ff"],blackjack:["#ff3eb5","#ffe84c","#f8f4ff","#72ff77"],poker:["#8e5bff","#ff3eb5","#f8f4ff","#ffe84c"],slots:["#ff3eb5","#ffe84c","#31f5ff","#72ff77"],dice:["#8e5bff","#31f5ff","#ffe84c","#f8f4ff"],snake:["#72ff77","#31f5ff","#ffe84c","#0a4"],pac:["#ffe84c","#31f5ff","#ff3eb5","#f8f4ff"],wreck:["#ff7043","#ffe84c","#31f5ff","#ff3eb5"],memory:["#31f5ff","#8e5bff","#ffe84c","#f8f4ff"],reaction:["#ffe84c","#72ff77","#ff3eb5","#31f5ff"]};
  const colors=palettes[game.id]||[game.color||"#31f5ff","#ff3eb5","#ffe84c","#72ff77"],cell=10,glyphs={fishing:"fish",openroad:"road",penalty:"ball",blackjack:"card",poker:"card",slots:"coin",dice:"pip",snake:"snake",pac:"dot",wreck:"spark"};
  const states=canvases.map((canvas,side)=>({canvas,ctx:canvas.getContext("2d"),side,cols:0,rows:0,grid:[],next:[]}));let raf=0,last=0,lastPaint=0,running=true;
  const idx=(st,x,y)=>y*st.cols+x;
  const seed=st=>{st.grid=Array(st.cols*st.rows).fill(0);st.next=Array(st.cols*st.rows).fill(0);for(let y=0;y<st.rows;y++)for(let x=0;x<st.cols;x++)if(Math.random()<.12||((x*3+y+st.side*7)%23===0&&Math.random()<.55))st.grid[idx(st,x,y)]=1+((x+y+st.side)%colors.length);[["glider",2,3],["glider",Math.max(1,st.cols-6),Math.floor(st.rows*.32)],["block",Math.floor(st.cols*.45),Math.floor(st.rows*.72)]].forEach(([type,x,y],n)=>{const pts=type==="block"?[[0,0],[1,0],[0,1],[1,1]]:[[1,0],[2,1],[0,2],[1,2],[2,2]];pts.forEach(([dx,dy])=>{if(x+dx>=0&&y+dy>=0&&x+dx<st.cols&&y+dy<st.rows)st.grid[idx(st,x+dx,y+dy)]=1+((n+dx+dy)%colors.length);});});};
  const resize=()=>states.forEach(st=>{const r=st.canvas.getBoundingClientRect();st.canvas.width=Math.max(48,Math.floor(r.width));st.canvas.height=Math.max(180,Math.floor(r.height));st.cols=Math.ceil(st.canvas.width/cell);st.rows=Math.ceil(st.canvas.height/cell);seed(st);});
  const burst=(st,clientX,clientY,big=false)=>{const r=st.canvas.getBoundingClientRect(),gx=Math.floor((clientX-r.left)/cell),gy=Math.floor((clientY-r.top)/cell),rad=big?4:2;for(let y=gy-rad;y<=gy+rad;y++)for(let x=gx-rad;x<=gx+rad;x++)if(x>=0&&y>=0&&x<st.cols&&y<st.rows&&Math.hypot(x-gx,y-gy)<=rad+.35)st.grid[idx(st,x,y)]=1+((x+y+Date.now())%colors.length);};
  const step=st=>{let live=0;for(let y=0;y<st.rows;y++)for(let x=0;x<st.cols;x++){let n=0,c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const v=st.grid[idx(st,(x+dx+st.cols)%st.cols,(y+dy+st.rows)%st.rows)];if(v){n++;c+=v;}}const me=st.grid[idx(st,x,y)];st.next[idx(st,x,y)]=me?(n===2||n===3?me:0):(n===3?Math.max(1,Math.round(c/3)%colors.length):0);if(st.next[idx(st,x,y)])live++;}[st.grid,st.next]=[st.next,st.grid];if(live<8)seed(st);};
  const drawMotif=(ctx,x,y,color,kind)=>{ctx.fillStyle=color;if(kind==="fish"){ctx.fillRect(x,y+3,10,5);ctx.fillRect(x+10,y+4,3,3);ctx.fillRect(x-3,y+4,3,3);}else if(kind==="road"){ctx.fillRect(x+4,y,4,14);ctx.fillStyle="#ffe84c";ctx.fillRect(x+5,y+2,2,3);ctx.fillRect(x+5,y+8,2,3);}else if(kind==="card"){ctx.fillRect(x,y,11,14);ctx.fillStyle="#08061d";ctx.fillRect(x+2,y+2,7,10);}else if(kind==="ball"){ctx.fillRect(x+3,y,6,12);ctx.fillRect(x,y+3,12,6);}else if(kind==="snake"){ctx.fillRect(x,y+4,13,5);ctx.fillRect(x+9,y+1,5,5);}else{ctx.fillRect(x+2,y+2,8,8);ctx.fillRect(x+5,y,2,12);ctx.fillRect(x,y+5,12,2);}};
  const draw=now=>{if(!running)return;raf=requestAnimationFrame(draw);if(document.hidden||gamePauseOpen||now-lastPaint<1000/20)return;lastPaint=now;if(now-last>170){states.forEach(step);last=now;}states.forEach(st=>{const ctx=st.ctx;ctx.clearRect(0,0,st.canvas.width,st.canvas.height);ctx.globalAlpha=.7;for(let y=0;y<st.rows;y++)for(let x=0;x<st.cols;x++){const v=st.grid[idx(st,x,y)];if(!v)continue;const px=x*cell,py=y*cell,color=colors[(v-1)%colors.length];if((x+y+st.side)%7===0)drawMotif(ctx,px,py,color,glyphs[game.id]||"spark");else{ctx.fillStyle=color;ctx.fillRect(px+3,py+3,cell-5,cell-5);}}ctx.globalAlpha=1;});};
  const down=e=>{const st=states.find(s=>s.canvas===e.currentTarget);if(!st)return;document.body.classList.add("conway-drawing");st.canvas.setPointerCapture?.(e.pointerId);e.preventDefault();burst(st,e.clientX,e.clientY,true);};
  const move=e=>{if(e.buttons!==1)return;const st=states.find(s=>s.canvas===e.currentTarget);if(st)burst(st,e.clientX,e.clientY,false);};
  const up=e=>{document.body.classList.remove("conway-drawing");const st=states.find(s=>s.canvas===e?.target||s.canvas.hasPointerCapture?.(e?.pointerId));if(st&&e?.pointerId!=null&&st.canvas.hasPointerCapture?.(e.pointerId))st.canvas.releasePointerCapture(e.pointerId);};
  resize();window.addEventListener("resize",resize);window.addEventListener("pointerup",up);window.addEventListener("pointercancel",up);window.addEventListener("blur",up);canvases.forEach(c=>{c.addEventListener("pointerdown",down,{passive:false});c.addEventListener("pointermove",move);});raf=requestAnimationFrame(draw);
  gameLifeCleanup=()=>{up();running=false;cancelAnimationFrame(raf);window.removeEventListener("resize",resize);window.removeEventListener("pointerup",up);window.removeEventListener("pointercancel",up);window.removeEventListener("blur",up);canvases.forEach(c=>{c.removeEventListener("pointerdown",down);c.removeEventListener("pointermove",move);});gameLifeCleanup=null;};
}

function renderProfiles(){
  const list=$("#profile-list");
  list.replaceChildren();
  data.profiles.forEach(p=>{const card=document.createElement("button"),remove=document.createElement("span"),avatar=document.createElement("span"),name=document.createElement("strong"),level=document.createElement("small");card.className="profile-card";card.dataset.id=p.id;card.style.color=p.color;remove.className="delete-profile";remove.dataset.delete=p.id;remove.title="Profil törlése";remove.textContent="×";avatar.className="avatar";avatar.textContent=p.avatar;name.textContent=p.name;level.textContent=`LVL ${levelOf(p)}`;card.append(remove,avatar,name,level);list.append(card)});
  if(!data.profiles.length){const empty=document.createElement("p");empty.style.gridColumn="1/-1";empty.style.color="var(--muted)";empty.textContent="Még nincs játékosprofil. Nyomd meg az ÚJ JÁTÉKOS gombot!";list.append(empty)}
}
function levelOf(p){ return Math.floor((p.xp||0)/100)+1; }
function rankOf(p){return [...ranks].reverse().find(r=>(p.xp||0)>=r.xp)?.name||"ÚJONC";}
function selectPlayer(id){
  currentPlayer=data.profiles.find(p=>p.id===id); if(!currentPlayer)return;
  const card=$(`[data-id="${CSS.escape(id)}"]`);card?.classList.add("player-ready");toast("PLAYER READY");
  currentPlayer.inventory ||= [];currentPlayer.favorites ||= [];
  ensureDaily();currentPlayer.rank=rankOf(currentPlayer);currentPlayer.coins ??= 100;
  const showArcade=()=>{$("#player-screen").classList.add("screen-exit","hidden");$("#arcade-screen").classList.remove("hidden");$("#arcade-screen").classList.add("screen-enter");setTimeout(()=>$("#arcade-screen")?.classList.remove("screen-enter"),680);document.documentElement.style.setProperty("--player",currentPlayer.color);startMenuLife();applyUiSettings();updateHud();renderGames();window.scrollTo(0,0);};
  if(reduceMotion())showArcade();else setTimeout(showArcade,560);
}
function updateHud(){
  if(!currentPlayer)return;
  $("#header-avatar").textContent=currentPlayer.avatar; $("#header-name").textContent=currentPlayer.name;
  $("#header-rank").textContent=currentPlayer.rank || "ÚJONC";
  const level=levelOf(currentPlayer),within=currentPlayer.xp%100;$("#header-level").textContent=level;$("#header-xp-fill").style.width=`${within}%`;$("#header-xp-text").textContent=`${within}/100 XP`;
  $("#footer-player").textContent=currentPlayer.name.toUpperCase(); $("#coin-count").textContent=currentPlayer.coins;
  const gameCoins=$("#game-coin-count");if(gameCoins)gameCoins.textContent=currentPlayer.coins;
  $("#play-count").textContent=currentPlayer.plays||0; $("#best-streak").textContent=currentPlayer.bestStreak||0;
  $("#player-level").textContent=String(level).padStart(2,"0"); $("#xp-fill").style.width=`${within}%`;
}

function hasPremiumSubscription(player=currentPlayer){
  if(!player?.subscription||player.subscription.plan!=="premium")return false;
  const expires=Date.parse(player.subscription.renewsAt||"");
  return !Number.isFinite(expires)||expires>Date.now();
}
function ensureBattlePass(player=currentPlayer){
  if(!player)return null;
  if(!player.battlePass||player.battlePass.seasonId!==BATTLE_PASS_SEASON.id)player.battlePass={seasonId:BATTLE_PASS_SEASON.id,xp:0,claimedFree:[],claimedPremium:[]};
  player.battlePass.claimedFree ||= [];player.battlePass.claimedPremium ||= [];
  return player.battlePass;
}
function addBattlePassXp(amount){
  const pass=ensureBattlePass();if(!pass)return;
  const base=Math.max(0,Math.floor(Number(amount)||0)),bonus=hasPremiumSubscription()?Math.ceil(base*.2):0;
  pass.xp=Math.min(BATTLE_PASS_SEASON.maxLevel*BATTLE_PASS_SEASON.xpPerLevel,(pass.xp||0)+base+bonus);
}
function battlePassLevel(player=currentPlayer){return Math.min(BATTLE_PASS_SEASON.maxLevel,Math.floor((ensureBattlePass(player)?.xp||0)/BATTLE_PASS_SEASON.xpPerLevel));}
function grantBattlePassReward(reward){
  if(reward.type==="coins"){currentPlayer.coins+=reward.value;currentPlayer.coinsEarned=(currentPlayer.coinsEarned||0)+reward.value;}
  else{currentPlayer.inventory ||= [];if(!currentPlayer.inventory.includes(reward.value))currentPlayer.inventory.push(reward.value);}
}
function claimBattlePassReward(track,level){
  const pass=ensureBattlePass(),entry=BATTLE_PASS_REWARDS.find(item=>item.level===level),claimed=track==="premium"?pass.claimedPremium:pass.claimedFree;
  if(!entry||pass.xp<level*BATTLE_PASS_SEASON.xpPerLevel||claimed.includes(level))return;
  if(track==="premium"&&!hasPremiumSubscription())return toast("A PRÉMIUM JUTALOMSÁVHOZ ELŐFIZETÉS KELL");
  grantBattlePassReward(entry[track]);claimed.push(level);saveData();updateHud();renderBattlePass();sfx("win");toast(`${entry[track].label} ÁTVÉVE`);
}
function setLocalSubscription(action){
  currentPlayer.subscription ||= {plan:"free",status:"free",autoRenew:false};
  if(action==="activate"){const now=new Date(),renew=new Date(now);renew.setDate(renew.getDate()+30);Object.assign(currentPlayer.subscription,{plan:"premium",status:"active",autoRenew:true,startedAt:now.toISOString(),renewsAt:renew.toISOString(),provider:"local-demo"});toast("PREMIUM LOCAL DEMO AKTIVÁLVA");}
  if(action==="cancel"){currentPlayer.subscription.status="cancelled";currentPlayer.subscription.autoRenew=false;toast("AUTOMATIKUS MEGÚJÍTÁS KIKAPCSOLVA");}
  if(action==="resume"){currentPlayer.subscription.status="active";currentPlayer.subscription.autoRenew=true;toast("AUTOMATIKUS MEGÚJÍTÁS VISSZAKAPCSOLVA");}
  saveData();renderBattlePass();
}
function renderBattlePass(){
  const host=$("#battle-pass-content");if(!host||!currentPlayer)return;
  const pass=ensureBattlePass(),premium=hasPremiumSubscription(),level=battlePassLevel(),within=pass.xp%BATTLE_PASS_SEASON.xpPerLevel,percent=level>=BATTLE_PASS_SEASON.maxLevel?100:within/BATTLE_PASS_SEASON.xpPerLevel*100,days=Math.max(0,Math.ceil((Date.parse(BATTLE_PASS_SEASON.endsAt)-Date.now())/86400000)),sub=currentPlayer.subscription||{};
  const subscription=premium?`<article class="subscription-card premium"><div><span>⚡</span><p><small>ELŐFIZETÉS</small><b>GUBUNTU PREMIUM</b><em>+20% Battle Pass XP • prémium jutalomsáv • exkluzív kozmetika</em></p></div><button class="pixel-btn secondary" data-subscription="${sub.status==="cancelled"?"resume":"cancel"}">${sub.status==="cancelled"?"MEGÚJÍTÁS BEKAPCSOLÁSA":"MEGÚJÍTÁS KIKAPCSOLÁSA"}</button><small>${sub.status==="cancelled"?"Hozzáférés a helyi demóidőszak végéig.":"LOCAL DEMO • nincs valódi terhelés"}</small></article>`:`<article class="subscription-card"><div><span>🎫</span><p><small>JELENLEGI CSOMAG</small><b>FREE ARCADE</b><em>Az ingyenes jutalomsáv minden játékosnak elérhető.</em></p></div><button class="pixel-btn primary" data-subscription="activate">PREMIUM LOCAL DEMO</button><small>Ez tesztelési állapot, nem valódi vásárlás.</small></article>`;
  host.innerHTML=`<section class="battle-pass-hero"><div><p class="eyebrow">SEASON ${BATTLE_PASS_SEASON.number} • ${days} NAP VAN HÁTRA</p><h3>${BATTLE_PASS_SEASON.name}</h3><p>Játssz, szerezz Battle Pass XP-t, majd vedd át a feloldott jutalmakat.</p></div><strong>LVL ${level}/${BATTLE_PASS_SEASON.maxLevel}</strong></section>${subscription}<section class="battle-pass-progress"><div><span>${pass.xp} / ${BATTLE_PASS_SEASON.maxLevel*BATTLE_PASS_SEASON.xpPerLevel} BP XP</span><b>${premium?"PREMIUM XP BOOST +20%":"FREE TRACK"}</b></div><i><u style="width:${percent}%"></u></i></section><section class="battle-pass-track">${BATTLE_PASS_REWARDS.map(entry=>{const unlocked=pass.xp>=entry.level*BATTLE_PASS_SEASON.xpPerLevel,freeClaimed=pass.claimedFree.includes(entry.level),premiumClaimed=pass.claimedPremium.includes(entry.level);return `<article class="pass-tier ${unlocked?"unlocked":"locked"}"><header><span>LVL ${entry.level}</span><small>${entry.level*BATTLE_PASS_SEASON.xpPerLevel} XP</small></header><div class="pass-reward free"><small>FREE</small><span>${entry.free.icon}</span><b>${entry.free.label}</b><button data-pass-claim="free" data-pass-level="${entry.level}" ${!unlocked||freeClaimed?"disabled":""}>${freeClaimed?"ÁTVÉVE":unlocked?"ÁTVÉTEL":"ZÁROLVA"}</button></div><div class="pass-reward premium"><small>PREMIUM</small><span>${entry.premium.icon}</span><b>${entry.premium.label}</b><button data-pass-claim="premium" data-pass-level="${entry.level}" ${!unlocked||premiumClaimed||!premium?"disabled":""}>${premiumClaimed?"ÁTVÉVE":!premium?"PREMIUM":unlocked?"ÁTVÉTEL":"ZÁROLVA"}</button></div></article>`;}).join("")}</section>`;
}

function renderProgress(){
  const nextRank=ranks.find(r=>r.xp>currentPlayer.xp),currentRank=[...ranks].reverse().find(r=>currentPlayer.xp>=r.xp),rankProgress=nextRank?((currentPlayer.xp-currentRank.xp)/(nextRank.xp-currentRank.xp))*100:100,unlocked=new Set(currentPlayer.achievements||[]);
  const favorite=[...games].sort((a,b)=>(gameStatsFor(b.id).plays||0)-(gameStatsFor(a.id).plays||0)).find(g=>(gameStatsFor(g.id).plays||0)>0),openDone=Object.keys(currentPlayer.openRoadMissions||{}).length,secretCars=(currentPlayer.vehicles||[]).filter(id=>["scarab","frost-ufo","magma-phantom","crystal-ghost","candy-kart"].includes(id)).length;
  const records=games.filter(g=>currentPlayer.gameStats?.[g.id]).map(g=>{const s=currentPlayer.gameStats[g.id];return `<div class="record-row"><span>${g.icon} ${g.title}</span><b>${s.wins||0} GY • ${s.losses||0} V${s.best!=null?` • REKORD ${s.best}`:""}</b></div>`;}).join("")||`<p class="empty-state">Az első rekordodra még vár a gépterem.</p>`;
  const totalDecisions=(currentPlayer.totalWins||0)+(currentPlayer.totalLosses||0),winRate=totalDecisions?Math.round((currentPlayer.totalWins||0)/totalDecisions*100):0,playMinutes=Math.round((currentPlayer.playTimeMs||0)/60000),achievementPercent=Math.round(unlocked.size/achievements.length*100),daily=ensureDaily(),dailyDone=dailyDefs().filter(d=>(daily[d.field]||0)>=d.goal).length,days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const key=localDateKey(d);return {label:new Intl.DateTimeFormat("hu-HU",{weekday:"short"}).format(d),value:currentPlayer.activity?.[key]||0};}),maxDay=Math.max(1,...days.map(d=>d.value));
  const active=view=>progressView===view?"active":"";
  $("#progress-content").innerHTML=`<nav class="progress-tabs submenu-tabs" aria-label="Profil nézetek">
      <button type="button" class="${active("statistics")}" data-progress-tab="statistics"><span>▥</span><b>ÁTTEKINTÉS</b><small>Haladás és aktivitás</small></button>
      <button type="button" class="${active("achievements")}" data-progress-tab="achievements"><span>🏆</span><b>JELVÉNYEK</b><small>${unlocked.size}/${achievements.length} megszerezve</small></button>
      <button type="button" class="${active("records")}" data-progress-tab="records"><span>◆</span><b>REKORDOK</b><small>Játékonkénti eredmények</small></button>
    </nav>
    <div class="progress-panel ${active("statistics")}" data-progress-panel="statistics">
      <section class="profile-summary"><div class="avatar">${currentPlayer.avatar}</div><div><p class="eyebrow">${currentPlayer.rank}</p><h3>${esc(currentPlayer.name)}</h3><p>${currentPlayer.totalWins||0} győzelem • ${currentPlayer.plays||0} kör • ${currentPlayer.bestStreak||0} legjobb sorozat</p></div><strong>LVL ${levelOf(currentPlayer)}</strong></section>
      <section class="rank-card"><div class="submenu-section-head"><div><p class="eyebrow">KÖVETKEZŐ MÉRFÖLDKŐ</p><h3>RANGHALADÁS</h3></div><b>${Math.round(rankProgress)}%</b></div><div class="xp-bar"><i style="width:${Math.max(0,Math.min(100,rankProgress))}%"></i></div><p class="progress-note">${nextRank?`${currentPlayer.xp} / ${nextRank.xp} XP • következő: ${nextRank.name}`:"Elérted a legmagasabb rangot."}</p></section>
      <section><header class="submenu-section-head"><div><p class="eyebrow">CAREER SNAPSHOT</p><h3>STATISZTIKAI KÖZPONT</h3></div><small>A teljes profil összesítése</small></header><div class="stats-overview career-grid"><article><span>⏱️</span><b>${playMinutes} PERC</b><small>Összes játékidő</small></article><article><span>🏆</span><b>${winRate}%</b><small>Győzelmi arány</small></article><article><span>❤️</span><b>${favorite?.title||"—"}</b><small>Legtöbbet játszott</small></article><article><span>●</span><b>${currentPlayer.coinsEarned||0}</b><small>Összes érmebevétel</small></article><article><span>🎖️</span><b>${achievementPercent}%</b><small>Jelvényhaladás</small></article><article><span>📅</span><b>${dailyDone}/${dailyDefs().length}</b><small>Mai kihívások</small></article><article><span>🏎️</span><b>${openDone}/11</b><small>OpenRoad küldetés</small></article><article><span>🛍️</span><b>${(currentPlayer.inventory||[]).length}</b><small>Bolti tárgy</small></article></div></section>
      <section><header class="submenu-section-head compact"><div><p class="eyebrow">LAST 7 DAYS</p><h3>HETI AKTIVITÁS</h3></div></header><div class="activity-bars">${days.map(d=>`<span><i style="--h:${Math.max(4,d.value/maxDay*90)}px"></i><b>${d.value}</b><small>${d.label}</small></span>`).join("")}</div></section>
    </div>
    <div class="progress-panel ${active("achievements")}" data-progress-panel="achievements"><section><header class="submenu-section-head"><div><p class="eyebrow">COLLECTION</p><h3>JELVÉNYEK</h3></div><strong>${achievementPercent}%</strong></header><div class="achievement-grid">${achievements.map(a=>`<article class="achievement ${unlocked.has(a.id)?"unlocked":"locked"}"><span>${a.icon}</span><div><b>${a.name}</b><small>${a.desc}${unlocked.has(a.id)?" • MEGSZEREZVE":` • +${a.reward} ÉRME`}</small></div></article>`).join("")}</div></section></div>
    <div class="progress-panel ${active("records")}" data-progress-panel="records"><section><header class="submenu-section-head"><div><p class="eyebrow">PERSONAL BESTS</p><h3>JÁTÉKREKORDOK</h3></div><small>Győzelmek, vereségek és csúcsértékek</small></header><div class="record-list">${records}</div></section></div>`;
}

function setProgressView(view){
  progressView=["statistics","achievements","records"].includes(view)?view:"statistics";
  $$("[data-progress-tab]").forEach(button=>button.classList.toggle("active",button.dataset.progressTab===progressView));
  $$("[data-progress-panel]").forEach(panel=>panel.classList.toggle("active",panel.dataset.progressPanel===progressView));
  $("#progress-content")?.scrollTo({top:0,behavior:reduceMotion()?"auto":"smooth"});
}
function setSettingsView(view,scroll=true){
  settingsView=["visual","data","about"].includes(view)?view:"visual";
  $$("[data-settings-tab]").forEach(button=>button.classList.toggle("active",button.dataset.settingsTab===settingsView));
  $$("[data-settings-panel]").forEach(panel=>{const active=panel.dataset.settingsPanel===settingsView;panel.classList.toggle("active",active);panel.hidden=!active;});
  if(scroll)$(".settings-content")?.scrollTo({top:0,behavior:reduceMotion()?"auto":"smooth"});
}
function renderAdmin(){
  if(!currentPlayer){
    const first=data.profiles?.[0];
    $("#admin-content").innerHTML=`<section class="admin-hero"><div><p class="eyebrow">LOCAL DEV PANEL</p><h3>ADMIN PANEL KÉSZENLÉTBEN</h3><p>Nincs aktív profil betöltve, ezért eddig üresnek tűnhetett a panel. Válassz profilt, vagy töltsd be az első mentést innen.</p></div><span class="admin-orb">⚙</span></section>
    <section class="admin-warning"><h3>NINCS AKTÍV JÁTÉKOS</h3><p>A debug műveletek mindig az aktuális profil helyi mentését módosítják.</p><div class="admin-actions">${first?`<button class="pixel-btn secondary" data-admin-profile="${first.id}">${esc(first.name)} BETÖLTÉSE</button>`:`<button class="pixel-btn secondary" data-admin-close>PROFIL LÉTREHOZÁSA</button>`}</div></section>`;
    $$("[data-admin-profile]").forEach(btn=>btn.onclick=()=>{selectPlayer(btn.dataset.adminProfile);renderAdmin();});
    $$(`[data-admin-close]`).forEach(btn=>btn.onclick=()=>closeDialogAnimated($("#admin-dialog")));
    return;
  }
  currentPlayer.fishing ||= {rod:1,bait:1,total:0,sold:0,bestValue:0,bucket:[],dex:{},area:"pond",shop:{}};
  const fish=currentPlayer.fishing,level=levelOf(currentPlayer),nextRank=ranks.find(r=>r.xp>currentPlayer.xp);
  $("#admin-content").innerHTML=`<section class="admin-hero"><div><p class="eyebrow">SECRET DEV ROOM</p><h3>${esc(currentPlayer.name)} DEBUG KONZOL</h3><p>Gyors teszteléshez, balanszoláshoz és horgász-progressz ellenőrzéshez. Minden csak a helyi böngészős mentést módosítja.</p></div><span class="admin-orb">${currentPlayer.avatar||"⚙"}</span></section>
  <section><h3>RENDSZER ÁLLAPOT</h3><div class="admin-grid">
    <article><span>👤</span><b>${esc(currentPlayer.name)}</b><small>LVL ${level} • ${currentPlayer.rank}</small></article>
    <article><span>●</span><b>${currentPlayer.coins}</b><small>Érme</small></article>
    <article><span>XP</span><b>${currentPlayer.xp}</b><small>${nextRank?`Következő: ${nextRank.name}`:"Max rang elérve"}</small></article>
    <article><span>🎣</span><b>${fish.total||0}</b><small>Fogás • best ${fish.bestValue||0}● • vödör ${(fish.bucket||[]).length}</small></article>
  </div></section>
  <section><h3>GYORS MŰVELETEK</h3><div class="admin-action-grid">
    <article><span>💰</span><div><b>Gazdaság</b><small>Shop és reward teszteléshez.</small></div><button class="pixel-btn secondary" data-admin="coins">+1000 ÉRME</button></article>
    <article><span>⚡</span><div><b>XP boost</b><small>Ranglétra gyors ellenőrzése.</small></div><button class="pixel-btn secondary" data-admin="xp">+5000 XP</button></article>
    <article><span>135</span><div><b>Late-game teszt</b><small>A mostani magas profilod környéke.</small></div><button class="pixel-btn secondary" data-admin="level135">LVL 135</button></article>
    <article><span>500</span><div><b>Endgame rang teszt</b><small>Új, hosszabb ranglétra validálás.</small></div><button class="pixel-btn secondary" data-admin="level500">LVL 500</button></article>
    <article><span>🎣</span><div><b>Horgászbolt max</b><small>Bot, csali, hűtő, szonár, szerencse.</small></div><button class="pixel-btn secondary" data-admin="fishmax">MAX SHOP</button></article>
    <article><span>📅</span><div><b>Napi reset</b><small>Új horgász megbízások tesztelése.</small></div><button class="pixel-btn secondary" data-admin="fishdaily">NAPI RESET</button></article>
    <article class="danger-card"><span>🧺</span><div><b>Vödör ürítés</b><small>Csak a fogott hal-listát törli.</small></div><button class="pixel-btn danger" data-admin="emptybucket">ÜRÍTÉS</button></article>
  </div><p class="progress-note">Belépés: G logo / mini logo 7 kattintás, kód: gubuntu-admin.</p></section>`;
  $$("[data-admin]").forEach(btn=>btn.onclick=()=>adminAction(btn.dataset.admin));
}
function adminAction(action){
  if(!currentPlayer)return;
  currentPlayer.fishing ||= {rod:1,bait:1,total:0,sold:0,bestValue:0,bucket:[],dex:{},area:"pond",shop:{}};
  const fish=currentPlayer.fishing;fish.shop ||= {};
  if(action==="coins")currentPlayer.coins+=1000;
  if(action==="xp")currentPlayer.xp+=5000;
  if(action==="level135")currentPlayer.xp=(135-1)*100;
  if(action==="level250")currentPlayer.xp=(250-1)*100;
  if(action==="level500")currentPlayer.xp=(500-1)*100;
  if(action==="fishmax"){fish.rod=Math.max(fish.rod||1,20);fish.bait=Math.max(fish.bait||1,20);Object.assign(fish.shop,{cooler:12,sonar:20,lure:20,reel:10,charm:10,preserver:8,lantern:8,bell:10});}
  if(action==="fishdaily")fish.daily=null;
  if(action==="emptybucket")fish.bucket=[];
  currentPlayer.rank=rankOf(currentPlayer);saveData();updateHud();renderGames($(".filter.active")?.dataset.filter||"all");renderLobby();renderAdmin();toast("ADMIN MŰVELET KÉSZ");
}
function downloadJson(payload,filename){const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),0);}
function exportSave(){saveData();downloadJson({...data,exportedAt:new Date().toISOString()},`gubuntu-v${APP_VERSION}-build${BUILD_NUMBER}-${new Date().toISOString().slice(0,10)}.json`);toast("MENTÉS EXPORTÁLVA");}
function importSave(file){
  if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const raw=JSON.parse(reader.result);if(!validSaveShape(raw))throw new Error("bad save shape");const imported=migrateData(raw);if(!imported.profiles.length)throw new Error("empty save");if(!confirm("Az importált mentés lecseréli a jelenlegi profilokat. Folytatod?"))return;const activeId=currentPlayer?.id;data=imported;saveData();renderProfiles();const next=data.profiles.find(p=>p.id===activeId)||data.profiles[0];closeDialogAnimated($("#progress-dialog"));selectPlayer(next.id);renderGames();toast("MENTÉS SIKERESEN IMPORTÁLVA");}catch{toast("HIBÁS VAGY ÜRES MENTÉS");}};reader.readAsText(file);
}
function resetCurrentPlayer(){
  if(!confirm(`${currentPlayer.name} minden eredménye, érméje és tárgya elvész. Biztosan nullázod?`))return;
  resetPlayerState(currentPlayer,{seasonId:BATTLE_PASS_SEASON.id,baseAvatars:avatars,baseColors:["#31f5ff","#ff3eb5","#ffe84c","#72ff77","#8e5bff"]});
  saveData();updateHud();renderGames();renderProgress();toast("PROFIL NULLÁZVA");
}

function renderShop(){
  currentPlayer.inventory ||= [];
  $("#shop-coins").textContent=currentPlayer.coins;
  const dealIndex=(new Date().getDate()+new Date().getMonth()*7)%shopItems.length,shopkeeper=["A mai ajánlat gyanúsan csillog.","Ha villog, biztos ritka. Vagy hibás. De inkább ritka.","A bolt nem kérdez, csak pittyeg.","Ezt a polcot egy pixelfutár töltötte fel hajnalban."][dealIndex%4];
  const intro=`<article class="shopkeeper"><span>🧢</span><div><b>BOLTGÉP</b><small>${shopkeeper}</small></div></article>`;
  $("#shop-grid").innerHTML=shopItems.map(item=>{
    const owned=currentPlayer.inventory.includes(item.id),deal=shopItems[dealIndex].id===item.id&&!owned,rare=item.price>=320,price=deal?Math.max(1,Math.floor(item.price*.75)):item.price;
    const equipped=(item.type==="avatar"&&currentPlayer.avatar===item.value)||(item.type==="theme"&&currentPlayer.color===item.value)||(item.type==="background"&&menuBgStyle()===item.value)||currentPlayer.equipped?.[item.type]===item.value;
    return `<article class="shop-item ${owned?"owned":""} ${deal?"deal":""} ${rare?"rare":""}">${owned?`<span class="shop-badge">${equipped?"AKTÍV":"MEGVAN"}</span>`:deal?`<span class="shop-badge deal-badge">-25%</span>`:rare?`<span class="shop-badge rare-badge">RITKA</span>`:""}<span class="shop-icon">${item.icon}</span><h3>${item.name}</h3><p>${item.desc}</p><strong style="color:var(--yellow)">${owned?"SAJÁT":price+" ●"}</strong><button class="pixel-btn ${owned?"secondary":"primary"}" data-shop="${item.id}" data-price="${price}" ${equipped?"disabled":""}>${equipped?"HASZNÁLATBAN":owned?"FELSZERELEM":"MEGVESZEM"}</button></article>`;
  }).join("");
  $("#shop-grid").insertAdjacentHTML("afterbegin",intro);
}
function shopAction(id){
  const item=shopItems.find(x=>x.id===id); if(!item)return;
  currentPlayer.inventory ||= [];
  if(!currentPlayer.inventory.includes(id)){
    const dealIndex=(new Date().getDate()+new Date().getMonth()*7)%shopItems.length,price=shopItems[dealIndex].id===item.id?Math.max(1,Math.floor(item.price*.75)):item.price;
    if(currentPlayer.coins<price)return toast("NINCS ELÉG ÉRMÉD!");
    if(!confirm(`${item.name} megvásárlása ${price} érméért?`))return;
    currentPlayer.coins-=price;currentPlayer.inventory.push(id);toast(`${item.name} MEGVÁSÁROLVA!`);
  }
  if(item.type==="avatar")currentPlayer.avatar=item.value;
  if(item.type==="theme")currentPlayer.color=item.value;
  currentPlayer.equipped ||= {};if(!["avatar","theme"].includes(item.type))currentPlayer.equipped[item.type]=item.value;
  if(item.type==="background"){uiSettings.menuBgStyle=item.value;saveUiSettings();}
  const unlocked=checkAchievements();saveData();document.documentElement.style.setProperty("--player",currentPlayer.color);applyUiSettings();updateHud();renderShop();if(unlocked.length)toast(`JELVÉNY: ${unlocked[0].name}`);
}
function checkAchievements(){
  currentPlayer.achievements ||= [];
  const unlocked=achievements.filter(a=>!currentPlayer.achievements.includes(a.id)&&a.test(currentPlayer));
  unlocked.forEach(a=>{currentPlayer.achievements.push(a.id);currentPlayer.coins+=a.reward;});
  return unlocked;
}
function grant(coins=0,xp=0,message=""){
  const oldRank=currentPlayer.rank;currentPlayer.coins+=coins;currentPlayer.xp+=xp;addBattlePassXp(xp);if(coins>0){addDaily("coins",coins);currentPlayer.coinsEarned=(currentPlayer.coinsEarned||0)+coins;}currentPlayer.rank=rankOf(currentPlayer);const unlocked=checkAchievements();saveData();updateHud();renderLobby();
  const driveSecrets=$("#drive-secrets");if(driveSecrets)driveSecrets.textContent=`${currentPlayer.secrets?.length||0}/12`;
  if(unlocked.length){sfx("win");toast(`JELVÉNY: ${unlocked[0].name} • +${unlocked.reduce((n,a)=>n+a.reward,0)} ÉRME`);}else if(oldRank!==currentPlayer.rank){sfx("win");toast(`ÚJ RANG: ${currentPlayer.rank}!`);}else if(message){if(coins>10)sfx("coin");toast(message);}
}
function reward(coins=0,xp=5,{result="played",score=null,better="high",countGamePlay=true}={}){
  const oldRank=currentPlayer.rank;currentPlayer.coins=Math.max(0,currentPlayer.coins+coins);currentPlayer.xp+=xp;addBattlePassXp(xp);currentPlayer.plays=(currentPlayer.plays||0)+1;
  if(coins>0)currentPlayer.coinsEarned=(currentPlayer.coinsEarned||0)+coins;const activityKey=todayKey();currentPlayer.activity ||= {};currentPlayer.activity[activityKey]=(currentPlayer.activity[activityKey]||0)+1;
  currentPlayer.gameStats ||= {};const stats=currentPlayer.gameStats[activeGame]||={plays:0,wins:0,losses:0,draws:0,best:null};if(countGamePlay)stats.plays++;
  addDaily("plays",1);if(coins>0)addDaily("coins",coins);
  if(result==="win"){addDaily("wins",1);stats.wins++;currentPlayer.totalWins=(currentPlayer.totalWins||0)+1;currentPlayer.currentStreak=(currentPlayer.currentStreak||0)+1;currentPlayer.bestStreak=Math.max(currentPlayer.bestStreak||0,currentPlayer.currentStreak);}
  else if(result==="loss"){stats.losses++;currentPlayer.totalLosses=(currentPlayer.totalLosses||0)+1;currentPlayer.currentStreak=0;}
  else if(result==="draw"){stats.draws++;currentPlayer.currentStreak=0;}
  if(Number.isFinite(score)&&(stats.best===null||(better==="low"?score<stats.best:score>stats.best)))stats.best=score;
  currentPlayer.rank=rankOf(currentPlayer);const unlocked=checkAchievements();saveData();updateHud();renderGames($(".filter.active")?.dataset.filter||"all");renderLobby();
  if(result==="win")sfx("win");else if(result==="loss")sfx("lose");else if(coins>0)sfx("coin");
  if(unlocked.length)toast(`JELVÉNY: ${unlocked[0].name} • +${unlocked.reduce((n,a)=>n+a.reward,0)} ÉRME`);else if(oldRank!==currentPlayer.rank)toast(`ÚJ RANG: ${currentPlayer.rank}!`);else if(coins>0)toast(`+${coins} ÉRME • +${xp} XP`);else toast(`+${xp} XP`);
}

function gameStatsFor(id){return currentPlayer?.gameStats?.[id]||{};}
function menuHeadlines(){
  const sf=currentPlayer.starfarer,planet=sf?.atlas?.[0],capital=sf?.colonies?.find(c=>c.id===sf.capitalId),fish=currentPlayer.fishing,bestFish=[...(fish?.bucket||[])].sort((a,b)=>(b.kg||0)-(a.kg||0))[0],missions=Object.values(currentPlayer.openRoadMissions||{}).filter(Boolean).length;
  const headlines=[
    {game:"starfarer",icon:capital?"♛":"🪐",label:capital?"FŐVILÁG":"GALAXIS",text:capital?`${capital.planet?.name||"Ismeretlen világ"} lett a Galaktikus Birodalom fővilága, ${Math.round(Number(capital.population)||0).toLocaleString("hu-HU")} lakossal.`:planet?`${planet.name||"Ismeretlen világ"}: ${planet.size||"óriási"} ${String(planet.typeName||"ismeretlen világ").toLowerCase()} ${planet.life&&planet.life!=="Nincs"?"életjelekkel":"ritka nyersanyagokkal"}.`:"Egy pilóta óriási, életet rejtő bolygó jelét fogta a Void peremén."},
    {game:"openroad",icon:"🏎️",label:"NEON HÍREK",text:missions?`${missions} biomküldetés teljesítve: egy ismeretlen sofőr uralja az országutat.`:"Titkos alagutat találtak a Neon Open Road hegyvidékén."},
    {game:"fishing",icon:"🎣",label:"VÍZPART",text:bestFish?`${bestFish.kg?.toFixed?.(1)||bestFish.kg} kilós ${bestFish.fish?.name||"óriáshal"} akadt horogra a pixelparton.`:"Gigantikus, holdfényben világító hal mozdult a Glitch-zátonynál."},
    {game:"wreck",icon:"🔨",label:"BREAKING",text:"Új toronyrekord: a bontókalapács már a felhők fölött dolgozik."},
    {game:"snake",icon:"🐍",label:"ARCADE",text:`A Neon Snake ${gameStatsFor("snake").best||"ismeretlen"} pontos útvonalat rajzolt a terminál falára.`},
    {game:"pac",icon:"🟡",label:"LABIRINTUS",text:"A Pixel Falánk egyetlen morzsát sem hagyott a neon labirintusban."},
    {game:"penalty",icon:"⚽",label:"SPORT",text:"Öt lövés, nulla félelem: a pixelkapus még mindig keresi a labdát."},
    {game:"memory",icon:"🃏",label:"REKORD",text:"Nyolc pár tűnt el rekordidő alatt a memóriafalról."},
    {game:"quiz",icon:"🧠",label:"TUDOMÁNY",text:"A Neon Kvíz gépe szerint valaki mind a hét kérdést hibátlanul tudta."},
    {game:"reaction",icon:"⚡",label:"SEBESSÉG",text:`${gameStatsFor("reaction").best||"Villámgyors"} ms-os reakció borzolta fel a gépterem közönségét.`},
    {game:"guess",icon:"🔢",label:"LOGIKA",text:"A titkos számot állítólag egyetlen pillantásból megfejtették."},
    {game:"ttt",icon:"❎",label:"PROCESSZOR",text:"A Gubuntu processzora tagadja, hogy vereséget szenvedett amőbában."},
    {game:"blackjack",icon:"🂡",label:"KASZINÓ",text:"Huszonegy! A neon osztó újabb tökéletes kéz miatt kért szünetet."},
    {game:"poker",icon:"🃏",label:"KÁRTYASZOBA",text:"Royal flush villant a videópóker asztalán, a kassza elnémult."},
    {game:"slots",icon:"🎰",label:"JACKPOT",text:"Három azonos jel és érmeeső: felébredt a Neon Slots főnyereménye."},
    {game:"dice",icon:"🎲",label:"SZERENCSE",text:"A Kocka-laborban egymás után három maximális dobást mértek."},
    {game:"rps",icon:"✊",label:"PÁRBAJ",text:"Kő győzte le az ollót a tegnap esti géptermi döntőben."}
  ];
  return shuffle(headlines).slice(0,3);
}
const ambientPick=a=>a[Math.floor(Math.random()*a.length)];
function ambientSystemLine(){
  return ambientPick([
    "NEON JÁTÉKTEREM // ONLINE",
    "GUBUNTU ARCADE SYSTEM BOOTED",
    "LAST SIGNAL: UNKNOWN",
    "INSERT COIN TO CONTINUE EXISTING REALITY",
    "RENDSZERÁLLAPOT: STABILAN KAOTIKUS",
    "A JÁTÉKTEREM FIGYEL",
    "MIRA-9 HÁTTÉRBEN SZÁMOL",
    "KOZMIKUS ADÁS FOGVA",
    "PIXELHŐMÉRSÉKLET: GYANÚSAN JÁTSZHATÓ",
    "ARCADE DIMENZIÓ STABILIZÁLVA",
    "NEON RELÉ: ZAJOS, DE BARÁTSÁGOS",
    "VALÓSÁG-SZINKRON: 87% ÉS ROMLIK",
    "GUBUNTU KABINETEK: ÉBREN",
    "MELLÉKUNIVERZUM BETÖLTVE",
    "ÉRMEFOGADÓ NYITVA // KÖVETKEZMÉNYEK ZÁRVA",
    "MINDEN JÁTÉK FIGYELI A SORÁT",
    "A PIXELEK MA KÜLÖNÖSEN ÉLNEK",
    "SYSTEM MOTTO: WIN LOUDER",
    "ARCADE LÉGKÖR: TÚLTÖLTVE"
  ]);
}
function ambientRadioItem(){
  const lines=[
    ["GUBUNTU RADIO","Mai ajánlatunk: egy félig működő rakéta és egy teljesen működő kifogás."],
    ["ARCADE ANNOUNCER","A Starfarer pilótái kérjük ne hagyják a kvantumcsomagokat a büfében."],
    ["GALAKTIKUS REKLÁM","Gubuntu Express — kézbesítünk bármit, bárhová, bármilyen bírósági következménnyel."],
    ["MIRA-9 HIRDETÉS","Új kolónia-biztosítás! Nem téríti meg a kárt, de szép papírt ad róla."],
    ["NEON HÍRSÁV","A pénteki jackpotot egy automata nyerte meg. Az automata tagadja, hogy dolgozna itt."],
    ["BÜFÉKÖZLEMÉNY","A holdponty ízű energiaital nem tartalmaz holdat. Pontyot sem. Energiát esetleg."],
    ["ARCADE ANNOUNCER","A memóriajátékosok ne hagyják el a párjaikat. Az előző mondat jogilag nem tanács."],
    ["GUBUNTU RADIO","Ha a játék visszanéz, udvariasan ints neki. Ha visszaint, szólj a személyzetnek."],
    ["MIRA-9 PERCEK","A mai motivációs idézetet töröltem. Túl optimista volt."],
    ["KOZMIKUS ADÁS","Egy távoli kolónia több lámpát kér. Nem sötét van náluk. Csak 'túl sok árnyék'."],
    ["ARCADE ANNOUNCER","A jackpot nem késik. Csak drámaian időzít."],
    ["GALAKTIKUS REKLÁM","Vedd meg az új Gubuntu sisakot! Nem véd, de nagyon meggyőzően csillog."],
    ["BÜFÉKÖZLEMÉNY","A kvantumhotdog egyszerre hideg és meleg, amíg rá nem nézel. Utána csak drága."],
    ["GUBUNTU RADIO","A Neon Open Road forgalmi hírei: az utak továbbra is túl gyorsak."],
    ["MIRA-9 HIRDETÉS","Félsz az űrtől? Próbáld ki új vákuumbiztosításunkat: legalább valaki tudni fog róla."],
    ["ARCADE IDŐJÁRÁS","Ma pixelzápor várható, néhol ritka achievement-hullással."]
  ];
  const [label,text]=ambientPick(lines);return {label,text};
}
function playerLogHtml(){
  if(!currentPlayer)return "";
  const last=games.find(g=>g.id===currentPlayer.lastGame),favorite=[...games].sort((a,b)=>(gameStatsFor(b.id).plays||0)-(gameStatsFor(a.id).plays||0))[0];
  const verdict=ambientPick((currentPlayer.plays||0)>80?["egészséges mértékű kozmikus megszállottság","haladó szintű neonfüggőség, papíron még elfogadható","olyan játékoskarrier, amit a gép már külön ment"]:((currentPlayer.totalWins||0)>20?["veszélyesen hatékony gombnyomogatás","győzelmi sorozatokra hajlamos arcade-entitás","túl kompetens ahhoz, hogy véletlen legyen"]:["ígéretes arcade anomália","korai stádiumú rekordvadász","még kalibrálás alatt álló bajnokjelölt"]));
  return `<article class="ambient-player-log"><small>PLAYER LOG</small><b>${esc(currentPlayer.name)}</b><p>${currentPlayer.plays||0} játék lejátszva. ${last?`Legutóbb itt veszett el: ${last.title}.`:"A gép még várja az első hivatalos eltűnést."} Kedvenc nyom: ${favorite?.title||"még titkos"}. A gép szerint ez „${verdict}”.</p></article>`;
}
function bootFlavor(game){
  const bank={
    chaosworks:[["FABRICATOR SAFETY CHECK BYPASSED...","Quality assurance has left the building."],["CONVEYOR MOTORS ENGAGED...","Probability is now a workplace hazard."],["QC SCANNER CALIBRATING...","The scanner requests plausible deniability."]],
    starfarer:[["BOOTING GSA-01 NAVIGATION CORE...","MIRA-9: \"I packed your optimism. It was not heavy.\""],["VOID RELAY CALIBRATING...","Please do not panic professionally."],["STAR MAP UNFOLDING...","The stars have not signed the paperwork."],["COLONY UPLINKS WARMING...","Somebody is already complaining about lamps."]],
    fishing:[["MOON CARP SIGNAL DETECTED...","Bait reality: unstable."],["LUNAR POND MODE ONLINE...","The bucket predicts something large and legally damp."],["FISH RADAR HUMMING...","One signal is too big to be polite."],["CASTING PATIENCE MODULE...","The water is looking back, casually."]],
    openroad:[["NEON ENGINE WARMING...","Road legality: questionable."],["PIXEL FUEL PRESSURIZED...","The map loaded. The roads were not consulted."],["RADIO TOWER LOCKED...","Turbo clouds are forming over the county line."],["STREETLIGHTS SYNCING...","The speed limit blinked first."]],
    wreck:[["BUILDING EMERGENCY DETECTED...","Repair permit: emotionally unavailable."],["HAMMER PROTOCOL ACTIVE...","The tower regrets being tall."],["STRUCTURAL PANIC LOADING...","Please break only the relevant pixels."]],
    slots:[["JACKPOT MACHINE AWAKENING...","Probability has filed a complaint."],["CASINO RELAYS CLICKING...","The reels are pretending this is fair."],["COIN HOPPER PRIMED...","Luck is wearing suspicious sunglasses."]],
    blackjack:[["NEON DEALER ONLINE...","The deck says everything is fair. Suspicious."],["TABLE LIGHTS WARMING...","Twenty-one is being dramatic again."],["CARD SHOE UNLOCKED...","Risk class: elegant but bitey."]],
    poker:[["VIDEO POKER TERMINAL ONLINE...","The bluff motor is quietly overheating."],["CARDS SHUFFLING...","Royal flush is either absent or hiding well."],["NEON FELT INITIALIZED...","Your poker face has been added to inventory."]],
    snake:[["RETRO CARTRIDGE BOOTING...","Snake calibration: do not overfeed the pixels."],["NEON SNAKE WAKING...","The tail follows the head. For now."],["GRID MEMORY CHECK...","Apple physics remain suspicious."]],
    pac:[["CLASSIC MAZE BOOTING...","Crumbs are reporting anxiety."],["GHOST PROTOCOL ONLINE...","Pellet density: deliciously unsafe."],["ARCADE CARTRIDGE SPINNING...","The maze has opinions about corners."]],
    penalty:[["GOALKEEPER AI STRETCHING...","The ball is still legally round."],["PENALTY DRAMA LOADING...","Grass pixels are holding their breath."]],
    dice:[["DICE LAB PRESSURIZING...","Randomness put on safety goggles."],["LUCK CHAMBER SEALED...","The cubes are discussing maximum values."]],
    rps:[["DUEL HANDSHAKE STARTED...","Rock is already overconfident."],["GESTURE MATRIX ONLINE...","Paperwork beats geology, somehow."]],
    quiz:[["QUIZ CORE INDEXING...","Several facts are standing in a line."],["NEON QUESTION BANK WARMING...","Wrong answers are trying to look natural."]],
    memory:[["MEMORY TILES SHUFFLING...","Pairs are pretending they have never met."],["RETRO CACHE CHECK...","Your short-term memory has entered the arena."]],
    reaction:[["REACTION SENSOR ARMING...","Do not click before destiny turns green."],["TURBO REFLEX MODULE...","Milliseconds are putting on running shoes."]],
    ttt:[["NEON GRID DRAWING...","Three in a row remains legally powerful."],["TIC TAC TOE CORE READY...","The center square is feeling important."]],
    guess:[["NUMBER CORE HIDING...","The secret integer is trying not to giggle."],["LOGIC CABINET BOOTING...","Range check: one to one hundred, emotionally."]]
  };
  return ambientPick(bank[game.id]||[["ARCADE CABINET BOOTING...","Insert coin to continue existing reality."],["PIXEL SYSTEM WARMING...","The machine is deciding how mysterious to be."]]);
}
function loadingFlavor(game){return bootFlavor(game).join(" ");}
function starfarerStatusReport(){
  const sf=currentPlayer?.starfarer||{},colonies=sf.colonies||[],fuel=Number(sf.fuel)||0,atlas=(sf.atlas||[]).length;
  const colony=colonies[Math.floor(Math.random()*Math.max(1,colonies.length))],lowFuel=fuel<=2;
  const lines=[
    lowFuel?"Fuel reserves are dramatically unimpressed.":"Fuel reserves are acceptable.",
    `Atlas records indexed: ${atlas}. ${atlas>80?"The cartographer has requested a second cartographer.":"The universe remains mostly unfiled."}`,
    colonies.length?`${colonies.length} colony uplinks active. ${colony?.planet?.name||"One colony"} is requesting more lamps. They did not specify why.`:"No colony uplinks active. MIRA-9 calls this financially peaceful.",
    `Crew morale is ${sf.living?.morale>75?"suspiciously high":sf.living?.morale<35?"making interesting noises":"within arcade tolerances"}.`,
    "MIRA-9 has deleted three jokes from the official log.",
    "One sensor insists we are already home. The navigation system politely disagrees.",
    "The radar sweep found a shape that moved only when nobody respected it.",
    "One colony filed a complaint against the concept of nighttime.",
    "The cargo bay is humming in B minor. Engineering denies teaching it.",
    "A probe returned with dust, static, and what appears to be a very small apology.",
    "MIRA-9 reports the mission is safe, if we redefine several words.",
    "External camera three is showing tomorrow's launch. Again."
  ];
  return `<section class="sf-status-report"><header><span>▣</span><div><small>GSA-01 STATUS REPORT</small><b>${ambientSystemLine()}</b></div></header><ul>${shuffle(lines).slice(0,4).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>`;
}
const menuTiers=[
  {id:"flagship",label:"FLAGSHIP WORLDS",title:"NAGY KALANDOK",desc:"A Gubuntu legmélyebb, legtöbb tartalommal bíró játékai.",ids:["chaosworks","voidminer","salvager","starfarer","openroad","fishing"]},
  {id:"arcade",label:"ARCADE SELECT",title:"KIEMELT JÁTÉKOK",desc:"Erős, újrajátszható arcade élmények.",ids:["towerdefense","billiards","wreck","snake","pac","penalty","memory"]},
  {id:"quick",label:"QUICK COIN",title:"GYORS MENETEK",desc:"Rövid kihívások egy újabb rekordért.",ids:["quiz","reaction","guess","ttt"]},
  {id:"lounge",label:"LUCK LOUNGE",title:"KÁRTYA ÉS SZERENCSE",desc:"Tét, döntés és neon szerencse.",ids:["blackjack","poker","slots","dice","rps"]}
];
const libraryGenres={chaosworks:"simulation",voidminer:"strategy",salvager:"strategy",towerdefense:"strategy",billiards:"strategy",starfarer:"strategy",blackjack:"card",poker:"card",guess:"puzzle",quiz:"puzzle",memory:"puzzle",ttt:"puzzle",snake:"arcade",pac:"arcade",wreck:"arcade",reaction:"arcade",penalty:"arcade",openroad:"arcade",fishing:"arcade",rps:"arcade",slots:"arcade",dice:"arcade"};
const recentlyUpgraded=new Set(["chaosworks","voidminer","salvager","billiards","guess","rps","slots","snake","pac","quiz","memory","reaction","ttt","towerdefense"]);
const launchCatalog={
  chaosworks:{modes:[["standard","STANDARD SHIFT"]],difficulties:[["normal","QUALITY NOT GUARANTEED"]],controls:"MOUSE / TOUCH • CHOOSE • PRODUCE • INSPECT",length:"OPEN-ENDED"},
  voidminer:{modes:[["standard","STANDARD DESCENT"],["daily","DAILY SEED"]],difficulties:[["normal","MINER FRIENDLY"],["hard","VOID HUNGRY"]],controls:"WASD / ARROWS • MOUSE AIM • LMB / SPACE MINE • E EXTRACT / USE • SHIFT DASH",length:"8–20 MIN"},
  salvager:{modes:[["standard","STANDARD CONTRACT"],["nightmare","NIGHTMARE CONTRACT"]],difficulties:[["normal","SALVAGE RUN"],["hard","HOSTILE STATION"]],controls:"WASD / ARROWS • MOUSE / CLICK • SPACE FIRE • SHIFT DASH • E INTERACT",length:"5–10 MIN"},
  snake:{modes:[["classic","CLASSIC"],["survival","SURVIVAL"],["time","TIME ATTACK"]],controls:"WASD / ARROW KEYS / TOUCH PAD",length:"3–10 MIN"},
  memory:{difficulties:[["easy","EASY"],["normal","NORMAL"],["hard","HARD"]],controls:"MOUSE / TOUCH",length:"4–8 MIN"},
  ttt:{modes:[["classic","CLASSIC 3×3"],["four","5×5 CONNECT 4"],["survival","SURVIVAL"]],difficulties:[["easy","EASY"],["normal","NORMAL"],["hard","HARD"]],controls:"MOUSE / TOUCH",length:"3–8 MIN"},
  towerdefense:{modes:[["campaign","CAMPAIGN"],["endless","ENDLESS"],["bossrush","BOSS RUSH"]],controls:"MOUSE • 1–6 • Q/W/E • SPACE",length:"15–35 MIN"},
  billiards:{modes:[["ai","VS AI"],["ladder","NEON LADDER"],["local","LOCAL 2 PLAYER"]],difficulties:[["easy","ROOKIE AI"],["normal","CLUB AI"],["hard","PRO AI"]],themes:[["neon","NEON CLUB"],["sunset","SUNSET ROOFTOP"],["arctic","ARCTIC CIRCUIT"],["cosmic","COSMIC VOID"]],controls:"AIM • DRAG BACK • SPIN PAD • CALL 8-BALL POCKET • SPACE",length:"5–20 MIN"},
  quiz:{controls:"MOUSE / TOUCH",length:"3–12 MIN"},openroad:{controls:"WASD / ARROWS • SHIFT • E",length:"10–30 MIN"},starfarer:{controls:"MOUSE / TOUCH",length:"15–40 MIN"},pac:{controls:"WASD / ARROWS / TOUCH PAD",length:"5–12 MIN"},reaction:{controls:"MOUSE • ARROW KEYS",length:"2–4 MIN"},
  default:{controls:"MOUSE / TOUCH",length:"2–8 MIN"}
};
function getLibraryBest(gameId){
  const stats=gameStatsFor(gameId);
  return Number(stats.bestScore??stats.highestScore??stats.bestTotalScore??stats.bestAverage??stats.best??stats.highestLevel??stats.highestCompletedRound??0);
}
const gameLibraryMeta=g=>{const stats=gameStatsFor(g.id),genre=libraryGenres[g.id]||"arcade",mastery=g.id==="towerdefense"?Math.max(1,Number(currentPlayer.tdProgress?.level)||1):Math.min(10,Math.floor((stats.plays||0)/3)+(stats.wins||0)),best=getLibraryBest(g.id),last=stats.lastPlayedAt||(currentPlayer.lastGame===g.id?currentPlayer.lastPlayedAt:null);return {stats,genre,mastery,best,last,config:launchCatalog[g.id]||launchCatalog.default}};
const libraryDate=value=>value?new Intl.DateTimeFormat("hu-HU",{month:"short",day:"2-digit"}).format(new Date(value)):"NEVER";
function renderLobby(){
  if(!currentPlayer||!$("#daily-challenges")||!$("#lobby-spotlight"))return;
  const heroEyebrow=$(".hero-copy .eyebrow"),heroHint=$(".menu-life-hint"),radio=ambientRadioItem(),ad=ambientRadioItem();
  if(heroEyebrow)heroEyebrow.textContent=ambientSystemLine();
  if(heroHint)heroHint.textContent=`TIP: ${ambientPick(["húzz az üres neon háttéren, és életre kelnek a pixelek.","a gép néha hamarabb tudja, mivel játszanál.","ha a háttér visszapislog, az hivatalosan feature.","a Gubuntu rádió ma is kozmikus zajból dolgozik."])}`;
  const daily=ensureDaily(),defs=dailyDefs(),last=games.find(g=>g.id===currentPlayer.lastGame),seed=new Date().getDate()+new Date().getMonth()*31,featured=games[(seed+currentPlayer.name.length)%games.length];
  const heroContinue=$("#hero-continue");if(heroContinue){heroContinue.hidden=!last;if(last){const when=currentPlayer.lastPlayedAt?new Intl.DateTimeFormat("hu-HU",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(currentPlayer.lastPlayedAt)):"korábban";heroContinue.innerHTML=`<button type="button" data-game="${last.id}" style="--accent:${last.color}"><span>${last.icon}</span><div><small>FOLYTATÁS</small><b>${last.title}</b><em>Utolsó játék: ${when}</em></div></button>`;}}
  $("#daily-challenges").innerHTML=`<div class="lobby-title"><p class="eyebrow">DAILY QUEST BOARD</p><h2>MAI KIHÍVÁSOK</h2></div><div class="challenge-grid">${defs.map(d=>{const value=Math.min(d.goal,daily[d.field]||0),done=value>=d.goal,claimed=daily.claimed.includes(d.id);return `<article class="challenge-card ${done?"done":""}"><span>${d.icon}</span><div><b>${d.title}</b><small>${d.desc}</small><div class="challenge-bar"><i style="width:${value/d.goal*100}%"></i></div><em>${value}/${d.goal} • +${d.reward[0]} ● +${d.reward[1]} XP ${claimed?"• KÉSZ":""}</em></div></article>`;}).join("")}</div>`;
  $("#daily-challenges").insertAdjacentHTML("afterbegin",`<section class="ambient-radio"><span>📡</span><div><small>${radio.label}</small><b>„${esc(radio.text)}”</b></div></section>`);
  const lastHtml=last?`<button class="spot-card continue-card" data-game="${last.id}" style="--accent:${last.color}"><span>${last.icon}</span><div><small>FOLYTASD</small><b>${last.title}</b><em>${gameStatsFor(last.id).best!=null?"Rekord: "+gameStatsFor(last.id).best:"Utoljára játszott"}</em></div></button>`:`<button class="spot-card continue-card" data-game="${featured.id}" style="--accent:${featured.color}"><span>🪙</span><div><small>ELSŐ KÖR</small><b>Dobd be az érmét!</b><em>Kezdésnek ezt ajánlom.</em></div></button>`;
  const capital=currentPlayer.starfarer?.colonies?.find(c=>c.id===currentPlayer.starfarer.capitalId),capitalHtml=capital?`<button class="spot-card capital-spot" data-game="starfarer" style="--accent:#ffe84c"><span>♛</span><div><small>GALAKTIKUS FŐVILÁG</small><b>${capital.planet.name}</b><em>${Math.round(capital.population).toLocaleString("hu-HU")} lakos • ${Math.round(capital.stability)}% stabilitás</em></div></button>`:"";
  const news=menuHeadlines();
  $("#lobby-spotlight").innerHTML=`<section class="arcade-newswire"><header><span>● LIVE</span><b>GUBUNTU NEWSWIRE</b></header>${news.map((n,i)=>`<button data-game="${n.game}" style="--delay:${i}"><span>${n.icon}</span><div><small>${n.label}</small><b>${esc(n.text)}</b></div></button>`).join("")}</section><section class="ambient-ad"><small>${ad.label}</small><p>„${esc(ad.text)}”</p></section>${playerLogHtml()}${capitalHtml}${lastHtml}<button class="spot-card featured-card" data-game="${featured.id}" style="--accent:${featured.color}"><span>${featured.icon}</span><div><small>MAI AJÁNLAT</small><b>${featured.title}</b><em>${featured.tag} • ${featured.cost?featured.cost+" ●":"INGYEN"}</em></div></button>`;
}
function menuAttract(g,plays,winRate){
  const vibe={chaosworks:"FACTORY HOT",voidminer:"VOID SIGNAL",starfarer:"NAV CORE",openroad:"ENGINE HOT",fishing:"MOON SIGNAL",wreck:"DAMAGE ALERT",slots:"JACKPOT HUM",blackjack:"DEALER READY",poker:"HOLD/DRAW",snake:"CARTRIDGE OK",pac:"MAZE LIVE",penalty:"GOAL CAM",memory:"MATCH GRID",reaction:"TURBO LAMP",quiz:"BRAIN TEST",guess:"LOGIC LOCK",ttt:"GRID DUEL",dice:"DICE LAB",rps:"DUEL SYNC"}[g.id]||"CABINET LIVE";
  const pulse=plays?`${plays} RUN • ${winRate}% WIN`:(g.cost?`${g.cost} COIN ENTRY`:"FREE PLAY");
  return `<div class="attract-strip"><span>${vibe}</span><i>${pulse}</i></div>`;
}
function gameBadgeFor(g,tier,plays,bestId,mostId){
  if(currentPlayer.lastGame===g.id)return "FOLYTATÁS";
  if(currentPlayer.favorites?.includes(g.id))return "KEDVENC";
  if(g.id===bestId)return "RECORD";
  if(g.id===mostId&&plays>0)return "TOP PLAY";
  if(tier==="flagship")return "FLAGSHIP";
  if(plays===0)return "NEW";
  if(g.id==="wreck")return "HOT";
  return "";
}
function sortGames(list){
  return [...list].sort((a,b)=>{
    if(currentPlayer.lastGame===a.id&&currentPlayer.lastGame!==b.id)return -1;if(currentPlayer.lastGame===b.id&&currentPlayer.lastGame!==a.id)return 1;
    const as=gameStatsFor(a.id),bs=gameStatsFor(b.id);
    if(menuSort==="az")return a.title.localeCompare(b.title,"hu");
    if(menuSort==="plays")return (bs.plays||0)-(as.plays||0);
    if(menuSort==="record")return getLibraryBest(b.id)-getLibraryBest(a.id);
    if(menuSort==="recent")return (Date.parse(bs.lastPlayedAt||0)||0)-(Date.parse(as.lastPlayedAt||0)||0)||a.title.localeCompare(b.title,"hu");
    return a.title.localeCompare(b.title,"hu");
  });
}
function cardHtml(g,tier="",bestId="",mostId=""){
  const {stats:s,genre,mastery,best,last}=gameLibraryMeta(g),plays=s.plays||0,wins=s.wins||0,winRate=plays?Math.round(wins/plays*100):0,badge=currentPlayer.lastGame===g.id?"CONTINUE":recentlyUpgraded.has(g.id)?"NEW":gameBadgeFor(g,tier,plays,bestId,mostId),fav=currentPlayer.favorites?.includes(g.id),progress=Math.min(100,mastery*10);
  return `<article class="game-card library-card ${fav?"favorite":""}" tabindex="0" role="button" aria-label="${esc(g.title)} részletei" style="--accent:${g.color}" data-genre="${genre}" data-game-card="${g.id}">
    ${badge?`<span class="game-badge">${badge}</span>`:""}
    <button class="favorite-btn ${fav?"active":""}" data-favorite="${g.id}" type="button" aria-label="${fav?"Kedvenc eltávolítása":"Kedvenc játék"}" aria-pressed="${fav}">★</button>
    <div class="game-art"><span class="art-icon">${g.icon}</span>${menuAttract(g,plays,winRate)}</div>
    <div class="game-info"><small>${genre.toUpperCase()} • MASTERY LV. ${mastery}</small><h3>${g.title}</h3><p>${g.desc}</p>
    <div class="library-record"><span>PERSONAL BEST <b>${best||"—"}</b></span><span>LAST PLAYED <b>${libraryDate(last)}</b></span></div><div class="mastery-line"><i><u style="width:${progress}%"></u></i><span>${progress}%</span></div>
    <div class="game-meta"><span>${g.cost?`${g.cost} ●`:`FREE`}</span><button class="play-btn btn-primary" data-game="${g.id}">PLAY</button></div></div></article>`;
}
function renderGames(filter=menuFilter){
  if(!currentPlayer)return;
  currentPlayer.favorites ||= [];
  menuFilter=filter||"all";try{renderLobby()}catch(error){console.error("Lobby render failed",error)}
  const query=menuQuery.trim().toLocaleLowerCase("hu-HU"),stats=games.map(g=>({g,s:gameStatsFor(g.id)})),best=[...stats].sort((a,b)=>getLibraryBest(b.g.id)-getLibraryBest(a.g.id))[0]?.g.id,most=[...stats].sort((a,b)=>(b.s.plays||0)-(a.s.plays||0))[0]?.g.id;
  const matches=g=>{const meta=gameLibraryMeta(g),filterMatch=menuFilter==="all"||menuFilter==="favorites"&&currentPlayer.favorites.includes(g.id)||menuFilter==="new"&&recentlyUpgraded.has(g.id)||meta.genre===menuFilter;return filterMatch&&(!query||`${g.title} ${g.tag} ${g.desc} ${meta.genre}`.toLocaleLowerCase("hu-HU").includes(query))};
  const shown=sortGames(games.filter(matches));
  const cards=shown.map(g=>{try{return cardHtml(g,"",best,most)}catch(error){console.error(`Card render failed: ${g.id}`,error);return `<article class="game-card library-card" style="--accent:${g.color}" data-game-card="${g.id}"><div class="game-art"><span class="art-icon">${g.icon}</span></div><div class="game-info"><small>${g.tag}</small><h3>${esc(g.title)}</h3><p>${esc(g.desc)}</p><div class="game-meta"><span>${g.cost?`${g.cost} ●`:"FREE"}</span><button class="play-btn btn-primary" data-game="${g.id}">PLAY</button></div></div></article>`}});
  $("#game-grid").innerHTML=shown.length?`<section class="game-library"><header><div><small>PROFILE-SYNCED GAME LIBRARY</small><h3>${menuFilter.toUpperCase()} CABINETS</h3><p>Single click: details • Double click / Enter: quick launch</p></div><span>${shown.length} GAMES</span></header><div class="library-grid">${cards.join("")}</div></section>`:`<section class="empty-results"><b>NO GAMES FOUND</b><p>Change the search, filter, or favorite selection.</p></section>`;
}
function launchPrefs(id){currentPlayer.launchPrefs||={};const config=launchCatalog[id]||launchCatalog.default,saved=currentPlayer.launchPrefs[id]||{};return currentPlayer.launchPrefs[id]={mode:saved.mode||config.modes?.[0]?.[0]||"default",difficulty:saved.difficulty||config.difficulties?.[0]?.[0]||"normal",theme:saved.theme||config.themes?.[0]?.[0]||"default",skip:!!saved.skip};}
function launchOptionHtml(id,label,items,active){return items?.length?`<section class="launch-option"><small>${label}</small><div>${items.map(([value,text])=>`<button type="button" data-launch-option="${id}:${value}" class="${active===value?"active":""}">${text}</button>`).join("")}</div></section>`:"";}
function renderLaunchScreen(id){
  const game=games.find(g=>g.id===id);if(!game)return;const meta=gameLibraryMeta(game),prefs=launchPrefs(id),config=meta.config,stats=meta.stats;
  launchScreenOpen=true;currentLaunchId=id;$("#game-pause-button").hidden=true;
  setStage(`<section class="unified-launch" style="--accent:${game.color}"><div class="launch-art"><span>${game.icon}</span><i></i></div><div class="launch-copy"><p class="eyebrow">${meta.genre.toUpperCase()} • MASTERY LV. ${meta.mastery}</p><h2>${esc(game.title)}</h2><p>${esc(game.desc)}</p>${launchOptionHtml("mode","MODE",config.modes,prefs.mode)}${launchOptionHtml("difficulty","DIFFICULTY",config.difficulties,prefs.difficulty)}${launchOptionHtml("theme","TABLE DESIGN",config.themes,prefs.theme)}<div class="launch-stats"><span>PERSONAL BEST <b>${meta.best||"—"}</b></span><span>LONGEST / PLAYS <b>${stats.longest||stats.longestSurvival||stats.plays||0}</b></span><span>ACHIEVEMENTS <b>${stats.wins||0} WINS</b></span><span>SESSION <b>${config.length}</b></span></div><div class="launch-controls"><small>CONTROLS</small><b>${config.controls}</b></div><label class="launch-skip"><input id="launch-skip" type="checkbox" ${prefs.skip?"checked":""}> SKIP THIS SCREEN NEXT TIME</label><div class="launch-actions"><button id="launch-back" class="btn-secondary">BACK</button><button id="launch-start" class="btn-primary">START GAME${game.cost?` • ${game.cost} ●`:""}</button></div><small class="launch-hint">ENTER STARTS • ESC RETURNS • ARROWS SWITCH OPTIONS</small></div></section>`);
  $$('[data-launch-option]').forEach(button=>button.onclick=()=>{const [key,value]=button.dataset.launchOption.split(":");prefs[key]=value;saveData();renderLaunchScreen(id)});$("#launch-skip").onchange=e=>{prefs.skip=e.target.checked;saveData()};$("#launch-start").onclick=()=>launchGame(id);$("#launch-back").onclick=()=>{closeDialogAnimated($("#game-dialog"));setMenuPaused(false);launchScreenOpen=false};
}
function showGameDetails(id){const game=games.find(g=>g.id===id);if(!game)return;const meta=gameLibraryMeta(game),fav=currentPlayer.favorites?.includes(id),progress=Math.min(100,meta.mastery*10);$("#game-details-content").innerHTML=`<section class="game-detail-panel" style="--accent:${game.color}"><div class="detail-art"><span>${game.icon}</span><i></i></div><div><p class="eyebrow">${meta.genre.toUpperCase()} • ${recentlyUpgraded.has(id)?"RECENTLY UPGRADED":"LIBRARY TITLE"}</p><h2>${esc(game.title)}</h2><p>${esc(game.desc)}</p><div class="detail-records"><span>BEST <b>${meta.best||"—"}</b></span><span>MASTERY <b>LV. ${meta.mastery}</b></span><span>PLAYS <b>${meta.stats.plays||0}</b></span><span>LAST PLAYED <b>${libraryDate(meta.last)}</b></span></div><div class="mastery-line"><i><u style="width:${progress}%"></u></i><span>${progress}%</span></div><div class="detail-actions"><button data-detail-favorite="${id}" class="btn-icon ${fav?"active":""}">★ ${fav?"PINNED":"PIN"}</button><button data-detail-play="${id}" class="btn-primary">OPEN LAUNCH SCREEN</button></div><small>Double-click or press Enter on the library card for quick launch.</small></div></section>`;openDialogAnimated($("#game-details-dialog"));}
function openGame(id,quick=false){
  const game=games.find(g=>g.id===id);if(!game)return;ensureGameLoaded(id).catch(error=>console.error(error));const source=document.querySelector(`[data-game="${CSS.escape(id)}"], [data-game-card="${CSS.escape(id)}"]`);if(source){const r=source.getBoundingClientRect();pixelBurst(r.left+r.width/2,r.top+r.height/2,game.color)}
  currentLaunchId=id;applyDialogSize();applyFontSize();$("#game-dialog").classList.toggle("starfarer-mode",id==="starfarer");$("#game-dialog").classList.toggle("scroll-game-mode",["fishing","starfarer","dice","penalty","blackjack","poker","billiards","salvager"].includes(id));$("#game-title").textContent=game.title;$("#game-kicker").textContent=`READY TO LAUNCH • ${game.tag}`;setMenuPaused(true);if(!$("#game-dialog").open)openDialogAnimated($("#game-dialog"));resetGameViewport();const prefs=launchPrefs(id);if(quick||prefs.skip)return launchGame(id);renderLaunchScreen(id);requestAnimationFrame(resetGameViewport);
}
async function launchGame(id,restart=false){
  const game=games.find(g=>g.id===id);if(!game||!currentPlayer)return;if(!restart&&currentPlayer.coins<game.cost)return toast("NINCS ELÉG ÉRMÉD!");let starter;try{starter=await ensureGameLoaded(id)}catch(error){console.error(error);toast("A JÁTÉK NEM TÖLTHETŐ BE");return}if(currentLaunchId!==id||!$("#game-dialog")?.open)return;runActiveGameCleanup();resetGameViewport();setMenuPaused(true);launchScreenOpen=false;gamePauseOpen=false;$("#game-pause-overlay").hidden=true;$("#game-pause-button").hidden=false;if(!restart)currentPlayer.coins-=game.cost;const now=new Date().toISOString(),stats=currentPlayer.gameStats[id]||={plays:0,wins:0,losses:0,draws:0,best:null};stats.lastPlayedAt=now;currentPlayer.gameStats[id]=stats;currentPlayer.lastGame=id;currentPlayer.lastPlayedAt=now;saveData();updateHud();renderLobby();activeGame=id;gameStartedAt=Date.now();sfx("coin");startGameLife(game);
  const prefs=launchPrefs(id),launchOptions={mode:prefs.mode,difficulty:prefs.difficulty,theme:prefs.theme};const [bootLine,punchLine]=bootFlavor(game);bootSfx(id);setStage(`<section class="game-boot-intro boot-${id}" style="--accent:${game.color}"><span>${game.icon}</span><small>${game.tag} CABINET BOOT</small><h3>${esc(game.title)}</h3><p><b>${esc(bootLine)}</b><em>${esc(punchLine)}</em></p><i></i></section>`);resetGameViewport();const bootTimer=setTimeout(()=>{starter(launchOptions);resetGameViewport();requestAnimationFrame(()=>{resetGameViewport();syncMobileGameControls(id);});},1450);setActiveCleanup(()=>{clearTimeout(bootTimer);releaseMobileInput();syncMobileGameControls(null);});
}
function setGamePause(paused){if(!activeGame)return;gamePauseOpen=paused;const overlay=$("#game-pause-overlay"),dialog=$("#game-dialog");overlay.hidden=!paused;dialog.classList.toggle("is-paused",paused);const tdPause=$("#td-pause");if(tdPause&&((paused&&tdPause.textContent.includes("PAUSE"))||(!paused&&tdPause.textContent.includes("RESUME"))))tdPause.click();if(paused){const game=games.find(g=>g.id===activeGame),config=(launchCatalog[activeGame]||launchCatalog.default);$("#pause-controls").textContent=`${game?.title||"GAME"} • ${config.controls}`}}
function exitActiveGame(){const dialog=$("#game-dialog");runActiveGameCleanup();gamePauseOpen=false;launchScreenOpen=false;$("#game-pause-overlay").hidden=true;closeDialogAnimated(dialog);setMenuPaused(false)}
function handlePauseAction(action){if(action==="resume")setGamePause(false);else if(action==="restart"){const id=activeGame||currentLaunchId;if(id){runActiveGameCleanup();launchGame(id,true)}}else if(action==="controls"){const panel=$("#pause-controls");panel.hidden=!panel.hidden}else if(action==="settings"){renderSettings();openDialogAnimated($("#settings-dialog"))}else if(action==="exit")exitActiveGame()}

const formatDate=value=>value?new Intl.DateTimeFormat("hu-HU",{dateStyle:"short",timeStyle:"short"}).format(new Date(value)):"—";
const formatBytes=bytes=>{const value=Math.max(0,Number(bytes)||0);if(value<1024)return `${value} B`;if(value<1024**2)return `${(value/1024).toFixed(1)} KB`;return `${(value/1024**2).toFixed(2)} MB`;};
function localStorageBytes(){let chars=0;try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i)||"";chars+=key.length+(localStorage.getItem(key)||"").length;}}catch{}return chars*2;}
function updateInstallUi(){const button=$("#install-app");if(!button)return;button.hidden=appInstalled||!deferredInstallPrompt;button.textContent=appInstalled?"✓ GUBUNTU TELEPÍTVE":"⬇ GUBUNTU TELEPÍTÉSE";}
async function installGubuntu(){if(appInstalled)return toast("A GUBUNTU MÁR TELEPÍTVE VAN");if(!deferredInstallPrompt)return toast("A TELEPÍTÉS EBBEN A BÖNGÉSZŐBEN MOST NEM ÉRHETŐ EL");const promptEvent=deferredInstallPrompt;deferredInstallPrompt=null;updateInstallUi();await promptEvent.prompt();const choice=await promptEvent.userChoice;if(choice.outcome==="accepted")toast("GUBUNTU TELEPÍTÉS ELFOGADVA");else{toast("TELEPÍTÉS MEGSZAKÍTVA");updateInstallUi();}renderAppInfo();}
function updateNetworkStatus(showToast=false){const online=navigator.onLine,status=$("#network-status");if(status){status.className=`network-status ${online?"online":"offline"}`;status.textContent=online?"● ONLINE":"● OFFLINE MÓD";}document.body.classList.toggle("offline-mode",!online);if(showToast)toast(online?"KAPCSOLAT HELYREÁLLT":"OFFLINE MÓD • A HELYI JÁTÉKOK TOVÁBB MŰKÖDNEK");}
function showUpdateNotice(worker){if(!worker)return;const notice=$("#update-notice");notice.hidden=false;notice.dataset.workerState=worker.state;}
async function registerPwa(){
  if(!("serviceWorker" in navigator))return null;
  try{swRegistration=await navigator.serviceWorker.register("service-worker.js");if(swRegistration.waiting&&navigator.serviceWorker.controller)showUpdateNotice(swRegistration.waiting);swRegistration.addEventListener("updatefound",()=>{const worker=swRegistration.installing;if(!worker)return;worker.addEventListener("statechange",()=>{if(worker.state==="installed"&&navigator.serviceWorker.controller)showUpdateNotice(worker);});});await swRegistration.update().catch(()=>{});return swRegistration;}catch(err){console.warn(`PWA registration failed • v${APP_VERSION} build ${BUILD_NUMBER}`,err);return null;}
}
function applyPwaUpdate(){const worker=swRegistration?.waiting;if(!worker)return location.reload();sessionStorage.setItem("gubuntu-update-reload","1");worker.postMessage({type:"SKIP_WAITING"});}
async function cacheReady(){if(!("caches" in window)||!window.GubuntuOfflineManifest)return false;try{const cache=await caches.open(GubuntuOfflineManifest.cacheName(APP_VERSION,BUILD_NUMBER)),required=GubuntuOfflineManifest.assets(BUILD_NUMBER),matches=await Promise.all(required.map(path=>cache.match(path)));return matches.every(Boolean);}catch{return false;}}
async function renderAppInfo(){
  if(!$("#app-info"))return;const ready=await cacheReady(),storageBytes=localStorageBytes(),installed=appInstalled||window.matchMedia?.("(display-mode: standalone)").matches,swState=swRegistration?.waiting?"FRISSÍTÉS VÁR":swRegistration?.active?.state?.toUpperCase()||("serviceWorker" in navigator?"REGISZTRÁLÁS":"NEM TÁMOGATOTT");
  const items=[["VERZIÓ",`v${APP_VERSION}`],["BUILD",BUILD_NUMBER],["MENTÉSI VERZIÓ",saveVersion],["TELEPÍTÉS",installed?"TELEPÍTVE":deferredInstallPrompt?"TELEPÍTHETŐ":"BÖNGÉSZŐBEN"],["CACHE",ready?"OFFLINE KÉSZ":"FELKÉSZÍTÉS"],["SERVICE WORKER",swState],["HÁLÓZAT",navigator.onLine?"ONLINE":"OFFLINE"],["UTOLSÓ MENTÉS",formatDate(data.savedAt)],["PROFILOK",data.profiles.length],["HELYI ADAT",formatBytes(storageBytes)]];
  $("#app-info").innerHTML=items.map(([label,value])=>`<article><small>${label}</small><b>${value}</b></article>`).join("");renderStorageUsage();
}
function renderStorageUsage(){const host=$("#storage-usage");if(!host)return;const used=localStorageBytes(),approxQuota=5*1024**2,percent=Math.min(100,Math.round(used/approxQuota*100)),high=percent>=75;host.innerHTML=`<div><b>HELYI TÁRHELY</b><span>${formatBytes(used)} / kb. 5 MB</span></div><div class="storage-meter"><i style="--used:${percent}%"></i></div><small class="${high?"storage-warning":""}">${high?"A mentés mérete magas. Érdemes exportálni egy biztonsági másolatot.":`${percent}% becsült localStorage használat • állapot rendben`}</small>`;}
function renderSaveManager(){
  const host=$("#save-manager");if(!host)return;const backups=readBackups(),main=`<article class="save-entry main-save"><div><b>FŐ MENTÉS</b><small>Utolsó mentés: ${formatDate(data.savedAt)} • ${data.profiles.length} profil • v${data.appVersion||APP_VERSION}</small></div><div class="save-entry-actions"><button class="pixel-btn secondary" data-save-action="export-main">EXPORT</button></div></article>`;
  host.innerHTML=main+backups.map((backup,index)=>`<article class="save-entry"><div><b>BACKUP ${index+1}</b><small>${formatDate(backup.savedAt)} • ${backup.data.profiles.length} profil • mentési v${backup.data.version||"?"}</small></div><div class="save-entry-actions"><button class="pixel-btn secondary" data-save-action="export-backup" data-backup-index="${index}">EXPORT</button><button class="pixel-btn primary" data-save-action="restore-backup" data-backup-index="${index}">VISSZAÁLLÍTÁS</button><button class="pixel-btn danger" data-save-action="delete-backup" data-backup-index="${index}">TÖRLÉS</button></div></article>`).join("")+(backups.length?"":`<p class="empty-state">Még nincs külön biztonsági mentés.</p>`);renderStorageUsage();
}
function createManualBackup(){const backups=readBackups();backups.unshift({savedAt:new Date().toISOString(),data:JSON.parse(JSON.stringify({...data,appVersion:APP_VERSION,build:BUILD_NUMBER}))});localStorage.setItem(backupKey,JSON.stringify(backups.slice(0,5)));renderSaveManager();renderSettings();toast("ÚJ BIZTONSÁGI MENTÉS ELKÉSZÜLT");}
function validateCurrentSave(){try{const raw=JSON.parse(localStorage.getItem(storeKey)||"");if(!validSaveShape(raw)||!raw.profiles.every(p=>p&&typeof p.id==="string"&&typeof p.name==="string"&&Array.isArray(p.inventory)&&p.gameStats&&typeof p.gameStats==="object"))throw new Error("shape");toast(`MENTÉS RENDBEN • ${raw.profiles.length} PROFIL • v${raw.version}`);}catch{toast("MENTÉSI HIBA • EXPORTÁLJ BIZTONSÁGI MÁSOLATOT");}}
function saveManagerAction(action,index){const backups=readBackups(),backup=backups[index];if(action==="export-main")return exportSave();if(!backup)return;if(action==="export-backup"){downloadJson(backup.data,`gubuntu-backup-${index+1}-${backup.savedAt.slice(0,10)}.json`);return toast("BACKUP EXPORTÁLVA");}if(action==="restore-backup"){if(!confirm(`A BACKUP ${index+1} lecseréli a fő mentést. Folytatod?`))return;const activeId=currentPlayer?.id;data=migrateData(JSON.parse(JSON.stringify(backup.data)));saveData();renderProfiles();currentPlayer=data.profiles.find(p=>p.id===activeId)||data.profiles[0]||null;if(currentPlayer){updateHud();renderGames();renderLobby();}renderSaveManager();renderAppInfo();toast("BACKUP VISSZAÁLLÍTVA");}if(action==="delete-backup"){if(!confirm(`Biztosan törlöd a BACKUP ${index+1} mentést?`))return;backups.splice(index,1);localStorage.setItem(backupKey,JSON.stringify(backups));renderSaveManager();renderSettings();toast("BACKUP TÖRÖLVE");}}
function testLocalStorage(){
  const key=`gubuntu-system-check-${Date.now()}`;
  try{localStorage.setItem(key,"ok");const ok=localStorage.getItem(key)==="ok";localStorage.removeItem(key);return ok;}catch{return false;}
}
async function runSystemCheck(){
  const ids=Array.isArray(games)?games.map(game=>game.id):[];
  return {save:testLocalStorage(),games:ids.length>0&&new Set(ids).size===ids.length&&ids.every(id=>typeof gameScriptPaths[id]==="string")&&Boolean(window.GubuntuGames),profiles:Array.isArray(data?.profiles),pwa:"serviceWorker" in navigator};
}
async function runBootSequence(){
  const setCheck=(id,state)=>{const el=$(id);if(!el)return;el.textContent=`........ ${state}`;el.className=state==="OK"?"ok":"fail";},progress=value=>$("#boot-progress")?.style.setProperty("width",`${value}%`),pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  try{const checks=await runSystemCheck();progress(18);await pause(180);setCheck("#boot-save",checks.save?"OK":"LIMITED");progress(38);await pause(180);setCheck("#boot-games",checks.games?"OK":"FAIL");progress(58);await pause(180);setCheck("#boot-profiles",checks.profiles?"OK":"FAIL");progress(76);const registration=checks.pwa?await Promise.race([registerPwa(),pause(1500).then(()=>null)]):null;const pwaReady=checks.pwa&&Boolean(registration);setCheck("#boot-pwa",pwaReady?"OK":"LIMITED");progress(100);const healthy=checks.save&&checks.games&&checks.profiles&&pwaReady;$("#boot-message").textContent=healthy?`GUBUNTU ARCADE v${APP_VERSION} • BUILD ${BUILD_NUMBER} • READY`:"CONTINUE IN BROWSER MODE";await pause(reduceMotion()?80:healthy?420:900);}catch(err){console.warn("Boot diagnostics failed",err);$("#boot-pwa").textContent="........ LIMITED";$("#boot-pwa").className="fail";$("#boot-message").textContent="CONTINUE IN BROWSER MODE";}finally{const boot=$("#boot-screen");boot?.classList.add("boot-done");$("#player-screen")?.classList.remove("hidden");setTimeout(()=>{boot?.remove();showDeviceSelectorIfNeeded();},400);}
}

function renderSettings(){
  const defaults={masterVolume:80,particleCount:60,motionIntensity:70,dialogSize:"normal",fontSize:"normal",menuBgMode:"life",menuBgStyle:"retro",crt:true,backgroundAnimation:true,performanceMode:false,graphicsProfile:"auto",vibration:true,autoThrottle:false};
  Object.entries(defaults).forEach(([key,value])=>{if(uiSettings[key]===undefined)uiSettings[key]=value;});
  $("#setting-volume").value=uiSettings.masterVolume;$("#volume-output").textContent=`${uiSettings.masterVolume}%`;
  $("#setting-particles").value=uiSettings.particleCount;$("#particles-output").textContent=`${uiSettings.particleCount}%`;
  $("#setting-motion").value=uiSettings.motionIntensity;$("#motion-output").textContent=`${uiSettings.motionIntensity}%`;
  $("#setting-bg-mode").value=uiSettings.menuBgMode;$("#setting-bg-style").value=uiSettings.menuBgStyle;
  $("#setting-device-mode").value=selectedDeviceMode()||"auto";$("#setting-graphics").value=uiSettings.graphicsProfile||"auto";
  $("#setting-crt").checked=uiSettings.crt!==false;$("#setting-background").checked=uiSettings.backgroundAnimation!==false;$("#setting-performance").checked=uiSettings.performanceMode===true;
  $("#setting-vibration").checked=uiSettings.vibration!==false;$("#setting-auto-throttle").checked=uiSettings.autoThrottle===true;
  const backups=readBackups(),latest=backups[0]?.savedAt;$("#backup-status").textContent=backups.length?`${backups.length} helyi backup • legutóbbi: ${new Intl.DateTimeFormat("hu-HU",{dateStyle:"short",timeStyle:"short"}).format(new Date(latest))}`:"Még nincs korábbi backup; a következő mentés automatikusan létrehozza.";renderSaveManager();renderAppInfo();setSettingsView(settingsView,false);
}
function updateSetting(key,value){uiSettings[key]=value;saveUiSettings();applyUiSettings();renderSettings();}
function applySettingsPreset(name){
  const presets={visual:{masterVolume:85,particleCount:100,motionIntensity:100,crt:true,backgroundAnimation:true,performanceMode:false},balanced:{masterVolume:80,particleCount:60,motionIntensity:70,crt:true,backgroundAnimation:true,performanceMode:false},performance:{masterVolume:65,particleCount:10,motionIntensity:10,crt:false,backgroundAnimation:false,performanceMode:true}};
  Object.assign(uiSettings,presets[name]||presets.balanced);saveUiSettings();applyUiSettings();renderSettings();toast(`${name==="visual"?"LÁTVÁNYOS":name==="performance"?"TELJESÍTMÉNY":"KIEGYENSÚLYOZOTT"} PRESET AKTÍV`);
}

function init(){
  window.addEventListener("error",e=>reportRuntimeError(e.message,e.error));
  window.addEventListener("unhandledrejection",e=>reportRuntimeError("Unhandled promise rejection",e.reason));
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;appInstalled=false;updateInstallUi();renderAppInfo();});
  window.addEventListener("appinstalled",()=>{appInstalled=true;deferredInstallPrompt=null;updateInstallUi();renderAppInfo();toast("GUBUNTU SIKERESEN TELEPÍTVE");});
  window.addEventListener("online",()=>updateNetworkStatus(true));window.addEventListener("offline",()=>updateNetworkStatus(true));updateNetworkStatus(false);updateInstallUi();
  window.addEventListener("resize",handleStableViewportResize,{passive:true});
  window.addEventListener("orientationchange",handleMobileOrientationChange,{passive:true});
  window.addEventListener("blur",releaseMobileInput);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)releaseMobileInput();});
  navigator.serviceWorker?.addEventListener("controllerchange",()=>{if(sessionStorage.getItem("gubuntu-update-reload")){sessionStorage.removeItem("gubuntu-update-reload");sessionStorage.setItem("gubuntu-updated","1");location.reload();}});
  document.addEventListener("close",e=>{syncModalScrollLock();const id=e.target?.dataset?.returnFocusId;if(id)document.getElementById(id)?.focus?.();},true);
  saveData();renderProfiles();renderGames();
  $("#footer-version").textContent=`v${APP_VERSION}`;$("#footer-build").textContent=BUILD_NUMBER;
  applyUiSettings();
  let adminClicks=0,adminTimer=null;
  document.addEventListener("click",e=>{if(e.target.closest("button,a"))sfx("click");});
  let menuPointerFrame=0,menuPointerX=20,menuPointerY=12;
  $("#arcade-screen")?.addEventListener("pointermove",e=>{if(reduceMotion()||resolvedGraphicsProfile()!=="high")return;menuPointerX=Math.round(e.clientX/window.innerWidth*100);menuPointerY=Math.round(e.clientY/window.innerHeight*100);if(menuPointerFrame)return;menuPointerFrame=requestAnimationFrame(()=>{menuPointerFrame=0;const screen=$("#arcade-screen");screen?.style.setProperty("--mx",`${menuPointerX}%`);screen?.style.setProperty("--my",`${menuPointerY}%`);});},{passive:true});
  $("#arcade-screen")?.addEventListener("pointerover",e=>{
    const title=e.target.closest("[data-menu-burst]");
    if(title&&!title.dataset.hot){title.dataset.hot="1";menuLifeApi?.burstEl(title,true);setTimeout(()=>delete title.dataset.hot,900);}
  });
  $("#arcade-screen")?.addEventListener("click",e=>{
    const modeBtn=e.target.closest("[data-menu-mode]"),styleBtn=e.target.closest("[data-bg-style]");
    if(modeBtn){$$('[data-menu-mode]').forEach(btn=>btn.classList.toggle("active",btn===modeBtn));uiSettings.menuBgMode=modeBtn.dataset.menuMode;saveUiSettings();menuLifeApi?.setMode(modeBtn.dataset.menuMode);toast(`HÁTTÉR MÓD: ${modeBtn.dataset.menuMode.toUpperCase()}`);}
    if(styleBtn){uiSettings.menuBgStyle=styleBtn.dataset.bgStyle;saveUiSettings();applyMenuBgStyle();toast(`HÁTTÉR STÍLUS: ${styleBtn.dataset.bgStyle.toUpperCase()}`);}
    const toy=e.target.closest("[data-menu-toy]"),machine=e.target.closest("[data-machine-control],.machine-screen,.machine-top"),target=toy||machine||modeBtn||styleBtn;
    if(!target)return;
    target.classList.add("menu-pop");setTimeout(()=>target.classList.remove("menu-pop"),320);
    const r=target.getBoundingClientRect(),bursts=toy?4:2;
    for(let i=0;i<bursts;i++)setTimeout(()=>menuLifeApi?.burstAt(r.left+r.width*(.25+Math.random()*.5),r.top+r.height*(.25+Math.random()*.5),true),i*70);
    if(toy?.dataset.menuToy==="coin"&&currentPlayer){const now=Date.now();if(now-(currentPlayer.menuBonusAt||0)>15000){currentPlayer.menuBonusAt=now;currentPlayer.coins+=1;saveData();updateHud();toast("+1 BÓNUSZ ÉRME A MENÜBŐL");}else toast("AZ ÉRMEADAGOLÓ TÖLTŐDIK...");}
    if(toy?.dataset.menuToy==="ghost")$(".pixel-ghost")?.classList.add("ghost-party");
    setTimeout(()=>$(".pixel-ghost")?.classList.remove("ghost-party"),850);
  });
  $$(".brand-cube,.mini-logo").forEach(logo=>logo.onclick=()=>{clearTimeout(adminTimer);adminTimer=setTimeout(()=>adminClicks=0,1800);if(++adminClicks>=7){adminClicks=0;const pass=prompt("SECRET ADMIN CODE");if(pass==="gubuntu-admin"){renderAdmin();openDialogAnimated($("#admin-dialog"));sfx("win");}else if(pass!==null)toast("HIBÁS ADMIN KÓD");}});
  window.addEventListener("scroll",updateTopbarCompact,{passive:true});updateTopbarCompact();applyDynamicGameLayout();
  $("#toggle-sound").onclick=()=>{uiSettings.sound=!soundEnabled();saveUiSettings();applySoundButton();if(soundEnabled())sfx("win");pulseEl($("#toggle-sound"));};
  $("#game-search")?.addEventListener("input",e=>{menuQuery=e.target.value;renderGames(menuFilter);});
  $("#game-sort")?.addEventListener("change",e=>{menuSort=e.target.value;renderGames(menuFilter);});
  $$("[data-shop-font-size]").forEach(btn=>btn.onclick=()=>{uiSettings.shopFontSize=btn.dataset.shopFontSize;saveUiSettings();applyShopFontSize();sfx("click");});
  $("#avatar-picker").innerHTML=avatars.map((a,i)=>`<button type="button" class="avatar-choice ${i===0?"active":""}" data-avatar="${a}">${a}</button>`).join("");
  let selectedAvatar=avatars[0];
  $("#avatar-picker").onclick=e=>{const btn=e.target.closest(".avatar-choice");if(!btn)return;$$('.avatar-choice').forEach(x=>x.classList.remove("active"));btn.classList.add("active");selectedAvatar=btn.dataset.avatar;};
  $("#new-player-btn").onclick=()=>openDialogAnimated($("#profile-dialog"));
  $("#device-dialog").onclick=e=>{const choice=e.target.closest("[data-device-choice]");if(choice)setDeviceMode(choice.dataset.deviceChoice);};
  $("#profile-form").onsubmit=e=>{e.preventDefault();const name=$("#player-name").value.trim();if(!name)return;const colors=["#31f5ff","#ff3eb5","#ffe84c","#72ff77","#8e5bff"];const p=makeDefaultPlayer({id:crypto.randomUUID?.()||String(Date.now()),name,avatar:selectedAvatar,color:colors[data.profiles.length%colors.length],seasonId:BATTLE_PASS_SEASON.id});data.profiles.push(p);saveData();renderProfiles();closeDialogAnimated($("#profile-dialog"));e.target.reset();selectPlayer(p.id);};
  $("#profile-list").onclick=e=>{const del=e.target.closest("[data-delete]");if(del){e.stopPropagation();if(confirm("Biztosan törlöd ezt a játékosprofilt?")){data.profiles=data.profiles.filter(p=>p.id!==del.dataset.delete);saveData();renderProfiles();}return;}const card=e.target.closest("[data-id]");if(card)selectPlayer(card.dataset.id);};
  $("#change-player").onclick=()=>{if(menuLifeCleanup)menuLifeCleanup();$("#arcade-screen").classList.add("hidden");$("#player-screen").classList.remove("hidden");currentPlayer=null;renderProfiles();};
  $("#open-shop").onclick=()=>{applyShopFontSize();renderShop();openDialogAnimated($("#shop-dialog"));};
  $("#open-battle-pass").onclick=()=>{renderBattlePass();openDialogAnimated($("#battle-pass-dialog"));};
  $("#battle-pass-content").onclick=e=>{const claim=e.target.closest("[data-pass-claim]"),subscription=e.target.closest("[data-subscription]");if(claim)claimBattlePassReward(claim.dataset.passClaim,Number(claim.dataset.passLevel));if(subscription)setLocalSubscription(subscription.dataset.subscription);};
  $("#open-settings").onclick=()=>{renderSettings();openDialogAnimated($("#settings-dialog"));};
  $("#open-progress").onclick=()=>{progressView="statistics";renderProgress();openDialogAnimated($("#progress-dialog"));};
  $("#settings-dialog").onclick=e=>{const tab=e.target.closest("[data-settings-tab]");if(tab)setSettingsView(tab.dataset.settingsTab);};
  $("#progress-content").onclick=e=>{const tab=e.target.closest("[data-progress-tab]");if(tab)setProgressView(tab.dataset.progressTab);};
  $("#hero-continue").onclick=e=>{const btn=e.target.closest("[data-game]");if(btn)openGame(btn.dataset.game);};
  $$('[data-settings-preset]').forEach(btn=>btn.onclick=()=>applySettingsPreset(btn.dataset.settingsPreset));
  $("#setting-volume").oninput=e=>updateSetting("masterVolume",Number(e.target.value));
  $("#setting-particles").oninput=e=>updateSetting("particleCount",Number(e.target.value));
  $("#setting-motion").oninput=e=>updateSetting("motionIntensity",Number(e.target.value));
  $("#setting-bg-mode").onchange=e=>updateSetting("menuBgMode",e.target.value);$("#setting-bg-style").onchange=e=>updateSetting("menuBgStyle",e.target.value);
  $("#setting-device-mode").onchange=e=>setDeviceMode(e.target.value,{closeSelector:false});$("#setting-graphics").onchange=e=>updateSetting("graphicsProfile",e.target.value);
  $("#setting-crt").onchange=e=>updateSetting("crt",e.target.checked);$("#setting-background").onchange=e=>updateSetting("backgroundAnimation",e.target.checked);$("#setting-performance").onchange=e=>updateSetting("performanceMode",e.target.checked);
  $("#setting-vibration").onchange=e=>updateSetting("vibration",e.target.checked);$("#setting-auto-throttle").onchange=e=>updateSetting("autoThrottle",e.target.checked);
  $("#settings-export").onclick=exportSave;$("#settings-import").onclick=()=>$("#import-file").click();
  $("#install-app").onclick=installGubuntu;$("#apply-update").onclick=applyPwaUpdate;$("#refresh-app-info").onclick=renderAppInfo;$("#create-backup").onclick=createManualBackup;$("#validate-save").onclick=validateCurrentSave;
  $("#save-manager").onclick=e=>{const btn=e.target.closest("[data-save-action]");if(btn)saveManagerAction(btn.dataset.saveAction,Number(btn.dataset.backupIndex));};
  $("#export-save").onclick=exportSave;
  $("#import-save").onclick=()=>$("#import-file").click();
  $("#import-file").onchange=e=>{importSave(e.target.files[0]);e.target.value="";};
  $("#reset-player").onclick=resetCurrentPlayer;
  $("#shop-grid").onclick=e=>{const btn=e.target.closest("[data-shop]");if(btn)shopAction(btn.dataset.shop);};
  const toggleLibraryFavorite=id=>{currentPlayer.favorites ||= [];currentPlayer.favorites=currentPlayer.favorites.includes(id)?currentPlayer.favorites.filter(x=>x!==id):[...currentPlayer.favorites,id];saveData();renderGames(menuFilter);toast(currentPlayer.favorites.includes(id)?"FAVORITE CABINET SAVED":"FAVORITE REMOVED")};
  $("#game-grid").onclick=e=>{const fav=e.target.closest("[data-favorite]");if(fav){e.stopPropagation();toggleLibraryFavorite(fav.dataset.favorite);return}const play=e.target.closest("[data-game]");if(play){e.stopPropagation();openGame(play.dataset.game);return}const card=e.target.closest("[data-game-card]");if(card)showGameDetails(card.dataset.gameCard)};
  $("#game-grid").ondblclick=e=>{const card=e.target.closest("[data-game-card]");if(card&&!e.target.closest("button")){e.preventDefault();openGame(card.dataset.gameCard,true)}};
  $("#game-grid").onkeydown=e=>{const card=e.target.closest("[data-game-card]");if(!card)return;if(e.key==="Enter"){e.preventDefault();openGame(card.dataset.gameCard,true)}else if(e.key===" "){e.preventDefault();showGameDetails(card.dataset.gameCard)}};
  $("#game-details-content").onclick=e=>{const play=e.target.closest("[data-detail-play]"),fav=e.target.closest("[data-detail-favorite]");if(play){closeDialogAnimated($("#game-details-dialog"));openGame(play.dataset.detailPlay)}else if(fav){toggleLibraryFavorite(fav.dataset.detailFavorite);showGameDetails(fav.dataset.detailFavorite)}};
  $(".lobby-panel").onclick=e=>{const btn=e.target.closest("[data-game]");if(btn)openGame(btn.dataset.game);};
  $(".filter-row").onclick=e=>{const btn=e.target.closest(".filter");if(!btn)return;$$('.filter').forEach(x=>x.classList.remove("active"));btn.classList.add("active");menuFilter=btn.dataset.filter;renderGames(menuFilter);};
  $("#toggle-fullscreen").onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{toast("FULLSCREEN IS NOT AVAILABLE")}};
  $("#toggle-sidebar").onclick=()=>document.body.classList.toggle("sidebar-open");
  document.addEventListener("pointerdown",e=>{if(document.body.classList.contains("sidebar-open")&&!e.target.closest("#arcade-sidebar,#toggle-sidebar"))document.body.classList.remove("sidebar-open");});
  $("#arcade-sidebar").onclick=e=>{const item=e.target.closest("[data-nav]");if(!item)return;document.body.classList.remove("sidebar-open");const action=item.dataset.nav;if(action==="daily")$("#daily-challenges")?.scrollIntoView({behavior:"smooth",block:"center"});else if(action==="achievements"||action==="statistics"||action==="profile"){progressView=action==="profile"?"statistics":action;renderProgress();openDialogAnimated($("#progress-dialog"))}else if(action==="battle"){renderBattlePass();openDialogAnimated($("#battle-pass-dialog"))}else if(action==="shop"){renderShop();openDialogAnimated($("#shop-dialog"))}else if(action==="settings"){renderSettings();openDialogAnimated($("#settings-dialog"))}};
  $("#game-pause-button").onclick=()=>setGamePause(true);
  $("#game-pause-overlay").onclick=e=>{const button=e.target.closest("[data-pause-action]");if(button)handlePauseAction(button.dataset.pauseAction)};
  window.addEventListener("keydown",e=>{if(!$("#game-dialog").open)return;if(launchScreenOpen){if(e.key==="Enter"&&!e.target.matches("input,button")){e.preventDefault();launchGame(currentLaunchId)}else if(e.key==="Escape"){e.preventDefault();closeDialogAnimated($("#game-dialog"));setMenuPaused(false);launchScreenOpen=false}else if(e.key==="ArrowLeft"||e.key==="ArrowRight"){const buttons=$$(".launch-option button");if(!buttons.length)return;e.preventDefault();const active=document.activeElement?.matches?.(".launch-option button")?document.activeElement:buttons.find(button=>button.classList.contains("active"))||buttons[0],index=buttons.indexOf(active),next=buttons[(index+(e.key==="ArrowRight"?1:-1)+buttons.length)%buttons.length];next.focus();next.click()}}else if(activeGame&&e.key==="Escape"){e.preventDefault();setGamePause(!gamePauseOpen)}});
  $$('[data-close]').forEach(btn=>btn.onclick=()=>{const dialog=document.getElementById(btn.dataset.close);closeDialogAnimated(dialog);if(dialog?.id==="game-dialog"){runActiveGameCleanup();launchScreenOpen=false;gamePauseOpen=false;$("#game-pause-overlay").hidden=true;setMenuPaused(false)}});
  $("#game-dialog").addEventListener("close",()=>{runActiveGameCleanup();launchScreenOpen=false;gamePauseOpen=false;$("#game-pause-overlay").hidden=true;setMenuPaused(false)});
  runBootSequence();if(sessionStorage.getItem("gubuntu-updated")){sessionStorage.removeItem("gubuntu-updated");setTimeout(()=>toast(`GUBUNTU v${APP_VERSION} FRISSÍTVE`),1400);}
}

init();
