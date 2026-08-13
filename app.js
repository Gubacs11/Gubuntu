"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const storeKey = "gubuntu-arcade-v1";
const backupKey = `${storeKey}-backups`;
const saveVersion = 3;
const APP_VERSION = "1.0.0";
const BUILD_NUMBER = 121;
const avatars = ["👾", "🤖", "👻", "🦊", "🐸", "🧙", "🥷", "🦖"];

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
];

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
  slots:{layout:"direct"},blackjack:{layout:"direct"},poker:{layout:"direct"},dice:{layout:"direct"}
};
const mobileInput={up:false,down:false,left:false,right:false,action:false,action2:false,fire:false,interact:false,boost:false,brake:false,pause:false,moveX:0,moveY:0,aimX:0,aimY:0,pointers:new Map(),resetters:new Set(),resetSerial:0};
let appliedDeviceMode=null,mountedMobileControlKey="",mobileViewportState={width:innerWidth,height:innerHeight,orientation:innerWidth>=innerHeight?"landscape":"portrait"},mobileLayoutTimer=0;
const deviceCapabilities=()=>{const coarse=matchMedia?.("(pointer: coarse)").matches===true,hoverless=matchMedia?.("(hover: none)").matches===true,touch=(navigator.maxTouchPoints||0)>0,small=Math.min(screen.width||innerWidth,screen.height||innerHeight)<820;return{coarse,hoverless,touch,small,mobile:(coarse&&hoverless&&touch)||(touch&&small)};};
const selectedDeviceMode=()=>DEVICE_MODES.has(uiSettings.deviceMode)?uiSettings.deviceMode:null;
const effectiveDeviceMode=()=>{const selected=selectedDeviceMode();return selected&&selected!=="auto"?selected:(deviceCapabilities().mobile?"mobile":"desktop");};
const isMobileMode=()=>effectiveDeviceMode()==="mobile";
const resolvedGraphicsProfile=()=>{const chosen=uiSettings.graphicsProfile||"auto";if(chosen!=="auto")return chosen;if(!isMobileMode())return uiSettings.performanceMode?"medium":"high";return Number(navigator.deviceMemory||4)<=3||Number(navigator.hardwareConcurrency||4)<=4?"low":"medium";};
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
  if(reduceMotion())return;
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
  }catch(err){console.error("Save failed",err);toast("MENT?S HIBA: a b?ng?sz? t?rhelye nem ?rhat?");}
}
function esc(value){ const node=document.createElement("div"); node.textContent=value; return node.innerHTML; }
function shuffle(array){ return [...array].sort(()=>Math.random()-.5); }
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
function setStage(html){ $("#game-stage").innerHTML=html; }
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
  menuLifeApi?.setMode?.(uiSettings.menuBgMode||"life");
}


function startMenuLife(){
  if(menuLifeCleanup)return;
  const canvas=$("#menu-life");if(!canvas)return;
  const ctx=canvas.getContext("2d"),cell=12;let colors=menuBgPalette();
  let cols=0,rows=0,grid=[],next=[],particles=[],running=true,raf=0,last=0,paint=false,hue=0,mode=uiSettings.menuBgMode||"life",modeTick=0,snake=[],food=null,pong={x:80,y:80,vx:3,vy:2.4},traffic=[],stars=[],matrix=[],radar=0;
  const idx=(x,y)=>y*cols+x;
  const seed=()=>{
    grid=Array(cols*rows).fill(0);next=Array(cols*rows).fill(0);
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(Math.random()<.13||((x+y)%17===0&&Math.random()<.45))grid[idx(x,y)]=1+Math.floor(Math.random()*colors.length);
    [["glider",4,5],["blinker",Math.floor(cols*.72),Math.floor(rows*.32)],["block",Math.floor(cols*.22),Math.floor(rows*.64)]].forEach(([type,x,y])=>{
      const pts=type==="glider"?[[1,0],[2,1],[0,2],[1,2],[2,2]]:type==="blinker"?[[0,0],[1,0],[2,0]]:[[0,0],[1,0],[0,1],[1,1]];
      pts.forEach(([dx,dy])=>{if(x+dx<cols&&y+dy<rows)grid[idx(x+dx,y+dy)]=1+((dx+dy)%colors.length);});
    });
  };
  const resize=()=>{const rect=canvas.getBoundingClientRect();canvas.width=Math.max(320,Math.floor(rect.width));canvas.height=Math.max(240,Math.floor(rect.height));cols=Math.ceil(canvas.width/cell);rows=Math.ceil(canvas.height/cell);seed();};
  const burst=(clientX,clientY,big=false)=>{
    const rect=canvas.getBoundingClientRect(),gx=Math.floor((clientX-rect.left)/cell),gy=Math.floor((clientY-rect.top)/cell),r=big?4:2;
    for(let y=gy-r;y<=gy+r;y++)for(let x=gx-r;x<=gx+r;x++)if(x>=0&&y>=0&&x<cols&&y<rows&&Math.hypot(x-gx,y-gy)<=r+.3)grid[idx(x,y)]=1+((x+y+hue)%colors.length);
    for(let i=0;i<Math.round((big?18:8)*Number(uiSettings.particleCount??60)/60);i++)particles.push({x:clientX-rect.left,y:clientY-rect.top,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,life:24+Math.random()*20,color:colors[(hue+i)%colors.length]});
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
    if(!running)return;raf=requestAnimationFrame(draw);if(menuRafPaused||document.hidden||uiSettings.backgroundAnimation===false)return;if(now-last>170){if(mode==="life")step();stepMode();last=now;}
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
    burstEl:(el,big=true)=>{const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,big);}
  };
  const visibility=()=>{if(document.hidden)up();setMenuPaused(document.hidden||$("#game-dialog")?.open);};resize();resetMode();document.addEventListener("visibilitychange",visibility);window.addEventListener("pointerdown",down,{passive:false});window.addEventListener("pointermove",move);window.addEventListener("pointerup",up);window.addEventListener("pointercancel",up);window.addEventListener("blur",up);window.addEventListener("resize",resize);raf=requestAnimationFrame(draw);
  menuLifeCleanup=()=>{up();running=false;cancelAnimationFrame(raf);document.removeEventListener("visibilitychange",visibility);window.removeEventListener("pointerdown",down);window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",up);window.removeEventListener("pointercancel",up);window.removeEventListener("blur",up);window.removeEventListener("resize",resize);menuLifeCleanup=null;menuLifeApi=null;};
}

function startGameLife(game){
  if(gameLifeCleanup)gameLifeCleanup();
  const canvases=[$("#game-life-left"),$("#game-life-right")].filter(Boolean);if(!canvases.length)return;
  const palettes={fishing:["#28d7d1","#31f5ff","#72ff77","#d9e5ff"],openroad:["#ff7043","#ffe84c","#8e5bff","#31f5ff"],penalty:["#72ff77","#f8f4ff","#ffe84c","#31f5ff"],blackjack:["#ff3eb5","#ffe84c","#f8f4ff","#72ff77"],poker:["#8e5bff","#ff3eb5","#f8f4ff","#ffe84c"],slots:["#ff3eb5","#ffe84c","#31f5ff","#72ff77"],dice:["#8e5bff","#31f5ff","#ffe84c","#f8f4ff"],snake:["#72ff77","#31f5ff","#ffe84c","#0a4"],pac:["#ffe84c","#31f5ff","#ff3eb5","#f8f4ff"],wreck:["#ff7043","#ffe84c","#31f5ff","#ff3eb5"],memory:["#31f5ff","#8e5bff","#ffe84c","#f8f4ff"],reaction:["#ffe84c","#72ff77","#ff3eb5","#31f5ff"]};
  const colors=palettes[game.id]||[game.color||"#31f5ff","#ff3eb5","#ffe84c","#72ff77"],cell=10,glyphs={fishing:"fish",openroad:"road",penalty:"ball",blackjack:"card",poker:"card",slots:"coin",dice:"pip",snake:"snake",pac:"dot",wreck:"spark"};
  const states=canvases.map((canvas,side)=>({canvas,ctx:canvas.getContext("2d"),side,cols:0,rows:0,grid:[],next:[]}));let raf=0,last=0,running=true;
  const idx=(st,x,y)=>y*st.cols+x;
  const seed=st=>{st.grid=Array(st.cols*st.rows).fill(0);st.next=Array(st.cols*st.rows).fill(0);for(let y=0;y<st.rows;y++)for(let x=0;x<st.cols;x++)if(Math.random()<.12||((x*3+y+st.side*7)%23===0&&Math.random()<.55))st.grid[idx(st,x,y)]=1+((x+y+st.side)%colors.length);[["glider",2,3],["glider",Math.max(1,st.cols-6),Math.floor(st.rows*.32)],["block",Math.floor(st.cols*.45),Math.floor(st.rows*.72)]].forEach(([type,x,y],n)=>{const pts=type==="block"?[[0,0],[1,0],[0,1],[1,1]]:[[1,0],[2,1],[0,2],[1,2],[2,2]];pts.forEach(([dx,dy])=>{if(x+dx>=0&&y+dy>=0&&x+dx<st.cols&&y+dy<st.rows)st.grid[idx(st,x+dx,y+dy)]=1+((n+dx+dy)%colors.length);});});};
  const resize=()=>states.forEach(st=>{const r=st.canvas.getBoundingClientRect();st.canvas.width=Math.max(48,Math.floor(r.width));st.canvas.height=Math.max(180,Math.floor(r.height));st.cols=Math.ceil(st.canvas.width/cell);st.rows=Math.ceil(st.canvas.height/cell);seed(st);});
  const burst=(st,clientX,clientY,big=false)=>{const r=st.canvas.getBoundingClientRect(),gx=Math.floor((clientX-r.left)/cell),gy=Math.floor((clientY-r.top)/cell),rad=big?4:2;for(let y=gy-rad;y<=gy+rad;y++)for(let x=gx-rad;x<=gx+rad;x++)if(x>=0&&y>=0&&x<st.cols&&y<st.rows&&Math.hypot(x-gx,y-gy)<=rad+.35)st.grid[idx(st,x,y)]=1+((x+y+Date.now())%colors.length);};
  const step=st=>{let live=0;for(let y=0;y<st.rows;y++)for(let x=0;x<st.cols;x++){let n=0,c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const v=st.grid[idx(st,(x+dx+st.cols)%st.cols,(y+dy+st.rows)%st.rows)];if(v){n++;c+=v;}}const me=st.grid[idx(st,x,y)];st.next[idx(st,x,y)]=me?(n===2||n===3?me:0):(n===3?Math.max(1,Math.round(c/3)%colors.length):0);if(st.next[idx(st,x,y)])live++;}[st.grid,st.next]=[st.next,st.grid];if(live<8)seed(st);};
  const drawMotif=(ctx,x,y,color,kind)=>{ctx.fillStyle=color;if(kind==="fish"){ctx.fillRect(x,y+3,10,5);ctx.fillRect(x+10,y+4,3,3);ctx.fillRect(x-3,y+4,3,3);}else if(kind==="road"){ctx.fillRect(x+4,y,4,14);ctx.fillStyle="#ffe84c";ctx.fillRect(x+5,y+2,2,3);ctx.fillRect(x+5,y+8,2,3);}else if(kind==="card"){ctx.fillRect(x,y,11,14);ctx.fillStyle="#08061d";ctx.fillRect(x+2,y+2,7,10);}else if(kind==="ball"){ctx.fillRect(x+3,y,6,12);ctx.fillRect(x,y+3,12,6);}else if(kind==="snake"){ctx.fillRect(x,y+4,13,5);ctx.fillRect(x+9,y+1,5,5);}else{ctx.fillRect(x+2,y+2,8,8);ctx.fillRect(x+5,y,2,12);ctx.fillRect(x,y+5,12,2);}};
  const draw=now=>{if(!running)return;raf=requestAnimationFrame(draw);if(now-last>170){states.forEach(step);last=now;}states.forEach(st=>{const ctx=st.ctx;ctx.clearRect(0,0,st.canvas.width,st.canvas.height);ctx.globalAlpha=.7;for(let y=0;y<st.rows;y++)for(let x=0;x<st.cols;x++){const v=st.grid[idx(st,x,y)];if(!v)continue;const px=x*cell,py=y*cell,color=colors[(v-1)%colors.length];if((x+y+st.side)%7===0)drawMotif(ctx,px,py,color,glyphs[game.id]||"spark");else{ctx.fillStyle=color;ctx.fillRect(px+3,py+3,cell-5,cell-5);}}ctx.globalAlpha=1;});};
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
  Object.assign(currentPlayer,{coins:100,xp:0,plays:0,bestStreak:0,currentStreak:0,totalWins:0,totalLosses:0,rank:"ÚJONC",inventory:[],achievements:[],gameStats:{},openRoadMissions:{},tdProgress:{xp:0,level:1,unlockedMaps:["neon"],unlockedLoadouts:["standard"],completedContracts:[],bestScores:{}},daily:null,lastGame:null});
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
    {game:"starfarer",icon:capital?"♛":"🪐",label:capital?"FŐVILÁG":"GALAXIS",text:capital?`${capital.planet.name} lett a Galaktikus Birodalom fővilága, ${Math.round(capital.population).toLocaleString("hu-HU")} lakossal.`:planet?`${planet.name}: ${planet.size||"óriási"} ${planet.typeName.toLowerCase()} ${planet.life!=="Nincs"?"életjelekkel":"ritka nyersanyagokkal"}.`:"Egy pilóta óriási, életet rejtő bolygó jelét fogta a Void peremén."},
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
  {id:"flagship",label:"FLAGSHIP WORLDS",title:"NAGY KALANDOK",desc:"A Gubuntu legmélyebb, legtöbb tartalommal bíró játékai.",ids:["voidminer","salvager","starfarer","openroad","fishing"]},
  {id:"arcade",label:"ARCADE SELECT",title:"KIEMELT JÁTÉKOK",desc:"Erős, újrajátszható arcade élmények.",ids:["towerdefense","billiards","wreck","snake","pac","penalty","memory"]},
  {id:"quick",label:"QUICK COIN",title:"GYORS MENETEK",desc:"Rövid kihívások egy újabb rekordért.",ids:["quiz","reaction","guess","ttt"]},
  {id:"lounge",label:"LUCK LOUNGE",title:"KÁRTYA ÉS SZERENCSE",desc:"Tét, döntés és neon szerencse.",ids:["blackjack","poker","slots","dice","rps"]}
];
const libraryGenres={voidminer:"strategy",salvager:"strategy",towerdefense:"strategy",billiards:"strategy",starfarer:"strategy",blackjack:"card",poker:"card",guess:"puzzle",quiz:"puzzle",memory:"puzzle",ttt:"puzzle",snake:"arcade",pac:"arcade",wreck:"arcade",reaction:"arcade",penalty:"arcade",openroad:"arcade",fishing:"arcade",rps:"arcade",slots:"arcade",dice:"arcade"};
const recentlyUpgraded=new Set(["voidminer","salvager","billiards","guess","rps","slots","snake","pac","quiz","memory","reaction","ttt","towerdefense"]);
const launchCatalog={
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
const gameLibraryMeta=g=>{const stats=gameStatsFor(g.id),genre=libraryGenres[g.id]||"arcade",mastery=g.id==="towerdefense"?ensureTdProgress()?.level||1:Math.min(10,Math.floor((stats.plays||0)/3)+(stats.wins||0)),best=getLibraryBest(g.id),last=stats.lastPlayedAt||(currentPlayer.lastGame===g.id?currentPlayer.lastPlayedAt:null);return {stats,genre,mastery,best,last,config:launchCatalog[g.id]||launchCatalog.default}};
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
  const vibe={voidminer:"VOID SIGNAL",starfarer:"NAV CORE",openroad:"ENGINE HOT",fishing:"MOON SIGNAL",wreck:"DAMAGE ALERT",slots:"JACKPOT HUM",blackjack:"DEALER READY",poker:"HOLD/DRAW",snake:"CARTRIDGE OK",pac:"MAZE LIVE",penalty:"GOAL CAM",memory:"MATCH GRID",reaction:"TURBO LAMP",quiz:"BRAIN TEST",guess:"LOGIC LOCK",ttt:"GRID DUEL",dice:"DICE LAB",rps:"DUEL SYNC"}[g.id]||"CABINET LIVE";
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
  menuFilter=filter||"all";renderLobby();
  const query=menuQuery.trim().toLocaleLowerCase("hu-HU"),stats=games.map(g=>({g,s:gameStatsFor(g.id)})),best=[...stats].sort((a,b)=>getLibraryBest(b.g.id)-getLibraryBest(a.g.id))[0]?.g.id,most=[...stats].sort((a,b)=>(b.s.plays||0)-(a.s.plays||0))[0]?.g.id;
  const matches=g=>{const meta=gameLibraryMeta(g),filterMatch=menuFilter==="all"||menuFilter==="favorites"&&currentPlayer.favorites.includes(g.id)||menuFilter==="new"&&recentlyUpgraded.has(g.id)||meta.genre===menuFilter;return filterMatch&&(!query||`${g.title} ${g.tag} ${g.desc} ${meta.genre}`.toLocaleLowerCase("hu-HU").includes(query))};
  const shown=sortGames(games.filter(matches));
  $("#game-grid").innerHTML=shown.length?`<section class="game-library"><header><div><small>PROFILE-SYNCED GAME LIBRARY</small><h3>${menuFilter.toUpperCase()} CABINETS</h3><p>Single click: details • Double click / Enter: quick launch</p></div><span>${shown.length} GAMES</span></header><div class="library-grid">${shown.map(g=>cardHtml(g,"",best,most)).join("")}</div></section>`:`<section class="empty-results"><b>NO GAMES FOUND</b><p>Change the search, filter, or favorite selection.</p></section>`;
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
  const game=games.find(g=>g.id===id);if(!game)return;const source=document.querySelector(`[data-game="${CSS.escape(id)}"], [data-game-card="${CSS.escape(id)}"]`);if(source){const r=source.getBoundingClientRect();pixelBurst(r.left+r.width/2,r.top+r.height/2,game.color)}
  currentLaunchId=id;applyDialogSize();applyFontSize();$("#game-dialog").classList.toggle("starfarer-mode",id==="starfarer");$("#game-dialog").classList.toggle("scroll-game-mode",["fishing","starfarer","dice","penalty","blackjack","poker","billiards","salvager"].includes(id));$("#game-title").textContent=game.title;$("#game-kicker").textContent=`READY TO LAUNCH • ${game.tag}`;setMenuPaused(true);if(!$("#game-dialog").open)openDialogAnimated($("#game-dialog"));resetGameViewport();const prefs=launchPrefs(id);if(quick||prefs.skip)return launchGame(id);renderLaunchScreen(id);requestAnimationFrame(resetGameViewport);
}
function launchGame(id,restart=false){
  const game=games.find(g=>g.id===id);if(!game||!currentPlayer)return;if(!restart&&currentPlayer.coins<game.cost)return toast("NINCS ELÉG ÉRMÉD!");runActiveGameCleanup();resetGameViewport();setMenuPaused(true);launchScreenOpen=false;gamePauseOpen=false;$("#game-pause-overlay").hidden=true;$("#game-pause-button").hidden=false;if(!restart)currentPlayer.coins-=game.cost;const now=new Date().toISOString(),stats=currentPlayer.gameStats[id]||={plays:0,wins:0,losses:0,draws:0,best:null};stats.lastPlayedAt=now;currentPlayer.gameStats[id]=stats;currentPlayer.lastGame=id;currentPlayer.lastPlayedAt=now;saveData();updateHud();renderLobby();activeGame=id;gameStartedAt=Date.now();sfx("coin");startGameLife(game);
  const prefs=launchPrefs(id),launchOptions={mode:prefs.mode,difficulty:prefs.difficulty,theme:prefs.theme},starters={voidminer:startVoidMiner,guess:startGuess,rps:startRps,quiz:startQuiz,penalty:startPenalty,slots:startSlots,dice:startDice,memory:startMemory,reaction:startReaction,ttt:startTtt,snake:startSnake,pac:startPac,billiards:startBilliards,salvager:startNeonSalvager,wreck:startWreck,towerdefense:options=>{startTowerDefense();const select=$("#td-mode-select");if(select&&[...select.options].some(option=>option.value===options.mode&&!option.disabled))select.value=options.mode},fishing:startFishing,openroad:startOpenRoadV2,starfarer:startStarfarer,blackjack:startBlackjack,poker:startPoker},starter=starters[id];const [bootLine,punchLine]=bootFlavor(game);bootSfx(id);setStage(`<section class="game-boot-intro boot-${id}" style="--accent:${game.color}"><span>${game.icon}</span><small>${game.tag} CABINET BOOT</small><h3>${esc(game.title)}</h3><p><b>${esc(bootLine)}</b><em>${esc(punchLine)}</em></p><i></i></section>`);resetGameViewport();const bootTimer=setTimeout(()=>{starter?.(launchOptions);resetGameViewport();requestAnimationFrame(()=>{resetGameViewport();syncMobileGameControls(id);});},1450);setActiveCleanup(()=>{clearTimeout(bootTimer);releaseMobileInput();syncMobileGameControls(null);});
}
function setGamePause(paused){if(!activeGame)return;gamePauseOpen=paused;const overlay=$("#game-pause-overlay"),dialog=$("#game-dialog");overlay.hidden=!paused;dialog.classList.toggle("is-paused",paused);const tdPause=$("#td-pause");if(tdPause&&((paused&&tdPause.textContent.includes("PAUSE"))||(!paused&&tdPause.textContent.includes("RESUME"))))tdPause.click();if(paused){const game=games.find(g=>g.id===activeGame),config=(launchCatalog[activeGame]||launchCatalog.default);$("#pause-controls").textContent=`${game?.title||"GAME"} • ${config.controls}`}}
function exitActiveGame(){const dialog=$("#game-dialog");runActiveGameCleanup();gamePauseOpen=false;launchScreenOpen=false;$("#game-pause-overlay").hidden=true;closeDialogAnimated(dialog);setMenuPaused(false)}
function handlePauseAction(action){if(action==="resume")setGamePause(false);else if(action==="restart"){const id=activeGame||currentLaunchId;if(id){runActiveGameCleanup();launchGame(id,true)}}else if(action==="controls"){const panel=$("#pause-controls");panel.hidden=!panel.hidden}else if(action==="settings"){renderSettings();openDialogAnimated($("#settings-dialog"))}else if(action==="exit")exitActiveGame()}

function startGuess(){
  const stats=currentPlayer.gameStats.guess||={plays:0,wins:0,losses:0,draws:0,best:null};
  const rounds=[{max:50,guesses:7,label:"CALIBRATION"},{max:100,guesses:7,label:"WIDE BAND"},{max:250,guesses:8,label:"DEEP SEARCH"},{max:500,guesses:9,label:"MASTER LOCK"},{max:500,guesses:9,label:"MOVING TARGET",moving:true}];
  const timers=new Set();let round=1,secret=0,attempts=0,totalGuesses=0,totalScore=0,clueTokens=2,cluesUsedRound=0,totalClues=0,currentGuess=null,usedClues=new Set(),ended=false;
  const randomSecret=max=>Math.floor(Math.random()*max)+1;
  const schedule=(fn,delay)=>{const id=setTimeout(()=>{timers.delete(id);fn()},delay);timers.add(id)};
  const stop=()=>{window.removeEventListener("keydown",enterHandler);timers.forEach(clearTimeout);timers.clear()};
  const finish=won=>{if(ended)return;ended=true;stop();stats.highestCompletedRound=Math.max(stats.highestCompletedRound||0,won?5:round-1);stats.bestTotalScore=Math.max(stats.bestTotalScore||0,totalScore);if(won){stats.fewestTotalGuesses=Math.min(Number.isFinite(stats.fewestTotalGuesses)?stats.fewestTotalGuesses:Infinity,totalGuesses);if(totalClues===0)stats.perfectRuns=(stats.perfectRuns||0)+1}setStage(`<div class="guess-report"><p class="eyebrow">DEDUCTION CAMPAIGN</p><h3>${won?"ALL FIVE LOCKS OPEN":"CAMPAIGN INTERRUPTED"}</h3><div class="career-grid"><article><span>ROUND</span><b>${won?5:round-1}/5</b></article><article><span>TOTAL SCORE</span><b>${totalScore}</b></article><article><span>TOTAL GUESSES</span><b>${totalGuesses}</b></article><article><span>CLUES LEFT</span><b>${clueTokens}</b></article></div><p>BEST ${stats.bestTotalScore} • FEWEST ${Number.isFinite(stats.fewestTotalGuesses)?stats.fewestTotalGuesses:"—"} • NO-CLUE RUNS ${stats.perfectRuns||0}</p><button id="guess-again" class="pixel-btn primary">NEW CAMPAIGN</button></div>`);reward(Math.max(0,Math.round(totalScore/140)),Math.max(5,Math.round(totalScore/100)),{result:won?"win":"loss",score:totalScore});$("#guess-again").onclick=startGuess};
  const updateHud=()=>{$("#guess-attempts").textContent=`${attempts}/${rounds[round-1].guesses}`;$("#guess-score").textContent=totalScore;$("#guess-tokens").textContent=clueTokens;$$('[data-guess-clue]').forEach(button=>button.disabled=clueTokens<=0||usedClues.has(button.dataset.guessClue)||(button.dataset.guessClue==="near"&&currentGuess==null))};
  const useClue=type=>{if(ended||clueTokens<=0||usedClues.has(type))return;if(type==="near"&&currentGuess==null)return toast("MAKE A GUESS FIRST");clueTokens--;cluesUsedRound++;totalClues++;usedClues.add(type);const message=type==="parity"?`SIGNAL: THE TARGET IS ${secret%2?"ODD":"EVEN"}`:type==="three"?`SIGNAL: ${secret%3===0?"DIVISIBLE":"NOT DIVISIBLE"} BY 3`:`SIGNAL: TARGET IS ${Math.abs(secret-currentGuess)<=10?"WITHIN":"NOT WITHIN"} ±10 OF ${currentGuess}`;const log=$("#guess-clue-log");log.innerHTML+=`<span>${message}</span>`;updateHud()};
  const submit=()=>{if(ended)return;const config=rounds[round-1],input=$("#guess-input"),value=Number(input.value);if(!Number.isInteger(value)||value<1||value>config.max)return toast(`ENTER 1–${config.max}`);attempts++;totalGuesses++;currentGuess=value;if(value===secret){const roundScore=Math.max(100,1000-attempts*90-cluesUsedRound*150+round*100);totalScore+=roundScore;stats.highestCompletedRound=Math.max(stats.highestCompletedRound||0,round);saveData();$("#guess-result").textContent=`LOCK OPEN • +${roundScore} POINTS`;updateHud();if(round===5)return schedule(()=>finish(true),750);round++;return schedule(beginRound,750)}if(attempts>=config.guesses){$("#guess-result").textContent=`LOCK FAILED • TARGET WAS ${secret}`;updateHud();return schedule(()=>finish(false),950)}const direction=value<secret?"HIGHER ↑":"LOWER ↓";let movement="";if(config.moving){const before=secret,delta=Math.floor(Math.random()*7)-3;secret=Math.max(1,Math.min(config.max,secret+delta));movement=` • TARGET SHIFT ${secret-before>=0?"+":""}${secret-before}`}$("#guess-result").textContent=`${direction} • ${config.guesses-attempts} GUESSES LEFT${movement}`;input.value="";input.focus();updateHud()};
  const beginRound=()=>{const config=rounds[round-1];secret=randomSecret(config.max);attempts=0;cluesUsedRound=0;currentGuess=null;usedClues=new Set();setStage(`<div class="guess-campaign"><div class="game-score">ROUND ${round}/5 • ${config.label} • SCORE <b id="guess-score">${totalScore}</b></div><div class="guess-range"><small>ACTIVE RANGE</small><b>1 — ${config.max}</b>${config.moving?"<em>↔ TARGET MOVES AFTER EVERY WRONG GUESS</em>":""}</div><div class="guess-status"><span>GUESSES <b id="guess-attempts">0/${config.guesses}</b></span><span>CLUE TOKENS <b id="guess-tokens">${clueTokens}</b></span></div><div class="guess-controls"><input id="guess-input" class="game-input" type="number" min="1" max="${config.max}" placeholder="ENTER YOUR DEDUCTION"><button id="guess-btn" class="pixel-btn primary">SUBMIT GUESS</button></div><div class="guess-clues"><button data-guess-clue="parity">EVEN / ODD</button><button data-guess-clue="three">DIVISIBLE BY 3</button><button data-guess-clue="near" disabled>WITHIN ±10</button></div><div id="guess-clue-log" class="guess-clue-log"></div><p id="guess-result" class="result">Open the lock with as few guesses and clues as possible.</p></div>`);$("#guess-btn").onclick=submit;$$('[data-guess-clue]').forEach(button=>button.onclick=()=>useClue(button.dataset.guessClue));$("#guess-input").focus();updateHud()};
  const enterHandler=e=>{if(e.key==="Enter"&&document.activeElement?.id==="guess-input")submit()};window.addEventListener("keydown",enterHandler);setActiveCleanup(stop);beginRound();
}

function startRps(){
  const stats=currentPlayer.gameStats.rps||={plays:0,wins:0,losses:0,draws:0,best:null};stats.opponents||={};
  const names=["ROCK","PAPER","SCISSORS"],icons=["✊","✋","✌"],opponents=[{id:"rookie",name:"ROOKIE",rule:"DOUBLE POINT",desc:"One announced round is worth two points."},{id:"analyst",name:"ANALYST",rule:"LOCKED MOVE",desc:"One symbol becomes unavailable for the next round."},{id:"trickster",name:"TRICKSTER",rule:"SUDDEN DEATH",desc:"Every tie increases the next round's value."}];
  const timers=new Set(),schedule=(fn,delay)=>{const id=setTimeout(()=>{timers.delete(id);fn()},delay);timers.add(id)};let opponentIndex=0,player=0,cpu=0,round=1,doubleRound=0,lockedMove=null,nextValue=1,playerHistory=[],matchOver=false;
  const prediction=()=>{const counts=[0,0,0];playerHistory.slice(-5).forEach(choice=>counts[choice]++);return counts.indexOf(Math.max(...counts))};
  const patternReport=()=>{const recent=playerHistory.slice(-6),counts=[0,0,0];recent.forEach(choice=>counts[choice]++);const choice=counts.indexOf(Math.max(...counts));return recent.length?`You selected ${names[choice]} in ${counts[choice]} of your last ${recent.length} rounds.`:"Not enough choices to identify a pattern."};
  const cpuChoice=()=>{const predicted=prediction(),id=opponents[opponentIndex].id;if(id==="rookie")return Math.floor(Math.random()*3);if(id==="analyst")return Math.random()<.72?(predicted+1)%3:Math.floor(Math.random()*3);const phase=Math.floor((round-1)/2)%3;if(phase===0)return (predicted+1)%3;if(phase===1)return (predicted+2)%3;return Math.floor(Math.random()*3)};
  const finishLadder=won=>{stats.highestOpponent=Math.max(stats.highestOpponent||0,won?3:opponentIndex);if(won)stats.ladderClears=(stats.ladderClears||0)+1;setStage(`<div class="rps-report"><p class="eyebrow">MIND-GAME LADDER</p><h3>${won?"LADDER CONQUERED":"LADDER ENDED"}</h3><div class="career-grid"><article><span>OPPONENTS BEATEN</span><b>${won?3:opponentIndex}/3</b></article><article><span>BEST LADDER</span><b>${stats.highestOpponent||0}/3</b></article><article><span>LADDER CLEARS</span><b>${stats.ladderClears||0}</b></article><article><span>CHOICES READ</span><b>${playerHistory.length}</b></article></div><button id="rps-again" class="pixel-btn primary">NEW LADDER</button></div>`);reward(won?55:Math.max(5,opponentIndex*12),won?45:8,{result:won?"win":"loss",score:won?3:opponentIndex});$("#rps-again").onclick=startRps};
  const matchReport=won=>{matchOver=true;const opponent=opponents[opponentIndex],record=stats.opponents[opponent.id]||={wins:0,losses:0};won?record.wins++:record.losses++;stats.opponents[opponent.id]=record;saveData();setStage(`<div class="rps-report"><p class="eyebrow">${opponent.name} REPORT</p><h3>${won?"MATCH WON":"MATCH LOST"}</h3><blockquote>${patternReport()}</blockquote><p>${opponent.name} RECORD • ${record.wins} WINS / ${record.losses} LOSSES</p>${won&&opponentIndex<2?'<button id="rps-next" class="pixel-btn primary">NEXT OPPONENT</button>':'<button id="rps-finish" class="pixel-btn primary">VIEW LADDER RESULT</button>'}</div>`);if(won&&opponentIndex<2)$("#rps-next").onclick=()=>{opponentIndex++;beginMatch()};else $("#rps-finish").onclick=()=>finishLadder(won&&opponentIndex===2)};
  const renderRound=()=>{const opponent=opponents[opponentIndex],value=opponent.id==="rookie"&&round===doubleRound?2:opponent.id==="trickster"?nextValue:1;setStage(`<div class="rps-arena"><header><small>LADDER ${opponentIndex+1}/3 • ROUND ${round}</small><h3>${opponent.name}</h3><p>${opponent.rule} • ${opponent.desc}</p></header><div class="rps-scoreboard"><span>YOU <b>${player}</b></span><em>${value>1?`THIS ROUND ×${value}`:"FIRST TO 3"}</em><span><b>${cpu}</b> CPU</span></div>${lockedMove!=null?`<p class="rps-lock">LOCKED THIS ROUND: ${icons[lockedMove]} ${names[lockedMove]}</p>`:""}<div class="game-actions rps-choices">${icons.map((icon,index)=>`<button class="choice-btn rps42" data-i="${index}" ${index===lockedMove?"disabled":""}><b>${icon}</b><span>${names[index]}</span></button>`).join("")}</div><p id="rps-result" class="result">Choose your move. ${opponent.id==="analyst"?"The Analyst is reading your last five choices.":opponent.id==="trickster"?"Behavior changes every two rounds.":"The Rookie has no stable pattern."}</p></div>`);$$('.rps42').forEach(button=>button.onclick=()=>play(Number(button.dataset.i)))};
  const play=choice=>{if(matchOver||choice===lockedMove)return;const opponent=opponents[opponentIndex],cpuPick=cpuChoice(),tie=choice===cpuPick,playerWon=!tie&&(choice-cpuPick+3)%3===1,value=opponent.id==="rookie"&&round===doubleRound?2:opponent.id==="trickster"?nextValue:1;playerHistory.push(choice);if(!tie){if(playerWon)player+=value;else cpu+=value;if(opponent.id==="trickster")nextValue=1}else if(opponent.id==="trickster")nextValue=Math.min(4,nextValue+1);const result=$("#rps-result");result.textContent=`${icons[choice]} ${names[choice]} vs ${icons[cpuPick]} ${names[cpuPick]} • ${tie?`TIE${opponent.id==="trickster"?` • NEXT ROUND ×${nextValue}`:""}`:playerWon?`YOU SCORE ${value}`:`CPU SCORES ${value}`}`;$$('.rps42').forEach(button=>button.disabled=true);if(player>=3||cpu>=3)return schedule(()=>matchReport(player>=3),850);round++;lockedMove=opponent.id==="analyst"?Math.floor(Math.random()*3):null;schedule(renderRound,850)};
  const beginMatch=()=>{const opponent=opponents[opponentIndex];player=0;cpu=0;round=1;lockedMove=null;nextValue=1;matchOver=false;doubleRound=opponent.id==="rookie"?2+Math.floor(Math.random()*3):0;renderRound()};
  setStage(`<div class="rps-intro"><p class="eyebrow">BEST-OF-FIVE MIND-GAME LADDER</p><h3>THREE READABLE OPPONENTS</h3><div class="rps-opponents">${opponents.map((opponent,index)=>`<article><span>${index+1}</span><b>${opponent.name}</b><small>${opponent.rule}</small><p>${opponent.desc}</p></article>`).join("")}</div><button id="rps-start" class="pixel-btn primary">ENTER LADDER</button></div>`);$("#rps-start").onclick=beginMatch;setActiveCleanup(()=>{timers.forEach(clearTimeout);timers.clear()});
}

function startQuiz(launchOptions={}){
  const stats=currentPlayer.gameStats.quiz||={plays:0,wins:0,losses:0,draws:0,best:null},careerAccuracy=stats.totalAnswers?Math.round((stats.totalCorrect||0)/stats.totalAnswers*100):0;
  setStage(`<div class="quiz-config"><div class="big-icon">🧠</div><h3>NEON QUIZ ARENA</h3><div class="quiz-config-grid"><label>CATEGORY<select id="quiz-category">${Object.entries(quizCategoryLabels).map(([value,label])=>`<option value="${value}">${label}</option>`).join("")}</select></label><label class="quiz-timed"><input id="quiz-timed" type="checkbox" checked> TIMED • 15 SECONDS</label></div><div><p class="eyebrow">RUN LENGTH</p><div class="quiz-lengths">${[5,10,20].map((n,i)=>`<button class="pixel-btn ${i===1?"primary":"secondary"}" data-quiz-length="${n}">${n} QUESTIONS</button>`).join("")}</div></div><button id="quiz-daily" class="pixel-btn daily-quiz">DAILY CHALLENGE • SAME 10 QUESTIONS FOR EVERY PROFILE</button><div class="quiz-career-strip"><span>ACCURACY <b>${careerAccuracy}%</b></span><span>LONGEST STREAK <b>${stats.longestCorrectStreak||0}</b></span><span>PERFECT RUNS <b>${stats.perfectRuns||0}</b></span><span>FASTEST <b>${Number.isFinite(stats.fastestAnswer)?`${stats.fastestAnswer.toFixed(2)}s`:"—"}</b></span></div><p id="quiz-config-note" class="result">Difficulty rises from easy to hard during every run.</p></div>`);
  const progressiveRun=(pool,length,random=Math.random)=>{const order={easy:0,medium:1,hard:2},groups=["easy","medium","hard"].map(level=>pool.filter(q=>q.difficulty===level).sort(()=>random()-.5)),result=[];for(let i=0;i<length;i++){const desired=Math.min(2,Math.floor(i/Math.max(1,length/3))),group=groups[desired].length?groups[desired]:groups.find(items=>items.length);if(!group?.length)break;result.push(group.splice(Math.floor(random()*group.length),1)[0])}return result.sort((a,b)=>order[a.difficulty]-order[b.difficulty])};
  const seededRandom=seed=>{let value=[...seed].reduce((n,ch)=>(n*31+ch.charCodeAt(0))>>>0,2166136261);return()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296}};
  $$('[data-quiz-length]').forEach(btn=>btn.onclick=()=>{const category=$("#quiz-category").value,timed=$("#quiz-timed").checked,length=Number(btn.dataset.quizLength),pool=quizQuestions.filter(q=>category==="mixed"||q.category===category),questions=progressiveRun(pool,length);if(questions.length<length)$("#quiz-config-note").textContent=`Only ${questions.length} unique questions are available for this category.`;if(!questions.length)return toast("NO QUESTIONS FOR THIS CATEGORY");runQuiz(questions,{timed,category,daily:false})});
  $("#quiz-daily").onclick=()=>{const random=seededRandom(`gubuntu-daily-${todayKey()}`),questions=progressiveRun([...quizQuestions],10,random);runQuiz(questions,{timed:true,category:"mixed",daily:true})};
}
function runQuiz(questions,options={}){
  let runQuestions=[...questions],index=0,correct=0,points=0,streak=0,longestStreak=0,timer=null,transitionTimer=null,remaining=15,locked=false,freezeUntil=0,answerStarted=0;
  const lifelines={remove:true,freeze:true,replace:true},reviews=[];
  const stopTimer=()=>{clearInterval(timer);timer=null},stopTransition=()=>{clearTimeout(transitionTimer);transitionTimer=null},stopQuiz=()=>{stopTimer();stopTransition()};
  const multiplier=()=>streak>=7?2:streak>=5?1.5:streak>=3?1.25:1;
  const finish=()=>{stopQuiz();const total=runQuestions.length,accuracy=Math.round(correct/Math.max(1,total)*100),stats=currentPlayer.gameStats.quiz||={plays:0,wins:0,losses:0,draws:0,best:null};stats.totalCorrect=(stats.totalCorrect||0)+correct;stats.totalAnswers=(stats.totalAnswers||0)+total;stats.longestCorrectStreak=Math.max(stats.longestCorrectStreak||0,longestStreak);if(accuracy===100)stats.perfectRuns=(stats.perfectRuns||0)+1;stats.categoryStats||={};const category=options.category||"mixed",categoryStat=stats.categoryStats[category]||={correct:0,total:0};categoryStat.correct+=correct;categoryStat.total+=total;stats.categoryStats[category]=categoryStat;stats.bestCategory=Object.entries(stats.categoryStats).sort((a,b)=>(b[1].correct/b[1].total)-(a[1].correct/a[1].total))[0]?.[0]||category;stats.lastRun={accuracy,points,category,daily:!!options.daily,at:new Date().toISOString()};const wrong=reviews.filter(item=>!item.good);setStage(`<div class="quiz-summary"><div class="big-icon">${accuracy===100?"🏆":"🧠"}</div><h3>${options.daily?"DAILY CHALLENGE":"QUIZ COMPLETE"} • ${correct}/${total}</h3><div class="career-grid"><article><span>🎯</span><b>${accuracy}%</b><small>Accuracy</small></article><article><span>⚡</span><b>${points}</b><small>Score</small></article><article><span>🔥</span><b>${longestStreak}</b><small>Best streak</small></article><article><span>👑</span><b>${quizCategoryLabels[stats.bestCategory]||stats.bestCategory}</b><small>Best category</small></article><article><span>⏱</span><b>${Number.isFinite(stats.fastestAnswer)?`${stats.fastestAnswer.toFixed(2)}s`:"—"}</b><small>Fastest answer</small></article><article><span>💯</span><b>${stats.perfectRuns||0}</b><small>Perfect runs</small></article></div>${wrong.length?`<section class="quiz-review"><h4>INCORRECT ANSWERS</h4>${wrong.map(item=>`<article><b>${esc(item.question)}</b><span>Your answer: ${esc(item.answer)}</span><strong>Correct: ${esc(item.correctAnswer)}</strong></article>`).join("")}</section>`:`<p class="perfect-run">PERFECT RUN • NO INCORRECT ANSWERS</p>`}<button id="quiz-again" class="pixel-btn primary">NEW QUIZ RUN</button></div>`);reward(Math.round(points/120),Math.max(5,Math.round(points/80)),{result:accuracy>=60?"win":"loss",score:points});$("#quiz-again").onclick=startQuiz};
  const show=()=>{stopTimer();locked=false;if(index===runQuestions.length){finish();return}const q=runQuestions[index];remaining=15;freezeUntil=0;answerStarted=performance.now();setStage(`<div class="game-score quiz-scorebar">QUESTION ${index+1}/${runQuestions.length} • SCORE ${points} • STREAK ${streak} • MULTIPLIER x${multiplier()} • ${q.difficulty.toUpperCase()}</div>${options.timed?`<div class="quiz-timer"><i id="quiz-time-fill"></i></div>`:""}<div class="quiz-lifelines"><button data-life="remove" ${lifelines.remove?"":"disabled"}>−1 WRONG</button><button data-life="freeze" ${lifelines.freeze?"":"disabled"}>FREEZE 5s</button><button data-life="replace" ${lifelines.replace?"":"disabled"}>REPLACE</button></div><h3>${esc(q.question)}</h3><div>${q.answers.map((answer,i)=>`<button class="choice-btn quiz-answer" data-i="${i}">${String.fromCharCode(65+i)} • ${esc(answer)}</button>`).join("")}</div><p id="quiz-result" class="result quiz-feedback"></p>`);
    const answer=choice=>{if(locked)return;locked=true;stopTimer();const elapsed=(performance.now()-answerStarted)/1000,good=choice===q.correct,chosen=choice<0?"TIME EXPIRED":q.answers[choice];if(good){correct++;streak++;longestStreak=Math.max(longestStreak,streak);points+=Math.round(100*multiplier());statsFast(elapsed)}else streak=0;reviews.push({question:q.question,answer:chosen,correctAnswer:q.answers[q.correct],good});const result=$("#quiz-result");result.classList.add(good?"correct":"wrong");result.textContent=good?`CORRECT • x${multiplier()} STREAK BONUS`:`${chosen} • CORRECT: ${q.answers[q.correct]}`;$$('.quiz-answer').forEach((button,i)=>{button.disabled=true;if(i===q.correct)button.classList.add("correct")});stopTransition();transitionTimer=setTimeout(()=>{transitionTimer=null;index++;show()},good?850:1500)};
    const statsFast=elapsed=>{const stats=currentPlayer.gameStats.quiz||={};stats.fastestAnswer=Math.min(Number.isFinite(stats.fastestAnswer)?stats.fastestAnswer:Infinity,elapsed)};
    $$(".quiz-answer").forEach(btn=>btn.onclick=()=>answer(Number(btn.dataset.i)));
    $$('[data-life]').forEach(button=>button.onclick=()=>{const life=button.dataset.life;if(!lifelines[life]||locked)return;lifelines[life]=false;if(life==="remove"){const wrong=$$(".quiz-answer").find(btn=>Number(btn.dataset.i)!==q.correct&&!btn.disabled);if(wrong){wrong.disabled=true;wrong.classList.add("lifeline-removed")}button.disabled=true}else if(life==="freeze"){freezeUntil=Date.now()+5000;button.disabled=true;$("#quiz-result").textContent="TIMER FROZEN FOR 5 SECONDS"}else{const used=new Set(runQuestions.map(item=>item.key)),pool=quizQuestions.filter(item=>!used.has(item.key)&&(options.category==="mixed"||item.category===options.category));if(pool.length)runQuestions[index]=pool[Math.floor(Math.random()*pool.length)];show()}});
    if(options.timed)timer=setInterval(()=>{if(Date.now()<freezeUntil)return;remaining=Math.max(0,remaining-.2);$("#quiz-time-fill")?.style.setProperty("width",`${remaining/15*100}%`);if(remaining<=0)answer(-1)},200);
  };
  setActiveCleanup(stopQuiz);show();
}
function startPenalty(){
  const stats=currentPlayer.gameStats.penalty||={plays:0,wins:0,losses:0,draws:0,best:null};
  stats.tournamentsWon=stats.tournamentsWon||0;stats.bestSaveStreak=stats.bestSaveStreak||0;stats.cleanSheets=stats.cleanSheets||0;stats.panenkaGoals=stats.panenkaGoals||0;stats.opponentRecords=stats.opponentRecords&&typeof stats.opponentRecords==="object"?stats.opponentRecords:{};
  const keepers=[
    {id:"rookie",name:"ROOKIE",icon:"🧤",tendency:"Random dives. Honest, quick and inexperienced.",clue:0.56},
    {id:"reader",name:"READER",icon:"🧠",tendency:"Studies your previous four shots and predicts patterns.",clue:0.7},
    {id:"wall",name:"WALL",icon:"🧱",tendency:"Dominates low shots but struggles against upper corners.",clue:0.78},
    {id:"glitch",name:"GLITCH KEEPER",icon:"👾",tendency:"Fakes an early movement before the real dive.",clue:0.62}
  ];
  const stages=["QUARTER-FINAL","SEMI-FINAL","FINAL"],zones=["LEFT LOW","LEFT HIGH","CENTER","RIGHT HIGH","RIGHT LOW"],arrows=["↙","↖","↑","↗","↘"],shotTypes={
    power:{name:"POWER",desc:"Smaller accuracy window • harder to save"},
    placed:{name:"PLACED",desc:"Wider accuracy window • easier to read"},
    panenka:{name:"PANENKA",desc:"Beats an early dive • fails against center"}
  };
  let route=[],stageIndex=0,opponent=null,pair=1,player=0,cpu=0,phase="shoot",shotType="power",power=50,powerDir=1,powerTimer=null,locked=false,keeper=2,shotHistory=[],saveStreak=0,pendingCpuShot=2,suddenDeath=false,tournamentOver=false;
  const timers=new Set(),schedule=(fn,delay)=>{const id=setTimeout(()=>{timers.delete(id);fn();},delay);timers.add(id);};
  const stopPower=()=>{clearInterval(powerTimer);powerTimer=null;};
  const cleanup=()=>{stopPower();timers.forEach(clearTimeout);timers.clear();};
  const startPower=()=>{stopPower();power=40;powerDir=1;powerTimer=setInterval(()=>{const step=shotType==="power"?8:5;power+=powerDir*step;if(power>=100||power<=0)powerDir*=-1;$("#penalty-power-fill")?.style.setProperty("width",`${Math.max(0,Math.min(100,power))}%`);},70);};
  const recordFor=id=>stats.opponentRecords[id]||={wins:0,losses:0,goals:0,saves:0};
  const selection=()=>{
    cleanup();tournamentOver=false;
    setStage(`<div class="penalty-tournament"><p class="eyebrow">PIXEL CUP • OPPONENT SCOUTING</p><h3>CHOOSE YOUR QUARTER-FINAL RIVAL</h3><div class="keeper-select">${keepers.map(k=>{const r=recordFor(k.id);return `<button data-keeper="${k.id}"><i>${k.icon}</i><b>${k.name}</b><span>${k.tendency}</span><em>RECORD ${r.wins}W–${r.losses}L • ${r.goals} GOALS • ${r.saves} SAVES</em></button>`;}).join("")}</div><div class="penalty-career"><span>TOURNAMENTS WON <b>${stats.tournamentsWon}</b></span><span>BEST SAVE STREAK <b>${stats.bestSaveStreak}</b></span><span>CLEAN SHEETS <b>${stats.cleanSheets}</b></span><span>PANENKA GOALS <b>${stats.panenkaGoals}</b></span></div></div>`);
    $$("[data-keeper]").forEach(button=>button.onclick=()=>startTournament(button.dataset.keeper));
  };
  const startTournament=id=>{
    const first=keepers.find(k=>k.id===id)||keepers[0],rest=shuffle(keepers.filter(k=>k.id!==first.id));
    route=[first,...rest].slice(0,3);stageIndex=0;shotHistory=[];saveStreak=0;tournamentOver=false;startMatch();
  };
  const startMatch=()=>{
    opponent=route[stageIndex];pair=1;player=0;cpu=0;phase="shoot";shotType="power";keeper=2;suddenDeath=false;render();
  };
  const matchLabel=()=>suddenDeath?`SUDDEN DEATH ${Math.max(1,pair-5)}`:`ROUND ${pair}/5`;
  const chooseKeeperDive=dir=>{
    if(opponent.id==="reader"&&shotHistory.length&&Math.random()<.72){
      const recent=shotHistory.slice(-4),counts=recent.reduce((map,value)=>(map[value]=(map[value]||0)+1,map),{});
      return +Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];
    }
    if(opponent.id==="wall"){
      if([0,4].includes(dir)&&Math.random()<.7)return dir;
      if([1,3].includes(dir)&&Math.random()<.68)return [0,4][Math.floor(Math.random()*2)];
    }
    return Math.floor(Math.random()*5);
  };
  const moveBall=(dir,good=true)=>{const x=[-190,-135,0,135,190][dir],y=[-25,-118,-82,-118,-25][dir],ball=$("#ball");ball?.style.setProperty("--kick-x",`${x}px`);ball?.style.setProperty("--kick-y",`${good?y:y-70}px`);ball?.classList.add("kicked");};
  const moveKeeper=(dir,fake=false)=>{keeper=dir;const el=$("#keeper");if(el){el.style.setProperty("--keeper-x",dir-2);el.classList.add(fake?"fake":"dive");}};
  const tournamentHud=()=>`<div class="penalty-bracket">${stages.map((name,i)=>`<span class="${i<stageIndex?"won":i===stageIndex?"active":""}">${i<stageIndex?"✓":i===stageIndex?"●":"○"} ${name}</span>`).join("")}</div><div class="game-score">${stages[stageIndex]} • ${matchLabel()} • YOU ${player} — ${cpu} ${opponent.name}</div>`;
  const render=()=>{
    stopPower();
    const shooting=phase==="shoot";
    if(!shooting){
      pendingCpuShot=Math.floor(Math.random()*5);
      const honest=Math.random()<opponent.clue,shown=honest?pendingCpuShot:([0,1,3,4].filter(value=>value!==pendingCpuShot)[Math.floor(Math.random()*3)]??2),confidence=Math.round(opponent.clue*100);
      setStage(`<div class="penalty-wrap tournament-mode">${tournamentHud()}<div class="keeper-profile-mini"><i>${opponent.icon}</i><span><b>${opponent.name}</b><small>${opponent.tendency}</small></span></div><h3>DEFEND THE GOAL</h3><div class="striker-clue"><span>The striker looks toward <b>${zones[shown].toLowerCase()}</b>.</span><em>Confidence: ${confidence}%</em></div><div class="penalty-stadium"><div class="penalty-goal deluxe">${zones.map((z,i)=>`<button class="goal-zone deluxe" data-dir="${i}"><b>${arrows[i]}</b><small>DIVE</small></button>`).join("")}<span id="keeper" class="keeper" style="--keeper-x:0">${opponent.icon}</span><span id="ball" class="ball deluxe">⚽</span></div></div><p id="penalty-result" class="result">Read the clue, then choose your dive.</p></div>`);
    }else{
      setStage(`<div class="penalty-wrap tournament-mode">${tournamentHud()}<div class="keeper-profile-mini"><i>${opponent.icon}</i><span><b>${opponent.name}</b><small>${opponent.tendency}</small></span></div><h3>CHOOSE SHOT TYPE & TARGET</h3><div class="shot-type-select">${Object.entries(shotTypes).map(([id,item])=>`<button data-shot-type="${id}" class="${id===shotType?"active":""}"><b>${item.name}</b><span>${item.desc}</span></button>`).join("")}</div><div class="penalty-stadium"><div class="penalty-goal deluxe">${zones.map((z,i)=>`<button class="goal-zone deluxe" data-dir="${i}"><b>${arrows[i]}</b><small>${z}</small></button>`).join("")}<span id="keeper" class="keeper" style="--keeper-x:0">${opponent.icon}</span><span id="ball" class="ball deluxe">⚽</span></div><div class="power-box ${shotType}"><span>${shotType==="panenka"?"PANENKA TIMING":"ACCURACY"}</span><div class="penalty-power"><i id="penalty-power-fill"></i><b class="sweet-spot"></b></div><small>${shotTypes[shotType].desc}</small></div></div><p id="penalty-result" class="result">Stop the meter by choosing a target.</p></div>`);
      $$("[data-shot-type]").forEach(button=>button.onclick=()=>{shotType=button.dataset.shotType;render();});
      startPower();
    }
    locked=false;
    $$(".goal-zone").forEach(button=>button.onclick=()=>shooting?playerShoot(+button.dataset.dir):cpuShoot(+button.dataset.dir));
  };
  const playerShoot=dir=>{
    if(locked)return;locked=true;stopPower();$$(".goal-zone").forEach(button=>button.disabled=true);shotHistory.push(dir);
    const dive=chooseKeeperDive(dir),sweet=shotType==="power"?power>=66&&power<=80:shotType==="placed"?power>=42&&power<=88:power>=38&&power<=86;
    const wild=shotType==="power"?(power<25||power>94):shotType==="placed"?(power<12||power>98):(power<18||power>96);
    const resolve=()=>{
      moveKeeper(dive);moveBall(dir,!wild);
      let scored=false;
      if(!wild){
        if(shotType==="panenka")scored=dive!==2;
        else if(dir!==dive)scored=true;
        else{
          let saveChance=shotType==="power"?.42:.78;
          if(opponent.id==="reader"&&shotType==="placed")saveChance=.92;
          if(opponent.id==="wall"&&[0,4].includes(dir))saveChance=.94;
          if(opponent.id==="wall"&&[1,3].includes(dir))saveChance=.35;
          scored=Math.random()>saveChance-(sweet?.12:0);
        }
      }
      if(scored){player++;recordFor(opponent.id).goals++;if(shotType==="panenka")stats.panenkaGoals++;sfx("goal");$("#penalty-result").textContent=shotType==="panenka"?"PANENKA! THE KEEPER DIVED EARLY.":"GOAL! THE CONTRACTED SHOT BEAT THE KEEPER.";}
      else{sfx("save");$("#penalty-result").textContent=wild?"OFF TARGET! THE ACCURACY WINDOW WAS MISSED.":shotType==="panenka"&&dive===2?"PANENKA FAILED — THE KEEPER STAYED CENTRAL.":`${opponent.name} SAVES!`;}
      saveData();schedule(()=>{phase="save";keeper=2;render();},1100);
    };
    if(opponent.id==="glitch"){const fake=(dive+2)%5;moveKeeper(fake,true);$("#penalty-result").textContent="GLITCH KEEPER FAKES A DIVE…";schedule(resolve,320);}else resolve();
  };
  const cpuShoot=saveDir=>{
    if(locked)return;locked=true;$$(".goal-zone").forEach(button=>button.disabled=true);
    const shot=pendingCpuShot,miss=Math.random()<(opponent.id==="rookie"?.15:.07),saved=!miss&&saveDir===shot;
    moveKeeper(saveDir);moveBall(shot,!miss);
    if(saved){saveStreak++;stats.bestSaveStreak=Math.max(stats.bestSaveStreak,saveStreak);recordFor(opponent.id).saves++;sfx("save");$("#penalty-result").textContent=`SAVE! STREAK ×${saveStreak}`;}
    else if(miss){sfx("lose");$("#penalty-result").textContent="THE STRIKER MISSES THE FRAME.";}
    else{cpu++;saveStreak=0;sfx("goal");$("#penalty-result").textContent=`${opponent.name} SCORES.`;}
    saveData();schedule(()=>{pair++;phase="shoot";keeper=2;if(pair>5){if(player!==cpu)return finishMatch(player>cpu);suddenDeath=true;}render();},1100);
  };
  const finishMatch=won=>{
    cleanup();const record=recordFor(opponent.id);if(won)record.wins++;else record.losses++;if(won&&cpu===0)stats.cleanSheets++;
    saveData();
    if(won&&stageIndex<2){
      setStage(`<div class="penalty-tournament stage-result"><p class="eyebrow">${stages[stageIndex]} COMPLETE</p><div class="big-icon">🏆</div><h3>YOU ${player} — ${cpu} ${opponent.name}</h3><p>Next opponent: ${route[stageIndex+1].icon} ${route[stageIndex+1].name}</p><button id="penalty-next-stage" class="pixel-btn primary">ENTER ${stages[stageIndex+1]}</button></div>`);
      $("#penalty-next-stage").onclick=()=>{stageIndex++;startMatch();};
      return;
    }
    tournamentOver=true;
    if(won)stats.tournamentsWon++;
    const coins=won?140:stageIndex===1?35:12,xp=won?90:stageIndex===1?30:12;
    setStage(`<div class="penalty-tournament stage-result"><p class="eyebrow">PIXEL CUP • ${won?"CHAMPION":"ELIMINATED"}</p><div class="big-icon">${won?"🏆":"🧤"}</div><h3>${won?"TOURNAMENT WON":`${opponent.name} ADVANCES`}</h3><p>Final score: ${player}–${cpu} • Best save streak: ${saveStreak}</p><div class="game-actions"><button id="penalty-restart" class="pixel-btn primary">NEW TOURNAMENT</button><button id="penalty-scout" class="pixel-btn secondary">OPPONENT RECORDS</button></div>${arcadeComment(won?"win":"lose")}</div>`);
    reward(coins,xp,{result:won?"win":"loss",score:stageIndex+1});
    $("#penalty-restart").onclick=startPenalty;$("#penalty-scout").onclick=selection;
  };
  setActiveCleanup(cleanup);selection();
}

function startSlots(){
  const stats=currentPlayer.gameStats.slots||={plays:0,wins:0,losses:0,draws:0,best:null},symbols=["🍒","🍋","🔔","⭐","7️⃣"],payouts={"🍒":4,"🍋":5,"🔔":8,"⭐":12,"7️⃣":25},sessionStartBalance=currentPlayer.coins;
  const timers=new Set(),schedule=(fn,delay)=>{const id=setTimeout(()=>{timers.delete(id);fn()},delay);timers.add(id)};let bet=Math.min(10,Math.max(1,currentPlayer.coins)),bonusMeter=0,inBonus=false,freeSpins=0,bonusPending=false,locked=false,losingStreak=0,spinTimer=null;
  const stopSpin=()=>{clearInterval(spinTimer);spinTimer=null},stop=()=>{stopSpin();timers.forEach(clearTimeout);timers.clear()};
  const updateSessionRecords=payout=>{stats.largestSinglePayout=Math.max(stats.largestSinglePayout||0,payout);stats.longestLosingStreak=Math.max(stats.longestLosingStreak||0,losingStreak);stats.highestBalanceGained=Math.max(stats.highestBalanceGained||0,currentPlayer.coins+payout-sessionStartBalance)};
  const render=()=>{const table=symbols.map(symbol=>`<span>${symbol}<b>×${payouts[symbol]}</b></span>`).join("");setStage(`<div class="slots42"><div class="game-score">${inBonus?`BONUS MODE • ${freeSpins} FREE SPINS LEFT • WINNINGS ×2`:`SESSION GAIN ${Math.max(0,currentPlayer.coins-sessionStartBalance)} • BEST PAYOUT ${stats.largestSinglePayout||0}`}</div><h3>NEON SLOTS PROGRESSION</h3>${inBonus?"":wagerHtml("slot42",bet)}<div class="slots-payouts">${table}</div><div class="slots bonus-reels" id="reels42">🍒 │ 🍋 │ ⭐</div><div class="slots-meter"><header><span>BONUS METER</span><b>${Math.round(bonusMeter)}%</b></header><i><em style="width:${bonusMeter}%"></em></i><small>${inBonus?"5 FREE SPINS • ALL WINNINGS DOUBLED":"LOSS +10% • SMALL WIN +5%"}</small></div><div class="slots-records"><span>LARGEST PAYOUT <b>${stats.largestSinglePayout||0}</b></span><span>LONGEST LOSS STREAK <b>${stats.longestLosingStreak||0}</b></span><span>BONUS ROUNDS <b>${stats.bonusRoundsActivated||0}</b></span><span>BEST SESSION GAIN <b>${stats.highestBalanceGained||0}</b></span></div><button id="spin42" class="pixel-btn primary">${inBonus?`FREE SPIN ${6-freeSpins}/5`:`SPIN • ${bet} ●`}</button><p id="slots42-result" class="result">Match three symbols for the listed multiplier. Two symbols return ×1.5.</p></div>`);if(!inBonus)bindWager("slot42",value=>{bet=safeBet(value);render()});$("#spin42").onclick=()=>spin(inBonus)};
  const afterSettlement=()=>{locked=false;if(inBonus&&freeSpins<=0){inBonus=false;bonusMeter=0;$("#slots42-result").textContent="BONUS COMPLETE • METER RESET";return schedule(render,800)}if(bonusPending)return beginBonus();render()};
  const settle=(amount,label)=>{updateSessionRecords(amount);reward(amount,amount>bet?12:amount?7:3,{result:amount>bet?"win":amount?"draw":"loss",score:amount});const message=$("#slots42-result");if(message)message.textContent=label;schedule(afterSettlement,700)};
  const offerRisk=payout=>{locked=false;setStage(`<div class="slots-risk"><p class="eyebrow">PAYOUT SECURED • ${payout} COINS</p><h3>COLLECT OR DOUBLE?</h3><div class="risk-card"><span>${payout}</span><small>50% ×2 • 50% LOSE PAYOUT</small></div><div class="game-actions"><button id="slots-collect" class="pixel-btn secondary">COLLECT</button><button id="slots-double" class="pixel-btn primary">DOUBLE</button></div><p id="slots-risk-result" class="result">The original stake is already paid. Only this payout is at risk.</p></div>`);$("#slots-collect").onclick=()=>{if(locked)return;locked=true;settle(payout,`COLLECTED • +${payout}`)};$("#slots-double").onclick=()=>{if(locked)return;locked=true;const won=Math.random()<.5,amount=won?payout*2:0;$("#slots-risk-result").textContent=won?`DOUBLE SUCCESS • +${amount}`:"DOUBLE FAILED • PAYOUT LOST";schedule(()=>settle(amount,won?`DOUBLE SUCCESS • +${amount}`:"RISK LOST • +0"),650)}};
  const resolveSpin=result=>{const counts=new Map();result.forEach(symbol=>counts.set(symbol,(counts.get(symbol)||0)+1));const [matchSymbol,matchCount]=[...counts.entries()].sort((a,b)=>b[1]-a[1])[0];let payout=matchCount===3?bet*payouts[matchSymbol]:matchCount===2?Math.round(bet*1.5):0;if(inBonus)payout*=2;if(inBonus)freeSpins--;if(!inBonus){if(payout===0)bonusMeter=Math.min(100,bonusMeter+10);else if(matchCount===2)bonusMeter=Math.min(100,bonusMeter+5);if(bonusMeter>=100)bonusPending=true}if(payout===0){losingStreak++;updateSessionRecords(0)}else losingStreak=0;$("#reels42").textContent=result.join(" │ ");const label=payout?`${matchCount===3?`${matchSymbol} JACKPOT`:`TWO ${matchSymbol}`} • ${inBonus?"BONUS ×2 • ":""}+${payout}`:`NO MATCH • BONUS ${Math.round(bonusMeter)}%`;if(payout>bet)return offerRisk(payout);settle(payout,label)};
  const spin=free=>{if(locked)return;if(!free&&currentPlayer.coins<bet)return toast("NOT ENOUGH COINS");locked=true;if(!free){currentPlayer.coins-=bet;saveData();updateHud()}const reels=$("#reels42"),button=$("#spin42");button.disabled=true;reels.classList.add("spin");let ticks=0;stopSpin();spinTimer=setInterval(()=>{reels.textContent=Array.from({length:3},()=>symbols[Math.floor(Math.random()*symbols.length)]).join(" │ ");if(++ticks>10){stopSpin();reels.classList.remove("spin");resolveSpin(Array.from({length:3},()=>symbols[Math.floor(Math.random()*symbols.length)]))}},65)};
  const beginBonus=()=>{bonusPending=false;inBonus=true;freeSpins=5;bonusMeter=100;stats.bonusRoundsActivated=(stats.bonusRoundsActivated||0)+1;saveData();setStage(`<div class="slots-bonus-intro"><p class="eyebrow">BONUS METER FULL</p><h3>BONUS MODE</h3><div class="big-icon">⚡🎰⚡</div><b>5 FREE SPINS</b><p>WINNINGS ARE DOUBLED</p><button id="bonus-start" class="pixel-btn primary">START BONUS</button></div>`);$("#bonus-start").onclick=render};
  setActiveCleanup(stop);render();
}

function startDice(){
  const stats=currentPlayer.gameStats.dice||={plays:0,wins:0,losses:0,draws:0,best:null};
  Object.assign(stats,{bestRunScore:stats.bestRunScore||0,bestProfit:stats.bestProfit||0,highestMultiplier:stats.highestMultiplier||1,perfectRuns:stats.perfectRuns||0,totalJackpots:stats.totalJackpots||0});
  let round=1,bet=Math.min(5,Math.max(1,currentPlayer.coins)),sides=6,contract="safe",rerolls=3,streak=0,highestStreak=0,totalPayout=0,totalSpent=0,successes=0,bestRoll=0,loadedEdge=0,multiplierCore=0,pendingValue=null,ended=false;
  const multiplierSteps=[1,1.25,1.5,2,3];
  const currentMultiplier=()=>multiplierSteps[Math.min(multiplierSteps.length-1,streak+multiplierCore)]||3;
  const precisionRange=()=>{
    const width=sides<=8?2:sides<=12?2:2;
    const min=Math.max(2,Math.floor((sides-width)/2)+1);
    return [min,min+width-1];
  };
  const precisionReward=()=>sides===6?3:sides===8?3.5:sides===12?4:5;
  const contractData=()=>{
    const [min,max]=precisionRange();
    return {
      safe:{name:"SAFE",icon:"◈",desc:`Dobj ${Math.floor(sides/2)+1}–${sides} között.`,reward:1.5},
      precision:{name:"PRECISION",icon:"⌖",desc:`Találd el ezt a szűk tartományt: ${min}–${max}.`,reward:precisionReward()},
      jackpot:{name:"JACKPOT",icon:"✦",desc:`Dobj pontosan ${sides}-at.`,reward:sides}
    };
  };
  const isSuccess=value=>{
    const [min,max]=precisionRange();
    return contract==="safe"?value>=Math.floor(sides/2)+1:contract==="precision"?value>=min&&value<=max:value===sides;
  };
  const recordRun=()=>{
    if(ended)return;ended=true;
    const profit=totalPayout-totalSpent,score=Math.max(0,Math.round(profit+successes*100+highestStreak*75+bestRoll*10));
    stats.bestRunScore=Math.max(stats.bestRunScore||0,score);
    stats.bestProfit=Math.max(stats.bestProfit||0,profit);
    stats.highestMultiplier=Math.max(stats.highestMultiplier||1,currentMultiplier());
    if(successes===8)stats.perfectRuns=(stats.perfectRuns||0)+1;
    saveData();
    setStage(`<div class="dice-run dice-summary"><p class="eyebrow">8 ROUND RISK RUN COMPLETE</p><h3>${profit>=0?"LABOR PROFIT":"LABOR LOSS"} • ${profit>=0?"+":""}${profit} ●</h3><div class="dice-summary-grid"><article><span>TOTAL PROFIT</span><b>${profit>=0?"+":""}${profit}</b></article><article><span>SUCCESSFUL CONTRACTS</span><b>${successes}/8</b></article><article><span>HIGHEST STREAK</span><b>${highestStreak}</b></article><article><span>BEST ROLL</span><b>${bestRoll}</b></article><article><span>RUN SCORE</span><b>${score}</b></article><article><span>REROLLS LEFT</span><b>${rerolls}</b></article></div><button id="dice-new-run" class="pixel-btn primary">NEW RISK RUN</button>${arcadeComment(successes===8?"jackpot":profit>0?"win":"lose")}</div>`);
    reward(0,Math.max(8,successes*6),{result:profit>0?"win":profit===0?"draw":"loss",score});
    $("#dice-new-run").onclick=startDice;
  };
  const nextRound=()=>{
    pendingValue=null;
    if(round>=8)return recordRun();
    round++;
    if([3,5,7].includes(round))return renderUpgrade();
    render();
  };
  const settle=()=>{
    if(pendingValue==null)return;
    const value=pendingValue,success=isSuccess(value),data=contractData()[contract],runMultiplier=currentMultiplier();
    let payout=0;
    if(success){
      payout=Math.round(bet*data.reward*runMultiplier);
      successes++;streak++;highestStreak=Math.max(highestStreak,streak);
      if(contract==="jackpot")stats.totalJackpots=(stats.totalJackpots||0)+1;
    }else streak=0;
    totalPayout+=payout;currentPlayer.coins+=payout;if(payout>0){currentPlayer.coinsEarned=(currentPlayer.coinsEarned||0)+payout;addDaily("coins",payout);}
    stats.highestMultiplier=Math.max(stats.highestMultiplier||1,currentMultiplier(),runMultiplier);
    saveData();updateHud();
    setStage(`<div class="dice-run dice-resolution ${success?"success":"failure"}"><p class="eyebrow">ROUND ${round}/8 • ${data.name}</p><div class="dice-result-face">${value}</div><h3>${success?"CONTRACT COMPLETE":"CONTRACT FAILED"}</h3><p>${success?`BASE ×${data.reward} • STREAK ×${runMultiplier} • +${payout} ●`:`A szorzó visszaállt ×1.0-ra. A futam folytatódik.`}</p><div class="dice-run-strip"><span>PROFIT <b>${totalPayout-totalSpent>=0?"+":""}${totalPayout-totalSpent}</b></span><span>SUCCESS <b>${successes}/${round}</b></span><span>NEXT MULTI <b>×${currentMultiplier()}</b></span></div><button id="dice-continue" class="pixel-btn primary">${round===8?"RUN SUMMARY":"NEXT ROUND"}</button></div>`);
    $("#dice-continue").onclick=nextRound;
  };
  const roll=()=>{
    if(pendingValue==null){
      if(currentPlayer.coins<bet)return toast("NINCS ELÉG ÉRMÉD!");
      currentPlayer.coins-=bet;totalSpent+=bet;saveData();updateHud();
    }
    const raw=Math.floor(Math.random()*sides)+1;
    pendingValue=Math.min(sides,raw+loadedEdge);bestRoll=Math.max(bestRoll,pendingValue);
    const data=contractData()[contract],success=isSuccess(pendingValue);
    setStage(`<div class="dice-run dice-roll"><p class="eyebrow">ROUND ${round}/8 • ${data.name} • D${sides}</p><div id="die" class="dice-result-face dice-face">${pendingValue}</div><h3>${success?"SUCCESS RANGE":"OUTSIDE CONTRACT"}</h3><p>${data.desc}${loadedEdge?` • LOADED EDGE: ${raw} + 1`:""}</p><div class="dice-run-strip"><span>REROLLS <b>${rerolls}</b></span><span>STREAK <b>${streak}</b></span><span>MULTIPLIER <b>×${currentMultiplier()}</b></span></div><div class="game-actions"><button id="dice-keep" class="pixel-btn ${success?"primary":"secondary"}">KEEP RESULT</button><button id="dice-reroll" class="pixel-btn ${success?"secondary":"primary"}" ${rerolls<=0?"disabled":""}>REROLL • ${rerolls}</button></div><small>A reroll nem von le újabb tétet.</small></div>`);
    $("#dice-keep").onclick=settle;
    $("#dice-reroll").onclick=()=>{if(rerolls<=0)return;rerolls--;pendingValue=0;roll();};
  };
  const renderUpgrade=()=>{
    setStage(`<div class="dice-run dice-upgrade"><p class="eyebrow">ROUND ${round-1} COMPLETE • TEMPORARY UPGRADE</p><h3>CHOOSE ONE LAB MODULE</h3><div class="dice-upgrade-grid"><button data-dice-upgrade="edge"><b>LOADED EDGE</b><span>Every roll receives +1, capped at the die maximum.</span><em>${loadedEdge?"ACTIVE • STACKS TO +1 ONLY":"ADD +1 TO EVERY ROLL"}</em></button><button data-dice-upgrade="reroll"><b>REROLL CELL</b><span>Gain one additional reroll for this run.</span><em>CURRENT: ${rerolls}</em></button><button data-dice-upgrade="core"><b>MULTIPLIER CORE</b><span>The streak multiplier climbs one tier sooner.</span><em>CORES: ${multiplierCore}</em></button></div></div>`);
    $$("[data-dice-upgrade]").forEach(button=>button.onclick=()=>{
      const id=button.dataset.diceUpgrade;
      if(id==="edge")loadedEdge=1;else if(id==="reroll")rerolls++;else multiplierCore=Math.min(2,multiplierCore+1);
      render();
    });
  };
  const render=()=>{
    const contracts=contractData();
    setStage(`<div class="dice-run"><header class="dice-run-head"><div><p class="eyebrow">EIGHT-ROUND RISK RUN</p><h3>ROUND ${round}/8</h3></div><div class="dice-run-strip"><span>REROLLS <b>${rerolls}</b></span><span>STREAK <b>${streak}</b></span><span>MULTIPLIER <b>×${currentMultiplier()}</b></span><span>PROFIT <b>${totalPayout-totalSpent>=0?"+":""}${totalPayout-totalSpent}</b></span></div></header><section class="dice-loadout"><div><span>DIE</span>${[6,8,12,20].map(value=>`<button data-die="${value}" class="${value===sides?"active":""}">D${value}</button>`).join("")}</div><div><span>BET</span><button data-dice-bet="-5">−5</button><b>${bet} ●</b><button data-dice-bet="5">+5</button></div></section><div class="dice-contracts">${Object.entries(contracts).map(([id,item])=>`<button data-contract="${id}" class="${id===contract?"active":""}"><i>${item.icon}</i><b>${item.name}</b><span>${item.desc}</span><em>REWARD ×${item.reward}</em></button>`).join("")}</div><button id="dice-roll" class="pixel-btn primary">ROLL D${sides} • ${bet} ●</button><p class="result">Larger dice make PRECISION narrower and increase its reward.</p></div>`);
    $$("[data-die]").forEach(button=>button.onclick=()=>{sides=+button.dataset.die;render();});
    $$("[data-contract]").forEach(button=>button.onclick=()=>{contract=button.dataset.contract;render();});
    $$("[data-dice-bet]").forEach(button=>button.onclick=()=>{bet=Math.max(1,Math.min(currentPlayer.coins,bet+(+button.dataset.diceBet)));render();});
    $("#dice-roll").onclick=roll;
  };
  render();
}

function startMemory(launchOptions=null){
  const preselectedDifficulty=typeof launchOptions==="string"?launchOptions:launchOptions?.difficulty;
  const stats=currentPlayer.gameStats.memory||={plays:0,wins:0,losses:0,draws:0,best:null};
  if(["easy","normal","hard"].includes(preselectedDifficulty))return beginMemory(preselectedDifficulty);
  setStage(`<div class="arcade-mode-select"><p class="eyebrow">MEMORY RUN PROTOCOL</p><h3>SELECT DIFFICULTY</h3><div class="arcade-mode-grid"><button data-memory-difficulty="easy"><b>EASY</b><small>Starts 4×4 • Unlimited time</small></button><button data-memory-difficulty="normal"><b>NORMAL</b><small>Starts 5×4 • 90 seconds</small></button><button data-memory-difficulty="hard"><b>HARD</b><small>Starts 6×4 • 75 seconds</small></button></div><div class="quiz-career-strip"><span>BEST SCORE <b>${stats.bestScore||0}</b></span><span>FEWEST MOVES <b>${Number.isFinite(stats.fewestMoves)?stats.fewestMoves:"—"}</b></span><span>FASTEST <b>${Number.isFinite(stats.fastestCompletion)?`${stats.fastestCompletion}s`:"—"}</b></span><span>HIGHEST LEVEL <b>${stats.highestLevel||0}/3</b></span></div></div>`);
  $$('[data-memory-difficulty]').forEach(button=>button.onclick=()=>beginMemory(button.dataset.memoryDifficulty));
  function beginMemory(difficulty){
    const configs={easy:[{cols:4,rows:4,time:0},{cols:5,rows:4,time:0},{cols:6,rows:4,time:0}],normal:[{cols:5,rows:4,time:90},{cols:6,rows:4,time:82},{cols:6,rows:5,time:75}],hard:[{cols:6,rows:4,time:75},{cols:6,rows:5,time:65},{cols:6,rows:6,time:55}]}[difficulty],icons=["👾","🚀","⭐","💎","🛸","🤖","🍒","⚡","🌙","🦊","🐲","🎮","🧠","👻","🔥","🌊","🪐","🏆"],started=Date.now();
    let level=1,totalScore=0,totalMoves=0,combo=0,cards=[],open=[],done=new Set(),locked=false,remaining=0,timer=null,transitionTimer=null,peekTimer=null,ended=false;
    const multiplier=()=>combo>=6?2:combo>=4?1.5:combo>=2?1.25:1;
    const stopTimers=()=>{clearInterval(timer);clearTimeout(transitionTimer);clearTimeout(peekTimer)};
    const cardNodes=()=>$$('.memory-card');
    const buildDeck=(pairs,stage)=>{const specials=stage===1?[{key:"time",icon:"⏱",type:"time"}]:stage===2?[{key:"reveal",icon:"◉",type:"reveal"}]:[{key:"time",icon:"⏱",type:"time"},{key:"reveal",icon:"◉",type:"reveal"},{key:"trap",icon:"⚠",type:"trap"}],normalCount=Math.max(0,pairs-specials.length),defs=[...icons.slice(0,normalCount).map((icon,index)=>({key:`normal-${index}`,icon,type:"normal"})),...specials];return shuffle(defs.flatMap(def=>[{...def},{...def}]))};
    const updateHud=()=>{$("#memory-score").textContent=totalScore;$("#memory-moves").textContent=totalMoves;$("#memory-combo").textContent=`x${multiplier()}`;$("#memory-time").textContent=remaining?`${remaining}s`:"∞"};
    const revealAll=()=>{locked=true;cardNodes().forEach((node,index)=>{if(!done.has(index))node.classList.add("peek")});clearTimeout(peekTimer);peekTimer=setTimeout(()=>{cardNodes().forEach(node=>node.classList.remove("peek"));locked=false},1300)};
    const retrapPair=()=>{const solvedKeys=[...new Set([...done].map(index=>cards[index].key).filter(key=>cards.find(card=>card.key===key)?.type==="normal"))];if(!solvedKeys.length)return;const key=solvedKeys[Math.floor(Math.random()*solvedKeys.length)];cards.forEach((card,index)=>{if(card.key===key){done.delete(index);cardNodes()[index]?.classList.remove("done","open")}});$(".result").textContent="TRAP CARD • ONE SOLVED PAIR WAS HIDDEN AGAIN"};
    const applySpecial=card=>{if(card.type==="time"){if(remaining)remaining+=8;else totalScore+=80;$(".result").textContent=remaining?"TIME CARD • +8 SECONDS":"TIME CARD • +80 SCORE"}else if(card.type==="reveal"){$(".result").textContent="REVEAL CARD • BOARD SCAN";revealAll()}else if(card.type==="trap")retrapPair()};
    const completeLevel=()=>{stats.highestLevel=Math.max(stats.highestLevel||0,level);if(level>=3)return finish(true);clearInterval(timer);locked=true;totalScore+=level*250;level++;$(".result").textContent=`LEVEL CLEAR • PREPARING BOARD ${level}`;transitionTimer=setTimeout(()=>{if(!ended)loadLevel()},1000)};
    const finish=won=>{if(ended)return;ended=true;stopTimers();const seconds=Math.round((Date.now()-started)/1000);stats.bestScore=Math.max(stats.bestScore||0,totalScore);if(won)stats.highestLevel=Math.max(stats.highestLevel||0,3);if(won){stats.fewestMoves=Math.min(Number.isFinite(stats.fewestMoves)?stats.fewestMoves:Infinity,totalMoves);stats.fastestCompletion=Math.min(Number.isFinite(stats.fastestCompletion)?stats.fastestCompletion:Infinity,seconds)}setStage(`<div class="memory-report"><h3>${won?"MEMORY RUN COMPLETE 🏆":"MEMORY RUN ENDED"}</h3><div class="career-grid"><article><span>SCORE</span><b>${totalScore}</b></article><article><span>MOVES</span><b>${totalMoves}</b></article><article><span>TIME</span><b>${seconds}s</b></article><article><span>LEVEL</span><b>${stats.highestLevel||0}/3</b></article></div><p>BEST ${stats.bestScore} • FEWEST ${Number.isFinite(stats.fewestMoves)?stats.fewestMoves:"—"} • FASTEST ${Number.isFinite(stats.fastestCompletion)?`${stats.fastestCompletion}s`:"—"}</p><button id="memory-again" class="pixel-btn primary">NEW RUN</button></div>`);reward(Math.round(totalScore/100),Math.max(5,Math.round(totalScore/80)),{result:won?"win":"loss",score:totalScore});$("#memory-again").onclick=startMemory};
    const handleCard=index=>{if(locked||done.has(index)||open.includes(index)||ended)return;const node=cardNodes()[index];node.classList.add("open");open.push(index);if(open.length<2)return;totalMoves++;updateHud();const [a,b]=open;if(cards[a].key===cards[b].key){combo++;const gained=Math.round(100*multiplier());totalScore+=gained;done.add(a);done.add(b);cardNodes()[a].classList.add("done");cardNodes()[b].classList.add("done");const matched=cards[a];open=[];applySpecial(matched);updateHud();if(done.size===cards.length&&!locked)completeLevel();else if(done.size===cards.length)transitionTimer=setTimeout(()=>{if(!ended)completeLevel()},1400)}else{combo=0;locked=true;transitionTimer=setTimeout(()=>{cardNodes()[a]?.classList.remove("open");cardNodes()[b]?.classList.remove("open");open=[];locked=false;updateHud()},650)}};
    const loadLevel=()=>{stopTimers();locked=false;open=[];done=new Set();combo=0;const config=configs[level-1],pairs=config.cols*config.rows/2;remaining=config.time;cards=buildDeck(pairs,level);setStage(`<div class="game-score memory-hud">${difficulty.toUpperCase()} • LEVEL ${level}/3 • SCORE <b id="memory-score">${totalScore}</b> • MOVES <b id="memory-moves">${totalMoves}</b> • COMBO <b id="memory-combo">x1</b> • TIME <b id="memory-time">${remaining||"∞"}</b></div><div class="memory-grid memory-run-grid" style="--memory-cols:${config.cols}">${cards.map((card,index)=>`<button class="memory-card" data-i="${index}"><span>${card.icon}</span></button>`).join("")}</div><p class="result">Match pairs. Special pairs can change the run.</p>`);cardNodes().forEach(card=>card.onclick=()=>handleCard(Number(card.dataset.i)));if(remaining)timer=setInterval(()=>{remaining--;updateHud();if(remaining<=0)finish(false)},1000)};
    loadLevel();setActiveCleanup(()=>{ended=true;stopTimers()});
  }
}
function startReaction(launchOptions={}){
  setStage(`<div class="reaction-intro"><p class="eyebrow">FIVE-EVENT SKILL TEST</p><h3>TURBO REACTION CIRCUIT</h3><ol><li>Green signal</li><li>Direction key</li><li>Color conflict</li><li>Fake red signal</li><li>Moving target</li></ol><button id="reaction-start" class="pixel-btn primary">START FIVE-ROUND TEST</button><p class="result">Early −250 • Wrong −150 • Missed event 0</p></div>`);
  const timers=new Set(),results=[];let round=0,totalScore=0,falseStarts=0,roundActive=false,signalLive=false,startedAt=0,ended=false;
  const schedule=(fn,delay)=>{const id=setTimeout(()=>{timers.delete(id);fn()},delay);timers.add(id);return id},clearTimers=()=>{timers.forEach(clearTimeout);timers.clear()};
  const eventNames=["GREEN SIGNAL","DIRECTION SIGNAL","COLOR CONFLICT","FAKE SIGNAL","MOVING TARGET"];
  const scoreRound=(ms,penalty=0)=>Math.max(0,1000-ms*2)-penalty;
  const updateHeader=()=>{const score=$("#reaction-total");if(score)score.textContent=totalScore;const label=$("#reaction-round");if(label)label.textContent=`${round+1}/5`};
  const completeRound=(ms=null,penalty=0,note="")=>{if(!roundActive)return;roundActive=false;signalLive=false;clearTimers();const roundScore=ms==null?0:scoreRound(ms,penalty);totalScore+=roundScore;if(penalty===250)falseStarts++;results.push({round:round+1,type:eventNames[round],ms,penalty,score:roundScore,note});const result=$("#reaction-feedback");if(result)result.textContent=`${note} • ${ms==null?"NO TIME":`${Math.round(ms)} ms`} • ${roundScore} POINTS`;round++;if(round>=5)return schedule(finish,900);schedule(runRound,900)};
  const armTimeout=()=>schedule(()=>completeRound(null,0,"MISSED EVENT"),2500);
  const early=()=>completeRound(0,250,"FALSE START −250");
  const showSignal=(content,className="go")=>{signalLive=true;startedAt=performance.now();const arena=$("#reaction-arena");arena.className=`reaction-arena ${className}`;arena.innerHTML=content;armTimeout()};
  const runRound=()=>{if(ended)return;roundActive=true;signalLive=false;setStage(`<div class="game-score">ROUND <b id="reaction-round">${round+1}/5</b> • TOTAL <b id="reaction-total">${totalScore}</b></div><h3>${eventNames[round]}</h3><div id="reaction-arena" class="reaction-arena waiting">GET READY…</div><p id="reaction-feedback" class="result">Wait for the event.</p>`);const arena=$("#reaction-arena"),delay=1100+Math.random()*1700;
    if(round===0){arena.onclick=()=>signalLive?completeRound(performance.now()-startedAt,0,"GREEN HIT"):early();schedule(()=>showSignal("CLICK NOW","go"),delay)}
    else if(round===1){const directions=[{key:"ArrowUp",label:"↑"},{key:"ArrowDown",label:"↓"},{key:"ArrowLeft",label:"←"},{key:"ArrowRight",label:"→"}],target=directions[Math.floor(Math.random()*directions.length)];arena.dataset.targetKey=target.key;schedule(()=>showSignal(`<span class="reaction-arrow">${target.label}</span><small>PRESS THE ARROW KEY</small>`,"direction"),delay)}
    else if(round===2){const colors=[{id:"red",label:"RED",hex:"#ff3e5f"},{id:"green",label:"GREEN",hex:"#2ce58b"},{id:"blue",label:"BLUE",hex:"#31a8ff"}],word=colors[Math.floor(Math.random()*colors.length)],display=colors.filter(c=>c.id!==word.id)[Math.floor(Math.random()*2)];schedule(()=>{showSignal(`<b style="color:${display.hex}">${word.label}</b><small>CLICK THE BUTTON MATCHING THE WORD</small><div class="reaction-colors">${colors.map(c=>`<button data-color="${c.id}" style="--signal:${c.hex}">${c.label}</button>`).join("")}</div>`,"conflict");$$('[data-color]').forEach(button=>button.onclick=e=>{e.stopPropagation();const ms=performance.now()-startedAt;completeRound(ms,button.dataset.color===word.id?0:150,button.dataset.color===word.id?"COLOR MATCH":"WRONG COLOR −150")})},delay);arena.onclick=()=>{if(!signalLive)early()}}
    else if(round===3){arena.onclick=()=>signalLive?completeRound(performance.now()-startedAt,0,"GREEN CONFIRMED"):early();schedule(()=>{arena.className="reaction-arena fake";arena.textContent="RED • DO NOT CLICK";schedule(()=>showSignal("GREEN • CLICK NOW","go"),900+Math.random()*1000)},delay)}
    else{arena.onclick=e=>{if(!signalLive)return early();if(!e.target.closest("#reaction-target"))completeRound(performance.now()-startedAt,150,"WRONG TARGET −150")};schedule(()=>{const x=8+Math.random()*76,y=10+Math.random()*68;showSignal(`<button id="reaction-target" class="reaction-target" style="left:${x}%;top:${y}%" aria-label="Moving target"></button>`,"target-field");$("#reaction-target").onclick=e=>{e.stopPropagation();completeRound(performance.now()-startedAt,0,"TARGET HIT")}},delay)}updateHeader()};
  const keyHandler=e=>{if(ended||round!==1||!roundActive)return;if(!signalLive)return early();const target=$("#reaction-arena")?.dataset.targetKey,ms=performance.now()-startedAt;completeRound(ms,e.key===target?0:150,e.key===target?"CORRECT DIRECTION":"WRONG KEY −150")};
  const finish=()=>{if(ended)return;ended=true;clearTimers();window.removeEventListener("keydown",keyHandler);const valid=results.filter(item=>item.ms!=null&&item.penalty<250),average=valid.length?Math.round(valid.reduce((sum,item)=>sum+item.ms,0)/valid.length):0,best=valid.length?Math.round(Math.min(...valid.map(item=>item.ms))):0,maximum=5000,rating=totalScore>=4500?"S":totalScore>=3600?"A":totalScore>=2700?"B":totalScore>=1800?"C":"D",stats=currentPlayer.gameStats.reaction||={plays:0,wins:0,losses:0,draws:0,best:null};stats.bestAverage=average?Math.min(Number.isFinite(stats.bestAverage)?stats.bestAverage:Infinity,average):stats.bestAverage;stats.fastestReaction=best?Math.min(Number.isFinite(stats.fastestReaction)?stats.fastestReaction:Infinity,best):stats.fastestReaction;stats.highestScore=Math.max(stats.highestScore||0,totalScore);if(falseStarts===0&&results.every(item=>item.ms!=null&&item.penalty===0))stats.perfectRuns=(stats.perfectRuns||0)+1;setStage(`<div class="reaction-report"><h3>REACTION RATING: <strong>${rating}</strong></h3><div class="career-grid"><article><span>AVERAGE REACTION</span><b>${average||"—"}${average?" ms":""}</b></article><article><span>BEST ROUND</span><b>${best||"—"}${best?" ms":""}</b></article><article><span>FALSE STARTS</span><b>${falseStarts}</b></article><article><span>TOTAL SCORE</span><b>${totalScore}/${maximum}</b></article></div><section>${results.map(item=>`<p><b>${item.round}. ${item.type}</b><span>${item.ms==null?"MISSED":`${Math.round(item.ms)} ms`} • ${item.score}</span></p>`).join("")}</section><button id="reaction-again" class="pixel-btn primary">RUN AGAIN</button></div>`);reward(Math.max(0,Math.round(totalScore/120)),Math.max(5,Math.round(totalScore/100)),{result:rating==="S"||rating==="A"?"win":"loss",score:totalScore});$("#reaction-again").onclick=startReaction};
  window.addEventListener("keydown",keyHandler);$("#reaction-start").onclick=runRound;setActiveCleanup(()=>{ended=true;clearTimers();window.removeEventListener("keydown",keyHandler)});
}
function startTtt(launchOptions=null,legacyDifficulty=null){
  const preselectedMode=typeof launchOptions==="string"?launchOptions:launchOptions?.mode,preselectedDifficulty=typeof launchOptions==="string"?legacyDifficulty:launchOptions?.difficulty;
  const stats=currentPlayer.gameStats.ttt||={plays:0,wins:0,losses:0,draws:0,best:null};stats.records||={};stats.unlockedSkins||=["neon"];
  const skinDefs={neon:{name:"NEON GRID",className:"skin-neon"},solar:{name:"SOLAR BOARD",className:"skin-solar"},void:{name:"VOID MATRIX",className:"skin-void"}};
  if(["classic","four","survival"].includes(preselectedMode))return beginTtt(preselectedMode,["easy","normal","hard"].includes(preselectedDifficulty)?preselectedDifficulty:"normal",stats.unlockedSkins[0]||"neon");
  setStage(`<div class="ttt-setup arcade-mode-select"><p class="eyebrow">TACTICAL GRID LEAGUE</p><h3>NEON TIC-TAC-TOE</h3><div class="arcade-mode-grid"><button data-ttt-mode="classic"><b>CLASSIC 3×3</b><small>Three in a row • Best of three</small></button><button data-ttt-mode="four"><b>FOUR-IN-A-ROW</b><small>5×5 board • Connect four</small></button><button data-ttt-mode="survival"><b>SURVIVAL</b><small>Defeat increasingly stronger CPUs without losing</small></button></div><div class="ttt-options"><label>CPU LEVEL<select id="ttt-difficulty"><option value="easy">EASY</option><option value="normal" selected>NORMAL</option><option value="hard">HARD</option></select></label><label>BOARD SKIN<select id="ttt-skin">${stats.unlockedSkins.map(id=>`<option value="${id}">${skinDefs[id]?.name||id}</option>`).join("")}</select></label></div><p class="result">Solar unlocks after 3 series wins • Void unlocks at Survival streak 3.</p></div>`);
  $$('[data-ttt-mode]').forEach(button=>button.onclick=()=>beginTtt(button.dataset.tttMode,$("#ttt-difficulty").value,$("#ttt-skin").value));
  function beginTtt(mode,chosenDifficulty,skin){
    let difficulty=mode==="survival"?"easy":chosenDifficulty,size=mode==="four"?5:3,needed=mode==="four"?4:3,board=[],round=1,playerSeries=0,cpuSeries=0,survivalStreak=0,over=false,ended=false,cpuTimer=null,playerTurn=true;
    const recordKey=mode==="survival"?"adaptive":difficulty;stats.records[mode]||={};const record=stats.records[mode][recordKey]||={wins:0,losses:0,draws:0,seriesWins:0,bestStreak:0};stats.records[mode][recordKey]=record;
    const allLines=(boardSize,winLength)=>{const lines=[];for(let y=0;y<boardSize;y++)for(let x=0;x<=boardSize-winLength;x++)lines.push(Array.from({length:winLength},(_,i)=>y*boardSize+x+i));for(let x=0;x<boardSize;x++)for(let y=0;y<=boardSize-winLength;y++)lines.push(Array.from({length:winLength},(_,i)=>(y+i)*boardSize+x));for(let y=0;y<=boardSize-winLength;y++)for(let x=0;x<=boardSize-winLength;x++)lines.push(Array.from({length:winLength},(_,i)=>(y+i)*boardSize+x+i));for(let y=0;y<=boardSize-winLength;y++)for(let x=winLength-1;x<boardSize;x++)lines.push(Array.from({length:winLength},(_,i)=>(y+i)*boardSize+x-i));return lines};
    let lines=allLines(size,needed);
    const winner=b=>{const line=lines.find(indices=>indices.every(index=>b[index]&&b[index]===b[indices[0]]));return line?{mark:b[line[0]],line}:null};
    const available=b=>b.map((value,index)=>value?null:index).filter(index=>index!==null);
    const minimax=(state,maximizing,depth=0)=>{const won=winner(state);if(won)return won.mark==="O"?10-depth:depth-10;if(state.every(Boolean))return 0;const scores=available(state).map(index=>{state[index]=maximizing?"O":"X";const score=minimax(state,!maximizing,depth+1);state[index]=null;return score});return maximizing?Math.max(...scores):Math.min(...scores)};
    const immediateMove=(mark,state=board)=>available(state).find(index=>{state[index]=mark;const won=winner(state)?.mark===mark;state[index]=null;return won});
    const lineScore=state=>lines.reduce((total,line)=>{const own=line.filter(index=>state[index]==="O").length,enemy=line.filter(index=>state[index]==="X").length;if(own&&enemy)return total;return total+own*own-enemy*enemy*1.2},0);
    const hardMove=()=>{const empty=available(board);if(size===3){let best=-Infinity,picks=[];empty.forEach(index=>{board[index]="O";const score=minimax(board,false);board[index]=null;if(score>best){best=score;picks=[index]}else if(score===best)picks.push(index)});return picks[Math.floor(Math.random()*picks.length)]}let best=-Infinity,picks=[];empty.forEach(index=>{board[index]="O";let score=winner(board)?.mark==="O"?10000:lineScore(board);board[index]=null;board[index]="X";if(winner(board)?.mark==="X")score+=8500;board[index]=null;if(score>best){best=score;picks=[index]}else if(score===best)picks.push(index)});return picks[Math.floor(Math.random()*picks.length)]};
    const cpuPick=()=>{const empty=available(board),win=immediateMove("O");if(difficulty==="easy")return Math.random()<.2&&win!=null?win:empty[Math.floor(Math.random()*empty.length)];const block=immediateMove("X");if(difficulty==="normal")return win??block??(board[Math.floor(board.length/2)]?null:Math.floor(board.length/2))??empty[Math.floor(Math.random()*empty.length)];return win??block??hardMove()};
    const drawBoard=()=>{$$(".ttt-cell").forEach((cell,index)=>{cell.textContent=board[index]||"";cell.disabled=!!board[index]||over||!playerTurn;cell.classList.toggle("mark-x",board[index]==="X");cell.classList.toggle("mark-o",board[index]==="O")})};
    const updateStatus=(text="")=>{const result=$("#ttt-result");if(result)result.textContent=text||`${playerTurn?"YOUR TURN":"CPU THINKING"} • ${difficulty.toUpperCase()}`;const score=$("#ttt-series");if(score)score.textContent=mode==="survival"?`SURVIVAL STREAK ${survivalStreak}`:`YOU ${playerSeries} — ${cpuSeries} CPU`};
    const unlockSkins=()=>{const seriesWins=Object.values(stats.records).flatMap(group=>Object.values(group)).reduce((sum,item)=>sum+(item.seriesWins||0),0);if(seriesWins>=3&&!stats.unlockedSkins.includes("solar"))stats.unlockedSkins.push("solar");if(record.bestStreak>=3&&!stats.unlockedSkins.includes("void"))stats.unlockedSkins.push("void")};
    const finishRun=won=>{if(ended)return;ended=true;clearTimeout(cpuTimer);record.bestStreak=Math.max(record.bestStreak||0,survivalStreak);if(won){record.seriesWins++;record.wins++}else record.losses++;unlockSkins();setStage(`<div class="ttt-report"><h3>${won?"GRID VICTORY 🏆":"CPU VICTORY"}</h3><div class="career-grid"><article><span>MODE</span><b>${mode.toUpperCase()}</b></article><article><span>CPU</span><b>${recordKey.toUpperCase()}</b></article><article><span>BEST STREAK</span><b>${record.bestStreak}</b></article><article><span>SERIES WINS</span><b>${record.seriesWins}</b></article></div><p>UNLOCKED SKINS: ${stats.unlockedSkins.map(id=>skinDefs[id]?.name||id).join(" • ")}</p><button id="ttt-again" class="pixel-btn primary">NEW MATCH</button></div>`);reward(won?40+survivalStreak*10:5,won?35:8,{result:won?"win":"loss",score:mode==="survival"?survivalStreak:playerSeries});$("#ttt-again").onclick=startTtt};
    const nextBoard=()=>{over=false;board=Array(size*size).fill(null);playerTurn=round%2===1;setStage(`<div class="game-score"><b id="ttt-series"></b> • ROUND ${round} • ${mode==="four"?"5×5 CONNECT 4":"3×3 CONNECT 3"}</div><div class="ttt-grid ttt-run-grid ${skinDefs[skin]?.className||"skin-neon"}" style="--ttt-size:${size}">${board.map((_,index)=>`<button class="ttt-cell" data-i="${index}"></button>`).join("")}</div><p id="ttt-result" class="result"></p>`);$$(".ttt-cell").forEach(cell=>cell.onclick=()=>playerMove(Number(cell.dataset.i)));updateStatus();drawBoard();if(!playerTurn)cpuTimer=setTimeout(cpuMove,450)};
    const resolveBoard=()=>{const won=winner(board);if(won){won.line.forEach(index=>$$('.ttt-cell')[index]?.classList.add("winning"));over=true;if(won.mark==="X"){if(mode==="survival"){survivalStreak++;record.wins++;record.bestStreak=Math.max(record.bestStreak,survivalStreak);round++;difficulty=survivalStreak>=2?"hard":survivalStreak>=1?"normal":"easy";updateStatus(`CPU DEFEATED • NEXT: ${difficulty.toUpperCase()}`);cpuTimer=setTimeout(nextBoard,900);return true}playerSeries++}else{if(mode==="survival"){updateStatus("SURVIVAL RUN LOST");cpuTimer=setTimeout(()=>finishRun(false),900);return true}cpuSeries++}updateStatus(won.mark==="X"?"ROUND WON":"ROUND LOST");if(playerSeries>=2||cpuSeries>=2){cpuTimer=setTimeout(()=>finishRun(playerSeries>=2),900);return true}round++;cpuTimer=setTimeout(nextBoard,900);return true}if(board.every(Boolean)){over=true;record.draws++;updateStatus("DRAW • STARTER ROTATES");round++;cpuTimer=setTimeout(nextBoard,800);return true}return false};
    const playerMove=index=>{if(ended||over||!playerTurn||board[index])return;board[index]="X";drawBoard();if(resolveBoard())return;playerTurn=false;updateStatus();drawBoard();cpuTimer=setTimeout(cpuMove,350)};
    const cpuMove=()=>{if(ended||over)return;const pick=cpuPick();if(pick==null)return;board[pick]="O";drawBoard();if(resolveBoard())return;playerTurn=true;updateStatus();drawBoard()};
    nextBoard();setActiveCleanup(()=>{ended=true;clearTimeout(cpuTimer)});
  }
}
function startNeonSalvager(launchOptions={}){
  const career=currentPlayer.salvager,contract=launchOptions.mode==="nightmare"&&career.level>=8?"nightmare":"standard";
  let cleanupRun=()=>{};
  setActiveCleanup(()=>cleanupRun());
  const unlockDefs=[
    {id:"scanner",level:2,cost:180,name:"SCANNER",icon:"⌁",desc:"Nearby loot pulses through walls."},
    {id:"scattergun",level:3,cost:260,name:"SCRAP SHOTGUN",icon:"≋",desc:"Five-projectile knockback blast."},
    {id:"reactor",level:4,cost:340,name:"REACTOR SECTOR",icon:"☢",desc:"Richer, more dangerous rooms."},
    {id:"companion",level:6,cost:520,name:"DRONE COMPANION",icon:"◇",desc:"A small drone fires beside you."},
    {id:"rifle",level:4,cost:420,name:"PIERCING RAIL RIFLE",icon:"↠",desc:"Charged extreme-damage penetrator."},
    {id:"cryo",level:5,cost:460,name:"CRYO BLASTER",icon:"❄",desc:"Slows and freezes repeated targets."},
    {id:"arc",level:6,cost:520,name:"ARC CARBINE",icon:"ϟ",desc:"Automatic fire with chain lightning."},
    {id:"beacon",level:7,cost:620,name:"DRONE BEACON LAUNCHER",icon:"◇",desc:"Deploys temporary combat drones."},
    {id:"backpack",level:7,cost:650,name:"LARGE BACKPACK",icon:"▣",desc:"+25% scrap capacity and value."},
    {id:"nightmare",level:8,cost:900,name:"NIGHTMARE CONTRACTS",icon:"⚠",desc:"Elite station, premium salvage."}
  ];
  const weapons={
    pistol:{name:"ION PISTOL",icon:"•",desc:"Accurate, reliable and cool-running.",damage:22,fireRate:.19,heat:11,projectileSpeed:650,range:760,recoil:.09,knockback:5,specialEffect:"balanced",count:1,spread:0,color:"#31f5ff"},
    scattergun:{name:"SCRAP SHOTGUN",icon:"≋",desc:"Five fragments, brutal knockback and heat.",damage:15,fireRate:.58,heat:31,projectileSpeed:510,range:390,recoil:.25,knockback:30,specialEffect:"scatter",count:5,spread:.22,color:"#ff9d32"},
    rifle:{name:"PIERCING RAIL RIFLE",icon:"↠",desc:"Charge, penetrate, erase a firing line.",damage:92,fireRate:1.25,heat:38,projectileSpeed:1050,range:1150,recoil:.32,knockback:42,specialEffect:"rail",count:1,spread:0,color:"#ff3eb5",pierce:6},
    cryo:{name:"CRYO BLASTER",icon:"❄",desc:"Low damage; repeated hits freeze targets.",damage:12,fireRate:.25,heat:14,projectileSpeed:570,range:680,recoil:.08,knockback:3,specialEffect:"cryo",count:1,spread:.025,color:"#36cfff",slow:true},
    arc:{name:"ARC CARBINE",icon:"ϟ",desc:"Automatic pulse fire that chains nearby.",damage:13,fireRate:.105,heat:8,projectileSpeed:720,range:720,recoil:.065,knockback:4,specialEffect:"arc",count:1,spread:.04,color:"#d83cff"},
    beacon:{name:"DRONE BEACON LAUNCHER",icon:"◇",desc:"Deploys an eight-second combat drone.",damage:0,fireRate:2.8,heat:24,projectileSpeed:0,range:0,recoil:.18,knockback:0,specialEffect:"beacon",count:0,spread:0,color:"#72ff77"}
  };
  const weaponSkins=[
    {id:"ion-blue",name:"ION BLUE",tone:"#31f5ff",crop:[125,185,320,180]},
    {id:"breach-orange",name:"BREACH ORANGE",tone:"#ff9d32",crop:[560,185,420,180]},
    {id:"neon-rail",name:"NEON RAIL",tone:"#ff3eb5",crop:[1000,195,490,180]},
    {id:"cryo-core",name:"CRYO CORE",tone:"#36cfff",crop:[95,580,390,190]},
    {id:"void-pulse",name:"VOID PULSE",tone:"#d83cff",crop:[545,580,445,180]},
    {id:"bio-lens",name:"BIO LENS",tone:"#72ff77",crop:[1050,580,395,180]}
  ];
  const skinSvg=skin=>{const [x,y,w,h]=skin.crop;return `<svg class="salvage-skin-art" viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs><clipPath id="skin-clip-${skin.id}"><rect width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#skin-clip-${skin.id})"><image href="assets/neon-salvager-weapons.png" x="${-x}" y="${-y}" width="1536" height="1024"/></g></svg>`};
  function saveCareer(){career.level=1+Math.floor(career.xp/120);saveData();}
  function careerHtml(){
    const unlockedWeapons=Object.keys(weapons).filter(id=>career.unlocks.includes(id));
    return `<section class="salvage-bay">
      <header class="salvage-bay-head"><div><small>ORBITAL RECOVERY UNIT 07</small><h3>NEON SALVAGER</h3><p>Bring the scrap home. The station keeps everything else.</p></div><div class="salvage-level"><span>LEVEL ${career.level}</span><b>${career.scrap.toLocaleString()} SCRAP</b><i style="--level:${Math.min(100,(career.xp%120)/1.2)}%"></i></div></header>
      <div class="salvage-career-strip"><span><b>${career.runs}</b> RUNS</span><span><b>${career.extractions}</b> EXTRACTS</span><span><b>${career.bestScrap}</b> BEST HAUL</span><span><b>${career.bestDepth}</b> ROOMS</span><span><b>${career.bosses}</b> BOSSES</span><span><b>${career.noDamageBossKills||0}</b> FLAWLESS</span><span><b>${career.fastestBossKill?career.fastestBossKill.toFixed(1)+"s":"—"}</b> BOSS TIME</span><span><b>${career.secretRooms||0}</b> SECRETS</span></div>
      <section class="salvage-loadout"><div><small>PRIMARY WEAPON</small><div class="salvage-choice-row">${unlockedWeapons.map(id=>`<button data-salvage-weapon="${id}" class="${career.weapon===id?"active":""}"><i>${weapons[id].icon}</i><b>${weapons[id].name}</b><span>${weapons[id].desc}</span></button>`).join("")}</div></div><div><small>STARTING GADGET</small><div class="salvage-choice-row">${[["none","NONE","Pure salvage skill."],["scanner","SCANNER","Reveal nearby scrap."],["companion","DRONE","Opening support drone."]].filter(([id])=>id==="none"||career.unlocks.includes(id)).map(([id,name,desc])=>`<button data-salvage-gadget="${id}" class="${career.gadget===id?"active":""}"><i>${id==="scanner"?"⌁":id==="companion"?"◇":"×"}</i><b>${name}</b><span>${desc}</span></button>`).join("")}</div></div><div class="salvage-skins"><small>WEAPON SKIN • COSMETIC ONLY</small><div>${weaponSkins.map(skin=>`<button data-salvage-skin="${skin.id}" class="${career.skin===skin.id?"active":""}" style="--skin-tone:${skin.tone}">${skinSvg(skin)}<b>${skin.name}</b><span>${career.skin===skin.id?"EQUIPPED":"SELECT"}</span></button>`).join("")}</div></div></section>
      <section class="salvage-unlocks"><header><div><small>PERMANENT SIDEGRADES</small><h4>SALVAGE WORKBENCH</h4></div><span>Power comes from options, not endless damage.</span></header><div>${unlockDefs.map(item=>{const owned=career.unlocks.includes(item.id),gated=career.level<item.level;return `<button data-salvage-unlock="${item.id}" ${owned||gated||career.scrap<item.cost?"disabled":""} class="${owned?"owned":gated?"locked":""}"><i>${item.icon}</i><b>${item.name}</b><span>${item.desc}</span><em>${owned?"INSTALLED":gated?`LEVEL ${item.level}`:`${item.cost} SCRAP`}</em></button>`}).join("")}</div></section>
      ${contract==="nightmare"?`<p class="salvage-warning">⚠ NIGHTMARE CONTRACT • ENEMY STRENGTH +55% • SALVAGE VALUE +80%</p>`:""}
      <button class="pixel-btn primary salvage-deploy" id="salvage-deploy">ENTER STATION <span>12–16 SEEDED ROOMS • ${contract.toUpperCase()}</span></button>
    </section>`;
  }
  function renderBay(){
    cleanupRun();cleanupRun=()=>{};
    setStage(careerHtml());
    $$("[data-salvage-weapon]").forEach(btn=>btn.onclick=()=>{career.weapon=btn.dataset.salvageWeapon;saveCareer();renderBay()});
    $$("[data-salvage-gadget]").forEach(btn=>btn.onclick=()=>{career.gadget=btn.dataset.salvageGadget;saveCareer();renderBay()});
    $$("[data-salvage-skin]").forEach(btn=>btn.onclick=()=>{career.skin=btn.dataset.salvageSkin;saveCareer();sfx("click");renderBay()});
    $$("[data-salvage-unlock]").forEach(btn=>btn.onclick=()=>{const item=unlockDefs.find(x=>x.id===btn.dataset.salvageUnlock);if(!item||career.unlocks.includes(item.id)||career.level<item.level||career.scrap<item.cost)return;career.scrap-=item.cost;career.unlocks.push(item.id);if(["scattergun","rifle","cryo","arc","beacon"].includes(item.id))career.weapon=item.id;saveCareer();sfx("buy");renderBay()});
    $("#salvage-deploy").onclick=startRun;
  }
  function startRun(){
    cleanupRun();cleanupRun=()=>{};
    const W=900,H=560,nightmare=contract==="nightmare",difficulty=launchOptions.difficulty==="hard"?1.22:1;
    const roomTypes=["corridor","storage","laboratory","security","reactor","treasure","exit"];
    const templates=[
      {name:"FRACTURED SPINE",type:"corridor",blocks:[[260,90,90,250],[550,220,90,250]],hazards:[]},
      {name:"CARGO VAULT",type:"storage",blocks:[[170,100,120,80],[610,100,120,80],[170,380,120,80],[610,380,120,80]],hazards:[]},
      {name:"BIO LAB",type:"laboratory",blocks:[[260,150,110,70],[530,150,110,70]],hazards:[[390,350,120,70]]},
      {name:"SECURITY HUB",type:"security",blocks:[[190,180,100,200],[610,180,100,200]],hazards:[]},
      {name:"COOLANT CROSS",type:"reactor",blocks:[[380,70,140,110],[380,380,140,110]],hazards:[[80,250,210,60],[610,250,210,60]]},
      {name:"RELIC LOCKER",type:"treasure",blocks:[[260,110,380,60],[260,390,380,60]],hazards:[]},
      {name:"TRANSFER RING",type:"corridor",blocks:[[210,120,90,90],[600,120,90,90],[210,350,90,90],[600,350,90,90]],hazards:[]},
      {name:"SYNTHETICS LAB",type:"laboratory",blocks:[[180,245,180,70],[540,245,180,70]],hazards:[[405,80,90,120],[405,360,90,120]]},
      {name:"TURRET GALLERY",type:"security",blocks:[[280,90,60,150],[560,320,60,150]],hazards:[]},
      {name:"MELTDOWN WALK",type:"reactor",blocks:[[220,80,90,170],[590,310,90,170]],hazards:[[365,70,170,80],[365,410,170,80]]},
      {name:"BLACK ARCHIVE",type:"storage",blocks:[[300,120,300,75],[300,365,300,75]],hazards:[]},
      {name:"GUARDIAN CORE",type:"exit",blocks:[[120,100,90,90],[690,100,90,90],[120,370,90,90],[690,370,90,90]],hazards:[]}
    ];
    const runSeed=(Date.now()^Math.floor(Math.random()*0x7fffffff))>>>0;
    let seedState=runSeed||1;const seeded=()=>{seedState|=0;seedState=seedState+0x6D2B79F5|0;let t=Math.imul(seedState^seedState>>>15,1|seedState);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
    const bossType=["mira","colossus","stalker"][Math.floor(seeded()*3)],bossNames={mira:"MIRA SECURITY CORE",colossus:"REACTOR COLOSSUS",stalker:"VENT STALKER"};
    const graphBlueprint=[
      [0,1,"entry"],[1,1,"storage"],[2,1,"corridor"],[3,1,"security"],[4,1,"boss"],[1,2,"laboratory"],[1,3,"extraction"],[2,3,"storage"],[2,2,"secret"],[3,2,"reactor"],[3,3,"storage"],[0,2,"corridor"],
      [4,2,"laboratory"],[4,3,"reactor"],[0,3,"storage"],[3,4,"treasure"]
    ],roomCount=12+Math.floor(seeded()*5),baseEdges=[[0,1],[0,11],[1,2],[1,5],[2,3],[2,8],[3,4],[3,9],[5,6],[5,8],[6,7],[7,8],[7,10],[8,9],[9,10],[10,6],[11,5]],extraEdges=[[4,12],[9,12],[12,13],[10,13],[11,14],[6,14],[10,15],[13,15]];
    const templatePool=templates.slice(0,11).filter(room=>room.type!=="reactor"||career.unlocks.includes("reactor"));
    const rooms=graphBlueprint.slice(0,roomCount).map(([gx,gy,kind],id)=>{let template;if(kind==="boss")template=templates[11];else if(kind==="extraction")template=templates[6];else if(kind==="secret")template=templates[7];else{const candidates=templatePool.filter(item=>kind==="corridor"?item.type==="corridor":kind==="storage"?item.type==="storage":kind==="laboratory"?item.type==="laboratory":kind==="reactor"?item.type==="reactor":true);template=candidates[Math.floor(seeded()*candidates.length)]||templatePool[Math.floor(seeded()*templatePool.length)]}return{...template,id,gx,gy,kind,type:kind==="boss"?"boss":kind==="extraction"?"exit":kind==="secret"?"treasure":template.type,name:kind==="boss"?bossNames[bossType]:kind==="extraction"?"EXTRACTION DOCK":kind==="secret"?"SECRET LAB":template.name,neighbors:[],depth:Math.max(0,gx+Math.abs(gy-1)),danger:kind==="boss"?3:kind==="reactor"||kind==="secret"?2:1+Math.floor(seeded()*2),explored:false,cleared:false,secret:kind==="secret",access:id===8?"hack":id===9?"power":id===10?"keycard":id>11&&seeded()<.5?["keycard","hack","power"][Math.floor(seeded()*3)]:null,accessOpen:false}});
    [...baseEdges,...extraEdges].forEach(([a,b])=>{if(rooms[a]&&rooms[b]){rooms[a].neighbors.push(b);rooms[b].neighbors.push(a)}});
    const upgradeDefs=[
      {id:"chain",icon:"ϟ",name:"CHAIN LIGHTNING",desc:"Shots arc to a nearby enemy."},
      {id:"dash",icon:"»",name:"PHASE CAPACITOR",desc:"Dash recovers 35% faster."},
      {id:"shield",icon:"◈",name:"ENTRY SHIELD",desc:"Gain 25 shield each room."},
      {id:"crit",icon:"✦",name:"TARGET MATRIX",desc:"+18% critical-hit chance."},
      {id:"magnet",icon:"◎",name:"SCRAP MAGNET",desc:"Triple pickup attraction range."},
      {id:"drone",icon:"◇",name:"SENTRY DRONE",desc:"A companion fires at enemies."},
      {id:"berserk",icon:"!",name:"LAST STAND",desc:"+55% damage below 35% health."},
      {id:"revive",icon:"♥",name:"BACKUP CORE",desc:"Revive once with 45 health."},
      {id:"cooling",icon:"❄",name:"CRYO VENTS",desc:"Heat dissipates 50% faster."},
      {id:"vitality",icon:"+",name:"REINFORCED SUIT",desc:"+35 maximum health, heal 35."},
      {id:"speed",icon:"↯",name:"SERVO LEGS",desc:"+18% movement speed."},
      {id:"projectile",icon:"→",name:"ACCELERATOR",desc:"+30% projectile speed and range."},
      {id:"ricochet",icon:"⌁",name:"RICOCHET",desc:"Shots bounce off one wall."},
      {id:"armor",icon:"▰",name:"ABLATIVE PLATE",desc:"Reduce incoming damage by 20%."},
      {id:"loot",icon:"◆",name:"SALVAGE CODEX",desc:"All scrap is worth 30% more."}
    ];
    const storyFragments=[
      ["EVACUATION","LOG 03","Security sealed Sector C. Something is moving inside the ventilation system."],
      ["EVACUATION","LOG 11","Shuttle capacity exceeded. Crew remaining below were told another flight was coming."],
      ["ROGUE AI","SYS 08","MIRA auxiliary denied the shutdown command. It now identifies the crew as reactor contaminants."],
      ["ROGUE AI","CAM 12","The security network has been tracking empty corridors for six hours."],
      ["MISSING CREW","LOG 17","Engineer Vale answered the radio from a deck that no longer exists on station plans."],
      ["MISSING CREW","MED 04","Twenty-seven suits registered at muster. Twenty-eight heartbeats were detected."],
      ["EXPERIMENTAL REACTOR","LAB 06","The new core produces more energy after shutdown. Physics has filed a complaint."],
      ["EXPERIMENTAL REACTOR","CORE 02","Containment is stable only while nobody observes chamber four."],
      ["OTHER SCAVENGER","REC 09","If you find this pack, I took the blue door. Do not take the blue door."],
      ["OTHER SCAVENGER","REC 14","Someone keeps moving my extraction beacon closer to the reactor."],
      ["UNKNOWN LIFE-FORM","BIO 07","Sample has no cells, no heat and no mass. It still scratches at the glass."],
      ["UNKNOWN LIFE-FORM","BIO 19","Ventilation microphones recorded breathing after atmosphere reached zero."]
    ];
    const objectiveDefs=[
      {id:"restore_power",label:"RESTORE POWER",type:"panel",reward:"TEMPORARY SUIT SHIELD"},
      {id:"hack_terminal",label:"HACK A TERMINAL",type:"terminal",reward:"MAP INFORMATION"},
      {id:"disable_security",label:"DISABLE SECURITY",type:"camera",reward:"SECURITY SUPPRESSION"},
      {id:"rescue_drone",label:"RESCUE MAINTENANCE DRONE",type:"robot",reward:"DRONE SUPPORT"},
      {id:"carry_core",label:"CARRY DATA CORE TO AIRLOCK",type:"dataCore",reward:"PREMIUM DATA SALVAGE"}
    ];
    const interactableDefs={
      terminal:{icon:"▤",label:"ACCESS TERMINAL",color:"#31f5ff"},crate:{icon:"▣",label:"OPEN LOCKED SUPPLY CRATE",color:"#ffe84c"},robot:{icon:"◇",label:"REPAIR DAMAGED ROBOT",color:"#72ff77"},camera:{icon:"◉",label:"DISABLE SECURITY CAMERA",color:"#ff3eb5"},panel:{icon:"⌁",label:"RESTORE REACTOR CONTROL",color:"#ff7043"},vent:{icon:"≡",label:"ENTER HIDDEN VENT",color:"#8e5bff"},backpack:{icon:"♙",label:"SEARCH SCAVENGER BACKPACK",color:"#ffb547"},beacon:{icon:"⌖",label:"ACTIVATE DISTRESS BEACON",color:"#fff"},dataCore:{icon:"◆",label:"TAKE DATA CORE",color:"#31f5ff"}
    };
    let roomIndex=0,previousRoom=null,carried=0,keycards=0,runInventory=[],kills=0,timeLeft=540,depthBonus=1,choosing=false,ended=false,last=performance.now(),raf=0,shootHeld=false,mouse={x:W*.75,y:H*.5},keys=new Set(),projectiles=[],enemyShots=[],enemies=[],loot=[],particles=[],floaters=[],soundCues=[],upgrades=[],interactables=[],currentAtmosphere=null,roomObjective=null,roomCleared=false,doorLocked=false,doorY=H/2,hazardTick=0,fireClock=0,droneClock=0,screenShake=0,muzzleFlash=0,recoil=0,hitStop=0,doorAnim=0,doorSoundPlayed=false,doorEntryNoise=false,ambientClock=4,enemySoundClock=2,emergencySpawnClock=5,mappedRooms=0,logsFound=0,securityDisabled=false,stationPowerRestored=false,hackAccess=false,carryingDataCore=false,weaponMod=null,railCharge=0,beaconDroneTime=0,bossRewardShown=false,bossFightStart=0,bossDamageTaken=false,runBossKill=null,runBossTime=0,runBossFlawless=false,coreInstalled=false;
    const weapon={...weapons[career.weapon||"pistol"]},selectedSkin=weaponSkins.find(skin=>skin.id===career.skin)||weaponSkins[0],skinImage=new Image(),mods={damage:1,dash:1,crit:0,magnet:1,cooling:1,speed:1,projectile:1,armor:1,loot:1,chain:false,shield:false,drone:career.gadget==="companion",berserk:false,revive:false,ricochet:false};skinImage.src="assets/neon-salvager-weapons.png";
    const player={x:85,y:H/2,r:14,hp:100,maxHp:100,shield:0,heat:0,overheat:false,dash:0,invuln:0,aim:0};
    setStage(`<section class="salvager-run"><header class="salvager-hud"><div><small>SUIT INTEGRITY</small><b id="salvage-hp">100 / 100</b><i class="salvage-meter hp"><u id="salvage-hpbar"></u></i></div><div><small>CURRENT LOOT</small><b id="salvage-loot">0 SCRAP</b><span id="salvage-key">NO KEYCARD</span></div><div><small>REACTOR COLLAPSE</small><b id="salvage-time">09:00</b><i class="salvage-meter"><u id="salvage-timebar"></u></i></div><div><small>${weapon.name}</small><b id="salvage-heat">HEAT 0%</b><i class="salvage-meter heat"><u id="salvage-heatbar"></u></i></div><div><small>PHASE DASH</small><b id="salvage-dash">READY</b><i class="salvage-meter dash"><u id="salvage-dashbar"></u></i></div></header>
      <div class="salvager-room-head"><span id="salvage-room">SEED ${runSeed.toString(16).toUpperCase()}</span><b id="salvage-room-name">TRANSFER LOCK</b><em id="salvage-objective">ELIMINATE HOSTILES</em></div>
      <div class="salvager-canvas-wrap"><canvas id="salvager-canvas" width="${W}" height="${H}" aria-label="Neon Salvager station"></canvas><div class="salvage-minimap" id="salvage-minimap" role="img" aria-label="Station minimap"></div><div class="salvage-atmosphere" id="salvage-atmosphere"><span>POWER NORMAL</span><b>NO HAZARD</b></div><div class="salvager-overlay" id="salvager-overlay" hidden></div><div class="salvage-interact" id="salvage-interact"></div></div>
      <div class="salvager-mobile">${directionPad()}<button data-salvage-action="dash">DASH</button><button data-salvage-action="fire">FIRE</button><button data-salvage-action="interact">USE</button></div>
      <p class="salvager-help">WASD / ARROWS MOVE • MOUSE AIM • CLICK / SPACE FIRE • SHIFT DASH • E USE DOOR</p></section>`);
    const canvas=$("#salvager-canvas"),ctx=canvas.getContext("2d");
    function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
    function circleRect(x,y,r,b){return x+r>b[0]&&x-r<b[0]+b[2]&&y+r>b[1]&&y-r<b[1]+b[3]}
    function openPoint(x,y,r=12){return x>35+r&&x<W-35-r&&y>35+r&&y<H-35-r&&!rooms[roomIndex].blocks.some(b=>circleRect(x,y,r,b))}
    function burst(x,y,color,count=8){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=40+Math.random()*120;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.25+Math.random()*.35,color})}}
    const reactorRatio=()=>Math.max(0,timeLeft/540);
    const reactorStage=()=>reactorRatio()>.5?"normal":reactorRatio()>.25?"warning":reactorRatio()>.1?"emergency":"critical";
    function stationTone(kind){
      if(kind==="door"){tone(105,.12,"sawtooth",.024);tone(180,.18,"triangle",.018,.08)}
      else if(kind==="metal"){tone(75,.08,"square",.018);tone(48,.14,"triangle",.015,.05)}
      else if(kind==="radio"){tone(410,.035,"sawtooth",.008);tone(265,.025,"square",.007,.05);tone(530,.03,"sawtooth",.006,.09)}
      else if(kind==="alarm"){tone(620,.12,"square",.02);tone(410,.12,"square",.018,.16)}
      else if(kind==="organic")tone(118,.1,"sine",.024);
      else if(kind==="shield"){tone(880,.05,"sine",.018);tone(330,.09,"triangle",.014,.03)}
      else tone(145,.055,"square",.018);
    }
    function roomAtmosphere(room){
      const stage=reactorStage(),powerState=stage==="critical"||Math.random()<.1?"blackout":stage==="emergency"||Math.random()<.28?"unstable":"normal",hazards=room.type==="reactor"?["steam","sparks"]:room.type==="laboratory"?["steam","bio_leak"]:room.type==="security"?["sparks","moving_machinery"]:["steam","sparks","moving_machinery","none"];
      return {powerState,hazard:hazards[Math.floor(Math.random()*hazards.length)],ambientSound:room.type==="reactor"?"reactor_hum":room.type==="security"?"radio_static":"machinery_low",lightFlicker:powerState==="blackout"?.78:powerState==="unstable"?.42:.15+Math.random()*.15};
    }
    function randomOpenPoint(minX=155,maxX=W-120){
      let x,y,tries=0;do{x=minX+Math.random()*(maxX-minX);y=75+Math.random()*(H-150)}while(!openPoint(x,y,18)&&tries++<40);return {x,y};
    }
    function addFloater(x,y,text,color="#fff",big=false){floaters.push({x,y,text,color,big,life:big?1:.75})}
    function alertEnemies(x,y,radius,cause){
      enemies.forEach(e=>{if(Math.hypot(e.x-x,e.y-y)>radius||e.state==="combat")return;e.state=cause==="flashlight"?"combat":"suspicious";e.alertTimer=.45;e.lastKnown={x,y};e.alertCause=cause;});
      soundCues.push({x,y,life:.55,color:cause==="gunshot"?"#ffe84c":"#31f5ff"});
    }
    function drawMinimap(){
      const map=$("#salvage-minimap");if(!map)return;const pad=18,sx=34,sy=27,visible=id=>rooms[id].explored||rooms[id].revealed||rooms[roomIndex].neighbors.includes(id)||id===roomIndex,edges=[];rooms.forEach(room=>room.neighbors.forEach(next=>{if(next<room.id||!visible(room.id)||!visible(next))return;const other=rooms[next];edges.push(`<line x1="${pad+room.gx*sx}" y1="${pad+room.gy*sy}" x2="${pad+other.gx*sx}" y2="${pad+other.gy*sy}"/>`)}));const nodes=rooms.filter(room=>visible(room.id)).map(room=>{const x=pad+room.gx*sx,y=pad+room.gy*sy,current=room.id===roomIndex,label=current?"P":room.explored?"■":room.danger===3?"⚠":"?",stroke=room.danger===3?"#ff3e65":room.secret?"#b56cff":"#70809e",fill=current?"#31f5ff":room.explored?"#8792a8":"#181d2b";return `<g><rect x="${x-9}" y="${y-9}" width="18" height="18" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="${x}" y="${y+4}" fill="${current?"#06111b":"#fff"}" text-anchor="middle">${label}</text></g>`}).join("");map.innerHTML=`<svg viewBox="0 0 190 142" aria-hidden="true"><rect width="190" height="142" fill="#050817"/><g stroke="#43506d" stroke-width="3">${edges.join("")}</g>${nodes}<text x="6" y="135" fill="#8290aa" text-anchor="start" class="seed">SEED ${runSeed.toString(16).toUpperCase()}</text></svg>`;
    }
    function spawnEnemy(type,x,y,boss=false){
      const depth=rooms[roomIndex].depth,scale=(1+depth*.11)*difficulty*(nightmare?1.55:1),base={drone:42,charger:68,turret:55,thief:38,hunter:78,mira:760,colossus:980,stalker:720}[type]||60,armor=type==="turret"?.32:type==="mira"?.4:type==="colossus"?.3:type==="drone"?.12:0;
      enemies.push({type,x,y,r:boss?type==="colossus"?38:30:type==="charger"||type==="hunter"?18:15,hp:base*scale,maxHp:base*scale,armor,armorBroken:false,speed:(type==="charger"?75:type==="thief"?115:type==="hunter"||type==="stalker"?82:type==="colossus"?42:62)*(nightmare?1.12:1),cooldown:Math.random(),state:"idle",alertTimer:0,searchTimer:0,lastKnown:null,chargeTimer:0,flash:0,slow:0,freeze:0,boss,phase:1,stolen:0,soundTimer:1+Math.random()*4,invulnerable:type==="mira",alpha:1,attackClock:1.5,zones:[]});
    }
    function showBossWarning(){
      choosing=true;bossDamageTaken=false;const overlay=$("#salvager-overlay");overlay.hidden=false;overlay.innerHTML=`<section class="salvage-boss-warning"><small>MASSIVE SIGNAL DETECTED</small><h3>${bossNames[bossType]}</h3><b>THREAT LEVEL: CRITICAL</b><p>${bossType==="mira"?"Hack the security terminals to expose the core.":bossType==="colossus"?"Keep moving. Shockwaves and radiation will control the floor.":"Light and sound are the only reliable ways to find it."}</p><button class="pixel-btn primary" id="boss-engage">ENGAGE</button></section>`;$("#boss-engage").onclick=()=>{bossFightStart=performance.now();choosing=false;overlay.hidden=true;stationTone("alarm")};
    }
    function buildRoom(){
      projectiles=[];enemyShots=[];particles=[];floaters=[];soundCues=[];loot=[];enemies=[];interactables=[];roomCleared=false;doorAnim=0;doorSoundPlayed=false;doorLocked=false;doorY=[110,H/2,H-110][Math.floor(Math.random()*3)];
      player.x=75;player.y=H/2;player.invuln=.7;if(mods.shield)player.shield=Math.max(player.shield,25);
      const room=rooms[roomIndex],firstVisit=!room.explored;room.explored=true;mappedRooms=rooms.filter(item=>item.explored).length;depthBonus=1+room.depth*.18+(nightmare?.8:0);if(career.gadget==="scanner")room.neighbors.forEach(id=>rooms[id].revealed=true);currentAtmosphere=room.atmosphere||roomAtmosphere(room);room.atmosphere={...currentAtmosphere};roomObjective=room.cleared?null:room.objective||(room.kind==="boss"||Math.random()>.35?null:{...objectiveDefs[Math.floor(Math.random()*objectiveDefs.length)],complete:false,progress:false});room.objective=roomObjective;securityDisabled=false;carryingDataCore=false;
      if(!room.cleared){const count=room.kind==="boss"||room.kind==="extraction"?0:Math.min(9,2+room.depth+(nightmare?1:0));
        if(room.kind==="boss"){spawnEnemy(bossType,W*.65,H*.5,true);if(bossType==="mira")[[160,100],[740,100],[160,460],[740,460]].forEach(([x,y])=>spawnEnemy("turret",x,y))}
        else for(let i=0;i<count;i++){const enemyPool=["drone","charger","turret","thief","hunter"],type=enemyPool[(i+room.id+Math.floor(Math.random()*4))%enemyPool.length];let x,y,tries=0;do{x=300+Math.random()*500;y=80+Math.random()*400}while(!openPoint(x,y,22)&&tries++<30);spawnEnemy(type,x,y)}
        const pieces=room.type==="treasure"?7:room.kind==="extraction"?1:3+Math.floor(Math.random()*3);for(let i=0;i<pieces;i++){let x,y,tries=0;do{x=180+Math.random()*620;y=80+Math.random()*400}while(!openPoint(x,y)&&tries++<30);loot.push({x,y,r:8,type:Math.random()<.15?"key":Math.random()<.18?"med":"scrap",value:Math.round((14+Math.random()*22)*depthBonus),pulse:Math.random()*6})}if(room.id===3){const point=randomOpenPoint(240,W-180);loot.push({x:point.x,y:point.y,r:8,type:"key",value:0,pulse:0})}
        const roomObjects=room.kind==="boss"&&bossType==="mira"?["terminal","terminal","terminal"]:shuffle(["terminal","crate","robot","camera","panel","vent","backpack","beacon"]).slice(0,2+Math.floor(Math.random()*2));if(room.id===1&&!roomObjects.includes("terminal"))roomObjects.push("terminal");if(room.id===2&&!roomObjects.includes("panel"))roomObjects.push("panel");if(roomObjective&&!roomObjects.includes(roomObjective.type))roomObjects.push(roomObjective.type);roomObjects.forEach((type,index)=>{const point=randomOpenPoint(175,W-145);interactables.push({id:index,type,x:point.x,y:point.y,r:18,used:false,hidden:type==="vent",fragment:storyFragments[Math.floor(Math.random()*storyFragments.length)]})});
      }else roomCleared=true;
      if(doorEntryNoise){alertEnemies(player.x,player.y,330,"opened_door");doorEntryNoise=false}
      const atmosphereEl=$("#salvage-atmosphere");if(atmosphereEl){atmosphereEl.className=`salvage-atmosphere power-${currentAtmosphere.powerState} reactor-${reactorStage()}`;atmosphereEl.innerHTML=`<span>POWER ${currentAtmosphere.powerState.toUpperCase()}</span><b>${currentAtmosphere.hazard.replace("_"," ").toUpperCase()}</b>`;}
      updateHud();drawMinimap();if(firstVisit&&room.kind==="boss")showBossWarning();
    }
    function nearestInteractable(){
      return interactables.filter(item=>!item.used&&(!item.hidden||Math.hypot(player.x-item.x,player.y-item.y)<58)).map(item=>({item,distance:Math.hypot(player.x-item.x,player.y-item.y)})).filter(entry=>entry.distance<62).sort((a,b)=>a.distance-b.distance)[0]?.item||null;
    }
    function completeObjective(){
      if(!roomObjective||roomObjective.complete)return;roomObjective.complete=true;const bonus=Math.round((35+roomIndex*6)*depthBonus);carried+=bonus;runInventory.push({type:"objective",id:roomObjective.id,value:bonus,room:roomIndex+1});addFloater(player.x,player.y-28,`OBJECTIVE +${bonus}`,"#72ff77",true);sfx("win");toast(`${roomObjective.label} • ${roomObjective.reward}`);
    }
    function showFragment(fragment){
      choosing=true;logsFound++;const overlay=$("#salvager-overlay");overlay.hidden=false;overlay.innerHTML=`<section class="salvage-log"><small>${fragment[0]} // ARCHIVE RECOVERED</small><h3>${fragment[1]}</h3><p>“${fragment[2]}”</p><button class="pixel-btn primary" id="salvage-log-close">CLOSE LOG</button></section>`;$("#salvage-log-close").onclick=()=>{choosing=false;overlay.hidden=true};
    }
    function useInteractable(item){
      if(!item||item.used||choosing)return;const def=interactableDefs[item.type];item.used=true;
      if(item.type==="terminal"){hackAccess=true;rooms[roomIndex].neighbors.forEach(id=>rooms[id].revealed=true);const mira=enemies.find(enemy=>enemy.type==="mira");if(mira){mira.terminals=(mira.terminals||0)+1;if(mira.terminals>=3){mira.invulnerable=false;mira.armor=0;addFloater(mira.x,mira.y-35,"CORE EXPOSED","#31f5ff",true)}}showFragment(item.fragment)}
      else if(item.type==="crate"){if(keycards>0)keycards--;else{timeLeft=Math.max(1,timeLeft-8);toast("CRATE BYPASSED • -8 SECONDS")}const value=Math.round((48+roomIndex*8)*depthBonus);carried+=value;loot.push({x:item.x+20,y:item.y,r:8,type:"med",value:0,pulse:0});addFloater(item.x,item.y,`+${value} SCRAP`,"#ffe84c",true);alertEnemies(item.x,item.y,430,"broken_crate");stationTone("metal")}
      else if(item.type==="robot"){mods.drone=true;player.shield=Math.max(player.shield,15);sfx("save")}
      else if(item.type==="camera"){securityDisabled=true;enemies.forEach(enemy=>enemy.cooldown+=1.2);stationTone("radio")}
      else if(item.type==="panel"){currentAtmosphere.powerState="normal";stationPowerRestored=true;player.shield=Math.min(60,player.shield+15);stationTone("shield")}
      else if(item.type==="vent"){const value=Math.round((70+roomIndex*10)*depthBonus);carried+=value;runInventory.push({type:"secret-room",value,room:roomIndex+1});addFloater(item.x,item.y,`SECRET CACHE +${value}`,"#b56cff",true)}
      else if(item.type==="backpack"){const value=Math.round((32+roomIndex*7)*depthBonus);carried+=value;showFragment(item.fragment)}
      else if(item.type==="beacon"){timeLeft=Math.min(540,timeLeft+22);rooms[roomIndex].neighbors.forEach(id=>rooms[id].revealed=true);showFragment(item.fragment)}
      else if(item.type==="dataCore"){carryingDataCore=true;roomObjective&&(roomObjective.progress=true);addFloater(item.x,item.y,"DATA CORE SECURED","#31f5ff",true)}
      if(roomObjective&&item.type===roomObjective.type&&roomObjective.id!=="carry_core")completeObjective();
      burst(item.x,item.y,def.color,10);updateHud();drawMinimap();
    }
    function updateHud(){
      const hp=$("#salvage-hp"),lootEl=$("#salvage-loot");if(!hp)return;
      hp.textContent=`${Math.ceil(player.hp)} / ${player.maxHp}${player.shield?` +${Math.ceil(player.shield)}`:""}`;$("#salvage-hpbar").style.width=`${player.hp/player.maxHp*100}%`;
      lootEl.textContent=`${carried} SCRAP`;$("#salvage-key").textContent=keycards?`${keycards} KEYCARD${keycards>1?"S":""}`:"NO KEYCARD";
      const min=Math.max(0,Math.floor(timeLeft/60)),sec=Math.max(0,Math.floor(timeLeft%60));$("#salvage-time").textContent=`${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;$("#salvage-timebar").style.width=`${timeLeft/540*100}%`;
      $("#salvage-heat").textContent=railCharge>0?`CHARGING ${Math.round((1-railCharge/.68)*100)}%`:player.overheat?"VENTING...":`HEAT ${Math.round(player.heat)}%${weaponMod?` • ${weaponMod.toUpperCase()}`:""}`;$("#salvage-heatbar").style.width=`${player.heat}%`;
      $("#salvage-dash").textContent=player.dash<=0?"READY":`${player.dash.toFixed(1)}s`;$("#salvage-dashbar").style.width=`${Math.max(0,100-player.dash/(1.65*mods.dash)*100)}%`;
      $("#salvage-room").textContent=`SEED ${runSeed.toString(16).toUpperCase()} • ${mappedRooms}/${rooms.length} MAPPED`;$("#salvage-room-name").textContent=`${rooms[roomIndex].name} • DEPTH ${rooms[roomIndex].depth} • DANGER ${rooms[roomIndex].danger}`;
      const objectiveText=roomObjective&&!roomObjective.complete?`${roomObjective.progress?"DELIVER":"OPTIONAL"}: ${roomObjective.label}`:roomObjective?.complete?"OPTIONAL OBJECTIVE COMPLETE":enemies.length?`${enemies.length} HOSTILE${enemies.length>1?"S":""} REMAIN`:rooms[roomIndex].kind==="extraction"?"EXTRACTION READY • REACH SHUTTLE":"ROOM CLEAR • CHOOSE A CONNECTED DOOR";$("#salvage-objective").textContent=objectiveText;
      const nearby=nearestInteractable(),atDoor=roomCleared&&player.x>W-130&&Math.abs(player.y-doorY)<95;$("#salvage-interact").textContent=nearby?`E • ${interactableDefs[nearby.type].label}`:atDoor?`E • ${rooms[roomIndex].kind==="extraction"?"USE EXTRACTION / ROUTES":"CHOOSE ROUTE"}`:"";
    }
    function damage(amount){
      if(player.invuln>0||ended)return;if(enemies.some(enemy=>enemy.boss))bossDamageTaken=true;amount*=mods.armor;if(player.shield>0){const used=Math.min(player.shield,amount);player.shield-=used;amount-=used}player.hp-=amount;player.invuln=.45;screenShake=8;burst(player.x,player.y,"#ff4b6e");
      if(player.hp<=0){if(mods.revive){mods.revive=false;player.hp=45;player.invuln=2;toast("BACKUP CORE RESTORED");}else finish(false,"SUIT SIGNAL LOST")}
    }
    function fireWeapon(){
      const a=player.aim,over=weaponMod==="overcharged",twin=weaponMod==="twin",damageBoost=mods.damage*(over?1.4:1)*(mods.berserk&&player.hp/player.maxHp<.35?1.55:1),heat=weapon.heat*(over?1.25:1);player.heat=Math.min(110,player.heat+heat);if(player.heat>=100)player.overheat=true;fireClock=weapon.fireRate;muzzleFlash=weapon.specialEffect==="rail"?.15:.075;recoil=weapon.recoil;
      if(weapon.specialEffect==="beacon"){beaconDroneTime=Math.max(beaconDroneTime,8);burst(player.x+Math.cos(a)*45,player.y+Math.sin(a)*45,weapon.color,24);addFloater(player.x,player.y-28,"COMBAT DRONE DEPLOYED",weapon.color,true);stationTone("shield");return}
      const baseCount=weapon.count+(twin?1:0),shotScale=twin?.72:1;for(let i=0;i<baseCount;i++){const angle=a+(i-(baseCount-1)/2)*(weapon.spread||(twin?.08:0))+(Math.random()-.5)*.018,critical=Math.random()<mods.crit;projectiles.push({x:player.x+Math.cos(angle)*19,y:player.y+Math.sin(angle)*19,vx:Math.cos(angle)*weapon.projectileSpeed*mods.projectile,vy:Math.sin(angle)*weapon.projectileSpeed*mods.projectile,life:weapon.range/Math.max(1,weapon.projectileSpeed),damage:weapon.damage*damageBoost*shotScale*(critical?2:1),critical,heavy:["rail","scatter"].includes(weapon.specialEffect),weaponEffect:weapon.specialEffect,knockback:weapon.knockback,color:weapon.color,pierce:weapon.pierce||1,bounce:mods.ricochet?1:0,phaseWalls:weaponMod==="phase"?1:0,slow:weapon.slow})}
      particles.push({x:player.x-Math.sin(a)*9,y:player.y+Math.cos(a)*9,vx:-Math.cos(a)*35-Math.sin(a)*90,vy:-Math.sin(a)*35+Math.cos(a)*90,life:.48,color:weapon.color,casing:true});burst(player.x+Math.cos(a)*24,player.y+Math.sin(a)*24,weapon.color,weapon.specialEffect==="rail"?18:weapon.count>1?10:5);alertEnemies(player.x,player.y,weapon.specialEffect==="rail"?760:weapon.count>1?620:470,"gunshot");stationTone(weapon.specialEffect==="cryo"?"shield":weapon.specialEffect==="arc"?"radio":weapon.specialEffect==="rail"||weapon.count>1?"metal":"shot");
    }
    function shoot(){if(choosing||ended||player.overheat||fireClock>0||railCharge>0)return;if(weapon.specialEffect==="rail"){railCharge=.68;stationTone("radio");return}fireWeapon()}
    function offerWeaponMod(){
      choosing=true;const overlay=$("#salvager-overlay"),choices=[{id:"overcharged",name:"OVERCHARGED CELL",desc:"+40% damage, +25% heat"},{id:"twin",name:"TWIN EMITTER",desc:"Fires two weaker projectiles"},{id:"phase",name:"PHASE ROUND",desc:"Shots pass through one wall"}];overlay.hidden=false;overlay.innerHTML=`<section class="salvage-decision weapon-mod"><small>${weapon.name} MOD • ONE PER RUN</small><h3>INSTALL A TEMPORARY MODIFICATION</h3><div>${choices.map(choice=>`<button data-weapon-mod="${choice.id}"><i>${choice.id==="overcharged"?"+":choice.id==="twin"?"Ⅱ":"⇥"}</i><b>${choice.name}</b><span>${choice.desc}</span></button>`).join("")}</div></section>`;$$('[data-weapon-mod]').forEach(button=>button.onclick=()=>{weaponMod=button.dataset.weaponMod;choosing=false;overlay.hidden=true;toast(`${weapon.name} • ${weaponMod.toUpperCase()} INSTALLED`);updateHud()});
    }
    function dash(){
      if(player.dash>0||choosing||ended)return;let dx=(keys.has("d")||keys.has("arrowright")?1:0)-(keys.has("a")||keys.has("arrowleft")?1:0),dy=(keys.has("s")||keys.has("arrowdown")?1:0)-(keys.has("w")||keys.has("arrowup")?1:0);if(!dx&&!dy){dx=Math.cos(player.aim);dy=Math.sin(player.aim)}const l=Math.hypot(dx,dy)||1;for(let i=0;i<80;i+=5){const nx=player.x+dx/l*5,ny=player.y+dy/l*5;if(!openPoint(nx,ny,player.r))break;player.x=nx;player.y=ny}player.dash=1.65*mods.dash;player.invuln=.35;burst(player.x,player.y,"#b56cff",14);sfx("whoosh")}
    function interact(){
      if(choosing||ended)return;const nearby=nearestInteractable();if(nearby)return useInteractable(nearby);if(!roomCleared||player.x<W-145||Math.abs(player.y-doorY)>95)return;if(carryingDataCore&&roomObjective?.id==="carry_core")completeObjective();stationTone("door");if(rooms[roomIndex].kind==="extraction")showExtractDecision();else showRouteDecision();
    }
    function routeDirection(target){const room=rooms[roomIndex],dx=target.gx-room.gx,dy=target.gy-room.gy;return Math.abs(dx)>Math.abs(dy)?dx<0?"LEFT":"RIGHT":dy<0?"UP":"DOWN"}
    function routeSignal(target){if(target.explored)return target.name;if(target.revealed||career.gadget==="scanner")return `${target.type.toUpperCase()} • DANGER ${target.danger}`;if(target.danger===3)return "MASSIVE SIGNAL";if(target.danger===2)return "HIGH RADIATION";return "UNKNOWN"}
    function routeReady(target){return target.accessOpen||!target.access||target.access==="keycard"&&keycards>0||target.access==="hack"&&hackAccess||target.access==="power"&&stationPowerRestored}
    function enterRoute(id){const target=rooms[id];if(!routeReady(target))return toast(`${target.access.toUpperCase()} ACCESS REQUIRED`);if(!target.accessOpen&&target.access==="keycard")keycards--;target.accessOpen=true;previousRoom=roomIndex;roomIndex=id;doorEntryNoise=true;choosing=false;$("#salvager-overlay").hidden=true;career.bestDepth=Math.max(career.bestDepth,rooms.filter(room=>room.explored).length+1);buildRoom()}
    function showRouteDecision(){
      choosing=true;const room=rooms[roomIndex],overlay=$("#salvager-overlay");overlay.hidden=false;overlay.innerHTML=`<section class="salvage-route-panel"><small>STATION ROUTING • SEED ${runSeed.toString(16).toUpperCase()}</small><h3>SELECT A CONNECTED DOOR</h3><div>${room.neighbors.map(id=>{const target=rooms[id],lock=target.access&&!target.accessOpen?` • ${target.access.toUpperCase()} LOCK`:"";return `<button data-route="${id}" class="danger-${target.danger} ${target.explored?"visited":""}"><i>${routeDirection(target)}</i><b>${routeSignal(target)}</b><span>${target.explored?"VISITED":"UNEXPLORED"}${lock}</span></button>`}).join("")}</div><button class="pixel-btn secondary" id="route-cancel">STAY IN ROOM</button></section>`;$$('[data-route]').forEach(button=>button.onclick=()=>enterRoute(Number(button.dataset.route)));$("#route-cancel").onclick=()=>{choosing=false;overlay.hidden=true};
    }
    function showUpgrade(){
      choosing=true;const choices=shuffle(upgradeDefs.filter(u=>!upgrades.includes(u.id))).slice(0,3),overlay=$("#salvager-overlay");overlay.hidden=false;overlay.innerHTML=`<section class="salvage-decision"><small>FIELD FABRICATOR • ROOM ${roomIndex}</small><h3>CHOOSE ONE RUN UPGRADE</h3><div>${choices.map(u=>`<button data-run-upgrade="${u.id}"><i>${u.icon}</i><b>${u.name}</b><span>${u.desc}</span></button>`).join("")}</div></section>`;
      $$("[data-run-upgrade]").forEach(btn=>btn.onclick=()=>{applyUpgrade(btn.dataset.runUpgrade);choosing=false;overlay.hidden=true;showRouteDecision()});
    }
    function applyUpgrade(id){
      upgrades.push(id);if(id==="chain")mods.chain=true;if(id==="dash")mods.dash*=.65;if(id==="shield")mods.shield=true;if(id==="crit")mods.crit+=.18;if(id==="magnet")mods.magnet=3;if(id==="drone")mods.drone=true;if(id==="berserk")mods.berserk=true;if(id==="revive")mods.revive=true;if(id==="cooling")mods.cooling=1.5;if(id==="vitality"){player.maxHp+=35;player.hp=Math.min(player.maxHp,player.hp+35)}if(id==="speed")mods.speed*=1.18;if(id==="projectile")mods.projectile*=1.3;if(id==="ricochet")mods.ricochet=true;if(id==="armor")mods.armor=.8;if(id==="loot")mods.loot*=1.3;
    }
    function showExtractDecision(){
      choosing=true;const overlay=$("#salvager-overlay");overlay.innerHTML=`<section class="salvage-decision extract"><small>PHYSICAL EXTRACTION DOCK</small><h3>CURRENT LOOT: ${carried} SCRAP</h3><p>${runBossKill?`${bossNames[runBossKill]} neutralized. Core telemetry secured.`:"The boss signal is still active. You may leave early or return deeper."}</p><div><button data-extract="yes"><i>⇧</i><b>LAUNCH SHUTTLE</b><span>Secure all carried loot</span></button><button data-extract="no"><i>⌁</i><b>RETURN TO MAP</b><span>Choose another connected route</span></button></div></section>`;overlay.hidden=false;
      $('[data-extract="yes"]').onclick=()=>finish(true,"SUCCESSFUL EXTRACTION");$('[data-extract="no"]').onclick=()=>showRouteDecision();
    }
    function showBossReward(enemy){
      if(bossRewardShown)return;bossRewardShown=true;runBossKill=enemy.type;runBossTime=Math.max(.1,(performance.now()-bossFightStart)/1000);runBossFlawless=!bossDamageTaken;choosing=true;const overlay=$("#salvager-overlay");overlay.hidden=false;overlay.innerHTML=`<section class="salvage-decision boss-reward"><small>${bossNames[enemy.type]} DESTROYED • ${runBossTime.toFixed(1)}s${runBossFlawless?" • NO DAMAGE":""}</small><h3>CLAIM THE SECTOR CORE</h3><div><button data-core-choice="extract"><i>◆</i><b>EXTRACT THE CORE</b><span>+400 permanent scrap. Return physically to the extraction dock.</span></button><button data-core-choice="install"><i>ϟ</i><b>INSTALL THE CORE</b><span>+55% run damage, cooling and shield. Continue through the station.</span></button></div></section>`;$$('[data-core-choice]').forEach(button=>button.onclick=()=>{if(button.dataset.coreChoice==="extract"){career.scrap+=400;saveCareer();runInventory.push({type:"boss-core",boss:enemy.type,value:400})}else{coreInstalled=true;mods.damage*=1.55;mods.cooling*=1.35;player.shield=Math.max(player.shield,40);upgrades.push(`${enemy.type}-core`)}choosing=false;overlay.hidden=true;toast(button.dataset.coreChoice==="extract"?"CORE SECURED • RETURN TO EXTRACTION":"CORE INSTALLED • POWER SURGE");updateHud()});
    }
    function finish(success,title){
      if(ended)return;ended=true;cancelAnimationFrame(raf);const insured=success?carried:Math.floor(carried*.18),xpGain=Math.max(25,mappedRooms*14+Math.floor(carried/12)+(success?45:0)),objectivesCompleted=runInventory.filter(item=>item.type==="objective").length,secretsFound=runInventory.filter(item=>item.type==="secret-room").length;career.runs++;career.extractions+=success?1:0;career.deaths+=success?0:1;career.bosses+=runBossKill?1:0;if(runBossKill){career.bossKillsByType[runBossKill]=(career.bossKillsByType[runBossKill]||0)+1;career.fastestBossKill=!career.fastestBossKill?runBossTime:Math.min(career.fastestBossKill,runBossTime);career.noDamageBossKills+=(runBossFlawless?1:0)}career.logsFound=(career.logsFound||0)+logsFound;career.objectivesCompleted=(career.objectivesCompleted||0)+objectivesCompleted;career.secretRooms=(career.secretRooms||0)+secretsFound;career.scrap+=insured;career.xp+=xpGain;career.bestScrap=Math.max(career.bestScrap,success?carried:0);career.bestDepth=Math.max(career.bestDepth,mappedRooms);career.securedInventory.push(...runInventory.slice(-20));saveCareer();reward(Math.min(80,Math.floor(insured/20)),success?22:8,{result:success?"win":"loss",score:success?carried:mappedRooms});
      setStage(`<section class="salvage-report ${success?"success":"lost"}"><small>CONTRACT CLOSED • SEED ${runSeed.toString(16).toUpperCase()}</small><h3>${title}</h3><div class="salvage-report-grid"><article><span>SECURED SCRAP</span><b>${insured}</b></article><article><span>ROOMS MAPPED</span><b>${mappedRooms}/${rooms.length}</b></article><article><span>HOSTILES DOWN</span><b>${kills}</b></article><article><span>BOSS</span><b>${runBossKill?bossNames[runBossKill]:"NOT ENGAGED"}</b></article><article><span>BOSS TIME</span><b>${runBossKill?runBossTime.toFixed(1)+"s":"—"}</b></article><article><span>FLAWLESS BOSS</span><b>${runBossFlawless?"YES":"NO"}</b></article><article><span>SECRET CACHES</span><b>${secretsFound}</b></article><article><span>WEAPON MOD</span><b>${weaponMod?weaponMod.toUpperCase():"NONE"}</b></article></div>${success?"":`<p>Most carried loot was lost. Emergency insurance recovered 18%.</p>`}<div class="salvage-report-actions"><button class="pixel-btn primary" id="salvage-again">NEW CONTRACT</button><button class="pixel-btn secondary" id="salvage-bay">SALVAGE BAY</button></div></section>`);
      $("#salvage-again").onclick=startRun;$("#salvage-bay").onclick=renderBay;
    }
    function update(dt){
      if(choosing||ended)return;const enragedColossus=enemies.some(enemy=>enemy.type==="colossus"&&enemy.hp/enemy.maxHp<.4);timeLeft-=dt*(enragedColossus?1.8:1);if(timeLeft<=0)return finish(false,"REACTOR COLLAPSED");
      const rawDt=dt;if(hitStop>0){hitStop=Math.max(0,hitStop-rawDt);dt*=.12}muzzleFlash=Math.max(0,muzzleFlash-rawDt);recoil=Math.max(0,recoil-rawDt);doorAnim=roomCleared?Math.min(1,doorAnim+rawDt*2.8):0;if(roomCleared&&!doorSoundPlayed){doorSoundPlayed=true;stationTone("door")}
      ambientClock-=rawDt;enemySoundClock-=rawDt;if(ambientClock<=0){const kind=currentAtmosphere.ambientSound==="radio_static"?"radio":Math.random()<.55?"metal":"radio";stationTone(kind);soundCues.push({x:120+Math.random()*(W-240),y:80+Math.random()*(H-160),life:.8,color:"#7b8ba8"});ambientClock=4+Math.random()*7}
      if(enemySoundClock<=0&&enemies.length){const source=enemies[Math.floor(Math.random()*enemies.length)];if(Math.hypot(player.x-source.x,player.y-source.y)>230){stationTone(source.type==="hunter"?"organic":"metal");soundCues.push({x:source.x,y:source.y,life:1,color:"#ff7043"});$("#salvage-interact").textContent=`AUDIO CONTACT • ${source.type.toUpperCase()}`}enemySoundClock=2.5+Math.random()*4}
      const stage=reactorStage();if(stage==="critical"){emergencySpawnClock-=rawDt;screenShake=Math.max(screenShake,Math.sin(performance.now()/90)>0?3:0);if(emergencySpawnClock<=0&&enemies.length<9&&rooms[roomIndex].kind!=="boss"){const point=randomOpenPoint(430,W-100);spawnEnemy(Math.random()<.55?"hunter":"charger",point.x,point.y);emergencySpawnClock=3.8/(nightmare?1.3:1);stationTone("alarm")}}else emergencySpawnClock=5;
      if(stage==="emergency"&&Math.random()<rawDt*.18)screenShake=Math.max(screenShake,2);if(stage==="critical"&&Math.random()<rawDt*.55)stationTone("alarm");
      player.dash=Math.max(0,player.dash-dt);player.invuln=Math.max(0,player.invuln-dt);fireClock=Math.max(0,fireClock-dt);hazardTick=Math.max(0,hazardTick-dt);beaconDroneTime=Math.max(0,beaconDroneTime-dt);if(railCharge>0){railCharge-=dt;if(railCharge<=0)fireWeapon()}player.heat=Math.max(0,player.heat-dt*24*mods.cooling);if(player.overheat&&player.heat<45)player.overheat=false;$(".salvager-canvas-wrap")?.classList.toggle("weapon-venting",player.overheat);
      const keyboardX=(keys.has("d")||keys.has("arrowright")?1:0)-(keys.has("a")||keys.has("arrowleft")?1:0),keyboardY=(keys.has("s")||keys.has("arrowdown")?1:0)-(keys.has("w")||keys.has("arrowup")?1:0);let dx=isMobileMode()?mobileInput.moveX:keyboardX,dy=isMobileMode()?mobileInput.moveY:keyboardY,len=Math.hypot(dx,dy),magnitude=Math.min(1,len),speed=185*mods.speed;
      if(len){const nx=player.x+dx/len*speed*dt*magnitude,ny=player.y+dy/len*speed*dt*magnitude;if(openPoint(nx,player.y,player.r))player.x=nx;if(openPoint(player.x,ny,player.r))player.y=ny;}if(isMobileMode()&&Math.hypot(mobileInput.aimX,mobileInput.aimY)>.2){mouse.x=player.x+mobileInput.aimX*220;mouse.y=player.y+mobileInput.aimY*220;}player.aim=Math.atan2(mouse.y-player.y,mouse.x-player.x);if(shootHeld||keys.has(" "))shoot();
      if(rooms[roomIndex].hazards.some(h=>circleRect(player.x,player.y,player.r,h))&&hazardTick<=0){damage(8);hazardTick=.55}
      projectiles.forEach(p=>{p.phaseGrace=Math.max(0,(p.phaseGrace||0)-dt);p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;let blocked=p.phaseGrace<=0&&(p.x<35||p.x>W-35||p.y<35||p.y>H-35||rooms[roomIndex].blocks.some(b=>circleRect(p.x,p.y,3,b)));if(blocked&&p.phaseWalls>0){p.phaseWalls--;p.phaseGrace=.11;p.x+=p.vx*.07;p.y+=p.vy*.07;blocked=false}else if(blocked&&p.bounce){if(p.x<35||p.x>W-35)p.vx*=-1;else p.vy*=-1;p.bounce--;p.x=clamp(p.x,38,W-38);p.y=clamp(p.y,38,H-38)}else if(blocked)p.life=0;for(const e of enemies){if(p.life<=0||Math.hypot(e.x-p.x,e.y-p.y)>e.r+4)continue;if(e.invulnerable){addFloater(e.x,e.y-22,"CORE SHIELDED","#31f5ff",true);stationTone("shield");p.life=0;continue}const armored=e.armor>0&&!e.armorBroken,dealt=p.damage*(armored?1-e.armor:1);e.hp-=dealt;e.lastWeapon=p.weaponEffect;e.lastHeavy=p.heavy||p.critical;e.flash=.14;e.state="combat";e.lastKnown={x:player.x,y:player.y};if(p.knockback){const push=Math.atan2(e.y-p.y,e.x-p.x);e.x+=Math.cos(push)*p.knockback;e.y+=Math.sin(push)*p.knockback}if(p.weaponEffect==="cryo"){e.cryo=(e.cryo||0)+1;e.slow=2;if(e.cryo>=4){e.freeze=1.8;e.cryo=0;addFloater(e.x,e.y-20,"FROZEN","#aeefff",true)}}if(armored&&e.hp/e.maxHp<.55){e.armorBroken=true;e.armor=0;addFloater(e.x,e.y-22,"ARMOR BREAK","#ffe84c",true);hitStop=Math.max(hitStop,.06);stationTone("metal")}else if(p.critical){addFloater(e.x,e.y-18,`CRIT ${Math.round(dealt)}`,"#ff3eb5",true);hitStop=Math.max(hitStop,p.heavy?.1:.035)}stationTone(p.weaponEffect==="cryo"?"shield":e.type==="hunter"||e.type==="stalker"?"organic":armored?"metal":"shield");p.pierce--;burst(p.x,p.y,p.color,p.heavy?12:5);if(mods.chain||p.weaponEffect==="arc"){const other=enemies.find(q=>q!==e&&Math.hypot(q.x-e.x,q.y-e.y)<180);if(other){other.hp-=p.damage*(p.weaponEffect==="arc"?.7:.45);particles.push({x:e.x,y:e.y,vx:other.x-e.x,vy:other.y-e.y,life:.16,color:p.color,beam:true})}}if(p.pierce<=0)p.life=0}})
      projectiles=projectiles.filter(p=>p.life>0);
      enemyShots.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(Math.hypot(player.x-p.x,player.y-p.y)<player.r+p.r){damage(p.damage);p.life=0}});enemyShots=enemyShots.filter(p=>p.life>0&&p.x>20&&p.x<W-20&&p.y>20&&p.y<H-20);
      enemies.forEach(e=>{e.cooldown-=dt;e.flash=Math.max(0,e.flash-dt);e.slow=Math.max(0,e.slow-dt);e.freeze=Math.max(0,(e.freeze||0)-dt);e.alertTimer=Math.max(0,(e.alertTimer||0)-dt);e.soundTimer-=dt;const a=Math.atan2(player.y-e.y,player.x-e.x),d=Math.hypot(player.x-e.x,player.y-e.y),slow=e.freeze?0:e.slow?0.5:1,flashlight=currentAtmosphere.powerState==="blackout"&&d<360&&Math.abs(Math.atan2(Math.sin(a-player.aim),Math.cos(a-player.aim)))<.38;
        if(flashlight&&e.state!=="combat"){e.state="combat";e.lastKnown={x:player.x,y:player.y};e.alertCause="flashlight"}
        if(e.state==="idle"&&d<210&&e.type!=="turret"){e.state="suspicious";e.alertTimer=.42;e.lastKnown={x:player.x,y:player.y}}
        if(e.state==="suspicious"&&e.alertTimer<=0){e.state=d<330?"combat":"searching";e.searchTimer=2.8}
        if(e.state==="combat"&&d>560&&e.type!=="turret"){e.state="searching";e.searchTimer=3.5}
        if(e.state==="searching"){e.searchTimer-=dt;const target=e.lastKnown||player,sa=Math.atan2(target.y-e.y,target.x-e.x);e.x+=Math.cos(sa)*e.speed*.5*slow*dt;e.y+=Math.sin(sa)*e.speed*.5*slow*dt;if(e.searchTimer<=0)e.state="idle"}
        if(e.type==="drone"&&e.state==="combat"){const strafe=Math.sin(performance.now()/430+e.x)*e.speed*.62;if(d>245){e.x+=Math.cos(a)*e.speed*slow*dt;e.y+=Math.sin(a)*e.speed*slow*dt}else if(d<175){e.x-=Math.cos(a)*e.speed*.7*slow*dt;e.y-=Math.sin(a)*e.speed*.7*slow*dt}e.x+=Math.cos(a+Math.PI/2)*strafe*dt;e.y+=Math.sin(a+Math.PI/2)*strafe*dt;if(e.cooldown<=0&&d<430){enemyShots.push({x:e.x,y:e.y,vx:Math.cos(a)*220,vy:Math.sin(a)*220,r:5,damage:9,life:2.5,color:"#ff3eb5"});e.cooldown=1.2}}
        if(e.type==="charger"){if(e.rush>0){e.x+=Math.cos(e.angle)*e.speed*4.2*slow*dt;e.y+=Math.sin(e.angle)*e.speed*4.2*slow*dt;e.rush-=dt}else if(e.chargeTimer>0){e.chargeTimer-=dt;e.state="suspicious";if(e.chargeTimer<=0){e.angle=Math.atan2(e.lastKnown.y-e.y,e.lastKnown.x-e.x);e.rush=.52;e.state="combat";stationTone("metal")}}else if(e.state==="combat"&&e.cooldown<=0&&d<430){e.lastKnown={x:player.x,y:player.y};e.chargeTimer=.62;e.cooldown=2.1;addFloater(e.x,e.y-22,"CHARGE!","#ff7043",true)}else if(e.state==="combat"&&d>90){e.x+=Math.cos(a)*e.speed*.42*slow*dt;e.y+=Math.sin(a)*e.speed*.42*slow*dt}}
        if(e.type==="turret"){if(securityDisabled)e.state="retreating";else if(d<520)e.state="combat";if(e.state==="combat"&&e.cooldown<=0){for(let i=-1;i<=1;i++){const aa=a+i*.17;enemyShots.push({x:e.x,y:e.y,vx:Math.cos(aa)*190,vy:Math.sin(aa)*190,r:5,damage:7,life:3,color:"#ff7043"})}e.cooldown=1.55}}
        if(e.type==="thief"){const target=loot.find(l=>l.type==="scrap");if(e.stolen)e.state="retreating";if(target&&e.state!=="retreating"){e.state="combat";const ta=Math.atan2(target.y-e.y,target.x-e.x);e.x+=Math.cos(ta)*e.speed*slow*dt;e.y+=Math.sin(ta)*e.speed*slow*dt;if(Math.hypot(target.x-e.x,target.y-e.y)<20){e.stolen+=target.value;loot.splice(loot.indexOf(target),1);e.state="retreating";alertEnemies(e.x,e.y,300,"stolen_scrap")}}else if(e.state==="retreating"){e.x+=e.speed*1.25*dt;if(e.x>W-52)e.escaped=true}else{e.x-=Math.cos(a)*e.speed*.45*slow*dt;e.y-=Math.sin(a)*e.speed*.45*slow*dt}}
        if(e.type==="hunter"){const target=e.state==="combat"?player:e.lastKnown;if(target){const ha=Math.atan2(target.y-e.y,target.x-e.x),pace=e.state==="combat"?1.18:.68;e.x+=Math.cos(ha)*e.speed*pace*slow*dt;e.y+=Math.sin(ha)*e.speed*pace*slow*dt}if(e.state==="combat"&&e.cooldown<=0&&d<120){enemyShots.push({x:e.x,y:e.y,vx:Math.cos(a)*130,vy:Math.sin(a)*130,r:8,damage:13,life:.55,color:"#72ff77"});e.cooldown=1.05}}
        if(e.type==="mira"){e.state="combat";e.phase=e.hp/e.maxHp<.5?2:1;e.laserAngle=(e.laserAngle||0)+dt*(e.phase===2?1.25:.72);if(e.phase===2&&Math.sin(performance.now()/650)>.65)currentAtmosphere.powerState="blackout";for(let beam=0;beam<(e.phase===2?4:2);beam++){const diff=a-(e.laserAngle+beam*Math.PI/(e.phase===2?4:2));if(Math.abs(Math.sin(diff))*d<9&&d<430&&hazardTick<=0){damage(10);hazardTick=.5}}if(e.cooldown<=0&&!e.invulnerable){const count=e.phase===2?14:9;for(let i=0;i<count;i++){const aa=i/count*Math.PI*2+e.laserAngle;enemyShots.push({x:e.x,y:e.y,vx:Math.cos(aa)*185,vy:Math.sin(aa)*185,r:6,damage:11,life:4,color:"#ff3eb5"})}e.cooldown=e.phase===2?.65:1.05}}
        if(e.type==="colossus"){e.state="combat";e.phase=e.hp/e.maxHp<.4?3:e.hp/e.maxHp<.72?2:1;if(e.rush>0){e.x+=Math.cos(e.angle)*e.speed*5*dt;e.y+=Math.sin(e.angle)*e.speed*5*dt;e.rush-=dt}else if(e.cooldown<=0){if(e.phase>=2&&Math.random()<.5){e.angle=a;e.rush=.7;addFloater(e.x,e.y-35,"COLOSSUS CHARGE","#ff7043",true)}else{const count=16;for(let i=0;i<count;i++){const aa=i/count*Math.PI*2;enemyShots.push({x:e.x,y:e.y,vx:Math.cos(aa)*145,vy:Math.sin(aa)*145,r:8,damage:13,life:4,color:"#ff7043"})}for(let i=0;i<3;i++)enemyShots.push({x:160+Math.random()*580,y:100+Math.random()*360,vx:0,vy:0,r:32,damage:8,life:4.5,color:"#ff3e65",zone:true})}e.cooldown=e.phase===3?.72:1.25}e.x+=Math.cos(a)*e.speed*.35*dt;e.y+=Math.sin(a)*e.speed*.35*dt}
        if(e.type==="stalker"){e.state="combat";e.phase=e.hp/e.maxHp<.35?3:e.hp/e.maxHp<.68?2:1;e.attackClock-=dt;const exposed=stationPowerRestored||career.gadget==="scanner"||flashlight;e.invulnerable=e.alpha<.45&&!exposed;if(e.attackClock<=0){if(e.alpha>.5){e.alpha=.08;e.invulnerable=true;e.x=120+Math.random()*660;e.y=80+Math.random()*400;addFloater(player.x,player.y-30,"VENT MOVEMENT","#72ff77",true);e.attackClock=.9}else{e.alpha=exposed?1:.78;e.invulnerable=false;const sa=Math.atan2(player.y-e.y,player.x-e.x);enemyShots.push({x:e.x,y:e.y,vx:Math.cos(sa)*300,vy:Math.sin(sa)*300,r:10,damage:16,life:1.6,color:"#72ff77"});if(e.phase===3&&enemies.filter(enemy=>enemy.type==="hunter").length<3){const point=randomOpenPoint(380,W-120);spawnEnemy("hunter",point.x,point.y)}e.attackClock=e.phase===3?.75:1.25}}if(e.alpha>.5){e.x+=Math.cos(a)*e.speed*.82*slow*dt;e.y+=Math.sin(a)*e.speed*.82*slow*dt}}
        e.x=clamp(e.x,50,W-50);e.y=clamp(e.y,50,H-50);if(d<player.r+e.r+3)damage(e.type==="charger"?18:e.type==="colossus"?20:e.boss?15:e.type==="hunter"?12:8)
      });
      enemies.filter(e=>e.escaped).forEach(e=>addFloater(W-85,e.y,`THIEF ESCAPED -${e.stolen}`,"#ff7043",true));enemies=enemies.filter(e=>!e.escaped);
      const dead=enemies.filter(e=>e.hp<=0);dead.forEach(e=>{kills++;const finisher=e.boss||e.lastHeavy,deathColor=e.lastWeapon==="cryo"?"#aeefff":e.lastWeapon==="arc"?"#d83cff":e.lastWeapon==="rail"?"#ff3eb5":e.lastWeapon==="scatter"?"#ff9d32":e.boss?"#ffb547":e.type==="hunter"?"#72ff77":"#31f5ff";burst(e.x,e.y,deathColor,finisher?36:18);if(e.boss)showBossReward(e);if(finisher){hitStop=Math.max(hitStop,e.lastWeapon==="rail"?.2:e.lastWeapon==="scatter"?.17:.15);screenShake=Math.max(screenShake,e.boss?14:9);stationTone("metal");tone(58,.18,"sine",.035);addFloater(e.x,e.y-25,"FINISH","#fff",true);alertEnemies(e.x,e.y,520,"explosion")}if(e.stolen)loot.push({x:e.x,y:e.y,r:8,type:"scrap",value:e.stolen,pulse:0});if(Math.random()<.24||e.boss)loot.push({x:e.x+10,y:e.y,r:8,type:e.boss?"key":"scrap",value:Math.round((20+rooms[roomIndex].depth*5)*depthBonus),pulse:0})});enemies=enemies.filter(e=>e.hp>0);
      roomCleared=enemies.length===0;if(roomCleared&&!rooms[roomIndex].cleared){rooms[roomIndex].cleared=true;drawMinimap()}
      loot.forEach(l=>{l.pulse+=dt;if(mods.magnet>1&&Math.hypot(player.x-l.x,player.y-l.y)<95*mods.magnet){const a=Math.atan2(player.y-l.y,player.x-l.x);l.x+=Math.cos(a)*210*dt;l.y+=Math.sin(a)*210*dt}});
      loot.filter(l=>Math.hypot(player.x-l.x,player.y-l.y)<player.r+l.r+5).forEach(l=>{if(l.type==="scrap"){const value=Math.round(l.value*mods.loot*(career.unlocks.includes("backpack")?1.25:1));carried+=value;runInventory.push({type:"scrap",value,room:roomIndex+1})}else if(l.type==="key")keycards++;else player.hp=Math.min(player.maxHp,player.hp+25);burst(l.x,l.y,l.type==="key"?"#ffe84c":"#72ff77",8);loot.splice(loot.indexOf(l),1);sfx("coin")});
      if(mods.drone||beaconDroneTime>0){droneClock-=dt;if(droneClock<=0&&enemies.length){const target=enemies.reduce((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)<Math.hypot(b.x-player.x,b.y-player.y)?a:b),a=Math.atan2(target.y-player.y,target.x-player.x);projectiles.push({x:player.x-18,y:player.y-18,vx:Math.cos(a)*520,vy:Math.sin(a)*520,life:1.2,damage:(beaconDroneTime>0?18:12)*mods.damage,weaponEffect:"beacon",knockback:5,color:"#72ff77",pierce:1,bounce:0});droneClock=beaconDroneTime>0?.42:.75}}
      particles.forEach(p=>{if(!p.beam){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.92;p.vy*=.92;if(p.casing)p.vy+=180*dt}p.life-=dt});particles=particles.filter(p=>p.life>0);floaters.forEach(f=>{f.y-=24*dt;f.life-=dt});floaters=floaters.filter(f=>f.life>0);soundCues.forEach(cue=>cue.life-=dt);soundCues=soundCues.filter(cue=>cue.life>0);screenShake=Math.max(0,screenShake-dt*30);updateHud();
    }
    function draw(){
      const room=rooms[roomIndex],stage=reactorStage(),sx=screenShake?(Math.random()-.5)*screenShake:0,sy=screenShake?(Math.random()-.5)*screenShake:0,now=performance.now();ctx.save();ctx.translate(sx,sy);ctx.fillStyle=stage==="normal"?"#050817":stage==="warning"?"#171306":stage==="emergency"?"#19060b":"#020207";ctx.fillRect(-10,-10,W+20,H+20);
      ctx.strokeStyle=stage==="warning"?"#50461a":stage==="emergency"||stage==="critical"?"#521326":"#14234a";ctx.lineWidth=1;for(let x=40;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,35);ctx.lineTo(x,H-35);ctx.stroke()}for(let y=40;y<H;y+=40){ctx.beginPath();ctx.moveTo(35,y);ctx.lineTo(W-35,y);ctx.stroke()}
      const doorPart=58*(1-doorAnim);ctx.fillStyle="#111936";ctx.strokeStyle=stage==="emergency"||stage==="critical"?"#ff3e65":room.type==="reactor"?"#ff7043":room.type==="treasure"?"#ffe84c":"#31f5ff";ctx.lineWidth=4;ctx.strokeRect(34,34,W-68,H-68);ctx.fillRect(W-38,doorY-58,22,doorPart);ctx.fillRect(W-38,doorY+58-doorPart,22,doorPart);ctx.strokeRect(W-42,doorY-62,30,124);
      room.blocks.forEach((b,i)=>{ctx.fillStyle=i%2?"#101a35":"#151b3f";ctx.fillRect(...b);ctx.strokeStyle="#3d4d78";ctx.lineWidth=2;ctx.strokeRect(...b);ctx.fillStyle="#31f5ff44";for(let x=b[0]+10;x<b[0]+b[2]-5;x+=22)ctx.fillRect(x,b[1]+7,9,3)});
      room.hazards.forEach(h=>{ctx.fillStyle="#ff3e6528";ctx.fillRect(...h);ctx.strokeStyle="#ff4b6e";ctx.setLineDash([10,8]);ctx.strokeRect(...h);ctx.setLineDash([])});
      if(currentAtmosphere.hazard==="steam"){for(let i=0;i<5;i++){const x=125+i*165,y=75+((now*.045+i*91)%410),cloud=ctx.createRadialGradient(x,y,2,x,y,28);cloud.addColorStop(0,"rgba(220,240,255,.3)");cloud.addColorStop(1,"rgba(220,240,255,0)");ctx.fillStyle=cloud;ctx.fillRect(x-30,y-30,60,60)}}
      if(currentAtmosphere.hazard==="sparks"){ctx.strokeStyle="#ffe84c";ctx.lineWidth=2;for(let i=0;i<5;i++){const x=170+i*145,y=65+((i*113+Math.floor(now/45)*17)%430);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-7+(i%3)*7,y+12);ctx.stroke()}}
      if(currentAtmosphere.hazard==="moving_machinery"){room.blocks.forEach((b,i)=>{const offset=(now*.05+i*17)%24;ctx.fillStyle="#8793b544";for(let x=b[0]-24+offset;x<b[0]+b[2];x+=24)ctx.fillRect(x,b[1]+b[3]-7,12,5)})}
      interactables.forEach(item=>{if(item.used||item.hidden&&Math.hypot(player.x-item.x,player.y-item.y)>60&&career.gadget!=="scanner")return;const def=interactableDefs[item.type],pulse=1+Math.sin(now/220+item.id)*.18;ctx.save();ctx.translate(item.x,item.y);ctx.scale(pulse,pulse);ctx.strokeStyle=def.color;ctx.fillStyle="#081020";ctx.lineWidth=2;ctx.shadowBlur=10;ctx.shadowColor=def.color;ctx.beginPath();ctx.rect(-15,-15,30,30);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle=def.color;ctx.font="bold 18px monospace";ctx.textAlign="center";ctx.fillText(def.icon,0,6);ctx.restore()});
      loot.forEach(l=>{const glow=8+Math.sin(l.pulse*4)*3;ctx.shadowBlur=glow;ctx.shadowColor=l.type==="key"?"#ffe84c":l.type==="med"?"#72ff77":"#31f5ff";ctx.fillStyle=ctx.shadowColor;ctx.beginPath();if(l.type==="key")ctx.rect(l.x-8,l.y-5,16,10);else ctx.arc(l.x,l.y,l.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0});
      projectiles.forEach(p=>{ctx.fillStyle=p.color;ctx.shadowBlur=9;ctx.shadowColor=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.weaponEffect==="rail"?7:4,0,Math.PI*2);ctx.fill()});enemyShots.forEach(p=>{ctx.globalAlpha=p.zone?.28:1;ctx.fillStyle=p.color;ctx.shadowBlur=p.zone?22:10;ctx.shadowColor=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});ctx.globalAlpha=1;ctx.shadowBlur=0;
      enemies.filter(e=>e.type==="mira").forEach(e=>{ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.laserAngle||0);ctx.strokeStyle=e.invulnerable?"#31f5ff99":"#ff3eb5aa";ctx.lineWidth=5;for(let i=0;i<(e.phase===2?4:2);i++){ctx.beginPath();ctx.moveTo(-430,0);ctx.lineTo(430,0);ctx.stroke();ctx.rotate(Math.PI/(e.phase===2?4:2))}ctx.restore()});
      enemies.filter(e=>e.type==="turret"&&e.state==="combat"&&!securityDisabled).forEach(e=>{ctx.strokeStyle="rgba(255,62,101,.65)";ctx.lineWidth=1.5;ctx.setLineDash([8,5]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(player.x,player.y);ctx.stroke();ctx.setLineDash([])});
      enemies.forEach(e=>{const color=e.flash?"#fff":e.type==="mira"?"#31f5ff":e.type==="colossus"?"#ff7043":e.type==="stalker"?"#72ff77":e.type==="drone"?"#ff3eb5":e.type==="charger"?"#ff7043":e.type==="turret"?"#b56cff":e.type==="thief"?"#ffe84c":e.type==="hunter"?"#72ff77":"#ffb547";ctx.save();ctx.globalAlpha=e.alpha??1;ctx.translate(e.x,e.y);ctx.rotate(e.type==="turret"?Math.atan2(player.y-e.y,player.x-e.x):performance.now()/800);ctx.fillStyle=color;ctx.shadowBlur=e.boss?25:12;ctx.shadowColor=color;ctx.beginPath();if(e.type==="drone"){for(let i=0;i<4;i++){ctx.lineTo(0,-e.r);ctx.rotate(Math.PI/2)}}else if(e.type==="charger"||e.type==="colossus")ctx.rect(-e.r,-e.r,e.r*2,e.r*2);else if(e.type==="turret"){ctx.rect(-14,-14,28,28);ctx.fillRect(0,-4,24,8)}else if(e.type==="thief"){ctx.moveTo(0,-e.r);ctx.lineTo(e.r,e.r);ctx.lineTo(-e.r,e.r)}else if(e.type==="hunter"||e.type==="stalker"){ctx.moveTo(0,-e.r);ctx.lineTo(e.r*.7,-2);ctx.lineTo(e.r,e.r);ctx.lineTo(0,e.r*.45);ctx.lineTo(-e.r,e.r);ctx.lineTo(-e.r*.7,-2)}else{for(let i=0;i<8;i++){ctx.lineTo(0,-e.r);ctx.rotate(Math.PI/4)}}ctx.closePath();ctx.fill();ctx.restore();ctx.fillStyle=e.state==="combat"?"#ff3e65":e.state==="searching"?"#ffe84c":e.state==="suspicious"?"#31f5ff":"#5f5970";ctx.font="bold 9px monospace";ctx.textAlign="center";ctx.fillText(e.boss?`${bossNames[e.type]} • PHASE ${e.phase}`:e.state.toUpperCase(),e.x,e.y-e.r-19);ctx.fillStyle="#1a1028";ctx.fillRect(e.x-(e.boss?60:22),e.y-e.r-13,e.boss?120:44,5);ctx.fillStyle=e.boss?"#ffb547":"#ff4b6e";ctx.fillRect(e.x-(e.boss?60:22),e.y-e.r-13,(e.boss?120:44)*Math.max(0,e.hp/e.maxHp),5)});
      const droneX=player.x-22,droneY=player.y-21;if(mods.drone||beaconDroneTime>0){ctx.fillStyle="#72ff77";ctx.shadowBlur=beaconDroneTime>0?18:8;ctx.shadowColor="#72ff77";ctx.beginPath();ctx.arc(droneX,droneY,beaconDroneTime>0?10:7,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
      ctx.save();ctx.translate(player.x,player.y);ctx.rotate(player.aim);ctx.fillStyle=player.invuln>0&&Math.floor(performance.now()/70)%2?"#fff":"#31f5ff";ctx.shadowBlur=18;ctx.shadowColor="#31f5ff";ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-11,-11);ctx.lineTo(-5,0);ctx.lineTo(-11,11);ctx.closePath();ctx.fill();ctx.translate(-recoil*38,0);ctx.shadowBlur=9;ctx.shadowColor=selectedSkin.tone;if(skinImage.complete&&skinImage.naturalWidth){const [sx,sy,sw,sh]=selectedSkin.crop;ctx.drawImage(skinImage,sx,sy,sw,sh,0,-12,52,24)}else{ctx.fillStyle=selectedSkin.tone;ctx.fillRect(8,-3,20,6)}if(muzzleFlash>0){ctx.fillStyle="#fff";ctx.shadowBlur=22;ctx.shadowColor=weapon.color;ctx.beginPath();ctx.moveTo(55,0);ctx.lineTo(36,-10);ctx.lineTo(41,0);ctx.lineTo(36,10);ctx.closePath();ctx.fill()}ctx.restore();ctx.shadowBlur=0;
      particles.forEach(p=>{ctx.globalAlpha=Math.min(1,p.life*4);ctx.strokeStyle=p.color;ctx.fillStyle=p.color;if(p.beam){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+p.vx,p.y+p.vy);ctx.stroke()}else if(p.casing){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.life*12);ctx.fillRect(-3,-1,7,2);ctx.restore()}else ctx.fillRect(p.x-2,p.y-2,4,4)});ctx.globalAlpha=1;floaters.forEach(f=>{ctx.fillStyle=f.color;ctx.font=`bold ${f.big?17:12}px monospace`;ctx.textAlign="center";ctx.fillText(f.text,f.x,f.y)});soundCues.forEach(cue=>{ctx.globalAlpha=cue.life;ctx.strokeStyle=cue.color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cue.x,cue.y,(1-cue.life)*55+8,0,Math.PI*2);ctx.stroke()});ctx.globalAlpha=1;
      if(career.gadget==="scanner"){ctx.strokeStyle="#31f5ff55";ctx.beginPath();ctx.arc(player.x,player.y,70+Math.sin(performance.now()/300)*25,0,Math.PI*2);ctx.stroke()}
      const flicker=Math.sin(now/37)*.5+.5;if(currentAtmosphere.powerState==="blackout"||stage==="critical"){const light=ctx.createRadialGradient(player.x,player.y,35,player.x,player.y,currentAtmosphere.powerState==="blackout"?175:235);light.addColorStop(0,"rgba(0,0,0,0)");light.addColorStop(.58,"rgba(0,0,0,.12)");light.addColorStop(1,`rgba(0,0,0,${stage==="critical"&&flicker>.72?.98:.88})`);ctx.fillStyle=light;ctx.fillRect(0,0,W,H)}else if(currentAtmosphere.powerState==="unstable"&&flicker<currentAtmosphere.lightFlicker){ctx.fillStyle="rgba(0,0,0,.45)";ctx.fillRect(0,0,W,H)}
      if(stage==="warning"){ctx.fillStyle="rgba(255,220,40,.055)";ctx.fillRect(0,0,W,H)}if(stage==="emergency"||stage==="critical"){ctx.fillStyle=`rgba(255,0,35,${.06+flicker*.05})`;ctx.fillRect(0,0,W,H)}
      const atmosphereEl=$("#salvage-atmosphere");if(atmosphereEl){atmosphereEl.className=`salvage-atmosphere power-${currentAtmosphere.powerState} reactor-${stage}`;atmosphereEl.querySelector("span").textContent=`POWER ${currentAtmosphere.powerState.toUpperCase()} • ${stage.toUpperCase()}`;atmosphereEl.querySelector("b").textContent=`${currentAtmosphere.hazard.replace("_"," ").toUpperCase()} • ${currentAtmosphere.ambientSound.replace("_"," ").toUpperCase()}`;}
      ctx.restore();
    }
    function loop(now){const dt=Math.min(.034,(now-last)/1000);last=now;update(dt);draw();if(!ended)raf=requestAnimationFrame(loop)}
    const onKeyDown=e=>{const k=e.key.toLowerCase();if(["arrowup","arrowdown","arrowleft","arrowright"," ","shift","e"].includes(k))e.preventDefault();keys.add(k);if(k==="shift")dash();if(k==="e")interact()};
    const onKeyUp=e=>keys.delete(e.key.toLowerCase()),onMove=e=>{const r=canvas.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width*W;mouse.y=(e.clientY-r.top)/r.height*H},onDown=e=>{if(e.button===0){shootHeld=true;shoot()}},onUp=()=>shootHeld=false;
    document.addEventListener("keydown",onKeyDown);document.addEventListener("keyup",onKeyUp);canvas.addEventListener("pointermove",onMove);canvas.addEventListener("pointerdown",onDown);window.addEventListener("pointerup",onUp);
    $$(".salvager-mobile [data-dir]").forEach(btn=>{const map={up:"w",down:"s",left:"a",right:"d"},key=map[btn.dataset.dir];btn.onpointerdown=e=>{e.preventDefault();keys.add(key)};btn.onpointerup=btn.onpointercancel=()=>keys.delete(key)});
    $$("[data-salvage-action]").forEach(btn=>{btn.onpointerdown=e=>{e.preventDefault();if(btn.dataset.salvageAction==="dash")dash();if(btn.dataset.salvageAction==="interact")interact();if(btn.dataset.salvageAction==="fire"){shootHeld=true;shoot()}};btn.onpointerup=()=>shootHeld=false});
    career.runs=Math.max(0,career.runs);buildRoom();offerWeaponMod();raf=requestAnimationFrame(loop);
    cleanupRun=()=>{ended=true;cancelAnimationFrame(raf);document.removeEventListener("keydown",onKeyDown);document.removeEventListener("keyup",onKeyUp);canvas.removeEventListener("pointermove",onMove);canvas.removeEventListener("pointerdown",onDown);window.removeEventListener("pointerup",onUp)};
  }
  renderBay();
}

function startBilliards(launchOptions={}){
  const mode=["ai","ladder","local"].includes(launchOptions.mode)?launchOptions.mode:"ai",difficulty=["easy","normal","hard"].includes(launchOptions.difficulty)?launchOptions.difficulty:"normal",theme=["neon","sunset","arctic","cosmic"].includes(launchOptions.theme)?launchOptions.theme:"neon",ladderLevels=["easy","normal","hard","champion"],ladderNames={easy:"ROOKIE",normal:"CLUB PLAYER",hard:"PRO",champion:"NEON CHAMPION"},ladderIndex=Math.max(0,Math.min(3,Number(launchOptions.ladderIndex)||0));
  let aiLevel=mode==="ladder"?ladderLevels[ladderIndex]:difficulty;
  const isAi=mode!=="local",opponentName=()=>ladderNames[aiLevel]||`${aiLevel.toUpperCase()} AI`;
  const arenaThemes={
    neon:{name:"NEON CLUB",felt:"#073f38",felt2:"#0b5b4d",rail:"#6b3218",frame:"#17102d",accent:"#2de2a6",glow:"#31f5ff",cue:"#e2ad72"},
    sunset:{name:"SUNSET ROOFTOP",felt:"#54213e",felt2:"#7d2947",rail:"#d17237",frame:"#27152f",accent:"#ffb347",glow:"#ff4f9a",cue:"#ffe0a3"},
    arctic:{name:"ARCTIC CIRCUIT",felt:"#154b65",felt2:"#1f7591",rail:"#b8e8f4",frame:"#10263c",accent:"#b9f7ff",glow:"#57d7ff",cue:"#ecfbff"},
    cosmic:{name:"COSMIC VOID",felt:"#22134f",felt2:"#38216f",rail:"#563b8d",frame:"#09051d",accent:"#c982ff",glow:"#ff4fdd",cue:"#f0c9ff"}
  },arena=arenaThemes[theme];
  const stats=currentPlayer.gameStats.billiards||={plays:0,wins:0,losses:0,draws:0,best:null};
  stats.plays=(stats.plays||0)+1;stats.opponents||={};saveData();
  setStage(`<section class="billiards-game pool-theme-${theme}" style="--pool-accent:${arena.accent};--pool-glow:${arena.glow}"><div class="billiards-scoreboard"><article id="pool-player-0"><small>PLAYER 1</small><b id="pool-name-0">YOU</b><span id="pool-group-0">OPEN TABLE</span></article><div><strong id="pool-turn">PLAYER 1 TURN</strong><small id="pool-message">Aim freely, then drag straight back and release.</small></div><article id="pool-player-1"><small>PLAYER 2</small><b id="pool-name-1">${isAi?opponentName():"PLAYER 2"}</b><span id="pool-group-1">OPEN TABLE</span></article></div><div class="billiards-arena-label"><span>${arena.name}${mode==="ladder"?` • LADDER ${ladderIndex+1}/4`:""}</span><small>LEGAL 8-BALL • BALL IN HAND • SPIN + DEFLECTION PHYSICS</small></div><div id="pool-call-pocket" class="pool-call-pocket" hidden><span>CALL THE 8-BALL POCKET</span>${["TOP LEFT","TOP MIDDLE","TOP RIGHT","BOTTOM LEFT","BOTTOM MIDDLE","BOTTOM RIGHT"].map((label,index)=>`<button type="button" data-pool-pocket="${index}">${index+1}<small>${label}</small></button>`).join("")}</div><div class="billiards-table-wrap"><canvas id="billiards-canvas" width="900" height="500" aria-label="Interactive ${arena.name.toLowerCase()} billiards table"></canvas><i id="pool-lock-indicator">AIM FREE</i></div><div class="billiards-controls"><label><span>SHOT POWER</span><input id="pool-power" type="range" min="10" max="100" value="58"><b id="pool-power-value">58%</b></label><div class="pool-spin-control"><small>CUE CONTACT</small><canvas id="pool-spin-pad" width="100" height="100" aria-label="Cue ball spin contact selector"></canvas><b id="pool-spin-label">CENTER</b></div><div class="pool-fine-aim"><button type="button" data-pool-nudge="-1" aria-label="Aim left by 0.25 degrees">◀ 0.25°</button><b id="pool-angle">0.00°</b><button type="button" data-pool-nudge="1" aria-label="Aim right by 0.25 degrees">0.25° ▶</button></div><button id="pool-shoot" class="pixel-btn primary">SHOOT • SPACE</button></div><p class="billiards-help">After a foul, place the cue ball manually and confirm with click or Space. Call a pocket before the 8-ball. Drag the cue contact point for topspin, draw, or side English.</p></section>`);
  const canvas=$("#billiards-canvas"),ctx=canvas.getContext("2d"),spinCanvas=$("#pool-spin-pad"),spinCtx=spinCanvas.getContext("2d"),powerInput=$("#pool-power"),shootButton=$("#pool-shoot"),nudgeButtons=$$("[data-pool-nudge]"),pocketButtons=$$("[data-pool-pocket]"),W=900,H=500,R=12.5,rail={l:43,r:857,t:43,b:457};
  const pockets=[{x:43,y:43},{x:450,y:38},{x:857,y:43},{x:43,y:457},{x:450,y:462},{x:857,y:457}],colors=["#fff","#ffe84c","#2f6bff","#ff4b3e","#9b4dff","#ff8b2c","#2de2a6","#8c263b","#151522","#ffe84c","#2f6bff","#ff4b3e","#9b4dff","#ff8b2c","#2de2a6","#8c263b"];
  const balls=[],timeouts=new Set();let current=0,groups=[null,null],aimAngle=0,aimTargetAngle=0,power=58,shotActive=false,shotPotted=[],shotTarget="open",scratch=false,firstHit=null,ended=false,raf=0,last=performance.now(),accumulator=0,shots=0,aimLocked=false,dragging=false,dragStart=null,dragDistance=0,ballInHand=false,placement={x:235,y:250},placementValid=true,railAfterContact=false,objectBallPotted=false,breakShot=true,railContactCount=0,calledPocket=null,shotCalledPocket=null,eightPocket=null,spinX=0,spinY=0,spinDragging=false,shotSpinX=0,shotSpinY=0,shotDirectionX=1,shotDirectionY=0,spinApplied=false,turnsTaken=[0,0];
  const schedule=(fn,ms)=>{const id=setTimeout(()=>{timeouts.delete(id);fn()},ms);timeouts.add(id);return id};
  const makeBall=(id,x,y)=>({id,x,y,vx:0,vy:0,spinX:0,rotation:0,active:true});
  balls.push(makeBall(0,235,250));
  const rack=[1,9,2,10,8,3,11,4,12,5,13,6,14,7,15],gap=R*2+.8,startX=645;let n=0;
  for(let row=0;row<5;row++)for(let col=0;col<=row;col++){const id=rack[n++];balls.push(makeBall(id,startX+row*gap*.87,250+(col-row/2)*gap));}
  const cue=()=>balls[0],groupOf=id=>id>=1&&id<=7?"solids":id>=9&&id<=15?"stripes":null,remaining=group=>balls.filter(ball=>ball.active&&groupOf(ball.id)===group).length;
  const humanTurn=()=>mode==="local"||current===0,anyMoving=()=>balls.some(ball=>ball.active&&Math.hypot(ball.vx,ball.vy)>.045);
  const playerName=index=>index===0?"PLAYER 1":isAi?opponentName():"PLAYER 2";
  const setMessage=text=>{$("#pool-message").textContent=text};
  const normalizeAngle=value=>Math.atan2(Math.sin(value),Math.cos(value));
  const angleDelta=(from,to)=>normalizeAngle(to-from);
  const updateAngleReadout=()=>{const readout=$("#pool-angle");if(readout)readout.textContent=`${((aimAngle*180/Math.PI+360)%360).toFixed(2)}°`};
  const setAimAngle=(value,immediate=false)=>{aimTargetAngle=normalizeAngle(value);if(immediate)aimAngle=aimTargetAngle;updateAngleReadout()};
  const nudgeAim=(direction,degrees=.25)=>{if(ended||shotActive||!humanTurn())return;setAimAngle(aimTargetAngle+direction*degrees*Math.PI/180,true);setAimLock(true);setMessage(`PRECISION AIM • ${((aimAngle*180/Math.PI+360)%360).toFixed(2)}°`);updateHud()};
  const setAimLock=locked=>{aimLocked=locked;const indicator=$("#pool-lock-indicator");if(indicator){indicator.textContent=locked?"AIM LOCKED":"AIM FREE";indicator.classList.toggle("locked",locked)}canvas.classList.toggle("aim-locked",locked)};
  const updateHud=()=>{for(let i=0;i<2;i++){const group=groups[i],left=group?remaining(group):7;$("#pool-group-"+i).textContent=group?`${group.toUpperCase()} • ${left} LEFT`:"OPEN TABLE";$("#pool-player-"+i).classList.toggle("active",i===current)}$("#pool-turn").textContent=ballInHand?`${playerName(current)} • BALL IN HAND`:`${playerName(current)} TURN`;const needsCall=legalFirstTarget()==="eight"&&humanTurn()&&!shotActive&&!ballInHand,controlsDisabled=ended||shotActive||ballInHand||!humanTurn();powerInput.disabled=controlsDisabled;shootButton.disabled=controlsDisabled||(needsCall&&calledPocket===null);nudgeButtons.forEach(button=>button.disabled=controlsDisabled);spinCanvas.classList.toggle("disabled",controlsDisabled);const callPanel=$("#pool-call-pocket");callPanel.hidden=!needsCall;pocketButtons.forEach(button=>button.classList.toggle("active",Number(button.dataset.poolPocket)===calledPocket));shootButton.textContent=needsCall&&calledPocket===null?"CALL A POCKET":aimLocked?"SHOOT LOCKED ANGLE":"SHOOT • SPACE";updateAngleReadout()};
  const validCuePlacement=(x,y)=>x>=rail.l+R&&x<=rail.r-R&&y>=rail.t+R&&y<=rail.b-R&&!pockets.some(pocket=>Math.hypot(x-pocket.x,y-pocket.y)<30)&&balls.every(ball=>ball.id===0||!ball.active||Math.hypot(ball.x-x,ball.y-y)>=R*2+1);
  const findLegalPlacement=(preferred={x:235,y:250})=>{if(validCuePlacement(preferred.x,preferred.y))return preferred;for(let radius=20;radius<330;radius+=20)for(let angle=0;angle<Math.PI*2;angle+=Math.PI/12){const point={x:preferred.x+Math.cos(angle)*radius,y:preferred.y+Math.sin(angle)*radius};if(validCuePlacement(point.x,point.y))return point}return{x:235,y:250}};
  const confirmCuePlacement=()=>{if(!ballInHand||!placementValid)return false;const ball=cue();ball.active=true;ball.x=placement.x;ball.y=placement.y;ball.vx=ball.vy=0;ball.spinX=0;ballInHand=false;setMessage("CUE BALL PLACED • AIM YOUR SHOT");updateHud();if(!humanTurn())schedule(aiShoot,500);return true};
  const beginBallInHand=()=>{const ball=cue();ball.active=false;ball.vx=ball.vy=0;placement=findLegalPlacement();placementValid=true;ballInHand=true;setAimLock(false);setMessage(humanTurn()?"BALL IN HAND • MOVE THE CUE BALL AND CLICK TO PLACE":"AI HAS BALL IN HAND");updateHud();if(!humanTurn())schedule(()=>{placement=findLegalPlacement({x:250+Math.random()*80,y:190+Math.random()*120});placementValid=true;confirmCuePlacement()},550)};
  const finish=winner=>{if(ended)return;ended=true;shotActive=false;ballInHand=false;timeouts.forEach(clearTimeout);timeouts.clear();const playerWon=winner===0,recordKey=isAi?aiLevel:"local",record=stats.opponents[recordKey]||={wins:0,losses:0};if(playerWon)record.wins++;else record.losses++;stats.opponents[recordKey]=record;stats.currentWinStreak=playerWon?(stats.currentWinStreak||0)+1:0;stats.highestWinStreak=Math.max(stats.highestWinStreak||0,stats.currentWinStreak);const breakAndRun=playerWon&&isAi&&turnsTaken[1]===0;if(breakAndRun)stats.breakAndRuns=(stats.breakAndRuns||0)+1;if(playerWon)stats.fewestShots=Math.min(stats.fewestShots||Infinity,turnsTaken[0]||shots);stats.best=Number.isFinite(stats.fewestShots)?stats.fewestShots:null;const ladderContinues=mode==="ladder"&&playerWon&&ladderIndex<3,ladderCleared=mode==="ladder"&&playerWon&&ladderIndex===3;if(ladderCleared)stats.ladderClears=(stats.ladderClears||0)+1;saveData();updateHud();setMessage(`${playerName(winner)} WINS THE TABLE`);schedule(()=>{const nextLabel=ladderContinues?`NEXT: ${ladderNames[ladderLevels[ladderIndex+1]]}`:mode==="ladder"&&!playerWon?"RESTART LADDER":"RACK AGAIN";setStage(`<div class="billiards-report"><div class="big-icon">🎱</div><p class="eyebrow">${ladderCleared?"NEON LADDER CONQUERED":mode==="ladder"?`LADDER ${ladderIndex+1}/4 COMPLETE`:"8-BALL MATCH COMPLETE"}</p><h3>${playerName(winner)} WINS</h3><div class="career-grid"><article><span>OPPONENT</span><b>${isAi?opponentName():"LOCAL 2P"}</b></article><article><span>YOUR SHOTS</span><b>${turnsTaken[0]}</b></article><article><span>BREAK & RUN</span><b>${breakAndRun?"YES":"NO"}</b></article><article><span>WIN STREAK</span><b>${stats.currentWinStreak||0}</b></article></div><p>RECORD ${record.wins}W / ${record.losses}L • BEST ${Number.isFinite(stats.fewestShots)?stats.fewestShots+" SHOTS":"—"} • LADDER CLEARS ${stats.ladderClears||0}</p><button id="pool-again" class="pixel-btn primary">${nextLabel}</button></div>`);reward(playerWon?55+(mode==="ladder"?ladderIndex*15:0):8,playerWon?40:10,{result:playerWon?"win":"loss",score:playerWon?Math.max(1,40-turnsTaken[0]):0,countGamePlay:false});$("#pool-again").onclick=()=>startBilliards({...launchOptions,mode,ladderIndex:ladderContinues?ladderIndex+1:mode==="ladder"&&!playerWon?0:ladderIndex})},900)};
  const legalFirstTarget=()=>{const group=groups[current];return group?(remaining(group)?group:"eight"):"open"};
  const resolveShot=()=>{shotActive=false;setAimLock(false);const shooter=current,eightPotted=shotPotted.includes(8),target=shotTarget,firstGroup=groupOf(firstHit),wrongFirst=!firstHit||(target==="eight"?firstHit!==8:target==="open"?firstHit===8:firstGroup!==target),illegalBreak=breakShot&&!objectBallPotted&&railContactCount<4,foul=scratch||wrongFirst||(!objectBallPotted&&!railAfterContact)||illegalBreak,firstObject=shotPotted.find(id=>id!==0&&id!==8);if(eightPotted){const legal=target==="eight"&&!foul&&shotCalledPocket!==null&&eightPocket===shotCalledPocket;return finish(legal?shooter:1-shooter)}if(!foul&&!groups[0]&&firstObject){groups[shooter]=groupOf(firstObject);groups[1-shooter]=groups[shooter]==="solids"?"stripes":"solids"}const ownPotted=shotPotted.some(id=>groupOf(id)===groups[shooter]);calledPocket=null;shotPotted=[];scratch=false;firstHit=null;objectBallPotted=false;railAfterContact=false;railContactCount=0;if(foul){current=1-current;setMessage(illegalBreak?"ILLEGAL BREAK • BALL IN HAND":wrongFirst?"FOUL • WRONG FIRST CONTACT":scratch?"SCRATCH • BALL IN HAND":"FOUL • NO RAIL OR POT");updateHud();return beginBallInHand()}if(!ownPotted)current=1-current;setMessage(ownPotted?"LEGAL POT • SHOOT AGAIN":"LEGAL SHOT • TURN PASSES");updateHud();if(!humanTurn())schedule(aiShoot,750)};
  const pocketBall=(ball,pocketIndex)=>{ball.active=false;ball.vx=ball.vy=0;shotPotted.push(ball.id);if(ball.id===0)scratch=true;else{objectBallPotted=true;if(ball.id===8)eightPocket=pocketIndex}sfx(ball.id===0?"lose":"coin")};
  const atPocketMouth=ball=>pockets.some(p=>Math.hypot(ball.x-p.x,ball.y-p.y)<34);
  const physics=dt=>{
    const step=dt/16.667;
    for(const ball of balls){
      if(!ball.active)continue;
      const speed=Math.hypot(ball.vx,ball.vy);ball.x+=ball.vx*step;ball.y+=ball.vy*step;ball.rotation+=(speed/R+ball.spinX)*step;ball.vx*=Math.pow(.9865,step);ball.vy*=Math.pow(.9865,step);ball.spinX*=Math.pow(.974,step);
      if(Math.hypot(ball.vx,ball.vy)<.045)ball.vx=ball.vy=0;
      let closestPocket=null,closestDistance=Infinity;
      for(const pocket of pockets){const distance=Math.hypot(ball.x-pocket.x,ball.y-pocket.y);if(distance<closestDistance){closestDistance=distance;closestPocket=pocket}}
      if(closestDistance<23.5){pocketBall(ball,pockets.indexOf(closestPocket));continue}
      const mouth=atPocketMouth(ball);
      if(mouth&&closestPocket){const dx=closestPocket.x-ball.x,dy=closestPocket.y-ball.y,distance=Math.max(1,closestDistance),funnel=(34-distance)*.0028;ball.vx+=dx/distance*funnel*step;ball.vy+=dy/distance*funnel*step;ball.vx*=.997;ball.vy*=.997}
      if(!mouth&&ball.x-R<rail.l){ball.x=rail.l+R;ball.vx=Math.abs(ball.vx)*.86;ball.vy=ball.vy*.965+ball.spinX*.35;ball.spinX*=.65;if(firstHit!==null){railAfterContact=true;railContactCount++}}
      if(!mouth&&ball.x+R>rail.r){ball.x=rail.r-R;ball.vx=-Math.abs(ball.vx)*.86;ball.vy=ball.vy*.965-ball.spinX*.35;ball.spinX*=.65;if(firstHit!==null){railAfterContact=true;railContactCount++}}
      if(!mouth&&ball.y-R<rail.t){ball.y=rail.t+R;ball.vy=Math.abs(ball.vy)*.86;ball.vx=ball.vx*.965-ball.spinX*.35;ball.spinX*=.65;if(firstHit!==null){railAfterContact=true;railContactCount++}}
      if(!mouth&&ball.y+R>rail.b){ball.y=rail.b-R;ball.vy=-Math.abs(ball.vy)*.86;ball.vx=ball.vx*.965+ball.spinX*.35;ball.spinX*=.65;if(firstHit!==null){railAfterContact=true;railContactCount++}}
    }
    for(let iteration=0;iteration<3;iteration++)for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){
      const a=balls[i],b=balls[j];if(!a.active||!b.active)continue;
      const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy);if(!dist||dist>=R*2)continue;
      const nx=dx/dist,ny=dy/dist,overlap=R*2-dist,correction=Math.max(0,overlap-.01)*.52;a.x-=nx*correction;a.y-=ny*correction;b.x+=nx*correction;b.y+=ny*correction;
      const rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
      if(rel<0){const impulse=rel*.972,tx=-ny,ty=nx,tangent=(b.vx-a.vx)*tx+(b.vy-a.vy)*ty,friction=tangent*.018;a.vx+=(impulse*nx+friction*tx);a.vy+=(impulse*ny+friction*ty);b.vx-=(impulse*nx+friction*tx);b.vy-=(impulse*ny+friction*ty);a.spinX-=tangent*.01;b.spinX+=tangent*.01;if((a.id===0||b.id===0)&&firstHit===null){firstHit=a.id===0?b.id:a.id;if(!spinApplied){const cueBall=a.id===0?a:b;cueBall.vx+=shotDirectionX*shotSpinY*4.2;cueBall.vy+=shotDirectionY*shotSpinY*4.2;cueBall.spinX+=shotSpinX*1.4;spinApplied=true}}}
    }
  };
  const drawBall=ball=>{ctx.save();ctx.translate(ball.x,ball.y);ctx.rotate(ball.rotation);ctx.shadowColor=colors[ball.id];ctx.shadowBlur=10;ctx.fillStyle=colors[ball.id];ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;if(ball.id>=9){ctx.fillStyle="#f5f0e6";ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.fill();ctx.fillStyle=colors[ball.id];ctx.fillRect(-R,-5,R*2,10)}if(ball.id){ctx.fillStyle="#f8f5eb";ctx.beginPath();ctx.arc(0,0,6.5,0,Math.PI*2);ctx.fill();ctx.fillStyle="#111";ctx.font="bold 7px monospace";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(ball.id,0,.5)}else{ctx.fillStyle="#dfefff";ctx.beginPath();ctx.arc(-4,-4,3,0,Math.PI*2);ctx.fill()}ctx.restore()};
  const predictedContact=()=>{const c=cue(),dx=Math.cos(aimAngle),dy=Math.sin(aimAngle);let best=null;for(const ball of balls){if(!ball.active||ball.id===0)continue;const ox=ball.x-c.x,oy=ball.y-c.y,projection=ox*dx+oy*dy;if(projection<=0)continue;const perpendicular2=ox*ox+oy*oy-projection*projection,diameter=R*2;if(perpendicular2>diameter*diameter)continue;const distance=projection-Math.sqrt(diameter*diameter-perpendicular2);if(distance>0&&(!best||distance<best.distance))best={ball,distance,x:c.x+dx*distance,y:c.y+dy*distance}}return best};
  const predictedRail=()=>{const c=cue(),dx=Math.cos(aimAngle),dy=Math.sin(aimAngle),left=rail.l+R,right=rail.r-R,top=rail.t+R,bottom=rail.b-R,candidates=[];if(dx>0)candidates.push({distance:(right-c.x)/dx,axis:"x"});else if(dx<0)candidates.push({distance:(left-c.x)/dx,axis:"x"});if(dy>0)candidates.push({distance:(bottom-c.y)/dy,axis:"y"});else if(dy<0)candidates.push({distance:(top-c.y)/dy,axis:"y"});const hit=candidates.filter(item=>item.distance>0).sort((a,b)=>a.distance-b.distance)[0];return hit?{...hit,x:c.x+dx*hit.distance,y:c.y+dy*hit.distance,reflected:hit.axis==="x"?Math.atan2(dy,-dx):Math.atan2(-dy,dx)}:null};
  const drawArena=()=>{
    ctx.fillStyle=arena.frame;ctx.fillRect(0,0,W,H);
    if(theme==="sunset"){const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#ff8b62");sky.addColorStop(.42,"#5a1d56");sky.addColorStop(1,"#160d2c");ctx.fillStyle=sky;ctx.fillRect(8,8,W-16,H-16);ctx.fillStyle="#25112c";for(let x=12;x<W;x+=46){const h=16+(x*7%25);ctx.fillRect(x,H-18-h,34,h)}}
    else if(theme==="cosmic"){ctx.fillStyle="#09051d";ctx.fillRect(8,8,W-16,H-16);for(let i=0;i<90;i++){ctx.fillStyle=i%7?"#ffffff88":arena.glow;ctx.fillRect((i*83+17)%W,(i*47+11)%H,i%9?1:2,i%9?1:2)}}
    else if(theme==="arctic"){const ice=ctx.createLinearGradient(0,0,W,H);ice.addColorStop(0,"#d9fbff");ice.addColorStop(1,"#3c91b6");ctx.fillStyle=ice;ctx.fillRect(8,8,W-16,H-16);ctx.strokeStyle="#ffffff66";for(let x=20;x<W;x+=72){ctx.beginPath();ctx.moveTo(x,8);ctx.lineTo(x+38,43);ctx.lineTo(x+68,8);ctx.stroke()}}
    else{ctx.fillStyle="#17102d";ctx.fillRect(8,8,W-16,H-16);ctx.strokeStyle="#31f5ff33";for(let x=20;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,8);ctx.lineTo(x,42);ctx.stroke()}}
    ctx.fillStyle=arena.rail;ctx.fillRect(18,18,W-36,H-36);const felt=ctx.createRadialGradient(W*.5,H*.48,20,W*.5,H*.5,W*.58);felt.addColorStop(0,arena.felt2);felt.addColorStop(1,arena.felt);ctx.fillStyle=felt;ctx.fillRect(rail.l,rail.t,rail.r-rail.l,rail.b-rail.t);
    ctx.save();ctx.beginPath();ctx.rect(rail.l,rail.t,rail.r-rail.l,rail.b-rail.t);ctx.clip();ctx.globalAlpha=.16;ctx.strokeStyle=arena.accent;ctx.lineWidth=1;if(theme==="cosmic"){for(let i=0;i<55;i++){ctx.fillStyle=i%5?"#fff":arena.glow;ctx.fillRect(rail.l+(i*73)%810,rail.t+(i*41)%410,i%6?1:2,i%6?1:2)}}else if(theme==="arctic"){for(let x=70;x<880;x+=70){ctx.beginPath();ctx.moveTo(x,rail.t);ctx.lineTo(x+35,rail.b);ctx.stroke()}}else{for(let x=80;x<880;x+=80){ctx.beginPath();ctx.moveTo(x,rail.t);ctx.lineTo(x,rail.b);ctx.stroke()}for(let y=90;y<460;y+=80){ctx.beginPath();ctx.moveTo(rail.l,y);ctx.lineTo(rail.r,y);ctx.stroke()}}ctx.restore();
    ctx.strokeStyle=arena.accent;ctx.shadowColor=arena.glow;ctx.shadowBlur=9;ctx.lineWidth=3;ctx.strokeRect(rail.l+8,rail.t+8,rail.r-rail.l-16,rail.b-rail.t-16);ctx.shadowBlur=0;
    pockets.forEach((p,index)=>{ctx.fillStyle="#02030a";ctx.shadowColor=index===calledPocket?"#ffe84c":arena.glow;ctx.shadowBlur=index===calledPocket?24:12;ctx.beginPath();ctx.arc(p.x,p.y,23,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;if(index===calledPocket){ctx.strokeStyle="#ffe84c";ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.x,p.y,29,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#ffe84c";ctx.font="bold 11px monospace";ctx.textAlign="center";ctx.fillText("CALL",p.x,p.y+(p.y<H/2?43:-35))}});
  };
  const drawGuide=()=>{const c=cue(),dx=Math.cos(aimAngle),dy=Math.sin(aimAngle),contact=predictedContact(),railHit=predictedRail(),guideMode=!isAi||aiLevel==="easy"?"full":aiLevel==="normal"?"contact":"short",fullDistance=contact?contact.distance:railHit?.distance||320,distance=guideMode==="short"?Math.min(125,fullDistance):fullDistance,endX=c.x+dx*distance,endY=c.y+dy*distance;ctx.save();ctx.lineCap="round";ctx.setLineDash(aimLocked?[4,4]:[10,8]);ctx.strokeStyle=aimLocked?arena.accent:"#ffffffc8";ctx.lineWidth=1.7+power/100;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(endX,endY);ctx.stroke();ctx.setLineDash([]);if(contact&&guideMode==="full"){const nx=(contact.ball.x-contact.x)/(R*2),ny=(contact.ball.y-contact.y)/(R*2),normalPower=Math.max(0,dx*nx+dy*ny),cueOutX=dx-nx*normalPower,cueOutY=dy-ny*normalPower,cueOutLength=Math.hypot(cueOutX,cueOutY);ctx.strokeStyle=arena.accent;ctx.globalAlpha=.9;ctx.lineWidth=2;ctx.beginPath();ctx.arc(contact.x,contact.y,R,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(contact.ball.x-nx*R,contact.ball.y-ny*R,3.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(contact.ball.x,contact.ball.y);ctx.lineTo(contact.ball.x+nx*(65+normalPower*65),contact.ball.y+ny*(65+normalPower*65));ctx.stroke();if(cueOutLength>.025){ctx.strokeStyle="#ffffff99";ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(contact.x,contact.y);ctx.lineTo(contact.x+cueOutX/cueOutLength*(45+cueOutLength*65),contact.y+cueOutY/cueOutLength*(45+cueOutLength*65));ctx.stroke();ctx.setLineDash([])}}else if(contact&&guideMode==="contact"){ctx.fillStyle=arena.accent;ctx.beginPath();ctx.arc(contact.x,contact.y,4,0,Math.PI*2);ctx.fill()}else if(!contact&&railHit&&guideMode==="full"){ctx.strokeStyle=arena.accent;ctx.globalAlpha=.72;ctx.setLineDash([5,6]);ctx.beginPath();ctx.moveTo(railHit.x,railHit.y);ctx.lineTo(railHit.x+Math.cos(railHit.reflected)*95,railHit.y+Math.sin(railHit.reflected)*95);ctx.stroke();ctx.setLineDash([])}const pull=35+power*.45+(dragging?dragDistance*.38:0);ctx.globalAlpha=1;ctx.strokeStyle=arena.cue;ctx.shadowColor=arena.glow;ctx.shadowBlur=dragging?12:3;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(c.x-dx*pull,c.y-dy*pull);ctx.lineTo(c.x-dx*(pull+112),c.y-dy*(pull+112));ctx.stroke();ctx.restore()};
  const drawPlacement=()=>{ctx.save();ctx.globalAlpha=.82;ctx.fillStyle=placementValid?"#dffcff":"#ff335f";ctx.shadowColor=placementValid?arena.glow:"#ff335f";ctx.shadowBlur=18;ctx.beginPath();ctx.arc(placement.x,placement.y,R,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=placementValid?"#72ff77":"#ff335f";ctx.lineWidth=3;ctx.beginPath();ctx.arc(placement.x,placement.y,R+6,0,Math.PI*2);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.font="bold 10px monospace";ctx.textAlign="center";ctx.fillText(placementValid?"CLICK / SPACE":"INVALID",placement.x,placement.y-24);ctx.restore()};
  const draw=()=>{ctx.clearRect(0,0,W,H);drawArena();if(!shotActive&&!ballInHand&&humanTurn()&&cue().active&&!ended)drawGuide();balls.filter(ball=>ball.active).forEach(drawBall);if(ballInHand&&humanTurn())drawPlacement()};
  const shoot=(angle=aimAngle,shotPower=power,aiCalledPocket=null)=>{if(ended||shotActive||ballInHand||anyMoving()||!cue().active)return;if(legalFirstTarget()==="eight"&&calledPocket===null&&aiCalledPocket===null){setMessage("CALL A POCKET BEFORE SHOOTING THE 8-BALL");updateHud();return}dragging=false;dragDistance=0;setAimLock(false);shotActive=true;shotTarget=legalFirstTarget();breakShot=shots===0;shotCalledPocket=aiCalledPocket??calledPocket;shots++;turnsTaken[current]++;shotPotted=[];scratch=false;firstHit=null;railAfterContact=false;objectBallPotted=false;railContactCount=0;eightPocket=null;spinApplied=false;shotSpinX=spinX;shotSpinY=spinY;const spinMagnitude=Math.min(1,Math.hypot(spinX,spinY)),accuracyDrift=(Math.random()*2-1)*spinMagnitude*.0055;angle+=accuracyDrift;shotDirectionX=Math.cos(angle);shotDirectionY=Math.sin(angle);const speed=5.5+shotPower*.145;cue().vx=shotDirectionX*speed;cue().vy=shotDirectionY*speed;cue().spinX=shotSpinX*1.35;setMessage(`${playerName(current)} SHOT ${shots}${spinMagnitude>.15?` • SPIN ${Math.round(spinMagnitude*100)}%`:""}`);updateHud();sfx("move")};
  const distancePointToSegment=(px,py,x1,y1,x2,y2)=>{const dx=x2-x1,dy=y2-y1,length2=dx*dx+dy*dy;if(!length2)return Math.hypot(px-x1,py-y1);const t=Math.max(0,Math.min(1,((px-x1)*dx+(py-y1)*dy)/length2)),x=x1+t*dx,y=y1+t*dy;return Math.hypot(px-x,py-y)};
  const pathClear=(from,to,ignoredBalls=[])=>balls.every(ball=>!ball.active||ignoredBalls.includes(ball.id)||distancePointToSegment(ball.x,ball.y,from.x,from.y,to.x,to.y)>R*2.05);
  const pathClearance=(from,to,ignoredBalls=[])=>balls.reduce((minimum,ball)=>!ball.active||ignoredBalls.includes(ball.id)?minimum:Math.min(minimum,distancePointToSegment(ball.x,ball.y,from.x,from.y,to.x,to.y)-R*2),120);
  const legalAiTargets=targetType=>balls.filter(ball=>ball.active&&ball.id!==0&&(targetType==="open"?ball.id!==8:targetType==="eight"?ball.id===8:groupOf(ball.id)===targetType));
  const planAiShots=()=>{const targetType=groups[1]?(remaining(groups[1])?groups[1]:"eight"):"open",c=cue(),targets=legalAiTargets(targetType),plans=[];for(const target of targets)for(let pocketIndex=0;pocketIndex<pockets.length;pocketIndex++){const pocket=pockets[pocketIndex],potDistance=Math.hypot(pocket.x-target.x,pocket.y-target.y);if(potDistance<1)continue;const objectX=(pocket.x-target.x)/potDistance,objectY=(pocket.y-target.y)/potDistance,contact={x:target.x-objectX*(R*2+.45),y:target.y-objectY*(R*2+.45)};if(!validCuePlacement(contact.x,contact.y)||!pathClear(c,contact,[0,target.id])||!pathClear(target,pocket,[target.id]))continue;const cueDistance=Math.hypot(contact.x-c.x,contact.y-c.y),shotX=(contact.x-c.x)/cueDistance,shotY=(contact.y-c.y)/cueDistance,cutAngle=Math.acos(Math.max(-1,Math.min(1,shotX*objectX+shotY*objectY)));if(cutAngle>1.38)continue;const clearance=Math.min(pathClearance(c,contact,[0,target.id]),pathClearance(target,pocket,[target.id])),normal=Math.max(0,shotX*objectX+shotY*objectY),tangentX=shotX-objectX*normal,tangentY=shotY-objectY*normal,tangentLength=Math.hypot(tangentX,tangentY),expected={x:contact.x+(tangentLength?tangentX/tangentLength:shotX)*75,y:contact.y+(tangentLength?tangentY/tangentLength:shotY)*75},pocketDistance=Math.min(...pockets.map(item=>Math.hypot(item.x-expected.x,item.y-expected.y))),scratchRisk=Math.max(0,78-pocketDistance)*4,nextTargets=targets.filter(ball=>ball.id!==target.id),nextOptions=nextTargets.filter(ball=>pathClear(expected,ball,[0,target.id,ball.id])).length,positionBonus=(aiLevel==="hard"||aiLevel==="champion")?nextOptions*24:nextOptions*6,score=cueDistance*.52+potDistance*.78+cutAngle*190+scratchRisk-clearance*1.4-positionBonus;plans.push({target,pocket,pocketIndex,contact,cueDistance,potDistance,cutAngle,clearance,scratchRisk,nextOptions,expected,score})}return plans.sort((a,b)=>a.score-b.score)};
  const planSafety=()=>{const targetType=groups[1]?(remaining(groups[1])?groups[1]:"eight"):"open",c=cue(),targets=legalAiTargets(targetType),options=[];for(const target of targets){const dx=target.x-c.x,dy=target.y-c.y,distance=Math.hypot(dx,dy),contact={x:target.x-dx/distance*(R*2+.5),y:target.y-dy/distance*(R*2+.5)};if(pathClear(c,contact,[0,target.id]))options.push({target,contact,distance,score:pathClearance(c,contact,[0,target.id])-distance*.02})}return options.sort((a,b)=>b.score-a.score)[0]||null};
  const aiShoot=()=>{if(ended||current!==1||shotActive||ballInHand)return;const plans=planAiShots(),level=aiLevel;let plan=null,safety=false;if(plans.length){if(level==="easy")plan=plans[Math.floor(Math.random()*Math.min(4,plans.length))];else plan=plans[0];if(level==="champion"&&(plan.cutAngle>.88||plan.scratchRisk>110)){const safe=planSafety();if(safe){plan=safe;safety=true}}else if(level==="normal"&&Math.random()<.1&&plans.length>1)plan=plans.find(item=>item.scratchRisk<plans[0].scratchRisk)||plans[0]}else{plan=planSafety();safety=true}if(!plan)return beginBallInHand();const baseAngle=Math.atan2(plan.contact.y-cue().y,plan.contact.x-cue().x),error={easy:.07,normal:.022,hard:.007,champion:.003}[level]*(Math.random()*2-1),angle=baseAngle+error,aiPower=safety?Math.min(62,Math.max(32,34+plan.distance*.045)):Math.min(94,Math.max(34,32+plan.cueDistance*.055+plan.potDistance*.025));spinX=level==="champion"?(Math.random()-.5)*.25:0;spinY=(level==="hard"||level==="champion")?Math.max(-.35,Math.min(.35,(plan.nextOptions||0)>.5?.18:-.12)):0;drawSpinControl();calledPocket=plan.pocketIndex??null;updateHud();setMessage(`${opponentName()} • ${safety?"SAFETY PLAN":"LEGAL POT LINE"}${plan.nextOptions!=null?` • ${plan.nextOptions} NEXT OPTIONS`:""}`);schedule(()=>shoot(angle,aiPower,plan.pocketIndex??null),650)};
  const spinLabel=()=>{const vertical=spinY>.2?"TOP":spinY<-.2?"BACK":"",horizontal=spinX>.2?"RIGHT":spinX<-.2?"LEFT":"";return[vertical,horizontal].filter(Boolean).join(" + ")||"CENTER"};
  const drawSpinControl=()=>{spinCtx.clearRect(0,0,100,100);const gradient=spinCtx.createRadialGradient(40,35,4,50,50,42);gradient.addColorStop(0,"#fff");gradient.addColorStop(1,"#b9c5dd");spinCtx.fillStyle=gradient;spinCtx.beginPath();spinCtx.arc(50,50,39,0,Math.PI*2);spinCtx.fill();spinCtx.strokeStyle=arena.accent;spinCtx.lineWidth=2;spinCtx.stroke();spinCtx.strokeStyle="#26304b66";spinCtx.lineWidth=1;spinCtx.beginPath();spinCtx.moveTo(11,50);spinCtx.lineTo(89,50);spinCtx.moveTo(50,11);spinCtx.lineTo(50,89);spinCtx.stroke();spinCtx.fillStyle="#10152a";spinCtx.beginPath();spinCtx.arc(50+spinX*34,50-spinY*34,6,0,Math.PI*2);spinCtx.fill();spinCtx.strokeStyle=arena.glow;spinCtx.lineWidth=2;spinCtx.stroke();$("#pool-spin-label").textContent=spinLabel()};
  const setSpinFromEvent=event=>{if(ended||shotActive||ballInHand||!humanTurn())return;const rect=spinCanvas.getBoundingClientRect(),dx=(event.clientX-rect.left)*100/rect.width-50,dy=(event.clientY-rect.top)*100/rect.height-50,length=Math.hypot(dx,dy),scale=length>34?34/length:1;spinX=Math.max(-1,Math.min(1,dx*scale/34));spinY=Math.max(-1,Math.min(1,-dy*scale/34));drawSpinControl()};
  const spinDown=event=>{if(ended||shotActive||ballInHand||!humanTurn())return;event.preventDefault();spinDragging=true;spinCanvas.setPointerCapture?.(event.pointerId);setSpinFromEvent(event)};
  const spinMove=event=>{if(spinDragging)setSpinFromEvent(event)};
  const spinUp=event=>{spinDragging=false;spinCanvas.releasePointerCapture?.(event.pointerId)};
  const pointerPoint=event=>{const rect=canvas.getBoundingClientRect();return{x:(event.clientX-rect.left)*W/rect.width,y:(event.clientY-rect.top)*H/rect.height}};
  const selectCalledPocket=index=>{calledPocket=Number(index);setMessage(`8-BALL POCKET ${calledPocket+1} CALLED`);updateHud()};
  const pointerAim=event=>{if(!humanTurn()||shotActive||ended)return;const point=pointerPoint(event);if(ballInHand){placement=point;placementValid=validCuePlacement(point.x,point.y);setMessage(placementValid?"VALID POSITION • CLICK OR SPACE TO PLACE":"INVALID CUE-BALL POSITION");return}if(aimLocked||dragging)return;setAimAngle(Math.atan2(point.y-cue().y,point.x-cue().x))};
  const pointerDown=event=>{if(!humanTurn()||shotActive||ended||event.button===2)return;event.preventDefault();const point=pointerPoint(event);if(ballInHand){placement=point;placementValid=validCuePlacement(point.x,point.y);if(placementValid)confirmCuePlacement();else setMessage("INVALID POSITION • MOVE AWAY FROM BALLS AND RAILS");return}if(legalFirstTarget()==="eight"){const pocketIndex=pockets.findIndex(pocket=>Math.hypot(point.x-pocket.x,point.y-pocket.y)<38);if(pocketIndex>=0){selectCalledPocket(pocketIndex);return}}if(!aimLocked)setAimAngle(Math.atan2(point.y-cue().y,point.x-cue().x),true);dragging=true;dragStart={x:event.clientX,y:event.clientY};dragDistance=0;canvas.setPointerCapture?.(event.pointerId);setMessage("PULL STRAIGHT BACK • RELEASE TO SHOOT")};
  const pointerDrag=event=>{if(!dragging)return pointerAim(event);const dx=event.clientX-dragStart.x,dy=event.clientY-dragStart.y,pull=-(dx*Math.cos(aimAngle)+dy*Math.sin(aimAngle));dragDistance=Math.max(0,pull);if(dragDistance>2){power=Math.max(10,Math.min(100,Math.round(8+dragDistance*.9)));powerInput.value=power;$("#pool-power-value").textContent=power+"%"}};
  const pointerUp=event=>{if(!dragging)return;dragging=false;canvas.releasePointerCapture?.(event.pointerId);if(dragDistance>=7){const lockedAngle=aimAngle,releasePower=power;dragDistance=0;shoot(lockedAngle,releasePower)}else{dragDistance=0;setAimLock(true);setMessage("AIM LOCKED • FINE-TUNE WITH A/D OR ARROWS");updateHud()}};
  const unlockAim=event=>{event?.preventDefault?.();if(!shotActive&&humanTurn()){dragging=false;dragDistance=0;setAimLock(false);setMessage("AIM FREE • MOVE THE POINTER TO ADJUST");updateHud()}};
  const keyHandler=event=>{if(activeGame!=="billiards"||launchScreenOpen)return;if(event.key==="Escape"&&aimLocked&&!gamePauseOpen){event.preventDefault();event.stopImmediatePropagation();unlockAim();return}if(!event.target?.matches?.("input")&&["ArrowLeft","ArrowRight","KeyA","KeyD"].includes(event.code)&&!ballInHand){event.preventDefault();nudgeAim(["ArrowLeft","KeyA"].includes(event.code)?-1:1,event.shiftKey?1:.25);return}if(event.code==="Space"){event.preventDefault();if(ballInHand)confirmCuePlacement();else if(humanTurn())shoot()}};
  canvas.addEventListener("pointermove",pointerDrag);canvas.addEventListener("pointerdown",pointerDown);canvas.addEventListener("pointerup",pointerUp);canvas.addEventListener("pointercancel",unlockAim);canvas.addEventListener("contextmenu",unlockAim);spinCanvas.addEventListener("pointerdown",spinDown);spinCanvas.addEventListener("pointermove",spinMove);spinCanvas.addEventListener("pointerup",spinUp);spinCanvas.addEventListener("pointercancel",spinUp);powerInput.oninput=()=>{power=Number(powerInput.value);$("#pool-power-value").textContent=power+"%"};nudgeButtons.forEach(button=>button.onclick=()=>nudgeAim(Number(button.dataset.poolNudge)));pocketButtons.forEach(button=>button.onclick=()=>selectCalledPocket(button.dataset.poolPocket));shootButton.onclick=()=>shoot();window.addEventListener("keydown",keyHandler,true);
  const FIXED_STEP=1000/180;
  const loop=now=>{if(ended)return;const dt=Math.min(50,now-last);last=now;if(!gamePauseOpen){if(!aimLocked&&!dragging&&!shotActive){aimAngle=normalizeAngle(aimAngle+angleDelta(aimAngle,aimTargetAngle)*Math.min(1,dt*.022));updateAngleReadout()}const movingBefore=anyMoving();if(movingBefore){accumulator=Math.min(accumulator+dt,FIXED_STEP*10);while(accumulator>=FIXED_STEP){physics(FIXED_STEP);accumulator-=FIXED_STEP}}else accumulator=0;if(shotActive&&movingBefore&&!anyMoving())resolveShot();draw()}raf=requestAnimationFrame(loop)};
  updateHud();drawSpinControl();draw();raf=requestAnimationFrame(loop);setActiveCleanup(()=>{ended=true;cancelAnimationFrame(raf);timeouts.forEach(clearTimeout);window.removeEventListener("keydown",keyHandler,true);canvas.removeEventListener("pointermove",pointerDrag);canvas.removeEventListener("pointerdown",pointerDown);canvas.removeEventListener("pointerup",pointerUp);canvas.removeEventListener("pointercancel",unlockAim);canvas.removeEventListener("contextmenu",unlockAim);spinCanvas.removeEventListener("pointerdown",spinDown);spinCanvas.removeEventListener("pointermove",spinMove);spinCanvas.removeEventListener("pointerup",spinUp);spinCanvas.removeEventListener("pointercancel",spinUp)});
}

function startSnake(launchOptions=null){
  const preselectedMode=typeof launchOptions==="string"?launchOptions:launchOptions?.mode;
  const stats=currentPlayer.gameStats.snake||={plays:0,wins:0,losses:0,draws:0,best:null};stats.modes||={};
  if(["classic","survival","time"].includes(preselectedMode))return beginSnake(preselectedMode);
  setStage(`<div class="arcade-mode-select"><p class="eyebrow">NEON SNAKE PROTOCOL</p><h3>CHOOSE RUN MODE</h3><div class="arcade-mode-grid"><button data-snake-mode="classic"><b>CLASSIC</b><small>Traditional walls, escalating speed and obstacles.</small></button><button data-snake-mode="survival"><b>SURVIVAL</b><small>Faster hazards and aggressive obstacle growth.</small></button><button data-snake-mode="time"><b>TIME ATTACK</b><small>Score as much as possible in 60 seconds.</small></button></div><div class="snake-records">${["classic","survival","time"].map(mode=>`<span>${mode.toUpperCase()}<b>${stats.modes[mode]?.bestScore||0}</b></span>`).join("")}</div></div>`);
  $$('[data-snake-mode]').forEach(button=>button.onclick=()=>beginSnake(button.dataset.snakeMode));
  function beginSnake(mode){
    setStage(`<div class="game-score snake-hud"><span>${mode.toUpperCase()}</span> • SCORE <b id="snake-score">0</b> • COMBO <b id="snake-combo">x1</b> • FOOD <b id="snake-foods">0</b><span id="snake-time"></span></div><div class="canvas-wrap"><canvas id="snake-canvas" class="arcade-canvas" width="400" height="400"></canvas><div id="snake-upgrade" class="arcade-upgrade" hidden></div></div>${directionPad()}<p class="result">Normal, golden and unstable glitch food are active.</p>`);
    const canvas=$("#snake-canvas"),ctx=canvas.getContext("2d"),size=20,cells=20,started=Date.now(),run={slowCurve:0,doubleScore:0,shortGrowth:0,shield:0,magnet:0};
    const upgradeDefs=[{id:"slowCurve",name:"COOLANT",desc:"Speed increases 45% more slowly."},{id:"doubleScore",name:"DOUBLE BITE",desc:"All food score is doubled."},{id:"shortGrowth",name:"COMPACT BODY",desc:"Only every second food grows the body."},{id:"shield",name:"PHASE SHIELD",desc:"Survive one collision."},{id:"magnet",name:"FOOD MAGNET",desc:"Nearby food drifts toward your head."}];
    let snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}],dir={x:1,y:0},next={x:1,y:0},food=null,obstacles=[],score=0,foods=0,combo=0,lastFoodAt=0,ended=false,timer=null,growthToggle=false,nextObstacle=mode==="survival"?10:16,glitchSpeedUntil=0;
    const occupied=(x,y)=>snake.some(p=>p.x===x&&p.y===y)||obstacles.some(p=>p.x===x&&p.y===y);
    const randomCell=()=>{let cell,guard=0;do{cell={x:Math.floor(Math.random()*cells),y:Math.floor(Math.random()*cells)};guard++}while((occupied(cell.x,cell.y)||food&&food.x===cell.x&&food.y===cell.y)&&guard<500);return cell};
    const placeFood=()=>{const roll=Math.random(),type=roll<.7?"normal":roll<.88?"golden":"glitch";food={...randomCell(),type,expires:type==="golden"?Date.now()+5000:0}};
    const delay=()=>{const base=mode==="survival"?105:mode==="time"?118:130,curve=run.slowCurve?.55:1,glitch=Date.now()<glitchSpeedUntil?.72:1;return Math.max(mode==="survival"?48:55,(base-foods*2.4*curve)*glitch)};
    const restart=()=>{clearInterval(timer);if(!ended)timer=setInterval(tick,delay())};
    const addObstacles=()=>{const amount=mode==="survival"?3:2;for(let i=0;i<amount;i++){const cell=randomCell();if(Math.abs(cell.x-snake[0].x)+Math.abs(cell.y-snake[0].y)>4)obstacles.push(cell)}nextObstacle+=mode==="survival"?10:16};
    const updateHud=()=>{$("#snake-score").textContent=score;$("#snake-foods").textContent=foods;$("#snake-combo").textContent=`x${(1+Math.min(2,Math.floor(combo/3)*.25)).toFixed(combo>=3?2:0)}`;const time=$("#snake-time");if(time)time.textContent=mode==="time"?` • TIME ${Math.max(0,60-Math.floor((Date.now()-started)/1000))}`:` • SHIELD ${run.shield}`};
    const draw=()=>{ctx.fillStyle="#050312";ctx.fillRect(0,0,400,400);ctx.strokeStyle="#17103c";for(let i=0;i<cells;i++){ctx.beginPath();ctx.moveTo(i*size,0);ctx.lineTo(i*size,400);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*size);ctx.lineTo(400,i*size);ctx.stroke()}obstacles.forEach(p=>{ctx.fillStyle="#8e5bff";ctx.fillRect(p.x*size+2,p.y*size+2,16,16);ctx.fillStyle="#ff3eb5";ctx.fillRect(p.x*size+6,p.y*size+6,8,8)});if(food){ctx.fillStyle={normal:"#ff3eb5",golden:"#ffe84c",glitch:"#72ff77"}[food.type];ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=food.type==="normal"?5:14;ctx.fillRect(food.x*size+4,food.y*size+4,12,12);if(food.type==="glitch"){ctx.fillStyle="#fff";ctx.fillRect(food.x*size+8,food.y*size+2,4,16)}ctx.shadowBlur=0}snake.forEach((p,i)=>{ctx.fillStyle=i?"#31f5ff":"#ffe84c";ctx.fillRect(p.x*size+2,p.y*size+2,16,16)});if(run.shield){ctx.strokeStyle="#fff";ctx.beginPath();ctx.arc(snake[0].x*size+10,snake[0].y*size+10,13,0,Math.PI*2);ctx.stroke()}};
    const finish=(timed=false)=>{if(ended)return;ended=true;clearInterval(timer);const seconds=Math.round((Date.now()-started)/1000),record=stats.modes[mode]||={bestScore:0,longest:0,mostFood:0};record.bestScore=Math.max(record.bestScore,score);record.longest=Math.max(record.longest,seconds);record.mostFood=Math.max(record.mostFood,foods);stats.modes[mode]=record;$(".result").innerHTML=`${timed?"TIME!":"GAME OVER"} • ${score} SCORE • ${foods} FOOD • ${seconds}s<br>${mode.toUpperCase()} RECORD ${record.bestScore}`;reward(score*2,Math.max(5,score),{result:timed?"win":"loss",score})};
    const shieldCrash=()=>{if(!run.shield)return false;run.shield--;snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];dir={x:1,y:0};next={x:1,y:0};$(".result").textContent="PHASE SHIELD SAVED THE RUN";return true};
    const applyGlitch=()=>{const effects=[()=>{score+=8;$(".result").textContent="GLITCH: BONUS CACHE +8"},()=>{score=Math.max(0,score-5);$(".result").textContent="GLITCH: SCORE CORRUPTED -5"},()=>{snake.splice(Math.max(3,snake.length-3));$(".result").textContent="GLITCH: BODY COMPRESSED"},()=>{glitchSpeedUntil=Date.now()+6000;$(".result").textContent="GLITCH: OVERDRIVE 6s"},()=>{run.shield++;$(".result").textContent="GLITCH: FREE SHIELD"}];effects[Math.floor(Math.random()*effects.length)]()};
    const offerUpgrade=()=>{clearInterval(timer);const host=$("#snake-upgrade"),picks=[...upgradeDefs].sort(()=>Math.random()-.5).slice(0,3);host.hidden=false;host.innerHTML=`<b>RUN UPGRADE • CHOOSE ONE</b>${picks.map(up=>`<button data-snake-up="${up.id}"><strong>${up.name}</strong><small>${up.desc}</small></button>`).join("")}`;host.querySelectorAll("[data-snake-up]").forEach(button=>button.onclick=()=>{const id=button.dataset.snakeUp;if(id==="shield")run.shield++;else run[id]=1;host.hidden=true;restart();updateHud();draw()})};
    const attractFood=()=>{if(!run.magnet||!food)return;const head=snake[0],dx=head.x-food.x,dy=head.y-food.y;if(Math.abs(dx)+Math.abs(dy)>5)return;const candidates=Math.abs(dx)>Math.abs(dy)?[{x:food.x+Math.sign(dx),y:food.y},{x:food.x,y:food.y+Math.sign(dy)}]:[{x:food.x,y:food.y+Math.sign(dy)},{x:food.x+Math.sign(dx),y:food.y}];const nextCell=candidates.find(p=>p.x>=0&&p.y>=0&&p.x<cells&&p.y<cells&&!occupied(p.x,p.y));if(nextCell){food.x=nextCell.x;food.y=nextCell.y}};
    const eat=()=>{const now=Date.now();combo=now-lastFoodAt<4000?combo+1:1;lastFoodAt=now;foods++;const comboMult=1+Math.min(2,Math.floor(combo/3)*.25),base=food.type==="golden"?3:1;score+=Math.round(base*(run.doubleScore?2:1)*comboMult);if(food.type==="glitch")applyGlitch();growthToggle=!growthToggle;const shouldGrow=food.type==="normal"&&(!run.shortGrowth||growthToggle);if(!shouldGrow)snake.pop();placeFood();if(score>=nextObstacle)addObstacles();updateHud();draw();restart();if(foods%5===0)offerUpgrade()};
    const tick=()=>{if(mode==="time"&&Date.now()-started>=60000)return finish(true);if(food?.expires&&Date.now()>food.expires){$(".result").textContent="GOLDEN FOOD EXPIRED";placeFood()}attractFood();dir=next;const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y},collision=head.x<0||head.y<0||head.x>=cells||head.y>=cells||snake.some(p=>p.x===head.x&&p.y===head.y)||obstacles.some(p=>p.x===head.x&&p.y===head.y);if(collision){if(shieldCrash()){updateHud();draw();return}return finish(false)}snake.unshift(head);if(food&&head.x===food.x&&head.y===food.y)eat();else snake.pop();if(Date.now()-lastFoodAt>4000)combo=0;updateHud();draw()};
    const unbind=bindDirections(d=>{const v={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[d];if(v.x!==-dir.x||v.y!==-dir.y)next=v});placeFood();updateHud();draw();restart();setActiveCleanup(()=>{ended=true;clearInterval(timer);unbind()});
  }
}
function startPac(launchOptions={}){
  const layouts=[
    ["###############","#o....#.#....o#","#.##..#.#..##.#","#.............#","#.##.#####.##.#","#....#...#....#","####.#.#.#.####","#.............#","####.#.#.#.####","#....#...#....#","#.##.#####.##.#","#.............#","#.##..#.#..##.#","#o....#.#....o#","###############"],
    ["###############","#o............#","#.#####.#####.#","#.#.........#.#","#.#.###.###.#.#","#...#.....#...#","###.#.###.#.###","#.............#","###.#.###.#.###","#...#.....#...#","#.#.###.###.#.#","#.#.........#.#","#.#####.#####.#","#............o#","###############"],
    ["###############","#o..#.....#..o#","#.#.#.###.#.#.#","#.#...#.#...#.#","#.###.#.#.###.#","#.....#.#.....#","#####.#.#.#####","#.............#","#####.#.#.#####","#.....#.#.....#","#.###.#.#.###.#","#.#...#.#...#.#","#.#.#.###.#.#.#","#...#.....#...#","###############"],
    ["###############","#o....#.#....o#","###.#.#.#.#.###","#...#.....#...#","#.#####.#####.#","#.............#","#.###.###.###.#","#.#.........#.#","#.#.###.###.#.#","#.............#","#.#####.#####.#","#...#.....#...#","###.#.#.#.#.###","#.....#.#.....#","###############"],
    ["###############","#o............#","#.###.###.###.#","#...#.....#...#","###.#.###.#.###","#.....#.#.....#","#.###.#.#.###.#","#.............#","#.###.#.#.###.#","#.....#.#.....#","###.#.###.#.###","#...#.....#...#","#.###.###.###.#","#............o#","###############"]
  ];
  setStage(`<div class="game-score pac-hud">LEVEL <span id="pac-level">1</span>/5 • SCORE <span id="pac-score">0</span> • LIVES <span id="pac-lives">3</span> • POWER <span id="pac-power">—</span></div><div class="canvas-wrap"><canvas id="pac-canvas" class="arcade-canvas" width="450" height="450"></canvas></div>${directionPad()}<p class="result">Clear five neon mazes. Power pellets make every enemy vulnerable for 6 seconds.</p>`);
  const canvas=$("#pac-canvas"),ctx=canvas.getContext("2d"),tile=30,moves=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}],startedAt=performance.now();
  const ghostDefs=[{type:"hunter",color:"#ff3eb5",spawn:{x:13,y:13}},{type:"ambusher",color:"#31f5ff",spawn:{x:13,y:1}},{type:"wanderer",color:"#ff7043",spawn:{x:1,y:13}}];
  let level=1,lives=3,score=0,map=[],dots=0,player={x:1,y:1},dir={x:0,y:0},wanted={x:0,y:0},ghosts=[],mouth=0,powerUntil=0,powerEaten=0,bestPowerEaten=0,fruit=null,nextFruitAt=Date.now()+9000,invulnerableUntil=0,ended=false,timer=null,transitionTimer=null;
  const stats=currentPlayer.gameStats.pac||={plays:0,wins:0,losses:0,draws:0,best:null};
  const can=(p,v)=>map[p.y+v.y]?.[p.x+v.x]!=="#"&&map[p.y+v.y]?.[p.x+v.x]!==undefined;
  const distance=(x,y,target)=>Math.abs(x-target.x)+Math.abs(y-target.y);
  const restartTimer=()=>{clearInterval(timer);timer=setInterval(tick,Math.max(88,170*Math.pow(.91,level-1)))};
  const resetActors=()=>{player={x:1,y:1};dir={x:0,y:0};wanted={x:0,y:0};ghosts=ghostDefs.map(def=>({...def,x:def.spawn.x,y:def.spawn.y,last:{x:0,y:0}}));invulnerableUntil=Date.now()+1800};
  const loadLevel=()=>{map=layouts[(level-1)%layouts.length].map(row=>row.split(""));resetActors();map[player.y][player.x]=" ";ghosts.forEach(g=>{if(map[g.y]?.[g.x]!=="#")map[g.y][g.x]=" "});dots=map.flat().filter(cell=>cell==="."||cell==="o").length;fruit=null;nextFruitAt=Date.now()+8000;$("#pac-level").textContent=level;$("#pac-lives").textContent=lives;restartTimer();draw()};
  const openCells=()=>{const cells=[];for(let y=1;y<14;y++)for(let x=1;x<14;x++)if(map[y][x]!=="#"&&map[y][x]===" ")cells.push({x,y});return cells};
  const spawnFruit=()=>{const cells=openCells().filter(cell=>!ghosts.some(g=>g.x===cell.x&&g.y===cell.y)&&distance(cell.x,cell.y,player)>4);if(cells.length)fruit={...cells[Math.floor(Math.random()*cells.length)],until:Date.now()+6500};nextFruitAt=Date.now()+17000};
  const chooseGhostMove=g=>{let choices=moves.filter(v=>can(g,v));if(choices.length>1)choices=choices.filter(v=>v.x!==-g.last.x||v.y!==-g.last.y);if(!choices.length)return null;let target=player;if(g.type==="ambusher")target={x:player.x+dir.x*4,y:player.y+dir.y*4};if(g.type==="wanderer"&&Math.random()<.72)return choices[Math.floor(Math.random()*choices.length)];choices.sort((a,b)=>distance(g.x+a.x,g.y+a.y,target)-distance(g.x+b.x,g.y+b.y,target));return Math.random()<.82?choices[0]:choices[Math.floor(Math.random()*Math.min(2,choices.length))]};
  const drawGhost=g=>{const vulnerable=Date.now()<powerUntil,x=g.x*tile+15,y=g.y*tile+15;ctx.fillStyle=vulnerable?(Date.now()%350<175?"#365eff":"#f8f4ff"):g.color;ctx.beginPath();ctx.arc(x,y,11,Math.PI,0);ctx.lineTo(x+11,y+12);ctx.lineTo(x+5,y+7);ctx.lineTo(x,y+12);ctx.lineTo(x-5,y+7);ctx.lineTo(x-11,y+12);ctx.closePath();ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(x-6,y-3,4,5);ctx.fillRect(x+2,y-3,4,5)};
  const draw=()=>{ctx.fillStyle="#050312";ctx.fillRect(0,0,450,450);for(let y=0;y<15;y++)for(let x=0;x<15;x++){const cell=map[y][x];if(cell==="#"){ctx.fillStyle=`hsl(${235+level*12} 62% 27%)`;ctx.fillRect(x*tile+2,y*tile+2,tile-4,tile-4);ctx.strokeStyle=level%2?"#31f5ff":"#8e5bff";ctx.strokeRect(x*tile+5,y*tile+5,tile-10,tile-10)}else if(cell==="."||cell==="o"){ctx.fillStyle=cell==="o"?"#ffe84c":"#f8f4ff";const r=cell==="o"?7:2;ctx.beginPath();ctx.arc(x*tile+15,y*tile+15,r,0,Math.PI*2);ctx.fill()}}if(fruit){ctx.fillStyle="#72ff77";ctx.font="22px monospace";ctx.textAlign="center";ctx.fillText("◆",fruit.x*tile+15,fruit.y*tile+22)}const px=player.x*tile+15,py=player.y*tile+15;ctx.fillStyle=Date.now()<invulnerableUntil&&Date.now()%220<110?"#fff":"#ffe84c";ctx.beginPath();const gap=mouth?.28:.08;ctx.arc(px,py,12,gap*Math.PI,(2-gap)*Math.PI);ctx.lineTo(px,py);ctx.fill();ghosts.forEach(drawGhost)};
  const persist=()=>{const survival=Math.round((performance.now()-startedAt)/1000);stats.highestLevel=Math.max(stats.highestLevel||0,level);stats.bestScore=Math.max(stats.bestScore||0,score);stats.longestSurvival=Math.max(stats.longestSurvival||0,survival);stats.mostEnemiesEaten=Math.max(stats.mostEnemiesEaten||0,bestPowerEaten);return survival};
  const finish=won=>{if(ended)return;ended=true;clearInterval(timer);clearTimeout(transitionTimer);const survival=persist();$(".result").innerHTML=`${won?"ALL FIVE MAZES CLEARED! 🏆":"RUN OVER"} • ${score} SCORE • ${survival}s<br>BEST LEVEL ${stats.highestLevel} • BEST SCORE ${stats.bestScore} • BEST POWER COMBO ${stats.mostEnemiesEaten}`;reward(Math.round(score/3)+(won?80:0),Math.max(8,Math.round(score/5)),{result:won?"win":"loss",score})};
  const loseLife=()=>{if(Date.now()<invulnerableUntil)return;lives--;$("#pac-lives").textContent=lives;if(lives<=0)return finish(false);$(".result").textContent=`LIFE LOST • ${lives} REMAINING`;resetActors();draw()};
  const clearLevel=()=>{score+=level*40;if(level>=5)return finish(true);clearInterval(timer);level++;$(".result").textContent=`MAZE CLEAR • LEVEL ${level} ENEMIES +${Math.round((1-Math.pow(.91,level-1))*100)}% SPEED`;transitionTimer=setTimeout(()=>{if(!ended)loadLevel()},1100)};
  const tick=()=>{const now=Date.now();if(can(player,wanted))dir=wanted;if(can(player,dir)){player.x+=dir.x;player.y+=dir.y}const cell=map[player.y][player.x];if(cell==="."||cell==="o"){map[player.y][player.x]=" ";score+=cell==="o"?5:1;dots--;if(cell==="o"){powerUntil=now+6000;powerEaten=0}$("#pac-score").textContent=score;if(!dots)return clearLevel()}if(now>=nextFruitAt&&!fruit)spawnFruit();if(fruit&&now>fruit.until)fruit=null;if(fruit&&player.x===fruit.x&&player.y===fruit.y){score+=50+level*10;fruit=null;$("#pac-score").textContent=score;$(".result").textContent="FRUIT BONUS!"}ghosts.forEach(g=>{const move=chooseGhostMove(g);if(move){g.x+=move.x;g.y+=move.y;g.last=move}});ghosts.forEach(g=>{if(g.x!==player.x||g.y!==player.y)return;if(now<powerUntil){score+=20*(powerEaten+1);powerEaten++;bestPowerEaten=Math.max(bestPowerEaten,powerEaten);g.x=g.spawn.x;g.y=g.spawn.y;$("#pac-score").textContent=score}else loseLife()});if(now>=powerUntil)powerEaten=0;$("#pac-power").textContent=now<powerUntil?`${Math.ceil((powerUntil-now)/1000)}s • ${powerEaten} EATEN`:"—";mouth=1-mouth;draw()};
  const unbind=bindDirections(d=>{wanted={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[d]});loadLevel();setActiveCleanup(()=>{ended=true;clearInterval(timer);clearTimeout(transitionTimer);unbind()});
}
const tdMaps={
  neon:{name:"NEON GRID",description:"Kiegyensúlyozott útvonal, sokféle életképes építési zónával.",difficulty:"NORMAL",theme:"neon",modifier:null,path:[[0,.22],[.17,.22],[.17,.7],[.4,.7],[.4,.32],[.66,.32],[.66,.76],[1,.76]],pads:[]},
  split:{name:"SPLIT CIRCUIT",description:"Két belépési ág osztja meg a védelmet, majd a core előtt egyesülnek.",difficulty:"HARD",theme:"mars",modifier:"dualSpawn",paths:[[[0,.18],[.2,.18],[.2,.42],[.49,.42],[.49,.64],[.76,.64],[.76,.5],[1,.5]],[[0,.82],[.25,.82],[.25,.58],[.49,.58],[.49,.64],[.76,.64],[.76,.5],[1,.5]]],pads:[]},
  frozen:{name:"FROZEN RELAY",description:"Hosszú jeges út. A kriomezők periodikusan lekapcsolják a bennük álló tornyokat.",difficulty:"EXPERT",theme:"frost",modifier:"frozenPads",path:[[0,.16],[.18,.16],[.18,.42],[.38,.42],[.38,.75],[.58,.75],[.58,.28],[.78,.28],[.78,.68],[1,.68]],pads:[],frozenZones:[[.29,.25,.105],[.49,.58,.11],[.69,.48,.105]]}
};
const tdLoadouts={
  standard:{name:"STANDARD",description:"210 kredit, 20 core-élet, minden torony elérhető.",credits:210,lives:20,locked:[],abilityRegen:1},
  engineer:{name:"ENGINEER",description:"250 kredit, de a Cannon és Tesla a menet elején zárolt.",credits:250,lives:20,locked:["cannon","tesla"],abilityRegen:1},
  overclock:{name:"OVERCLOCK",description:"Gyorsabb képességtöltés, de csak 15 core-élet.",credits:210,lives:15,locked:[],abilityRegen:1.28}
};
const tdRankValue={D:1,C:2,B:3,A:4,S:5};
const tdContractDefs=[
  {id:"neon-clear",name:"GRID STABILIZED",description:"Teljesítsd a Neon Grid pályát.",xp:60,test:c=>c.mapId==="neon"&&c.secured},
  {id:"split-clear",name:"TWO FRONTS",description:"Teljesítsd a Split Circuit pályát.",xp:80,test:c=>c.mapId==="split"&&c.secured},
  {id:"frozen-clear",name:"COLD BOOT",description:"Teljesítsd a Frozen Relay pályát.",xp:110,test:c=>c.mapId==="frozen"&&c.secured},
  {id:"flawless-10",name:"PERFECT FIREWALL",description:"Érj el legalább 10 flawless hullámot.",xp:90,test:c=>c.flawless>=10},
  {id:"boss-hunter",name:"TITAN BREAKER",description:"Győzz le legalább 3 bosst egy menetben.",xp:75,test:c=>c.bosses>=3},
  {id:"endless-5",name:"NO EXIT",description:"Juss el öt extra Endless hullámig.",xp:120,test:c=>c.endless>=5}
];
function ensureTdProgress(player=currentPlayer){
  if(!player)return null;
  const progress=player.tdProgress||={xp:0,level:1,unlockedMaps:["neon"],unlockedLoadouts:["standard"],completedContracts:[],bestScores:{}};
  progress.xp=Math.max(0,Number(progress.xp)||0);progress.level=Math.max(1,1+Math.floor(progress.xp/180));progress.unlockedMaps ||= ["neon"];progress.unlockedLoadouts ||= ["standard"];progress.completedContracts ||= [];progress.bestScores ||= {};
  const add=(list,id)=>{if(!list.includes(id))list.push(id)};
  add(progress.unlockedMaps,"neon");add(progress.unlockedLoadouts,"standard");
  if(progress.level>=2)add(progress.unlockedMaps,"split");
  if(progress.level>=3)add(progress.unlockedLoadouts,"engineer");
  if(progress.level>=6)add(progress.unlockedLoadouts,"overclock");
  progress.endlessUnlocked=progress.level>=5;progress.bossRushUnlocked=progress.level>=10;
  if(progress.level>=7)add(progress.unlockedMaps,"frozen");
  return progress;
}
function startTowerDefense(options=null){
  const progress=ensureTdProgress();
  if(!options){
    const records=progress.bestScores||{};
    setStage(`<section class="td-map-select"><header><small>DEFENSE NETWORK // MASTERY LVL ${progress.level}</small><h2>SELECT DEFENSE SECTOR</h2><p>TD XP ${progress.xp} • Következő szint ${progress.level*180} XP</p><i><u style="width:${progress.xp%180/180*100}%"></u></i></header><div class="td-map-grid">${Object.entries(tdMaps).map(([id,map])=>{const locked=!progress.unlockedMaps.includes(id),r=records[id]||{};return `<button data-td-map="${id}" ${locked?"disabled":""} style="--map-accent:${map.theme==="frost"?"#bcecff":map.theme==="mars"?"#ff8a55":"#31f5ff"}"><span>${locked?"LOCKED":map.difficulty}</span><b>${map.name}</b><small>${map.description}</small><em>${locked?`Feloldás: LVL ${id==="split"?2:7}`:`LEGJOBB ${r.rank||"—"} • ${r.score||0} PONT • WAVE ${r.highestWave||0} • ENDLESS ${r.bestEndless||0}`}</em></button>`}).join("")}</div><div class="td-setup-row"><label>KEZDŐCSOMAG<select id="td-loadout-select">${Object.entries(tdLoadouts).map(([id,l])=>`<option value="${id}" ${progress.unlockedLoadouts.includes(id)?"": "disabled"}>${l.name}${progress.unlockedLoadouts.includes(id)?"":` • LVL ${id==="engineer"?3:6}`}</option>`).join("")}</select></label><label>NEHÉZSÉG<select id="td-difficulty-select"><option value="normal">NORMAL • XP x1</option><option value="hard">HARD • XP x1.35</option><option value="nightmare">NIGHTMARE • XP x1.7</option></select></label><label>JÁTÉKMÓD<select id="td-mode-select"><option value="campaign">15 WAVE CAMPAIGN</option><option value="endless" ${progress.endlessUnlocked?"":"disabled"}>ENDLESS START • ${progress.endlessUnlocked?"UNLOCKED":"LVL 5"}</option><option value="bossrush" ${progress.bossRushUnlocked?"":"disabled"}>BOSS RUSH • ${progress.bossRushUnlocked?"UNLOCKED":"LVL 10"}</option></select></label></div><section class="td-mastery-panels"><article><b>UNLOCK ROADMAP</b><span class="${progress.level>=2?"done":""}">${progress.level>=2?"✓":"◇"} LVL 2 • SPLIT CIRCUIT</span><span class="${progress.level>=3?"done":""}">${progress.level>=3?"✓":"◇"} LVL 3 • ENGINEER LOADOUT</span><span class="${progress.level>=5?"done":""}">${progress.level>=5?"✓":"◇"} LVL 5 • ENDLESS</span><span class="${progress.level>=7?"done":""}">${progress.level>=7?"✓":"◇"} LVL 7 • FROZEN RELAY</span><span class="${progress.level>=10?"done":""}">${progress.level>=10?"✓":"◇"} LVL 10 • BOSS RUSH</span></article><article><b>DEFENSE CONTRACTS</b>${tdContractDefs.map(c=>`<span class="${progress.completedContracts.includes(c.id)?"done":""}">${progress.completedContracts.includes(c.id)?"✓":"◇"} ${c.name} • ${c.xp} XP</span>`).join("")}</article></section><p class="td-select-help">A pálya, a loadout és a nehézség sidegrade döntés: nincs állandó sebzésbónusz.</p></section>`);
    $$('[data-td-map]').forEach(button=>button.onclick=()=>startTowerDefense({mapId:button.dataset.tdMap,loadoutId:$("#td-loadout-select").value,difficulty:$("#td-difficulty-select").value,mode:$("#td-mode-select").value}));
    return;
  }
  const mapId=tdMaps[options.mapId]?options.mapId:"neon",mapData=tdMaps[mapId],loadoutId=tdLoadouts[options.loadoutId]?options.loadoutId:"standard",loadout=tdLoadouts[loadoutId],mode=["campaign","endless","bossrush"].includes(options.mode)?options.mode:"campaign",difficulty=options.difficulty||"normal",difficultyRules={normal:{hp:1,speed:1,xp:1},hard:{hp:1.2,speed:1.08,xp:1.35},nightmare:{hp:1.48,speed:1.14,xp:1.7}}[difficulty]||{hp:1,speed:1,xp:1};
  let canvas,ctx,raf=0,last=0,wave=0,lives=loadout.lives,credits=loadout.credits,score=0,running=true,paused=false,speed=1,waveActive=false,spawnLeft=0,spawnTimer=0,selected="pulse",selectedPad=null,hoverPad=null,prepDeadline=Date.now()+15000,currentMod=null,pendingChoice=false,orbitalAim=false,bossIntro=0,edgeFlash=0,coreShake=0,alarmClock=0,momentum=1,momentumHeat=0,lastKill=0,bestMomentum=1,flawless=true,mapTheme=mapData.theme,mapVariant=0,selectionRefresh=0,endless=mode==="endless",endlessStreak=0,securedScore=0,securedWave=mode==="endless"?0:15,frozenClock=0;
  let maxWaves=mode==="bossrush"?10:endless?Infinity:15;
  const towers=[],enemies=[],effects=[],particles=[],floaters=[];
  const engine={limits:{effects:420,particles:640,floaters:240},dropped:{effects:0,particles:0,floaters:0},audioGate:{},pressure:0};
  const pushBounded=(name,item)=>{const pool={effects,particles,floaters}[name],limit=engine.limits[name];if(pool.length>=limit){engine.dropped[name]++;return false}pool.push(item);return true};
  const addEffect=item=>pushBounded("effects",item),addParticle=item=>pushBounded("particles",item),addFloater=item=>pushBounded("floaters",item);
  const stats={kills:0,flawless:0,bosses:0,waves:0},run={fireRate:1,credit:1,build:1,teslaChain:0,cannonSplash:1,frostSlow:1,abilityRegen:loadout.abilityRegen};
  const abilities={emp:{charge:35,regen:4.2},orbital:{charge:0,regen:3.1},overclock:{charge:15,regen:3.6}},timers={emp:0,overclock:0,disrupt:0};
  const types={pulse:{name:"PULSE",role:"BALANCED",cost:45,range:.28,rate:.64,damage:19,color:"#31f5ff",branches:["OVERCHARGE","WIDE PULSE"]},rapid:{name:"RAPID",role:"FAST FIRE",cost:70,range:.235,rate:.25,damage:11,color:"#ffe84c",branches:["MINIGUN","ARMOR PIERCER"]},frost:{name:"FROST",role:"SLOW FIELD",cost:85,range:.3,rate:.86,damage:12,color:"#8e5bff",slow:.52,branches:["DEEP FREEZE","CRYO BURST"]},cannon:{name:"CANNON",role:"SPLASH DAMAGE",cost:110,range:.29,rate:1.3,damage:54,color:"#ff7043",splash:.085,branches:["SIEGE SHELL","CLUSTER BOMB"]},tesla:{name:"TESLA",role:"CHAIN LIGHTNING",cost:125,range:.265,rate:.74,damage:25,color:"#72ff77",chain:3,branches:["STORM COIL","OVERLOAD"]},support:{name:"BEACON",role:"+14% DMG • +15% RANGE • +18% RATE",cost:100,range:.22,rate:99,damage:0,color:"#72ff77",support:true,branches:["RANGE ARRAY","TURBO LINK"]}};
  const paths=(mapData.paths||[mapData.path]).map(route=>route.map(point=>[...point])),path=paths[0],pads=(mapData.pads||[]).map(point=>[...point]),grid={cols:320,rows:200,towerRadius:.045,roadHalfWidth:.0475,safetyGap:.006};
  const enemyTypes=[{name:"DRONE",color:"#ff3eb5",hp:1,speed:1,reward:1,leak:1},{name:"RUNNER",color:"#ffe84c",hp:.7,speed:1.6,reward:1.2,leak:1},{name:"TANK",color:"#ff7043",hp:2.6,speed:.62,reward:2,leak:3},{name:"SHIELD",color:"#8e5bff",hp:1.55,speed:.86,reward:1.6,leak:2,armor:.28},{name:"REGENERATOR",color:"#72ff77",hp:1.8,speed:.78,reward:2.1,leak:2,regen:.025},{name:"EMP WALKER",color:"#31f5ff",hp:2.2,speed:.68,reward:2.4,leak:3,emp:true},{name:"CARRIER",color:"#ff8bd1",hp:3.1,speed:.55,reward:3,leak:3},{name:"NEON BEHEMOTH",color:"#fff",hp:13,speed:.4,reward:12,leak:10,armor:.38,boss:true},{name:"EMP COLOSSUS",color:"#31f5ff",hp:16,speed:.34,reward:15,leak:12,armor:.3,boss:true,emp:true}];
  const mods=[{id:"swarm",name:"SWARM",desc:"ENEMIES +45% • HP -28%",reward:1.15,count:1.45,hp:.72},{id:"armored",name:"ARMORED",desc:"ENEMY ARMOR +18%",reward:1.22,armor:.18},{id:"overclocked",name:"OVERCLOCKED",desc:"ENEMY SPEED +22%",reward:1.22,speed:1.22},{id:"blackout",name:"BLACKOUT",desc:"TOWER RANGE -15%",reward:1.25,range:.85},{id:"rich",name:"RICH TARGETS",desc:"HP +18% • REWARD +42%",reward:1.42,hp:1.18}];
  const upgrades=[{name:"OVERCLOCK",desc:"Minden torony +15% tűzgyorsaság",apply:()=>run.fireRate*=1.15},{name:"SALVAGE NETWORK",desc:"Az ellenfelek +20% kreditet adnak",apply:()=>run.credit*=1.2},{name:"CORE PATCH",desc:"A core visszakap 4 életet",apply:()=>lives=Math.min(loadout.lives,lives+4)},{name:"STORM RELAY",desc:"A Tesla +1 lánccélt kap",apply:()=>run.teslaChain++},{name:"HEAVY ORDNANCE",desc:"A Cannon robbanása +35%",apply:()=>run.cannonSplash*=1.35},{name:"PERMAFROST",desc:"A Frost lassítása +20%",apply:()=>run.frostSlow*=.8},{name:"FIELD LOGISTICS",desc:"Toronyépítés 15%-kal olcsóbb",apply:()=>run.build*=.85}];
  const pointAt=(t,pathIndex=0)=>{const route=paths[pathIndex]||path,q=Math.max(0,Math.min(.9999,t))*(route.length-1),i=Math.floor(q),f=q-i,a=route[i],b=route[i+1];return{x:(a[0]+(b[0]-a[0])*f)*canvas.width,y:(a[1]+(b[1]-a[1])*f)*canvas.height}};
  const enemyPoint=e=>pointAt(e.t,e.pathIndex||0);
  const endlessIndex=()=>Math.max(0,wave-securedWave);
  const endlessScale=()=>{const index=endlessIndex();return{hp:1+index*.13+Math.pow(index,1.18)*.015,speed:Math.min(1.65,1+index*.018)}};
  const scoreMultiplier=()=>endless?1+Math.min(endlessIndex(),endlessStreak)*.13+Math.pow(Math.min(endlessIndex(),endlessStreak),1.15)*.012:1;
  const towerOnPad=i=>towers.find(t=>t.pad===i);
  const beaconAuraRange=t=>types.support.range*(1+(t.level-1)*.1)*(t.branch===0?1.35:1);
  const targetSorters={first:(a,b)=>b.t-a.t,last:(a,b)=>a.t-b.t,strong:(a,b)=>b.hp-a.hp,fast:(a,b)=>(b.speed*b.slow)-(a.speed*a.slow)};
  const bestTarget=(targets,priority="first")=>{const compare=targetSorters[priority]||targetSorters.first,best=targets.reduce((winner,target)=>!winner||compare(target,winner)<0?target:winner,null);return best};
  const rankedTargets=(targets,priority="first",limit=1)=>{if(limit<=1){const target=bestTarget(targets,priority);return target?[target]:[]}const compare=targetSorters[priority]||targetSorters.first,pool=[...targets],ranked=[];while(pool.length&&ranked.length<limit){let bestIndex=0;for(let i=1;i<pool.length;i++)if(compare(pool[i],pool[bestIndex])<0)bestIndex=i;ranked.push(pool.splice(bestIndex,1)[0])}return ranked};
  const branchDescriptions={pulse:["+80% damage • 20% slower firing","8% splash radius • -10% direct damage"],rapid:["Heat provides up to +60% fire rate","Ignores 65% of enemy armor"],frost:["Enemy speed reduced to 28%","Every fifth hit freezes for 0.8 seconds"],cannon:["+70% damage • -25% splash radius","+60% splash radius • -20% direct damage"],tesla:["+2 chain targets","Final chain deals double damage"],support:["+35% aura range","Additional +25% fire-rate boost"]};
  const towerStat=t=>{
    const b={...types[t.type]},boost=1+(t.level-1)*.35,linkedBeacons=towers.filter(s=>s.type==="support"&&!s.disabled&&s!==t&&Math.hypot(pads[s.pad][0]-pads[t.pad][0],pads[s.pad][1]-pads[t.pad][1])<beaconAuraRange(s)),beaconBoost=linkedBeacons.reduce((sum,s)=>sum+1+(s.level-1)*.35,0),beaconDamageBoost=linkedBeacons.reduce((sum,s)=>sum+(1+(s.level-1)*.35)*.14,0),beaconRangeBoost=linkedBeacons.reduce((sum,s)=>sum+(1+(s.level-1)*.35)*.15,0),beaconRateBoost=Math.min(.95,linkedBeacons.reduce((sum,s)=>sum+(1+(s.level-1)*.35)*.18+(s.branch===1?.25:0),0));
    if(t.type==="support"&&t.branch===0)b.range*=1.35;
    let damage=b.damage*boost*(1+beaconDamageBoost),range=b.range*(1+(t.level-1)*.1)*(1+beaconRangeBoost)*(currentMod?.range||1),rate=b.rate/(1+(t.level-1)*.18)/(1+beaconRateBoost)/run.fireRate/(timers.overclock>0?1.7:1)*(timers.disrupt>0?1.35:1)/(t.type==="rapid"?1+(t.heat||0)*(t.branch===0?.6:.35):1);
    if(t.type==="pulse"&&t.branch===0){damage*=1.8;rate*=1.2}
    if(t.type==="pulse"&&t.branch===1){b.splash=.08;damage*=.9}
    if(t.type==="rapid"&&t.branch===1)b.armorPierce=.65;
    if(t.type==="frost")b.slow=(t.branch===0?.28:b.slow)*run.frostSlow;
    if(t.type==="cannon"){b.splash*=run.cannonSplash;if(t.branch===0){damage*=1.7;b.splash*=.75}if(t.branch===1){damage*=.8;b.splash*=1.6}}
    if(t.type==="tesla"){b.chain+=run.teslaChain;if(t.branch===0)b.chain+=2}
    rate=Math.max(.05,rate);
    return{...b,damage,range,rate,isSupport:!!b.support,beaconBoost,beaconRateBoost};
  };
  const tone=(type,accent=false)=>{try{const now=performance.now(),gap=accent?35:type==="rapid"?55:32;if(now-(engine.audioGate[type]||0)<gap)return;engine.audioGate[type]=now;const A=window.AudioContext||window.webkitAudioContext,a=startTowerDefense.audio||(startTowerDefense.audio=new A()),o=a.createOscillator(),g=a.createGain(),f={pulse:520,rapid:760,frost:270,cannon:90,tesla:1150,support:400}[type]||220;o.type=type==="cannon"?"square":type==="tesla"?"sawtooth":"triangle";o.frequency.setValueAtTime(f*(accent?1.35:1),a.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(45,f*.55),a.currentTime+.09);g.gain.setValueAtTime(.035,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.11);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.12)}catch(e){}}
  const burst=(x,y,color,n=9)=>{for(let i=0;i<n;i++)addParticle({x,y,vx:(Math.random()-.5)*90,vy:(Math.random()-.5)*90,life:.45,color,size:2+Math.random()*4})};
  const label=(e,text,color="#fff",big=false)=>{const p=enemyPoint(e);addFloater({x:p.x,y:p.y-12,text,color,life:.7,big})};
  const bumpMomentum=(amount)=>{momentumHeat=Math.min(100,momentumHeat+amount);momentum=Math.max(1,Math.min(8,1+Math.floor(momentumHeat/16)));bestMomentum=Math.max(bestMomentum,momentum)};
  const updateHud=()=>{[["#td-wave",`${wave}/${endless?"∞":maxWaves}`],["#td-lives",lives],["#td-credit",credits],["#td-score",endless?`${score} • x${scoreMultiplier().toFixed(1)}`:score],["#td-momentum",`x${momentum}`]].forEach(([s,v])=>{const e=$(s);if(e)e.textContent=v});const fill=$("#td-core-fill");if(fill)fill.style.width=`${Math.max(0,lives/loadout.lives*100)}%`;const mf=$("#td-momentum-fill");if(mf)mf.style.width=`${momentumHeat}%`;const mapStatus=$("#td-map-status");if(mapStatus){mapStatus.textContent=mapStatusText();mapStatus.classList.toggle("danger",mapData.modifier==="frozenPads"&&frozenActive())}Object.keys(abilities).forEach(k=>{const b=$(`[data-ability="${k}"]`);if(b){b.disabled=abilities[k].charge<100||pendingChoice;b.querySelector("i").style.width=`${abilities[k].charge}%`}})};
  const towerExplain=t=>{const power=1+(t.level-1)*.35,branch=t.branch==null?null:types[t.type].branches[t.branch];return{pulse:branch?`${branch}: ${branchDescriptions.pulse[t.branch]}.`:"Reliable energy bolts. Choose damage or area control at Level 3.",rapid:`Builds heat while continuously firing. Current heat: ${Math.round((t.heat||0)*100)}% — up to ${t.branch===0?60:35}% faster.`,frost:`Every hit slows enemies to ${Math.round((1-towerStat(t).slow)*100)}% movement speed.${t.branch===1?" Every fifth hit triggers Cryo Burst.":""}`,cannon:`Heavy shells damage nearby enemies inside a ${Math.round((towerStat(t).splash||0)*100)}% blast zone.`,tesla:`Lightning attacks up to ${towerStat(t).chain} targets.${t.branch===1?" The final chain deals double chain damage.":""}`,support:`Aura boosts linked towers: +${Math.round(power*14)}% damage, +${Math.round(power*15)}% range and +${Math.round(power*18+(t.branch===1?25:0))}% fire rate.`}[t.type]};
  const updateSelection=()=>{
    const h=$("#td-selection");if(!h)return;const t=selectedPad!=null?towerOnPad(selectedPad):null;
    if(!t&&!selected){h.innerHTML=`<span>INSPECT MODE</span><b>EMPTY HAND</b><small>Click any placed tower to inspect its current level, DPS, range, buffs and special behavior.</small><em>Press 1–6 or choose a tower card to return to build mode.</em>`;return}
    if(!t){const d=types[selected],cost=Math.round(d.cost*run.build);h.innerHTML=`<span>PLACE A TOWER</span><b>${d.name} • ${cost} ●</b><small><strong>${d.role}</strong> • Damage ${d.damage} • Level 1 range ${Math.round(d.range*100)}%</small><em>Move over the grid to preview its full range. Click once to build.</em>`;return}
    const d=towerStat(t),isSupport=t.type==="support",up=Math.round(types[t.type].cost*(.7+t.level*.45)),sell=Math.round(t.spent*.65),dps=isSupport?0:d.damage/d.rate,boost=d.beaconBoost?` • Beacon boost x${d.beaconBoost.toFixed(1)}`:"",status=t.disabled?" • OFFLINE: CRYO FIELD":"",specialization=t.branch==null?"":types[t.type].branches[t.branch];
    h.innerHTML=`<span>SELECTED TOWER • LIVE STATS</span><b>${d.name} • LEVEL ${t.level}${status}</b>${specialization?`<small class="td-specialization">SPECIALIZATION: <strong>${specialization}</strong></small>`:""}<section class="td-stat-grid"><i><small>DAMAGE</small><strong>${isSupport?"—":Math.round(d.damage)}</strong></i><i><small>${isSupport?"AURA RANGE":"RANGE"}</small><strong>${Math.round(d.range*100)}%</strong></i><i><small>FIRE RATE</small><strong>${isSupport?"PASSIVE":`${(1/d.rate).toFixed(2)}/s`}</strong></i><i><small>EST. DPS</small><strong>${isSupport?"BOOST":Math.round(dps)}</strong></i></section><small>${isSupport?`Linked towers ${towers.filter(o=>o!==t&&o.type!=="support"&&Math.hypot(pads[o.pad][0]-pads[t.pad][0],pads[o.pad][1]-pads[t.pad][1])<beaconAuraRange(t)).length}`:`Kills ${t.kills} • Total damage ${Math.round(t.totalDamage)}`}${boost}</small>${isSupport?"":`<section class="td-targeting"><b>TARGETING: ${(t.priority||"first").toUpperCase()}</b><div>${["first","last","strong","fast"].map(priority=>`<button data-priority="${priority}" class="${(t.priority||"first")===priority?"active":""}">${priority.toUpperCase()}</button>`).join("")}</div></section>`}<em>${towerExplain(t)}</em><div><button id="td-upgrade" ${t.level>=3||credits<up?"disabled":""}>${t.level>=3?"MAX LEVEL":t.level===2?`SPECIALIZE • ${up} ●`:`UPGRADE • ${up} ●`}</button><button id="td-sell">SELL • ${sell} ●</button></div>`;
    h.querySelectorAll("[data-priority]").forEach(button=>button.onclick=()=>{t.priority=button.dataset.priority;updateSelection()});
    $("#td-upgrade")?.addEventListener("click",()=>{if(t.level===2)return showSpecialization(t,up);credits-=up;t.spent+=up;t.level++;updateHud();updateSelection()});
    $("#td-sell")?.addEventListener("click",()=>{credits+=sell;towers.splice(towers.indexOf(t),1);selectedPad=null;updateHud();updateSelection()});
  };
  function showSpecialization(t,cost){
    const h=$("#td-choice"),definition=types[t.type];if(!h)return;pendingChoice=true;paused=true;h.hidden=false;h.className="td-choice td-specialization-choice";h.innerHTML=`<header>SELECT ${definition.name} SPECIALIZATION</header>${definition.branches.map((name,index)=>`<button data-branch="${index}"><b>${name}</b><small>${branchDescriptions[t.type][index]}</small></button>`).join("")}`;
    h.querySelectorAll("[data-branch]").forEach(button=>button.onclick=()=>{const branch=Number(button.dataset.branch);credits-=cost;t.spent+=cost;t.level=3;t.branch=branch;h.hidden=true;h.className="td-choice";pendingChoice=false;paused=false;updateHud();updateSelection();updatePreview();toast(`${definition.branches[branch]} SPECIALIZATION ONLINE`)});
  }
  const waveIntel=n=>{const chosen=[mods[(n*7+3)%mods.length]],isEndless=n>securedWave||endless;if(isEndless)chosen.push(mods[(n*11+1)%mods.length]);const mod=chosen.reduce((out,item)=>({name:[out.name,item.name].filter(Boolean).join(" + "),desc:[out.desc,item.desc].filter(Boolean).join(" • "),reward:(out.reward||1)*(item.reward||1),count:(out.count||1)*(item.count||1),hp:(out.hp||1)*(item.hp||1),speed:(out.speed||1)*(item.speed||1),armor:(out.armor||0)+(item.armor||0),range:(out.range||1)*(item.range||1)}),{}),base=8+n*2+((mode==="bossrush"||n%5===0)?1:0);return{count:Math.round(base*(mod.count||1)),boss:mode==="bossrush"||n%5===0,mod,mods:chosen}};
  const render=()=>{setStage(`<div class="td-shell"><header class="td-hud"><span>WAVE<b id="td-wave">0/${maxWaves}</b></span><span>CORE<b id="td-lives">${lives}</b></span><span>CREDITS<b id="td-credit">${credits}</b></span><span>SCORE<b id="td-score">0</b></span><span class="td-momentum">DEFENSE MOMENTUM<b id="td-momentum">x1</b><i><u id="td-momentum-fill"></u></i></span></header><div id="td-core" class="td-core"><span>${mapData.name} CORE INTEGRITY</span><i><u id="td-core-fill"></u></i></div><div class="td-board"><canvas id="td-canvas"></canvas><div id="td-preview" class="td-wave-preview"></div><div id="td-map-status" class="td-map-status"></div><div id="td-boss-intro" class="td-boss-intro">⚠ BOSS SIGNAL<br><b>HEAVY CONTACT INBOUND</b></div><div id="td-boss-bar" class="td-boss-bar" hidden><b>BOSS CORE SIGNATURE</b><span><i></i></span></div><div id="td-edge" class="td-danger-edge"></div></div><section class="td-abilities"><button data-ability="emp">⚡ EMP PULSE<i></i></button><button data-ability="orbital">◎ ORBITAL STRIKE<i></i></button><button data-ability="overclock">» EMERGENCY OVERCLOCK<i></i></button></section><section class="td-command"><div class="td-tower-shop">${Object.entries(types).map(([id,t],i)=>{const locked=loadout.locked.includes(id);return `<button class="${i&&!locked?"":locked?"locked":"active"}" data-td-tower="${id}" style="--tower:${t.color}" ${locked?"disabled":""}><i></i><span><b>${t.name}</b><small>${locked?"LOADOUT LOCKED":`${t.role} • ${t.cost} ●`}</small></span></button>`}).join("")}</div><aside id="td-selection" class="td-selection"></aside><div class="td-wave-controls"><button id="td-pause">Ⅱ PAUSE</button><button id="td-speed">1× SPEED</button><button id="td-start" class="pixel-btn primary">LAUNCH WAVE 1</button></div></section><div id="td-choice" class="td-choice" hidden></div></div>`);canvas=$("#td-canvas");ctx=canvas.getContext("2d");$$('[data-td-tower]:not(:disabled)').forEach(b=>b.onclick=()=>{$$('[data-td-tower]').forEach(x=>x.classList.toggle("active",x===b));selected=b.dataset.tdTower;selectedPad=null;updateSelection()});$("#td-start").onclick=startWave;$("#td-pause").onclick=()=>{paused=!paused;$("#td-pause").textContent=paused?"▶ RESUME":"Ⅱ PAUSE"};$("#td-speed").onclick=()=>{speed=speed===1?2:1;$("#td-speed").textContent=`${speed}× SPEED`};$$('[data-ability]').forEach(b=>b.onclick=()=>useAbility(b.dataset.ability));canvas.addEventListener("pointerdown",boardClick);resize();updateSelection();updateHud()};
  const resize=()=>{const r=canvas.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);canvas.width=Math.max(320,r.width*d);canvas.height=Math.max(220,r.height*d)};
  const distanceToPath=(x,y)=>Math.min(...paths.flatMap(route=>route.slice(0,-1).map((a,i)=>{const b=route[i+1],vx=b[0]-a[0],vy=b[1]-a[1],q=Math.max(0,Math.min(1,((x-a[0])*vx+(y-a[1])*vy)/(vx*vx+vy*vy))),px=a[0]+vx*q,py=a[1]+vy*q;return Math.hypot(x-px,y-py)})));
  const distanceToPathPx=(x,y)=>Math.min(...paths.flatMap(route=>route.slice(0,-1).map((a,i)=>{const ax=a[0]*canvas.width,ay=a[1]*canvas.height,b=route[i+1],bx=b[0]*canvas.width,by=b[1]*canvas.height,vx=bx-ax,vy=by-ay,q=Math.max(0,Math.min(1,((x-ax)*vx+(y-ay)*vy)/(vx*vx+vy*vy))),px=ax+vx*q,py=ay+vy*q;return Math.hypot(x-px,y-py)})));
  const frozenActive=()=>mapData.modifier==="frozenPads"&&Math.sin(frozenClock*.72)>-.12;
  const isFrozenTower=t=>frozenActive()&&(mapData.frozenZones||[]).some(([x,y,r])=>Math.hypot(pads[t.pad][0]-x,pads[t.pad][1]-y)<r);
  const mapStatusText=()=>{if(mapData.modifier==="dualSpawn"){const lanes=paths.map((_,i)=>enemies.filter(e=>(e.pathIndex||0)===i).length);return `DUAL ROUTE • LANE A ${lanes[0]||0} • LANE B ${lanes[1]||0}`}if(mapData.modifier==="frozenPads"){const offline=towers.filter(t=>t.disabled).length;return frozenActive()?`CRYO SURGE ACTIVE • ${offline} TOWER${offline===1?"":"S"} OFFLINE`:`CRYO RECOVERY WINDOW • ALL TOWERS ONLINE`}if(endless)return `ENDLESS RISK • BANKED ${securedScore} • AT RISK ${Math.max(0,score-securedScore)}`;return "TACTICAL GRID STABLE • NO SECTOR HAZARD"};
  const gridPoint=(nx,ny)=>{const x=Math.round(nx*grid.cols)/grid.cols,y=Math.round(ny*grid.rows)/grid.rows,u=Math.min(canvas.width,canvas.height),radius=Math.max(13,u*grid.towerRadius),px=x*canvas.width,py=y*canvas.height,roadClearance=Math.max(14,u*grid.roadHalfWidth)+radius+u*grid.safetyGap,towerClearance=radius*2+u*grid.safetyGap,occupied=towers.some(t=>Math.hypot(pads[t.pad][0]*canvas.width-px,pads[t.pad][1]*canvas.height-py)<towerClearance),inside=px>radius&&px<canvas.width-radius&&py>radius&&py<canvas.height-radius,valid=inside&&distanceToPathPx(px,py)>roadClearance&&!occupied;return{x,y,valid,radius,roadClearance,towerClearance}};
  function boardClick(e){const r=canvas.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width,ny=(e.clientY-r.top)/r.height;if(orbitalAim){orbitalAim=false;abilities.orbital.charge=0;const x=nx*canvas.width,y=ny*canvas.height;addEffect({type:"orbital",x,y,life:.8});enemies.forEach(q=>{const p=enemyPoint(q);if(Math.hypot(p.x-x,p.y-y)<Math.min(canvas.width,canvas.height)*.16){q.hp-=180;q.lastTower=null;q.flash=.15;label(q,"ORBITAL","#ffe84c",true)}});tone("cannon",true);updateHud();return}const hit=towers.map(t=>({t,d:Math.hypot((pads[t.pad][0]-nx)*(r.width/r.height),pads[t.pad][1]-ny)})).sort((a,b)=>a.d-b.d)[0];if(hit&&hit.d<.06){selectedPad=hit.t.pad;clearHover();updateSelection();return}if(!selected){selectedPad=null;updateSelection();return}const gp=gridPoint(nx,ny);if(!gp.valid)return toast("BUILD ON A FREE GRID CELL, AWAY FROM THE PATH");const d=types[selected],cost=Math.round(d.cost*run.build);if(credits<cost)return toast("NOT ENOUGH CREDITS");let pad=hoverPad!=null&&!towerOnPad(hoverPad)?hoverPad:pads.length;if(pad===pads.length)pads.push([gp.x,gp.y]);else pads[pad]=[gp.x,gp.y];credits-=cost;towers.push({pad,type:selected,level:1,cooldown:0,spent:cost,priority:"first",branch:null,totalDamage:0,kills:0,recoil:0,heat:0});selectedPad=pad;hoverPad=null;tone("support");updateHud();updateSelection()}
  const boardMove=e=>{if(!selected&&!orbitalAim){clearHover();canvas.classList.add("inspect-mode");return}canvas.classList.remove("inspect-mode");const r=canvas.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width,ny=(e.clientY-r.top)/r.height,gp=gridPoint(nx,ny);if(gp.valid){if(hoverPad==null||towerOnPad(hoverPad)){hoverPad=pads.length;pads.push([gp.x,gp.y])}else pads[hoverPad]=[gp.x,gp.y]}else{if(hoverPad!=null&&!towerOnPad(hoverPad)&&hoverPad===pads.length-1)pads.pop();hoverPad=null}canvas.classList.toggle("build-ready",hoverPad!=null);canvas.classList.toggle("build-blocked",!gp.valid);canvas.classList.toggle("orbital-aim",orbitalAim)};
  function useAbility(id){if(abilities[id].charge<100)return;if(id==="emp"){abilities.emp.charge=0;timers.emp=3;addEffect({type:"emp",life:1});tone("tesla",true)}else if(id==="overclock"){abilities.overclock.charge=0;timers.overclock=6;tone("rapid",true)}else{orbitalAim=true;toast("ORBITAL STRIKE: SELECT TARGET AREA")}updateHud()}
  function startWave(){if(waveActive||(!endless&&wave>=maxWaves)||pendingChoice)return;const early=Math.max(0,Math.ceil((prepDeadline-Date.now())/1000));if(wave&&early){credits+=early*2;bumpMomentum(12);toast(`EARLY LAUNCH +${early*2} ●`)}wave++;mapVariant=Math.floor(Math.random()*3);const intel=waveIntel(wave);currentMod=intel.mod;waveActive=true;flawless=true;spawnLeft=intel.count;spawnTimer=0;if(loadoutId==="engineer"&&wave===6){loadout.locked.length=0;$$('[data-td-tower]:disabled').forEach(b=>{b.disabled=false;b.classList.remove("locked");b.querySelector("small").textContent=`${types[b.dataset.tdTower].role} • ${types[b.dataset.tdTower].cost} ●`;b.onclick=()=>{$$('[data-td-tower]').forEach(x=>x.classList.toggle("active",x===b));selected=b.dataset.tdTower;selectedPad=null;updateSelection()}});toast("ENGINEER FABRICATION • CANNON + TESLA ONLINE")}if(intel.boss){bossIntro=1.8;$("#td-boss-intro")?.classList.add("show");setTimeout(()=>$("#td-boss-intro")?.classList.remove("show"),1800)}updatePreview();updateHud();tone(intel.boss?"cannon":"pulse",true)}
  const spawn=()=>{const intel=waveIntel(wave);let kind;if(intel.boss&&spawnLeft===1)kind=enemyTypes[wave%10===0?8:7];else{const unlocked=Math.min(7,2+Math.floor(wave/2));kind=enemyTypes[Math.floor(Math.random()*unlocked)]}const scale=endlessScale(),hp=(38+wave*22)*kind.hp*(currentMod.hp||1)*difficultyRules.hp*scale.hp,armor=Math.min(.68,(kind.armor||0)+(currentMod.armor||0)),pathIndex=mapData.modifier==="dualSpawn"?spawnLeft%paths.length:0;enemies.push({kind,t:0,pathIndex,hp,maxHp:hp,speed:(.034+wave*.0025)*kind.speed*(currentMod.speed||1)*difficultyRules.speed*scale.speed,slow:1,reward:Math.round((7+wave*1.5)*kind.reward*currentMod.reward*run.credit),leak:kind.leak,armor,lastHit:0,flash:0,bossPhase:kind.boss?1:0,attackTimer:kind.boss?4.5:0,freeze:0})};
  const showChoices=()=>{const h=$("#td-choice");if(!h){pendingChoice=false;paused=false;return}pendingChoice=true;paused=true;const picks=[...upgrades].sort(()=>Math.random()-.5).slice(0,3);h.hidden=false;h.innerHTML=`<header>ROGUELITE UPGRADE • CHOOSE ONE</header>${picks.map((u,i)=>`<button data-up="${i}"><b>${u.name}</b><small>${u.desc}</small></button>`).join("")}`;h.querySelectorAll("button").forEach(b=>b.onclick=()=>{const choice=picks[Number(b.dataset.up)];try{choice?.apply()}finally{h.hidden=true;pendingChoice=false;paused=false;updateHud();updateSelection();updatePreview()}if(choice)toast(`${choice.name} ONLINE`)})};
  const showSectorDecision=()=>{const h=$("#td-choice");if(!h)return finish(true,true);pendingChoice=true;paused=true;h.hidden=false;h.classList.add("td-sector-decision");h.innerHTML=`<header>SECTOR SECURED • WAVE ${wave}<br><small>${endless?`ENDLESS SCORE x${scoreMultiplier().toFixed(1)} • BANKED ${securedScore} • AT RISK ${Math.max(0,score-securedScore)}`:"THE CORE IS STABLE"}</small></header><button data-sector="cash"><b>CASH OUT</b><small>BANKED ${securedScore} + EXTRA ${Math.max(0,score-securedScore)} pont. Minden jutalmat és TD XP-t megtartasz.</small></button><button data-sector="endless"><b>CONTINUE ENDLESS</b><small>Két modifier, növekvő HP és sebesség, boss minden ötödik hullámban. Jelenlegi kockázat: ${Math.max(0,score-securedScore)} pont; vereségnél ennek csak 35%-a marad meg.</small></button>`;h.querySelector('[data-sector="cash"]').onclick=()=>finish(true,true);h.querySelector('[data-sector="endless"]').onclick=()=>{endless=true;maxWaves=Infinity;securedScore=score;endlessStreak=0;h.hidden=true;h.classList.remove("td-sector-decision");pendingChoice=false;paused=false;prepDeadline=Date.now()+15000;updatePreview();updateHud();toast("ENDLESS PROTOCOL ONLINE")}};
  const updatePreview=()=>{const p=$("#td-preview"),s=$("#td-start"),choice=$("#td-choice"),next=wave+1,intel=waveIntel(next);if(pendingChoice&&(!choice||choice.hidden)){pendingChoice=false;paused=false}if(p)p.innerHTML=waveActive?`<b>WAVE ${wave} — ${currentMod.name}</b><br>${spawnLeft+enemies.length} HOSTILES REMAINING${endless?`<br>SCORE x${scoreMultiplier().toFixed(1)} • BANKED ${securedScore} • AT RISK ${Math.max(0,score-securedScore)}`:""}`:`<b>WAVE ${next} — ${intel.mod.name}</b><br>${intel.mod.desc}<br>REWARD: +${Math.round((intel.mod.reward-1)*100)}%${intel.boss?"<br>⚠ BOSS SIGNAL DETECTED":""}${mapData.modifier==="dualSpawn"?"<br>DUAL INBOUND ROUTES":""}${mapData.modifier==="frozenPads"?"<br>CRYO FIELDS CYCLE ON/OFF":""}`;if(s){s.disabled=waveActive||pendingChoice||(!endless&&wave>=maxWaves);s.textContent=!endless&&wave>=maxWaves?"SECTOR SECURED":waveActive?"WAVE IN PROGRESS":`LAUNCH WAVE ${next}`}};
  const finish=(win,safeExit=false)=>{if(!running)return;running=false;cancelAnimationFrame(raf);const secured=(mode==="endless"?securedScore>0:wave>=securedWave)||mode==="bossrush"&&wave>=maxWaves,corePct=lives/loadout.lives,rank=(win||secured)&&corePct>.8&&stats.flawless>=Math.min(8,wave*.55)?"S":(win||secured)&&corePct>.55?"A":(win||secured)?"B":wave>=10?"C":"D",mvp=[...towers].sort((a,b)=>b.totalDamage-a.totalDamage)[0],baseScore=securedScore||Math.min(score,score),extraScore=endless?Math.max(0,score-baseScore):0,payout=secured?90+baseScore+Math.round(extraScore*(safeExit?1:.35)):win?90+score:Math.max(5,Math.floor(score/5)),rankBonus={S:80,A:55,B:36,C:20,D:8}[rank],tdXp=Math.max(8,Math.round((Math.min(wave,15)*6+Math.max(0,lives)*2+stats.flawless*10+stats.bosses*18+rankBonus)*difficultyRules.xp)),oldLevel=progress.level,contractContext={mapId,secured,flawless:stats.flawless,bosses:stats.bosses,endless:endlessIndex()},newContracts=tdContractDefs.filter(c=>!progress.completedContracts.includes(c.id)&&c.test(contractContext)),contractXp=newContracts.reduce((sum,c)=>sum+c.xp,0),earnedTdXp=tdXp+contractXp;progress.completedContracts.push(...newContracts.map(c=>c.id));progress.xp+=earnedTdXp;const record=progress.bestScores[mapId]||={score:0,rank:"D",runs:0,completions:0,highestWave:0,bestEndless:0};record.runs++;record.score=Math.max(record.score||0,score);record.highestWave=Math.max(record.highestWave||0,wave);record.bestEndless=Math.max(record.bestEndless||0,endlessIndex());if(win||secured)record.completions++;if(tdRankValue[rank]>tdRankValue[record.rank||"D"])record.rank=rank;ensureTdProgress();saveData();const levelUp=progress.level>oldLevel;setStage(`<div class="td-report"><h3>SECTOR RATING: <strong>${rank}</strong></h3><p>${mapData.name} • ${loadout.name} • ${difficulty.toUpperCase()}${endless?` • ENDLESS ${endlessIndex()}`:""}</p><div><span>CORE<b>${lives}/${loadout.lives}</b></span><span>ENEMIES DESTROYED<b>${stats.kills}</b></span><span>FLAWLESS WAVES<b>${stats.flawless}</b></span><span>BEST MOMENTUM<b>x${bestMomentum}</b></span><span>BOSSES DEFEATED<b>${stats.bosses}</b></span><span>MVP TOWER<b>${mvp?`${types[mvp.type].name}-${String(towers.indexOf(mvp)+1).padStart(2,"0")}`:"—"}</b></span><span>TD MASTERY<b>+${earnedTdXp} XP</b></span><span>TD LEVEL<b>${progress.level}${levelUp?" • LEVEL UP!":""}</b></span></div>${newContracts.length?`<p class="td-contract-earned">CONTRACT COMPLETE • ${newContracts.map(c=>c.name).join(" + ")} • +${contractXp} XP</p>`:""}<p>${score} pont • +${payout} érme${endless&&!safeExit&&!win?" • Endless extra jutalom 35%":""}</p><button id="td-again" class="pixel-btn primary">PÁLYAVÁLASZTÓ</button></div>`);reward(payout,Math.round(earnedTdXp*.25),{result:win||secured?"win":"loss",score});$("#td-again").onclick=()=>startTowerDefense()};
  const hitEnemy=(e,tower,type,mult=1,chain=false,feedback=true)=>{
    const crit=Math.random()<.09,armorFactor=1-e.armor*(1-(type.armorPierce||0)),dealt=type.damage*mult*armorFactor*(crit?1.75:1);e.hp-=dealt;e.lastHit=performance.now();e.lastTower=tower;e.flash=.12;tower.totalDamage+=dealt;tower.hits=(tower.hits||0)+1;
    if(feedback){label(e,`${crit?"CRIT ":""}${Math.round(dealt)}`,crit?"#ffe84c":"#fff",crit);if(e.armor&&type.armorPierce)label(e,"ARMOR PIERCE","#ff7043")}if(type.slow){e.slow=Math.min(e.slow,type.slow);if(feedback)label(e,"FROZEN","#8edbff")}if(tower.type==="frost"&&tower.branch===1&&tower.hits%5===0){e.freeze=Math.max(e.freeze||0,.8);if(feedback)label(e,"CRYO BURST","#d9fbff",true)}
    if(!chain&&feedback)addEffect({type:tower.type,from:{x:pads[tower.pad][0]*canvas.width,y:pads[tower.pad][1]*canvas.height},to:enemyPoint(e),life:.18,color:type.color});return dealt;
  };
  const update=(raw,visualRaw=raw)=>{if(paused)return;const dt=raw*speed;frozenClock+=dt;bossIntro=Math.max(0,bossIntro-dt);timers.emp=Math.max(0,timers.emp-dt);timers.overclock=Math.max(0,timers.overclock-dt);edgeFlash=Math.max(0,edgeFlash-dt);coreShake=Math.max(0,coreShake-dt);momentumHeat=Math.max(0,momentumHeat-dt*(performance.now()-lastKill>2600?7:1.2));momentum=Math.max(1,Math.min(8,1+Math.floor(momentumHeat/16)));if(lives<=6){alarmClock-=dt;if(alarmClock<=0){tone("cannon");alarmClock=1.8}}if(waveActive&&spawnLeft>0&&bossIntro<=0){spawnTimer-=dt;if(spawnTimer<=0){spawn();spawnLeft--;spawnTimer=.52/(currentMod.count||1)}}enemies.forEach(e=>{e.t+=e.speed*e.slow*(timers.emp>0?0:1)*(e.freeze>0?0:1)*(e.kind.boss&&e.hp<e.maxHp*.5?1.45:1)*dt;e.slow=Math.min(1,e.slow+dt*.2);e.freeze=Math.max(0,(e.freeze||0)-dt);e.flash=Math.max(0,(e.flash||0)-dt);if(e.kind.regen&&performance.now()-e.lastHit>1400)e.hp=Math.min(e.maxHp,e.hp+e.maxHp*e.kind.regen*dt)});for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(e.t>=1){enemies.splice(i,1);lives-=e.leak;flawless=false;if(endless)endlessStreak=0;edgeFlash=.45;coreShake=.45;momentumHeat=Math.max(0,momentumHeat-35);tone("cannon",true);if(lives<=0)return finish(false)}}towers.forEach(t=>{t.cooldown-=dt;t.recoil=Math.max(0,(t.recoil||0)-dt*7);t.disabled=isFrozenTower(t);if(t.disabled)return;if(t.cooldown>0)return;const type=towerStat(t);if(type.isSupport)return;const o=pointAt(0),x=pads[t.pad][0]*canvas.width,y=pads[t.pad][1]*canvas.height,targets=enemies.filter(e=>{const p=enemyPoint(e);return Math.hypot(p.x-x,p.y-y)<type.range*Math.min(canvas.width,canvas.height)}),ordered=rankedTargets(targets,t.priority,type.chain||1),target=ordered[0];if(!target)return;hitEnemy(target,t,type);if(type.splash)targets.filter(e=>e!==target&&Math.abs(e.t-target.t)<type.splash).forEach(e=>hitEnemy(e,t,type,.55,false,false));if(type.chain){let prev=target;const chained=ordered.slice(1,type.chain);chained.forEach((e,index)=>{addEffect({type:"tesla",from:enemyPoint(prev),to:enemyPoint(e),life:.2,color:type.color});const finalOverload=t.type==="tesla"&&t.branch===1&&index===chained.length-1;hitEnemy(e,t,type,finalOverload?1:.5,true);if(finalOverload)label(e,"OVERLOAD","#72ff77",true);prev=e})}t.cooldown=type.rate;t.recoil=1;tone(t.type)});for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(e.hp<=0){const p=enemyPoint(e),killer=e.lastTower;credits+=e.reward;score+=Math.round(e.reward*momentum*scoreMultiplier());stats.kills++;if(e.kind.boss)stats.bosses++;if(killer)killer.kills++;burst(p.x,p.y,e.kind.color,e.kind.boss?28:10);addEffect({type:"boom",x:p.x,y:p.y,life:.35,color:e.kind.color});const now=performance.now();bumpMomentum(now-lastKill<1200?11:5);lastKill=now;enemies.splice(i,1)}}effects.forEach(e=>e.life-=visualRaw);particles.forEach(p=>{p.life-=visualRaw;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=80*dt});floaters.forEach(f=>{f.life-=visualRaw;f.y-=28*dt});[effects,particles,floaters].forEach(a=>{for(let i=a.length-1;i>=0;i--)if(a[i].life<=0)a.splice(i,1)});if(waveActive&&spawnLeft===0&&!enemies.length){waveActive=false;stats.waves=wave;if(flawless){stats.flawless++;bumpMomentum(18);if(endless)endlessStreak++}if(mode==="bossrush"&&wave>=maxWaves)return finish(true,true);const bonus=35+wave*4+Math.min(30,Math.floor(credits*.04));credits+=bonus;prepDeadline=Date.now()+15000;toast(`WAVE ${wave} CLEARED • +${bonus} ●`);if((wave===securedWave&&!endless)||(endless&&wave>securedWave&&wave%5===0))showSectorDecision();else if(wave%3===0)showChoices();updatePreview()}updateHud()};
  const lightning=(a,b,color)=>{ctx.strokeStyle=color;ctx.lineWidth=3;ctx.shadowColor=color;ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(a.x,a.y);for(let i=1;i<6;i++){const f=i/6;ctx.lineTo(a.x+(b.x-a.x)*f+(Math.random()-.5)*12,a.y+(b.y-a.y)*f+(Math.random()-.5)*12)}ctx.lineTo(b.x,b.y);ctx.stroke();ctx.shadowBlur=0};
  const drawTower=(t,x,y,r)=>{const color=types[t.type].color,recoil=(t.recoil||0)*r*.2;ctx.save();ctx.translate(x,y+recoil);ctx.shadowColor=color;ctx.shadowBlur=12;ctx.fillStyle="#080d25";ctx.strokeStyle=color;ctx.lineWidth=2;if(t.type==="pulse"){ctx.beginPath();ctx.arc(0,0,r*.68,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.34,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}else if(t.type==="rapid"){ctx.fillRect(-r*.62,-r*.48,r*1.24,r*.96);ctx.strokeRect(-r*.62,-r*.48,r*1.24,r*.96);ctx.fillStyle=color;[-.28,0,.28].forEach(k=>ctx.fillRect(k*r-1,-r*.9,3,r*.65))}else if(t.type==="frost"){ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2?r*.36:r*.75;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=color;ctx.fillRect(-2,-r*.58,4,r*1.16);ctx.fillRect(-r*.58,-2,r*1.16,4)}else if(t.type==="cannon"){ctx.fillRect(-r*.68,-r*.54,r*1.36,r*1.08);ctx.strokeRect(-r*.68,-r*.54,r*1.36,r*1.08);ctx.fillStyle=color;ctx.fillRect(-r*.22,-r*1.05,r*.44,r*.72);ctx.beginPath();ctx.arc(0,0,r*.32,0,Math.PI*2);ctx.fill()}else if(t.type==="tesla"){ctx.beginPath();ctx.moveTo(0,-r*.82);ctx.lineTo(r*.62,r*.55);ctx.lineTo(-r*.62,r*.55);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle="#fff";ctx.beginPath();ctx.moveTo(-r*.15,-r*.35);ctx.lineTo(r*.12,-r*.08);ctx.lineTo(-r*.08,r*.12);ctx.lineTo(r*.18,r*.36);ctx.stroke()}else{ctx.rotate(Math.PI/4);ctx.fillRect(-r*.58,-r*.58,r*1.16,r*1.16);ctx.strokeRect(-r*.58,-r*.58,r*1.16,r*1.16);ctx.rotate(-Math.PI/4);ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,0,r*.25,0,Math.PI*2);ctx.fill()}ctx.shadowBlur=0;ctx.fillStyle="#fff";ctx.font=`bold ${Math.max(7,r*.48)}px monospace`;ctx.textAlign="center";ctx.fillText(t.level,0,r*.18);ctx.restore()};
  const draw=()=>{const w=canvas.width,h=canvas.height,u=Math.min(w,h);ctx.clearRect(0,0,w,h);ctx.fillStyle="#050817";ctx.fillRect(0,0,w,h);ctx.strokeStyle=`rgba(49,245,255,${.08+momentum*.012})`;for(let x=0;x<w;x+=Math.max(28,w/25)){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}for(let y=0;y<h;y+=Math.max(28,h/14)){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}if(mapData.frozenZones){mapData.frozenZones.forEach(([x,y,r])=>{ctx.fillStyle=frozenActive()?"rgba(170,238,255,.16)":"rgba(120,160,255,.06)";ctx.strokeStyle=frozenActive()?"#c9f7ff":"#6388ba";ctx.lineWidth=2;ctx.setLineDash([8,7]);ctx.beginPath();ctx.arc(x*w,y*h,r*u,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([])})}paths.forEach(route=>{ctx.strokeStyle="#16112e";ctx.lineWidth=Math.max(28,u*.095);ctx.lineJoin="round";ctx.beginPath();route.forEach(([x,y],i)=>i?ctx.lineTo(x*w,y*h):ctx.moveTo(x*w,y*h));ctx.stroke();ctx.strokeStyle="#55478a";ctx.lineWidth=Math.max(19,u*.062);ctx.stroke()});pads.forEach((p,i)=>{const t=towerOnPad(i),x=p[0]*w,y=p[1]*h,r=Math.max(13,u*.035);ctx.fillStyle=t?.disabled?"#183248":t?"#08061d":"#102548";ctx.strokeStyle=t?.disabled?"#c9f7ff":t?types[t.type].color:"#31f5ff";ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.stroke();if(t){const recoil=(t.recoil||0)*r*.22;ctx.fillStyle=types[t.type].color;ctx.beginPath();ctx.arc(x,y+recoil,r*.68,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.font=`bold ${Math.max(8,r*.62)}px monospace`;ctx.textAlign="center";ctx.fillText(t.level,x,y+recoil+r*.2)}else{ctx.beginPath();ctx.moveTo(x-r*.4,y);ctx.lineTo(x+r*.4,y);ctx.moveTo(x,y-r*.4);ctx.lineTo(x,y+r*.4);ctx.stroke()}});enemies.forEach(e=>{const p=enemyPoint(e),r=Math.max(8,u*.018)*(e.kind.boss?1.7:1);ctx.fillStyle=e.flash>0?"#fff":e.kind.color;ctx.beginPath();ctx.moveTo(p.x,p.y-r);ctx.lineTo(p.x+r,p.y);ctx.lineTo(p.x,p.y+r);ctx.lineTo(p.x-r,p.y);ctx.closePath();ctx.fill();ctx.fillStyle="#12091f";ctx.fillRect(p.x-r,p.y-r-8,r*2,4);ctx.fillStyle="#72ff77";ctx.fillRect(p.x-r,p.y-r-8,r*2*Math.max(0,e.hp/e.maxHp),4)});effects.forEach(e=>{if(e.from){if(e.type==="tesla")lightning(e.from,e.to,e.color);else if(e.type==="cannon"){const f=1-e.life/.18,x=e.from.x+(e.to.x-e.from.x)*f,y=e.from.y+(e.to.y-e.from.y)*f;ctx.fillStyle=e.color;ctx.fillRect(x-5,y-5,10,10)}else if(e.type==="frost"){ctx.strokeStyle=e.color;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(e.from.x,e.from.y);ctx.lineTo(e.to.x,e.to.y);ctx.stroke()}else if(e.type==="rapid"){ctx.strokeStyle=e.color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(e.from.x,e.from.y);ctx.lineTo(e.to.x,e.to.y);ctx.stroke()}else{ctx.fillStyle=e.color;ctx.beginPath();ctx.arc(e.to.x,e.to.y,5+e.life*18,0,Math.PI*2);ctx.fill()}}else if(e.type==="boom"){ctx.strokeStyle=e.color;ctx.lineWidth=5;ctx.beginPath();ctx.arc(e.x,e.y,(.35-e.life)*75,0,Math.PI*2);ctx.stroke()}else if(e.type==="orbital"){ctx.fillStyle=`rgba(255,232,76,${e.life})`;ctx.fillRect(e.x-10,0,20,e.y);ctx.beginPath();ctx.arc(e.x,e.y,(.8-e.life)*130,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.stroke()}else if(e.type==="emp"){ctx.strokeStyle="#31f5ff";ctx.lineWidth=5;ctx.beginPath();ctx.arc(w/2,h/2,(1-e.life)*Math.max(w,h),0,Math.PI*2);ctx.stroke()}});particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life*2);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size)});ctx.globalAlpha=1;floaters.forEach(f=>{ctx.fillStyle=f.color;ctx.font=`bold ${f.big?18:13}px monospace`;ctx.textAlign="center";ctx.fillText(f.text,f.x,f.y)});const boss=enemies.find(e=>e.kind.boss),bar=$("#td-boss-bar");if(bar){bar.hidden=!boss;if(boss)bar.querySelector("i").style.width=`${Math.max(0,boss.hp/boss.maxHp*100)}%`}const edge=$("#td-edge"),core=$("#td-core");if(edge)edge.style.opacity=edgeFlash/.45;if(core){core.classList.toggle("shake",coreShake>0);core.classList.toggle("critical",lives<=6)}};
  const drawMapUpgrade=()=>{const w=canvas.width,h=canvas.height,u=Math.min(w,h),spawns=paths.map((_,i)=>pointAt(0,i)),core=pointAt(.999);ctx.save();ctx.font=`bold ${Math.max(8,u*.018)}px monospace`;ctx.fillStyle="#ff4fbd";ctx.textAlign="left";spawns.forEach((spawn,i)=>ctx.fillText(`INBOUND ${paths.length>1?i+1:""}`,spawn.x+8,spawn.y+(i?-19:19)));ctx.fillStyle="#72ff77";ctx.textAlign="right";ctx.fillText("CORE",core.x-8,core.y-19);paths.forEach(route=>route.slice(1,-1).forEach((p,i)=>{ctx.fillStyle=i%2?"#31f5ff55":"#ff4fbd44";ctx.fillRect(p[0]*w-3,p[1]*h-3,6,6)}));if(hoverPad!=null){const p=pads[hoverPad],x=p[0]*w,y=p[1]*h,range=types[selected].range*u;ctx.fillStyle=`${types[selected].color}16`;ctx.strokeStyle=types[selected].color;ctx.lineWidth=2;ctx.setLineDash([8,6]);ctx.beginPath();ctx.arc(x,y,range,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font=`bold ${Math.max(9,u*.018)}px monospace`;ctx.fillText(`LEVEL 1 RANGE • ${Math.round(types[selected].range*100)}%`,x,Math.max(16,y-range-8));drawTower({type:selected,level:1,recoil:0},x,y,Math.max(13,u*.035))}towers.forEach(t=>{const p=pads[t.pad];drawTower(t,p[0]*w,p[1]*h,Math.max(13,u*.035))});ctx.restore()};
  const drawRandomMap=()=>{const w=canvas.width,h=canvas.height,u=Math.min(w,h),board=$(".td-board"),base=[[.035,.48],[.22,.88],[.46,.9],[.59,.1],[.72,.57],[.88,.37],[.96,.12]],spots=base.map(([x,y],i)=>[Math.max(.025,Math.min(.975,x+(mapVariant-1)*(i%2?.018:-.012))),Math.max(.07,Math.min(.93,y+(mapVariant-1)*(i%3?.014:-.018)))]);if(board){board.dataset.map=mapId;["neon","mars","frost"].forEach(t=>board.classList.toggle(`theme-${t}`,t===mapTheme))}ctx.save();ctx.globalAlpha=.86;spots.forEach(([nx,ny],i)=>{const x=nx*w,y=ny*h,s=Math.max(8,u*.019);ctx.lineWidth=2;if(mapTheme==="neon"){const colors=["#31f5ff","#ff4fbd","#ffe66d"];ctx.fillStyle="#111a48";ctx.strokeStyle=colors[(i+mapVariant)%3];ctx.fillRect(x-s,y-s,s*2,s*2);ctx.strokeRect(x-s,y-s,s*2,s*2);ctx.fillStyle=ctx.strokeStyle;ctx.fillRect(x-2,y-s*1.75,4,s*.75);ctx.beginPath();ctx.arc(x,y,s*.35,0,Math.PI*2);ctx.fill()}else if(mapTheme==="mars"){const colors=["#ff7043","#ffb347","#d84b7f"];ctx.fillStyle=colors[(i+mapVariant)%3];ctx.strokeStyle="#ffd28a";ctx.beginPath();ctx.moveTo(x-s*1.25,y+s*.85);ctx.lineTo(x-s*.45,y-s*1.15);ctx.lineTo(x+s*.25,y-s*.5);ctx.lineTo(x+s*1.1,y+s*.75);ctx.closePath();ctx.fill();ctx.stroke();if(i%2===0){ctx.strokeStyle="#ffe66d";ctx.beginPath();ctx.moveTo(x,y-s*1.5);ctx.lineTo(x,y+s*.5);ctx.moveTo(x,y-s*.5);ctx.lineTo(x+s*.65,y-s*.9);ctx.stroke()}}else{const colors=["#9cecff","#7d9fff","#df9cff"];ctx.fillStyle=colors[(i+mapVariant)%3];ctx.strokeStyle="#f3ffff";ctx.beginPath();ctx.moveTo(x,y-s*1.7);ctx.lineTo(x+s*.45,y-s*.35);ctx.lineTo(x+s*1.1,y+s*.9);ctx.lineTo(x,y+s*.55);ctx.lineTo(x-s*.9,y+s);ctx.lineTo(x-s*.4,y-s*.25);ctx.closePath();ctx.fill();ctx.stroke()} });ctx.fillStyle=mapTheme==="neon"?"#31f5ff":mapTheme==="mars"?"#ffb347":"#c9f7ff";ctx.font=`bold ${Math.max(8,u*.016)}px monospace`;ctx.textAlign="center";ctx.fillText(`${mapData.name} • ${mapData.difficulty} • LAYOUT ${mapVariant+1}`,w*.5,h-9);ctx.restore()};
  const drawBeaconAuras=()=>{const u=Math.min(canvas.width,canvas.height),pulse=.94+Math.sin(performance.now()/240)*.04;ctx.save();towers.filter(t=>t.type==="support").forEach(t=>{const p=pads[t.pad],x=p[0]*canvas.width,y=p[1]*canvas.height,r=beaconAuraRange(t)*u;ctx.fillStyle="rgba(248,244,255,.035)";ctx.strokeStyle="rgba(114,255,119,.55)";ctx.lineWidth=2;ctx.setLineDash([7,6]);ctx.beginPath();ctx.arc(x,y,r*pulse,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([]);towers.filter(o=>o!==t&&o.type!=="support"&&Math.hypot(pads[o.pad][0]-p[0],pads[o.pad][1]-p[1])<beaconAuraRange(t)).forEach(o=>{ctx.strokeStyle="rgba(114,255,119,.32)";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(pads[o.pad][0]*canvas.width,pads[o.pad][1]*canvas.height);ctx.stroke()})});ctx.restore()};
  const drawPlacementGrid=()=>{const w=canvas.width,h=canvas.height,minor=mapTheme==="mars"?"rgba(255,179,71,.045)":mapTheme==="frost"?"rgba(201,247,255,.05)":"rgba(49,245,255,.045)",major=mapTheme==="mars"?"rgba(255,179,71,.13)":mapTheme==="frost"?"rgba(201,247,255,.14)":"rgba(49,245,255,.13)";ctx.save();ctx.lineWidth=.5;for(let i=0;i<=grid.cols;i++){ctx.strokeStyle=i%10===0?major:minor;const x=i/grid.cols*w;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}for(let i=0;i<=grid.rows;i++){ctx.strokeStyle=i%10===0?major:minor;const y=i/grid.rows*h;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}ctx.restore()};
  const drawSelectedRange=()=>{const t=selectedPad!=null?towerOnPad(selectedPad):null;if(!t)return;const p=pads[t.pad],stat=towerStat(t),u=Math.min(canvas.width,canvas.height),x=p[0]*canvas.width,y=p[1]*canvas.height;ctx.save();ctx.fillStyle=`${types[t.type].color}12`;ctx.strokeStyle=types[t.type].color;ctx.lineWidth=2;ctx.setLineDash([9,7]);ctx.beginPath();ctx.arc(x,y,stat.range*u,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#fff";ctx.font=`bold ${Math.max(9,u*.017)}px monospace`;ctx.textAlign="center";ctx.fillText(`${types[t.type].name} • LEVEL ${t.level}`,x,Math.max(15,y-stat.range*u-7));ctx.restore()};
  const updateTowerSystems=dt=>towers.forEach(t=>{const fired=t.cooldown>(t._lastCooldown??t.cooldown)+.025;t.activity=Math.max(0,(t.activity||0)-dt*2.6);if(fired)t.activity=1;if(t.type==="rapid")t.heat=Math.max(0,Math.min(1,(t.heat||0)+(fired?.13:-dt*.055)));t._lastCooldown=t.cooldown});
  const drawTowerAnimations=()=>{const u=Math.min(canvas.width,canvas.height),now=performance.now()/1000;ctx.save();towers.forEach(t=>{const pad=pads[t.pad],x=pad[0]*canvas.width,y=pad[1]*canvas.height,r=Math.max(13,u*.035),stat=towerStat(t),targetEnemy=bestTarget(enemies.filter(e=>{const p=enemyPoint(e);return Math.hypot(p.x-x,p.y-y)<stat.range*u}),t.priority),target=targetEnemy?enemyPoint(targetEnemy):null,angle=target?Math.atan2(target.y-y,target.x-x):-Math.PI/2,color=types[t.type].color;ctx.save();ctx.translate(x,y);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=8;if(t.type==="pulse"){for(let i=0;i<3;i++){const a=now*(1.2+t.level*.18)+i*Math.PI*2/3;ctx.beginPath();ctx.arc(Math.cos(a)*r*.85,Math.sin(a)*r*.85,2.2,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=.35+.2*Math.sin(now*4);ctx.beginPath();ctx.arc(0,0,r*(.72+.08*Math.sin(now*3)),0,Math.PI*2);ctx.stroke()}else if(t.type==="rapid"){ctx.rotate(angle);ctx.lineWidth=3;[-.24,0,.24].forEach((k,i)=>{const kick=(t.activity||0)*(i%2?3:1);ctx.beginPath();ctx.moveTo(r*.15,r*k);ctx.lineTo(r*(.95-kick*.03),r*k);ctx.stroke()});ctx.rotate(-angle);ctx.globalAlpha=.7;ctx.fillStyle=(t.heat||0)>.7?"#ff7043":"#ffe84c";ctx.fillRect(-r*.7,r*.78,r*1.4*(t.heat||0),3)}else if(t.type==="frost"){ctx.rotate(now*.5);ctx.globalAlpha=.65;for(let i=0;i<6;i++){ctx.rotate(Math.PI/3);ctx.beginPath();ctx.moveTo(r*.52,0);ctx.lineTo(r*.92,0);ctx.stroke();ctx.beginPath();ctx.moveTo(r*.72,0);ctx.lineTo(r*.58,-r*.14);ctx.moveTo(r*.72,0);ctx.lineTo(r*.58,r*.14);ctx.stroke()}}else if(t.type==="cannon"){ctx.rotate(angle);ctx.fillStyle="#17132d";ctx.fillRect(0,-r*.16,r*(1.15-(t.activity||0)*.14),r*.32);ctx.strokeRect(0,-r*.16,r*(1.15-(t.activity||0)*.14),r*.32);ctx.fillStyle=color;ctx.fillRect(r*.92,-r*.11,r*.3,r*.22)}else if(t.type==="tesla"){for(let i=0;i<2+t.level;i++){const a=-now*1.7+i*Math.PI*2/(2+t.level),rr=r*(.65+i*.08);ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(Math.cos(a)*rr,Math.sin(a)*rr,2.5,0,Math.PI*2);ctx.fill()}if(target&&Math.sin(now*18)>.72){ctx.globalAlpha=.45;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo((target.x-x)*.2+(Math.random()-.5)*8,(target.y-y)*.2+(Math.random()-.5)*8);ctx.stroke()}}else{ctx.rotate(now*.6);ctx.globalAlpha=.55;ctx.lineWidth=2;ctx.setLineDash([4,5]);ctx.beginPath();ctx.arc(0,0,r*(.82+.08*Math.sin(now*3)),0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.rotate(-now*.6);ctx.globalAlpha=.35;ctx.beginPath();ctx.arc(0,0,r*(1.05+.12*Math.sin(now*2)),0,Math.PI*2);ctx.stroke()}ctx.restore()});ctx.restore()};
  const updateBosses=dt=>{if(paused)return;timers.disrupt=Math.max(0,timers.disrupt-dt);enemies.filter(e=>e.kind.boss).forEach(e=>{const ratio=e.hp/e.maxHp,next=ratio<=.3?3:ratio<=.65?2:1;if(next>e.bossPhase){e.bossPhase=next;e.flash=.35;bumpMomentum(4);label(e,`PHASE ${next}`,next===3?"#ff496f":"#ffe66d",true);toast(`${e.kind.name} • PHASE ${next}`);addEffect({type:"emp",life:.65});tone("tesla",true)}e.attackTimer-=dt;if(e.attackTimer<=0){const p=enemyPoint(e);if(e.kind.emp){Object.values(abilities).forEach(a=>a.charge=Math.max(0,a.charge-(e.bossPhase===3?22:14)));label(e,"ENERGY DRAIN","#31f5ff",true);toast("BOSS ATTACK • ABILITY ENERGY DRAINED")}else{timers.disrupt=e.bossPhase===3?3.4:2.2;label(e,"SHOCKWAVE","#ff7043",true);toast("BOSS ATTACK • TOWERS DISRUPTED")}addEffect({type:"boom",x:p.x,y:p.y,life:.35,color:e.kind.color});e.attackTimer=Math.max(2.7,5.5-e.bossPhase*.75)}})};
  const balanceAbilityCharge=dt=>{const momentumBonus=Math.max(0,momentum-1)*.45;Object.values(abilities).forEach(ability=>{ability.charge=Math.min(100,ability.charge+(ability.regen+momentumBonus)*run.abilityRegen*dt)})};
  const repairChoiceLock=()=>{if(!pendingChoice)return;const choice=$("#td-choice");if(!choice||choice.hidden){pendingChoice=false;paused=false;updatePreview();updateHud()}};
  const loop=now=>{if(!running)return;raf=requestAnimationFrame(loop);const frameDt=(now-last)/1000||0,dt=Math.min(.04,frameDt),visualDt=Math.min(.15,frameDt);last=now;engine.pressure=effects.length+particles.length+floaters.length*2;repairChoiceLock();updateBosses(dt);update(dt,visualDt);updateTowerSystems(dt);balanceAbilityCharge(dt);draw();drawPlacementGrid();drawRandomMap();drawBeaconAuras();drawMapUpgrade();drawSelectedRange();drawTowerAnimations();if(selectedPad!=null&&now-selectionRefresh>500){selectionRefresh=now;updateSelection()}};
  const clearHand=()=>{orbitalAim=false;selected=null;selectedPad=null;clearHover();$$('[data-td-tower]').forEach(b=>b.classList.remove("active"));$("#td-clear-hand")?.classList.add("active");updateSelection()};
  const keyHandler=e=>{if(!running||pendingChoice||/INPUT|SELECT|TEXTAREA/.test(e.target?.tagName||""))return;const towerKeys={1:"pulse",2:"rapid",3:"frost",4:"cannon",5:"tesla",6:"support"},abilityKeys={q:"emp",w:"orbital",e:"overclock"},key=e.key.toLowerCase();if(towerKeys[key]){$(`[data-td-tower="${towerKeys[key]}"]`)?.click();$("#td-clear-hand")?.classList.remove("active")}else if(abilityKeys[key]){useAbility(abilityKeys[key])}else if(e.code==="Space"){e.preventDefault();startWave()}else if(key==="x"||key==="escape"){clearHand()}};
  const mountPolish=()=>{const shell=$(".td-shell"),board=$(".td-board"),abilities=$(".td-abilities"),command=$(".td-command");if(!shell||!board)return;const title=document.createElement("header");title.className="td-operation-head";title.innerHTML=`<div><small>GUBUNTU DEFENSE NETWORK // ${mapData.difficulty} // ${loadout.name}</small><b>${mapData.name} COMMAND</b></div><span><i></i> SYSTEM ONLINE</span>`;shell.prepend(title);const corners=document.createElement("div");corners.className="td-board-corners";corners.innerHTML="<i></i><i></i><i></i><i></i>";board.append(corners);if(abilities){const label=document.createElement("div");label.className="td-section-label";label.innerHTML="<b>ACTIVE PROTOCOLS</b><span>Q / W / E</span>";abilities.before(label)}if(command){const label=document.createElement("div");label.className="td-section-label";label.innerHTML="<b>DEFENSE DEPLOYMENT</b><span>1–6 SELECT • SPACE LAUNCH</span>";command.before(label)}$$('[data-ability]').forEach((b,i)=>{b.dataset.key=["Q","W","E"][i];b.insertAdjacentHTML("afterbegin",`<span class="td-ability-icon">${["ϟ","◎","»"][i]}</span><kbd>${["Q","W","E"][i]}</kbd>`)});$$('[data-td-tower]').forEach((b,i)=>b.insertAdjacentHTML("afterbegin",`<kbd>${i+1}</kbd>`))};
  const mountGuide=()=>{const shell=$(".td-shell"),board=$(".td-board");if(!shell||!board)return;const guide=document.createElement("aside");guide.className="td-quick-guide";guide.innerHTML=`<b>HOW TO PLAY</b><span><i>1</i>Select a tower below.</span><span><i>2</i>Move across the grid to preview its exact Level 1 range.</span><span><i>3</i>Click any free green grid cell away from the enemy path.</span><button aria-label="Hide help">GOT IT</button>`;board.append(guide);guide.querySelector("button").onclick=()=>guide.classList.add("hidden")};
  const mountInspectButton=()=>{const shop=$(".td-tower-shop");if(!shop)return;const button=document.createElement("button");button.id="td-clear-hand";button.type="button";button.className="td-clear-hand";button.innerHTML=`<i></i><span><b>EMPTY HAND</b><small>INSPECT TOWERS</small></span><kbd>X</kbd>`;button.onclick=clearHand;shop.append(button);$$('[data-td-tower]').forEach(b=>b.addEventListener("click",()=>button.classList.remove("active")))};
  const clearHover=()=>{if(hoverPad!=null&&!towerOnPad(hoverPad)&&hoverPad===pads.length-1)pads.pop();hoverPad=null;canvas?.classList.remove("build-ready","build-blocked","orbital-aim")};
  const cleanup=()=>{running=false;cancelAnimationFrame(raf);window.removeEventListener("resize",resize);window.removeEventListener("game-layout-resize",resize);window.removeEventListener("keydown",keyHandler);canvas?.removeEventListener("pointermove",boardMove);canvas?.removeEventListener("pointerleave",clearHover)};
  render();mountPolish();mountGuide();mountInspectButton();updatePreview();canvas.addEventListener("pointermove",boardMove);canvas.addEventListener("pointerleave",clearHover);window.addEventListener("resize",resize);window.addEventListener("game-layout-resize",resize);window.addEventListener("keydown",keyHandler);raf=requestAnimationFrame(loop);setActiveCleanup(cleanup);
}

function startWreck(){
  const vehicles=[
    {id:"dozer",name:"BULLDOZER",icon:"🚜",desc:"Slow • massive impact",impact:42,armor:165,combo:.75,heavy:true},
    {id:"rally",name:"RALLY CAR",icon:"🏎️",desc:"Fast • fragile • combo hunter",impact:24,armor:82,combo:1.6,heavy:false},
    {id:"truck",name:"DEMOLITION TRUCK",icon:"🛻",desc:"Balanced • breaks heavy parts",impact:33,armor:125,combo:1.05,heavy:true}
  ];
  const contractTemplates=[
    {type:"objects",title:"CLEAR THE LOT",desc:"Destroy 14 objects",target:14},
    {type:"damage",title:"DAMAGE QUOTA",desc:"Cause 850 structural damage",target:850},
    {type:"order",title:"MARKED SEQUENCE",desc:"Destroy targets 1 → 2 → 3 → 4 in order",target:4},
    {type:"chain",title:"DOMINO THEORY",desc:"Create a chain reaction of 6 objects",target:6},
    {type:"survive",title:"CONTROLLED CHAOS",desc:"Finish with vehicle condition above 45%",target:45}
  ];
  let selected=null,parts=[],structureCount=0,score=0,totalDamage=0,destroyed=0,comboHits=0,bestCombo=1,bestChain=0,chainNow=0,lastDestroy=0,vehicleHp=100,time=60,ended=false,timer=null,sequence=0,contract=null;
  const combo=()=>comboHits>=12?5:comboHits>=7?3:comboHits>=3?2:1;
  const comboLabel=()=>combo()===5?"TOTAL MAYHEM":`x${combo()}`;
  const buildSite=()=>{
    const types=["warehouse","garage","tower"];
    parts=[];structureCount=4;
    for(let s=0;s<structureCount;s++){
      const type=types[s%types.length],base=s*7;
      parts.push(
        {id:base,type:"wall",structure:s,hp:70,maxHp:70,icon:"🧱",heavy:false},
        {id:base+1,type:"wall",structure:s,hp:70,maxHp:70,icon:"🧱",heavy:false},
        {id:base+2,type:"support",structure:s,hp:95,maxHp:95,icon:"🏗️",heavy:true},
        {id:base+3,type:"support",structure:s,hp:95,maxHp:95,icon:"🏗️",heavy:true},
        {id:base+4,type:"roof",structure:s,hp:125,maxHp:125,icon:"🏭",heavy:true},
        {id:base+5,type:"fuelTank",structure:s,hp:48,maxHp:48,icon:"🛢️",heavy:false},
        {id:base+6,type:"crate",structure:s,hp:38,maxHp:38,icon:"📦",heavy:false}
      );
    }
    const marked=parts.filter(p=>p.type!=="roof").slice(1,5);marked.forEach((p,i)=>p.mark=i+1);
  };
  const integrity=s=>Math.max(0,Math.round(parts.filter(p=>p.structure===s).reduce((n,p)=>n+Math.max(0,p.hp),0)/parts.filter(p=>p.structure===s).reduce((n,p)=>n+p.maxHp,0)*100));
  const contractProgress=()=>contract.type==="objects"?destroyed:contract.type==="damage"?Math.floor(totalDamage):contract.type==="order"?sequence:contract.type==="chain"?bestChain:Math.round(vehicleHp);
  const contractWon=()=>contract.type==="survive"?time<=0&&vehicleHp>=contract.target:contractProgress()>=contract.target;
  const chooseVehicle=()=>{
    const stats=currentPlayer.gameStats.wreck||{};
    setStage(`<section class="wreck-contract-lobby"><header><span>💥</span><div><small>DEMOLITION YARD</small><h3>CHOOSE YOUR MACHINE</h3></div></header><div class="wreck-vehicle-grid">${vehicles.map(v=>`<button data-wreck-vehicle="${v.id}"><i>${v.icon}</i><b>${v.name}</b><small>${v.desc}</small><span>IMPACT ${v.impact} • ARMOR ${v.armor}</span></button>`).join("")}</div><div class="casino-career"><span>BEST COMBO <b>${stats.bestCombo||1}</b></span><span>BEST DAMAGE <b>${stats.bestDamage||0}</b></span><span>CONTRACTS <b>${stats.contractsCompleted||0}</b></span></div></section>`);
    $$("[data-wreck-vehicle]").forEach(button=>button.onclick=()=>{selected=vehicles.find(v=>v.id===button.dataset.wreckVehicle);begin();});
  };
  const begin=()=>{
    buildSite();contract={...contractTemplates[Math.floor(Math.random()*contractTemplates.length)]};vehicleHp=100;render();
    timer=setInterval(()=>{time--;if(performance.now()-lastDestroy>2000){comboHits=0;chainNow=0;}refresh();if(time<=0)finish(contractWon());},1000);
  };
  const partClass=p=>p.hp<=0?"destroyed":p.hp<p.maxHp*.45?"critical":"";
  const render=()=>{
    setStage(`<section class="wreck-demolition"><header class="wreck-contract-head"><div><small>CONTRACT // ${contract.title}</small><b>${contract.desc}</b></div><span>${selected.icon} ${selected.name}</span></header><div class="wreck-demolition-hud"><span>TIME <b id="wreck-time">${time}</b></span><span>DAMAGE <b id="wreck-total">${Math.floor(totalDamage)}</b></span><span>VEHICLE <b id="wreck-hp">${Math.round(vehicleHp)}%</b></span><span>COMBO <b id="wreck-combo">${comboLabel()}</b></span><span>CONTRACT <b id="wreck-progress">${contractProgress()}/${contract.target}</b></span></div><div class="demolition-yard">${Array.from({length:structureCount},(_,s)=>`<article class="demolition-structure" data-structure="${s}"><header><b>${["WAREHOUSE","GARAGE","PROCESSING","DEPOT"][s]}</b><span>INTEGRITY <em data-integrity="${s}">${integrity(s)}%</em></span></header><div>${parts.filter(p=>p.structure===s).map(p=>`<button data-wreck-part="${p.id}" class="demolition-part part-${p.type} ${partClass(p)}" ${p.hp<=0?"disabled":""}><i>${p.icon}</i><b>${p.type}</b>${p.mark?`<em>${p.mark}</em>`:""}<span>${Math.max(0,Math.ceil(p.hp))}</span></button>`).join("")}</div></article>`).join("")}<div id="wreck-blast" class="wreck-blast">BOOM</div></div><p id="wreck-result" class="result">RAM a connected part. Supports weaken the whole structure; fuel tanks trigger chain explosions.</p><button id="wreck-finish" class="pixel-btn secondary">END CONTRACT</button></section>`);
    $$("[data-wreck-part]").forEach(button=>button.onclick=()=>ram(+button.dataset.wreckPart));$("#wreck-finish").onclick=()=>finish(contractWon());
  };
  const refresh=()=>{
    parts.forEach(p=>{const el=$(`[data-wreck-part="${p.id}"]`);if(!el)return;el.className=`demolition-part part-${p.type} ${partClass(p)}`;el.disabled=p.hp<=0;el.querySelector("span").textContent=Math.max(0,Math.ceil(p.hp));});
    for(let s=0;s<structureCount;s++){const el=$(`[data-integrity="${s}"]`);if(el)el.textContent=`${integrity(s)}%`;}
    $("#wreck-time")?.replaceChildren(String(time));$("#wreck-total")?.replaceChildren(String(Math.floor(totalDamage)));$("#wreck-hp")?.replaceChildren(`${Math.round(vehicleHp)}%`);$("#wreck-combo")?.replaceChildren(comboLabel());$("#wreck-progress")?.replaceChildren(`${contractProgress()}/${contract.target}`);
    $(".wreck-demolition")?.classList.toggle("total-mayhem",combo()===5);
    if(contractWon()&&contract.type!=="survive")finish(true);
  };
  const destroy=(p,source="ram")=>{
    if(p.destroyed)return;const remaining=Math.max(0,p.hp);p.hp=0;p.destroyed=true;totalDamage+=remaining;destroyed++;chainNow++;bestChain=Math.max(bestChain,chainNow);comboHits+=Math.max(1,Math.round(selected.combo));bestCombo=Math.max(bestCombo,combo());lastDestroy=performance.now();
    if(p.mark){if(p.mark===sequence+1)sequence++;else sequence=0;}
    if(p.type==="support"){
      parts.filter(x=>x.structure===p.structure&&x.hp>0).forEach(x=>{const loss=Math.min(x.hp,12);x.hp-=loss;totalDamage+=loss;if(x.hp<=0)destroy(x,"collapse");});
      const supports=parts.filter(x=>x.structure===p.structure&&x.type==="support"&&x.hp>0);
      if(!supports.length){const roof=parts.find(x=>x.structure===p.structure&&x.type==="roof"&&x.hp>0);if(roof)destroy(roof,"collapse");}
    }
    if(p.type==="fuelTank"){
      const blast=$("#wreck-blast");blast?.classList.add("show");setTimeout(()=>blast?.classList.remove("show"),500);
      parts.filter(x=>x.hp>0&&Math.abs(x.id-p.id)<=8).forEach(x=>{const loss=Math.min(x.hp,58);x.hp-=loss;totalDamage+=loss;if(x.hp<=0)destroy(x,"explosion");});
    }
    score+=Math.round((remaining+20)*combo());
  };
  const ram=id=>{
    if(ended)return;const p=parts.find(x=>x.id===id);if(!p||p.hp<=0)return;
    if(performance.now()-lastDestroy>2000){comboHits=0;chainNow=0;}
    const blocked=p.heavy&&!selected.heavy,impact=selected.impact*(blocked?.45:1)*(p.type==="support"?.82:1),loss=Math.min(p.hp,impact);
    p.hp-=loss;totalDamage+=loss;vehicleHp=Math.max(0,vehicleHp-(p.heavy?7:4)*(100/selected.armor));$(".demolition-yard")?.classList.add("quake");setTimeout(()=>$(".demolition-yard")?.classList.remove("quake"),180);
    if(p.hp<=0)destroy(p);else chainNow=0;
    $("#wreck-result").textContent=blocked?"HEAVY PART: this vehicle cannot deliver full impact.":p.type==="support"?"SUPPORT WEAKENED • structural integrity falling.":"DIRECT HIT";
    if(vehicleHp<=0)return finish(false);refresh();
  };
  const finish=win=>{
    if(ended)return;ended=true;clearInterval(timer);const stats=currentPlayer.gameStats.wreck||={plays:0,wins:0,losses:0,draws:0,best:null};stats.bestCombo=Math.max(stats.bestCombo||0,bestCombo);stats.bestDamage=Math.max(stats.bestDamage||0,Math.floor(totalDamage));stats.contractsCompleted=(stats.contractsCompleted||0)+(win?1:0);const payout=win?Math.min(240,40+Math.floor(score/30)+bestCombo*10):Math.max(5,Math.floor(score/100));
    setStage(`<div class="wreck-summary"><div class="big-icon">${win?"💥":"🚧"}</div><h3>${win?"CONTRACT COMPLETE":"CONTRACT FAILED"}</h3><div class="career-grid"><article><span>DAMAGE</span><b>${Math.floor(totalDamage)}</b></article><article><span>OBJECTS</span><b>${destroyed}</b></article><article><span>BEST CHAIN</span><b>${bestChain}</b></article><article><span>VEHICLE</span><b>${Math.round(vehicleHp)}%</b></article></div><p>${contract.title} • ${contractProgress()}/${contract.target} • ${payout} coins</p><button id="wreck-again" class="pixel-btn primary">NEXT CONTRACT</button></div>`);
    reward(payout,win?45:8,{result:win?"win":"loss",score});$("#wreck-again").onclick=startWreck;
  };
  chooseVehicle();setActiveCleanup(()=>{ended=true;clearInterval(timer);});
}

function startFishing(){
  const fish=[
    {id:"ponty",name:"Ponty",icon:"🐟",rarity:"common",base:10,min:.4,max:8,real:true,color:"#b7d982"},
    {id:"sullo",name:"Süllő",icon:"🐠",rarity:"common",base:14,min:.3,max:7,real:true,color:"#d9e5ff"},
    {id:"harcsa",name:"Harcsa",icon:"🐋",rarity:"uncommon",base:25,min:1,max:45,real:true,color:"#8aa9ba"},
    {id:"pisztrang",name:"Pisztráng",icon:"🐟",rarity:"uncommon",base:22,min:.2,max:6,real:true,color:"#ffb06b"},
    {id:"csuka",name:"Csuka",icon:"🐊",rarity:"rare",base:38,min:.8,max:18,real:true,color:"#75ff66"},
    {id:"koi",name:"Arany koi",icon:"🐠",rarity:"rare",base:44,min:.2,max:5,real:true,color:"#ffe84c"},
    {id:"keszeg",name:"Dévérkeszeg",icon:"🐟",rarity:"common",base:9,min:.15,max:4,real:true,color:"#d8d1a2"},
    {id:"compó",name:"Compó",icon:"🐟",rarity:"common",base:13,min:.2,max:6,real:true,color:"#8fb86b"},
    {id:"balin",name:"Balin",icon:"🐟",rarity:"uncommon",base:24,min:.5,max:10,real:true,color:"#c8e6ff"},
    {id:"angolna",name:"Angolna",icon:"〰️",rarity:"uncommon",base:28,min:.2,max:7,real:true,color:"#6f8a7a"},
    {id:"tokhal",name:"Tokhal",icon:"🐋",rarity:"rare",base:58,min:3,max:80,real:true,color:"#9bb0bd"},
    {id:"lazac",name:"Lazac",icon:"🐟",rarity:"rare",base:48,min:1,max:22,real:true,color:"#ff8a7a"},
    {id:"tonhal",name:"Tonhal",icon:"🐟",rarity:"rare",base:72,min:5,max:250,real:true,color:"#4f88a8"},
    {id:"capa",name:"Kék cápa",icon:"🦈",rarity:"legend",base:210,min:20,max:210,real:true,color:"#7fc7ff"},
    {id:"neon",name:"Neon uszonyos",icon:"💠",rarity:"mythic",base:95,min:.1,max:4,real:false,color:"#31f5ff"},
    {id:"glitch",name:"Glitch ponty",icon:"👾",rarity:"mythic",base:120,min:.2,max:12,real:false,color:"#ff3eb5"},
    {id:"circuit",name:"Áramkör csuka",icon:"⚡",rarity:"mythic",base:150,min:.5,max:16,real:false,color:"#72ff77"},
    {id:"pixelkraken",name:"Pixelkráken ivadék",icon:"🦑",rarity:"secret",base:520,min:4,max:120,real:false,color:"#c36bff"},
    {id:"moon",name:"Moon Carp",icon:"🌙",rarity:"legend",base:180,min:2,max:60,real:false,color:"#d9e5ff"},
    {id:"dragon",name:"Sárkánypisztráng",icon:"🐉",rarity:"legend",base:240,min:1,max:25,real:false,color:"#ff7043"},
    {id:"void",name:"Üresség hala",icon:"🕳️",rarity:"secret",base:420,min:.01,max:99,real:false,color:"#8e5bff"},
    {id:"razbora",name:"Smaragd razbóra",icon:"🐟",rarity:"common",base:11,min:.05,max:.8,real:true,color:"#71e3a2"},
    {id:"naphal",name:"Tarka naphal",icon:"🐠",rarity:"uncommon",base:19,min:.08,max:.45,real:true,color:"#ffcf5a"},
    {id:"moszatmano",name:"Moszatmanó",icon:"🧚",rarity:"mythic",base:130,min:.02,max:.6,real:false,color:"#72ff77"},
    {id:"domolyko",name:"Domolykó",icon:"🐟",rarity:"common",base:16,min:.2,max:5,real:true,color:"#bfc9d7"},
    {id:"menyhal",name:"Menyhal",icon:"🐍",rarity:"rare",base:52,min:.5,max:8,real:true,color:"#8c7556"},
    {id:"sodras",name:"Sodráslidérc",icon:"🌪️",rarity:"mythic",base:155,min:.1,max:7,real:false,color:"#31f5ff"},
    {id:"kardhal",name:"Kardhal",icon:"⚔️",rarity:"rare",base:92,min:25,max:650,real:true,color:"#9fd8ff"},
    {id:"oriaspolip",name:"Óriáspolip",icon:"🐙",rarity:"legend",base:230,min:10,max:75,real:true,color:"#c47bff"},
    {id:"abysslamp",name:"Ároklámpás",icon:"💡",rarity:"mythic",base:175,min:.1,max:5,real:false,color:"#ffe84c"},
    {id:"makrela",name:"Makréla",icon:"🐟",rarity:"common",base:18,min:.2,max:3.5,real:true,color:"#6fb7d8"},
    {id:"lepenyhal",name:"Lepényhal",icon:"🥿",rarity:"uncommon",base:34,min:.5,max:8,real:true,color:"#d2bb78"},
    {id:"korallkoi",name:"Korall koi",icon:"🪸",rarity:"mythic",base:145,min:.2,max:6,real:false,color:"#ff78c8"},
    {id:"bytegarnela",name:"Byte garnéla",icon:"🦐",rarity:"rare",base:80,min:.02,max:.3,real:false,color:"#ff7043"},
    {id:"voxelangolna",name:"Voxel angolna",icon:"▰",rarity:"legend",base:260,min:.3,max:12,real:false,color:"#31f5ff"},
    {id:"cachecapa",name:"Cache-cápa",icon:"💾",rarity:"secret",base:610,min:1,max:64,real:false,color:"#8e5bff"}
  ];
  const areas=[
    {id:"pond",name:"LILIOMOS TÓ",icon:"🌿",desc:"Kezdő víz, pontyokkal és békés halakkal.",bonus:["ponty","keszeg","compó","koi","neon","razbora","naphal","moszatmano"]},
    {id:"river",name:"NEON FOLYÓ",icon:"🏞️",desc:"Gyors sodrás, ragadozókkal és vándorhalakkal.",bonus:["sullo","pisztrang","balin","lazac","csuka","circuit","domolyko","menyhal","sodras"]},
    {id:"deep",name:"MÉLYVÍZI ÁROK",icon:"🌊",desc:"Nagy testű halak, nagyobb kockázat, nagyobb érték.",bonus:["harcsa","tokhal","tonhal","capa","angolna","moon","kardhal","oriaspolip","abysslamp"]},
    {id:"coast",name:"PIXEL PARTVIDÉK",icon:"🏖️",desc:"Sós víz és különös áramlatok.",bonus:["tonhal","capa","lazac","tokhal","pixelkraken","makrela","lepenyhal","korallkoi"]},
    {id:"glitch",name:"GLITCH ZÁTONY",icon:"🌀",desc:"Arcade-anomália, ahol a képzeletbeli halak élnek.",bonus:["neon","glitch","circuit","moon","dragon","void","pixelkraken","bytegarnela","voxelangolna","cachecapa"]}
  ];
  const bossFish=[
    {id:"boss_pond",name:"Liliom Leviatán",icon:"🌿",rarity:"boss",base:1450,min:22,max:180,real:false,color:"#72ff77",habitats:["pond"],boss:true},
    {id:"boss_river",name:"Sodráskirály Lazac",icon:"🌊",rarity:"boss",base:1650,min:18,max:210,real:false,color:"#31f5ff",habitats:["river"],boss:true},
    {id:"boss_deep",name:"Ároktitán Harcsa",icon:"🕳️",rarity:"boss",base:2300,min:70,max:520,real:false,color:"#8e5bff",habitats:["deep"],boss:true},
    {id:"boss_coast",name:"Korallbálna",icon:"🐋",rarity:"boss",base:2100,min:60,max:450,real:false,color:"#ff78c8",habitats:["coast"],boss:true},
    {id:"boss_glitch",name:"Null-Kraken",icon:"👾",rarity:"boss",base:2800,min:10,max:256,real:false,color:"#ff3eb5",habitats:["glitch"],boss:true}
  ];
  const habitats={ponty:["pond"],sullo:["river","pond"],harcsa:["deep","pond"],pisztrang:["river"],csuka:["river","pond"],koi:["pond"],keszeg:["pond"],compó:["pond"],balin:["river"],angolna:["river","deep"],tokhal:["deep","coast"],lazac:["river","coast"],tonhal:["coast","deep"],capa:["coast","deep"],neon:["glitch","pond"],glitch:["glitch"],circuit:["glitch","river"],pixelkraken:["glitch","coast"],moon:["glitch","deep"],dragon:["glitch"],void:["glitch"],razbora:["pond"],naphal:["pond"],moszatmano:["pond"],domolyko:["river"],menyhal:["river"],sodras:["river"],kardhal:["deep"],oriaspolip:["deep"],abysslamp:["deep"],makrela:["coast"],lepenyhal:["coast"],korallkoi:["coast"],bytegarnela:["glitch"],voxelangolna:["glitch"],cachecapa:["glitch"]};
  fish.push(...bossFish);
  fish.forEach(f=>f.habitats=f.habitats||habitats[f.id]||["pond"]);
  const sizes=[
    {id:"baby",name:"BABA",mult:.45,chance:.16,label:"Apró, de aranyos"},
    {id:"normal",name:"NORMÁL",mult:1,chance:.54,label:"Szép fogás"},
    {id:"big",name:"NAGY",mult:1.75,chance:.21,label:"Már húzza a zsinórt"},
    {id:"giant",name:"ÓRIÁS",mult:3.2,chance:.075,label:"Képernyőre vele!"},
    {id:"colossus",name:"KOLOSSZUS",mult:6,chance:.015,label:"Arcade legenda"},
    {id:"titan",name:"TITÁN",mult:10,chance:.004,label:"A tó főbossza"}
  ];
  const traits=[
    {id:"sick",name:"BETEG",icon:"🤢",mult:.45,chance:.08,cls:"sick"},
    {id:"scarred",name:"SEBHELYES",icon:"🩹",mult:.8,chance:.1,cls:"scarred"},
    {id:"albino",name:"ALBINÓ",icon:"⚪",mult:2.1,chance:.045,cls:"albino"},
    {id:"golden",name:"ARANY",icon:"🌟",mult:3.5,chance:.022,cls:"golden"},
    {id:"glitched",name:"GLITCH",icon:"▣",mult:4.2,chance:.015,cls:"glitched"},
    {id:"ancient",name:"ŐSI",icon:"🗿",mult:5.5,chance:.009,cls:"ancient"},
    {id:"radiant",name:"RAGYOGÓ",icon:"✨",mult:6.8,chance:.006,cls:"radiant"},
    {id:"prismatic",name:"PRIZMATIKUS",icon:"🌈",mult:8.2,chance:.004,cls:"prismatic"},
    {id:"cursed",name:"ELÁTKOZOTT",icon:"☠️",mult:.32,chance:.055,cls:"cursed"}
  ];
  const rarityW={common:54,uncommon:25,rare:13,mythic:6,legend:1.8,secret:.2,boss:.05};
  if(!currentPlayer.fishing||typeof currentPlayer.fishing!=="object")currentPlayer.fishing={rod:1,bait:1,total:0,sold:0,bestValue:0,bucket:[],dex:{},area:"pond",shop:{}};
  const state=currentPlayer.fishing;let bite=0,casting=false,timer=null,lastCatch=null,fishLifeCleanup=null;
  state.rod=Math.max(1,Math.min(20,Number(state.rod)||1));state.bait=Math.max(1,Math.min(20,Number(state.bait)||1));
  ["total","sold","bestValue"].forEach(k=>state[k]=Math.max(0,Number(state[k])||0));
  state.dex=state.dex&&typeof state.dex==="object"&&!Array.isArray(state.dex)?state.dex:{};
  state.shop=state.shop&&typeof state.shop==="object"&&!Array.isArray(state.shop)?state.shop:{};
  ["cooler","sonar","lure","reel","charm","preserver","lantern","bell"].forEach(k=>state.shop[k]=Math.max(0,Number(state.shop[k])||0));
  state.bucket=(Array.isArray(state.bucket)?state.bucket:[]).flatMap(entry=>{
    if(!entry||typeof entry!=="object")return [];
    const caughtFish=fish.find(f=>f.id===(typeof entry.fish==="string"?entry.fish:entry.fish?.id));
    if(!caughtFish)return [];
    const caughtSize=sizes.find(s=>s.id===(typeof entry.size==="string"?entry.size:entry.size?.id))||sizes[1];
    const caughtTrait=traits.find(t=>t.id===(typeof entry.trait==="string"?entry.trait:entry.trait?.id))||null;
    const kg=Math.max(.01,Number(entry.kg)||caughtFish.min),value=Math.max(1,Math.round(Number(entry.value)||caughtFish.base));
    return [{...entry,fish:caughtFish,size:caughtSize,trait:caughtTrait,kg,value}];
  });
  const resetDaily=()=>{
    const date=todayKey();
    if(!state.daily||state.daily.date!==date)state.daily={date,catches:0,sold:0,traits:0,rare:0,boss:0,buyer:0,areas:{},claimed:[]};
    state.daily.areas=state.daily.areas&&typeof state.daily.areas==="object"?state.daily.areas:{};state.daily.claimed=Array.isArray(state.daily.claimed)?state.daily.claimed:[];state.daily.boss=Math.max(0,Number(state.daily.boss)||0);state.daily.buyer=Math.max(0,Number(state.daily.buyer)||0);
  };
  resetDaily();
  const pickWeighted=items=>{const total=items.reduce((n,x)=>n+x.w,0);let r=Math.random()*total;return items.find(x=>(r-=x.w)<=0)||items[0];};
  state.area ||= "pond";
  const currentArea=()=>areas.find(a=>a.id===state.area)||areas[0];
  const areaFish=()=>fish.filter(f=>f.habitats.includes(currentArea().id));
  const shopLuck=()=>1+state.shop.lure*.12+state.shop.lantern*.035;
  const bucketLimit=()=>30+state.shop.cooler*10+state.shop.preserver*4;
  const bossChance=()=>Math.min(.17,.012+state.rod*.0025+state.shop.lantern*.004+state.shop.lure*.002+state.shop.bell*.006);
  const bossForArea=()=>fish.find(f=>f.boss&&f.habitats.includes(currentArea().id));
  const pickFish=()=>{const luck=(1+(state.rod-1)*.12+(state.bait-1)*.08)*shopLuck(),area=currentArea(),boss=fish.find(f=>f.boss&&f.habitats.includes(area.id));if(boss&&Math.random()<bossChance())return boss;return pickWeighted(areaFish().filter(f=>!f.boss).map(f=>({w:rarityW[f.rarity]*(area.bonus.includes(f.id)?1.7:1)*(["mythic","legend","secret"].includes(f.rarity)?luck:1),item:f}))).item;};
  const pickSize=()=>pickWeighted(sizes.map(s=>({w:s.chance*(["giant","colossus","titan"].includes(s.id)?1+(state.rod-1)*.18+state.shop.reel*.035:1),item:s}))).item;
  const positiveTraits=["albino","golden","glitched","ancient","radiant","prismatic"];
  const pickTrait=()=>{const luck=(1+(state.bait-1)*.15)*shopLuck();return Math.random()<.34+state.shop.lure*.015+state.shop.lantern*.006?pickWeighted(traits.map(t=>({w:t.chance*(positiveTraits.includes(t.id)?luck:1),item:t}))).item:null;};
  const calcValue=(f,size,trait,kg)=>Math.max(1,Math.round(f.base*size.mult*(trait?.mult||1)*(1+kg/(f.max*1.8))*(1+state.shop.charm*.035)*(f.boss?2.2:1)));
  const shopItems=()=>[
    {id:"rod",name:"Karbon pixelbot",icon:"🎣",level:state.rod,max:20,cost:120*state.rod*state.rod,desc:"Nagyobb méretek és ritkább halak."},
    {id:"bait",name:"Neon csali",icon:"🪱",level:state.bait,max:20,cost:90*state.bait*state.bait,desc:"Gyorsabb kapás és jobb trait esély."},
    {id:"cooler",name:"Hűtőláda modul",icon:"🧊",level:state.shop.cooler,max:12,cost:150*(state.shop.cooler+1),desc:`Vödör kapacitás: ${bucketLimit()} hal.`},
    {id:"sonar",name:"Mini szonár",icon:"📡",level:state.shop.sonar,max:20,cost:180*(state.shop.sonar+1),desc:"Gyorsabban telik a kapásmérő."},
    {id:"lure",name:"Szerencse úszó",icon:"🍀",level:state.shop.lure,max:20,cost:220*(state.shop.lure+1),desc:"Jobb mitikus/pozitív trait esély."},
    {id:"reel",name:"Titan orsó",icon:"🌀",level:state.shop.reel,max:10,cost:260*(state.shop.reel+1),desc:"Nagyobb halméret esély, erősebb bevágás."},
    {id:"charm",name:"Piaci amulett",icon:"💎",level:state.shop.charm,max:10,cost:300*(state.shop.charm+1),desc:"Minden fogás értékét növeli."},
    {id:"preserver",name:"Oxigén tasak",icon:"🫧",level:state.shop.preserver,max:8,cost:240*(state.shop.preserver+1),desc:"Extra vödörhely ritka fogásoknak."},
    {id:"lantern",name:"Holdlámpás",icon:"🌙",level:state.shop.lantern,max:8,cost:360*(state.shop.lantern+1),desc:"Jobb éjszakai/legendás és trait esély."},
    {id:"bell",name:"Boss csengő",icon:"🔔",level:state.shop.bell,max:10,cost:520*(state.shop.bell+1),desc:"Több boss-hal és prémium vevő esély."}
  ];
  const fishSkinGrid=(sheet,index,columns,rows,top=34,bottom=95,side=32)=>{
    const cellW=1491/columns,cellH=1055/rows,col=index%columns,row=Math.floor(index/columns);
    return {sheet,x:col*cellW+side,y:row*cellH+top,w:cellW-side*2,h:cellH-top-bottom};
  };
  const fishSkinMap={};
  ["ponty","sullo","harcsa","pisztrang","csuka","keszeg","compó","balin","angolna"].forEach((id,index)=>fishSkinMap[id]=fishSkinGrid("freshwater",index,3,3));
  ["tokhal","lazac","tonhal","capa","domolyko","menyhal","makrela","lepenyhal","kardhal"].forEach((id,index)=>fishSkinMap[id]=fishSkinGrid("ocean",index,3,3));
  ["koi","neon","glitch","circuit","pixelkraken","moon","dragon","void"].forEach((id,index)=>fishSkinMap[id]=fishSkinGrid("legendary",index,4,2,55,110,38));
  ["razbora","naphal","moszatmano","sodras","oriaspolip","abysslamp","korallkoi","bytegarnela","voxelangolna","cachecapa"].forEach((id,index)=>fishSkinMap[id]=fishSkinGrid("arcade",index,5,2,65,120,28));
  ["boss_pond","boss_river","boss_deep","boss_coast","boss_glitch"].forEach((id,index)=>fishSkinMap[id]={sheet:"bosses",x:index*(1491/5)+25,y:185,w:1491/5-50,h:620});
  const fishSkinFiles={freshwater:"assets/fish-species-freshwater.png",ocean:"assets/fish-species-ocean.png",legendary:"assets/fish-species-legendary.png",arcade:"assets/fish-species-arcade.png",bosses:"assets/fish-species-bosses.png"};
  const fishSkinSvg=f=>{const skin=fishSkinMap[f.id];if(!skin)return "";const clip=`fish-skin-${f.id.replace(/[^a-z0-9_-]/gi,"-")}`;return `<svg viewBox="0 0 ${skin.w} ${skin.h}" aria-hidden="true"><defs><clipPath id="${clip}"><rect width="${skin.w}" height="${skin.h}"/></clipPath></defs><g clip-path="url(#${clip})"><image href="${fishSkinFiles[skin.sheet]}" x="${-skin.x}" y="${-skin.y}" width="1491" height="1055"/></g></svg>`};
  const fishVisuals={
    ponty:["fish-deep fish-id-ponty","#d6a45c"],sullo:["fish-pike fish-id-sullo","#cfe7ff"],harcsa:["fish-catfish fish-id-harcsa","#6f8794"],pisztrang:["fish-trout fish-id-pisztrang","#ffbf7a"],csuka:["fish-pike fish-id-csuka","#b8f075"],koi:["fish-koi fish-id-koi","#fff2a2"],keszeg:["fish-bream fish-id-keszeg","#e7ddb0"],compó:["fish-bream fish-id-compo","#9bbd70"],balin:["fish-pike fish-id-balin","#d6f0ff"],angolna:["fish-eel fish-id-angolna","#5f7d69"],tokhal:["fish-sturgeon fish-id-tokhal","#b7c4cc"],lazac:["fish-trout fish-id-lazac","#ff9c8a"],tonhal:["fish-tuna fish-id-tonhal","#5fa6ca"],capa:["fish-shark fish-id-capa","#9cd8ff"],
    neon:["fish-crystal fish-id-neon","#31f5ff"],glitch:["fish-glitch fish-id-glitch","#ff3eb5"],circuit:["fish-pike fish-circuit fish-id-circuit","#72ff77"],pixelkraken:["fish-kraken fish-id-pixelkraken","#c36bff"],moon:["fish-koi fish-moon fish-moon-carp fish-id-moon","#d9e5ff"],dragon:["fish-dragon fish-id-dragon","#ff7043"],void:["fish-void fish-id-void","#8e5bff"],
    razbora:["fish-bream fish-id-razbora","#71e3a2"],naphal:["fish-sun fish-id-naphal","#ffcf5a"],moszatmano:["fish-fairy fish-id-moszatmano","#72ff77"],domolyko:["fish-bream fish-id-domolyko","#bfc9d7"],menyhal:["fish-eel fish-id-menyhal","#8c7556"],sodras:["fish-wisp fish-id-sodras","#31f5ff"],kardhal:["fish-sword fish-id-kardhal","#9fd8ff"],oriaspolip:["fish-octopus fish-id-oriaspolip","#c47bff"],abysslamp:["fish-lamp fish-id-abysslamp","#ffe84c"],makrela:["fish-tuna fish-id-makrela","#6fb7d8"],lepenyhal:["fish-flat fish-id-lepenyhal","#d2bb78"],korallkoi:["fish-koi fish-coral fish-id-korallkoi","#ff78c8"],bytegarnela:["fish-shrimp fish-id-bytegarnela","#ff7043"],voxelangolna:["fish-eel fish-voxel fish-id-voxelangolna","#31f5ff"],cachecapa:["fish-shark fish-cache fish-id-cachecapa","#8e5bff"],
    boss_pond:["fish-dragon fish-boss fish-boss-pond","#72ff77"],boss_river:["fish-sword fish-boss fish-boss-river","#31f5ff"],boss_deep:["fish-catfish fish-boss fish-boss-deep","#8e5bff"],boss_coast:["fish-tuna fish-boss fish-boss-coast","#ff78c8"],boss_glitch:["fish-kraken fish-boss fish-boss-glitch","#ff3eb5"]
  };
  const visualScale=c=>c?Math.min(2.9,Math.max(.55,.72+c.size.mult*.22+(c.kg/c.fish.max)*.9)):1;
  const fishSprite=(f,c=null,mode="")=>{
    const trait=c?.trait?.cls||"",scale=mode==="shadow"?.72:c?visualScale(c):mode==="dex"?1.08:.88;
    return `<span class="fish-sprite fish-skin-${f.id} ${trait} ${mode} ${f.boss?"fish-sprite-boss":""}" style="--fish:${f.color};--sprite-scale:${scale}" title="${f.name}" aria-label="${f.name}">${fishSkinSvg(f)}</span>`;
  };
  const buyers=[
    {icon:"🧙",name:"Öreg Haltáltos",likes:["boss","legend"],line:"Ezt a példányt a legendák közé akasztom.",mult:[2.1,3.8]},
    {icon:"🧑‍🍳",name:"Neon Séf",likes:["tonhal","lazac","kardhal"],line:"A VIP menüm sírva kérte ezt a fogást.",mult:[1.7,2.9]},
    {icon:"👽",name:"Zöld Antikvárius",likes:["glitch","void","cachecapa"],line:"A galaktikus polcom pont ekkora anomáliát keres.",mult:[2.2,4.2]},
    {icon:"🤖",name:"Halpiaci Bot-9",likes:["circuit","voxelangolna","neon"],line:"ÁRAMSZAGÚ. ÉRTÉKELÉS: KÍVÁNATOS.",mult:[1.8,3.3]},
    {icon:"🦊",name:"Ravasz Gyűjtő",likes:["golden","albino"],line:"Ritka színekért mindig túl sokat fizetek.",mult:[2.0,3.5]},
    {icon:"🧛",name:"Éjjeli Kurátor",likes:["moon","boss_deep","ancient"],line:"Holdfény alatt ez sokkal többet ér.",mult:[2.4,4.0]},
    {icon:"🧜",name:"Parti Hercegnő",likes:["korallkoi","capa","boss_coast"],line:"A palota akváriuma üresen szégyenkezik.",mult:[2.0,3.7]},
    {icon:"🕵️",name:"Titkos Aukciós",likes:["secret","boss"],line:"Nem kérdezek, te sem kérdezel. Fizetek.",mult:[2.6,4.6]},
    {icon:"🧑‍🚀",name:"Űrállomás Biológus",likes:["moon","void","pixelkraken"],line:"Nullgravitációs kutatáshoz tökéletes.",mult:[2.1,3.9]},
    {icon:"🎩",name:"Lord Pikkely",likes:["prismatic","radiant","legend"],line:"A vitrinem ma este tapsolni fog.",mult:[2.0,3.6]},
    {icon:"🧚",name:"Tavi Tündér",likes:["pond","moszatmano","naphal"],line:"Visszavenném a tó egyik hírességét.",mult:[1.6,2.8]},
    {icon:"🏴‍☠️",name:"Pixel Kalóz",likes:["coast","capa","oriaspolip"],line:"Kincsesládába való, nem vödörbe.",mult:[1.9,3.4]},
    {icon:"🧑‍🔬",name:"Laboros Lili",likes:["glitched","sick","cursed"],line:"A hibás példányokból lesznek a nagy felfedezések.",mult:[1.7,3.1]},
    {icon:"🐸",name:"Mocsári Bróker",likes:["harcsa","angolna","menyhal"],line:"Csúnya? Igen. Profit? Még inkább.",mult:[1.6,2.9]},
    {icon:"🦈",name:"Cápás Misi",likes:["capa","cachecapa","kardhal"],line:"Nagy fogak, nagy üzlet.",mult:[2.0,3.4]},
    {icon:"👑",name:"Arcade Király",likes:["boss","titan"],line:"Ezt királyi áron kérem.",mult:[2.8,5.0]},
    {icon:"🧑‍🎤",name:"Synthwave Sztár",likes:["neon","radiant","prismatic"],line:"Ez lesz az új albumborítóm.",mult:[1.9,3.6]},
    {icon:"🦉",name:"Éjjeli Tanár",likes:["ancient","tokhal","moon"],line:"Tananyag lesz belőle. Drága tananyag.",mult:[1.8,3.2]},
    {icon:"🧊",name:"Fagyos Szállító",likes:["tonhal","deep","boss_deep"],line:"A hűtőládám pont ekkora szörnyre vár.",mult:[1.7,3.0]},
    {icon:"💾",name:"Cache Kupec",likes:["cachecapa","bytegarnela","voxelangolna"],line:"Mentem, duplikálom, továbbadom.",mult:[2.3,4.4]}
  ];
  const buyerMatches=(b,c)=>b.likes.some(x=>x===c.fish.id||x===c.fish.rarity||x===c.fish.habitats?.[0]||x===c.trait?.id||x===c.size?.id);
  const buyerChance=()=>Math.min(.75,.42+state.shop.bell*.025);
  const makeBuyerOffer=c=>{if(c.value<5000||Math.random()>buyerChance())return null;const pool=buyers.filter(b=>buyerMatches(b,c)),b=(pool.length?pool:buyers)[Math.floor(Math.random()*(pool.length?pool.length:buyers.length))],bonus=buyerMatches(b,c)?.45:0,mult=+(b.mult[0]+bonus+Math.random()*(b.mult[1]-b.mult[0])).toFixed(2);return {...b,mult,price:Math.round(c.value*mult)};};
  const fishQuests=()=>[
    {id:"catch6",icon:"🎣",title:"Napi kapás",desc:"Fogj ki 6 halat.",goal:6,now:state.daily.catches||0,reward:[55,18]},
    {id:"trait1",icon:"✨",title:"Különleges pikkely",desc:"Fogj 1 traites halat.",goal:1,now:state.daily.traits||0,reward:[80,24]},
    {id:"rare2",icon:"💎",title:"Ritkaságvadász",desc:"Fogj 2 rare vagy jobb halat.",goal:2,now:state.daily.rare||0,reward:[95,28]},
    {id:`area3-${currentArea().id}`,icon:currentArea().icon,title:"Élőhely-felmérés",desc:`Fogj 3 halat itt: ${currentArea().name}.`,goal:3,now:state.daily.areas[currentArea().id]||0,reward:[70,20]},
    {id:"sell300",icon:"💰",title:"Piaci nap",desc:"Adj el 300● értékű halat.",goal:300,now:state.daily.sold||0,reward:[65,22]}
  ].concat([
    {id:"boss1",icon:"👑",title:"Bossvadászat",desc:"Fogj ki 1 boss halat.",goal:1,now:state.daily.boss||0,reward:[240,90]},
    {id:"buyer1",icon:"🤝",title:"Prémium vevő",desc:"Adj el 1 halat külön vevőnek.",goal:1,now:state.daily.buyer||0,reward:[180,60]}
  ]);
  const questHtml=q=>{
    const done=q.now>=q.goal,claimed=state.daily.claimed.includes(q.id),pct=Math.min(100,Math.round(q.now/q.goal*100));
    return `<article class="${done?"done":""} ${claimed?"claimed":""}"><span>${q.icon}</span><div><b>${q.title}</b><small>${q.desc}</small><em>${Math.min(q.now,q.goal)}/${q.goal}</em><i><u style="width:${pct}%"></u></i></div><button class="pixel-btn secondary" data-fish-quest="${q.id}" ${!done||claimed?"disabled":""}>${claimed?"KÉSZ":`+${q.reward[0]}●`}</button></article>`;
  };
  const startFishLife=()=>{
    if(fishLifeCleanup)fishLifeCleanup();
    const canvas=$("#fish-life-bg");if(!canvas)return;
    const ctx=canvas.getContext("2d"),cell=14,colors=["#31f5ff","#28d7d1","#72ff77","#ffe84c","#ff78c8"];
    let cols=0,rows=0,grid=[],next=[],raf=0,last=0,running=true;
    const idx=(x,y)=>y*cols+x;
    const seed=()=>{
      grid=Array(cols*rows).fill(0);next=Array(cols*rows).fill(0);
      for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(Math.random()<.11)grid[idx(x,y)]=1+Math.floor(Math.random()*colors.length);
      [[4,4],[Math.floor(cols*.5),Math.floor(rows*.32)],[Math.floor(cols*.78),Math.floor(rows*.68)]].forEach(([x,y],n)=>{
        [[0,0],[1,0],[2,0],[2,1],[1,2],[0,2]].forEach(([dx,dy])=>{if(x+dx<cols&&y+dy<rows)grid[idx(x+dx,y+dy)]=1+(n%colors.length);});
      });
    };
    const resize=()=>{const r=canvas.getBoundingClientRect();canvas.width=Math.min(960,Math.max(320,Math.floor(r.width)));canvas.height=Math.min(900,Math.max(180,Math.floor(r.height)));cols=Math.ceil(canvas.width/cell);rows=Math.ceil(canvas.height/cell);seed();};
    const step=()=>{let live=0;for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){let n=0,c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const v=grid[idx((x+dx+cols)%cols,(y+dy+rows)%rows)];if(v){n++;c+=v;}}const me=grid[idx(x,y)];next[idx(x,y)]=me?(n===2||n===3?me:0):(n===3?Math.max(1,Math.round(c/3)%colors.length):0);if(next[idx(x,y)])live++;}[grid,next]=[next,grid];if(live<12)seed();};
    const draw=now=>{if(!running)return;raf=requestAnimationFrame(draw);if(now-last<=190)return;step();last=now;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.globalAlpha=.62;for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const v=grid[idx(x,y)];if(!v)continue;ctx.fillStyle=colors[(v-1)%colors.length];const px=x*cell,py=y*cell;ctx.fillRect(px+4,py+5,cell-6,cell-7);ctx.fillRect(px+cell-4,py+7,4,4);if((x+y)%5===0)ctx.fillRect(px+1,py+7,3,3);}ctx.globalAlpha=1;};
    resize();window.addEventListener("resize",resize);raf=requestAnimationFrame(draw);
    fishLifeCleanup=()=>{running=false;cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  };
  const render=()=>{
    const dexCount=Object.keys(state.dex).length,bucketValue=state.bucket.reduce((n,c)=>n+c.value,0),area=currentArea(),boss=bossForArea(),bossPct=(bossChance()*100).toFixed(1),buyerPct=(buyerChance()*100).toFixed(0);
    setStage(`<div class="fish-wrap"><canvas id="fish-life-bg" class="fish-life-bg" aria-hidden="true"></canvas><div class="fish-head"><div><p class="eyebrow">IDLE PIXEL FISHING</p><h3>${area.icon} ${area.name}</h3><p class="fish-area-desc">${area.desc}</p></div><div class="fish-stats"><span>BOT LVL ${state.rod}</span><span>CSALI LVL ${state.bait}</span><span>VÖDÖR ${state.bucket.length}/${bucketLimit()}</span><span>DEX ${dexCount}/${fish.length}</span><span>BEST ${state.bestValue||0}●</span></div></div><div class="fish-area-tabs">${areas.map(a=>`<button class="${a.id===area.id?"active":""}" data-fish-area="${a.id}"><span>${a.icon}</span><b>${a.name}</b></button>`).join("")}</div><div class="fish-layout"><section class="fish-pond"><div class="fish-water area-${area.id}">${Array.from({length:18},(_,i)=>`<i style="--i:${i};left:${(i*53)%96}%;top:${20+(i*31)%220}px"></i>`).join("")}<div class="fish-shadows">${areaFish().slice(0,7).map((f,i)=>`<span style="left:${10+i*13}%;top:${45+(i%3)*16}%">${fishSprite(f,null,"shadow")}</span>`).join("")}</div><div class="bobber ${casting?"casting":""} ${bite>78?"hooked":""}" style="--tension:${bite}"><span class="rod-grip"></span><span class="rod-stick"></span><span class="rod-reel"></span><span class="rod-guide g1"></span><span class="rod-guide g2"></span><span class="rod-line"></span><span class="float">●</span><span class="hook">⌄</span></div></div><div class="fish-area-list"><b>ITT ÉL:</b> ${areaFish().map(f=>`<span style="--fish:${f.color}">${fishSprite(f,null,"mini")} ${f.name}</span>`).join("")}</div><div class="bite-meter"><span>KAPÁS</span><i><b id="bite-fill" style="width:${bite}%"></b></i></div><button id="cast-btn" class="pixel-btn primary">${casting?"BEVÁGÁS!":"BEDOBÁS"}</button><div id="fish-result" class="result">${lastCatch?catchHtml(lastCatch):"Válassz élőhelyet, dobd be a csalit, és figyeld a kapásmérőt."}</div></section><aside class="fish-side"><div class="fish-actions"><div class="bucket-summary"><span>VÖDÖRÉRTÉK <b>${bucketValue}●</b></span><span>ÁTLAG <b>${state.bucket.length?Math.round(bucketValue/state.bucket.length):0}●</b></span><span>LEGJOBB <b>${state.bucket.reduce((m,c)=>Math.max(m,c.value),0)}●</b></span></div><button id="sell-fish" class="pixel-btn secondary" ${!bucketValue?"disabled":""}>VÖDÖR ELADÁS • ${bucketValue} ●</button></div><h3>NAPI MEGBÍZÁSOK</h3><div class="fish-quests">${fishQuests().map(questHtml).join("")}</div><h3>HORGÁSZBOLT</h3><div class="fish-shop">${shopItems().map(item=>{const maxed=item.level>=item.max;return `<article class="${maxed?"maxed":""}"><span>${item.icon}</span><div><b>${item.name}</b><small>LVL ${item.level}/${item.max} • ${item.desc}</small><i><u style="width:${Math.min(100,item.level/item.max*100)}%"></u></i></div><button class="pixel-btn secondary" data-fish-shop="${item.id}" ${maxed?"disabled":""}>${maxed?"MAX":item.cost+" ●"}</button></article>`;}).join("")}</div><h3>VÖDÖR</h3><div class="fish-bucket">${state.bucket.slice(-8).reverse().map(c=>fishCard(c)).join("")||"<p class='empty-state'>Még üres. A víz gyanúsan néz vissza.</p>"}</div></aside></div><section class="fish-dex"><h3>HALNAPLÓ</h3><div>${fish.map(f=>{const d=state.dex[f.id];return `<article class="dex-fish ${d?"seen":"locked"}" style="--fish:${f.color}"><span>${d?fishSprite(f,null,"dex"):"?"}</span><b>${d?f.name:"???"}</b><small>${d?`${f.rarity.toUpperCase()} • ${f.habitats.map(h=>areas.find(a=>a.id===h)?.icon).join("")} • legjobb ${d.best}● • ${d.count}x`:"Még nem fogtad ki"}</small></article>`;}).join("")}</div></section></div>`);
    $(".fish-head")?.insertAdjacentHTML("afterend",`<div class="boss-radar"><span>👑 BOSS: <b>${boss?.name||"???"}</b></span><span>ESÉLY: <b>${bossPct}%</b></span><span>💼 VEVŐK: <b>${buyerPct}% esély 5000● felett</b></span></div>`);
    const castButton=$("#cast-btn");if(castButton){castButton.type="button";castButton.addEventListener("click",castOrCatch,{once:true});}
    try{startFishLife();}catch(error){fishLifeCleanup=null;console.warn("Fishing background effect disabled",error);}
  };
  const catchTier=c=>c.fish.rarity==="boss"?"boss-catch":c.fish.rarity==="secret"?"secret-catch":c.fish.rarity==="legend"||c.value>=500?"legendary":c.fish.rarity==="mythic"||c.value>=220?"rare-catch":"";
  const catchLabel=c=>catchTier(c)==="boss-catch"?"BOSS FISH":catchTier(c)==="secret-catch"?"SECRET CATCH":catchTier(c)==="legendary"?"LEGENDARY CATCH":catchTier(c)==="rare-catch"?"RARE CATCH":"";
  const catchHtml=c=>{
    const tier=catchTier(c),label=catchLabel(c)||"CATCH",offer=c.buyerOffer;
    return `<article class="catch-line fresh catch-screen ${tier} ${c.trait?.cls||""}"><em class="catch-rarity">${label}</em><div class="catch-hero">${fishSprite(c.fish,c,"catch")}</div><b>${c.trait?c.trait.icon+" ":""}${c.size.name} ${c.fish.name}</b><div class="catch-stats"><span><i>KG</i><strong>${c.kg.toFixed(2)}</strong></span><span><i>MÉRET</i><strong>${visualScale(c).toFixed(1)}x</strong></span><span><i>TRAIT</i><strong>${c.trait?c.trait.icon+" "+c.trait.name:"TISZTA"}</strong></span><span><i>ÉRTÉK</i><strong>${c.value} ●</strong></span></div>${offer?`<div class="buyer-offer"><span>${offer.icon}</span><div><b>${offer.name}</b><small>„${offer.line}”</small><strong>${offer.mult}× ajánlat: ${offer.price} ●</strong></div></div>`:""}<div class="catch-actions"><button id="keep-last-catch" class="pixel-btn secondary" type="button">VÖDÖRBEN HAGYOM</button><button id="sell-last-catch" class="pixel-btn primary" type="button">ELADOM • ${c.value} ●</button>${offer?`<button id="sell-buyer-catch" class="pixel-btn danger" type="button">${offer.name} • ${offer.price} ●</button>`:""}</div></article>`;
  };
  const fishCard=c=>`<article class="fish-card ${c.trait?.cls||""}" style="--fish:${c.fish.color}"><span>${fishSprite(c.fish,c,"bucket")}</span><div><b>${c.size.name} ${c.fish.name}</b><small>${c.kg.toFixed(2)}kg • ${c.trait?c.trait.icon+" "+c.trait.name:"TISZTA"} • ${c.value}●</small></div></article>`;
  const sellLastCatch=()=>{if(!lastCatch)return;const i=state.bucket.lastIndexOf(lastCatch);if(i<0){lastCatch=null;toast("EZ A HAL MÁR NINCS A VÖDÖRBEN!");render();return;}const sold=lastCatch;state.bucket.splice(i,1);state.sold+=sold.value;state.daily.sold+=sold.value;lastCatch=null;grant(sold.value,Math.max(3,Math.floor(sold.value/10)),`${sold.fish.name} ELADVA • +${sold.value} ÉRME`);render();};
  const sellBuyerCatch=()=>{if(!lastCatch?.buyerOffer)return;const i=state.bucket.lastIndexOf(lastCatch);if(i<0){lastCatch=null;toast("A VEVŐ LEMARADT: A HAL MÁR NINCS A VÖDÖRBEN!");render();return;}const sold=lastCatch,price=sold.buyerOffer.price;state.bucket.splice(i,1);state.sold+=price;state.daily.sold+=price;state.daily.buyer=(state.daily.buyer||0)+1;lastCatch=null;grant(price,Math.max(12,Math.floor(price/9)),`${sold.buyerOffer.name} MEGVETTE • +${price} ÉRME`);render();};
  const catchFish=()=>{
    const f=pickFish(),size=pickSize(),trait=pickTrait(),kg=+(f.min+Math.random()*(f.max-f.min)*size.mult).toFixed(2),value=calcValue(f,size,trait,kg),caught={fish:f,size,trait,kg,value};
    caught.buyerOffer=makeBuyerOffer(caught);
    state.bucket.push(caught);if(state.bucket.length>bucketLimit())state.bucket.shift();state.total++;state.daily.catches++;state.daily.areas[state.area]=(state.daily.areas[state.area]||0)+1;if(trait)state.daily.traits++;if(f.boss)state.daily.boss=(state.daily.boss||0)+1;if(["rare","mythic","legend","secret","boss"].includes(f.rarity))state.daily.rare++;state.bestValue=Math.max(state.bestValue,value);state.dex[f.id] ||= {count:0,best:0,biggest:0};state.dex[f.id].count++;state.dex[f.id].best=Math.max(state.dex[f.id].best,value);state.dex[f.id].biggest=Math.max(state.dex[f.id].biggest,kg);lastCatch=caught;saveData();sfx(f.boss||value>180?"jackpot":trait||["giant","colossus","titan"].includes(size.id)?"win":"coin");render();
  };
  const castOrCatch=()=>{if(casting&&bite>=100){bite=0;casting=false;catchFish();return;}casting=true;bite=Math.max(bite,12);sfx("click");render();};
  const sellBucket=()=>{const value=state.bucket.reduce((n,c)=>n+c.value,0);if(!value)return toast("ÜRES A VÖDÖR!");state.bucket=[];lastCatch=null;state.sold+=value;state.daily.sold+=value;grant(value,Math.max(5,Math.floor(value/8)),`HALAK ELADVA • +${value} ÉRME`);render();};
  const buyShop=id=>{const item=shopItems().find(x=>x.id===id);if(!item)return;if(item.level>=item.max)return toast(`${item.name} MÁR MAX SZINTEN VAN!`);if(currentPlayer.coins<item.cost)return toast("NINCS ELÉG ÉRMÉD A HORGÁSZBOLTHOZ!");currentPlayer.coins-=item.cost;if(id==="rod"||id==="bait")state[id]++;else state.shop[id]++;saveData();updateHud();sfx("win");toast(`${item.name} FEJLESZTVE! LVL ${item.level+1}/${item.max}`);render();};
  const claimQuest=id=>{const q=fishQuests().find(x=>x.id===id);if(!q||q.now<q.goal||state.daily.claimed.includes(id))return;state.daily.claimed.push(id);currentPlayer.coins+=q.reward[0];currentPlayer.xp+=q.reward[1];currentPlayer.rank=rankOf(currentPlayer);saveData();updateHud();sfx("win");toast(`MEGBÍZÁS KÉSZ: ${q.title} • +${q.reward[0]} ÉRME`);render();};
  const fishingStage=$("#game-stage");
  const handleFishingAction=e=>{
    const button=e.target.closest("button");if(!button||!fishingStage.contains(button))return;
    if(button.id==="cast-btn")return;
    e.preventDefault();
    if(button.id==="sell-fish")return sellBucket();
    if(button.id==="sell-last-catch")return sellLastCatch();
    if(button.id==="sell-buyer-catch")return sellBuyerCatch();
    if(button.id==="keep-last-catch"){lastCatch=null;render();return;}
    if(button.dataset.fishShop)return buyShop(button.dataset.fishShop);
    if(button.dataset.fishQuest)return claimQuest(button.dataset.fishQuest);
    if(button.dataset.fishArea){if(casting)return toast("ELŐBB HÚZD KI A CSALIT!");state.area=button.dataset.fishArea;lastCatch=null;saveData();render();}
  };
  fishingStage.addEventListener("click",handleFishingAction);
  timer=setInterval(()=>{if(!casting)return;bite=Math.min(100,bite+(5+state.bait*.8+state.shop.sonar*1.1+state.shop.reel*.55+Math.random()*7));const fill=$("#bite-fill");if(fill)fill.style.width=`${bite}%`;const rig=$(".bobber");if(rig){rig.classList.toggle("hooked",bite>78);rig.style.setProperty("--tension",bite);}if(bite>=100)toast("KAPÁS! NYOMD MEG A BEVÁGÁST!");},900);
  render();setActiveCleanup(()=>{clearInterval(timer);fishingStage.removeEventListener("click",handleFishingAction);if(fishLifeCleanup)fishLifeCleanup();fishLifeCleanup=null;});
}

function startOpenRoad(){
  const vehicles=[
    {id:"compact",name:"PIXEL COMPACT",icon:"🚗",color:"#31f5ff",cost:0,max:5.4,accel:.17,turn:.064,offroad:.72,stats:[65,65,45]},
    {id:"rally",name:"DUST RALLY",icon:"🚙",color:"#ffe84c",cost:80,max:5.8,accel:.2,turn:.058,offroad:.94,stats:[72,80,92]},
    {id:"sport",name:"NEON GT",icon:"🏎️",color:"#ff3eb5",cost:160,max:7.4,accel:.23,turn:.048,offroad:.56,stats:[100,78,35]},
    {id:"truck",name:"TITAN TRUCK",icon:"🛻",color:"#ff7043",cost:120,max:4.9,accel:.14,turn:.043,offroad:.86,stats:[55,48,84]}
  ];
  currentPlayer.vehicles ||= ["compact"];
  const garage=()=>{
    setStage(`<div class="big-icon">🏁</div><h3>NEON OPEN ROAD</h3><p>Válassz járgányt, majd fedezd fel a négy összefüggő biomot!</p><div class="vehicle-grid">${vehicles.map(v=>{const owned=currentPlayer.vehicles.includes(v.id);return `<button class="vehicle-card ${owned?"":"locked"}" data-vehicle="${v.id}"><span class="car-preview">${v.icon}</span><strong>${v.name}</strong><small>${owned?"INDÍTÁS":v.cost+" ● • FELOLDÁS"}</small><span class="vehicle-bars"><i style="--bar:${v.stats[0]}%"></i><i style="--bar:${v.stats[1]}%"></i><i style="--bar:${v.stats[2]}%"></i></span></button>`;}).join("")}</div><div class="biome-legend"><span><i style="background:#555d70"></i>NEON CITY</span><span><i style="background:#c99b4a"></i>SIVATAG</span><span><i style="background:#1d6a3e"></i>ERDŐ</span><span><i style="background:#d8ecf2"></i>HÓVIDÉK</span></div>`);
    $$("[data-vehicle]").forEach(btn=>btn.onclick=()=>{const car=vehicles.find(v=>v.id===btn.dataset.vehicle);if(!currentPlayer.vehicles.includes(car.id)){if(currentPlayer.coins<car.cost)return toast("NINCS ELÉG ÉRMÉD EHHEZ AZ AUTÓHOZ!");currentPlayer.coins-=car.cost;currentPlayer.vehicles.push(car.id);saveData();updateHud();toast(`${car.name} FELOLDVA!`);}launch(car);});
  };
  const launch=vehicle=>{
    setStage(`<div class="drive-shell"><div class="game-score">${vehicle.icon} ${vehicle.name} • SZABAD BEJÁRÁS</div><div class="canvas-wrap"><canvas id="drive-canvas" class="driving-canvas" width="720" height="480"></canvas><div class="drive-hud"><div class="drive-panel"><span id="drive-biome">NEON CITY</span><br>SEBESSÉG <strong id="drive-speed">0</strong><br>KÜLDETÉS <strong id="drive-mission">0</strong><div class="boost-track"><i id="boost-fill"></i></div></div><canvas id="road-map" class="mini-map" width="150" height="112"></canvas></div></div><div class="drive-controls"><button data-drive="left">◀</button><button data-drive="gas">▲</button><button data-drive="brake">▼</button><button data-drive="right">▶</button><button class="boost-button" data-drive="boost">BOOST</button></div><div class="biome-legend">WASD / NYILAK • SHIFT: BOOST • A CÉL A VILLOGÓ KÖR</div></div>`);
    const canvas=$("#drive-canvas"),ctx=canvas.getContext("2d"),mapCanvas=$("#road-map"),mctx=mapCanvas.getContext("2d");
    const world={w:2400,h:1800},keys=new Set();let car={x:480,y:430,angle:0,speed:0,boost:100},mission=0,ended=false,raf=0,last=performance.now(),targetIndex=1,mobileSteer=0,observedInputReset=mobileInput.resetSerial;
    const targets=[{x:480,y:430},{x:1680,y:430},{x:480,y:1330},{x:1680,y:1330},{x:1080,y:930}];
    const biomeAt=(x,y)=>y<900?(x<1200?"city":"desert"):(x<1200?"forest":"snow");
    const biomeNames={city:"NEON CITY",desert:"NAPLEMENTE-SIVATAG",forest:"FENYŐERDŐ",snow:"HÓVIDÉK"};
    const isRoad=(x,y)=>(x%300<100)||(y%300<100);
    const decor=[];for(let i=0;i<190;i++){const x=(i*137+83)%world.w,y=(i*251+107)%world.h;if(!isRoad(x,y))decor.push({x,y,type:biomeAt(x,y),variant:i%4});}
    const pickups=[];for(let i=0;i<30;i++)pickups.push({x:(i*347+190)%2200+80,y:(i*193+260)%1600+80,taken:false});
    const traffic=Array.from({length:15},(_,i)=>i%2?{x:(i*211)%world.w,y:45+(i%6)*300,axis:"x",speed:1.1+(i%3)*.35,color:["#ff3eb5","#ffe84c","#31f5ff"][i%3]}:{x:45+(i%8)*300,y:(i*173)%world.h,axis:"y",speed:1+(i%4)*.28,color:["#ff7043","#72ff77","#8e5bff"][i%3]});
    const keyMap={ArrowUp:"gas",w:"gas",ArrowDown:"brake",s:"brake",ArrowLeft:"left",a:"left",ArrowRight:"right",d:"right",Shift:"boost"};
    const keyDown=e=>{if(keyMap[e.key]){e.preventDefault();keys.add(keyMap[e.key]);}};const keyUp=e=>{if(keyMap[e.key])keys.delete(keyMap[e.key]);};window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);
    $$("[data-drive]").forEach(btn=>{const k=btn.dataset.drive;const on=e=>{e.preventDefault();keys.add(k);btn.classList.add("active");};const off=e=>{e.preventDefault();keys.delete(k);btn.classList.remove("active");};btn.addEventListener("pointerdown",on);btn.addEventListener("pointerup",off);btn.addEventListener("pointercancel",off);btn.addEventListener("pointerleave",off);});
    const drawRoads=()=>{ctx.fillStyle="#303242";for(let x=0;x<world.w;x+=300)ctx.fillRect(x,0,100,world.h);for(let y=0;y<world.h;y+=300)ctx.fillRect(0,y,world.w,100);ctx.strokeStyle="#e8d85a";ctx.lineWidth=3;ctx.setLineDash([18,20]);for(let x=50;x<world.w;x+=300){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,world.h);ctx.stroke();}for(let y=50;y<world.h;y+=300){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(world.w,y);ctx.stroke();}ctx.setLineDash([]);};
    const drawDecor=d=>{ctx.save();ctx.translate(d.x,d.y);if(d.type==="city"){ctx.fillStyle=["#452f69","#273963","#57304d"][d.variant%3];ctx.fillRect(-22,-22,44,44);ctx.fillStyle="#ffe84c";for(let y=-14;y<16;y+=12)for(let x=-14;x<16;x+=12)ctx.fillRect(x,y,5,5);}else if(d.type==="desert"){ctx.fillStyle="#207c45";ctx.fillRect(-4,-18,8,36);ctx.fillRect(-13,-7,10,7);ctx.fillRect(4,2,10,7);}else if(d.type==="forest"){ctx.fillStyle="#173c2c";ctx.fillRect(-3,7,6,15);ctx.fillStyle=d.variant%2?"#2b8b4e":"#17613a";ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.fill();}else{ctx.fillStyle="#73879c";ctx.beginPath();ctx.moveTo(-12,14);ctx.lineTo(0,-17);ctx.lineTo(14,14);ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(-6,-8,10,4);}ctx.restore();};
    const drawCar=(x,y,angle,color,player=false)=>{ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle="#08061d";ctx.fillRect(-17,-11,34,22);ctx.fillStyle=color;ctx.fillRect(-14,-9,28,18);ctx.fillStyle="#b8efff";ctx.fillRect(-3,-7,9,14);ctx.fillStyle=player?"#ffe84c":"#fff";ctx.fillRect(10,-7,5,4);ctx.fillRect(10,3,5,4);ctx.restore();};
    const drawMiniMap=()=>{mctx.fillStyle="#555d70";mctx.fillRect(0,0,75,56);mctx.fillStyle="#c99b4a";mctx.fillRect(75,0,75,56);mctx.fillStyle="#1d6a3e";mctx.fillRect(0,56,75,56);mctx.fillStyle="#d8ecf2";mctx.fillRect(75,56,75,56);mctx.fillStyle="rgba(20,20,30,.45)";for(let x=0;x<150;x+=19)mctx.fillRect(x,0,6,112);for(let y=0;y<112;y+=19)mctx.fillRect(0,y,150,6);const target=targets[targetIndex];mctx.fillStyle="#ff3eb5";mctx.beginPath();mctx.arc(target.x/world.w*150,target.y/world.h*112,4,0,Math.PI*2);mctx.fill();mctx.fillStyle="#ffe84c";mctx.beginPath();mctx.arc(car.x/world.w*150,car.y/world.h*112,3,0,Math.PI*2);mctx.fill();};
    const update=dt=>{const road=isRoad(car.x,car.y),surface=road?1:vehicle.offroad;if(keys.has("gas"))car.speed+=vehicle.accel*dt;if(keys.has("brake"))car.speed-=vehicle.accel*.72*dt;if(!keys.has("gas")&&!keys.has("brake"))car.speed*=Math.pow(.965,dt);let max=vehicle.max*surface;if(keys.has("boost")&&car.boost>0&&car.speed>0){max*=1.42;car.speed+=vehicle.accel*.8*dt;car.boost=Math.max(0,car.boost-.75*dt);}else car.boost=Math.min(100,car.boost+.18*dt);car.speed=Math.max(-max*.45,Math.min(max,car.speed));const steer=(keys.has("right")?1:0)-(keys.has("left")?1:0);if(Math.abs(car.speed)>.12)car.angle+=steer*vehicle.turn*Math.min(1,Math.abs(car.speed)/2)*Math.sign(car.speed)*dt;car.x+=Math.cos(car.angle)*car.speed*dt;car.y+=Math.sin(car.angle)*car.speed*dt;if(car.x<18||car.x>world.w-18){car.x=Math.max(18,Math.min(world.w-18,car.x));car.speed*=-.25;}if(car.y<18||car.y>world.h-18){car.y=Math.max(18,Math.min(world.h-18,car.y));car.speed*=-.25;}traffic.forEach(n=>{if(n.axis==="x")n.x=(n.x+n.speed*dt)%world.w;else n.y=(n.y+n.speed*dt)%world.h;if(Math.hypot(car.x-n.x,car.y-n.y)<28)car.speed*=-.3;});pickups.forEach(p=>{if(!p.taken&&Math.hypot(car.x-p.x,car.y-p.y)<25){p.taken=true;grant(2,1);}});const target=targets[targetIndex];if(Math.hypot(car.x-target.x,car.y-target.y)<65){mission++;targetIndex=(targetIndex+1)%targets.length;grant(25,15,"CHECKPOINT! +25 ÉRME");}$("#drive-speed").textContent=Math.round(Math.abs(car.speed)*28);$("#drive-biome").textContent=biomeNames[biomeAt(car.x,car.y)];$("#drive-mission").textContent=mission;$("#boost-fill").style.width=`${car.boost}%`;};
    const draw=()=>{const camX=Math.max(0,Math.min(world.w-720,car.x-360)),camY=Math.max(0,Math.min(world.h-480,car.y-240));ctx.save();ctx.translate(-camX,-camY);ctx.fillStyle="#555d70";ctx.fillRect(0,0,1200,900);ctx.fillStyle="#c99b4a";ctx.fillRect(1200,0,1200,900);ctx.fillStyle="#1d6a3e";ctx.fillRect(0,900,1200,900);ctx.fillStyle="#d8ecf2";ctx.fillRect(1200,900,1200,900);drawRoads();decor.forEach(drawDecor);pickups.filter(p=>!p.taken).forEach(p=>{ctx.fillStyle="#ffe84c";ctx.beginPath();ctx.arc(p.x,p.y,7,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff3a0";ctx.fillRect(p.x-2,p.y-5,3,5);});const target=targets[targetIndex],pulse=26+Math.sin(performance.now()/180)*8;ctx.strokeStyle="#ff3eb5";ctx.lineWidth=6;ctx.beginPath();ctx.arc(target.x,target.y,pulse,0,Math.PI*2);ctx.stroke();traffic.forEach(n=>drawCar(n.x,n.y,n.axis==="x"?0:Math.PI/2,n.color));drawCar(car.x,car.y,car.angle,vehicle.color,true);ctx.restore();drawMiniMap();};
    const drawOutlawOverlay=()=>{const a=actor(),camX=Math.max(0,Math.min(world.w-720,a.x-360)),camY=Math.max(0,Math.min(world.h-480,a.y-240)),visible=o=>o.x>camX-90&&o.x<camX+810&&o.y>camY-90&&o.y<camY+570,t=performance.now();ctx.save();ctx.translate(-camX,-camY);
      jobSites.filter(visible).forEach(s=>{const j=jobTypes[s.type],pulse=18+Math.sin(t/180)*4;ctx.fillStyle="rgba(49,245,255,.16)";ctx.beginPath();ctx.arc(s.x,s.y,pulse,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#31f5ff";ctx.lineWidth=3;ctx.stroke();ctx.fillStyle="#fff";ctx.font="16px sans-serif";ctx.textAlign="center";ctx.fillText(j.icon,s.x,s.y+6);});
      if(activeJob){const wp=activeJob.waypoints[activeJob.index];ctx.strokeStyle="#ffe84c";ctx.lineWidth=5;ctx.beginPath();ctx.arc(wp.x,wp.y,30+Math.sin(t/130)*7,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#ffe84c";ctx.font="bold 11px monospace";ctx.fillText("JOB",wp.x,wp.y+4);}
      roadblocks.filter(b=>!b.hit&&visible(b)).forEach(b=>{ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle);ctx.fillStyle="#ff7043";ctx.fillRect(-44,-7,88,14);ctx.fillStyle="#fff";for(let x=-36;x<40;x+=20)ctx.fillRect(x,-7,10,14);ctx.restore();});
      police.filter(visible).forEach(p=>{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillStyle=p.kind==="unit"?"#09020e":p.kind==="armored"?"#202632":"#e8edf5";ctx.fillRect(-20,-12,40,24);ctx.fillStyle=p.kind==="interceptor"?"#151a2a":"#303642";ctx.fillRect(-8,-9,16,18);ctx.fillStyle=Math.floor(t/120)%2?"#ff214f":"#3185ff";ctx.fillRect(-4,-13,9,4);if(p.kind==="unit"){ctx.strokeStyle="#ff3eb5";ctx.lineWidth=3;ctx.strokeRect(-22,-14,44,28);}ctx.restore();});ctx.restore();
      if(isNight()){const hour=gameMinutes/60,dark=hour>=21||hour<5?.58:.36;ctx.fillStyle=`rgba(3,4,20,${dark})`;ctx.fillRect(0,0,720,480);ctx.save();ctx.translate(-camX,-camY);streetProps.filter(p=>p.type===2&&visible(p)).forEach(p=>{const g=ctx.createRadialGradient(p.x,p.y-22,2,p.x,p.y-22,66);g.addColorStop(0,"rgba(255,235,150,.65)");g.addColorStop(1,"rgba(255,220,110,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y-22,66,0,Math.PI*2);ctx.fill();});if(mode==="car"&&currentCar.condition.headlights>8){ctx.save();ctx.translate(currentCar.x,currentCar.y);ctx.rotate(currentCar.angle);const beam=ctx.createLinearGradient(15,0,170,0);beam.addColorStop(0,`rgba(220,245,255,${.25*currentCar.condition.headlights/100})`);beam.addColorStop(1,"rgba(220,245,255,0)");ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(12,-12);ctx.lineTo(180,-62);ctx.lineTo(180,62);ctx.lineTo(12,12);ctx.closePath();ctx.fill();ctx.restore();}ctx.restore();}
      if(biomeAt(a.x,a.y)==="rainforest"&&isNight()){ctx.fillStyle="rgba(49,245,255,.08)";for(let i=0;i<9;i++)ctx.fillRect((i*91+t*.04)%760,300+(i%3)*42,75,3);}
      const sx=x=>x/world.w*mapCanvas.width,sy=y=>y/world.h*mapCanvas.height;if(activeJob){const wp=activeJob.waypoints[activeJob.index];mctx.fillStyle="#ffe84c";mctx.beginPath();mctx.arc(sx(wp.x),sy(wp.y),5,0,Math.PI*2);mctx.fill();}police.forEach(p=>{mctx.fillStyle="#ff214f";mctx.fillRect(sx(p.x)-2,sy(p.y)-2,4,4);});
    };
    const loop=now=>{if(ended)return;const dt=Math.min(2,(now-last)/16.67);last=now;update(dt); draw();raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);
    setActiveCleanup(()=>{ended=true;cancelAnimationFrame(raf);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);});
  };
  garage();
}

function startOpenRoadSurvival(vehicle){
  const routes={
    highway:{name:"HIGHWAY",icon:"🛣️",desc:"Fast • dense traffic • higher reward",reward:1.45,density:1.65,grip:1,scrap:1},
    backroad:{name:"BACK ROAD",icon:"🌲",desc:"Slower • sharp corners • fewer vehicles",reward:1,density:.62,grip:.82,scrap:1},
    industrial:{name:"INDUSTRIAL ROUTE",icon:"🏭",desc:"Obstacles • trucks • increased scrap",reward:1.2,density:1.05,grip:.92,scrap:1.8}
  };
  const events=["clear","rain","fog","roadworks","police"],eventNames={clear:"CLEAR ROAD",rain:"RAIN • LOW GRIP",fog:"FOG • LOW VISIBILITY",roadworks:"ROADWORKS • LANE CLOSED",police:"POLICE PURSUIT"};
  const carCondition={engine:100,tires:100,body:100,fuel:100};
  const stats=currentPlayer.gameStats.openroad||={plays:0,wins:0,losses:0,draws:0,best:null};
  let route=null,event="clear",speed=0,distance=0,profit=0,scrap=0,danger=0,elapsed=0,routeElapsed=0,checkpointAt=45,eventAt=18,averageTotal=0,averageTicks=0,lane=1,targetLane=1,objects=[],ended=false,paused=true,raf=0,last=performance.now(),spawnClock=0;
  const selectRoute=(riskOnly=false)=>{
    paused=true;
    const choices=Object.entries(routes).filter(([id])=>!riskOnly||id!=="backroad");
    setStage(`<section class="road-run-select"><header><span>🏁</span><div><small>OPEN ROAD // SURVIVAL RUN</small><h3>${riskOnly?"RISK ROUTE DECISION":"CHOOSE YOUR ROUTE"}</h3></div></header><div class="route-choice-grid">${choices.map(([id,r])=>`<button data-run-route="${id}"><i>${r.icon}</i><b>${r.name}</b><small>${r.desc}</small><span>REWARD ×${r.reward} • TRAFFIC ×${r.density}</span></button>`).join("")}</div><div class="road-records"><span>BEST DISTANCE <b>${Math.floor(stats.bestDistance||0)} m</b></span><span>CLEANEST RUN <b>${Math.round(stats.cleanestRun||0)}%</b></span><span>TOP AVG SPEED <b>${Math.round(stats.highestAverageSpeed||0)}</b></span><span>BEST PROFIT <b>${stats.greatestProfit||0} ●</b></span></div></section>`);
    $$("[data-run-route]").forEach(button=>button.onclick=()=>{route=routes[button.dataset.runRoute];route.id=button.dataset.runRoute;paused=false;renderRoad();last=performance.now();raf=requestAnimationFrame(loop);});
  };
  const hud=()=>`<div class="road-survival-hud"><span>${route.icon} <b id="run-route">${route.name}</b></span><span>SPEED <b id="run-speed">0</b></span><span>DIST <b id="run-distance">0 m</b></span><span>PROFIT <b id="run-profit">0</b></span><span>EVENT <b id="run-event">${eventNames[event]}</b></span></div><div class="car-condition-grid">${Object.entries(carCondition).map(([key,value])=>`<span>${key.toUpperCase()} <i><em id="condition-${key}" style="width:${value}%"></em></i><b id="condition-${key}-value">${Math.round(value)}</b></span>`).join("")}</div>`;
  const renderRoad=()=>{
    setStage(`<section class="road-survival">${hud()}<div class="road-canvas-wrap"><canvas id="road-survival-canvas" width="720" height="460"></canvas><div id="road-event-flash"></div></div><div class="drive-controls"><button data-run-move="-1">◀</button><button data-run-gas="1">▲</button><button data-run-brake="1">▼</button><button data-run-move="1">▶</button><button id="run-end" class="boost-button">END RUN</button></div><p id="run-message" class="result">← → change lane • ↑ accelerate • ↓ brake • collect fuel and repair crates.</p></section>`);
    $$("[data-run-move]").forEach(button=>button.onclick=()=>{targetLane=Math.max(0,Math.min(2,targetLane+(+button.dataset.runMove)));danger+=speed>115?7:2;});
    $("[data-run-gas]").onpointerdown=()=>speed+=12;$("[data-run-brake]").onpointerdown=()=>speed=Math.max(0,speed-28);$("#run-end").onclick=()=>finish(false,true);
    const key=e=>{if(ended||paused)return;if(["ArrowLeft","a","A"].includes(e.key)){targetLane=Math.max(0,targetLane-1);danger+=speed>115?7:2;}if(["ArrowRight","d","D"].includes(e.key)){targetLane=Math.min(2,targetLane+1);danger+=speed>115?7:2;}if(["ArrowUp","w","W"].includes(e.key))speed+=10;if(["ArrowDown","s","S"].includes(e.key))speed=Math.max(0,speed-25);};window.addEventListener("keydown",key);setActiveCleanup(()=>{ended=true;cancelAnimationFrame(raf);window.removeEventListener("keydown",key);});
  };
  const checkpoint=()=>{
    paused=true;cancelAnimationFrame(raf);const price=15;
    setStage(`<section class="road-checkpoint"><div class="big-icon">⛽</div><small>CHECKPOINT • ${Math.floor(distance)} m • ${profit} ●</small><h3>PIT DECISION</h3><div class="checkpoint-actions"><button data-pit="body">🔧<b>REPAIR BODY</b><small>${price} profit • +30 body</small></button><button data-pit="fuel">⛽<b>REFUEL</b><small>${price} profit • +38 fuel</small></button><button data-pit="tires">🛞<b>UPGRADE TIRES</b><small>${price} profit • +25 tires</small></button><button data-pit="risk">⚠️<b>TAKE THE RISK ROUTE</b><small>New high-yield route decision</small></button></div></section>`);
    $$("[data-pit]").forEach(button=>button.onclick=()=>{const action=button.dataset.pit;if(action==="risk")return selectRoute(true);if(profit<price)return toast("NOT ENOUGH RUN PROFIT");profit-=price;if(action==="body")carCondition.body=Math.min(100,carCondition.body+30);if(action==="fuel")carCondition.fuel=Math.min(100,carCondition.fuel+38);if(action==="tires")carCondition.tires=Math.min(100,carCondition.tires+25);paused=false;renderRoad();last=performance.now();raf=requestAnimationFrame(loop);});
  };
  const spawn=()=>{
    const pickup=Math.random()<.14,type=pickup?(Math.random()<.52?"fuel":"repair"):(route.id==="industrial"&&Math.random()<.45?"obstacle":Math.random()<.25?"truck":"car");
    let objectLane=Math.floor(Math.random()*3);if(event==="roadworks"&&objectLane===0)objectLane=1;
    objects.push({lane:objectLane,y:-55,type,speed:type==="truck"?1.1:type==="obstacle"?.8:1.6});
  };
  const setEvent=()=>{
    if(danger>=35)event="police";else event=events[Math.floor(Math.random()*4)];eventAt=elapsed+18+Math.random()*14;
    const flash=$("#road-event-flash");if(flash){flash.textContent=eventNames[event];flash.className="show";setTimeout(()=>flash?.classList.remove("show"),1200);}
  };
  const update=dt=>{
    const engineFactor=.42+.58*carCondition.engine/100,tireFactor=.45+.55*carCondition.tires/100,weatherGrip=event==="rain"?.58:1,routeGrip=route.grip;
    const maxSpeed=(vehicle.max||6)*26*engineFactor*(route.id==="highway"?1.12:route.id==="backroad"?.78:.92);speed+=(75-speed)*.0025*dt;speed=Math.max(0,Math.min(maxSpeed,speed));
    lane+=(targetLane-lane)*.11*tireFactor*weatherGrip*routeGrip*dt;distance+=speed/3600*dt*16.67;elapsed+=dt/60;routeElapsed+=dt/60;carCondition.fuel-=speed*.000105*dt;danger=Math.max(0,danger-.012*dt);
    averageTotal+=speed;averageTicks++;spawnClock-=dt;if(spawnClock<=0){spawn();spawnClock=Math.max(18,58/(route.density+(event==="police"?.8:0)));}
    objects.forEach(o=>o.y+=(2.4+speed/48)*o.speed*dt);objects.forEach(o=>{if(o.hit||o.y<365||o.y>445||Math.abs(o.lane-lane)>.38)return;o.hit=true;if(o.type==="fuel"){carCondition.fuel=Math.min(100,carCondition.fuel+22);profit+=5;$("#run-message").textContent="FUEL PICKUP • +22 fuel";}else if(o.type==="repair"){carCondition.body=Math.min(100,carCondition.body+18);profit+=5;$("#run-message").textContent="REPAIR PICKUP • +18 body";}else{const heavy=o.type==="truck"||o.type==="obstacle",impact=(heavy?18:11)*(speed/90);carCondition.body=Math.max(0,carCondition.body-impact);carCondition.engine=Math.max(0,carCondition.engine-impact*.42);carCondition.tires=Math.max(0,carCondition.tires-impact*.28);speed*=.42;danger+=heavy?14:9;$("#run-message").textContent=`IMPACT • ${heavy?"HEAVY DAMAGE":"BODY DAMAGE"}`;}});
    objects=objects.filter(o=>o.y<500&&!o.hit);profit=Math.max(0,Math.floor(distance*.055*route.reward+scrap*route.scrap));if(route.id==="industrial")scrap+=.0025*speed*dt;
    if(elapsed>=eventAt)setEvent();if(routeElapsed>=150){routeElapsed=0;paused=true;cancelAnimationFrame(raf);return selectRoute();}if(elapsed>=checkpointAt){checkpointAt+=45;return checkpoint();}if(carCondition.fuel<=0)return finish(false);if(carCondition.body<=0)return finish(false);
    $("#run-speed")?.replaceChildren(String(Math.round(speed)));$("#run-distance")?.replaceChildren(`${Math.floor(distance)} m`);$("#run-profit")?.replaceChildren(String(profit));$("#run-event")?.replaceChildren(eventNames[event]);Object.entries(carCondition).forEach(([key,value])=>{const bar=$(`#condition-${key}`),label=$(`#condition-${key}-value`);if(bar)bar.style.width=`${Math.max(0,value)}%`;if(label)label.textContent=Math.round(value);});
  };
  const draw=()=>{
    const canvas=$("#road-survival-canvas");if(!canvas)return;const ctx=canvas.getContext("2d"),fog=event==="fog";ctx.fillStyle="#090718";ctx.fillRect(0,0,720,460);ctx.fillStyle=route.id==="industrial"?"#34333a":route.id==="backroad"?"#173724":"#242837";ctx.fillRect(120,0,480,460);ctx.strokeStyle="#ffe84c";ctx.lineWidth=4;ctx.setLineDash([30,24]);for(let x=280;x<=440;x+=160){ctx.beginPath();ctx.moveTo(x,-(distance*8)%54);ctx.lineTo(x,480);ctx.stroke();}ctx.setLineDash([]);if(event==="roadworks"){ctx.fillStyle="#ff7043";for(let y=0;y<460;y+=55)ctx.fillRect(145,y,28,24);}objects.forEach(o=>{const x=200+o.lane*160;ctx.font="34px sans-serif";ctx.textAlign="center";ctx.fillText({fuel:"⛽",repair:"🔧",truck:"🚛",obstacle:"🚧",car:"🚙"}[o.type],x,o.y);});ctx.font="44px sans-serif";ctx.fillText(vehicle.icon||"🚗",200+lane*160,410);if(event==="rain"){ctx.strokeStyle="rgba(150,210,255,.55)";for(let i=0;i<45;i++){const x=(i*83+performance.now()*.3)%740;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-25,460);ctx.stroke();}}if(fog){ctx.fillStyle="rgba(225,235,240,.76)";ctx.fillRect(0,0,720,300);}if(event==="police"){ctx.fillStyle=Math.floor(performance.now()/180)%2?"rgba(255,0,40,.13)":"rgba(20,80,255,.15)";ctx.fillRect(0,0,720,460);}};
  const loop=now=>{if(ended||paused)return;const dt=Math.min(2.2,(now-last)/16.67);last=now;update(dt);draw();if(!paused&&!ended)raf=requestAnimationFrame(loop);};
  const finish=(survived=false,manual=false)=>{
    if(ended)return;ended=true;paused=true;cancelAnimationFrame(raf);const avg=averageTicks?averageTotal/averageTicks:0,bodyReward=carCondition.body/100,payout=Math.floor(profit*bodyReward);stats.bestDistance=Math.max(stats.bestDistance||0,distance);stats.cleanestRun=Math.max(stats.cleanestRun||0,carCondition.body);stats.highestAverageSpeed=Math.max(stats.highestAverageSpeed||0,avg);stats.greatestProfit=Math.max(stats.greatestProfit||0,payout);
    setStage(`<section class="road-run-summary"><div class="big-icon">${carCondition.fuel<=0?"⛽":carCondition.body<=0?"💥":"🏁"}</div><h3>${manual?"RUN BANKED":survived?"SURVIVAL COMPLETE":"RUN OVER"}</h3><div class="career-grid"><article><span>DISTANCE</span><b>${Math.floor(distance)} m</b></article><article><span>AVG SPEED</span><b>${Math.round(avg)}</b></article><article><span>BODY</span><b>${Math.round(carCondition.body)}%</b></article><article><span>PROFIT</span><b>${payout} ●</b></article></div><p>Body condition applied a ×${bodyReward.toFixed(2)} final reward modifier.</p><button id="road-again" class="pixel-btn primary">NEW SURVIVAL RUN</button></section>`);saveData();reward(payout,payout?35:5,{result:payout?"win":"loss",score:Math.floor(distance)});$("#road-again").onclick=()=>startOpenRoadSurvival(vehicle);
  };
  selectRoute();
}

function startOpenRoadV2(launchOptions={}){
  const vehicles=[
    {id:"compact",name:"PIXEL COMPACT",icon:"🚗",color:"#31f5ff",cost:0,max:5.4,accel:.17,turn:.064,offroad:.72,stats:[65,65,45]},
    {id:"rally",name:"DUST RALLY",icon:"🚙",color:"#ffe84c",cost:80,max:5.8,accel:.2,turn:.058,offroad:.94,stats:[72,80,92]},
    {id:"sport",name:"NEON GT",icon:"🏎️",color:"#ff3eb5",cost:160,max:7.4,accel:.23,turn:.048,offroad:.56,stats:[100,78,35]},
    {id:"truck",name:"TITAN TRUCK",icon:"🛻",color:"#ff7043",cost:120,max:4.9,accel:.14,turn:.043,offroad:.86,stats:[55,48,84]},
    {id:"jungle",name:"JUNGLE BUGGY",icon:"🏕️",color:"#75ff66",cost:145,max:6.1,accel:.21,turn:.064,offroad:.98,stats:[78,90,100]},
    {id:"swamp",name:"SWAMP CRAWLER",icon:"🐊",color:"#9ac45b",cost:180,max:5.2,accel:.16,turn:.057,offroad:1,stats:[62,72,100]},
    {id:"volcano",name:"MAGMA TRAILBLAZER",icon:"🌋",color:"#ff4b2b",cost:230,max:6.4,accel:.22,turn:.056,offroad:.96,stats:[84,82,96]},
    {id:"coast",name:"COAST CRUISER",icon:"🏖️",color:"#28d7d1",cost:210,max:6.8,accel:.2,turn:.061,offroad:.9,stats:[90,88,82]},
    {id:"crystal",name:"PRIZMA INTERCEPTOR",icon:"💎",color:"#b86dff",cost:280,max:7.1,accel:.225,turn:.062,offroad:.88,stats:[94,90,78]},
    {id:"moon",name:"LUNAR ROVER",icon:"🌙",color:"#d9e5ff",cost:260,max:5.9,accel:.18,turn:.069,offroad:1,stats:[70,96,100]},
    {id:"candy",name:"CANDY COMET",icon:"🍬",color:"#ff78c8",cost:300,max:7,accel:.25,turn:.066,offroad:.84,stats:[92,100,72]},
    {id:"scarab",name:"ARANY SZKARABEUSZ",icon:"🪲",color:"#ffd447",cost:0,max:7.7,accel:.245,turn:.062,offroad:.98,stats:[100,94,96],hidden:true},
    {id:"frost-ufo",name:"FROST UFO",icon:"🛸",color:"#9cecff",cost:0,max:8.1,accel:.27,turn:.072,offroad:1,stats:[100,100,100],hidden:true},
    {id:"magma-phantom",name:"MAGMA PHANTOM",icon:"🔥",color:"#ff3b21",cost:0,max:8.3,accel:.265,turn:.06,offroad:.97,stats:[100,96,94],hidden:true},
    {id:"crystal-ghost",name:"KRISTÁLYSZELLEM",icon:"🔮",color:"#dca8ff",cost:0,max:8.5,accel:.28,turn:.075,offroad:1,stats:[100,100,100],hidden:true},
    {id:"candy-kart",name:"CUKORSOKK KART",icon:"🧁",color:"#ff9ddd",cost:0,max:7.9,accel:.3,turn:.08,offroad:.92,stats:[98,100,86],hidden:true}
    ,{id:"storm-chaser",name:"STORM CHASER",icon:"⚡",color:"#78d8ff",cost:0,max:8.2,accel:.27,turn:.068,offroad:.94,stats:[100,98,88],hidden:true,rare:true}
    ,{id:"voidrunner",name:"1987 VOIDRUNNER",icon:"🌌",color:"#b15cff",cost:0,max:8.7,accel:.29,turn:.073,offroad:.91,stats:[100,100,82],hidden:true,rare:true}
  ];
  const byId=id=>vehicles.find(v=>v.id===id)||vehicles[0];
  currentPlayer.vehicles ||= ["compact"];
  currentPlayer.secrets ||= [];
  currentPlayer.tuning ||= {};
  currentPlayer.openRoadMissions ||= {};
  currentPlayer.openRoadGarage ||= {};
  currentPlayer.openRoadJobs ||= {completed:0,gold:0,bestRatings:{}};
  const carRecord=id=>currentPlayer.openRoadGarage[id]||=( {mileage:0,condition:100,races:0,wins:0,jobs:0,acquired:Date.now()} );
  currentPlayer.vehicles.forEach(carRecord);
  const tuningOf=id=>currentPlayer.tuning[id]||={engine:0,grip:0,boost:0};
  const tunedVehicle=v=>{const t=tuningOf(v.id);return {...v,max:v.max*(1+t.engine*.07),accel:v.accel*(1+t.engine*.05),turn:v.turn*(1+t.grip*.05),offroad:Math.min(1.08,v.offroad+t.grip*.025),boostDrain:.75*(1-t.boost*.1),boostRecharge:.18*(1+t.boost*.16)};};
  const tuningShop=id=>{
    const v=byId(id),t=tuningOf(id),upgrade=(part,label,icon)=>{const level=t[part],price=60+level*70;return `<article class="tune-item"><span>${icon}</span><div><b>${label}</b><small>LVL ${level}/5</small></div><button class="pixel-btn secondary" data-upgrade="${part}" ${level>=5?"disabled":""}>${level>=5?"MAX":price+" ●"}</button></article>`;};
    setStage(`<div class="big-icon">🔧</div><h3>${v.name} • TUNINGMŰHELY</h3><p>Az összes fejlesztés véglegesen ehhez az autóhoz tartozik.</p><div class="tuning-grid">${upgrade("engine","MOTOR","⚙️")}${upgrade("grip","FUTÓMŰ","🛞")}${upgrade("boost","NITRO","🚀")}</div><button id="garage-back" class="pixel-btn primary">← VISSZA A GARÁZSBA</button>`);
    $$('[data-upgrade]').forEach(btn=>btn.onclick=()=>{const part=btn.dataset.upgrade,level=t[part],price=60+level*70;if(level>=5)return;if(currentPlayer.coins<price)return toast("NINCS ELÉG ÉRMÉD A TUNINGHOZ!");currentPlayer.coins-=price;t[part]++;saveData();updateHud();toast(`${v.name} • FEJLESZTÉS LVL ${t[part]}`);tuningShop(id);});$("#garage-back").onclick=garage;
  };
  const garage=()=>{
    const visibleVehicles=vehicles.filter(v=>!v.hidden||currentPlayer.vehicles.includes(v.id));
    const done=Object.keys(currentPlayer.openRoadMissions).length;
    setStage(`<div class="big-icon">🚔</div><h3>NEON OPEN ROAD: OUTLAW</h3><p>Wanted rendszer, sérülésmodell, nappal/éjszaka, valódi munkák és gyűjthető autók. Biomküldetések: <strong>${done}/11</strong> • Munkák: <strong>${currentPlayer.openRoadJobs.completed||0}</strong>.</p><div class="vehicle-grid">${visibleVehicles.map(v=>{const owned=currentPlayer.vehicles.includes(v.id),t=tuningOf(v.id),r=carRecord(v.id);return `<article class="vehicle-card ${owned?"":"locked"}"><button class="vehicle-main" data-vehicle-v2="${v.id}"><span class="car-preview">${v.icon}</span><strong>${v.name}</strong><small>${owned?`${Math.floor(r.mileage)} KM • ${Math.round(r.condition)}% • ${r.wins}/${r.races} WIN`:v.cost+" ● • FELOLDÁS"}</small><span class="vehicle-bars"><i style="--bar:${Math.min(100,v.stats[0]+t.engine*5)}%"></i><i style="--bar:${Math.min(100,v.stats[1]+t.grip*5)}%"></i><i style="--bar:${Math.min(100,v.stats[2]+t.boost*5)}%"></i></span></button>${owned?`<div class="ownership-stats"><span>ENGINE LV.${t.engine}</span><span>JOBS ${r.jobs}</span></div><button class="tune-btn" data-tune="${v.id}">🔧 TUNING</button><button class="road-run-btn" data-road-run="${v.id}">🏁 SURVIVAL RUN</button>`:""}</article>`;}).join("")}</div><div class="biome-legend"><span>🏙️ VÁROS</span><span>🌵 SIVATAG</span><span>🌴 ESŐERDŐ</span><span>🌲 ERDŐ</span><span>❄️ HÓVIDÉK</span><span>🐊 MOCSÁR</span><span>🌋 VULKÁNVIDÉK</span><span>🏖️ PARTVIDÉK</span><span>💎 KRISTÁLYVÖLGY</span><span>🌙 HOLDMEZŐ</span><span>🍬 CUKORVIDÉK</span></div>`);
    $$("[data-vehicle-v2]").forEach(btn=>btn.onclick=()=>{const chosen=byId(btn.dataset.vehicleV2);if(!currentPlayer.vehicles.includes(chosen.id)){if(currentPlayer.coins<chosen.cost)return toast("NINCS ELÉG ÉRMÉD EHHEZ AZ AUTÓHOZ!");currentPlayer.coins-=chosen.cost;currentPlayer.vehicles.push(chosen.id);saveData();updateHud();toast(`${chosen.name} FELOLDVA!`);}launch(chosen);});
    $$("[data-tune]").forEach(btn=>btn.onclick=()=>tuningShop(btn.dataset.tune));
    $$("[data-road-run]").forEach(btn=>btn.onclick=()=>startOpenRoadSurvival(tunedVehicle(byId(btn.dataset.roadRun))));
  };
  const launch=starter=>{
    setStage(`<div class="drive-shell outlaw"><div class="game-score">OPEN ROAD // OUTLAW UPDATE <b id="road-clock">20:30</b></div><div class="canvas-wrap"><canvas id="drive-canvas-v2" class="driving-canvas" width="720" height="480"></canvas><div class="drive-hud"><div class="drive-panel"><span id="drive-biome">NEON CITY</span> • <span id="drive-time">20:30</span><br><span id="drive-mode">🚗 ${starter.name}</span><br>SEBESSÉG <strong id="drive-speed">0</strong> • HEAT <strong id="drive-heat">○ ○ ○ ○ ○</strong><div class="outlaw-condition"><span>ENGINE <i><em id="damage-engine"></em></i></span><span>TIRES <i><em id="damage-tires"></em></i></span><span>BODY <i><em id="damage-body"></em></i></span><span>FUEL <i><em id="damage-fuel"></em></i></span></div><small id="drive-job"></small><small id="drive-objective"></small><small id="drive-prompt"></small></div><canvas id="road-map-v2" class="mini-map detailed" width="220" height="160" title="Részletes OpenRoad térkép"></canvas></div><div id="outlaw-alert"></div></div><div class="drive-controls v2"><button data-drive-v2="left">◀</button><button data-drive-v2="gas">▲</button><button data-drive-v2="brake">▼</button><button data-drive-v2="right">▶</button><button class="boost-button" data-drive-v2="boost">BOOST</button><button class="interact-button" data-drive-v2="interact">E</button></div><div class="biome-legend">WASD / NYILAK • SHIFT: BOOST • E: AUTÓ / GARÁZS / JOB • szakítsd meg a rendőrségi látóvonalat a meneküléshez</div></div>`);
    const canvas=$("#drive-canvas-v2"),ctx=canvas.getContext("2d"),mapCanvas=$("#road-map-v2"),mctx=mapCanvas.getContext("2d");
    const world={w:5200,h:4800},cell={w:1300,h:1600},keys=new Set(),biomeGrid=[["city","desert","volcano","rainforest"],["forest","snow","swamp","coast"],["crystal","moon","candy","city"]];
    const biomeNames={city:"NEON CITY",desert:"ARANY-SIVATAG",volcano:"OBSZIDIÁN-FENNSÍK",rainforest:"MONSZUN-ESŐERDŐ",forest:"FENYŐERDŐ",snow:"HÓVIDÉK",swamp:"KÖDÖS MOCSÁR",coast:"AZÚR PARTVIDÉK",crystal:"KRISTÁLYVÖLGY",moon:"HOLDMEZŐ",candy:"CUKORVIDÉK"};
    const biomeColors={city:"#555d70",desert:"#c99b4a",volcano:"#4d3939",rainforest:"#176a43",forest:"#1d5b39",snow:"#d8ecf2",swamp:"#405f3a",coast:"#d2bb78",crystal:"#5a3b86",moon:"#676c7f",candy:"#d98cbd"};
    const biomeAt=(x,y)=>biomeGrid[Math.min(2,Math.floor(y/cell.h))][Math.min(3,Math.floor(x/cell.w))];
    const roads=[...([620,1950,3250,4550].map(pos=>({axis:"v",pos,width:210}))),...([760,1600,2440,3200,4040].map(pos=>({axis:"h",pos,width:210}))),...([260,520,1040,1300].map(pos=>({axis:"h",pos,width:170,from:0,to:1300}))),...([260,520,780,1040].map(pos=>({axis:"v",pos,width:170,from:0,to:1600})))];
    const roadLimits=r=>({from:r.from??0,to:r.to??(r.axis==="v"?world.h:world.w)});
    const roadContains=(r,x,y,pad=0)=>{const {from,to}=roadLimits(r),along=r.axis==="v"?y:x,cross=r.axis==="v"?x:y;return along>=from-pad&&along<=to+pad&&Math.abs(cross-r.pos)<=r.width/2+pad;};
    const nearestRoadPoint=(point,pad=0)=>{let best=null;roads.forEach((road,index)=>{const {from,to}=roadLimits(road),along=Math.max(from+pad,Math.min(to-pad,road.axis==="v"?point.y:point.x)),candidate=road.axis==="v"?{x:road.pos,y:along}:{x:along,y:road.pos},distance=Math.hypot(point.x-candidate.x,point.y-candidate.y);if(!best||distance<best.distance)best={...candidate,road,index,distance};});return best;};
    const roadNodes=[],roadNodeByKey=new Map(),roadLinks=[];
    const addRoadNode=(x,y)=>{const key=`${x}:${y}`;if(roadNodeByKey.has(key))return roadNodeByKey.get(key);const index=roadNodes.length;roadNodes.push({x,y});roadNodeByKey.set(key,index);roadLinks.push([]);return index;};
    roads.forEach((a,ai)=>roads.forEach((b,bi)=>{if(bi<=ai||a.axis===b.axis)return;const v=a.axis==="v"?a:b,h=a.axis==="h"?a:b,x=v.pos,y=h.pos;if(roadContains(v,x,y)&&roadContains(h,x,y))addRoadNode(x,y);}));
    roads.forEach(road=>{const nodes=roadNodes.map((node,index)=>({node,index})).filter(({node})=>roadContains(road,node.x,node.y,1)).sort((a,b)=>(road.axis==="v"?a.node.y-b.node.y:a.node.x-b.node.x));for(let i=1;i<nodes.length;i++){const a=nodes[i-1].index,b=nodes[i].index,cost=Math.hypot(roadNodes[a].x-roadNodes[b].x,roadNodes[a].y-roadNodes[b].y);roadLinks[a].push({to:b,cost});roadLinks[b].push({to:a,cost});}});
    const nearestRoadNode=point=>{let best=0,distance=Infinity;roadNodes.forEach((node,index)=>{const d=Math.hypot(point.x-node.x,point.y-node.y);if(d<distance){best=index;distance=d;}});return best;};
    const nextRoadNode=(from,to)=>{const start=nearestRoadNode(from),goal=nearestRoadNode(to);if(start===goal)return roadNodes[goal];const distance=roadNodes.map(()=>Infinity),previous=roadNodes.map(()=>-1),open=new Set(roadNodes.map((_,i)=>i));distance[start]=0;while(open.size){let current=-1;open.forEach(i=>{if(current<0||distance[i]<distance[current])current=i;});if(current===goal||!Number.isFinite(distance[current]))break;open.delete(current);roadLinks[current].forEach(edge=>{const candidate=distance[current]+edge.cost;if(candidate<distance[edge.to]){distance[edge.to]=candidate;previous[edge.to]=current;}});}let step=goal;while(previous[step]>=0&&previous[step]!==start)step=previous[step];return roadNodes[previous[step]<0?goal:step];};
    const nearRoad=(x,y,margin=0)=>roads.some(r=>r.axis==="v"?Math.abs(x-r.pos)<r.width/2+margin&&(r.from===undefined||(y>=r.from-margin&&y<=r.to+margin)):Math.abs(y-r.pos)<r.width/2+margin&&(r.from===undefined||(x>=r.from-margin&&x<=r.to+margin)));
    const isRoad=(x,y)=>nearRoad(x,y);
    const freshCondition=(id,full=false)=>{const rec=carRecord(id),stored=Number(rec.condition),base=Number.isFinite(stored)?Math.max(0,Math.min(100,stored)):100;if(full)return {engine:100,tires:100,body:100,fuel:100,headlights:100};const condition={engine:Math.max(65,base),tires:Math.max(70,base),body:Math.max(30,base),fuel:100,headlights:100};rec.condition=(condition.engine+condition.tires+condition.body)/3;return condition;};
    let currentCar={x:660,y:820,angle:0,speed:0,boost:100,type:starter.id,condition:freshCondition(starter.id)},person={x:690,y:820,angle:0},mode="car",mission=0,targetIndex=1,ended=false,raf=0,last=performance.now(),mobileSteer=0,observedInputReset=mobileInput.resetSerial;
    let gameMinutes=20*60+30,heat=0,escapeProgress=0,lastCrime=0,lastBiome="city",activeJob=null,jobSerial=0,voidSignal=false,rareSpawned=false,lastRoadblockDeploy=0,lastCountyRelief=0,lastCountyPair="",lastTrafficImpact=0,trafficImpactStreak=0;
    const police=[],roadblocks=[],drones=[],crashFx={particles:[],shakeUntil:0,flashUntil:0,bannerUntil:0,banner:"",strength:0,police:false};let crashSlowUntil=0;
    const clockText=()=>`${String(Math.floor(gameMinutes/60)%24).padStart(2,"0")}:${String(Math.floor(gameMinutes%60)).padStart(2,"0")}`;
    const isNight=()=>gameMinutes>=20*60||gameMinutes<6*60;
    const wantedLevel=()=>heat<=0?0:Math.min(5,Math.ceil(heat/20));
    const pursuitNames=["","PATROL DISPATCHED","INTERCEPTORS DEPLOYED","ROADBLOCKS + SPIKE STRIPS","ARMORED RAM UNITS","NEON HIGHWAY UNIT + DRONE"];
    const raiseHeat=(amount,label)=>{const before=wantedLevel();heat=Math.min(100,heat+amount);lastCrime=performance.now();if(wantedLevel()>before)flashAlert(`${"★".repeat(wantedLevel())} ${pursuitNames[wantedLevel()]||label||"WANTED"}`);};
    const damageFragileCargo=force=>{if(!activeJob?.spec.fragile)return;activeJob.cargo=Math.max(0,activeJob.cargo-Math.max(2,force*1.8));};
    const damageCar=(amount,kind="body")=>{if(mode!=="car"||!currentCar)return;const c=currentCar.condition,fragility=1+(1-c.body/100)*.9,hit=amount*fragility,bodyHit=kind==="tires"?hit*.12:kind==="headlights"?hit*.05:hit;c.body=Math.max(0,c.body-bodyHit);c.engine=Math.max(0,c.engine-hit*(kind==="engine"?.82:kind==="tires"?.06:.3));c.tires=Math.max(0,c.tires-hit*(kind==="tires"?.92:.24));c.headlights=Math.max(0,c.headlights-hit*(kind==="headlights"?1:.22));if(c.engine<=0){currentCar.speed=0;flashAlert("ENGINE DEAD • NO POWER");}else if(c.body<20&&c.body+bodyHit>=20)flashAlert("BODY CRITICAL • DAMAGE AMPLIFIED");};
    const triggerCrash=(force,source="traffic",kind="body")=>{if(mode!=="car"||force<4)return;const now=performance.now(),veryHard=force>=15,hard=force>=8,count=veryHard?28:hard?18:9;crashFx.strength=Math.min(18,4+force*.65);crashFx.shakeUntil=now+(veryHard?520:hard?320:150);crashFx.flashUntil=now+(veryHard?180:95);crashFx.bannerUntil=now+(veryHard?1050:hard?650:350);crashFx.police=source==="police";crashFx.banner=source==="police"?(veryHard?"POLICE RAM!":"RAMMED!"):veryHard?"CRITICAL CRASH!":"CRASH!";crashSlowUntil=now+(veryHard?360:hard?220:90);for(let i=0;i<count;i++){const angle=currentCar.angle+Math.PI+(Math.random()-.5)*2.5,speed=1.3+Math.random()*(veryHard?6:3.8);crashFx.particles.push({x:currentCar.x,y:currentCar.y,vx:Math.cos(angle)*speed+(Math.random()-.5)*2,vy:Math.sin(angle)*speed+(Math.random()-.5)*2,life:24+Math.random()*35,size:1+Math.random()*3,color:source==="police"?(i%2?"#ff214f":"#3185ff"):(i%3?"#ffb23e":"#d7dce5")});}if(veryHard){const c=currentCar.condition,warnings=[];if(kind==="engine"||c.engine<45)warnings.push("⚠ ENGINE DAMAGED");if(kind==="tires"||c.tires<38)warnings.push(`⚠ ${Math.sin(currentCar.angle)>0?"LEFT":"RIGHT"} TIRE CRITICAL`);if(c.headlights<30)warnings.push("⚠ HEADLIGHTS OFFLINE");if(warnings.length)flashAlert(warnings.slice(0,2).join(" • "));}};
    const flashAlert=text=>{const el=$("#outlaw-alert");if(!el)return;el.textContent=text;el.className="show";clearTimeout(flashAlert.timer);flashAlert.timer=setTimeout(()=>el?.classList.remove("show"),1900);};
    const targets=[{x:620,y:760},{x:1950,y:760},{x:3250,y:760},{x:4550,y:760},{x:620,y:2440},{x:1950,y:2440},{x:3250,y:2440},{x:4550,y:2440},{x:620,y:4040},{x:1950,y:4040},{x:3250,y:4040},{x:4550,y:4040}];
    let seed=80421;const rnd=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
    const decor=[],density={city:42,desert:72,volcano:100,rainforest:250,forest:220,snow:135,swamp:185,coast:115,crystal:145,moon:95,candy:155};
    for(let row=0;row<3;row++)for(let col=0;col<4;col++){const type=biomeGrid[row][col],ox=col*cell.w,oy=row*cell.h;if(type==="city"){for(let x=ox+150;x<ox+cell.w-80;x+=220)for(let y=oy+150;y<oy+cell.h-80;y+=240)if(!isRoad(x,y))decor.push({x:x+(rnd()-.5)*35,y:y+(rnd()-.5)*35,type,variant:Math.floor(rnd()*8)});}else{const clusters=Math.ceil(density[type]/8),spread=type==="rainforest"||type==="forest"?125:type==="swamp"?150:190;for(let c=0;c<clusters;c++){const cx=ox+90+rnd()*(cell.w-180),cy=oy+90+rnd()*(cell.h-180),count=5+Math.floor(rnd()*7);for(let j=0;j<count;j++){const angle=rnd()*Math.PI*2,dist=Math.sqrt(rnd())*spread,x=cx+Math.cos(angle)*dist,y=cy+Math.sin(angle)*dist;if(x>ox+35&&x<ox+cell.w-35&&y>oy+35&&y<oy+cell.h-35&&!isRoad(x,y))decor.push({x,y,type,variant:Math.floor(rnd()*8)});}}}}
    const streetProps=[];roads.forEach((r,ri)=>{for(let i=0;i<18;i++){const along=r.axis==="v"?(r.from||0)+rnd()*((r.to||world.h)-(r.from||0)):(r.from||0)+rnd()*((r.to||world.w)-(r.from||0)),side=(rnd()<.5?-1:1)*(r.width/2+10);const x=r.axis==="v"?r.pos+side:along,y=r.axis==="v"?along:r.pos+side;streetProps.push({x,y,type:(ri+i)%8,variant:i%4,biome:biomeAt(x,y)});}});
    const makeTexture=(base,colors)=>{const tile=document.createElement("canvas");tile.width=tile.height=64;const t=tile.getContext("2d");t.fillStyle=base;t.fillRect(0,0,64,64);for(let i=0;i<38;i++){t.fillStyle=colors[i%colors.length];const x=(i*23+7)%64,y=(i*37+11)%64,size=i%5===0?3:1;t.fillRect(x,y,size,size);}return ctx.createPattern(tile,"repeat");};
    const terrainPatterns={city:makeTexture("#555d70",["#626a7d","#484f61","#707789"]),desert:makeTexture("#c99b4a",["#d6ad60","#b88738","#e1bc6d"]),volcano:makeTexture("#4d3939",["#35292d","#6b3a32","#8b392b"]),rainforest:makeTexture("#176a43",["#1f7b4d","#0e5836","#3a8a4f"]),forest:makeTexture("#1d5b39",["#286b43","#154b31","#396d3e"]),snow:makeTexture("#d8ecf2",["#fff","#bcd9e5","#c7e1e9"]),swamp:makeTexture("#405f3a",["#4f7045","#314f31","#65764a"]),coast:makeTexture("#d2bb78",["#e5d08c","#bfa869","#f0dc9a"]),crystal:makeTexture("#5a3b86",["#7650a7","#9c69d0","#3f2a68"]),moon:makeTexture("#676c7f",["#858b9f","#4d5263","#a5aabc"]),candy:makeTexture("#d98cbd",["#ffacd9","#be6ca2","#f1c3db"])};
    const pickups=Array.from({length:85},()=>({x:70+rnd()*(world.w-140),y:70+rnd()*(world.h-140),taken:false}));
    const roadVehicles=vehicles.filter(v=>!v.hidden),parked=[];for(let i=0;i<32;i++){const r=roads[Math.floor(rnd()*roads.length)],{from,to}=roadLimits(r),crossings=roadNodes.filter(node=>roadContains(r,node.x,node.y,1)).map(node=>r.axis==="v"?node.y:node.x);let along=from+80+rnd()*Math.max(1,to-from-160);for(let attempt=0;attempt<8&&crossings.some(c=>Math.abs(c-along)<115);attempt++)along=from+80+rnd()*Math.max(1,to-from-160);const side=i%2?1:-1,shoulder=side*(r.width/2-20),type=roadVehicles[i%roadVehicles.length].id;parked.push({x:r.axis==="v"?r.pos+shoulder:along,y:r.axis==="v"?along:r.pos+shoulder,angle:(r.axis==="v"?Math.PI/2:0)+(side<0?Math.PI:0),speed:0,boost:100,type,condition:freshCondition(type,true)});}
    const traffic=Array.from({length:22},(_,i)=>{const road=roads[i%roads.length],direction=i%2?1:-1,lane=-direction*road.width*.22,{from,to}=roadLimits(road),length=to-from,along=from+rnd()*length,n={x:road.axis==="v"?road.pos+lane:along,y:road.axis==="v"?along:road.pos+lane,axis:road.axis==="v"?"y":"x",road,direction,speed:(.9+(i%4)*.28)*direction,type:roadVehicles[i%roadVehicles.length].id,skin:["compact","sedan","taxi","van","sport","pickup"][i%6]};if(Math.hypot(n.x-currentCar.x,n.y-currentCar.y)<260){const shifted=from+((along-from+520)%length);if(n.axis==="x")n.x=shifted;else n.y=shifted;}return n;});
    const npcs=Array.from({length:64},(_,i)=>{let x,y,attempt=0;do{x=40+Math.random()*(world.w-80);y=40+Math.random()*(world.h-80);}while(isRoad(x,y)&&attempt++<16);return{x,y,vx:(Math.random()-.5)*.9,vy:(Math.random()-.5)*.9,timer:30+Math.random()*150,downUntil:0,color:["#31f5ff","#ff3eb5","#ffe84c","#72ff77","#ff7043","#a98cff"][i%6]};});
    const buildings=[];for(let row=0;row<3;row++)for(let col=0;col<4;col++){const biome=biomeGrid[row][col],ox=col*cell.w,oy=row*cell.h;[[250,1180],[930,420],[1030,1250]].forEach(([dx,dy],i)=>{const x=ox+dx,y=oy+dy;if(!nearRoad(x,y,92))buildings.push({x,y,biome,variant:i});});}
    const landmarks=[
      {x:830,y:1170,type:"arcade",label:"GUBUNTU ARCADE"},{x:2200,y:1280,type:"pyramid",label:"PIXEL PIRAMIS"},{x:3500,y:1260,type:"ufo",label:"MAGMA OBSZERVATÓRIUM"},{x:4800,y:1280,type:"temple",label:"ELVESZETT TEMPLOM"},
      {x:940,y:2820,type:"cabin",label:"ERDEI MENEDÉK"},{x:2200,y:2820,type:"ufo",label:"FAGYOTT UFO"},{x:3500,y:2820,type:"duck",label:"A MOCSÁR KACSÁJA"},{x:4800,y:2820,type:"arcade",label:"PARTI JÁTÉKTEREM"},
      {x:940,y:4420,type:"crystal",label:"PRIZMA CITADELLA"},{x:2200,y:4420,type:"moonbase",label:"GUBUNTU HOLD BÁZIS"},{x:3500,y:4420,type:"candy",label:"CUKORKASTÉLY"},{x:4800,y:4420,type:"garage",label:"MIDNIGHT TUNING"}
    ];
    const signatureSolids=[
      {shape:"rect",x:1565,y:1115,w:285,h:145,kind:"gas station"},{shape:"circle",x:2135,y:500,r:74,kind:"rock arch"},{shape:"circle",x:2405,y:500,r:74,kind:"rock arch"},
      {shape:"circle",x:3370,y:1220,r:72,kind:"caldera rim"},{shape:"circle",x:3760,y:1220,r:72,kind:"caldera rim"},{shape:"ellipse",x:4800,y:520,rx:92,ry:470,kind:"rainforest river"},{shape:"rect",x:4250,y:1080,w:370,h:62,kind:"jungle bridge"},
      {shape:"rect",x:935,y:2745,w:340,h:100,kind:"forest cabin"},{shape:"ellipse",x:2160,y:2630,rx:100,ry:150,kind:"frozen lake"},{shape:"rect",x:1585,y:2840,w:300,h:190,kind:"snow cabin"},
      {shape:"ellipse",x:4020,y:1860,rx:130,ry:80,kind:"swamp pool"},{shape:"ellipse",x:4740,y:2730,rx:140,ry:85,kind:"swamp pool"},
      {shape:"rect",x:5060,y:2400,w:270,h:1600,kind:"ocean"},{shape:"rect",x:4187,y:2010,w:120,h:330,kind:"lighthouse"},{shape:"rect",x:4630,y:2860,w:570,h:150,kind:"pier"},
      {shape:"ellipse",x:1680,y:4390,rx:180,ry:110,kind:"crystal pool"},{shape:"ellipse",x:2300,y:4135,rx:205,ry:165,kind:"crystal cave"},{shape:"rect",x:2228,y:4475,w:115,h:310,kind:"moon monolith"}
    ];
    for(let i=0;i<9;i++)signatureSolids.push({shape:"circle",x:1410+(i*173)%1120,y:3370+(i%4)*330,r:42+(i%3)*25,kind:"moon crater"});
    [[0,0],[3900,3200]].forEach(([ox,oy])=>{for(let i=0;i<7;i++)signatureSolids.push({shape:"rect",x:ox+102+i*185,y:oy+1495-(155+(i%4)*58)/2,w:115,h:155+(i%4)*58,kind:"tower"});});
    signatureSolids.push({shape:"rect",x:1550,y:280,w:560,h:390,kind:"sandstone cliff"},{shape:"rect",x:2860,y:250,w:520,h:400,kind:"volcanic cliff"},{shape:"rect",x:3600,y:270,w:480,h:430,kind:"volcanic cliff"});
    const staticSolids=[
      ...buildings.map(b=>({shape:"rect",x:b.x,y:b.y,w:82,h:92+b.variant*8,kind:"building",major:true})),
      ...landmarks.map(l=>({shape:"circle",x:l.x,y:l.y,r:l.type==="garage"?50:47,kind:"landmark",major:!isRoad(l.x,l.y)})),
      ...decor.map(d=>({shape:"circle",x:d.x,y:d.y,r:d.type==="city"?15:d.type==="forest"||d.type==="rainforest"?11:d.type==="desert"?7:9,kind:"scenery",major:false})),
      ...streetProps.map(p=>({shape:"circle",x:p.x,y:p.y,r:4,kind:"street furniture",major:false})),...signatureSolids.map(s=>({...s,major:false}))
    ];
    const pointInSolid=(x,y,s,pad=0)=>s.shape==="rect"?Math.abs(x-s.x)<s.w/2+pad&&Math.abs(y-s.y)<s.h/2+pad:s.shape==="ellipse"?((x-s.x)/(s.rx+pad))**2+((y-s.y)/(s.ry+pad))**2<1:Math.hypot(x-s.x,y-s.y)<s.r+pad;
    const solidAt=(x,y,pad=0)=>{const parkedHit=parked.find(c=>Math.hypot(x-c.x,y-c.y)<25+pad);if(parkedHit)return{kind:"parked car",car:parkedHit};const road=isRoad(x,y);return staticSolids.find(s=>(s.major||!road)&&pointInSolid(x,y,s,pad))||null;};
    const distanceToSegment=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/length)):0;return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));};
    const clearSight=(from,to,maxRange=520)=>{if(Math.hypot(to.x-from.x,to.y-from.y)>maxRange)return false;return !staticSolids.some(s=>{if(pointInSolid(from.x,from.y,s)||pointInSolid(to.x,to.y,s))return false;const radius=s.shape==="rect"?Math.hypot(s.w,s.h)/2:s.shape==="ellipse"?Math.max(s.rx,s.ry):s.r;return distanceToSegment(s.x,s.y,from.x,from.y,to.x,to.y)<radius;});};
    const secrets=[
      {id:"404",x:1120,y:1440,icon:"404",name:"A TITKOS 404-ES TEREM"},{id:"alien",x:2200,y:2820,icon:"👽",name:"FAGYOTT IDEGEN",vehicle:"frost-ufo"},{id:"duck",x:3500,y:2820,icon:"🦆",name:"ÓRIÁSKACSA"},
      {id:"temple",x:4800,y:1280,icon:"💎",name:"A TEMPLOM MAGJA"},{id:"crown",x:2450,y:1460,icon:"👑",name:"A HOMOK KIRÁLYA"},{id:"frog",x:3900,y:3000,icon:"🐸",name:"ARANYBÉKA"},
      {id:"magma",x:3500,y:1260,icon:"🌋",name:"A VULKÁN SZÍVE",vehicle:"magma-phantom"},{id:"bottle",x:5070,y:3030,icon:"🏝️",name:"PALACKPOSTA"},{id:"scarab-key",x:2450,y:1320,icon:"🪲",name:"A FÁRAÓ GARÁZSA",vehicle:"scarab"},
      {id:"crystal-core",x:940,y:4420,icon:"🔮",name:"A PRIZMA SZÍVE",vehicle:"crystal-ghost"},{id:"moon-signal",x:2200,y:4480,icon:"📡",name:"HOLDI VÉSZJEL"},{id:"candy-key",x:3500,y:4420,icon:"🧁",name:"A TITKOS RECEPT",vehicle:"candy-kart"}
    ];
    const secretReach=s=>landmarks.some(l=>Math.hypot(s.x-l.x,s.y-l.y)<65)?90:48;
    const missions=[
      {id:"city-courier",biome:"city",x:1040,y:520,icon:"📦",title:"Neon futár",desc:"Vidd át a pixeles csomagot a városi átjárón.",reward:[45,25]},
      {id:"desert-relic",biome:"desert",x:2450,y:1320,icon:"🏺",title:"Sivatagi relikvia",desc:"Keresd meg a piramis melletti régi garázskulcsot.",reward:[55,28]},
      {id:"volcano-core",biome:"volcano",x:3500,y:1260,icon:"🔥",title:"Láva-próba",desc:"Érd el az obszervatóriumot, mielőtt túlhevül a motor.",reward:[60,32]},
      {id:"rainforest-supply",biome:"rainforest",x:4800,y:1280,icon:"🌿",title:"Templomi utánpótlás",desc:"Juss el az elveszett templomhoz az esőerdőn át.",reward:[55,30]},
      {id:"forest-rescue",biome:"forest",x:940,y:2820,icon:"🪵",title:"Erdei mentés",desc:"Találd meg az erdei menedéket.",reward:[45,25]},
      {id:"snow-signal",biome:"snow",x:2200,y:2820,icon:"📡",title:"Fagyott jel",desc:"Kapcsold be a lezuhant UFO vészjeladóját.",reward:[65,34]},
      {id:"swamp-frog",biome:"swamp",x:3900,y:3000,icon:"🐸",title:"Mocsári békakirály",desc:"Menj a köd mélyére az aranybéka nyomához.",reward:[50,30]},
      {id:"coast-message",biome:"coast",x:5070,y:3030,icon:"✉️",title:"Palackposta",desc:"Gyűjtsd be a partvidéki üzenetet.",reward:[50,28]},
      {id:"crystal-heart",biome:"crystal",x:940,y:4420,icon:"💎",title:"Prizma szíve",desc:"Stabilizáld a kristálymagot.",reward:[70,38]},
      {id:"moon-base",biome:"moon",x:2200,y:4480,icon:"🌙",title:"Holdbázis diagnosztika",desc:"Fuss be a holdi bázisra alacsony gravitációban.",reward:[70,38]},
      {id:"candy-recipe",biome:"candy",x:3500,y:4420,icon:"🍬",title:"Titkos recept",desc:"Szerezd vissza a cukorvidéki turbóreceptet.",reward:[75,40]}
    ];
    const jobTypes=[
      {id:"taxi",icon:"🚕",name:"TAXI",pay:55,limit:145,desc:"Passenger onboard • smooth driving"},
      {id:"courier",icon:"📦",name:"COURIER",pay:60,limit:125,desc:"Priority parcel • deliver fast"},
      {id:"fugitive",icon:"🚔",name:"FUGITIVE ESCAPE",pay:110,limit:165,heat:52,desc:"Lose the police before delivery"},
      {id:"race",icon:"🏁",name:"ILLEGAL STREET RACE",pay:100,limit:105,heat:28,race:true,desc:"Three checkpoints • no rules"},
      {id:"fragile",icon:"🥚",name:"FRAGILE CARGO",pay:95,limit:170,fragile:true,desc:"Cargo integrity affects rating"},
      {id:"fuel",icon:"⛽",name:"FUEL DELIVERY",pay:75,limit:150,fragile:true,desc:"Volatile load • avoid impacts"},
      {id:"emergency",icon:"🚑",name:"EMERGENCY RUN",pay:90,limit:100,desc:"Every second matters"},
      {id:"smuggle",icon:"🕵️",name:"SMUGGLING",pay:125,limit:155,heat:38,desc:"Contraband • stay out of sight"},
      {id:"recovery",icon:"🚗",name:"VEHICLE RECOVERY",pay:85,limit:180,desc:"Bring the marked car home"},
      {id:"checkpoints",icon:"🎯",name:"CHECKPOINT ATTACK",pay:80,limit:115,race:true,desc:"Hit every gate before timeout"}
    ];
    const jobSites=[
      {x:620,y:1040,type:0},{x:1950,y:1600,type:1},{x:3250,y:760,type:2},{x:4550,y:1600,type:3},{x:620,y:3200,type:4},
      {x:1950,y:2440,type:5},{x:3250,y:3200,type:6},{x:4550,y:2440,type:7},{x:1950,y:4040,type:8},{x:3250,y:4040,type:9}
    ];
    const jobDestinations=[{x:4550,y:4040},{x:620,y:4040},{x:4550,y:760},{x:620,y:2440},{x:3250,y:1600},{x:1950,y:760},{x:4550,y:3200},{x:940,y:4420},{x:4800,y:1280},{x:2200,y:2820}];
    const nearestJobSite=()=>{const a=actor();let found=null,best=68;jobSites.forEach(s=>{const d=Math.hypot(a.x-s.x,a.y-s.y);if(d<best){best=d;found=s;}});return found;};
    const startJob=site=>{if(mode!=="car")return toast("A MUNKÁHOZ AUTÓ KELL!");const spec=jobTypes[site.type],destination=jobDestinations[(site.type+jobSerial++)%jobDestinations.length],waypoints=spec.race?[{x:(site.x+destination.x)/2,y:site.y},{x:(site.x+destination.x)/2,y:destination.y},destination]:[destination];activeJob={spec,site,destination,waypoints,index:0,time:spec.limit,cargo:100,startBody:currentCar.condition.body};if(spec.heat)raiseHeat(spec.heat,"JOB FLAGGED");flashAlert(`${spec.icon} ${spec.name} • STARTED`);};
    const finishJob=()=>{if(!activeJob)return;const j=activeJob,ratio=Math.max(0,j.time/j.spec.limit),cargo=j.cargo;const rating=ratio>.55&&cargo>85?"GOLD":ratio>.28&&cargo>55?"SILVER":"BRONZE",mult=rating==="GOLD"?1.5:rating==="SILVER"?1.2:1,pay=Math.round(j.spec.pay*mult),rank={BRONZE:1,SILVER:2,GOLD:3},previous=currentPlayer.openRoadJobs.bestRatings[j.spec.id];currentPlayer.openRoadJobs.completed++;if(rating==="GOLD")currentPlayer.openRoadJobs.gold++;if(!previous||rank[rating]>rank[previous])currentPlayer.openRoadJobs.bestRatings[j.spec.id]=rating;const rec=carRecord(currentCar.type);rec.jobs++;if(j.spec.race){rec.races++;if(rating!=="BRONZE")rec.wins++;}grant(pay,35,`${rating} ${j.spec.name} • +${pay} ÉRME`);activeJob=null;saveData();};
    const failJob=reason=>{if(!activeJob)return;flashAlert(`${activeJob.spec.name} FAILED • ${reason}`);activeJob=null;};
    const missionDone=id=>!!currentPlayer.openRoadMissions[id];
    const openMissionCount=()=>missions.filter(m=>missionDone(m.id)).length;
    const activeMission=()=>missions.find(m=>m.biome===biomeAt(actor().x,actor().y)&&!missionDone(m.id))||missions.find(m=>!missionDone(m.id));
    const completeMission=m=>{currentPlayer.openRoadMissions[m.id]=Date.now();addDaily("openroad",1);saveData();grant(m.reward[0],m.reward[1],`${m.title.toUpperCase()} TELJESÍTVE! +${m.reward[0]} ÉRME`);};
    const actor=()=>mode==="car"?currentCar:person;
    const nearGarage=()=>{const a=actor();return Math.hypot(a.x-4800,a.y-4420)<115;};
    const interact=()=>{if(nearGarage()){if(mode==="car"&&Math.abs(currentCar.speed)>.7)return toast("A GARÁZSHOZ ÁLLJ MEG EGY PILLANATRA!");if(mode==="car"){Object.assign(currentCar.condition,{engine:100,tires:100,body:100,fuel:100,headlights:100});heat=0;carRecord(currentCar.type).condition=100;saveData();}cancelAnimationFrame(raf);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);toast("MIDNIGHT TUNING • REPAIRS COMPLETE • HEAT CLEARED");garage();return;}const site=!activeJob&&nearestJobSite();if(site){startJob(site);return;}switchMode();};
    const switchMode=()=>{
      if(mode==="car"){
        if(Math.abs(currentCar.speed)>.6)return toast("ELŐBB ÁLLJ MEG!");
        if(activeJob)return toast("MUNKA KÖZBEN NEM HAGYHATOD EL AZ AUTÓT!");
        const exitingCar=currentCar,exitAngles=[Math.PI/2,-Math.PI/2,Math.PI,0];
        let exitPoint=null;
        for(const distance of [44,52,62]){
          for(const offset of exitAngles){
            const candidate={x:exitingCar.x+Math.cos(exitingCar.angle+offset)*distance,y:exitingCar.y+Math.sin(exitingCar.angle+offset)*distance};
            if(candidate.x>10&&candidate.x<world.w-10&&candidate.y>10&&candidate.y<world.h-10&&!solidAt(candidate.x,candidate.y,9)){exitPoint=candidate;break;}
          }
          if(exitPoint)break;
        }
        exitPoint||={x:exitingCar.x+Math.cos(exitingCar.angle+Math.PI/2)*44,y:exitingCar.y+Math.sin(exitingCar.angle+Math.PI/2)*44};
        person.x=exitPoint.x;person.y=exitPoint.y;person.angle=exitingCar.angle;
        parked.push(exitingCar);currentCar=null;mode="foot";
        toast("KISZÁLLTÁL • E: BESZÁLLÁS");
      }else{
        let nearest=null,best=55;
        parked.forEach(c=>{const d=Math.hypot(person.x-c.x,person.y-c.y);if(d<best){best=d;nearest=c;}});
        if(!nearest)return toast("NINCS AUTÓ A KÖZELBEN");
        currentCar=nearest;currentCar.condition||=freshCondition(currentCar.type,true);
        parked.splice(parked.indexOf(nearest),1);mode="car";
        if(byId(currentCar.type).rare&&!currentPlayer.vehicles.includes(currentCar.type)){currentPlayer.vehicles.push(currentCar.type);carRecord(currentCar.type);saveData();flashAlert(`RARE CAR CLAIMED • ${byId(currentCar.type).name}`);}
        else if(!currentPlayer.vehicles.includes(currentCar.type))raiseHeat(9,"VEHICLE THEFT");
        toast(`${byId(currentCar.type).name} • BESZÁLLTÁL`);
      }
    };
    const keyMap={arrowup:"gas",w:"gas",arrowdown:"brake",s:"brake",arrowleft:"left",a:"left",arrowright:"right",d:"right",shift:"boost"};
    const keyDown=e=>{const key=e.key.toLowerCase();if(key==="e"&&!e.repeat){e.preventDefault();interact();return;}if(keyMap[key]){e.preventDefault();keys.add(keyMap[key]);}};
    const keyUp=e=>{const key=e.key.toLowerCase();if(keyMap[key])keys.delete(keyMap[key]);};window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);
    const drawBiomeSignatures=()=>{const shard=(x,y,s,color)=>{ctx.shadowColor=color;ctx.shadowBlur=18;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x-s*.45,y+s);ctx.lineTo(x-s*.16,y-s*.7);ctx.lineTo(x+s*.1,y-s*1.35);ctx.lineTo(x+s*.48,y+s);ctx.fill();ctx.shadowBlur=0;};for(let row=0;row<3;row++)for(let col=0;col<4;col++){const type=biomeGrid[row][col],ox=col*cell.w,oy=row*cell.h;ctx.save();ctx.beginPath();ctx.rect(ox,oy,cell.w,cell.h);ctx.clip();if(type==="city"){const g=ctx.createLinearGradient(ox,oy,ox+cell.w,oy+cell.h);g.addColorStop(0,"rgba(10,20,65,.2)");g.addColorStop(1,"rgba(255,20,170,.12)");ctx.fillStyle=g;ctx.fillRect(ox,oy,cell.w,cell.h);for(let i=0;i<7;i++){const x=ox+45+i*185,h=155+(i%4)*58,y=oy+cell.h-35;ctx.fillStyle=i%2?"#182547":"#2b1948";ctx.fillRect(x,y-h,115,h);ctx.fillStyle=i%3?"#31f5ff":"#ff3eb5";for(let wy=y-h+20;wy<y-15;wy+=27)for(let wx=x+14;wx<x+100;wx+=25)ctx.fillRect(wx,wy,8,11);if(i%2===0){ctx.fillStyle="#080615";ctx.fillRect(x-8,y-h-37,132,27);ctx.strokeStyle=i%4?"#ff3eb5":"#ffe84c";ctx.lineWidth=3;ctx.strokeRect(x-8,y-h-37,132,27);ctx.fillStyle="#fff";ctx.font="bold 11px monospace";ctx.textAlign="center";ctx.fillText(["NEON","GUBUNTU","VOID FM","NIGHT RUN"][i%4],x+58,y-h-19);}}}else if(type==="desert"){ctx.fillStyle="#9a6535";ctx.beginPath();ctx.moveTo(ox,oy+480);ctx.lineTo(ox+170,oy+100);ctx.lineTo(ox+360,oy+330);ctx.lineTo(ox+520,oy+120);ctx.lineTo(ox+700,oy+480);ctx.fill();ctx.strokeStyle="#d39752";ctx.lineWidth=20;ctx.beginPath();ctx.arc(ox+945,oy+435,155,Math.PI,0);ctx.stroke();ctx.fillStyle="#b97c3e";ctx.fillRect(ox+780,oy+430,55,170);ctx.fillRect(ox+1055,oy+430,55,170);ctx.fillStyle="#5a3526";ctx.fillRect(ox+150,oy+1110,230,90);ctx.fillStyle="#ffe84c";ctx.fillRect(ox+125,oy+1070,280,42);ctx.fillStyle="#241b24";ctx.font="bold 16px monospace";ctx.textAlign="center";ctx.fillText("LAST GAS",ox+265,oy+1097);}else if(type==="volcano"){ctx.fillStyle="rgba(16,5,8,.35)";ctx.fillRect(ox,oy,cell.w,cell.h);ctx.fillStyle="#211b24";for(let i=0;i<8;i++){const x=ox+i*190-40;ctx.beginPath();ctx.moveTo(x,oy+450);ctx.lineTo(x+90,oy+80+(i%3)*65);ctx.lineTo(x+185,oy+450);ctx.fill();}ctx.strokeStyle="#ff4b2b";ctx.shadowColor="#ff4b2b";ctx.shadowBlur=14;ctx.lineWidth=7;for(let i=0;i<9;i++){const x=ox+60+i*148;ctx.beginPath();ctx.moveTo(x,oy+560);ctx.lineTo(x+35,oy+720);ctx.lineTo(x-20,oy+900);ctx.lineTo(x+45,oy+1080);ctx.stroke();}ctx.shadowBlur=0;ctx.fillStyle="#0b0b10";ctx.beginPath();ctx.ellipse(ox+970,oy+1220,240,165,-.15,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#ff6b2b";ctx.lineWidth=18;ctx.stroke();}else if(type==="rainforest"){ctx.fillStyle="#0c5136";for(let i=0;i<15;i++){const x=ox+30+(i*91)%1240,y=oy+80+(i%4)*105;ctx.beginPath();ctx.arc(x,y,85+(i%3)*24,0,Math.PI*2);ctx.fill();}ctx.fillStyle="#168a9e";ctx.beginPath();ctx.moveTo(ox+860,oy);ctx.bezierCurveTo(ox+730,oy+410,ox+1000,oy+680,ox+790,oy+1150);ctx.lineTo(ox+950,oy+1150);ctx.bezierCurveTo(ox+1120,oy+650,ox+870,oy+400,ox+1010,oy);ctx.fill();ctx.fillStyle="#c9f7ff";for(let y=oy+315;y<oy+400;y+=28)ctx.fillRect(ox+820-(y-oy-315)*.2,y,140+(y-oy-315)*.35,9);ctx.fillStyle="#55432b";ctx.fillRect(ox+170,oy+1060,360,34);for(let x=ox+185;x<ox+520;x+=50)ctx.fillRect(x,oy+1045,28,65);}else if(type==="forest"){ctx.fillStyle="#123b2b";for(let i=0;i<19;i++){const x=ox+15+(i*71)%1270,y=oy+70+(i%5)*120,s=45+(i%3)*14;ctx.fillStyle=i%2?"#174c34":"#0d3929";ctx.beginPath();ctx.moveTo(x-s,y+s);ctx.lineTo(x,y-s*1.8);ctx.lineTo(x+s,y+s);ctx.fill();}ctx.fillStyle="#71482e";ctx.fillRect(ox+790,oy+1110,290,100);ctx.fillStyle="#a13939";ctx.beginPath();ctx.moveTo(ox+760,oy+1110);ctx.lineTo(ox+935,oy+1010);ctx.lineTo(ox+1110,oy+1110);ctx.fill();}else if(type==="snow"){ctx.fillStyle="rgba(235,251,255,.28)";ctx.fillRect(ox,oy,cell.w,cell.h);ctx.fillStyle="#9ddceb";ctx.beginPath();ctx.ellipse(ox+860,oy+1030,320,215,-.18,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=7;ctx.stroke();ctx.strokeStyle="rgba(255,255,255,.7)";ctx.lineWidth=3;for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(ox+620+i*65,oy+925);ctx.lineTo(ox+730+i*45,oy+1130);ctx.stroke();}ctx.fillStyle="#40665d";for(let i=0;i<10;i++){const x=ox+50+i*125;ctx.beginPath();ctx.moveTo(x-38,oy+365);ctx.lineTo(x,oy+220-(i%2)*45);ctx.lineTo(x+38,oy+365);ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(x-29,oy+308,58,8);ctx.fillStyle="#40665d";}ctx.fillStyle="#74472d";ctx.fillRect(ox+165,oy+1210,240,110);ctx.fillStyle="#f5fbff";ctx.beginPath();ctx.moveTo(ox+135,oy+1210);ctx.lineTo(ox+285,oy+1115);ctx.lineTo(ox+435,oy+1210);ctx.fill();}else if(type==="swamp"){ctx.fillStyle="#294f45";for(let i=0;i<8;i++){ctx.beginPath();ctx.ellipse(ox+120+(i*181)%1120,oy+260+(i%4)*290,120+(i%3)*35,70+(i%2)*25,.2,0,Math.PI*2);ctx.fill();}ctx.strokeStyle="#3e3428";ctx.lineWidth=14;for(let i=0;i<7;i++){const x=ox+90+i*180;ctx.beginPath();ctx.moveTo(x,oy+620);ctx.lineTo(x+(i%2?45:-35),oy+360);ctx.lineTo(x+(i%2?90:-80),oy+290);ctx.stroke();}ctx.fillStyle="#826443";ctx.fillRect(ox+80,oy+1180,1110,32);for(let x=ox+90;x<ox+1180;x+=65)ctx.fillRect(x,oy+1165,42,62);}else if(type==="coast"){ctx.fillStyle="#148fac";ctx.fillRect(ox+930,oy,370,cell.h);ctx.fillStyle="#f0d590";ctx.beginPath();ctx.moveTo(ox+760,oy);ctx.bezierCurveTo(ox+1010,oy+360,ox+720,oy+760,ox+980,oy+1100);ctx.lineTo(ox+980,oy+1600);ctx.lineTo(ox+760,oy+1600);ctx.closePath();ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=9;ctx.setLineDash([38,22]);ctx.beginPath();ctx.moveTo(ox+900,oy);ctx.bezierCurveTo(ox+1110,oy+390,ox+830,oy+780,ox+1060,oy+1500);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#f4f2e5";ctx.fillRect(ox+250,oy+310,75,260);ctx.fillStyle="#e94c57";ctx.fillRect(ox+250,oy+345,75,42);ctx.beginPath();ctx.arc(ox+287,oy+310,52,Math.PI,0);ctx.fill();ctx.fillStyle="#8b603a";ctx.fillRect(ox+450,oy+1180,560,28);for(let x=ox+460;x<ox+990;x+=75)ctx.fillRect(x,oy+1180,18,120);}else if(type==="crystal"){ctx.fillStyle="rgba(72,35,115,.24)";ctx.fillRect(ox,oy,cell.w,cell.h);for(let i=0;i<13;i++)shard(ox+80+(i*101)%1190,oy+180+(i%5)*240,34+(i%4)*18,i%2?"#bd8cff":"#6feaff");ctx.fillStyle="#1d1838";ctx.beginPath();ctx.ellipse(ox+1000,oy+930,220,180,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#070714";ctx.beginPath();ctx.ellipse(ox+1000,oy+955,125,110,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#b86dff";ctx.lineWidth=8;ctx.stroke();ctx.fillStyle="rgba(150,235,255,.2)";ctx.beginPath();ctx.ellipse(ox+380,oy+1190,260,115,-.2,0,Math.PI*2);ctx.fill();}else if(type==="moon"){ctx.fillStyle="rgba(12,14,32,.22)";ctx.fillRect(ox,oy,cell.w,cell.h);for(let i=0;i<9;i++){const x=ox+110+(i*173)%1120,y=oy+170+(i%4)*330,r=65+(i%3)*38;ctx.fillStyle="rgba(50,54,72,.52)";ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(220,230,255,.34)";ctx.lineWidth=7;ctx.stroke();}ctx.fillStyle="#34394f";for(let i=0;i<6;i++){const x=ox+80+i*220;ctx.beginPath();ctx.moveTo(x,oy+720);ctx.lineTo(x+55,oy+480-(i%2)*120);ctx.lineTo(x+110,oy+720);ctx.fill();}ctx.fillStyle="#15182c";ctx.fillRect(ox+870,oy+1120,115,310);ctx.strokeStyle="#8eeaff";ctx.lineWidth=4;ctx.strokeRect(ox+870,oy+1120,115,310);}else if(type==="candy"){for(let i=0;i<10;i++){const x=ox+70+i*125,y=oy+300+(i%3)*280;ctx.strokeStyle="#fff0a8";ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(x,y+130);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle=i%2?"#ff4fa8":"#75efff";ctx.beginPath();ctx.arc(x,y,45,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,27,0,Math.PI*1.55);ctx.stroke();}ctx.fillStyle="#cf5a9c";ctx.fillRect(ox+760,oy+1050,360,270);ctx.fillStyle="#fff0a8";for(let x=ox+760;x<ox+1120;x+=60){ctx.beginPath();ctx.arc(x,oy+1050,38,Math.PI,0);ctx.fill();}}ctx.restore();}};
    const drawBiomeRoadStyles=()=>{const accents={city:"#31f5ff",desert:"#e7b85d",volcano:"#ff4b2b",rainforest:"#65d56d",forest:"#92c86a",snow:"#dffaff",swamp:"#9ac45b",coast:"#56eced",crystal:"#c88cff",moon:"#cbd6ff",candy:"#ff78c8"};for(let row=0;row<3;row++)for(let col=0;col<4;col++){const type=biomeGrid[row][col],ox=col*cell.w,oy=row*cell.h;ctx.save();ctx.beginPath();ctx.rect(ox,oy,cell.w,cell.h);ctx.clip();roads.forEach(r=>{const start=r.from||0,end=r.to||(r.axis==="v"?world.h:world.w);ctx.strokeStyle=accents[type];ctx.globalAlpha=type==="city"||type==="crystal"?.6:.3;ctx.lineWidth=type==="snow"?5:3;ctx.setLineDash(type==="rainforest"?[5,29]:type==="moon"?[3,34]:[18,22]);ctx.beginPath();if(r.axis==="v"){ctx.moveTo(r.pos-r.width/2+5,start);ctx.lineTo(r.pos-r.width/2+5,end);ctx.moveTo(r.pos+r.width/2-5,start);ctx.lineTo(r.pos+r.width/2-5,end);}else{ctx.moveTo(start,r.pos-r.width/2+5);ctx.lineTo(end,r.pos-r.width/2+5);ctx.moveTo(start,r.pos+r.width/2-5);ctx.lineTo(end,r.pos+r.width/2-5);}ctx.stroke();});ctx.setLineDash([]);ctx.globalAlpha=1;if(type==="city"){ctx.fillStyle="rgba(5,3,18,.68)";ctx.fillRect(ox,oy+1020,cell.w,84);ctx.strokeStyle="#ff3eb5";ctx.lineWidth=4;ctx.strokeRect(ox,oy+1020,cell.w,84);for(let x=ox+90;x<ox+cell.w;x+=180){ctx.fillStyle="#20243c";ctx.fillRect(x,oy+1104,20,90);}}ctx.restore();}};
    const drawBiomeTransitions=()=>{ctx.save();const bands=[...Array(3)].flatMap((_,row)=>[1300,2600,3900].map(x=>({axis:"v",at:x,row}))),horizontal=[1600,3200].flatMap(y=>[0,1,2,3].map(col=>({axis:"h",at:y,col})));bands.forEach(({at,row})=>{const y=row*cell.h,g=ctx.createLinearGradient(at-110,0,at+110,0);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(.5,"rgba(24,18,44,.16)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(at-110,y,220,cell.h);for(let i=0;i<22;i++){ctx.fillStyle=i%3?"rgba(255,255,255,.055)":"rgba(8,6,25,.12)";ctx.beginPath();ctx.arc(at-92+(i*37)%184,y+45+(i*149)%1510,3+i%5,0,Math.PI*2);ctx.fill();}});horizontal.forEach(({at,col})=>{const x=col*cell.w,g=ctx.createLinearGradient(0,at-90,0,at+90);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(.5,"rgba(10,8,28,.14)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(x,at-90,cell.w,180);});ctx.restore();};
    const drawRoadPolish=()=>{const materials={city:["rgba(31,35,55,.32)","#31f5ff"],desert:["rgba(92,70,48,.25)","#f0c36b"],volcano:["rgba(15,12,17,.34)","#ff6338"],rainforest:["rgba(17,45,38,.25)","#62d977"],forest:["rgba(30,46,39,.2)","#a1cc78"],snow:["rgba(170,210,222,.2)","#efffff"],swamp:["rgba(42,57,46,.25)","#a4c66b"],coast:["rgba(32,62,70,.2)","#65f0ed"],crystal:["rgba(67,39,94,.28)","#d89cff"],moon:["rgba(78,82,101,.18)","#d9e2ff"],candy:["rgba(118,55,99,.2)","#ff9ad3"]};for(let row=0;row<3;row++)for(let col=0;col<4;col++){const type=biomeGrid[row][col],ox=col*cell.w,oy=row*cell.h,[tint,accent]=materials[type];ctx.save();ctx.beginPath();ctx.rect(ox,oy,cell.w,cell.h);ctx.clip();roads.forEach(r=>{const {from,to}=roadLimits(r);ctx.fillStyle=tint;if(r.axis==="v")ctx.fillRect(r.pos-r.width/2,from,r.width,to-from);else ctx.fillRect(from,r.pos-r.width/2,to-from,r.width);ctx.strokeStyle="rgba(235,239,242,.46)";ctx.lineWidth=2;ctx.setLineDash([22,26]);ctx.beginPath();if(r.axis==="v"){ctx.moveTo(r.pos-r.width*.25,from);ctx.lineTo(r.pos-r.width*.25,to);ctx.moveTo(r.pos+r.width*.25,from);ctx.lineTo(r.pos+r.width*.25,to);}else{ctx.moveTo(from,r.pos-r.width*.25);ctx.lineTo(to,r.pos-r.width*.25);ctx.moveTo(from,r.pos+r.width*.25);ctx.lineTo(to,r.pos+r.width*.25);}ctx.stroke();ctx.setLineDash([]);if(["city","crystal","volcano"].includes(type)){ctx.strokeStyle=accent;ctx.globalAlpha=.23;ctx.lineWidth=8;ctx.shadowColor=accent;ctx.shadowBlur=10;ctx.beginPath();if(r.axis==="v"){ctx.moveTo(r.pos-r.width/2+9,from);ctx.lineTo(r.pos-r.width/2+9,to);ctx.moveTo(r.pos+r.width/2-9,from);ctx.lineTo(r.pos+r.width/2-9,to);}else{ctx.moveTo(from,r.pos-r.width/2+9);ctx.lineTo(to,r.pos-r.width/2+9);ctx.moveTo(from,r.pos+r.width/2-9);ctx.lineTo(to,r.pos+r.width/2-9);}ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1;}if(type==="snow"){ctx.fillStyle="rgba(225,247,255,.12)";for(let i=0;i<8;i++){const along=(i*431+col*97)%(to-from)+from;if(r.axis==="v")ctx.fillRect(r.pos-r.width/2,along,18+(i%3)*9,55);else ctx.fillRect(along,r.pos-r.width/2,55,18+(i%3)*9);}}});ctx.restore();}roadNodes.forEach((n,i)=>{if(i%3)return;const type=biomeAt(n.x,n.y);ctx.save();ctx.translate(n.x,n.y);ctx.strokeStyle=materials[type][1];ctx.globalAlpha=.34;ctx.lineWidth=3;ctx.strokeRect(-28,-28,56,56);ctx.fillStyle="rgba(255,255,255,.55)";for(let s=-18;s<=18;s+=12){ctx.fillRect(-34,s,12,4);ctx.fillRect(22,s,12,4);}ctx.restore();});};
    const drawScenicSpots=()=>{const t=performance.now();ctx.save();const glow=(x,y,r,color)=>{const g=ctx.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,color);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);};glow(620,760,150,"rgba(49,245,255,.2)");ctx.strokeStyle="#ff3eb5";ctx.lineWidth=8;ctx.shadowColor="#ff3eb5";ctx.shadowBlur=14;ctx.beginPath();ctx.arc(620,760,76,Math.PI,0);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle="#ffe84c";ctx.font="bold 13px monospace";ctx.textAlign="center";ctx.fillText("NEON MILE",620,690);ctx.strokeStyle="#e8c06a";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(1680,725);ctx.lineTo(1680,795);ctx.moveTo(2220,725);ctx.lineTo(2220,795);ctx.stroke();ctx.fillStyle="#5a3528";for(let x=1690;x<2220;x+=42)ctx.fillRect(x,708,22,10);glow(3250,760,175,"rgba(255,74,38,.24)");ctx.strokeStyle="#ff9b43";ctx.lineWidth=5;ctx.beginPath();ctx.arc(3250,760,115,.15,Math.PI-.15);ctx.stroke();ctx.fillStyle="#20202b";for(let x=3090;x<=3410;x+=32)ctx.fillRect(x,828,18,32);glow(4550,760,190,"rgba(110,238,205,.18)");ctx.fillStyle="rgba(210,250,255,.7)";for(let i=0;i<5;i++)ctx.fillRect(4740+i*15,650+i*12,9,145-i*24);glow(1950,4040,190,"rgba(196,116,255,.25)");ctx.strokeStyle="#d49cff";ctx.lineWidth=7;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(1850+i*34,4100);ctx.lineTo(1870+i*34,3990-(i%3)*36);ctx.lineTo(1890+i*34,4100);ctx.stroke();}glow(3250,4040,170,"rgba(165,190,255,.17)");ctx.strokeStyle="#b9caff";ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(3250,4040,135,62,t/5000,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(3250,4040,72,125,-t/6500,0,Math.PI*2);ctx.stroke();ctx.restore();};
    $$("[data-drive-v2]").forEach(btn=>{const k=btn.dataset.driveV2;const on=e=>{e.preventDefault();if(k==="interact")interact();else{keys.add(k);btn.classList.add("active");}};const off=e=>{e.preventDefault();keys.delete(k);btn.classList.remove("active");};btn.addEventListener("pointerdown",on);btn.addEventListener("pointerup",off);btn.addEventListener("pointercancel",off);btn.addEventListener("pointerleave",off);});
    const drawRoads=()=>{roads.forEach(r=>{const start=r.from||0,end=r.to||(r.axis==="v"?world.h:world.w);ctx.fillStyle="#777879";if(r.axis==="v")ctx.fillRect(r.pos-r.width/2-7,start,r.width+14,end-start);else ctx.fillRect(start,r.pos-r.width/2-7,end-start,r.width+14);ctx.fillStyle="#292b34";if(r.axis==="v")ctx.fillRect(r.pos-r.width/2,start,r.width,end-start);else ctx.fillRect(start,r.pos-r.width/2,end-start,r.width);ctx.strokeStyle="#d8c64b";ctx.lineWidth=3;ctx.setLineDash([18,20]);ctx.beginPath();if(r.axis==="v"){ctx.moveTo(r.pos,start);ctx.lineTo(r.pos,end);}else{ctx.moveTo(start,r.pos);ctx.lineTo(end,r.pos);}ctx.stroke();ctx.setLineDash([]);});drawRoadPolish();ctx.strokeStyle="#151721";ctx.lineWidth=2;for(let i=0;i<110;i++){const x=(i*317+120)%world.w,y=[760,1600,2440][i%3];ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+9,y-5);ctx.lineTo(x+16,y+2);ctx.stroke();}ctx.fillStyle="rgba(235,239,235,.8)";for(const x of [260,520,780,1040])for(const y of [260,520,1040,1300])for(let s=0;s<5;s++){ctx.fillRect(x+50+s*11,y-29,7,20);ctx.fillRect(x-29,y+50+s*11,20,7);}drawBiomeRoadStyles();};
    const drawWaters=()=>{drawBiomeSignatures();ctx.fillStyle="#167b98";ctx.beginPath();ctx.moveTo(4560,0);ctx.bezierCurveTo(4770,420,4470,950,4690,1600);ctx.lineTo(4820,1600);ctx.bezierCurveTo(4610,940,4920,410,4710,0);ctx.closePath();ctx.fill();ctx.fillStyle="#294f45";[[2820,1880,190,110],[3440,2110,250,145],[2910,2630,210,120],[3710,2970,170,95]].forEach(p=>{ctx.beginPath();ctx.ellipse(...p,0,0,Math.PI*2);ctx.fill();});ctx.fillStyle="#178caa";ctx.beginPath();ctx.moveTo(4680,1600);ctx.lineTo(5200,1600);ctx.lineTo(5200,3200);ctx.lineTo(4930,3200);ctx.bezierCurveTo(4840,2820,5090,2460,4860,2110);ctx.bezierCurveTo(4750,1900,4880,1720,4680,1600);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.55)";ctx.lineWidth=5;ctx.setLineDash([26,16]);ctx.beginPath();ctx.moveTo(4850,1650);ctx.bezierCurveTo(5000,1990,4780,2480,5050,3100);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#ff5a28";ctx.beginPath();ctx.moveTo(3220,0);ctx.bezierCurveTo(3370,380,3150,780,3460,1600);ctx.lineTo(3540,1600);ctx.bezierCurveTo(3260,760,3500,350,3350,0);ctx.closePath();ctx.fill();};
    const drawDecor=d=>{
      ctx.save();ctx.translate(d.x,d.y);ctx.fillStyle="rgba(5,8,12,.24)";ctx.beginPath();ctx.ellipse(4,15,18,7,0,0,Math.PI*2);ctx.fill();const v=d.variant;
      if(d.type==="city"){
        if(v<3){ctx.fillStyle=["#452f69","#273963","#57304d"][v];ctx.fillRect(-25,-27,50,52);ctx.fillStyle="#11162b";ctx.fillRect(-28,-30,56,7);ctx.fillStyle="#ffe84c";for(let y=-17;y<18;y+=12)for(let x=-16;x<18;x+=12)ctx.fillRect(x,y,5,6);ctx.fillStyle="#31f5ff";ctx.fillRect(-6,12,12,13);}
        else if(v===3){ctx.fillStyle="#183f32";ctx.fillRect(-16,-7,32,22);ctx.fillStyle="#2b7657";ctx.fillRect(-18,-12,36,7);ctx.fillStyle="#a8d46b";ctx.fillRect(-3,-4,7,7);}
        else if(v===4){ctx.fillStyle="#17151d";ctx.beginPath();ctx.arc(-8,6,9,0,Math.PI*2);ctx.arc(8,8,8,0,Math.PI*2);ctx.fill();ctx.fillStyle="#8c735e";ctx.fillRect(12,4,11,10);}
        else if(v===5){ctx.fillStyle="#743e28";ctx.fillRect(-20,-2,40,7);ctx.fillRect(-17,8,34,6);ctx.fillStyle="#292430";ctx.fillRect(-16,14,4,8);ctx.fillRect(12,14,4,8);}
        else if(v===6){ctx.fillStyle="#202535";ctx.fillRect(-3,-26,6,45);ctx.fillStyle="#ffe9a6";ctx.beginPath();ctx.arc(0,-27,8,0,Math.PI*2);ctx.fill();}
        else{ctx.fillStyle="#cb2e73";ctx.fillRect(-11,-20,22,39);ctx.fillStyle="#75efff";ctx.fillRect(-7,-14,14,15);ctx.fillStyle="#fff";ctx.fillRect(-5,5,3,3);}
      }else if(d.type==="desert"){
        if(v===0){ctx.fillStyle="#267847";ctx.fillRect(-4,-21,8,41);ctx.fillRect(-14,-7,11,7);ctx.fillRect(4,2,12,7);}
        else if(v===1){ctx.fillStyle="#368e4f";ctx.beginPath();ctx.arc(0,4,14,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#d1d96a";for(let x=-8;x<9;x+=8){ctx.beginPath();ctx.moveTo(x,-7);ctx.lineTo(x,15);ctx.stroke();}}
        else if(v===2){ctx.fillStyle="#916037";ctx.beginPath();ctx.moveTo(-18,15);ctx.lineTo(-8,-10);ctx.lineTo(10,-16);ctx.lineTo(20,15);ctx.fill();ctx.fillStyle="#b67b45";ctx.fillRect(-8,-5,11,4);}
        else if(v===3){ctx.fillStyle="#eee0b5";ctx.beginPath();ctx.arc(0,0,10,0,Math.PI*2);ctx.fill();ctx.fillStyle="#3d3026";ctx.fillRect(-6,-2,4,4);ctx.fillRect(3,-2,4,4);ctx.fillRect(-2,5,5,3);}
        else if(v===4){ctx.strokeStyle="#88562f";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,3,15,0,Math.PI*2);ctx.moveTo(-12,-6);ctx.lineTo(11,13);ctx.moveTo(12,-6);ctx.lineTo(-10,13);ctx.stroke();}
        else if(v===5){ctx.fillStyle="#5d3c2c";ctx.fillRect(-3,-20,6,40);ctx.fillStyle="#ffe84c";ctx.fillRect(-18,-20,36,14);ctx.fillStyle="#5d3c2c";ctx.fillRect(-12,-16,24,4);}
        else if(v===6){ctx.strokeStyle="#eee0b5";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-17,11);ctx.lineTo(17,-8);ctx.moveTo(-15,-8);ctx.lineTo(16,12);ctx.stroke();}
        else{ctx.fillStyle="#4c8d47";for(let a=0;a<6;a++){ctx.save();ctx.rotate(a*Math.PI/3);ctx.fillRect(-2,-20,4,20);ctx.restore();}}
      }else if(d.type==="rainforest"){
        if(v===0){ctx.fillStyle="#6d4826";ctx.fillRect(-4,-5,8,29);ctx.strokeStyle="#46a956";ctx.lineWidth=7;for(let a=0;a<6;a++){ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(Math.cos(a)*22,Math.sin(a)*17-13);ctx.stroke();}}
        else if(v===1){ctx.fillStyle="#573b27";ctx.fillRect(-4,3,8,22);ctx.fillStyle="#1c8a4a";ctx.beginPath();ctx.arc(-10,-5,17,0,Math.PI*2);ctx.arc(9,-8,19,0,Math.PI*2);ctx.fill();ctx.fillStyle="#55b85f";ctx.beginPath();ctx.arc(1,-15,12,0,Math.PI*2);ctx.fill();}
        else if(v===2){ctx.fillStyle="#3e7e36";for(let a=0;a<5;a++){ctx.save();ctx.rotate(a*1.25);ctx.beginPath();ctx.ellipse(0,-13,5,16,0,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.fillStyle="#ffe84c";ctx.fillRect(-3,0,3,8);ctx.fillRect(2,-2,3,9);}
        else if(v===3){ctx.strokeStyle="#55bd68";ctx.lineWidth=4;for(let a=0;a<8;a++){ctx.beginPath();ctx.moveTo(0,12);ctx.quadraticCurveTo(Math.cos(a)*13,0,Math.cos(a)*20,Math.sin(a)*16-8);ctx.stroke();}}
        else if(v===4){ctx.strokeStyle="#68452d";ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(-22,10);ctx.lineTo(22,-5);ctx.stroke();ctx.fillStyle="#83bc55";ctx.fillRect(-17,4,7,5);ctx.fillRect(5,-3,9,4);}
        else if(v===5){for(let a=0;a<7;a++){ctx.fillStyle=a%2?"#ff5fbd":"#ffe84c";ctx.beginPath();ctx.arc(Math.cos(a)*13,Math.sin(a)*10,3,0,Math.PI*2);ctx.fill();}}
        else if(v===6){ctx.fillStyle="#4d3526";ctx.fillRect(-5,-10,10,35);ctx.strokeStyle="#72d66b";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(3,-9);ctx.bezierCurveTo(25,0,-20,10,9,27);ctx.stroke();}
        else{ctx.fillStyle="#4bb85c";for(let x=-12;x<13;x+=8){ctx.fillRect(x,-22,5,43);ctx.fillStyle="#287b42";ctx.fillRect(x+2,-20,1,39);}}
      }else if(d.type==="forest"){
        if(v===0){ctx.fillStyle="#5a402a";ctx.fillRect(-4,8,8,18);ctx.fillStyle="#17613a";for(let y=11;y>-24;y-=11){ctx.beginPath();ctx.moveTo(-19,y);ctx.lineTo(0,y-23);ctx.lineTo(19,y);ctx.fill();}}
        else if(v===1){ctx.fillStyle="#e7e1ce";ctx.fillRect(-4,-8,8,34);ctx.fillStyle="#343231";ctx.fillRect(-4,-2,5,3);ctx.fillRect(0,8,4,3);ctx.fillStyle="#5d9b3d";ctx.beginPath();ctx.arc(0,-13,15,0,Math.PI*2);ctx.fill();}
        else if(v===2){ctx.fillStyle="#543c28";ctx.fillRect(-5,2,10,24);ctx.fillStyle="#2b8b4e";ctx.beginPath();ctx.arc(-10,-7,16,0,Math.PI*2);ctx.arc(9,-10,18,0,Math.PI*2);ctx.fill();}
        else if(v===3){ctx.fillStyle="#704c2d";ctx.fillRect(-10,0,20,17);ctx.fillStyle="#9c7149";ctx.beginPath();ctx.ellipse(0,0,11,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#4a3324";ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();}
        else if(v===4){ctx.fillStyle="#eee6c7";ctx.fillRect(-3,0,6,12);ctx.fillStyle="#e94b57";ctx.beginPath();ctx.arc(0,-2,9,Math.PI,0);ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(-5,-6,2,2);ctx.fillRect(3,-4,2,2);}
        else if(v===5){ctx.strokeStyle="#68462d";ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(-23,9);ctx.lineTo(23,-6);ctx.stroke();ctx.strokeStyle="#2b8b4e";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-9,2);ctx.lineTo(-14,-9);ctx.moveTo(8,-2);ctx.lineTo(15,-12);ctx.stroke();}
        else if(v===6){ctx.fillStyle="#3f8b42";ctx.beginPath();ctx.arc(-8,4,12,0,Math.PI*2);ctx.arc(8,1,14,0,Math.PI*2);ctx.fill();}
        else{for(let a=0;a<8;a++){ctx.fillStyle=a%2?"#9b6dff":"#fff";ctx.beginPath();ctx.arc(Math.cos(a)*12,Math.sin(a)*9,2,0,Math.PI*2);ctx.fill();}}
      }else if(d.type==="snow"){
        if(v<2){ctx.fillStyle="#655443";ctx.fillRect(-3,8,6,17);ctx.fillStyle=v?"#50766a":"#416b60";for(let y=10;y>-21;y-=10){ctx.beginPath();ctx.moveTo(-17,y);ctx.lineTo(0,y-21);ctx.lineTo(17,y);ctx.fill();}ctx.fillStyle="#fff";ctx.fillRect(-11,-8,22,4);}
        else if(v===2){ctx.fillStyle="#7a8c9c";ctx.beginPath();ctx.moveTo(-16,14);ctx.lineTo(-5,-12);ctx.lineTo(13,-17);ctx.lineTo(20,14);ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(-5,-9,14,5);}
        else if(v===3){ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(0,7,12,0,Math.PI*2);ctx.arc(0,-9,8,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ff7043";ctx.fillRect(7,-10,9,3);ctx.fillStyle="#222";ctx.fillRect(-3,-11,2,2);ctx.fillRect(3,-11,2,2);}
        else if(v===4){ctx.fillStyle="#70c9e8";ctx.beginPath();ctx.moveTo(-12,15);ctx.lineTo(0,-22);ctx.lineTo(12,15);ctx.fill();ctx.fillStyle="#d6f5ff";ctx.fillRect(-5,-11,5,14);}
        else if(v===5){ctx.fillStyle="#bfdce5";ctx.beginPath();ctx.arc(0,7,17,Math.PI,0);ctx.fill();ctx.fillStyle="#48687c";ctx.fillRect(-7,0,14,14);}
        else if(v===6){ctx.fillStyle="#557161";ctx.beginPath();ctx.arc(-7,5,10,0,Math.PI*2);ctx.arc(8,4,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(-10,-1,22,4);}
        else{ctx.strokeStyle="#715039";ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(-21,8);ctx.lineTo(21,-7);ctx.stroke();ctx.fillStyle="#fff";ctx.fillRect(-14,1,28,4);}
      }else if(d.type==="swamp"){
        if(v===0){ctx.strokeStyle="#4a3b2d";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,19);ctx.lineTo(0,-19);ctx.moveTo(0,-7);ctx.lineTo(-14,-17);ctx.moveTo(0,-2);ctx.lineTo(14,-12);ctx.stroke();}
        else if(v===1){ctx.strokeStyle="#8daf5b";ctx.lineWidth=3;for(let x=-9;x<10;x+=6){ctx.beginPath();ctx.moveTo(x,14);ctx.lineTo(x+(v%3-1)*5,-14);ctx.stroke();}}
        else if(v===2){ctx.fillStyle="#5f8b4b";ctx.beginPath();ctx.ellipse(0,4,15,8,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ff8cbf";ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();}
        else if(v===3){ctx.fillStyle="#653b29";ctx.fillRect(-13,-14,26,29);ctx.fillStyle="#d26b34";ctx.fillRect(-15,-17,30,6);ctx.fillStyle="#1f241c";ctx.fillRect(-4,-5,8,8);}
        else if(v===4){ctx.strokeStyle="#24272b";ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,2,13,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#435243";ctx.fillRect(-4,-1,8,7);}
        else if(v===5){ctx.strokeStyle="#779a4d";ctx.lineWidth=3;for(let x=-12;x<13;x+=6){ctx.beginPath();ctx.moveTo(x,15);ctx.lineTo(x,-12);ctx.stroke();ctx.fillStyle="#704f2c";ctx.beginPath();ctx.ellipse(x,-12,3,7,0,0,Math.PI*2);ctx.fill();}}
        else if(v===6){ctx.fillStyle="#4c7b42";ctx.beginPath();ctx.arc(-7,4,11,0,Math.PI*2);ctx.arc(8,2,13,0,Math.PI*2);ctx.fill();}
        else{ctx.fillStyle="#735039";ctx.beginPath();ctx.moveTo(-22,11);ctx.lineTo(18,6);ctx.lineTo(23,13);ctx.lineTo(-20,17);ctx.fill();ctx.fillStyle="#517264";ctx.fillRect(-8,5,18,5);}
      }else if(d.type==="volcano"){
        if(v<3){ctx.fillStyle=v===0?"#211d25":"#38272a";ctx.beginPath();ctx.moveTo(-18,15);ctx.lineTo(-8,-12);ctx.lineTo(10,-18);ctx.lineTo(21,15);ctx.fill();ctx.fillStyle="#ff5a28";ctx.fillRect(-5,-4,12,4);}
        else if(v===3){ctx.fillStyle="#15151c";ctx.beginPath();ctx.moveTo(-12,17);ctx.lineTo(0,-23);ctx.lineTo(13,17);ctx.fill();ctx.fillStyle="#8d65c9";ctx.fillRect(-4,-13,6,22);}
        else if(v===4){ctx.strokeStyle="#33262a";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,18);ctx.lineTo(0,-20);ctx.moveTo(0,-4);ctx.lineTo(-14,-13);ctx.moveTo(0,1);ctx.lineTo(13,-9);ctx.stroke();}
        else if(v===5){ctx.fillStyle="#ff5a28";ctx.beginPath();ctx.arc(0,4,13,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ffe84c";ctx.beginPath();ctx.arc(0,2,6,0,Math.PI*2);ctx.fill();}
        else if(v===6){ctx.fillStyle="#14131a";for(let a=0;a<6;a++){ctx.save();ctx.rotate(a);ctx.fillRect(-3,-17,6,19);ctx.restore();}}
        else{ctx.fillStyle="#684039";ctx.fillRect(-13,-12,26,25);ctx.fillStyle="#ff7043";ctx.fillRect(-16,-15,32,6);ctx.fillStyle="#221d20";ctx.fillRect(-4,-4,8,8);}
      }else if(d.type==="crystal"){
        ctx.fillStyle=v%2?"#d59cff":"#8f67d8";ctx.beginPath();ctx.moveTo(-12,18);ctx.lineTo(-5,-22-v*2);ctx.lineTo(7,-8);ctx.lineTo(15,18);ctx.fill();ctx.strokeStyle="#f1d7ff";ctx.stroke();
      }else if(d.type==="moon"){
        ctx.fillStyle=v%2?"#9298aa":"#4c5263";ctx.beginPath();ctx.arc(0,4,8+v,0,Math.PI*2);ctx.fill();ctx.fillStyle="#343947";ctx.beginPath();ctx.arc(-3,1,3,0,Math.PI*2);ctx.fill();
      }else if(d.type==="candy"){
        ctx.fillStyle=["#ff78c8","#fff0a8","#8eeaff"][v%3];ctx.fillRect(-3,-19,6,37);ctx.beginPath();ctx.arc(0,-18,11+v%4,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-18,5+v%4,0,Math.PI*1.7);ctx.stroke();
      }else{
        if(v===0){ctx.fillStyle="#8a5d32";ctx.fillRect(-4,-4,8,27);ctx.strokeStyle="#3a9b55";ctx.lineWidth=7;for(let a=0;a<6;a++){ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(Math.cos(a)*23,Math.sin(a)*14-14);ctx.stroke();}}
        else if(v===1){ctx.fillStyle="#ff3eb5";ctx.beginPath();ctx.arc(0,-6,22,Math.PI,0);ctx.fill();ctx.fillStyle="#ffe84c";ctx.beginPath();ctx.arc(0,-6,14,Math.PI,0);ctx.fill();ctx.fillStyle="#75513b";ctx.fillRect(-2,-6,4,29);}
        else if(v===2){ctx.fillStyle="#8b6548";ctx.fillRect(-22,5,44,8);ctx.fillStyle="#e8ded0";ctx.fillRect(-13,-3,27,9);ctx.fillStyle="#31f5ff";ctx.fillRect(-10,-1,8,5);}
        else if(v===3){ctx.strokeStyle="#f5eee2";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,2,11,0,Math.PI*1.6);ctx.stroke();ctx.fillStyle="#ff8cbf";ctx.fillRect(-2,0,4,4);}
        else if(v===4){ctx.fillStyle="#c94f4f";ctx.fillRect(-13,-22,26,40);ctx.fillStyle="#fff";ctx.fillRect(-13,-5,26,7);ctx.fillStyle="#70452d";ctx.fillRect(-3,18,6,8);}
        else if(v===5){ctx.fillStyle="#6e4b31";ctx.beginPath();ctx.moveTo(-22,8);ctx.lineTo(20,-7);ctx.lineTo(23,1);ctx.lineTo(-20,15);ctx.fill();ctx.fillStyle="#e8d59c";ctx.fillRect(-8,1,13,3);}
        else if(v===6){ctx.fillStyle="#4aa6be";ctx.beginPath();ctx.moveTo(-22,12);ctx.lineTo(0,-12);ctx.lineTo(22,12);ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(-14,8,28,4);}
        else{ctx.fillStyle="#ead8a2";for(let a=0;a<7;a++){ctx.save();ctx.rotate(a);ctx.fillRect(-2,-15,4,15);ctx.restore();}ctx.fillStyle="#ffb04c";ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();}
      }ctx.restore();
    };
    const drawStreetProp=p=>{
      const biome=p.biome||biomeAt(p.x,p.y),v=p.variant||0;
      const accent={city:"#31f5ff",desert:"#e5b55d",volcano:"#ff5a32",rainforest:"#69e589",forest:"#96c975",snow:"#eaffff",swamp:"#a5c36a",coast:"#52e4df",crystal:"#d493ff",moon:"#ced9ff",candy:"#ff8acb"}[biome]||"#fff";
      const metal=biome==="moon"?"#6f7890":biome==="desert"?"#76583b":biome==="snow"?"#7898a8":"#293044";
      ctx.save();ctx.translate(p.x,p.y);ctx.lineJoin="round";
      ctx.fillStyle="rgba(2,3,10,.28)";ctx.beginPath();ctx.ellipse(3,13,16+(v%2)*3,5,0,0,Math.PI*2);ctx.fill();
      if(p.type===0){
        if(v===0){ctx.fillStyle=metal;ctx.fillRect(-11,-9,22,23);ctx.fillStyle=accent;ctx.fillRect(-13,-14,26,6);ctx.strokeStyle="#758094";ctx.strokeRect(-8,-5,16,15);ctx.fillStyle="#0b1119";ctx.fillRect(-5,-3,10,7);}
        else if(v===1){ctx.fillStyle="#252b3b";ctx.beginPath();ctx.moveTo(-13,13);ctx.lineTo(-10,-13);ctx.lineTo(10,-13);ctx.lineTo(13,13);ctx.fill();ctx.fillStyle=accent;ctx.fillRect(-8,-9,16,5);ctx.fillStyle="#0a0d17";ctx.fillRect(-7,-1,14,9);}
        else if(v===2){ctx.fillStyle="#704d33";ctx.fillRect(-15,4,30,10);ctx.fillStyle=accent;ctx.beginPath();ctx.arc(0,3,15,Math.PI,0);ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(-8,-2,16,3);}
        else{ctx.fillStyle=metal;ctx.fillRect(-9,-12,18,26);ctx.fillStyle="#101523";ctx.fillRect(-6,-8,12,9);ctx.fillStyle=accent;ctx.beginPath();ctx.arc(0,-4,3,0,Math.PI*2);ctx.fill();ctx.strokeStyle=accent;ctx.strokeRect(-11,-14,22,30);}
      }else if(p.type===1){
        if(v%2===0){ctx.strokeStyle=accent;ctx.lineWidth=2;for(const x of [-8,8]){ctx.beginPath();ctx.arc(x,7,7,0,Math.PI*2);ctx.stroke();}ctx.beginPath();ctx.moveTo(-8,7);ctx.lineTo(-1,-3);ctx.lineTo(8,7);ctx.lineTo(-3,5);ctx.lineTo(4,-5);ctx.stroke();ctx.fillStyle="#8b725b";ctx.fillRect(2,-8,8,3);}
        else{ctx.fillStyle=accent;ctx.fillRect(-4,-8,9,17);ctx.fillStyle="#111522";ctx.fillRect(-2,-5,5,8);ctx.strokeStyle="#aeb8c7";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(3,-8);ctx.lineTo(9,-15);ctx.lineTo(13,-15);ctx.stroke();for(const x of [-3,5]){ctx.fillStyle="#111";ctx.beginPath();ctx.arc(x,10,4,0,Math.PI*2);ctx.fill();}}
      }else if(p.type===2){
        ctx.fillStyle=metal;
        if(v===0){ctx.fillRect(-3,-26,6,40);ctx.beginPath();ctx.arc(0,13,6,Math.PI,0);ctx.fill();ctx.fillStyle=accent;ctx.shadowColor=accent;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(0,-27,7,0,Math.PI*2);ctx.fill();}
        else if(v===1){ctx.fillRect(-3,-25,6,39);ctx.strokeStyle=metal;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-24);ctx.quadraticCurveTo(16,-24,16,-12);ctx.stroke();ctx.fillStyle=accent;ctx.shadowColor=accent;ctx.shadowBlur=10;ctx.beginPath();ctx.ellipse(16,-11,8,5,0,0,Math.PI*2);ctx.fill();}
        else if(v===2){ctx.fillRect(-2,-23,4,37);ctx.fillStyle=accent;for(const y of [-24,-15]){ctx.beginPath();ctx.moveTo(-9,y);ctx.lineTo(0,y-6);ctx.lineTo(9,y);ctx.lineTo(6,y+5);ctx.lineTo(-6,y+5);ctx.fill();}}
        else{ctx.strokeStyle=metal;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-11,14);ctx.lineTo(-11,-15);ctx.quadraticCurveTo(0,-29,11,-15);ctx.lineTo(11,14);ctx.stroke();ctx.fillStyle=accent;ctx.fillRect(-15,-18,30,6);}
        ctx.shadowBlur=0;
      }else if(p.type===3){
        if(v<2){ctx.fillStyle=metal;ctx.fillRect(-3,-28,6,42);ctx.fillRect(-3,-24,17,4);ctx.fillStyle="#111521";ctx.fillRect(8,-26,12,27);["#ff334f","#ffe84c","#72ff77"].forEach((color,i)=>{ctx.fillStyle=color;ctx.globalAlpha=i===v?1:.3;ctx.beginPath();ctx.arc(14,-21+i*8,3,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;}
        else{ctx.fillStyle=biome==="snow"?"#a9cddd":"#c8414c";ctx.fillRect(-8,-8,16,21);ctx.fillRect(-11,-3,22,6);ctx.fillStyle="#fff";ctx.fillRect(-5,-14,10,7);ctx.fillStyle=accent;ctx.fillRect(-3,-12,6,3);if(v===3){ctx.strokeStyle="#fff";ctx.beginPath();ctx.arc(0,5,5,0,Math.PI*2);ctx.stroke();}}
      }else if(p.type===4){
        ctx.fillStyle=metal;ctx.fillRect(-3,-18,6,33);
        if(v===0){ctx.fillStyle="#11182a";ctx.beginPath();ctx.moveTo(-19,-21);ctx.lineTo(19,-21);ctx.lineTo(15,-5);ctx.lineTo(-15,-5);ctx.closePath();ctx.fill();ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=accent;ctx.font="bold 7px monospace";ctx.textAlign="center";ctx.fillText(biome==="city"?"NITE":biome==="desert"?"GAS":"ROAD",0,-11);}
        else if(v===1){ctx.fillStyle=accent;ctx.beginPath();ctx.moveTo(0,-24);ctx.lineTo(18,-14);ctx.lineTo(0,-4);ctx.lineTo(-18,-14);ctx.closePath();ctx.fill();ctx.fillStyle="#111";ctx.font="bold 7px monospace";ctx.textAlign="center";ctx.fillText("GO",0,-11);}
        else if(v===2){ctx.fillStyle="#ece4cf";ctx.fillRect(-18,-22,36,17);ctx.fillStyle=accent;ctx.fillRect(-15,-19,30,4);ctx.fillStyle="#202331";ctx.fillRect(-11,-12,22,3);}
        else{ctx.fillStyle="#101522";ctx.fillRect(-20,-24,40,20);ctx.strokeStyle=accent;ctx.shadowColor=accent;ctx.shadowBlur=8;ctx.strokeRect(-20,-24,40,20);ctx.fillStyle=accent;ctx.font="bold 6px monospace";ctx.textAlign="center";ctx.fillText("GUBUNTU",0,-12);ctx.shadowBlur=0;}
      }else if(p.type===5){
        ctx.fillStyle=v%2?"#754d31":"#353241";ctx.fillRect(-19,-5,38,6);ctx.fillRect(-17,5,34,5);ctx.fillStyle=metal;ctx.fillRect(-15,10,4,8);ctx.fillRect(11,10,4,8);
        if(v===1){ctx.strokeStyle=accent;ctx.lineWidth=2;for(let x=-14;x<15;x+=7){ctx.beginPath();ctx.moveTo(x,-5);ctx.lineTo(x,10);ctx.stroke();}}
        else if(v===2){ctx.fillStyle=accent;ctx.fillRect(-17,-8,34,4);ctx.fillStyle="#202331";ctx.fillRect(-3,-14,6,6);}
        else if(v===3){ctx.strokeStyle="#aeb7c5";ctx.lineWidth=2;ctx.strokeRect(-20,-7,40,19);}
      }else if(p.type===6){
        if(v===0){for(const x of [-9,9]){ctx.fillStyle="#ff7043";ctx.beginPath();ctx.moveTo(x-7,13);ctx.lineTo(x,-14);ctx.lineTo(x+7,13);ctx.closePath();ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(x-5,3,10,3);}}
        else if(v===1){ctx.fillStyle="#ff7043";ctx.fillRect(-22,-5,44,9);ctx.fillStyle="#fff";for(let x=-19;x<20;x+=12)ctx.fillRect(x,-5,6,9);ctx.fillStyle=metal;ctx.fillRect(-18,4,4,11);ctx.fillRect(14,4,4,11);}
        else if(v===2){ctx.fillStyle=metal;ctx.fillRect(-20,-3,40,7);ctx.fillStyle=accent;for(let x=-17;x<18;x+=10)ctx.fillRect(x,-3,5,7);ctx.strokeStyle=metal;ctx.beginPath();ctx.moveTo(-18,4);ctx.lineTo(-13,14);ctx.moveTo(18,4);ctx.lineTo(13,14);ctx.stroke();}
        else{ctx.strokeStyle=accent;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-20,8);ctx.lineTo(-12,-8);ctx.lineTo(-4,8);ctx.lineTo(4,-8);ctx.lineTo(12,8);ctx.lineTo(20,-8);ctx.stroke();}
      }else{
        if(v===0){ctx.fillStyle=biome==="crystal"?accent:"#c8b18a";ctx.beginPath();ctx.moveTo(-14,8);ctx.lineTo(-12,-6);ctx.lineTo(2,-5);ctx.lineTo(14,-11);ctx.lineTo(13,7);ctx.closePath();ctx.fill();ctx.fillStyle="#f5eee4";ctx.save();ctx.rotate(-.22);ctx.fillRect(0,-8,14,9);ctx.restore();}
        else if(v===1){ctx.fillStyle=metal;ctx.fillRect(-8,-17,16,31);ctx.fillStyle=accent;ctx.fillRect(-10,-19,20,7);ctx.fillStyle="#111";ctx.fillRect(-4,-7,8,10);}
        else if(v===2){ctx.fillStyle="#8d684d";ctx.fillRect(-3,-17,6,31);ctx.fillStyle="#eee";ctx.beginPath();ctx.arc(0,-19,10,0,Math.PI*2);ctx.fill();ctx.fillStyle=accent;ctx.beginPath();ctx.moveTo(-5,-22);ctx.lineTo(6,-19);ctx.lineTo(-5,-16);ctx.fill();}
        else{ctx.fillStyle=metal;ctx.fillRect(-16,-5,32,18);ctx.fillStyle=accent;ctx.fillRect(-13,-2,26,4);ctx.fillStyle="#0d121d";ctx.fillRect(-10,5,20,5);}
      }
      if(biome==="rainforest"&&p.type%2){ctx.strokeStyle="#39794d";ctx.lineWidth=3;ctx.beginPath();ctx.arc(-8,7,10,.4,2.8);ctx.stroke();}
      if(biome==="snow"){ctx.fillStyle="rgba(240,253,255,.76)";ctx.beginPath();ctx.ellipse(0,14,16,4,0,0,Math.PI*2);ctx.fill();}
      if(biome==="crystal"&&v===3){ctx.strokeStyle=accent;ctx.shadowColor=accent;ctx.shadowBlur=8;ctx.strokeRect(-17,-24,34,38);ctx.shadowBlur=0;}
      ctx.restore();
    };
    const drawBuilding=b=>{const palette={city:["#29264b","#31f5ff"],desert:["#a56d35","#ffe08a"],volcano:["#241d28","#ff4b2b"],rainforest:["#315a37","#75ff66"],forest:["#62432d","#b7d982"],snow:["#8aa9ba","#eaffff"],swamp:["#394b32","#9ac45b"],coast:["#e5c67f","#28d7d1"],crystal:["#46306b","#d59cff"],moon:["#4c5265","#d9e5ff"],candy:["#d15f9f","#fff0a8"]}[b.biome]||["#333","#fff"];ctx.save();ctx.translate(b.x,b.y);ctx.fillStyle="rgba(0,0,0,.28)";ctx.fillRect(-42,31,90,12);ctx.fillStyle=palette[0];ctx.fillRect(-38,-34-(b.variant*8),76,70+(b.variant*8));ctx.fillStyle=palette[1];for(let x=-27;x<28;x+=18)for(let y=-22;y<18;y+=17)ctx.fillRect(x,y,8,7);ctx.fillStyle="#17103c";ctx.fillRect(-9,12,18,24);if(b.biome==="crystal"){ctx.fillStyle="#d59cff";ctx.beginPath();ctx.moveTo(-43,-34);ctx.lineTo(0,-72);ctx.lineTo(43,-34);ctx.fill();}else if(b.biome==="moon"){ctx.strokeStyle="#d9e5ff";ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,-35,34,Math.PI,0);ctx.stroke();}else if(b.biome==="candy"){ctx.fillStyle="#fff0a8";ctx.beginPath();ctx.arc(-22,-38,18,Math.PI,0);ctx.arc(10,-38,22,Math.PI,0);ctx.fill();}else{ctx.fillStyle="#17103c";ctx.beginPath();ctx.moveTo(-44,-34-b.variant*8);ctx.lineTo(0,-58-b.variant*8);ctx.lineTo(44,-34-b.variant*8);ctx.fill();}ctx.restore();};
    const drawWeather=type=>{const time=performance.now();ctx.save();if(type==="city"){const cyan=ctx.createRadialGradient(80,420,10,80,420,260);cyan.addColorStop(0,"rgba(49,245,255,.12)");cyan.addColorStop(1,"rgba(49,245,255,0)");ctx.fillStyle=cyan;ctx.fillRect(0,120,420,360);const pink=ctx.createRadialGradient(650,390,10,650,390,250);pink.addColorStop(0,"rgba(255,62,181,.1)");pink.addColorStop(1,"rgba(255,62,181,0)");ctx.fillStyle=pink;ctx.fillRect(380,100,340,380);ctx.fillStyle="rgba(160,220,255,.07)";for(let i=0;i<18;i++){const x=(i*89+time*.018)%760,y=330+(i%4)*37;ctx.fillRect(x,y,2,55+(i%3)*22);}}else if(type==="rainforest"){ctx.strokeStyle="rgba(170,225,255,.36)";ctx.lineWidth=2;for(let i=0;i<55;i++){const x=(i*83+time*.25)%760-20,y=(i*47+time*.55)%520-20;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-7,y+16);ctx.stroke();}ctx.fillStyle="rgba(7,45,32,.1)";ctx.fillRect(0,0,720,480);}else if(type==="snow"){ctx.fillStyle="rgba(255,255,255,.78)";for(let i=0;i<45;i++){const x=(i*97+time*.02*(i%3+1))%730,y=(i*61+time*.05*(i%4+1))%490;ctx.fillRect(x,y,i%3+1,i%3+1);}}else if(type==="swamp"){for(let i=0;i<5;i++){const x=((i*190+time*.012)%940)-120;const fog=ctx.createRadialGradient(x,300,10,x,300,180);fog.addColorStop(0,"rgba(215,235,200,.14)");fog.addColorStop(1,"rgba(215,235,200,0)");ctx.fillStyle=fog;ctx.fillRect(x-190,150,380,300);}}else if(type==="desert"){ctx.fillStyle="rgba(255,210,115,.08)";ctx.fillRect(0,0,720,480);ctx.fillStyle="rgba(255,230,170,.26)";for(let i=0;i<18;i++){const x=(i*119+time*.05)%740,y=(i*67+time*.012)%480;ctx.fillRect(x,y,3,2);}}else if(type==="volcano"){ctx.fillStyle="rgba(120,25,14,.1)";ctx.fillRect(0,0,720,480);for(let i=0;i<26;i++){const x=(i*109+time*.035*(i%4+1))%730,y=480-(i*71+time*.04*(i%3+1))%500;ctx.fillStyle=i%2?"#ff5a28":"#ffe84c";ctx.fillRect(x,y,2+(i%2),2+(i%2));}}else if(type==="coast"){const glow=ctx.createLinearGradient(0,0,0,480);glow.addColorStop(0,"rgba(255,235,170,.12)");glow.addColorStop(1,"rgba(40,205,220,.05)");ctx.fillStyle=glow;ctx.fillRect(0,0,720,480);}else if(type==="crystal"){ctx.fillStyle="rgba(185,110,255,.09)";ctx.fillRect(0,0,720,480);ctx.strokeStyle="rgba(230,205,255,.35)";for(let i=0;i<14;i++){const x=(i*137+time*.025)%760-20;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-95,480);ctx.stroke();}}else if(type==="moon"){ctx.fillStyle="rgba(210,225,255,.08)";ctx.fillRect(0,0,720,480);ctx.fillStyle="rgba(255,255,255,.7)";for(let i=0;i<28;i++){const x=(i*91+time*.008)%720,y=(i*53+time*.005)%480;ctx.fillRect(x,y,1,1);}}else if(type==="candy"){const glow=ctx.createLinearGradient(0,0,720,480);glow.addColorStop(0,"rgba(255,120,200,.12)");glow.addColorStop(1,"rgba(255,240,168,.08)");ctx.fillStyle=glow;ctx.fillRect(0,0,720,480);ctx.fillStyle="rgba(255,255,255,.25)";for(let i=0;i<16;i++){const x=(i*101+time*.035)%740,y=(i*71+time*.018)%500;ctx.fillRect(x,y,8,3);}}ctx.restore();};
    const drawLandmark=l=>{
      ctx.save();
      ctx.translate(l.x,l.y);
      const t=performance.now()/1000;
      const pulse=.64+Math.sin(t*2+l.x)*.16;
      const glow=(x,y,r,color)=>{
        const g=ctx.createRadialGradient(x,y,2,x,y,r);
        g.addColorStop(0,color);
        g.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle=g;
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fill();
      };
      ctx.fillStyle="rgba(3,4,15,.3)";
      ctx.beginPath();
      ctx.ellipse(0,41,67,17,0,0,Math.PI*2);
      ctx.fill();

      if(l.type==="arcade"){
        ctx.fillStyle="#0d102e";ctx.fillRect(-58,-39,116,80);
        ctx.fillStyle="#24205b";ctx.fillRect(-52,-47,104,10);
        ctx.fillStyle="#08091c";ctx.fillRect(-47,-30,94,69);
        ctx.fillStyle="#ff3eb5";ctx.fillRect(-48,-35,96,18);
        glow(0,-26,45,"rgba(255,62,181,.25)");
        ctx.fillStyle="#ffe84c";ctx.font="bold 12px monospace";ctx.textAlign="center";ctx.fillText("ARCADE",0,-22);
        for(let x=-39;x<=39;x+=26){for(let y=-8;y<=11;y+=19){ctx.fillStyle=(x+y)%3?"#31f5ff":"#8e5bff";ctx.fillRect(x-7,y-5,14,10);ctx.fillStyle="rgba(255,255,255,.45)";ctx.fillRect(x-5,y-3,6,2);}}
        ctx.fillStyle="#ff3eb5";ctx.fillRect(-14,20,28,19);ctx.fillStyle="#08061d";ctx.fillRect(-9,24,18,15);
        ctx.strokeStyle="#31f5ff";ctx.lineWidth=2;ctx.strokeRect(-52,-47,104,88);
        ctx.strokeStyle="#9aa6ff";ctx.beginPath();ctx.moveTo(33,-47);ctx.lineTo(42,-61);ctx.stroke();ctx.fillStyle="#ff3eb5";ctx.beginPath();ctx.arc(43,-63,3,0,Math.PI*2);ctx.fill();
      }else if(l.type==="pyramid"){
        ctx.fillStyle="#8d6429";ctx.fillRect(-65,35,130,10);
        ctx.fillStyle="#c58f36";ctx.beginPath();ctx.moveTo(-61,35);ctx.lineTo(0,-67);ctx.lineTo(61,35);ctx.fill();
        const pg=ctx.createLinearGradient(-50,-45,55,30);pg.addColorStop(0,"#f4cf6b");pg.addColorStop(.52,"#d6a449");pg.addColorStop(1,"#8f6027");ctx.fillStyle=pg;ctx.beginPath();ctx.moveTo(0,-67);ctx.lineTo(61,35);ctx.lineTo(0,35);ctx.fill();
        ctx.strokeStyle="rgba(112,72,27,.7)";ctx.lineWidth=2;
        for(let y=-39;y<35;y+=16){const half=(y+67)*.6;ctx.beginPath();ctx.moveTo(-half,y);ctx.lineTo(half,y);ctx.stroke();}
        for(let y=-31;y<30;y+=16){const half=(y+67)*.58;for(let x=-half+12;x<half;x+=24){ctx.beginPath();ctx.moveTo(x,y-8);ctx.lineTo(x,y+8);ctx.stroke();}}
        ctx.fillStyle="#2b1a19";ctx.beginPath();ctx.moveTo(-12,35);ctx.lineTo(-8,13);ctx.lineTo(8,13);ctx.lineTo(12,35);ctx.fill();
        [-51,51].forEach(x=>{ctx.fillStyle="#b27a2e";ctx.fillRect(x-4,9,8,30);glow(x,5,14,"rgba(255,133,45,.35)");ctx.fillStyle="#ff8a36";ctx.beginPath();ctx.arc(x,5,4,0,Math.PI*2);ctx.fill();});
      }else if(l.type==="temple"){
        ctx.fillStyle="#273d2c";ctx.fillRect(-62,32,124,10);ctx.fillStyle="#405b39";ctx.fillRect(-57,23,114,10);
        ctx.fillStyle="#65774b";ctx.fillRect(-51,-30,102,54);
        ctx.fillStyle="#34452f";ctx.fillRect(-57,-38,114,10);ctx.fillStyle="#728657";ctx.fillRect(-48,-47,96,9);ctx.fillStyle="#2b3b2b";ctx.fillRect(-38,-55,76,8);
        [-39,-19,19,39].forEach(x=>{ctx.fillStyle="#819266";ctx.fillRect(x-5,-25,10,49);ctx.fillStyle="#a0a978";ctx.fillRect(x-7,-29,14,6);ctx.fillStyle="#4a5a3d";ctx.fillRect(x-6,17,12,7);});
        ctx.fillStyle="#18281f";ctx.fillRect(-12,-20,24,44);glow(0,-3,27,"rgba(117,255,102,.28)");
        ctx.fillStyle="#75ff66";ctx.beginPath();ctx.arc(0,-5,6,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#bbff9f";ctx.stroke();
        ctx.strokeStyle="#49683b";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-50,-43);ctx.bezierCurveTo(-36,-22,-55,-4,-42,21);ctx.moveTo(46,-51);ctx.bezierCurveTo(31,-30,50,-8,35,17);ctx.stroke();
        ctx.fillStyle="#536d42";ctx.fillRect(-69,25,12,13);ctx.fillRect(57,29,9,9);
      }else if(l.type==="cabin"){
        ctx.fillStyle="#4a2c22";ctx.fillRect(-48,-29,96,68);
        for(let y=-24;y<38;y+=9){ctx.fillStyle=y%18?"#805038":"#6e422f";ctx.fillRect(-46,y,92,7);}
        ctx.fillStyle="#321e1c";ctx.beginPath();ctx.moveTo(-59,-29);ctx.lineTo(0,-67);ctx.lineTo(59,-29);ctx.closePath();ctx.fill();
        ctx.fillStyle="#a13d43";ctx.beginPath();ctx.moveTo(-52,-30);ctx.lineTo(0,-61);ctx.lineTo(52,-30);ctx.closePath();ctx.fill();
        ctx.strokeStyle="#f0f7ff";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-53,-31);ctx.lineTo(0,-64);ctx.lineTo(53,-31);ctx.stroke();
        ctx.fillStyle="#5c3b35";ctx.fillRect(27,-59,12,24);ctx.fillStyle="#d5e5f0";ctx.fillRect(25,-61,16,5);
        ctx.fillStyle="rgba(230,240,255,.45)";ctx.beginPath();ctx.arc(34,-70,5,0,Math.PI*2);ctx.arc(39,-77,7,0,Math.PI*2);ctx.fill();
        [-25,24].forEach(x=>{glow(x,-5,18,"rgba(255,190,75,.2)");ctx.fillStyle="#ffd56b";ctx.fillRect(x-9,-13,18,16);ctx.strokeStyle="#5b3226";ctx.lineWidth=2;ctx.strokeRect(x-9,-13,18,16);ctx.beginPath();ctx.moveTo(x,-13);ctx.lineTo(x,3);ctx.moveTo(x-9,-5);ctx.lineTo(x+9,-5);ctx.stroke();});
        ctx.fillStyle="#2b1d1e";ctx.fillRect(-9,9,18,30);ctx.fillStyle="#ddb071";ctx.beginPath();ctx.arc(4,24,2,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#e7f2fb";ctx.beginPath();ctx.ellipse(-35,38,24,6,0,0,Math.PI*2);ctx.ellipse(33,39,25,7,0,0,Math.PI*2);ctx.fill();
      }else if(l.type==="ufo"){
        glow(0,18,61,"rgba(49,245,255,.18)");
        ctx.fillStyle="rgba(80,245,255,.16)";ctx.beginPath();ctx.moveTo(-22,7);ctx.lineTo(-38,47);ctx.lineTo(38,47);ctx.lineTo(22,7);ctx.fill();
        ctx.strokeStyle="#75849b";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-34,9);ctx.lineTo(-45,35);ctx.lineTo(-52,39);ctx.moveTo(34,9);ctx.lineTo(45,35);ctx.lineTo(52,39);ctx.stroke();
        ctx.fillStyle="#65748b";ctx.beginPath();ctx.ellipse(0,2,62,23,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#b9d6e4";ctx.beginPath();ctx.ellipse(0,-3,58,15,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#36445f";ctx.beginPath();ctx.ellipse(0,5,50,10,0,0,Math.PI*2);ctx.fill();
        const dg=ctx.createLinearGradient(0,-42,0,-5);dg.addColorStop(0,"rgba(230,255,255,.9)");dg.addColorStop(1,"rgba(49,245,255,.45)");ctx.fillStyle=dg;ctx.beginPath();ctx.arc(0,-8,25,Math.PI,0);ctx.fill();
        ctx.strokeStyle="#d9ffff";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-8,25,Math.PI,0);ctx.stroke();
        [-39,-20,0,20,39].forEach((x,i)=>{ctx.fillStyle=i%2?"#ff3eb5":"#31f5ff";ctx.beginPath();ctx.arc(x,7,3+(i===2?pulse:0),0,Math.PI*2);ctx.fill();});
        ctx.strokeStyle="#9edbe8";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-33);ctx.lineTo(7,-48);ctx.stroke();ctx.fillStyle="#ff3eb5";ctx.beginPath();ctx.arc(8,-50,3,0,Math.PI*2);ctx.fill();
      }else if(l.type==="crystal"){
        glow(0,-5,70,"rgba(190,110,255,.22)");
        ctx.fillStyle="#38264d";ctx.beginPath();ctx.ellipse(0,37,61,14,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#a868e8";ctx.lineWidth=4;ctx.stroke();
        const shards=[[-38,34,-27,-25,-12,34],[-22,34,-11,-58,5,34],[-5,34,18,-73,31,34],[20,34,39,-37,49,34],[39,34,52,-10,58,34]];
        shards.forEach((s,i)=>{const cg=ctx.createLinearGradient(s[0],s[3],s[4],s[5]);cg.addColorStop(0,i%2?"#eff4ff":"#e3b4ff");cg.addColorStop(.45,i%2?"#9b7cff":"#c56cff");cg.addColorStop(1,"#593d91");ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(s[0],s[1]);ctx.lineTo(s[2],s[3]);ctx.lineTo(s[4],s[5]);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(255,255,255,.55)";ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.moveTo(s[2],s[3]);ctx.lineTo((s[0]+s[4])/2,s[5]);ctx.stroke();});
        ctx.strokeStyle="rgba(215,170,255,"+pulse+")";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-4,63,17,t*.2,0,Math.PI*2);ctx.stroke();
        ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(18,-54,2,0,Math.PI*2);ctx.fill();
      }else if(l.type==="moonbase"){
        glow(0,-2,66,"rgba(49,245,255,.14)");
        ctx.fillStyle="#6d7790";ctx.fillRect(-61,27,122,12);
        const mg=ctx.createLinearGradient(0,-48,0,30);mg.addColorStop(0,"#f1f6ff");mg.addColorStop(1,"#8792aa");ctx.fillStyle=mg;ctx.beginPath();ctx.arc(-13,22,46,Math.PI,0);ctx.fill();
        ctx.strokeStyle="#536079";ctx.lineWidth=3;ctx.beginPath();ctx.arc(-13,22,46,Math.PI,0);ctx.stroke();
        ctx.strokeStyle="#91a0ba";ctx.lineWidth=1;for(let a=.2;a<3;a+=.48){ctx.beginPath();ctx.moveTo(-13,22);ctx.lineTo(-13+46*Math.cos(a),22-46*Math.sin(a));ctx.stroke();}
        ctx.fillStyle="#404a60";ctx.fillRect(23,-3,38,35);ctx.fillStyle="#c5cfdf";ctx.fillRect(27,1,30,27);ctx.fillStyle="#242c41";ctx.fillRect(38,10,14,22);
        ctx.fillStyle="#31f5ff";ctx.fillRect(-29,-4,31,8);ctx.fillStyle="#d9ffff";ctx.fillRect(-26,-2,11,3);
        ctx.fillStyle="#36415a";ctx.fillRect(-72,10,18,6);ctx.fillRect(-72,16,5,17);ctx.fillStyle="#5c71aa";ctx.fillRect(-91,4,19,18);ctx.strokeStyle="#8ba9ff";ctx.strokeRect(-91,4,19,18);ctx.beginPath();ctx.moveTo(-81,4);ctx.lineTo(-81,22);ctx.moveTo(-91,13);ctx.lineTo(-72,13);ctx.stroke();
        ctx.strokeStyle="#738099";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(45,-3);ctx.lineTo(45,-35);ctx.stroke();ctx.fillStyle="#dce7f4";ctx.beginPath();ctx.arc(45,-38,11,.2,Math.PI+1.1);ctx.fill();ctx.strokeStyle="#31f5ff";ctx.lineWidth=2;ctx.stroke();
      }else if(l.type==="candy"){
        glow(0,-5,65,"rgba(255,120,200,.17)");
        ctx.fillStyle="#c9509a";ctx.fillRect(-47,-17,94,58);
        ctx.fillStyle="#ff83c8";ctx.fillRect(-25,-41,50,82);
        [-45,45].forEach(x=>{ctx.fillStyle="#e663ad";ctx.fillRect(x-14,-28,28,69);ctx.fillStyle="#fff0a8";ctx.beginPath();ctx.moveTo(x-18,-28);ctx.lineTo(x,-55);ctx.lineTo(x+18,-28);ctx.fill();ctx.fillStyle="#ff3eb5";ctx.beginPath();ctx.arc(x,-55,4,0,Math.PI*2);ctx.fill();});
        ctx.fillStyle="#fff0a8";ctx.beginPath();ctx.moveTo(-30,-41);ctx.lineTo(0,-67);ctx.lineTo(30,-41);ctx.fill();
        for(let x=-42;x<=42;x+=21){ctx.fillStyle=x%42?"#8eeaff":"#fff0a8";ctx.beginPath();ctx.arc(x,-17,10,Math.PI,0);ctx.fill();}
        [-44,-19,19,44].forEach((x,i)=>{ctx.fillStyle=i%2?"#ffe84c":"#8eeaff";ctx.fillRect(x-5,-11,10,13);ctx.strokeStyle="#fff";ctx.strokeRect(x-5,-11,10,13);});
        ctx.fillStyle="#6f3577";ctx.beginPath();ctx.arc(0,25,12,Math.PI,0);ctx.fill();ctx.fillRect(-12,25,24,16);
        [-68,68].forEach((x,i)=>{ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,9);ctx.lineTo(x,40);ctx.stroke();ctx.strokeStyle=i?"#31f5ff":"#ff3eb5";ctx.lineWidth=5;ctx.beginPath();ctx.arc(x,3,9,0,Math.PI*2);ctx.stroke();});
      }else if(l.type==="garage"){
        ctx.fillStyle="#08091c";ctx.fillRect(-64,-35,128,77);ctx.fillStyle="#24205b";ctx.fillRect(-59,-45,118,11);ctx.fillStyle="#151333";ctx.fillRect(-53,-32,106,74);
        ctx.fillStyle="#ff3eb5";ctx.fillRect(-56,-36,112,15);glow(0,-29,47,"rgba(255,62,181,.2)");
        ctx.fillStyle="#fff";ctx.font="bold 10px monospace";ctx.textAlign="center";ctx.fillText("MIDNIGHT",0,-25);
        ctx.fillStyle="#31f5ff";ctx.fillRect(-37,-13,74,55);ctx.fillStyle="#090b1b";ctx.fillRect(-32,-8,64,50);
        ctx.strokeStyle="#34415e";ctx.lineWidth=2;for(let y=-2;y<38;y+=8){ctx.beginPath();ctx.moveTo(-31,y);ctx.lineTo(31,y);ctx.stroke();}
        ctx.fillStyle="#ffe84c";ctx.fillRect(-27,29,54,3);
        ctx.fillStyle="#30384c";ctx.fillRect(42,-15,17,42);ctx.fillStyle="#73809b";ctx.fillRect(45,-10,11,5);ctx.fillRect(45,0,11,5);ctx.fillRect(45,10,11,5);
        [-51,51].forEach(x=>{ctx.fillStyle="#111522";ctx.beginPath();ctx.arc(x,35,9,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#647089";ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(x,35,4,0,Math.PI*2);ctx.stroke();});
        ctx.strokeStyle="#6d7395";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-38,-45);ctx.lineTo(-34,-57);ctx.lineTo(17,-57);ctx.lineTo(23,-45);ctx.stroke();ctx.fillStyle="#31f5ff";ctx.fillRect(-30,-55,45,4);
      }else{
        glow(0,0,56,"rgba(255,232,76,.18)");
        ctx.fillStyle="#e4b92d";ctx.beginPath();ctx.ellipse(0,8,43,34,-.12,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#ffe84c";ctx.beginPath();ctx.arc(-26,-20,24,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#ff8745";ctx.beginPath();ctx.moveTo(-46,-22);ctx.lineTo(-70,-14);ctx.lineTo(-45,-7);ctx.closePath();ctx.fill();
        ctx.fillStyle="#151526";ctx.beginPath();ctx.arc(-31,-27,4,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(-32,-28,1.5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#f5cc37";ctx.beginPath();ctx.ellipse(14,4,24,13,-.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#c89d1d";ctx.lineWidth=3;ctx.stroke();
        ctx.fillStyle="#ff9e45";ctx.beginPath();ctx.moveTo(-17,34);ctx.lineTo(-26,48);ctx.lineTo(-8,42);ctx.fill();
        ctx.strokeStyle="rgba(49,245,255,.55)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,39,57,10,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(0,42,72,15,0,0,Math.PI*2);ctx.stroke();
      }

      const accents={arcade:"#ff3eb5",pyramid:"#f4bf51",temple:"#75ff66",cabin:"#f0f7ff",ufo:"#31f5ff",crystal:"#c88cff",moonbase:"#8ba9ff",candy:"#ff78c8",garage:"#31f5ff",duck:"#ffe84c"};
      ctx.fillStyle="rgba(5,3,18,.86)";ctx.fillRect(-62,52,124,18);
      ctx.fillStyle=accents[l.type]||"#ffe84c";ctx.fillRect(-62,52,3,18);ctx.fillRect(59,52,3,18);
      ctx.fillStyle="#fff";ctx.font="bold 9px monospace";ctx.textAlign="center";ctx.fillText(l.label,0,65);
      ctx.restore();
    };
    const drawCar=(c,player=false)=>{
      const v=byId(c.type),skin=c.skin||"",t=performance.now()/1000,speed=Math.abs(c.speed||0);
      const kind=skin==="van"?"van":skin==="pickup"?"pickup":skin==="sedan"||skin==="taxi"?"sedan":skin==="sport"?"sports":
        c.type==="compact"?"compact":c.type==="rally"||c.type==="swamp"||c.type==="moon"?"offroad":
        c.type==="truck"?"truck":c.type==="jungle"?"buggy":c.type==="volcano"?"muscle":
        c.type==="candy-kart"?"kart":["sport","coast","candy"].includes(c.type)?"sports":
        ["crystal","scarab","magma-phantom","crystal-ghost","voidrunner","storm-chaser"].includes(c.type)?"supercar":"compact";
      const dims={compact:[37,24],sedan:[45,24],muscle:[43,29],sports:[45,21],supercar:[47,24],van:[48,29],pickup:[48,28],offroad:[43,30],buggy:[39,31],truck:[51,31],kart:[34,25]}[kind];
      const length=dims[0],width=dims[1],half=length/2,side=width/2,condition=c.condition||{},body=condition.body??100,engine=condition.engine??100,headlights=condition.headlights??100;
      const bodyColor=skin==="taxi"?"#ffd447":skin==="van"?"#8e9bac":v.color;
      const poly=points=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();};
      const wheel=(x,y,r=4)=>{ctx.fillStyle="#070911";ctx.fillRect(x-r,y-r*.72,r*2,r*1.44);ctx.fillStyle="#596176";ctx.fillRect(x-r*.55,y-r*.48,r*1.1,r*.96);};
      const glass=(points,color="#9ddbed")=>{ctx.fillStyle="#111a2c";poly(points);ctx.fill();ctx.fillStyle=color;ctx.globalAlpha=.82;poly(points.map(([x,y])=>[x+(x<0?1:-1),y*.82]));ctx.fill();ctx.globalAlpha=1;};
      ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.angle||0);
      if(c.type==="voidrunner"){for(let i=4;i>0;i--){ctx.globalAlpha=.05+i*.035;ctx.fillStyle=i%2?"#b15cff":"#52217f";ctx.beginPath();ctx.ellipse(-half-i*8+Math.sin(t*3+i)*3,0,half*.7,side*(.35+i*.08),0,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}
      if(c.type==="magma-phantom"){for(let i=0;i<7;i++){const age=(t*28+i*9)%34;ctx.fillStyle=i%2?"#ff4b22":"#ffc13b";ctx.globalAlpha=1-age/38;ctx.fillRect(-half-age,Math.sin(i*3.1+t)*side*.8,2+i%2,2+i%2);}ctx.globalAlpha=1;}
      ctx.fillStyle="rgba(3,3,12,.4)";ctx.beginPath();ctx.ellipse(2,3,half+5,side+5,0,0,Math.PI*2);ctx.fill();
      if(c.type==="frost-ufo"){
        {const ug=ctx.createRadialGradient(0,0,3,0,0,half+10);ug.addColorStop(0,"rgba(225,255,255,.9)");ug.addColorStop(.45,"rgba(100,220,255,.65)");ug.addColorStop(1,"rgba(55,145,255,0)");ctx.fillStyle=ug;ctx.beginPath();ctx.ellipse(0,0,half+10,side+8,0,0,Math.PI*2);ctx.fill();}
        ctx.fillStyle="#7898b5";ctx.beginPath();ctx.ellipse(0,0,half+5,side+5,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#d9f8ff";ctx.beginPath();ctx.ellipse(3,0,half-5,side,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="rgba(80,205,255,.72)";ctx.beginPath();ctx.ellipse(5,0,11,8,0,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,half+7,side+7,0,0,Math.PI*2);ctx.stroke();
        for(let i=0;i<6;i++){ctx.fillStyle=i%2?"#9cecff":"#dca8ff";ctx.beginPath();ctx.arc(Math.cos(i*Math.PI/3)*(half+3),Math.sin(i*Math.PI/3)*(side+4),2+Math.sin(t*4+i),0,Math.PI*2);ctx.fill();}
      }else{
        const wheelPos=kind==="kart"?[-half+5,half-5]:kind==="truck"?[-half+8,half-12]:[-half+8,half-9];
        wheelPos.forEach(x=>{wheel(x,-side-2,kind==="offroad"||kind==="buggy"||kind==="truck"?5:4);wheel(x,side+2,kind==="offroad"||kind==="buggy"||kind==="truck"?5:4);});
        ctx.fillStyle=bodyColor;
        if(kind==="compact"){poly([[-half+1,-side+5],[-half+6,-side],[half-7,-side],[half,-side+6],[half,side-6],[half-7,side],[-half+6,side],[-half+1,side-5]]);}
        else if(kind==="sedan"){poly([[-half,-side+4],[-half+3,-side],[half-5,-side],[half, -side+3],[half,side-3],[half-5,side],[-half+3,side],[-half,side-4]]);}
        else if(kind==="muscle"){poly([[-half,-side+2],[-half+5,-side],[half-4,-side],[half, -side+3],[half,side-3],[half-4,side],[-half+5,side],[-half,side-2]]);}
        else if(kind==="sports"){poly([[-half+1,-side+5],[-half+9,-side],[half-10,-side],[half, -side+7],[half,side-7],[half-10,side],[-half+9,side],[-half+1,side-5]]);}
        else if(kind==="supercar"){poly([[-half,-side+7],[-half+8,-side],[2,-side+3],[half-8,-side],[half,0],[half-8,side],[2,side-3],[-half+8,side],[-half,side-7]]);}
        else if(kind==="van"){poly([[-half,-side+3],[-half+3,-side],[half-4,-side],[half, -side+4],[half,side-4],[half-4,side],[-half+3,side],[-half,side-3]]);}
        else if(kind==="pickup"){poly([[-half,-side+3],[-half+2,-side],[half-5,-side],[half, -side+5],[half,side-5],[half-5,side],[-half+2,side],[-half,side-3]]);}
        else if(kind==="offroad"||kind==="buggy"){poly([[-half+2,-side+5],[-half+8,-side+1],[half-9,-side+1],[half,-side+7],[half,side-7],[half-9,side-1],[-half+8,side-1],[-half+2,side-5]]);}
        else if(kind==="truck"){poly([[-half,-side+2],[-half+2,-side],[half-6,-side],[half,-side+5],[half,side-5],[half-6,side],[-half+2,side],[-half,side-2]]);}
        else{poly([[-half+1,-side+6],[-half+7,-side+2],[half-7,-side+2],[half,0],[half-7,side-2],[-half+7,side-2],[-half+1,side-6]]);}
        ctx.fill();
        ctx.fillStyle="rgba(255,255,255,.18)";ctx.fillRect(-half+6,-side+2,length-13,3);
        if(kind==="compact"){glass([[-7,-side+3],[7,-side+3],[10,side-3],[-7,side-3]]);}
        else if(kind==="sedan"){glass([[-8,-side+3],[9,-side+3],[13,side-3],[-8,side-3]]);ctx.fillStyle="rgba(0,0,15,.28)";ctx.fillRect(-half+3,-side+4,9,width-8);}
        else if(kind==="muscle"){glass([[-5,-side+4],[9,-side+4],[11,side-4],[-5,side-4]]);ctx.fillStyle="#17131b";ctx.fillRect(half-12,-4,8,8);ctx.fillStyle="rgba(255,255,255,.32)";ctx.fillRect(-half+4,-2,13,4);}
        else if(kind==="sports"||kind==="supercar"){glass([[-5,-side+3],[10,-side+4],[14,side-4],[-5,side-3]],kind==="supercar"?"#78d9ee":"#9ddbed");ctx.fillStyle="rgba(255,255,255,.58)";ctx.fillRect(-half+5,-1,length-10,2);if(kind==="supercar"){ctx.fillStyle="#111522";ctx.fillRect(-half+3,-side+3,6,width-6);}}
        else if(kind==="van"){glass([[half-13,-side+3],[half-3,-side+3],[half-3,side-3],[half-13,side-3]]);ctx.fillStyle="rgba(15,22,35,.62)";ctx.fillRect(-half+5,-side+4,22,width-8);ctx.strokeStyle="rgba(255,255,255,.3)";ctx.strokeRect(-half+7,-side+6,17,width-12);}
        else if(kind==="pickup"){glass([[3,-side+3],[half-4,-side+3],[half-4,side-3],[3,side-3]]);ctx.fillStyle="#101722";ctx.fillRect(-half+3,-side+4,20,width-8);ctx.strokeStyle="rgba(255,255,255,.38)";ctx.strokeRect(-half+5,-side+6,16,width-12);}
        else if(kind==="truck"){glass([[half-18,-side+4],[half-4,-side+4],[half-4,side-4],[half-18,side-4]]);ctx.fillStyle="#252b35";ctx.fillRect(-half+3,-side+3,25,width-6);for(let x=-half+7;x<-3;x+=7){ctx.strokeStyle="#6d7685";ctx.beginPath();ctx.moveTo(x,-side+5);ctx.lineTo(x,side-5);ctx.stroke();}}
        else if(kind==="offroad"){glass([[-4,-side+5],[9,-side+5],[11,side-5],[-4,side-5]]);ctx.strokeStyle="#d7dce5";ctx.lineWidth=2;ctx.strokeRect(-11,-side+2,24,width-4);ctx.fillStyle="#222b35";ctx.fillRect(-half+3,-4,10,8);}
        else if(kind==="buggy"){ctx.fillStyle="#151923";ctx.fillRect(-9,-8,18,16);ctx.strokeStyle="#e7e4cf";ctx.lineWidth=2;ctx.strokeRect(-12,-side+2,25,width-4);ctx.beginPath();ctx.moveTo(-12,-side+2);ctx.lineTo(12,side-2);ctx.moveTo(12,-side+2);ctx.lineTo(-12,side-2);ctx.stroke();}
        else{ctx.fillStyle="#151923";ctx.fillRect(-5,-7,12,14);ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.strokeRect(-9,-10,19,20);ctx.fillStyle=bodyColor;ctx.fillRect(half-3,-3,8,6);}
        if(skin==="taxi"){ctx.fillStyle="#171821";ctx.fillRect(-5,-side-3,11,5);ctx.fillStyle="#ffe84c";ctx.fillRect(-3,-side-4,7,2);}
        ctx.fillStyle=player?"#ffe84c":"#f4f7df";ctx.globalAlpha=headlights<8?.18:1;ctx.fillRect(half-3,-side+4,4,5);ctx.fillRect(half-3,side-9,4,5);ctx.globalAlpha=1;
        ctx.fillStyle="#e12f54";ctx.fillRect(-half,-side+4,3,5);ctx.fillRect(-half,side-9,3,5);
      }
      if(c.type==="storm-chaser"){ctx.strokeStyle="#bdf8ff";ctx.shadowColor="#31f5ff";ctx.shadowBlur=10;ctx.lineWidth=1.8;for(let a=0;a<3;a++){const y=(a-1)*8;ctx.beginPath();ctx.moveTo(-half-8,y);for(let x=-half-3;x<half+9;x+=7)ctx.lineTo(x,y+Math.sin(x*2.4+t*9+a)*5);ctx.stroke();}ctx.shadowBlur=0;ctx.fillStyle="#ffe84c";ctx.fillRect(-2,-3,13,6);}
      if(c.type==="voidrunner"){ctx.strokeStyle="#e1b4ff";ctx.shadowColor="#b15cff";ctx.shadowBlur=14;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,half+2,side+2,0,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;}
      if(c.type==="magma-phantom"){ctx.strokeStyle="#ffe05e";ctx.shadowColor="#ff3b21";ctx.shadowBlur=10;ctx.lineWidth=2;[[-14,-8,-4,1],[0,-10,6,0],[6,0,15,8],[-8,8,1,2]].forEach(q=>{ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo((q[0]+q[2])/2+3,(q[1]+q[3])/2);ctx.lineTo(q[2],q[3]);ctx.stroke();});ctx.shadowBlur=0;}
      if(c.type==="crystal-ghost"){ctx.globalAlpha=.45+.2*Math.sin(t*5);ctx.fillStyle="#fff";poly([[-half+3,0],[-6,-side-5],[half-3,0],[-5,side+5]]);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle="#f0d7ff";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-half+3,0);ctx.lineTo(half-3,0);ctx.moveTo(-6,-side-5);ctx.lineTo(-5,side+5);ctx.stroke();}
      if(player&&speed>3.2){ctx.strokeStyle=keys.has("boost")?"rgba(49,245,255,.78)":"rgba(255,255,255,.28)";ctx.lineWidth=2;for(const y of [-side+4,side-4]){ctx.beginPath();ctx.moveTo(-half-2,y);ctx.lineTo(-half-10-Math.min(22,speed*2),y);ctx.stroke();}}
      if(body<70){ctx.strokeStyle=body<30?"#ff7043":"#202331";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-7,-side+2);ctx.lineTo(-2,-3);ctx.lineTo(-8,2);ctx.moveTo(half-9,side-1);ctx.lineTo(half-13,3);ctx.stroke();}
      if(engine<35){ctx.fillStyle="rgba(38,38,48,.68)";ctx.beginPath();ctx.arc(half-5,-2,3+(35-engine)/18,0,Math.PI*2);ctx.fill();}
      ctx.restore();
    };
    const drawPoliceCar=(p,t)=>{const armored=p.kind==="armored",interceptor=p.kind==="interceptor",unit=p.kind==="unit",wrecked=p.wreckedUntil>t,stunned=p.stunUntil>t,length=armored?50:unit?46:interceptor?45:42,width=armored?30:unit?25:interceptor?22:25,half=length/2,side=width/2;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillStyle="rgba(2,3,12,.4)";ctx.beginPath();ctx.ellipse(2,3,half+4,side+4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#090b13";for(const x of [-half+7,half-11])for(const y of [-side-2,side-2])ctx.fillRect(x,y,8,4);ctx.fillStyle=wrecked?"#292832":unit?"#09020e":armored?"#252c38":interceptor?"#dce5ef":"#eef2f5";ctx.beginPath();ctx.moveTo(-half+2,-side+3);ctx.lineTo(-half+7,-side);ctx.lineTo(half-7,-side);ctx.lineTo(half,-side+5);ctx.lineTo(half,side-5);ctx.lineTo(half-7,side);ctx.lineTo(-half+7,side);ctx.lineTo(-half+2,side-3);ctx.closePath();ctx.fill();ctx.fillStyle=wrecked?"#11121a":"#182131";ctx.fillRect(-7,-side+4,19,width-8);ctx.fillStyle=wrecked?"#34343d":"#78a9c5";ctx.fillRect(2,-side+5,8,width-10);ctx.fillStyle=armored?"#ff7043":unit?"#ff3eb5":"#244e91";ctx.fillRect(-half+4,-2,length-8,4);ctx.fillStyle="#0b0d15";ctx.fillRect(half-3,-side+4,4,width-8);if(armored){ctx.fillStyle="#5e6878";for(let y=-9;y<=9;y+=6)ctx.fillRect(half-1,y,5,3);ctx.fillStyle="#151923";ctx.fillRect(-half+2,-side+3,10,width-6);}else if(interceptor){ctx.fillStyle="#1a2234";ctx.beginPath();ctx.moveTo(-half,-side);ctx.lineTo(-half-7,-side-5);ctx.lineTo(-half+5,-side+2);ctx.fill();ctx.beginPath();ctx.moveTo(-half,side);ctx.lineTo(-half-7,side+5);ctx.lineTo(-half+5,side-2);ctx.fill();}else if(unit){ctx.strokeStyle="#ff3eb5";ctx.shadowColor="#ff3eb5";ctx.shadowBlur=10;ctx.lineWidth=2;ctx.strokeRect(-half+2,-side+2,length-4,width-4);ctx.shadowBlur=0;ctx.fillStyle="#31f5ff";ctx.fillRect(-half+5,-side-2,12,2);}ctx.fillStyle=stunned?"#ffe84c":Math.floor(t/120)%2?"#ff214f":"#3185ff";ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=wrecked?0:8;ctx.fillRect(-1,-side-3,9,4);ctx.shadowBlur=0;ctx.fillStyle="#fff5d7";ctx.fillRect(half-2,-side+4,3,5);ctx.fillRect(half-2,side-9,3,5);ctx.fillStyle="#e12f54";ctx.fillRect(-half,-side+4,3,5);ctx.fillRect(-half,side-9,3,5);if(wrecked){ctx.strokeStyle="#ff7043";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-11,-7);ctx.lineTo(11,7);ctx.moveTo(11,-7);ctx.lineTo(-11,7);ctx.stroke();}ctx.restore();};
    const drawPerson=p=>{ctx.save();ctx.translate(p.x,p.y);if(p.downUntil>performance.now()){ctx.rotate(Math.PI/2);ctx.globalAlpha=.78;}ctx.fillStyle="#f0c7a5";ctx.fillRect(-4,-10,8,8);ctx.fillStyle=p.color||"#31f5ff";ctx.fillRect(-5,-2,10,12);ctx.fillStyle="#17103c";ctx.fillRect(-5,10,4,7);ctx.fillRect(2,10,4,7);ctx.restore();};
    const drawMiniMap=()=>{const mw=mapCanvas.width,mh=mapCanvas.height,sx=x=>x/world.w*mw,sy=y=>y/world.h*mh;mctx.clearRect(0,0,mw,mh);for(let row=0;row<3;row++)for(let col=0;col<4;col++){const type=biomeGrid[row][col],x=col*mw/4,y=row*mh/3;mctx.fillStyle=biomeColors[type];mctx.fillRect(x,y,mw/4,mh/3);mctx.fillStyle="rgba(5,3,18,.42)";mctx.font="bold 7px monospace";mctx.textAlign="center";mctx.fillText(biomeNames[type].split("-")[0],x+mw/8,y+12);}mctx.strokeStyle="rgba(255,255,255,.28)";mctx.lineWidth=1;for(let x=mw/4;x<mw;x+=mw/4){mctx.beginPath();mctx.moveTo(x,0);mctx.lineTo(x,mh);mctx.stroke();}for(let y=mh/3;y<mh;y+=mh/3){mctx.beginPath();mctx.moveTo(0,y);mctx.lineTo(mw,y);mctx.stroke();}roads.forEach(r=>{const start=r.from||0,end=r.to||(r.axis==="v"?world.h:world.w);mctx.strokeStyle="#242833";mctx.lineWidth=Math.max(2,r.width/world.w*mw);mctx.beginPath();if(r.axis==="v"){mctx.moveTo(sx(r.pos),sy(start));mctx.lineTo(sx(r.pos),sy(end));}else{mctx.moveTo(sx(start),sy(r.pos));mctx.lineTo(sx(end),sy(r.pos));}mctx.stroke();mctx.strokeStyle="rgba(255,232,76,.65)";mctx.lineWidth=1;mctx.stroke();});landmarks.forEach(l=>{mctx.fillStyle=l.type==="garage"?"#31f5ff":"#fff";mctx.fillRect(sx(l.x)-2,sy(l.y)-2,4,4);});secrets.filter(s=>!currentPlayer.secrets.includes(s.id)).forEach(s=>{mctx.fillStyle="#ffe84c";mctx.font="bold 8px monospace";mctx.textAlign="center";mctx.fillText("?",sx(s.x),sy(s.y)+3);});const m=activeMission();if(m){mctx.strokeStyle="#31f5ff";mctx.lineWidth=2;mctx.beginPath();mctx.arc(sx(m.x),sy(m.y),6+Math.sin(performance.now()/180)*2,0,Math.PI*2);mctx.stroke();mctx.fillStyle="#31f5ff";mctx.font="bold 8px monospace";mctx.textAlign="center";mctx.fillText("!",sx(m.x),sy(m.y)+3);}const target=targets[targetIndex],a=actor();mctx.fillStyle="#ff3eb5";mctx.beginPath();mctx.arc(sx(target.x),sy(target.y),4,0,Math.PI*2);mctx.fill();mctx.fillStyle=mode==="car"?"#ffe84c":"#fff";mctx.beginPath();mctx.arc(sx(a.x),sy(a.y),4,0,Math.PI*2);mctx.fill();mctx.strokeStyle="#050312";mctx.lineWidth=3;mctx.strokeRect(0,0,mw,mh);};
    const keepInside=o=>{o.x=Math.max(14,Math.min(world.w-14,o.x));o.y=Math.max(14,Math.min(world.h-14,o.y));};
    const pursuitRoles=level=>[[],["patrol"],["patrol","interceptor"],["patrol","interceptor","patrol"],["interceptor","armored","patrol","armored"],["unit","interceptor","armored","patrol"]][level];
    const nearestValue=(values,n)=>values.reduce((best,v)=>Math.abs(v-n)<Math.abs(best-n)?v:best,values[0]);
    const pursuitTarget=p=>{const c=currentCar,speed=Math.max(2,Math.abs(c.speed)),lead=p.kind==="interceptor"?58:p.kind==="unit"?38:p.kind==="armored"?12:0;let x=c.x+Math.cos(c.angle)*speed*lead,y=c.y+Math.sin(c.angle)*speed*lead;if(p.kind==="interceptor"){if(Math.abs(Math.cos(c.angle))>.55){x=nearestValue([620,1950,3250,4550],x);y=nearestValue([760,1600,2440,3200,4040],c.y);}else{x=nearestValue([620,1950,3250,4550],c.x);y=nearestValue([760,1600,2440,3200,4040],y);}}return{x:Math.max(30,Math.min(world.w-30,x)),y:Math.max(30,Math.min(world.h-30,y))};};
    const policeRoadTarget=p=>{const predicted=pursuitTarget(p),shortcut=p.kind==="interceptor"&&Math.floor(performance.now()/3200+(p.routeSeed||0))%4===0&&clearSight(p,predicted,460);if(shortcut)return predicted;const node=nextRoadNode(p,predicted);return Math.hypot(p.x-node.x,p.y-node.y)<38?nextRoadNode({...p,x:node.x,y:node.y},predicted):node;};
    const outlawUpdate=dt=>{
      gameMinutes=(gameMinutes+.045*dt)%1440;
      const now=performance.now(),aBefore=actor(),biomeNow=biomeAt(aBefore.x,aBefore.y);
      crashFx.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.94,dt);p.vy=p.vy*Math.pow(.94,dt)+.045*dt;p.life-=dt;});crashFx.particles=crashFx.particles.filter(p=>p.life>0);
      if(mode==="car"){
        const c=currentCar,v=tunedVehicle(byId(c.type)),condition=c.condition,road=isRoad(c.x,c.y),engine=condition.engine/100,tires=condition.tires/100,surface=road?1:v.offroad,gasHeld=keys.has("gas")||(isMobileMode()&&uiSettings.autoThrottle===true);
        const misfire=condition.engine<18&&Math.sin(now/125)>.86;if(condition.engine>0&&condition.fuel>0&&gasHeld&&!misfire)c.speed+=v.accel*(.14+.86*engine)*dt;
        if(keys.has("brake"))c.speed-=v.accel*(.2+.52*tires)*dt;if(!gasHeld&&!keys.has("brake"))c.speed*=Math.pow(.965+(1-tires)*.012,dt);
        let max=v.max*surface*(.22+.78*engine);if(keys.has("boost")&&c.boost>0&&c.speed>0&&condition.engine>8&&condition.fuel>0){max*=1.42;c.speed+=v.accel*.8*engine*dt;c.boost=Math.max(0,c.boost-v.boostDrain*dt);condition.engine=Math.max(0,condition.engine-.004*dt);}else c.boost=Math.min(100,c.boost+v.boostRecharge*dt);
        max*=.58+.42*tires;c.speed=Math.max(-max*.38,Math.min(max,c.speed));const keyboardSteer=(keys.has("right")?1:0)-(keys.has("left")?1:0);if(observedInputReset!==mobileInput.resetSerial){mobileSteer=0;observedInputReset=mobileInput.resetSerial;}mobileSteer+=(mobileInput.moveX-mobileSteer)*(1-Math.pow(.78,Math.max(.2,dt)));if(Math.abs(mobileSteer)<.002)mobileSteer=0;const steer=isMobileMode()?mobileSteer:keyboardSteer,steeringGrip=.35+.65*tires;if(Math.abs(c.speed)>.12)c.angle+=steer*v.turn*steeringGrip*Math.min(1,Math.abs(c.speed)/2)*Math.sign(c.speed)*dt;
        const fromX=c.x,fromY=c.y;c.x+=Math.cos(c.angle)*c.speed*dt;c.y+=Math.sin(c.angle)*c.speed*dt;const obstacle=solidAt(c.x,c.y,18),bx=c.x,by=c.y;keepInside(c);if(obstacle||bx!==c.x||by!==c.y){const impactSpeed=Math.abs(c.speed);c.x=obstacle?fromX:c.x;c.y=obstacle?fromY:c.y;if(impactSpeed>=.85&&now-(c.hitAt||0)>650){const impact=impactSpeed*3;triggerCrash(impact,"property",impact>14?"engine":"body");damageCar(impactSpeed<2?2.5:5+impactSpeed,"body");if(impactSpeed>1.2)damageFragileCargo(impact);if(impactSpeed>1.15&&obstacle?.kind==="parked car")raiseHeat(4+impactSpeed*.8,"VEHICLE COLLISION");c.hitAt=now;}c.speed*=impactSpeed<.85?-.08:-.2;}
        condition.fuel=Math.max(0,condition.fuel-Math.abs(c.speed)*.0017*dt-(keys.has("boost")?.006*dt:0));const rec=carRecord(c.type);rec.mileage+=Math.abs(c.speed)*dt/4200;rec.condition=(condition.engine+condition.tires+condition.body)/3;if(condition.fuel<=0||condition.engine<=0){c.speed*=Math.pow(.9,dt);c.boost=0;}
      }else{const keyboardX=(keys.has("right")?1:0)-(keys.has("left")?1:0),keyboardY=(keys.has("brake")?1:0)-(keys.has("gas")?1:0);let dx=isMobileMode()?mobileInput.moveX:keyboardX,dy=isMobileMode()?mobileInput.moveY:keyboardY,len=Math.hypot(dx,dy),magnitude=Math.min(1,len),speed=keys.has("boost")?3.7:2.35,fromX=person.x,fromY=person.y;if(len){person.x+=dx/len*speed*dt*magnitude;person.y+=dy/len*speed*dt*magnitude;person.angle=Math.atan2(dy,dx);}keepInside(person);if(solidAt(person.x,person.y,9)){person.x=fromX;person.y=fromY;}}
      const a=actor(),trafficCount=Math.floor(traffic.length*(isNight()?.62:1));traffic.forEach((n,i)=>{if(i>=trafficCount)return;const {from,to}=roadLimits(n.road),length=to-from,position=n.axis==="x"?n.x:n.y,wrapped=from+(((position+n.speed*dt-from)%length)+length)%length;if(n.axis==="x")n.x=wrapped;else n.y=wrapped;if(biomeAt(n.x,n.y)==="city"&&i%4===0)return;if(mode==="car"&&Math.hypot(currentCar.x-n.x,currentCar.y-n.y)<29&&now-(n.hitAt||0)>750){const nvx=n.axis==="x"?n.speed:0,nvy=n.axis==="y"?n.speed:0,relative=Math.hypot(Math.cos(currentCar.angle)*currentCar.speed-nvx,Math.sin(currentCar.angle)*currentCar.speed-nvy);n.hitAt=now;if(relative<1.15){currentCar.speed*=.94;return;}const force=3+relative*2.6;triggerCrash(force,"traffic",relative>3?"engine":"body");damageCar(2+relative*1.15,relative>3?"engine":"body");damageFragileCargo(force);raiseHeat(3+relative*1.35,relative>=3?"RECKLESS CRASH":"VEHICLE COLLISION");currentCar.speed*=relative>=3?-.2:.55;}});
      npcs.forEach((n,i)=>{if(isNight()&&i%3===0)return;if(n.downUntil>now)return;if(n.downUntil){n.downUntil=0;n.vx=(Math.random()-.5)*.9;n.vy=(Math.random()-.5)*.9;}if(mode==="car"&&Math.abs(currentCar.speed)>1&&Math.hypot(currentCar.x-n.x,currentCar.y-n.y)<25){n.downUntil=now+6500;n.vx=n.vy=0;triggerCrash(6,"traffic","body");damageCar(3,"body");damageFragileCargo(6);raiseHeat(18,"HIT AND RUN");currentCar.speed*=.76;return;}n.timer-=dt;if(n.timer<0){n.vx=(Math.random()-.5)*.9;n.vy=(Math.random()-.5)*.9;n.timer=60+Math.random()*130;}const fromX=n.x,fromY=n.y;n.x+=n.vx*dt;n.y+=n.vy*dt;keepInside(n);if(i%8!==0&&isRoad(n.x,n.y)){n.x=fromX;n.y=fromY;n.vx*=-1;n.vy*=-1;}});
      pickups.forEach(p=>{if(!p.taken&&Math.hypot(a.x-p.x,a.y-p.y)<24){p.taken=true;grant(2,1);if(mode==="car")currentCar.condition.fuel=Math.min(100,currentCar.condition.fuel+2);}});const target=targets[targetIndex];if(Math.hypot(a.x-target.x,a.y-target.y)<65){mission++;targetIndex=(targetIndex+1)%targets.length;grant(30,18,"BIOM CHECKPOINT! +30 ÉRME");}const m=activeMission();if(m&&!missionDone(m.id)&&Math.hypot(a.x-m.x,a.y-m.y)<70)completeMission(m);
      secrets.forEach(s=>{if(!currentPlayer.secrets.includes(s.id)&&Math.hypot(a.x-s.x,a.y-s.y)<secretReach(s)){currentPlayer.secrets.push(s.id);if(s.vehicle&&!currentPlayer.vehicles.includes(s.vehicle)){currentPlayer.vehicles.push(s.vehicle);carRecord(s.vehicle);grant(35,25,`TITKOS AUTÓ: ${byId(s.vehicle).name} FELOLDVA!`);}else grant(35,25,`EASTER EGG: ${s.name} • +35 ÉRME`);}});
      if(activeJob){activeJob.time-=dt/60;if(activeJob.time<=0)failJob("TIME");else if(activeJob.cargo<=0)failJob("CARGO DESTROYED");else{const wp=activeJob.waypoints[activeJob.index];if(Math.hypot(a.x-wp.x,a.y-wp.y)<72){const final=activeJob.index===activeJob.waypoints.length-1;if(final&&activeJob.spec.id==="fugitive"&&wantedLevel()>0){if(now-(activeJob.escapeWarnAt||0)>1800){flashAlert("DELIVERY LOCKED • LOSE THE POLICE FIRST");activeJob.escapeWarnAt=now;}}else{activeJob.index++;if(activeJob.index>=activeJob.waypoints.length)finishJob();else flashAlert(`CHECKPOINT ${activeJob.index}/${activeJob.waypoints.length}`);}}}}
      const level=wantedLevel(),roles=pursuitRoles(level),desired=roles.length;while(police.length<desired&&mode==="car"){const kind=roles[police.length],cut=pursuitTarget({kind}),side=police.length%2?1:-1,spawn=kind==="interceptor"?{x:cut.x+Math.cos(currentCar.angle+Math.PI/2)*360*side,y:cut.y+Math.sin(currentCar.angle+Math.PI/2)*360*side}:{x:currentCar.x-Math.cos(currentCar.angle)*(360+police.length*45),y:currentCar.y-Math.sin(currentCar.angle)*(360+police.length*45)},safe=nearestRoadPoint(spawn,24),fallback=nearestRoadPoint(cut,24),start=solidAt(safe.x,safe.y,18)?fallback:safe;police.push({x:start.x,y:start.y,angle:start.road.axis==="v"?Math.PI/2:0,speed:2.1,kind,routeSeed:police.length*1.37,hitAt:0,empAt:0,trafficHitAt:0,hp:100,stunUntil:0,wreckedUntil:0});}while(police.length>desired)police.pop();police.forEach((p,i)=>p.kind=roles[i]||p.kind);if(level===5&&mode==="car"&&!drones.length)drones.push({x:currentCar.x-500,y:currentCar.y-500,phase:0});if(level<5)drones.length=0;let seen=false;
      police.forEach(p=>{if(mode!=="car")return;if(p.wreckedUntil){if(now<p.wreckedUntil){p.speed=0;return;}p.wreckedUntil=0;p.hp=45;}if(p.stunUntil>now){p.speed*=Math.pow(.82,dt);if(clearSight(p,currentCar,520))seen=true;return;}const target=policeRoadTarget(p),ang=Math.atan2(target.y-p.y,target.x-p.x),turn=((ang-p.angle+Math.PI*3)%(Math.PI*2))-Math.PI,turnRate=p.kind==="interceptor"?.065:p.kind==="unit"?.058:p.kind==="armored"?.038:.045,top=p.kind==="interceptor"?3.35+level*.1:p.kind==="armored"?2.75+level*.08:p.kind==="unit"?3.65:2.15+level*.18;p.angle+=Math.max(-turnRate,Math.min(turnRate,turn));p.speed+=(top-p.speed)*.05*dt;const fromX=p.x,fromY=p.y;p.x+=Math.cos(p.angle)*p.speed*dt;p.y+=Math.sin(p.angle)*p.speed*dt;const bx=p.x,by=p.y,obstacle=solidAt(p.x,p.y,18);keepInside(p);if(obstacle||bx!==p.x||by!==p.y){const impact=Math.abs(p.speed);p.x=fromX;p.y=fromY;p.hp-=8+impact*6;p.stunUntil=now+700+impact*180;p.speed*=-.12;if(p.hp<=0)p.wreckedUntil=now+4200;return;}const trafficHit=traffic.find(n=>Math.hypot(p.x-n.x,p.y-n.y)<29&&now-(p.trafficHitAt||0)>900);if(trafficHit){const relative=Math.abs(p.speed-trafficHit.speed);p.hp-=10+relative*7;p.stunUntil=now+800+relative*170;p.trafficHitAt=now;trafficHit.hitAt=now;p.speed*=.2;trafficHit.speed*=.72;if(p.hp<=0)p.wreckedUntil=now+4200;return;}const d=Math.hypot(currentCar.x-p.x,currentCar.y-p.y);if(clearSight(p,currentCar,520))seen=true;if(p.kind==="unit"&&d<220&&clearSight(p,currentCar,260)&&now-p.empAt>6000){currentCar.condition.headlights=Math.max(0,currentCar.condition.headlights-14);currentCar.boost=Math.max(0,currentCar.boost-28);p.empAt=now;flashAlert("NEON UNIT EMP • LIGHTS / BOOST HIT");}if(d<33&&now-p.hitAt>1100){const ram=p.kind==="armored"?14:p.kind==="unit"?12:6+level*.7,part=p.kind==="interceptor"?"tires":"engine",force=ram+(p.kind==="armored"?3:0);triggerCrash(force,"police",part);damageCar(ram,part);damageFragileCargo(force);currentCar.speed*=p.kind==="armored"?.55:.74;p.hp-=force*1.25;p.stunUntil=now+650+force*35;p.speed*=.3;p.hitAt=now;if(p.hp<=0)p.wreckedUntil=now+4200;}});drones.forEach(d=>{d.phase+=dt;d.x+=(currentCar.x-d.x)*.018*dt;d.y+=(currentCar.y-d.y)*.018*dt;if(clearSight(d,currentCar,850))seen=true;});
      if(level<3)roadblocks.length=0;else{for(let i=roadblocks.length-1;i>=0;i--)if(roadblocks[i].hit&&now-roadblocks[i].hitAt>1200)roadblocks.splice(i,1);const desiredBlocks=Math.min(3,level-2),activeBlocks=roadblocks.filter(b=>!b.hit);while(activeBlocks.length>desiredBlocks){const old=activeBlocks.pop();roadblocks.splice(roadblocks.indexOf(old),1);}if(mode==="car"&&activeBlocks.length<desiredBlocks&&now-lastRoadblockDeploy>3600){const cut=nearestRoadPoint(pursuitTarget({kind:"interceptor"}),38),clear= Math.hypot(currentCar.x-cut.x,currentCar.y-cut.y)>220&&activeBlocks.every(b=>Math.hypot(b.x-cut.x,b.y-cut.y)>280)&&!solidAt(cut.x,cut.y,12);if(clear){const kind=(activeBlocks.length+Math.floor(now/3600))%2?"roadblock":"spikes";roadblocks.push({x:cut.x,y:cut.y,angle:(cut.road.axis==="v"?Math.PI/2:0)+Math.PI/2,kind,hit:false,deployedAt:now});lastRoadblockDeploy=now;}}}roadblocks.forEach(b=>{if(level>=3&&mode==="car"&&!b.hit){const dx=currentCar.x-b.x,dy=currentCar.y-b.y,along=Math.abs(dx*Math.cos(b.angle)+dy*Math.sin(b.angle)),across=Math.abs(-dx*Math.sin(b.angle)+dy*Math.cos(b.angle)),hit=along<(b.kind==="roadblock"?47:43)&&across<24;if(!hit)return;b.hit=true;b.hitAt=now;if(b.kind==="spikes"){triggerCrash(9,"spikes","tires");damageCar(26,"tires");damageFragileCargo(9);flashAlert("SPIKE STRIP • TIRES SHREDDED");}else{triggerCrash(19,"police","engine");damageCar(17,"engine");damageFragileCargo(19);raiseHeat(6,"ROADBLOCK BREACHED");currentCar.speed*=-.35;}}});
      if(level&&now-lastCrime>4500){if(!seen){escapeProgress+=dt/60;if(escapeProgress>7){heat=Math.max(0,heat-22);escapeProgress=0;if(!heat){roadblocks.length=0;police.length=0;drones.length=0;}flashAlert(heat?"LINE OF SIGHT BROKEN • HEAT DROPPING":"PURSUIT ESCAPED");}}else escapeProgress=0;}if(biomeNow!==lastBiome){const countyPair=[lastBiome,biomeNow].sort().join("|");if(level&&!seen&&countyPair!==lastCountyPair&&(!lastCountyRelief||now-lastCountyRelief>30000)){heat=Math.max(0,heat-10);lastCountyRelief=now;lastCountyPair=countyPair;flashAlert("COUNTY LINE CROSSED • HEAT -10");}lastBiome=biomeNow;}
      if(!rareSpawned&&isNight()&&biomeNow==="rainforest"){parked.push({x:4800,y:1040,angle:Math.PI/2,speed:0,boost:100,type:"storm-chaser",condition:freshCondition("storm-chaser",true)});rareSpawned=true;flashAlert("RUMOR: LIGHTNING CAR SEEN IN MONSOON RAINFOREST");}if(!voidSignal&&gameMinutes>=133&&gameMinutes<136){voidSignal=true;parked.push({x:2200,y:4300,angle:0,speed:0,boost:100,type:"voidrunner",condition:freshCondition("voidrunner",true)});flashAlert("02:13 — VOID HIGHWAY • UNKNOWN TRANSMISSION");}
      let near=null;if(mode==="foot")parked.forEach(c=>{if(Math.hypot(person.x-c.x,person.y-c.y)<55)near=c;});const site=!activeJob&&nearestJobSite(),condition=mode==="car"?currentCar.condition:null,time=clockText();$("#drive-speed").textContent=mode==="car"?Math.round(Math.abs(currentCar.speed)*28):"GYALOG";$("#drive-biome").textContent=biomeNames[biomeAt(a.x,a.y)];$("#drive-time").textContent=time;$("#road-clock").textContent=time;$("#drive-mode").textContent=mode==="car"?`🚗 ${byId(currentCar.type).name}`:"🚶 GYALOGOS";$("#drive-heat").textContent=`${"● ".repeat(level)}${"○ ".repeat(5-level)}`.trim();["engine","tires","body","fuel"].forEach(k=>{const el=$(`#damage-${k}`);if(el)el.style.width=`${condition?condition[k]:0}%`;});
      $("#drive-job").textContent=activeJob?`${activeJob.spec.icon} ${activeJob.spec.name} • ${Math.ceil(activeJob.time)}s • CARGO ${Math.round(activeJob.cargo)}%${escapeProgress?` • ESCAPE ${Math.ceil(7-escapeProgress)}s`:""}`:site?`E: ${jobTypes[site.type].icon} START ${jobTypes[site.type].name}`:"";$("#drive-objective").textContent=activeJob?`TARGET ${activeJob.index+1}/${activeJob.waypoints.length} • ${activeJob.spec.desc}`:m?`${m.icon} ${m.title}: ${m.desc}`:"🏁 MINDEN BIOM-KÜLDETÉS KÉSZ";$("#drive-prompt").textContent=nearGarage()?"E: GARAGE • REPAIR • CLEAR HEAT":mode==="car"&&Math.abs(currentCar.speed)<.6?"E: KISZÁLLÁS":near?`E: ${byId(near.type).name}`:"";
    };
    const draw=()=>{const a=actor(),currentBiome=biomeAt(a.x,a.y),camX=Math.max(0,Math.min(world.w-720,a.x-360)),camY=Math.max(0,Math.min(world.h-480,a.y-240)),visible=o=>o.x>camX-80&&o.x<camX+800&&o.y>camY-80&&o.y<camY+560;ctx.save();ctx.translate(-camX,-camY);for(let row=0;row<3;row++)for(let col=0;col<4;col++){const type=biomeGrid[row][col];ctx.fillStyle=terrainPatterns[type]||biomeColors[type];ctx.fillRect(col*cell.w,row*cell.h,cell.w,cell.h);}drawBiomeTransitions();drawWaters();drawRoads();drawScenicSpots();decor.filter(visible).forEach(drawDecor);streetProps.filter(visible).forEach(drawStreetProp);buildings.filter(visible).forEach(drawBuilding);landmarks.filter(visible).forEach(drawLandmark);pickups.filter(p=>!p.taken&&visible(p)).forEach(p=>{ctx.fillStyle="rgba(0,0,0,.25)";ctx.beginPath();ctx.ellipse(p.x+2,p.y+6,9,4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ffe84c";ctx.beginPath();ctx.arc(p.x,p.y,7,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff5a6";ctx.fillRect(p.x-2,p.y-5,3,5);});secrets.filter(s=>!currentPlayer.secrets.includes(s.id)&&visible(s)).forEach(s=>{ctx.fillStyle="rgba(255,232,76,.35)";ctx.beginPath();ctx.arc(s.x,s.y,18+Math.sin(performance.now()/220)*5,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.font="14px monospace";ctx.textAlign="center";ctx.fillText("?",s.x,s.y+5);});const m=activeMission();if(m&&visible(m)){const pulse=32+Math.sin(performance.now()/150)*7;ctx.strokeStyle="#31f5ff";ctx.lineWidth=5;ctx.beginPath();ctx.arc(m.x,m.y,pulse,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#ffe84c";ctx.font="bold 18px monospace";ctx.textAlign="center";ctx.fillText(m.icon,m.x,m.y+6);}const target=targets[targetIndex],pulse=27+Math.sin(performance.now()/180)*8;ctx.strokeStyle="#ff3eb5";ctx.lineWidth=6;ctx.beginPath();ctx.arc(target.x,target.y,pulse,0,Math.PI*2);ctx.stroke();parked.filter(visible).forEach(c=>drawCar(c));traffic.filter(visible).forEach(c=>drawCar({...c,angle:(c.axis==="x"?0:Math.PI/2)+(c.direction<0?Math.PI:0)}));npcs.filter(visible).forEach(drawPerson);if(mode==="car")drawCar(currentCar,true);else drawPerson({...person,color:"#ffe84c"});ctx.restore();drawWeather(currentBiome);drawMiniMap();};
    const drawOutlawLayer=()=>{const a=actor(),camX=Math.max(0,Math.min(world.w-720,a.x-360)),camY=Math.max(0,Math.min(world.h-480,a.y-240)),visible=o=>o.x>camX-90&&o.x<camX+810&&o.y>camY-90&&o.y<camY+570,t=performance.now();ctx.save();ctx.translate(-camX,-camY);
      if(t<crashFx.shakeUntil){const fade=(crashFx.shakeUntil-t)/520,amp=crashFx.strength*Math.max(.2,fade);canvas.style.transform=`translate(${(Math.random()-.5)*amp}px,${(Math.random()-.5)*amp}px)`;}else canvas.style.transform="";crashFx.particles.filter(visible).forEach(p=>{ctx.globalAlpha=Math.min(1,p.life/12);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size);ctx.globalAlpha=1;});
      if(mode==="car"&&currentCar.condition.engine<40){const severity=1-currentCar.condition.engine/40;for(let i=0;i<4;i++){const age=(t*.035+i*17)%58;ctx.fillStyle=`rgba(38,35,48,${(.45-age/150)*severity})`;ctx.beginPath();ctx.arc(currentCar.x-Math.cos(currentCar.angle)*(18+age)+Math.sin(i*9)*5,currentCar.y-Math.sin(currentCar.angle)*(18+age)-age*.35,3+age*.11,0,Math.PI*2);ctx.fill();}}if(mode==="car"&&currentCar.condition.body<20){ctx.fillStyle="#ffb23e";for(let i=0;i<3;i++){const s=(t*.08+i*13)%32;ctx.fillRect(currentCar.x-Math.cos(currentCar.angle)*s,currentCar.y-Math.sin(currentCar.angle)*s,2,2);}}
      roadblocks.filter(b=>b.kind==="spikes"&&!b.hit&&visible(b)).forEach(b=>{ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle);ctx.fillStyle="#b9c6d9";for(let x=-33;x<=33;x+=11){ctx.beginPath();ctx.moveTo(x,5);ctx.lineTo(x+5,-9);ctx.lineTo(x+10,5);ctx.fill();}ctx.restore();});drones.filter(visible).forEach(d=>{ctx.save();ctx.translate(d.x,d.y);ctx.strokeStyle="#ff3eb5";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.stroke();ctx.fillStyle=Math.floor(t/100)%2?"#ff214f":"#3185ff";ctx.fillRect(-5,-5,10,10);ctx.strokeStyle="rgba(255,62,181,.35)";ctx.beginPath();ctx.arc(0,0,34+Math.sin(t/90)*5,0,Math.PI*2);ctx.stroke();ctx.restore();});
      jobSites.filter(visible).forEach(s=>{const j=jobTypes[s.type],pulse=18+Math.sin(t/180)*4;ctx.fillStyle="rgba(49,245,255,.16)";ctx.beginPath();ctx.arc(s.x,s.y,pulse,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#31f5ff";ctx.lineWidth=3;ctx.stroke();ctx.fillStyle="#fff";ctx.font="16px sans-serif";ctx.textAlign="center";ctx.fillText(j.icon,s.x,s.y+6);});if(activeJob){const wp=activeJob.waypoints[activeJob.index];ctx.strokeStyle="#ffe84c";ctx.lineWidth=5;ctx.beginPath();ctx.arc(wp.x,wp.y,30+Math.sin(t/130)*7,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#ffe84c";ctx.font="bold 11px monospace";ctx.fillText("JOB",wp.x,wp.y+4);}
      roadblocks.filter(b=>b.kind==="roadblock"&&!b.hit&&visible(b)).forEach(b=>{ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle);ctx.fillStyle="#ff7043";ctx.fillRect(-30,-7,60,14);ctx.fillStyle="#fff";for(let x=-25;x<26;x+=15)ctx.fillRect(x,-7,8,14);ctx.restore();});police.filter(visible).forEach(p=>drawPoliceCar(p,t));ctx.restore();
      if(isNight()){const hour=gameMinutes/60,dark=hour>=21||hour<5?.58:.36;ctx.fillStyle=`rgba(3,4,20,${dark})`;ctx.fillRect(0,0,720,480);ctx.save();ctx.translate(-camX,-camY);streetProps.filter(p=>p.type===2&&visible(p)).forEach(p=>{const g=ctx.createRadialGradient(p.x,p.y-22,2,p.x,p.y-22,66);g.addColorStop(0,"rgba(255,235,150,.65)");g.addColorStop(1,"rgba(255,220,110,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y-22,66,0,Math.PI*2);ctx.fill();});if(mode==="car"&&currentCar.condition.headlights>8){ctx.save();ctx.translate(currentCar.x,currentCar.y);ctx.rotate(currentCar.angle);const beam=ctx.createLinearGradient(15,0,170,0);beam.addColorStop(0,`rgba(220,245,255,${.25*currentCar.condition.headlights/100})`);beam.addColorStop(1,"rgba(220,245,255,0)");ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(12,-12);ctx.lineTo(180,-62);ctx.lineTo(180,62);ctx.lineTo(12,12);ctx.closePath();ctx.fill();ctx.restore();}ctx.restore();}if(biomeAt(a.x,a.y)==="rainforest"&&isNight()){ctx.fillStyle="rgba(49,245,255,.08)";for(let i=0;i<9;i++)ctx.fillRect((i*91+t*.04)%760,300+(i%3)*42,75,3);}
      if(isNight()&&mode==="car"&&currentCar.condition.headlights<=8){ctx.fillStyle="rgba(0,0,9,.32)";ctx.fillRect(0,0,720,480);}if(t<crashFx.flashUntil){ctx.fillStyle=crashFx.police?"rgba(70,90,255,.3)":"rgba(255,235,205,.34)";ctx.fillRect(0,0,720,480);}if(t<crashFx.bannerUntil){const scale=1+Math.max(0,(crashFx.bannerUntil-t)/1000)*.22;ctx.save();ctx.translate(360,235);ctx.scale(scale,scale);ctx.textAlign="center";ctx.font="bold 30px 'Press Start 2P',monospace";ctx.lineWidth=8;ctx.strokeStyle="#080312";ctx.strokeText(crashFx.banner,0,0);ctx.fillStyle=crashFx.police?(Math.floor(t/90)%2?"#ff214f":"#3185ff"):"#ffe84c";ctx.fillText(crashFx.banner,0,0);ctx.restore();}const sx=x=>x/world.w*mapCanvas.width,sy=y=>y/world.h*mapCanvas.height;if(activeJob){const wp=activeJob.waypoints[activeJob.index];mctx.fillStyle="#ffe84c";mctx.beginPath();mctx.arc(sx(wp.x),sy(wp.y),5,0,Math.PI*2);mctx.fill();}police.forEach(p=>{mctx.fillStyle="#ff214f";mctx.fillRect(sx(p.x)-2,sy(p.y)-2,4,4);});drones.forEach(d=>{mctx.fillStyle="#ff3eb5";mctx.fillRect(sx(d.x)-2,sy(d.y)-2,4,4);});};
    const loop=now=>{if(ended)return;const frameDt=Math.min(2,(now-last)/16.67),dt=frameDt*(now<crashSlowUntil?.26:1);last=now;outlawUpdate(dt);draw();drawOutlawLayer();raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);
    setActiveCleanup(()=>{ended=true;cancelAnimationFrame(raf);if(currentCar){const rec=carRecord(currentCar.type);rec.condition=(currentCar.condition.engine+currentCar.condition.tires+currentCar.condition.body)/3;}saveData();window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);});
  };
  garage();
}

function newDeck(){
  const suits=["♠","♥","♦","♣"],ranks=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
  return shuffle(suits.flatMap(suit=>ranks.map((rank,i)=>({suit,rank,value:rank==="A"?1:Math.min(i+2,10)}))));
}
function handValue(hand){let value=hand.reduce((n,c)=>n+c.value,0),aces=hand.filter(c=>c.rank==="A").length;while(aces--&&value+10<=21)value+=10;return value;}
function cardsHtml(cards,hidden=false,clickable=false,held=[]){return cards.map((c,i)=>hidden&&i===1?`<div class="playing-card dealer-hidden">?</div>`:`<button class="playing-card ${"♥♦".includes(c.suit)?"red":""} ${held.includes(i)?"held":""}" ${clickable?`data-card="${i}"`:"disabled"}><small>${c.rank}${c.suit}</small><b>${c.suit}</b></button>`).join("");}

/* Starfarer procedural planet renderer. Visual randomness is isolated from
   gameplay randomness: every decision comes from the saved seed and stats. */
const STARFARER_PLANET_TEXTURE_CACHE=new Map();
const STARFARER_PLANET_CACHE_LIMIT=72;
const SF_PLANET_ARCHETYPES={
  rocky:["rock","moon","carbon","grave"],ice:["ice"],desert:["desert"],ocean:["ocean"],
  gas:["gas","storm"],crystalline:["crystal"],volcanic:["lava"],artificial:["machine"],
  anomaly:["glitch","phantom"],forest:["living","jungle","paradise"],toxic:["hive"]
};
const SF_PLANET_SUBTYPES={
  rocky:["Cratered highlands","Basalt badlands","Iron canyon world","Ashen moon"],
  ice:["Glacial shell","Cryovolcanic world","Frozen ocean","Aurora icefield"],
  desert:["Dune sea","Salt desert","Canyon world","Dust basin"],
  ocean:["Archipelago world","Deep ocean","Storm ocean","Shallow reef world"],
  gas:["Banded giant","Tempest giant","Helium giant","Cyclone world"],
  crystalline:["Prism crust","Quartz world","Shard sphere","Crystal geode"],
  volcanic:["Magma ocean","Rift world","Ash volcano world","Lava archipelago"],
  artificial:["Ecumenopolis","Machine shell","Orbital foundry","Ancient megastructure"],
  anomaly:["Glitch sphere","Void scar","Phase world","Impossible geometry"],
  forest:["Emerald continents","Jungle world","Living world","Bioluminescent biosphere"],
  toxic:["Acid marsh","Spore world","Toxic ocean","Corrosive hive"]
};
const sfClamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,Number(n)||0));
const sfHash=value=>{let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
const sfSeededRandom=seed=>{let a=(Number(seed)>>>0)||0x9e3779b9;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};};
const sfStablePlanetSeed=p=>sfHash([p?.id,p?.name,p?.systemId,p?.sector,p?.type].filter(Boolean).join("|"));
const sfPlanetArchetype=p=>p?.visualType||Object.entries(SF_PLANET_ARCHETYPES).find(([,ids])=>ids.includes(p?.type))?.[0]||"rocky";
const sfStatDefaults={
  rocky:[48,8,24,20,55,26,3,4],ice:[8,58,38,28,34,22,2,4],desert:[72,7,34,58,25,30,2,3],
  ocean:[55,88,74,50,36,18,58,70],gas:[52,0,96,78,22,45,0,0],crystalline:[38,4,22,26,63,48,1,2],
  volcanic:[94,3,76,70,94,52,0,1],artificial:[50,1,28,18,8,45,2,22],
  anomaly:[46,18,44,68,56,96,8,18],forest:[58,62,72,42,38,16,88,86],toxic:[66,45,86,65,52,58,42,55]
};
function sfPlanetEnvironment(p){
  const archetype=sfPlanetArchetype(p),base=sfStatDefaults[archetype]||sfStatDefaults.rocky,rng=sfSeededRandom((Number(p?.seed)||sfStablePlanetSeed(p))^0x51f15e),existing=p?.environment||{};
  const legacyTemp=Number(p?.temp),computedTemp=Number.isFinite(legacyTemp)?sfClamp((legacyTemp+220)/8):null;
  const names=["temperature","water","atmosphere","storminess","tectonic","radiation","vegetation","life"],topNames=["temperature","water","atmosphereDensity","storminess","tectonic","radiation","vegetation","lifeScore"],out={};
  names.forEach((name,i)=>{const saved=Number(existing[name]),top=Number(p?.[topNames[i]]),value=Number.isFinite(saved)?saved:Number.isFinite(top)?top:(i===0&&computedTemp!==null?computedTemp:base[i]+(rng()-.5)*24);out[name]=Math.round(sfClamp(value));});
  return out;
}
function sfMigratePlanetVisuals(p){
  if(!p)return false;let changed=false;
  if(!Number.isFinite(Number(p.seed))){p.seed=sfStablePlanetSeed(p);changed=true;}else p.seed=Number(p.seed)>>>0;
  const visualType=sfPlanetArchetype(p);if(p.visualType!==visualType){p.visualType=visualType;changed=true;}
  const env=sfPlanetEnvironment(p);if(!p.environment||Object.keys(env).some(k=>Number(p.environment[k])!==env[k])){p.environment=env;changed=true;}
  const aliases={temperature:env.temperature,water:env.water,atmosphereDensity:env.atmosphere,storminess:env.storminess,tectonic:env.tectonic,radiation:env.radiation,vegetation:env.vegetation,lifeScore:env.life};
  Object.entries(aliases).forEach(([k,v])=>{if(Number(p[k])!==v){p[k]=v;changed=true;}});
  const subtypeList=SF_PLANET_SUBTYPES[visualType]||SF_PLANET_SUBTYPES.rocky,subtype=subtypeList[sfHash(`${p.seed}|${visualType}|subtype`)%subtypeList.length];
  if(!p.subtype){p.subtype=subtype;changed=true;}return changed;
}
const sfHexToRgb=hex=>{const raw=String(hex||"#7b8ba5").replace("#",""),value=parseInt(raw.length===3?raw.split("").map(x=>x+x).join(""):raw,16)||0x7b8ba5;return[(value>>16)&255,(value>>8)&255,value&255];};
const sfRgb=(rgb,a=1)=>`rgba(${rgb.map(Math.round).join(",")},${a})`;
const sfMix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const sfShade=(rgb,t)=>sfMix(rgb,t<0?[0,0,0]:[255,255,255],Math.abs(t));
function sfPlanetPalette(p){
  const defaults={rocky:["#7d6652","#b99670","#352f35"],ice:["#7bd7ef","#e8fbff","#496fa8"],desert:["#c67a35","#f2c56f","#6e392d"],ocean:["#1261a0","#2dbbc8","#77d69b"],gas:["#8e65bb","#e8a56c","#4f3d7b"],crystalline:["#54cfe8","#c25cff","#302963"],volcanic:["#3a2630","#ff4a24","#ffbd32"],artificial:["#263445","#78e6ff","#df4bc7"],anomaly:["#14102d","#a24cff","#24e8de"],forest:["#174e45","#48a94f","#2e75a8"],toxic:["#45561e","#a9d83e","#a457d2"]}[sfPlanetArchetype(p)]||["#7d6652","#b99670","#352f35"],supplied=Array.isArray(p?.colors)?p.colors:[];
  return[sfHexToRgb(supplied[0]||defaults[0]),sfHexToRgb(supplied[1]||defaults[1]),sfHexToRgb(defaults[2])];
}
const sfEllipse=(ctx,x,y,rx,ry,rot=0)=>{ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rot,0,Math.PI*2);};
function sfPlanetSurface(ctx,p,cx,cy,r,rng,palette,env){
  const archetype=sfPlanetArchetype(p),[base,accent,detail]=palette;ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();
  const fill=ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);fill.addColorStop(0,sfRgb(sfShade(base,.22)));fill.addColorStop(.52,sfRgb(base));fill.addColorStop(1,sfRgb(sfShade(base,-.38)));ctx.fillStyle=fill;ctx.fillRect(cx-r,cy-r,r*2,r*2);
  const blobs=(count,color,min,max,alpha=.7)=>{ctx.fillStyle=sfRgb(color,alpha);for(let i=0;i<count;i++){const x=cx+(rng()*2-1)*r,y=cy+(rng()*2-1)*r,rr=r*(min+rng()*(max-min));sfEllipse(ctx,x,y,rr,rr*(.35+rng()*.65),rng()*Math.PI);ctx.fill();}};
  // Three deterministic scales: continents, regions, and small detail.
  if(["rocky","ice","desert","forest","ocean","toxic","volcanic"].includes(archetype)){const land=archetype==="ocean"?(100-env.water)/100:archetype==="forest"?.72:.58;blobs(7+Math.round(land*8),sfMix(base,accent,.52),.12,.32,.74);blobs(24,sfMix(accent,detail,.42),.025,.09,.48);blobs(58,sfShade(detail,.12),.006,.026,.24);}
  if(archetype==="rocky"){
    ctx.strokeStyle=sfRgb(sfShade(detail,.25),.48);ctx.lineWidth=1;for(let i=0;i<8+env.tectonic/10;i++){const x=cx+(rng()*2-1)*r*.78,y=cy+(rng()*2-1)*r*.78,rr=r*(.025+rng()*.1);sfEllipse(ctx,x,y,rr,rr*.55,rng()*Math.PI);ctx.stroke();}
  }else if(archetype==="ice"){
    ctx.strokeStyle=sfRgb(accent,.72);ctx.lineWidth=1.4;for(let i=0;i<9+env.tectonic/9;i++){let x=cx+(rng()*2-1)*r,y=cy+(rng()*2-1)*r;ctx.beginPath();ctx.moveTo(x,y);for(let j=0;j<4;j++){x+=(rng()-.5)*r*.22;y+=(rng()-.5)*r*.18;ctx.lineTo(x,y);}ctx.stroke();}if(env.atmosphere>50){ctx.strokeStyle="rgba(95,255,210,.25)";ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx,cy-r*.2,r*.72,3.6,5.7);ctx.stroke();}
  }else if(archetype==="desert"){
    ctx.strokeStyle=sfRgb(sfShade(accent,.22),.42);ctx.lineWidth=1;for(let y=cy-r;y<cy+r;y+=r*.09){ctx.beginPath();ctx.moveTo(cx-r,y);for(let x=cx-r;x<=cx+r;x+=r*.12)ctx.lineTo(x,y+Math.sin(x*.08+y*.03)*r*.035);ctx.stroke();}if(env.water>18)blobs(2,sfHexToRgb("#5a90a7"),.08,.17,.72);
  }else if(archetype==="ocean"){
    ctx.globalCompositeOperation="screen";blobs(Math.max(3,Math.round((100-env.water)/7)),accent,.08,.24,.78);ctx.globalCompositeOperation="source-over";ctx.strokeStyle="rgba(230,250,255,.36)";ctx.lineWidth=2;for(let i=0;i<4+env.storminess/18;i++){const x=cx+(rng()*2-1)*r*.7,y=cy+(rng()*2-1)*r*.7;ctx.beginPath();ctx.arc(x,y,r*(.05+rng()*.1),0,Math.PI*1.65);ctx.stroke();}
  }else if(archetype==="forest"){
    blobs(10+env.vegetation/5,sfHexToRgb("#2ecb61"),.015,.075,.46);if(env.water>25)blobs(5,sfHexToRgb("#2379ad"),.06,.18,.8);if(env.life>65){ctx.fillStyle="rgba(255,236,122,.72)";for(let i=0;i<18;i++)ctx.fillRect(cx+(rng()*2-1)*r*.72,cy+(rng()*2-1)*r*.72,1.3,1.3);}
  }else if(archetype==="volcanic"){
    ctx.strokeStyle=sfRgb(accent,.9);ctx.shadowColor=sfRgb(accent);ctx.shadowBlur=8;ctx.lineWidth=1.5+env.tectonic/35;for(let i=0;i<5+env.tectonic/8;i++){let x=cx+(rng()*2-1)*r*.8,y=cy+(rng()*2-1)*r*.8;ctx.beginPath();ctx.moveTo(x,y);for(let j=0;j<4;j++){x+=(rng()-.5)*r*.25;y+=(rng()-.5)*r*.2;ctx.lineTo(x,y);}ctx.stroke();}ctx.shadowBlur=0;
  }else if(archetype==="toxic"){
    blobs(7+env.water/12,sfHexToRgb("#b8e342"),.04,.16,.5);ctx.fillStyle="rgba(196,105,255,.22)";for(let i=0;i<20;i++){sfEllipse(ctx,cx+(rng()*2-1)*r,cy+(rng()*2-1)*r,r*.08,r*.025,rng()*Math.PI);ctx.fill();}
  }else if(archetype==="gas"){
    for(let i=0;i<18;i++){const y=cy-r+i*r*.115,h=r*(.08+rng()*.06);ctx.fillStyle=sfRgb(i%3===0?accent:i%3===1?sfMix(base,detail,.35):base,.45+rng()*.35);ctx.fillRect(cx-r,y,r*2,h);}ctx.fillStyle=sfRgb(detail,.65);for(let i=0;i<1+Math.round(env.storminess/35);i++){sfEllipse(ctx,cx+(rng()-.5)*r,cy+(rng()-.5)*r,r*(.13+rng()*.12),r*(.04+rng()*.05),-.1);ctx.fill();}
  }else if(archetype==="crystalline"){
    for(let i=0;i<34;i++){const x=cx+(rng()*2-1)*r,y=cy+(rng()*2-1)*r,rr=r*(.04+rng()*.12);ctx.fillStyle=sfRgb(i%2?accent:sfShade(base,.35),.42+rng()*.45);ctx.beginPath();for(let j=0;j<6;j++){const a=j*Math.PI/3;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(255,255,255,.22)";ctx.stroke();}
  }else if(archetype==="artificial"){
    ctx.strokeStyle=sfRgb(accent,.5);ctx.lineWidth=1;for(let y=cy-r;y<cy+r;y+=r*.14){ctx.beginPath();ctx.moveTo(cx-r,y);ctx.lineTo(cx+r,y);ctx.stroke();}for(let x=cx-r;x<cx+r;x+=r*.18){ctx.beginPath();ctx.moveTo(x,cy-r);ctx.lineTo(x,cy+r);ctx.stroke();}ctx.fillStyle=sfRgb(detail,.85);for(let i=0;i<25+env.life/3;i++)ctx.fillRect(cx+(rng()*2-1)*r*.8,cy+(rng()*2-1)*r*.8,2+rng()*4,1);
  }else if(archetype==="anomaly"){
    ctx.globalCompositeOperation="screen";for(let i=0;i<35+env.radiation/3;i++){ctx.fillStyle=i%2?sfRgb(accent,.38):sfRgb(detail,.45);ctx.fillRect(cx+(rng()*2-1)*r,cy+(rng()*2-1)*r,r*(.03+rng()*.22),1+rng()*5);}ctx.globalCompositeOperation="source-over";ctx.fillStyle="rgba(0,0,10,.82)";for(let i=0;i<4;i++){sfEllipse(ctx,cx+(rng()*2-1)*r*.65,cy+(rng()*2-1)*r*.65,r*(.06+rng()*.14),r*(.03+rng()*.1),rng()*Math.PI);ctx.fill();}
  }
  if(env.storminess>42&&archetype!=="gas"){ctx.strokeStyle=`rgba(245,251,255,${.08+env.storminess/500})`;ctx.lineWidth=r*.035;for(let i=0;i<2+env.storminess/22;i++){ctx.beginPath();ctx.arc(cx+(rng()-.5)*r,cy+(rng()-.5)*r,r*(.25+rng()*.42),rng()*3,rng()*3+1.8);ctx.stroke();}}
  ctx.restore();
}
function sfDrawPlanetTexture(canvas,p){
  const ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height,cx=w/2,cy=h/2,r=Math.min(w,h)*.285,env=sfPlanetEnvironment(p),palette=sfPlanetPalette(p),rng=sfSeededRandom((Number(p.seed)||sfStablePlanetSeed(p))^0xa19c);ctx.clearRect(0,0,w,h);
  const stars=sfSeededRandom((Number(p.seed)||1)^0x77bb);for(let i=0;i<34;i++){ctx.fillStyle=`rgba(210,235,255,${.18+stars()*.55})`;const size=stars()>.82?2:1;ctx.fillRect(stars()*w,stars()*h,size,size);}
  if(p.rings){ctx.save();ctx.translate(cx,cy);ctx.rotate(-.2);ctx.strokeStyle=sfRgb(sfShade(palette[1],.22),.38);ctx.lineWidth=r*.16;sfEllipse(ctx,0,0,r*1.45,r*.38);ctx.stroke();ctx.strokeStyle=sfRgb(palette[2],.5);ctx.lineWidth=2;sfEllipse(ctx,0,0,r*1.62,r*.43);ctx.stroke();ctx.restore();}
  sfPlanetSurface(ctx,p,cx,cy,r,rng,palette,env);
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();const shade=ctx.createLinearGradient(cx-r*.85,cy-r*.8,cx+r,cy+r*.55);shade.addColorStop(0,"rgba(255,255,255,.22)");shade.addColorStop(.42,"rgba(255,255,255,0)");shade.addColorStop(1,"rgba(0,0,12,.72)");ctx.fillStyle=shade;ctx.fillRect(cx-r,cy-r,r*2,r*2);const glint=ctx.createRadialGradient(cx-r*.36,cy-r*.42,1,cx-r*.36,cy-r*.42,r*.55);glint.addColorStop(0,"rgba(255,255,255,.28)");glint.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=glint;ctx.fillRect(cx-r,cy-r,r*2,r*2);ctx.restore();
  ctx.strokeStyle=sfRgb(palette[1],.22+env.atmosphere/180);ctx.lineWidth=2+env.atmosphere/28;ctx.shadowColor=sfRgb(palette[1]);ctx.shadowBlur=8+env.atmosphere/7;ctx.beginPath();ctx.arc(cx,cy,r+1,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
  if(p.rings){ctx.save();ctx.translate(cx,cy);ctx.rotate(-.2);ctx.beginPath();ctx.rect(-w,-2,w*2,h);ctx.clip();ctx.strokeStyle=sfRgb(sfShade(palette[1],.3),.62);ctx.lineWidth=r*.13;sfEllipse(ctx,0,0,r*1.45,r*.38);ctx.stroke();ctx.restore();}
  const moonCount=Math.min(4,Math.max(0,Number(p.moons)||0));for(let i=0;i<moonCount;i++){const a=.55+i*1.7+rng()*.35,dist=r*(1.45+(i%2)*.42),mr=r*(.045+rng()*.055),x=cx+Math.cos(a)*dist,y=cy+Math.sin(a)*dist*.72;ctx.fillStyle=sfRgb(sfShade(palette[0],.18));ctx.beginPath();ctx.arc(x,y,mr,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.25)";ctx.stroke();}
}
function renderStarfarerPlanet(canvas,p){
  if(!canvas||!p)return;sfMigratePlanetVisuals(p);const env=sfPlanetEnvironment(p),key=[p.seed,p.visualType,p.subtype,p.rings?1:0,p.moons||0,...Object.values(env),canvas.width,canvas.height].join("|");let texture=STARFARER_PLANET_TEXTURE_CACHE.get(key);
  if(!texture){texture=document.createElement("canvas");texture.width=canvas.width;texture.height=canvas.height;sfDrawPlanetTexture(texture,p);STARFARER_PLANET_TEXTURE_CACHE.set(key,texture);if(STARFARER_PLANET_TEXTURE_CACHE.size>STARFARER_PLANET_CACHE_LIMIT)STARFARER_PLANET_TEXTURE_CACHE.delete(STARFARER_PLANET_TEXTURE_CACHE.keys().next().value);}
  const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(texture,0,0);
  const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let checksum=2166136261;
  for(let i=0;i<pixels.length;i+=388)checksum=Math.imul(checksum^pixels[i]^pixels[i+1]<<8^pixels[i+2]<<16^pixels[i+3]<<24,16777619);
  canvas.dataset.rendered=`${p.seed}:${checksum>>>0}`;
}

function startStarfarer(launchOptions={}){
  const sectors=[
    {id:"inner",name:"BELSŐ PÁLYA",icon:"🛰️",level:0,color:"#7df9ff",types:["rock","ice","desert","moon"],danger:8,desc:"Biztonságos pályák és közeli holdak."},
    {id:"belt",name:"NEON ÖV",icon:"🌌",level:1,color:"#ff4fc8",types:["ocean","gas","crystal","jungle","storm"],danger:22,desc:"Színes gázóriások és kristályvilágok."},
    {id:"dead",name:"HALOTT ZÓNA",icon:"☠️",level:2,color:"#b5c0d0",types:["rock","machine","ice","grave","hive"],danger:38,desc:"Roncsok, romok és néma gépbolygók."},
    {id:"crimson",name:"KARMAZIN-KÖD",icon:"🔥",level:3,color:"#ff5b45",types:["lava","gas","desert","storm","carbon"],danger:55,desc:"Viharos, forró és értékes rendszerek."},
    {id:"void",name:"VOID PEREM",icon:"🕳️",level:4,color:"#a66cff",types:["glitch","crystal","machine","hive","phantom"],danger:72,desc:"A valóság hibás szélén ritka jelek várnak."},
    {id:"core",name:"ŐSI MAG",icon:"✦",level:5,color:"#ffe66d",types:["living","glitch","machine","paradise","phantom"],danger:88,desc:"Legendás világok a galaxis szívében."}
  ];
  const types={
    rock:{name:"Sziklavilág",colors:["#8c735d","#d1a36f"],atmos:["Nincs","Vékony por"],resources:["Vas","Titán","Szilikát"]},
    ice:{name:"Jégbolygó",colors:["#9ee8ff","#e9fbff"],atmos:["Fagyott metán","Kristálypára"],resources:["Jégmag","Neon-gáz","Kobalt"]},
    desert:{name:"Sivatagbolygó",colors:["#ffb45d","#d85b45"],atmos:["Porvihar","Száraz nitrogén"],resources:["Aranyhomok","Urán","Üvegkő"]},
    ocean:{name:"Óceánvilág",colors:["#157cc5","#56f2d2"],atmos:["Oxigéndús","Sós felhők"],resources:["Biogél","Gyöngykorall","Hidrogén"]},
    gas:{name:"Gázóriás",colors:["#dc7cff","#ffc36d"],atmos:["Elektromos vihar","Héliumköd"],resources:["Hélium-3","Plazma","Viharkristály"]},
    crystal:{name:"Kristálybolygó",colors:["#54f6ff","#d75cff"],atmos:["Neon köd","Prizmatikus gáz"],resources:["Fénykristály","Kvantzüveg","Zafír"]},
    lava:{name:"Lávavilág",colors:["#ff3b20","#ffb000"],atmos:["Kénes hamu","Plazmafátyol"],resources:["Magmaérc","Obszidián","Tűzmag"]},
    machine:{name:"Gépvilág",colors:["#6d7f91","#55ff9a"],atmos:["Nanofelhő","Mesterséges"],resources:["Ősi áramkör","Nanofém","Adatmag"]},
    glitch:{name:"Glitch-világ",colors:["#070511","#ff2bd6"],atmos:["Hibás szimuláció","Null-köd"],resources:["Hibakód","Void-pixel","Entrópia"]},
    living:{name:"Élő bolygó",colors:["#45dc68","#ff72c7"],atmos:["Spórafelhő","Lélegző ég"],resources:["Csillagmag","Ősi DNS","Álompor"]},
    moon:{name:"Kráterhold",colors:["#66717d","#c4ccd2"],atmos:["Nincs","Elektrosztatikus por"],resources:["Regolit","Irídium","Holdjég"]},
    jungle:{name:"Dzsungelvilág",colors:["#1e8f52","#d6ef58"],atmos:["Párás oxigén","Biolumineszcens köd"],resources:["Gyógyspóra","Borostyán","Xenofa"]},
    storm:{name:"Viharbolygó",colors:["#3154a4","#f0e45d"],atmos:["Ionvihar","Sűrű ammónia"],resources:["Villámüveg","Felhőérc","Fluxusmag"]},
    grave:{name:"Temetővilág",colors:["#363c4a","#9b4967"],atmos:["Radioaktív hamu","Halott levegő"],resources:["Roncsötvözet","Fekete doboz","Emlékkristály"]},
    hive:{name:"Kaptárbolygó",colors:["#7e3e69","#f09c38"],atmos:["Feromonköd","Savas spórák"],resources:["Királynőzselé","Kitinpáncél","Organikus reaktor"]},
    carbon:{name:"Gyémántvilág",colors:["#26394d","#9ef7ff"],atmos:["Szénvihar","Nagynyomású neon"],resources:["Fekete gyémánt","Karbonhab","Nyomáskristály"]},
    phantom:{name:"Fantomvilág",colors:["#24204d","#83ffd9"],atmos:["Fázisköd","Időtorzulás"],resources:["Fázispor","Időkristály","Árnyékanyag"]},
    paradise:{name:"Paradicsomvilág",colors:["#24a8bb","#8eea76"],atmos:["Tiszta oxigén","Arany alkony"],resources:["Életmag","Csillaggyümölcs","Harmóniakristály"]}
  };
  const typeLore={
    rock:{codex:"Kopár, ásványokban gazdag világok, amelyek megőrzik csillagrendszerük legkorábbi ütközéseinek nyomait. Biztonságos célpontok, de a mélyrétegek gyakran instabilak.",scan:"A kéreg több egymásra torlódott becsapódási lemezből áll; némelyik idősebbnek tűnik a bolygó csillagánál.",science:"A fémizotópok eloszlása legalább két különböző csillagrendszerből származó anyagot jelez."},
    moon:{codex:"Légkör nélküli vagy ritka porburokkal fedett kis világok. Krátereik, jégzárványaik és eltemetett üregeik olcsó előőrsöknek adhatnak helyet.",scan:"A legmélyebb kráterek alatt összefüggő lávaalagutak húzódnak, természetes sugárvédelmet kínálva.",science:"A felszíni por elektromos töltése szabályos ciklust követ, amelyet nem magyaráz a napszél."},
    ice:{codex:"Fagyott óceánokat és illékony gázokat rejtő hideg bolygók. Jégpáncéljuk alatt gyakran meleg víz, kémiai energia vagy ősi minták maradnak fenn.",scan:"A jégkéreg alatt sós óceán mozog; az árapályhő több helyen vékonyra olvasztotta a felszínt.",science:"A mélyjég buborékjai egy korábbi, melegebb korszak légkörét őrzik."},
    desert:{codex:"Száraz, nagy hőingású világok, ahol a szelek egész kontinenseket rendeznek át. Felszínük könnyen bejárható, vízkészletük azonban stratégiai kincs.",scan:"A homoktengerek alatt kiszáradt folyóhálózat és szabályos kőalapok rajzolódnak ki.",science:"A szemcsék üveges kérge egyetlen, bolygóméretű hőesemény emlékét hordozza."},
    ocean:{codex:"Globális tengerekkel borított bolygók, kevés szárazfölddel és összetett időjárással. A legígéretesebb helyek idegen bioszférák és kutatókolóniák számára.",scan:"A felszíni viharok alatt több, eltérő hőmérsékletű óceáni réteg kering, egymástól szinte teljesen elszigetelve.",science:"A víz szerves molekulái önszerveződő hálózatot alkotnak, amely lassan reagál a környezeti változásokra."},
    jungle:{codex:"Párás, sűrű növényzettel borított bioszféra-világok. Termékenyek, de minden leszállás biológiai kockázatot és ismeretlen ökológiai kapcsolatokat hoz.",scan:"A lombkorona alatt a növényzet egyetlen föld alatti jelhálózaton osztozik, és órákkal előre reagál a viharokra.",science:"A fotoszintetikus pigmentek a látható fényen túl gravitációs ingadozásokra is érzékenyek."},
    gas:{codex:"Hatalmas légköri rétegekből álló világok szilárd felszín nélkül. Viharaik ritka gázokat és energiakristályokat hoznak fel a mélyből.",scan:"A felső felhőzet alatt több ezer kilométeres, stabil áramlási folyosók húzódnak, némelyikben lebegő szilárd testekkel.",science:"A rádiózajban ismétlődő mintázat az egész légkört egyetlen rezonáns rendszerként viselkedteti."},
    storm:{codex:"Állandó ionviharokkal borított bolygók. Rendkívül veszélyesek, ugyanakkor villámüvegük és fluxusmagjaik nagy értéket képviselnek.",scan:"A viharfrontok nem véletlenszerűek: szabályos útvonalakon kerülik meg a mágneses pólusokat.",science:"A villámkisülések energiája időnként meghaladja a teljes csillagfényből elérhető mennyiséget."},
    crystal:{codex:"Kristályos kéreggel és prizmatikus légkörrel rendelkező világok. Felszínük egyszerre geológiai archívum és természetes kommunikációs hálózat.",scan:"A kontinensek kristályrácsai ugyanazon az alapfrekvencián rezegnek, mintha a bolygó egyetlen hangszer volna.",science:"A növekedési irányok mesterséges vetésre vagy ismeretlen geológiai memóriára utalnak."},
    carbon:{codex:"Nagy nyomás alatt kialakult gyémánt- és karbonvilágok. Kérgük rendkívül értékes, de a felszín alatti feszültségek kiszámíthatatlanok.",scan:"A gyémántrétegek között vezetőképes karbonfolyosók futnak, amelyek bolygóméretű áramkört alkotnak.",science:"A kristályhibákban tárolt töltés csillagászati időskálán is megmaradhat."},
    lava:{codex:"Olvadt kőzettengerekkel és szélsőséges hőséggel borított fiatal vagy sérült világok. Kitermelésük veszélyes, hozamuk kiemelkedő.",scan:"A láva alatt szilárd, fémes gerincek tartják össze a kérget; alakjuk túlságosan szabályos a természetes kialakuláshoz.",science:"A hőáramlás azt mutatja, hogy a mag egyes részei időszakosan leállnak, majd újraindulnak."},
    machine:{codex:"Mesterséges kéreggel, automatizált infrastruktúrával vagy teljesen gépi eredettel rendelkező világok. Minden rendszerük működik, de céljuk ismeretlen.",scan:"A felszín alatti gyárak tovább dolgoznak, bár nyersanyagot nem vesznek fel és készterméket nem adnak ki.",science:"Az áramkörök logikája nem bináris; a gép döntései valószínűségi emlékekből épülnek fel."},
    grave:{codex:"Elpusztult civilizációk roncsmezőivel borított temetővilágok. Minden lelet történelmi érték, és minden működő jeladó lehetséges csapda.",scan:"A romvárosok ugyanabban a pillanatban ürültek ki, de sem háború, sem természeti katasztrófa nyoma nem látható.",science:"A fekete dobozok utolsó felvételein a csillagok elrendezése eltér a jelenlegi égbolttól."},
    hive:{codex:"Kollektív élőlények által formált organikus bolygók. Felszínük, légkörük és építményeik egyetlen biológiai rendszer részei.",scan:"A kaptárszerkezetek a bolygó kérgéig érnek, és a helyi szeizmikus aktivitást kommunikációra használják.",science:"Az egyedek genetikai állománya hiányos; csak a teljes kolónia együtt alkot működő genomot."},
    living:{codex:"Olyan világok, ahol maga a bolygó mutat életre utaló reakciókat. Légköri, geológiai és biológiai folyamataik összehangoltan válaszolnak.",scan:"A kontinensek lassan összehúzódnak és kitágulnak, miközben az óceánok kémiai összetétele idegi jelként változik.",science:"A bolygó válaszideje és tanulási mintázata alapján nem ökoszisztéma, hanem egyetlen élő szervezet lehet."},
    glitch:{codex:"A fizikai törvények hibásan vagy következetlenül működő térségei. Nem biztos, hogy valódi bolygók; lehetnek sérült szimulációk vagy időbeli maradványok.",scan:"Ugyanaz a felszíni pont három eltérő állapotban jelenik meg, attól függően, melyik műszer figyeli.",science:"Az adatok egy része a mérés előtt érkezik vissza, így az oksági sorrend nem állapítható meg."},
    phantom:{codex:"Részben fázison kívüli világok, amelyek időnként eltűnnek a hagyományos érzékelők elől. Anyaguk és történetük nem mindig ugyanahhoz a jelenhez tartozik.",scan:"A kéreg sűrűsége periodikusan nullára csökken, miközben a gravitáció változatlan marad.",science:"A minták több lehetséges múlt kémiai lenyomatát hordozzák egyszerre."},
    paradise:{codex:"Ritka, kiegyensúlyozott éghajlatú és gazdag bioszférájú világok. Ideális fővilágok lehetnek, de tökéletességük gyakran mesterséges eredetre utal.",scan:"A légkör, az óceánok és a talaj összetétele szokatlanul pontosan tartja az élet számára optimális értékeket.",science:"Az evolúciós ágak közös genetikai korrekciókat mutatnak, mintha valaki rendszeresen javította volna őket."}
  };
  const rarity=[
    {id:"common",name:"COMMON",color:"#b8c6d1",mult:1},
    {id:"uncommon",name:"UNCOMMON",color:"#68ef8e",mult:1.35},
    {id:"rare",name:"RARE",color:"#52b8ff",mult:2},
    {id:"epic",name:"EPIC",color:"#c46cff",mult:3.2},
    {id:"legendary",name:"LEGENDARY",color:"#ffd85a",mult:5.5},
    {id:"mythic",name:"MYTHIC",color:"#ff5e91",mult:9},
    {id:"glitched",name:"GLITCHED",color:"#ff35e8",mult:13},
    {id:"cosmic",name:"COSMIC",color:"#ffffff",mult:20}
  ];
  const prefixes=["Astra","Violet","Crimson","Echo","Nova","Zenith","Orion","Pixel","Helix","Lumen","Nyx","Solar","Vanta","Cinder","Azure","Null","Kepler","Titan","Arcadia","Elysium","Obsidian","Mirage","Quantum","Umbra","Aurora","Vector","Saffron","Cerulean","Karma","Rift","Morrow","Icarus","Nexus","Velvet","Radiant","Silent"];
  const suffixes=["Prime","Haven","Drift","Crown","Glass","Reach","Echo","Delta","Bloom","Forge","Abyss","Arc","-7"," IX"," Ω","-404","Minor","Major","Sanctum","Fall","Rise","Beacon","Veil","Spire","Garden","Vault","Halo","Ember","Tide","Dream","Node","Zero","End","Station","Wilds","Legacy"];
  const sizes=[["Törpe",.35],["Kicsi",.62],["Közepes",1],["Nagy",1.48],["Óriás",2.25],["Kolosszus",3.6]];
  const gravities=[["Mikrogravitáció",.12],["Alacsony",.48],["Földszerű",1],["Erős",1.7],["Extrém",3.4]];
  const events=[
    ["📡","Egy elhagyott felmérőműhold huszonhárom évnyi csend után válaszolt. Az adatbank utolsó bejegyzése még nem történt meg.",18,8],
    ["👽","Keskeny sávú rádiójel emelkedik ki a felszíni zajból. Nem üzenetnek tűnik, inkább valaki névsorát ismétli.",28,14],
    ["🏛️","A mélyradar szabályos, városméretű üregrendszert talált. A bejáratok mind a helyi nap felé néznek.",36,18],
    ["☄️","Lassú meteorzápor halad át a pályán. A kövek felszínén ugyanaz a geometrikus jel látható.",10,6],
    ["🧬","Az óceán mélyén egy összefüggő életjel mozog. Túl nagy egyetlen élőlénynek, túl rendezett egy áramlatnak.",32,20],
    ["📦","Sodródó rakománykonténer került elő birodalmi azonosítóval. A sorozatszám szerint csak jövőre gyártják le.",42,7],
    ["⚠️","Kalózjeladók villannak fel a radar peremén, majd egyszerre eltűnnek. Valaki felmérte a hajó válaszidejét.",14,10],
    ["✨","A visszatérő szonda burkolatán csillagpor kristályosodott ki. A minta halványan követi a közeli csillag térképét.",24,12],
    ["🛰️","Egy néma szonda ugyanazon a pályán kering, mint mi. A fedélzeti kamera élő képet sugároz a saját hajónkról.",22,11],
    ["🌑","A bolygó mögül előbukkanó hold egyetlen műszerben sem szerepelt. Mire újramérjük, ismét eltűnik.",26,13],
    ["🔬","A légköri minta mesterséges fehérjét tartalmaz. Valaki vagy valami évszázadok óta alakítja az időjárást.",30,16],
    ["⚡","Ionvihar söpör végig a felső légkörön. A villámok szabályos időközönként ugyanazt a mintát rajzolják.",18,12],
    ["🗿","A terminátorvonalon kilométeres árnyék mozog, de nincs tárgy, amely vethetné.",34,17],
    ["🎼","A gravitációs érzékelők három hangból álló ritmust rögzítenek. A bolygó magja válaszol a hajtóműre.",25,15],
    ["🧊","A jégpáncél alatt meleg, tökéletesen kör alakú tó rejtőzik. Közepén valami folyamatosan fényt bocsát ki.",29,15],
    ["🌿","Az éjszakai oldalon a növényzet egyszerre fordul a hajó felé. A mozgás hullámként fut végig a kontinensen.",31,18],
    ["🕳️","A csillagmező egy apró területen hiányzik. A folt lassan közelebb kerül, miközben a távolságmérő nullát mutat.",38,20],
    ["💎","A felszíni kristálymező visszaveri a szkennerimpulzust, majd egy eddig ismeretlen frekvencián megismétli.",27,14],
    ["🤖","Egy ősi automata aktiválódott a romok között. Nem támad; irányfényt gyújt egy lezárt föld alatti kapuhoz.",35,18],
    ["🌋","A lávafolyamok alatt fémes szerkezet rajzolódik ki. A vulkán talán nem természetes képződmény.",33,17],
    ["🫧","A gázóriás viharszemében stabil, oxigéndús buborék lebeg. Belsejében gyenge városi fények látszanak.",36,19],
    ["📜","Egy adatbója töredékes csillagtérképet sugároz. A térkép közepén a jelenlegi koordinátánk helyén figyelmeztetés áll.",24,13],
    ["🩸","A felszíni folyók színe egyetlen ciklus alatt vörösre változott. A kémiai összetétel azonban változatlan.",21,12],
    ["🔔","A hajó összes riasztója megszólal, de egyik rendszer sem jelez hibát. A hang kívülről érkezik.",28,16],
    ["🧿","A radar közepén fekete kör nyílik. Nem takarja a csillagokat — a csillagok kerülik ki.",40,22],
    ["🛰️","Egy katonai bója régi Gubuntu-parancsot ismétel: NE KÖVESSÉTEK A MÁSODIK NAPOT.",30,18],
    ["🫀","A felszín alól lassú pulzus érkezik. A periódusa pontosan megegyezik a hajó főreaktorának ritmusával.",37,21],
    ["📼","Adatkazetta sodródik a pályán. A címkéjén a kapitány neve áll, kézírással.",33,19],
    ["🛸","Egy ismeretlen hajó árnyéka átsiklik a bolygó előtt. A csillagfény nem takarja ki — inkább elhallgat.",44,24],
    ["🔭","A távcső ugyanarra a pontra mindig más égboltot mutat. MIRA-9 szerint ez nem hiba, hanem udvariatlanság.",26,15],
    ["🧲","A mágneses tér rövid időre betűket rajzol a plazmába: FORDULJ VISSZA, PILÓTA.",35,20],
    ["🪞","A szonda tükörsima krátert talál. A visszaverődésben egy sokkal nagyobb hajó áll mögöttünk.",39,22]
  ];
  const genericEventIds=[0,1,2,3,5,6,7,8,9,11,12,13,16,17,18,21,23,24,25,27,29,30,31];
  const themedEventIds={ocean:[4],living:[4,15,26],ice:[14],jungle:[15,26],paradise:[15,26],glitch:[16,23,24,27,31],phantom:[9,16,24,27,31],crystal:[17],machine:[18,25,27],grave:[2,18,21,27,31],lava:[19],gas:[20,29],storm:[11,20,30],hive:[1,4,13,26],carbon:[17,19,30]};
  const pickPlanetEvent=type=>pick([...genericEventIds,...(themedEventIds[type]||[])].map(i=>events[i]));
  const resourceDefs={
    metal:{icon:"▣",name:"Fém",color:"#aebdca",desc:"Kolóniák építéséhez, épületváltáshoz és fejlesztésekhez."},
    crystal:{icon:"◇",name:"Kristály",color:"#58e8ff",desc:"Fejlett kolóniaszintekhez és a fővilág kialakításához."},
    fuelCells:{icon:"⛽",name:"Üzemanyagcella",color:"#ffe15a",desc:"Finomítók terméke és későbbi expedíciós technológiák alapja."},
    bioSamples:{icon:"🧬",name:"Biominta",color:"#6cff87",desc:"Biológiai küldetésekhez és kutatólaborokhoz."},
    alienRelics:{icon:"🏛️",name:"Idegen relikvia",color:"#ff9c5a",desc:"Ősi technológiát és a Galaktikus Fővilágat oldja fel."},
    starDust:{icon:"✦",name:"Csillagpor",color:"#ff73d1",desc:"Ritka kutatások és Auto-Probe jutalmak alapanyaga."},
    darkMatter:{icon:"◈",name:"Sötét anyag",color:"#ac77ff",desc:"Void expedíciókból származó késői fejlesztési anyag."}
  };
  const lootTables={
    rock:["metal","metal","crystal"],moon:["metal","fuelCells","crystal"],ice:["fuelCells","fuelCells","crystal"],
    desert:["metal","crystal","starDust"],lava:["metal","metal","crystal"],ocean:["bioSamples","bioSamples","crystal"],
    jungle:["bioSamples","bioSamples","alienRelics"],gas:["fuelCells","fuelCells","starDust"],storm:["fuelCells","crystal","starDust"],
    crystal:["crystal","crystal","starDust"],machine:["metal","alienRelics","fuelCells"],grave:["alienRelics","metal","starDust"],
    hive:["bioSamples","alienRelics","darkMatter"],carbon:["crystal","metal","darkMatter"],glitch:["darkMatter","darkMatter","starDust"],
    living:["bioSamples","starDust","alienRelics"],phantom:["darkMatter","starDust","alienRelics"],paradise:["bioSamples","crystal","starDust"]
  };
  const buildingDefs={
    mine:{icon:"⛏️",name:"BÁNYÁSZATI ELŐŐRS",desc:"Fémet és kristályt termel.",produces:{metal:3,crystal:1}},
    lab:{icon:"🔬",name:"KUTATÓLABOR",desc:"Biomintát és csillagport elemez.",produces:{bioSamples:2,starDust:1}},
    refinery:{icon:"⛽",name:"ÜZEMANYAG-FINOMÍTÓ",desc:"Üzemanyagcellákat gyárt.",produces:{fuelCells:3}},
    defense:{icon:"⬡",name:"VÉDELMI HÁLÓ",desc:"Védi a kolóniát és fémet termel.",produces:{metal:1},defense:18},
    trade:{icon:"●",name:"KERESKEDELMI KIKÖTŐ",desc:"Minden szkenneléskor érmét termel.",produces:{coins:5}},
    biodome:{icon:"🌿",name:"BIODÓM",desc:"Stabil biominta-termelést biztosít.",produces:{bioSamples:3}},
    relic:{icon:"🏛️",name:"RELIKVIA-ÁSATÁS",desc:"Idegen relikviákat és csillagport talál.",produces:{alienRelics:1,starDust:1}},
    shipyard:{icon:"🚀",name:"HAJÓGYÁR",desc:"Fémet termel és növeli a birodalmi szintet.",produces:{metal:2},empire:1}
  };
  const factionDefs={
    survey:{icon:"📡",name:"IMPERIAL SURVEY AUTHORITY",short:"Felmérési Hatóság",color:"#59dfff",desc:"Hivatalos tudományos szervezet. Olcsóbb mélyszkennelést és kutatási megbízásokat kínál."},
    void:{icon:"🕳️",name:"VOID CARTOGRAPHERS",short:"Void Kartográfusok",color:"#b47cff",desc:"Misztikus térképészek, akik még nem létező világokat is nyilvántartanak."},
    relic:{icon:"🏛️",name:"RELIC GUILD",short:"Relikvia Céh",color:"#ffb65c",desc:"Ősi romok és előfutár-technológiák megszállott kutatói."},
    miners:{icon:"⛏️",name:"FREE MINERS UNION",short:"Szabad Bányászszövetség",color:"#d3dbe5",desc:"Ipari konzorcium, amely fémért, kristályért és kitermelési jogokért fizet."},
    pirates:{icon:"☀️",name:"BLACK SUN PIRATES",short:"Fekete Nap Kalózai",color:"#ff5964",desc:"Veszélyes fosztogatók, akik a fekete piacon ritka árukat is mozgatnak."},
    choir:{icon:"◉",name:"SILENT CHOIR",short:"Néma Kórus",color:"#72ffb0",desc:"Ismeretlen, jelszerű civilizáció. Üzeneteik nem mindig ugyanabban az időben érkeznek."}
  };
  const factionTrades={
    survey:{cost:{coins:30},gain:{starDust:3},label:"30 ● → 3 ✦"},
    void:{cost:{starDust:3},gain:{darkMatter:2},label:"3 ✦ → 2 ◈"},
    relic:{cost:{crystal:10,starDust:2},gain:{alienRelics:1},label:"10 ◇ + 2 ✦ → 1 🏛️"},
    miners:{cost:{coins:25},gain:{metal:12,crystal:3},label:"25 ● → 12 ▣ + 3 ◇"},
    pirates:{cost:{coins:45},gain:{alienRelics:1,darkMatter:1},label:"45 ● → 1 🏛️ + 1 ◈",rep:10},
    choir:{cost:{bioSamples:5},gain:{starDust:4},label:"5 🧬 → 4 ✦",rep:5}
  };
  const marketModules={
    quantumLens:{icon:"◉",name:"KVANTUMLENCSE",tag:"SCANNER TECH",desc:"Finomhangolja a ritkaságmintákat. Minden szkennelésnél nagyobb esélyt ad ritka világokra.",cost:{coins:180,crystal:12}},
    colonialCharter:{icon:"▤",name:"KOLÓNIA-CHARTA",tag:"IMPERIAL LICENSE",desc:"Az AI-jegyző hitelesít egy további telepítési engedélyt. +1 maximális kolónia.",cost:{coins:250,alienRelics:1}},
    stabilizerDrone:{icon:"✚",name:"STABILIZÁLÓ DRÓN",tag:"COLONY SUPPORT",desc:"Automata javítóraj. A stabilizálási akciók nyersanyagköltségét csökkenti.",cost:{metal:45,crystal:20}},
    signalDecoder:{icon:"⌁",name:"JELDEKÓDER",tag:"DIPLOMATIC TECH",desc:"Kiszűri a frakciós adások rejtett rétegeit. Együttműködéskor több reputációt ad.",cost:{darkMatter:5,starDust:8}},
    smugglerHold:{icon:"▣",name:"ÁRNYÉKRAKTÉR",tag:"BLACK MARKET",desc:"Álcázott expedíciós rekesz. Leszálláskor egy további zsákmánydobást biztosít.",cost:{coins:220,metal:30}},
    autoBroker:{icon:"◆",name:"AUTOMATA BRÓKER",tag:"PASSIVE INCOME",desc:"A MIRA-9 mikroügyleteket futtat a háttérben. Minden szkennelés +2 érmét termel.",cost:{coins:300,darkMatter:3}}
  };
  const marketOffers=[
    {id:"metal-crate",icon:"▣",name:"IPARI FÉMRAKOMÁNY",desc:"Bányászati többlet, ellenőrzött tisztasággal.",cost:{coins:32},gain:{metal:14}},
    {id:"crystal-lot",icon:"◇",name:"REZONÁNS KRISTÁLYOK",desc:"Kalibrált kristálycsomag kutatáshoz és építéshez.",cost:{coins:46},gain:{crystal:8}},
    {id:"fuel-pack",icon:"⛽",name:"ÜZEMANYAGCELLÁK",desc:"Hosszú expedícióra lezárt energiacellák.",cost:{coins:28},gain:{fuelCells:7}},
    {id:"bio-contract",icon:"🧬",name:"XENOBIOLÓGIAI SZERZŐDÉS",desc:"A Hatóság jó áron átveszi a hiteles biomintákat.",cost:{bioSamples:6},gain:{coins:55}},
    {id:"ore-export",icon:"↗",name:"ÉRCKIVITELI KVÓTA",desc:"A Szabad Bányászszövetség azonnal fizet.",cost:{metal:18,crystal:4},gain:{coins:72}},
    {id:"stardust-vial",icon:"✦",name:"CSILLAGPOR-AMPULLÁK",desc:"Laboratóriumi minőségű mélyszkennelési katalizátor.",cost:{coins:60},gain:{starDust:5}},
    {id:"void-cache",icon:"◈",name:"LEZÁRT VOID-LÁDA",desc:"Eredete törölt. Tartalma valószínűleg legális.",cost:{coins:95,starDust:3},gain:{darkMatter:3}},
    {id:"relic-bid",icon:"🏛",name:"RELIKVIÁRA KIÍRT LICIT",desc:"A Relikvia Céh prémiumot fizet egy sértetlen leletért.",cost:{alienRelics:1},gain:{coins:140,starDust:3}}
  ];
  const buildingUnlock={mine:0,lab:0,refinery:0,defense:0,biodome:0,shipyard:3,trade:2,relic:4};
  if(!currentPlayer.starfarer||typeof currentPlayer.starfarer!=="object")currentPlayer.starfarer={atlas:[],favorites:[],upgrades:{scanner:0,tank:0,engine:0,shield:0,cargo:0,probe:0,lab:0},inventory:{},colonies:[],missions:{claimed:[],produced:{},voidScans:0,totalRelics:0},codex:{fragments:[]},factions:{},transmissions:[],eventLog:[],galacticNews:[],market:{owned:[],history:[],purchases:0},living:{logs:[],morale:72,tension:18,trust:50,chatter:""},fuel:8,resources:0,totalScans:0,bestValue:0,sector:"inner"};
  const state=currentPlayer.starfarer;
  state.atlas=Array.isArray(state.atlas)?state.atlas.filter(p=>p&&typeof p==="object"):[];state.favorites=Array.isArray(state.favorites)?state.favorites.filter(id=>typeof id==="string"):[];state.upgrades=state.upgrades&&typeof state.upgrades==="object"&&!Array.isArray(state.upgrades)?state.upgrades:{};state.inventory=state.inventory&&typeof state.inventory==="object"&&!Array.isArray(state.inventory)?state.inventory:{};state.colonies=Array.isArray(state.colonies)?state.colonies.filter(c=>c&&typeof c==="object"&&c.planet&&typeof c.planet==="object"):[];
  Object.keys(resourceDefs).forEach(k=>state.inventory[k]=Math.max(0,Number(state.inventory[k])||0));
  state.missions=state.missions&&typeof state.missions==="object"?state.missions:{claimed:[],produced:{},voidScans:0,totalRelics:0};state.missions.claimed=Array.isArray(state.missions.claimed)?state.missions.claimed:[];state.missions.produced=state.missions.produced&&typeof state.missions.produced==="object"?state.missions.produced:{};state.codex=state.codex&&typeof state.codex==="object"?state.codex:{fragments:[]};state.codex.fragments=Array.isArray(state.codex.fragments)?state.codex.fragments:[];state.factions=state.factions&&typeof state.factions==="object"?state.factions:{};Object.keys(factionDefs).forEach(id=>state.factions[id]=Math.max(-100,Math.min(100,Number(state.factions[id])||0)));state.transmissions=Array.isArray(state.transmissions)?state.transmissions:[];state.eventLog=Array.isArray(state.eventLog)?state.eventLog:[];state.galacticNews=Array.isArray(state.galacticNews)?state.galacticNews:[];
  state.market=state.market&&typeof state.market==="object"?state.market:{owned:[],history:[],purchases:0};state.market.owned=Array.isArray(state.market.owned)?state.market.owned:[];state.market.history=Array.isArray(state.market.history)?state.market.history:[];state.market.purchases=Math.max(0,Number(state.market.purchases)||0);
  state.living=state.living&&typeof state.living==="object"?state.living:{logs:[],morale:72,tension:18,trust:50,chatter:""};state.living.logs=Array.isArray(state.living.logs)?state.living.logs:[];["morale","tension","trust"].forEach(k=>{const value=Number(state.living[k]);state.living[k]=Math.max(0,Math.min(100,Number.isFinite(value)?value:({morale:72,tension:18,trust:50}[k])));});state.living.chatter=String(state.living.chatter||"");state.consequence=state.consequence&&typeof state.consequence==="object"?state.consequence:{voidScans:0,rareScans:0,catastrophes:0,patterns:[]};state.consequence.patterns=Array.isArray(state.consequence.patterns)?state.consequence.patterns:[];state.research=state.research&&typeof state.research==="object"?state.research:{points:0,unlocked:[]};state.research.unlocked=Array.isArray(state.research.unlocked)?state.research.unlocked:[];state.research.points=Math.max(0,Number(state.research.points)||0);state.bridgeChoices=Array.isArray(state.bridgeChoices)?state.bridgeChoices:[];state.miraState=state.miraState||"Helpful";
  state.colonies.forEach(c=>{c.level=Math.max(1,Math.min(5,Number(c.level)||1));c.stability=Math.max(0,Math.min(100,Number(c.stability) || 100));c.population=Math.max(50,Number(c.population)||120*c.level*c.level);c.skipProduction=Math.max(0,Number(c.skipProduction)||0);c.culture=c.culture||"mining";});
  ["scanner","tank","engine","shield","cargo","probe","lab"].forEach(k=>state.upgrades[k]=Math.max(0,Number(state.upgrades[k])||0));
  state.fuel=Math.max(0,Number(state.fuel)||0);state.resources=Math.max(0,Number(state.resources)||0);
  const refreshLoreText=state.codex.loreVersion!==2;
  let current=null,atlasFocus=null,view="bridge",scanning=false,scanPhase="idle",scanTimers=[];
  const maxFuel=()=>8+state.upgrades.tank*3;
  const maxSector=()=>Math.min(5,state.upgrades.engine);
  const sector=()=>sectors.find(s=>s.id===state.sector)||sectors[0];
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const hash=s=>[...s].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,2166136261);
  const rollRarity=s=>{
    const luck=state.upgrades.scanner*2.7+s.level*3.5+(state.factions.survey>=10?3:0)+(state.market.owned.includes("quantumLens")?4:0),r=Math.random()*100;
    const cuts=[54-luck*.55,78-luck*.28,91-luck*.12,97-luck*.04,99.15,99.72,99.94];
    return rarity[r<cuts[0]?0:r<cuts[1]?1:r<cuts[2]?2:r<cuts[3]?3:r<cuts[4]?4:r<cuts[5]?5:r<cuts[6]?6:7];
  };
  const factionForPlanet=p=>{
    if(["glitch","phantom"].includes(p.type)||p.sector==="void")return Math.random()<.68?"void":"choir";
    if(["machine","grave"].includes(p.type)||p.resources.some(x=>/Ősi|Adat|Emlék/i.test(x)))return "relic";
    if(["rock","crystal","lava","carbon","moon"].includes(p.type))return Math.random()<.75?"miners":"pirates";
    if(p.danger>68)return "pirates";
    if(p.life!=="Nincs")return Math.random()<.7?"survey":"choir";
    return "survey";
  };
  const factionInterest=(p,id)=>{
    const lines={
      survey:`A Hatóság teljes bioszféra-felmérést kér. A hivatalos jelentés szerint ${p.life==="Nincs"?"a szabályos mélyjelek további vizsgálatot igényelnek":"az életjelek elsőbbségi tudományos értéket képviselnek"}.`,
      void:`„Ezt a világot már azelőtt feltérképeztük, hogy létezett volna. Ne közelíts a ${Math.max(1,p.moons)}. holdhoz. Válaszol.”`,
      relic:`A Céh szerint a legnagyobb kontinens nem természetes képződmény. Ásatási jogokat kérnek, mielőtt a birodalom lezárja a területet.`,
      miners:`A Szövetség kitermelési koncessziót ajánl a következő készletekre: ${p.resources.join(", ")}.`,
      pirates:`A Fekete Nap nyílt csatornán kínál védelmet. Az ár nincs feltüntetve, a fenyegetés igen.`,
      choir:`„A felszín alatt énekelnek. Nem hanggal. A neveteket már tudják.”`
    };return lines[id];
  };
  const makeLore=p=>{
    const climates=p.temp<-100?"fagyott":p.temp>350?"izzó":p.temp>80?"forró":"mérsékelt",sky=pick(["rövid neonimpulzusokkal világít","lassú elektromos fátylakat rajzol az égre","szokatlanul elnyeli a csillagfényt","színes ionviharokat kelt a helyi éjszakákon"]),signals=p.life!=="Nincs"?`A mélyszkenner ${p.life.toLowerCase()} életformák kémiai nyomait különítette el.`:"Élő anyagot nem találtunk, de a felszín alól szabályos energiajelek érkeznek.",profile=typeLore[p.type]||{scan:"A felszín alatti szerkezet további vizsgálatot igényel.",science:"A mérési eredmények nem illenek ismert planetáris modellbe."};
    return {
      summary:`${p.name} egy ${climates} ${p.typeName.toLowerCase()} a ${p.sectorName} térségében. ${p.atmosphere} borítja, és ${p.moons} hold kíséri.`,
      deepScan:`${p.name} ${p.gravity.toLowerCase()} gravitációjú, ${climates} világ. A felső légkör ${sky}. ${profile.scan} ${signals} A kéregben ${p.resources.join(", ")} koncentrációját mértük, miközben a veszélyszint ${p.danger}%-on stabilizálódott.`,
      originTheory:pick([`Valószínűleg egy fiatal csillagrendszer összeomló törmelékövéből alakult ki.`,`A bolygó egy ősi gázóriás fosszilizálódott magja lehet.`,`A szabályos kéregszerkezet mesterséges bolygóformálás nyomait mutatja.`,`Két vándorló protobolygó ütközése hozhatta létre több milliárd éve.`]),
      colonyNote:pick([`A telepesek halk, harmonikus rezgésekről számolnak be mágneses viharok idején.`,`A helyi nappalok egyre hosszabbnak tűnnek, bár a műszerek ezt nem igazolják.`,`Az első expedíciók szerint a horizont minden ciklusban kissé más alakú.`,`A felszíni állomások felett rendszeresen kék villámok jelennek meg.`]),
      scientificNote:profile.science,
      anomalyText:pick([`A szonda válasza 4,2 másodperccel az adás előtt érkezett vissza.`,`A rádiócsendben ugyanaz a tizenhárom szám ismétlődik.`,`A pálya árnyékos oldalán egy csillagtér nélküli folt mozog.`,`A felszín egy része minden új méréskor más koordinátán jelenik meg.`,`Az egyik hold radarképe belül üreges szerkezetet mutat.`])
    };
  };
  const makePlanet=()=>{
    const s=sector(),typeId=pick(s.types),t=types[typeId],rare=rollRarity(s),seed=Math.floor(Math.random()*90000)+1000,size=pick(sizes),gravity=pick(gravities);
    const name=`${pick(prefixes)} ${pick(suffixes)}-${seed}`,rings=Math.random()<.2+s.level*.035,moons=Math.floor(Math.random()*(2+s.level)),life=["living","paradise"].includes(typeId)?"Intelligens":typeId==="ocean"||typeId==="jungle"?pick(["Mikrobiális","Komplex","Bőséges","Ismeretlen"]):typeId==="hive"?"Kollektív":Math.random()<.08+s.level*.025?pick(["Mikrobiális","Növényi","Ismeretlen","Fosszilis"]):"Nincs";
    const danger=Math.min(99,Math.max(1,Math.round(s.danger+(Math.random()-.5)*28+(typeId==="lava"||typeId==="glitch"?12:0))));
    const value=Math.round((32+s.level*24+danger*.7)*rare.mult*(1+state.upgrades.probe*.05)),temp=typeId==="ice"?-180-Math.floor(Math.random()*70):typeId==="lava"?420+Math.floor(Math.random()*900):Math.floor(Math.random()*420)-160;
    const resources=shuffle(t.resources).slice(0,1+Math.floor(Math.random()*Math.min(3,t.resources.length))),id=`${typeId}_${Date.now().toString(36)}_${seed}`,event=Math.random()<.66?pickPlanetEvent(typeId):null;
    const typeHabitability={paradise:42,ocean:32,living:30,jungle:25,crystal:14,desert:5,rock:3,ice:-2,machine:-5,carbon:-8,lava:-24,glitch:-28,gas:-35,storm:-25,grave:-18,hive:-16,phantom:-20,moon:-12}[typeId]||0;
    const habitability=Math.max(1,Math.min(99,Math.round(64-danger*.48+typeHabitability+(gravity[1]>.45&&gravity[1]<1.8?10:-6)+(life!=="Nincs"?8:0))));
    const colonizable=habitability>=42||(["epic","legendary","mythic","cosmic"].includes(rare.id)&&!["gas","storm"].includes(typeId));
    const productionKeys=[...new Set(lootTables[typeId]||["metal"])],production={};productionKeys.slice(0,2).forEach((k,i)=>production[k]=Math.max(1,Math.round((danger/35+rare.mult/3+2)/(i+1))));
    const planet={id,name,type:typeId,typeName:t.name,rarity:rare.id,rarityName:rare.name,rarityColor:rare.color,colors:t.colors,atmosphere:pick(t.atmos),resources,resource:resources[0],size:size[0],sizeScale:size[1],gravity:gravity[0],gravityG:gravity[1],life,danger,value,temp,rings,moons,sector:s.id,sectorName:s.name,event,habitability,colonizable,production,isNew:true,deepScanned:false,discovered:new Date().toISOString()};Object.assign(planet,{knownAnomaly:pick(["The planet hums at 17 Hz.","The shadow moves before the sunrise.","Every scanner names the same crater differently.","A silent beacon repeats the ship name.","The atmosphere briefly spelled FORGIVE US."]),firstContactNote:pick(["The scan returned before it was sent.","MIRA-9 refused to timestamp the first ping.","The probe camera showed the GSA-01 from below.","The first map contained one extra coastline.","A colony channel answered, though no colony exists."]),colonyRumor:pick(["Workers claim the night sky has one extra moon every Friday.","The local shift whistle echoes from underground before it sounds.","Children draw the same door in different settlements.","The southern ridge glows when nobody is scheduled outside.","Every market stall sells the same black pebble by accident."])});
    sfMigratePlanetVisuals(planet);
    planet.factionId=factionForPlanet(planet);planet.factionInterest=factionInterest(planet,planet.factionId);
    return Object.assign(planet,makeLore(planet));
  };
  let visualMigrationChanged=false;
  const hydratePlanet=p=>{if(!p)return;p.typeName||=types[p.type]?.name||"Ismeretlen világ";p.sectorName||=sectors.find(s=>s.id===p.sector)?.name||"Ismeretlen szektor";p.resources=Array.isArray(p.resources)?p.resources:[p.resource||"Ismeretlen anyag"];p.gravity||="Ismeretlen";p.life||="Nincs";p.atmosphere||="Ismeretlen";p.size||="Közepes";p.deepScanned=Boolean(p.deepScanned);visualMigrationChanged=sfMigratePlanetVisuals(p)||visualMigrationChanged;if(!p.factionId)p.factionId=factionForPlanet(p);p.factionInterest||=factionInterest(p,p.factionId);p.knownAnomaly||="The planet hums at 17 Hz.";p.firstContactNote||="The scan returned before it was sent.";p.colonyRumor||="Workers report one extra moon on Fridays.";if(refreshLoreText||!p.summary)Object.assign(p,makeLore(p));};
  [...state.atlas,...state.colonies.map(c=>c.planet)].forEach(hydratePlanet);
  if(visualMigrationChanged)saveData();
  state.codex.loreVersion=2;
    const researchDefs={
    voidPattern:{icon:"[]",name:"Void Pattern Analysis",desc:"Void/glitch deep scan cost -1 Star Dust and unlocks unknown-pattern codex traces.",cost:4,req:()=>state.codex.fragments.includes("unknown-pattern")||state.consequence.voidScans>=2},
    colonialLogistics:{icon:"++",name:"Colonial Logistics",desc:"Stabilization actions restore +5 extra stability.",cost:3,req:()=>state.colonies.length>=1},
    alienBiology:{icon:"::",name:"Alien Biology",desc:"Bio Sample rewards from analysis and colonies gain +20%.",cost:3,req:()=>state.codex.fragments.includes("nonhuman-biology")||state.inventory.bioSamples>=10},
    relicAuth:{icon:"//",name:"Relic Authentication",desc:"Relic discovery chance +10% on machine, grave and phantom worlds.",cost:5,req:()=>state.missions.totalRelics>=1||state.inventory.alienRelics>=1},
    hazardDoctrine:{icon:"!!",name:"Hazard Doctrine",desc:"Danger events are less punishing and catastrophe zones can yield bonus Dark Matter.",cost:4,req:()=>state.consequence.catastrophes>=1||state.atlas.some(p=>p.danger>=76)}
  };
  const hasResearch=id=>state.research.unlocked.includes(id);
  const researchBonus=(id,value)=>hasResearch(id)?value:0;
  const buyResearch=id=>{const r=researchDefs[id];if(!r||hasResearch(id))return;if(!r.req())return toast("RESEARCH LOCKED");if(state.research.points<r.cost)return toast(`NEED ${r.cost} RESEARCH POINTS`);state.research.points-=r.cost;state.research.unlocked.push(id);addCaptainLog(`RESEARCH // ${r.name}`,r.desc,"CODEX LAB");saveData();sfx("win");toast(`RESEARCH UNLOCKED: ${r.name}`);renderCodex();};
  const fragmentDefs=[
    {id:"broken-signal",title:"A TÖRÖTT JEL",icon:"▧",text:"Az első hibás világ nem zajt sugárzott. Üzenetet küldött, amelyet a rendszerünk még nem tanult meg időrendben olvasni."},
    {id:"nonhuman-biology",title:"NEM EMBERI BIOLÓGIA",icon:"🧬",text:"Az idegen sejtek nem versenyeznek egymással. Emlékeket cserélnek, mintha minden élőlény ugyanannak a gondolatnak egy apró része lenne."},
    {id:"imperial-charter",title:"BIRODALMI CHARTA",icon:"♛",text:"Egy fővilág nem attól lesz központ, hogy ott áll a legtöbb torony. Attól, hogy minden távoli kolónia hazafelé néz, amikor felragyog az ég."},
    {id:"precursor-ruins",title:"ELŐFUTÁR ROMOK",icon:"🏛️",text:"Öt relikvia ugyanazt a térképet őrzi. A vonalak nem csillagokat kötnek össze, hanem olyan helyeket, ahol a csillagoknak lenniük kellene."},
    {id:"silent-edge",title:"A NÉMA PEREM",icon:"🕳️",text:"A Void-kolónia első éjszakáján minden rádió egyszerre hallgatott el. A telepesek mégis azt mondják, valaki válaszolt."},
    {id:"flickering-stars",title:"MIÉRT PISLOGNAK A CSILLAGOK",icon:"✦",text:"Száz szkennelés után a minta láthatóvá vált: nem a csillagok pislognak. Valami hatalmas mozog közöttünk és a fény között."}
  ];
  const pushGalacticNews=(icon,title,text)=>{state.galacticNews.unshift({id:Date.now()+Math.random(),icon,title,text,date:new Date().toISOString()});if(state.galacticNews.length>15)state.galacticNews.length=15;};
  const changeRep=(id,amount)=>{state.factions[id]=Math.max(-100,Math.min(100,(state.factions[id]||0)+amount));};
  const addTransmission=(id,trigger,planet=null,custom=null)=>{
    const bank={
      survey:[`A tudományos adatok hitelesítve. A bolygó ideiglenes katalógusszámot kapott; a végleges névhez még egy tiszta mélyszkennelés szükséges.`,`A biológiai mintákat a központi labor már várja. Tartsa elkülönítve őket a hajó vízkörétől. Ez nem ajánlás.`,`A Hatóság összevetette a pályaadatokat a régi térképekkel. A világ kétszáz éve még nem volt ezen a helyen.`,`Kiváló munka, pilóta. A jelentésből eltávolítottunk három olyan sort, amelyet ön nem írt.`],
      void:[`Ezt a bolygót már azelőtt feltérképeztük, hogy létezett volna. Ne kolonizáld a harmadik holdat. Válaszol.`,`A térkép szélén nincs üresség. Csak valami, ami nem akar látszani.`,`Ne bízz a pontos koordinátában. A Voidban csak az eltévedt útvonalak maradnak egy helyben.`,`A szonda visszatért. A felvételein a hajód már roncs volt. Mi nem küldtük el ezt a felvételt.`],
      relic:[`A romterület geometriája előfutár eredetre utal. Kérjük, ne engedje a bányászokat a közelébe.`,`A relikvia nem tárgy. Kulcs. Még nem tudjuk, melyik ajtóhoz.`,`A lelet felületén látható sérülés nem repedés, hanem csillagtérkép. Egyetlen ismert csillag sem szerepel rajta.`,`Ásatási csapatunk készen áll. A szerződés garantálja, hogy mindent dokumentálunk. Azt nem, hogy mindent visszaadunk.`],
      miners:[`A készletek tiszták, az útvonal nyereséges. A Szövetség készen áll az üzletre.`,`A jó érc nem kérdez, csak termel. Küldjük a szerződést.`,`A mágneses vihar három fúrót vitt el, de a negyedik valami nagyobbat talált. Kérünk még egy teherhajót.`,`A kristályerek mélyebbre futnak, mint a bolygó kérge. Ez geológiailag lehetetlen, gazdaságilag viszont kiváló.`],
      pirates:[`Szép kolónia. Kár lenne, ha valaki észrevenné.`,`A Fekete Nap piacán nincs tiltott áru. Csak drága.`,`Nem mi lőttük ki a konvojt. Mi csak előbb értünk oda, mint a mentőcsapat. Az áru egy része még eladó.`,`A birodalmi járőrök új kódot használnak. Mi már feltörtük. Önnek baráti áron adjuk.`],
      choir:[`Halljuk a motorjaidat az álmaink mögött.`,`Ne válaszolj a következő jelre. Már megtetted.`,`Hat hangot küldtetek az űrbe. Mi hetet hallottunk. A hetedik most hazafelé tart.`,`A bolygó nem alszik. Csak lassabban gondolkodik nálatok.`,`Amikor kimondjátok a csillag nevét, valahol kialszik egy fény. Mi őrizzük az összes nevet.`]
    };
    bank.survey.push("Új protokoll: ha a bolygó visszakérdez, nem válaszolunk. A kérdést archiváljuk, majd úgy teszünk, mintha nem félnénk.");
    bank.void.push("A térkép nem a terület leírása. A térkép a csapda része.");
    bank.relic.push("A lelet árnyéka később érkezik, mint maga a lelet. Ez vagy időhiba, vagy nagyon régi technológia.");
    bank.miners.push("A raktér tele, a profit szép, a fedélzet gyanúsan csendes. Ez a három együtt általában robbanást jelent.");
    bank.pirates.push("Nem fenyegetésnek szánjuk, kapitány. Inkább előre megírt történelemnek.");
    bank.choir.push("A radarotok köröket rajzol. Mi ajtókat látunk.");
    const text=custom||pick(bank[id]);state.transmissions.unshift({id:`tx_${Date.now()}_${Math.random()}`,faction:id,trigger,planetId:planet?.id||null,planetName:planet?.name||null,text,date:new Date().toISOString(),read:false});if(state.transmissions.length>40)state.transmissions.length=40;
  };
  const planetNewsText=p=>p.life!=="Nincs"?`${p.name} felszínén ${p.life.toLowerCase()} élet nyomait erősítették meg. A ${factionDefs[p.factionId].short} elsőbbségi hozzáférést kér az adatokhoz.`:`${p.name}, egy ${p.rarityName.toLowerCase()} ${p.typeName.toLowerCase()}, bekerült a birodalmi atlaszba. A mért ${p.danger}% veszély ellenére a készletek jelentős stratégiai értéket képviselnek.`;
  const unlockFragment=(id,news=null)=>{if(state.codex.fragments.includes(id))return false;state.codex.fragments.push(id);const f=fragmentDefs.find(x=>x.id===id);if(news)pushGalacticNews(news.icon,news.title,news.text);toast(`KÓDEX FELOLDVA: ${f?.title||id}`);return true;};
  const refreshCodex=()=>{
    if(state.atlas.some(p=>p.type==="glitch"))unlockFragment("broken-signal",{icon:"▧",title:"VOID JEL",text:"Az első Glitch-világ időn kívüli adást küldött."});
    if(state.atlas.some(p=>p.life!=="Nincs"))unlockFragment("nonhuman-biology",{icon:"🧬",title:"ELSŐ KAPCSOLAT",text:"Idegen élet nyomai átírják a biológiai modelleket."});
    if(state.capitalId)unlockFragment("imperial-charter",{icon:"♛",title:"FŐVILÁG KIKIÁLTVA",text:"A birodalom első fővilága elfogadta a császári chartát."});
    if((state.missions.totalRelics||0)>=5)unlockFragment("precursor-ruins",{icon:"🏛️",title:"ELŐFUTÁR TÉRKÉP",text:"Öt idegen relikvia ugyanannak az elveszett hálózatnak a része."});
    if(state.colonies.some(c=>c.planet.sector==="void"))unlockFragment("silent-edge",{icon:"🕳️",title:"NÉMA KOLÓNIA",text:"A Void Perem új telepe ismétlődő számokat hall a felszín alól."});
    if((state.totalScans||0)>=100)unlockFragment("flickering-stars",{icon:"✦",title:"SZÁZADIK SZKENNELÉS",text:"A csillagok vibrálásában rejtett minta rajzolódott ki."});
  };
  refreshCodex();
  const empireLevel=()=>state.colonies.reduce((n,c)=>n+(c.level||1)+(buildingDefs[c.building]?.empire||0),0)+(state.missions.levelBonus||0);
  const colonyLimit=()=>(empireLevel()>=5?5+(state.capitalId?1:0):empireLevel()>=3?4:2)+(state.market.owned.includes("colonialCharter")?1:0);
  const buildingUnlocked=id=>empireLevel()>=(buildingUnlock[id]||0)||(id==="relic"&&state.missions.ancientTech);
  const colonyFor=id=>state.colonies.find(c=>c.planet.id===id);
  const addInventory=(key,amount)=>{if(key==="coins"){currentPlayer.coins+=amount;return;}state.inventory[key]=(state.inventory[key]||0)+amount;if(key==="alienRelics"&&amount>0){state.missions.totalRelics=(state.missions.totalRelics||0)+amount;refreshCodex();}};
  const clampMood=(key,amount)=>state.living[key]=Math.max(0,Math.min(100,state.living[key]+amount));
  const addCaptainLog=(title,text,voice="KAPITÁNY")=>{state.living.logs.unshift({id:`log_${Date.now()}_${Math.random()}`,scan:state.totalScans||0,title,text,voice,date:new Date().toISOString()});if(state.living.logs.length>40)state.living.logs.length=40;};
  const dangerTier=p=>{const d=Number(p?.danger)||0;return d<=25?{id:"safe",label:"SAFE",text:"Low-risk survey zone.",event:"Minor scanner drift."}:d<=50?{id:"unstable",label:"UNSTABLE",text:"Systems may suffer small losses.",event:"Stability drift and repair costs."}:d<=75?{id:"dangerous",label:"DANGEROUS",text:"Pirates, outbreaks and cargo loss are possible.",event:"Raid, biohazard or cargo damage."}:{id:"catastrophe",label:"CATASTROPHE ZONE",text:"Evacuation-grade decisions can appear.",event:"Severe colony damage, but rare rewards."};};
  const memorablePlanetText=p=>`<section class="sf-memory-card"><header><span>!!</span><div><small>KNOWN ANOMALY</small><b>${esc(p.knownAnomaly||"The planet hums at 17 Hz.")}</b></div></header><dl><div><dt>First contact note</dt><dd>${esc(p.firstContactNote||"The scan returned before it was sent.")}</dd></div><div><dt>Colony rumor</dt><dd>${esc(p.colonyRumor||"Workers report one extra moon on Fridays.")}</dd></div></dl></section>`;
  const cultureDefs={mining:{icon:"[]",name:"MINING COLONY",desc:"More metal, more accidents, occasional morale loss.",prod:{metal:1},risk:5},research:{icon:"::",name:"RESEARCH STATION",desc:"More Star Dust/Bio Samples and codex progress, stabilization costs more.",prod:{starDust:1},risk:2},trade:{icon:"$",name:"TRADE CITY",desc:"More coins and market momentum, pirates pay closer attention.",prod:{coins:6},risk:8},cult:{icon:"??",name:"STRANGE CULT",desc:"Void patterns spread faster. Stability becomes unpredictable.",prod:{darkMatter:1},risk:11},military:{icon:"##",name:"MILITARY OUTPOST",desc:"Lower raid damage and better fortress value, slower growth.",prod:{metal:1},risk:-6}};
  const cultureForPlanet=p=>["glitch","phantom"].includes(p.type)||p.sector==="void"?"cult":p.life!=="Nincs"||["living","jungle","ocean","paradise"].includes(p.type)?"research":p.danger>=70?"military":["rock","moon","lava","carbon","crystal"].includes(p.type)?"mining":"trade";
  const cultureHtml=c=>{const d=cultureDefs[c.culture]||cultureDefs.mining;return `<section class="sf-culture-tag"><span>${d.icon}</span><div><small>COLONY CULTURE</small><b>${d.name}</b><p>${d.desc}</p></div></section>`;};
  const updateMiraState=()=>{const voidPressure=(state.consequence.voidScans||0)+(state.consequence.patterns||[]).length,stable=state.colonies.filter(c=>c.stability>=85).length;if(state.living.trust<22||voidPressure>=7)state.miraState="Corrupted";else if(state.living.tension>72||voidPressure>=4)state.miraState="Suspicious";else if(state.market.purchases>=8||state.factions.pirates>8)state.miraState="Sarcastic";else if(state.living.trust>72&&stable>=2)state.miraState="Helpful";else if(state.totalScans>0&&state.totalScans%9===0)state.miraState="Silent";else state.miraState=state.miraState||"Helpful";};
  const applyPlanetConsequences=p=>{const tier=dangerTier(p),voidWorld=p.sector==="void"||["glitch","phantom"].includes(p.type),rare=["legendary","mythic","glitched","cosmic"].includes(p.rarity);if(voidWorld){state.consequence.voidScans=(state.consequence.voidScans||0)+1;state.consequence.patterns.unshift({planet:p.name,signal:p.knownAnomaly||p.anomalyText,date:new Date().toISOString()});state.consequence.patterns.length=Math.min(8,state.consequence.patterns.length);clampMood("trust",-3);clampMood("tension",6);addCaptainLog("VOID PATTERN ECHO",`${p.name}: ${(p.knownAnomaly||p.anomalyText||"unknown pattern")}. The same trace was copied into MIRA-9 diagnostics.`,"MIRA-9");}if(rare){state.consequence.rareScans=(state.consequence.rareScans||0)+1;state.research.points+=1;}if(tier.id==="catastrophe"){state.consequence.catastrophes=(state.consequence.catastrophes||0)+1;state.research.points+=1;if(hasResearch("hazardDoctrine"))addInventory("darkMatter",1);}updateMiraState();};
  const bridgeDilemmas=()=>[{id:"signal",icon:"[]",source:"MIRA-9 REPORT",title:"A colony relay repeats an unknown pattern.",options:[["investigate","Investigate",()=>{state.research.points+=1;clampMood("tension",4);unlockFragment("unknown-pattern",{icon:"[]",title:"PATTERN TRACE",text:"A bridge investigation linked colony noise to a scan anomaly."});return "+1 research point. Pattern archived."}],["ignore","Ignore",()=>{clampMood("morale",1);clampMood("trust",-2);return "Crew rests. MIRA-9 logs your lack of curiosity."}],["probe","Send Probe",()=>{if(state.inventory.starDust<1)return "Need 1 Star Dust.";state.inventory.starDust-=1;addInventory("darkMatter",1);clampMood("tension",2);return "Probe returned with dark matter residue."}]]},{id:"engine",icon:"!!",source:"ENGINEERING",title:"The drive is hot, but overclocking could widen scan gain.",options:[["cool","Cool Down",()=>{clampMood("tension",-6);state.fuel=Math.min(maxFuel(),state.fuel+1);return "+1 fuel, tension reduced."}],["overclock","Overclock",()=>{clampMood("tension",8);state.research.points+=1;if(Math.random()<.35)state.fuel=Math.max(0,state.fuel-1);return "+1 research point. The engine will complain later."}],["mira","Let MIRA decide",()=>{updateMiraState();clampMood("trust",3);return `MIRA-9 chose ${state.miraState}. Trust adjusted.`}]]},{id:"market",icon:"$",source:"MARKET WATCH",title:"A broker wants anomaly data before it appears in the codex.",options:[["sell","Sell Data",()=>{currentPlayer.coins+=45;clampMood("trust",-4);return "+45 coins. MIRA-9 calls this short-term thinking."}],["archive","Archive",()=>{state.research.points+=1;return "+1 research point. Data retained."}],["bait","Bait Pirates",()=>{changeRep("pirates",-1);clampMood("tension",5);return "Pirate chatter increased. Reputation shifted."}]]}];
  const currentBridgeDilemma=()=>bridgeDilemmas()[(state.totalScans+state.bridgeChoices.length)%bridgeDilemmas().length];
  const bridgePanelHtml=()=>{const d=currentBridgeDilemma();return `<section class="sf-bridge-choice"><header><span>${d.icon}</span><div><small>${d.source}</small><b>${d.title}</b></div></header><div>${d.options.map(o=>`<button data-bridge-choice="${d.id}:${o[0]}">${o[1]}</button>`).join("")}</div>${state.bridgeChoices[0]?`<p>${state.bridgeChoices[0].result}</p>`:""}</section>`;};
  const resolveBridgeChoice=key=>{const [did,oid]=key.split(":"),d=bridgeDilemmas().find(x=>x.id===did),o=d?.options.find(x=>x[0]===oid);if(!o)return;const result=o[2]();state.bridgeChoices.unshift({id:key,result,date:new Date().toISOString()});state.bridgeChoices.length=Math.min(12,state.bridgeChoices.length);addCaptainLog(`BRIDGE DECISION // ${d.source}`,result,"BRIDGE");saveData();updateHud();sfx("save");renderBridge();};
  const rivalDefs=[
    {id:"aurora",icon:"🌅",name:"Aurora Liga",color:"#7df9ff",style:"Diplomáciai kutatóhálózat",sector:"garden"},
    {id:"blackSun",icon:"☀️",name:"Fekete Nap Protektorátus",color:"#ff5964",style:"Kalóz-védelmi domínium",sector:"volcanic"},
    {id:"relicGuild",icon:"🏛️",name:"Relikvia Céh",color:"#ffb65c",style:"Ősi technológiai konzorcium",sector:"ancient"},
    {id:"silentChoir",icon:"◉",name:"Néma Kórus",color:"#72ffb0",style:"Biológiai-kulturális raj",sector:"void"}
  ];
  state.rivals=state.rivals&&typeof state.rivals==="object"?state.rivals:{};
  state.rivalEvents=Array.isArray(state.rivalEvents)?state.rivalEvents:[];
  rivalDefs.forEach((r,i)=>{state.rivals[r.id]={...r,planets:[],population:0,resources:0,coins:0,power:0,threat:25+i*12,...(state.rivals[r.id]||{})};});
  const refreshRivalStats=r=>{r.planets=Array.isArray(r.planets)?r.planets:[];r.population=Math.max(0,Math.round(r.planets.reduce((n,p)=>n+(p.habitability||25)*850+(p.value||50)*42,0)));r.resources=Math.max(0,Math.round(r.planets.reduce((n,p)=>n+(p.resources?.length||1)*22+(100-(p.danger||40))/3,0)));r.coins=Math.max(r.coins||0,Math.round(r.population/95+r.resources*3));r.power=Math.max(25,Math.round(r.planets.length*52+r.population/360+r.resources/2+(r.threat||0)));return r;};
  const seedRivals=()=>Object.values(state.rivals).forEach((r,idx)=>{r.planets=Array.isArray(r.planets)?r.planets:[];const target=3+idx;while(r.planets.length<target){const oldSector=state.sector;state.sector=r.sector||oldSector;const p=makePlanet();state.sector=oldSector;p.owner=r.id;p.ownerName=r.name;p.rivalWorld=true;p.conquered=false;p.discovered=true;hydratePlanet(p);r.planets.push(p);}r.planets.forEach(p=>{hydratePlanet(p);p.owner=r.id;p.ownerName=r.name;p.rivalWorld=true;});refreshRivalStats(r);});
  seedRivals();
  if(visualMigrationChanged)saveData();
  const chatterBank=[
    "…a külső bóják késve ismétlik a hajó azonosítóját…",
    "…kolóniahajók kérnek engedélyt a Vanta-folyosóra…",
    "…ismeretlen impulzus az Atlasz hatótávolságán túl…",
    "…a Fekete Nap frekvenciája ma szokatlanul csendes…",
    "…GSA-01, a jeladójuk kétszer szerepel a forgalmi naplóban…",
    "…minden kutatóállomásnak: ne válaszoljanak a hetedik hangra…",
    "…MIRA-9 kétszer tagadta, hogy félne. Senki sem kérdezte…",
    "…a külső kamerák egy pillanatra belülről mutatták a hajót…",
    "…valaki a kapitány hangján kért dokkolási engedélyt…",
    "…a radar visszhangja tapsol. Ismétlem: tapsol…",
    "…a hetedik csatornán gyerekdal fut, de nincs hetedik csatorna…",
    "…a következő szektor térképe már rajta van a hajótest porában…"
  ];
  const updateChatter=p=>{state.living.chatter=p?.sector==="void"?"…a Void-relé szerint már elhagytuk a szektort. A navigáció szerint még nem…":pick(chatterBank);};
  const miraComment=p=>{updateMiraState();if(state.miraState==="Silent")return "...";if(state.miraState==="Corrupted")return "The colony is quieter now. This can be called improvement.";if(state.miraState==="Suspicious"&&p)return "I recommend distance. Not caution. Distance.";if(state.miraState==="Sarcastic"&&p?.danger>50)return "Excellent, another place where physics has resigned but we are landing anyway.";
    if(state.pendingIncident)return "A döntési ablak nyitva áll. A bizonytalanság költsége másodpercenként nő.";
    if(p?.danger>75)return `Parancsnok, ezen a világon ${100-p.danger}% az esélye annak, hogy a veszélybecslés túl optimista.`;
    if(p?.life!=="Nincs")return "Az életjel megerősítve. Kérem, ezúttal sem nevezzen el semmit önmagáról.";
    if(state.living.tension>70)return "A legénység feszült. Javaslom a pihenést, vagy a pihenés szükségtelenségének kötelező oktatását.";
    if(state.fuel<=2)return "Az üzemanyag alacsony. A bátorság sajnos nem kompatibilis a hajtóművel.";
    return pick(["Minden rendszer működik. Ez statisztikailag gyanús.","A csend nem üres, parancsnok. Csak még nem dekódoltuk.","A legénység morálja elfogadható. Senki sem kérdezte, de mértem.","A radar szerint egyedül vagyunk. A radar hazudik a legszebben.","A fedélzeti kávé 12%-kal javította a döntési morált. Tudományosan sajnálatos.","Ha valami kopog a hajótesten, kérem, ne kopogjon vissza.","A csillagok ma túl szabályosan állnak. Ez általában rossz előjel, vagy dekoráció.","A menü áttekinthetőbb lett. Ez nem jelenti azt, hogy az univerzum is az."]);
  };
  const crewLine=p=>{
    const lines=p?.type==="glitch"?["TUDOMÁNYOS TISZT","Ennek a bolygónak két különböző árnyéka van. Egyikhez sincs megfelelő csillag."]:p?.danger>65?["MÉRNÖK","A pajzsrendszer már attól tiltakozik, hogy ránézünk erre a helyre."]:state.fuel<=2?["MÉRNÖK","Az üzemanyagrendszer gyűlöli ezt a szektort. Őszintén szólva megértem."]:["TUDOMÁNYOS TISZT","A háttérzajban szabályos ismétlődést találtam. MIRA-9 szerint véletlen."];return lines;
  };
  const planetMemory=p=>{const n=Number(p.interactions)||0;if(!n)return "";if(n===1)return "A bolygó már nem teljesen néma. Egy gyenge jel a GSA-01 azonosítóját ismétli.";if(n===2)return "A korábbi leszállóhely körül szabályos fények jelentek meg. A felszínen senkinek sem kellene lennie.";return `Ez a világ ${n} korábbi kapcsolatfelvételre emlékszik. A visszhang most már a kapitány hangján válaszol.`;};
  if(!state.living.logs.length)addCaptainLog("ELSŐ MŰSZAK","MIRA-9 minden rendszert működőképesnek jelentett. A legénység ezt megnyugtatónak találta. Én korainak.");
  if(!state.living.chatter)updateChatter();
  const tradeFaction=id=>{const offer=factionTrades[id];if(!offer)return;if((state.factions[id]||0)<(offer.rep||0))return toast(`KELL: ${offer.rep} REPUTÁCIÓ`);const enough=Object.entries(offer.cost).every(([k,v])=>(k==="coins"?currentPlayer.coins:state.inventory[k]||0)>=v);if(!enough)return toast("NINCS ELÉG NYERSANYAG AZ ÜZLETHEZ");Object.entries(offer.cost).forEach(([k,v])=>{if(k==="coins")currentPlayer.coins-=v;else state.inventory[k]-=v;});Object.entries(offer.gain).forEach(([k,v])=>addInventory(k,v));changeRep(id,1);addTransmission(id,"KERESKEDELMI SZERZŐDÉS",null,`Az üzlet lezárult: ${offer.label}. A kapcsolat +1 reputációval erősödött.`);saveData();updateHud();sfx("coin");toast(`${factionDefs[id].short.toUpperCase()} • ÜZLET LEZÁRVA`);};
  const inventoryLabel=(key,amount)=>`${resourceDefs[key]?.icon||"●"} +${amount} ${resourceDefs[key]?.name||"Érme"}`;
  const landingLoot=p=>{
    const pool=lootTables[p.type]||["metal"],rolls=1+Math.floor((p.rarity==="common"?0:1)+state.upgrades.cargo/3)+(state.market.owned.includes("smugglerHold")?1:0),loot={};
    for(let i=0;i<rolls;i++){const key=pick(pool),amount=Math.max(1,Math.round(2+Math.random()*5+(p.danger/28)+(p.rarity==="legendary"?4:0)));loot[key]=(loot[key]||0)+amount;}
    return loot;
  };
  const colonyIncome=()=>{
    const total={},capitalMult=state.capitalId?1.1:1;state.colonies.forEach(c=>{if(c.skipProduction>0||c.stability<=0)return;const def=buildingDefs[c.building]||buildingDefs.mine,stabilityMult=c.stability<40?.5:c.stability<70?.75:1,policyMult=c.policy==="industry"?.22:c.policy==="science"?.12:0,terraformMult=1+(c.terraformLevel||0)*.18+(c.conquered?.08:0)+policyMult,mult=Math.max(1,c.level||1)*stabilityMult*capitalMult*terraformMult;Object.entries(def.produces).forEach(([k,v])=>total[k]=(total[k]||0)+Math.max(1,Math.round(v*mult)));const culture=cultureDefs[c.culture]||cultureDefs.mining;Object.entries(culture.prod||{}).forEach(([k,v])=>total[k]=(total[k]||0)+Math.max(1,Math.round(v*Math.max(1,c.level||1)*(hasResearch("alienBiology")&&k==="bioSamples"?1.2:1))));});return total;
  };
  const pushEmpireEvent=event=>{state.lastEmpireEvent={...event,id:Date.now()};state.eventLog.unshift(state.lastEmpireEvent);if(state.eventLog.length>12)state.eventLog.length=12;pushGalacticNews(event.icon,event.title,`${event.colony}: ${event.text}`);addCaptainLog(event.title,`${event.colony}: ${event.text}`,event.kind==="good"?"KOLÓNIAI RELÉ":"VÉSZHELYZETI NAPLÓ");clampMood("morale",event.kind==="good"?4:-5);clampMood("tension",event.kind==="good"?-4:7);sfx(event.kind==="good"?"win":"lose");};
  const createPirateIncident=colony=>{state.pendingIncident={id:`incident_${Date.now()}`,kind:"pirate",icon:"☀",channel:"BLACK SUN PIRATE RELAY",title:"VÉDELMI ADÓ",colonyId:colony.id,text:`„Fizessetek 20 fémet, és ${colony.planet.name} tovább lélegezhet. A döntés a tiétek. A következmény is.”`};clampMood("tension",8);updateChatter();};
  const empireCostLabel=cost=>Object.entries(cost).map(([k,v])=>`${v} ${k==="coins"?"●":resourceDefs[k]?.icon||k}`).join(" + ");
  const empireHasCost=cost=>Object.entries(cost).every(([k,v])=>(k==="coins"?currentPlayer.coins:(state.inventory[k]||0))>=v);
  const empirePayCost=cost=>{if(!empireHasCost(cost))return false;Object.entries(cost).forEach(([k,v])=>{if(k==="coins")currentPlayer.coins-=v;else state.inventory[k]-=v;});return true;};
  const ownedPopulation=()=>state.colonies.reduce((n,c)=>n+(c.population||0),0);
  const playerPower=()=>Math.round(empireLevel()*58+state.colonies.length*38+(state.upgrades.shield||0)*24+(state.upgrades.engine||0)*18+(state.upgrades.scanner||0)*8+(state.capitalId?90:0)+(state.missions.conquests||0)*28+ownedPopulation()/900);
  const terraformCost=c=>{const t=c.terraformLevel||0;return {metal:80+t*42,crystal:35+t*18,bioSamples:12+t*6,starDust:8+t*4};};
  const conquestCost=p=>({coins:240+(p.danger||40)*2,metal:120,crystal:55,fuelCells:20});
  const strategyPanelHtml=level=>{
    const rivals=Object.values(state.rivals||{}),power=playerPower(),terraformReady=level>=6||state.capitalId;
    return `<section class="sf-strategy-panel"><header><div><p class="eyebrow">IMPERIAL STRATEGY LAYER</p><h3>ŰRURALMI TÉRKÉP</h3><small>${terraformReady?"Terraform protokoll aktív.":"Terraformálás: birodalmi szint 6 vagy fővilág kell."} • Bolygófoglalás: szint 8.</small></div><div class="sf-domain-stats"><span>HADERŐ <b>${power}</b></span><span>LAKOSSÁG <b>${Math.round(ownedPopulation()).toLocaleString("hu-HU")}</b></span><span>RIVÁLIS VILÁGOK <b>${rivals.reduce((n,r)=>n+(r.planets?.length||0),0)}</b></span></div></header><div class="sf-rival-grid">${rivals.map(r=>{refreshRivalStats(r);return `<article class="sf-rival-card" style="--rival:${r.color}"><header><span>${r.icon}</span><div><b>${r.name}</b><small>${r.style}</small></div></header><dl><div><dt>Bolygók</dt><dd>${r.planets.length}</dd></div><div><dt>Lakosság</dt><dd>${r.population.toLocaleString("hu-HU")}</dd></div><div><dt>Nyersanyag</dt><dd>${r.resources}</dd></div><div><dt>Pénz</dt><dd>${r.coins.toLocaleString("hu-HU")}</dd></div><div><dt>Haderő</dt><dd>${r.power}</dd></div></dl><div class="sf-rival-worlds">${r.planets.slice(0,3).map(p=>`<div class="sf-rival-world"><span>${planetArt(p,true)}</span><div><b>${p.name}</b><small>${p.typeName} • ${p.moons||0} hold • veszély ${p.danger}%</small><button class="sf-conquer-btn" data-conquer="${r.id}:${p.id}" ${level<8?"disabled":""}>${level<8?"SZINT 8 KELL":`ELFOGLALÁS • ${empireCostLabel(conquestCost(p))}`}</button></div></div>`).join("")}</div></article>`;}).join("")}</div></section>`;
  };
  const terraformColony=id=>{const c=state.colonies.find(x=>x.id===id);if(!c)return;if(empireLevel()<6&&!state.capitalId)return toast("TERRAFORMÁLÁSHOZ BIRODALMI SZINT 6 VAGY FŐVILÁG KELL");if((c.terraformLevel||0)>=5)return toast("EZ A VILÁG MÁR MAXIMÁLISAN TERRAFORMÁLT");const cost=terraformCost(c);if(!empirePayCost(cost))return toast(`KELL: ${empireCostLabel(cost)}`);c.terraformLevel=(c.terraformLevel||0)+1;c.planet.habitability=Math.min(99,(c.planet.habitability||25)+12);c.planet.danger=Math.max(1,(c.planet.danger||40)-10);c.population+=800+c.terraformLevel*350;c.stability=Math.min(100,(c.stability||50)+14);state.missions.terraforms=(state.missions.terraforms||0)+1;pushEmpireEvent({icon:"🌍",title:"TERRAFORM PROTOKOLL",kind:"good",colony:c.planet.name,text:`A légkör stabilabb, a bioszféra barátságosabb. Terraform szint: ${c.terraformLevel}/5.`});saveData();updateHud();renderEmpire();};
  const conquerWorld=(rid,pid)=>{const r=state.rivals?.[rid],p=r?.planets?.find(x=>x.id===pid);if(!r||!p)return;if(empireLevel()<8)return toast("BOLYGÓFOGLALÁSHOZ BIRODALMI SZINT 8 KELL");const cost=conquestCost(p);if(!empirePayCost(cost))return toast(`KELL: ${empireCostLabel(cost)}`);const chance=Math.max(.18,Math.min(.88,(playerPower()+90)/(r.power+(p.danger||40)*4+170)));if(Math.random()<chance){r.planets=r.planets.filter(x=>x.id!==pid);p.owner="player";p.ownerName="Gubuntu Birodalom";p.rivalWorld=false;p.conquered=true;const colony={id:`conquered_${p.id}_${Date.now()}`,planet:p,level:2,building:"defense",population:Math.round((p.habitability||25)*950+(p.value||50)*45),stability:62,conquered:true,previousOwner:r.name,terraformLevel:0};state.colonies.push(colony);state.missions.conquests=(state.missions.conquests||0)+1;refreshRivalStats(r);pushEmpireEvent({icon:"⚔️",title:"BOLYGÓ ELFOGLALVA",kind:"good",colony:p.name,text:`${r.name} visszavonult. A világ most a Gubuntu Birodalomhoz tartozik.`});toast(`⚔️ ${p.name} ELFOGLALVA`);sfx("win");}else{r.threat=(r.threat||0)+18;refreshRivalStats(r);const hit=pick(state.colonies);if(hit)hit.stability=Math.max(0,hit.stability-8);pushEmpireEvent({icon:"🛡️",title:"HADJÁRAT VISSZAVERÉSE",kind:"bad",colony:p.name,text:`${r.name} megvédte a világot. A front drágább lett, egy kolónia stabilitása megingott.`});sfx("lose");}saveData();updateHud();renderEmpire();};
  const doctrineDefs={balanced:["⚖️","Kiegyensúlyozott","+általános stabilitás"],military:["⚔️","Hadigépezet","+haderő, drágább diplomácia"],trade:["◆","Kereskedelmi Liga","+pénz és blokkád haszon"],science:["✦","Kutató Birodalom","+terraform és szabotázs esély"],diplomacy:["☮","Diplomáciai Háló","+jobb szerződések"]};
  state.empireDoctrine=state.empireDoctrine||"balanced";
  const doctrineBonus=()=>state.empireDoctrine==="military"?70:state.empireDoctrine==="science"?25:state.empireDoctrine==="diplomacy"?10:0;
  const strategicPower=()=>playerPower()+doctrineBonus()+state.colonies.reduce((n,c)=>n+(c.policy==="fortress"?35:0),0);
  const rivalStance=r=>r.relation>=65?"SZERZŐDÉSES":r.relation>=25?"ÓVATOS":r.relation<=-45?"ELLENSÉGES":r.threat>=75?"FENYEGETŐ":"SEMLEGES";
  const setDoctrine=id=>{if(!doctrineDefs[id])return;state.empireDoctrine=id;clampMood("morale",id==="military"?2:1);saveData();toast(`BIRODALMI DOKTRÍNA: ${doctrineDefs[id][1].toUpperCase()}`);renderEmpire();};
  const cyclePolicy=id=>{const c=state.colonies.find(x=>x.id===id);if(!c)return;const order=["growth","industry","science","fortress"],labels={growth:"Növekedés",industry:"Ipari fókusz",science:"Kutatói fókusz",fortress:"Erődvilág"};c.policy=order[(order.indexOf(c.policy||"growth")+1)%order.length];if(c.policy==="growth")c.population+=250;if(c.policy==="fortress")c.stability=Math.min(100,c.stability+6);saveData();toast(`${c.planet.name} politika: ${labels[c.policy]}`);renderEmpire();};
  const rivalAction=(rid,kind)=>{const r=state.rivals?.[rid];if(!r)return;const costs={embassy:{coins:180,crystal:15},sabotage:{coins:220,starDust:10},blockade:{fuelCells:18,metal:75},tribute:{coins:120,metal:35}},cost=costs[kind];if(!empirePayCost(cost))return toast(`KELL: ${empireCostLabel(cost)}`);if(kind==="embassy"){r.relation=Math.min(100,(r.relation||0)+(state.empireDoctrine==="diplomacy"?24:16));r.threat=Math.max(0,(r.threat||0)-10);if(r.relation>=65)r.treaty=true;pushEmpireEvent({icon:"☮",title:"DIPLOMÁCIAI KÜLDETÉS",kind:"good",colony:r.name,text:r.treaty?"Szerződés született. A határvidék egy időre nyugodtabb.":"A kapcsolat javult, a fenyegetés csökkent."});}if(kind==="sabotage"){const chance=(state.empireDoctrine==="science"?.72:.55)+(state.upgrades.scanner||0)*.02;if(Math.random()<chance){r.power=Math.max(20,r.power-45);r.resources=Math.max(0,r.resources-35);r.threat=Math.min(100,(r.threat||0)+8);pushEmpireEvent({icon:"🕳️",title:"ÁRNYÉKAKCIÓ SIKERES",kind:"good",colony:r.name,text:"A rivális flottalogisztika megbicsaklott. Haderő és nyersanyag csökkent."});}else{r.relation=(r.relation||0)-18;r.threat=Math.min(100,(r.threat||0)+22);pushEmpireEvent({icon:"⚠️",title:"SZABOTÁZS LEBUKOTT",kind:"bad",colony:r.name,text:"A művelet nyoma visszavezethető. A rivális gyanakvóbb és agresszívabb lett."});}}if(kind==="blockade"){const gain=Math.round(40+(r.resources||0)*.08+(state.empireDoctrine==="trade"?35:0));r.coins=Math.max(0,(r.coins||0)-gain);r.relation=(r.relation||0)-12;r.threat=Math.min(100,(r.threat||0)+14);currentPlayer.coins+=gain;addInventory("metal",Math.max(8,Math.round(gain/8)));pushEmpireEvent({icon:"◆",title:"HATÁRZÁR",kind:"good",colony:r.name,text:`Konvojokat fogtunk el. +${gain} érme és extra fém érkezett.`});}if(kind==="tribute"){r.relation=Math.min(100,(r.relation||0)+8);r.threat=Math.max(0,(r.threat||0)-18);pushEmpireEvent({icon:"🎁",title:"ADÓ ÉS AJÁNDÉK",kind:"good",colony:r.name,text:"A rivális elfogadta az ajándékot. Nem barát, de ma kevésbé ellenség."});}refreshRivalStats(r);saveData();updateHud();renderEmpire();};
  const strategyPanelHtmlV2=level=>{const rivals=Object.values(state.rivals||{}),power=strategicPower(),doctrine=doctrineDefs[state.empireDoctrine]||doctrineDefs.balanced,maxRival=Math.max(1,...rivals.map(r=>refreshRivalStats(r).power)),readiness=Math.min(100,Math.round(power/(maxRival*1.25)*100)),terraformReady=level>=6||state.capitalId;return `<section class="sf-strategy-panel sf-war-room"><header><div><p class="eyebrow">GUBUNTU IMPERIAL WAR ROOM</p><h3>${doctrine[0]} ŰRURALMI PARANCSNOKSÁG</h3><small>${doctrine[1]} • ${doctrine[2]} • ${terraformReady?"terraform engedély aktív":"terraform zárva"} • foglalás szint 8-tól</small></div><div class="sf-domain-stats"><span>STRATÉGIAI ERŐ <b>${power}</b></span><span>HADKÉSZÜLTSÉG <b>${readiness}%</b></span><span>LAKOSSÁG <b>${Math.round(ownedPopulation()).toLocaleString("hu-HU")}</b></span><span>RIVÁLIS VILÁGOK <b>${rivals.reduce((n,r)=>n+(r.planets?.length||0),0)}</b></span></div></header><div class="sf-doctrine-row">${Object.entries(doctrineDefs).map(([id,d])=>`<button data-doctrine="${id}" class="${state.empireDoctrine===id?"active":""}"><span>${d[0]}</span><b>${d[1]}</b><small>${d[2]}</small></button>`).join("")}</div><div class="sf-rival-grid">${rivals.map(r=>{refreshRivalStats(r);const rel=r.relation||0,threat=r.threat||0,odds=Math.max(5,Math.min(95,Math.round((power+90)/(r.power+220)*100)));return `<article class="sf-rival-card sf-rival-command" style="--rival:${r.color}"><header><span>${r.icon}</span><div><b>${r.name}</b><small>${r.style} • ${rivalStance(r)} • hadjárat esély ${odds}%</small></div></header><div class="sf-rival-bars"><label>Kapcsolat <i><u style="width:${Math.max(0,Math.min(100,rel+50))}%"></u></i><b>${rel}</b></label><label>Fenyegetés <i><u style="width:${threat}%"></u></i><b>${threat}</b></label><label>Haderő <i><u style="width:${Math.min(100,r.power/(power+1)*100)}%"></u></i><b>${r.power}</b></label></div><dl><div><dt>Bolygók</dt><dd>${r.planets.length}</dd></div><div><dt>Lakosság</dt><dd>${r.population.toLocaleString("hu-HU")}</dd></div><div><dt>Nyersanyag</dt><dd>${r.resources}</dd></div><div><dt>Pénz</dt><dd>${r.coins.toLocaleString("hu-HU")}</dd></div><div><dt>Státusz</dt><dd>${r.treaty?"Paktum":"Nyitott"}</dd></div></dl><div class="sf-rival-actions"><button data-rival-act="${r.id}:embassy">Követség • ${empireCostLabel({coins:180,crystal:15})}</button><button data-rival-act="${r.id}:sabotage">Szabotázs • ${empireCostLabel({coins:220,starDust:10})}</button><button data-rival-act="${r.id}:blockade">Blokád • ${empireCostLabel({fuelCells:18,metal:75})}</button><button data-rival-act="${r.id}:tribute">Ajándék • ${empireCostLabel({coins:120,metal:35})}</button></div><div class="sf-rival-worlds">${r.planets.slice(0,4).map(p=>`<div class="sf-rival-world"><span>${planetArt(p,true)}</span><div><b>${p.name}</b><small>${p.typeName} • ${p.moons||0} hold • veszély ${p.danger}%</small><button class="sf-conquer-btn" data-conquer="${r.id}:${p.id}" ${level<8?"disabled":""}>${level<8?"SZINT 8 KELL":`ELFOGLALÁS • ${empireCostLabel(conquestCost(p))}`}</button></div></div>`).join("")}</div></article>`;}).join("")}</div></section>`;};
  const resolveIncident=choice=>{
    const incident=state.pendingIncident,colony=state.colonies.find(c=>c.id===incident?.colonyId);if(!incident||!colony)return;
    let result="";
    if(choice==="pay"){if(state.inventory.metal<20)return toast("KELL: 20 FÉM");state.inventory.metal-=20;changeRep("pirates",1);clampMood("trust",-3);result="A szállítmány eltűnt a relé határán. A kolónia sértetlen maradt.";}
    if(choice==="refuse"){colony.stability=Math.max(0,colony.stability-14);changeRep("pirates",-2);clampMood("morale",-6);clampMood("tension",10);result="A kolónia visszautasította a követelést. A kalózok megrongálták az energiaelosztót. -14 stabilitás.";}
    if(choice==="threaten"){const success=colony.building==="defense"||state.upgrades.shield>=3||Math.random()<.35;if(success){changeRep("pirates",-1);clampMood("morale",7);result="A Fekete Nap visszavonult. A legénység napok óta először ünnepel.";}else{colony.stability=Math.max(0,colony.stability-20);clampMood("tension",14);result="A blöfföt felismerték. A megtorló csapás -20 stabilitást okozott.";}}
    pushEmpireEvent({icon:"☀",title:"KALÓZRELÉ LEZÁRVA",kind:choice==="refuse"||result.includes("-20")?"bad":"good",colony:colony.planet.name,text:result});addCaptainLog("DÖNTÉS A FEKETE NAP ÁRNYÉKÁBAN",result);state.pendingIncident=null;saveData();updateHud();renderBridge();
  };
  const runEmpireEvent=()=>{
    if(!state.colonies.length)return;
    state.scansSinceEvent=(state.scansSinceEvent||0)+1;if(state.scansSinceEvent<3||Math.random()>.42)return;
    state.scansSinceEvent=0;const colony=pick(state.colonies),def=buildingDefs[colony.building]||buildingDefs.mine,roll=Math.random(),raidChance=state.factions.pirates<=-10?.32:.2;
    if(roll<raidChance){if(!state.pendingIncident&&Math.random()<.55){createPirateIncident(colony);addTransmission("pirates","VÉDELMI ADÓ",colony.planet,"Fizessetek, utasítsatok el minket, vagy próbáljatok fenyegetőzni. Mindhárom döntést szeretjük.");}else{const protectedBy=colony.building==="defense",damage=protectedBy?4:15;colony.stability=Math.max(0,colony.stability-damage);const key="metal",loss=protectedBy?0:Math.min(state.inventory[key],3+(colony.level||1));state.inventory[key]-=loss;addTransmission("pirates","KALÓZTÁMADÁS",colony.planet,protectedBy?"A falaitok erősek. A következő ár magasabb lesz.":"Most már tudjátok, hogy figyelünk.");pushEmpireEvent({icon:"⚠️",title:"KALÓZTÁMADÁS",kind:"bad",colony:colony.planet.name,text:protectedBy?"A Védelmi Háló visszaverte a támadást, a kár minimális.":`A kolónia megsérült. -${damage} stabilitás, -${loss} fém.`});}}
    else if(roll<.38&&colony.building==="trade"){const coins=30+colony.level*15;currentPlayer.coins+=coins;colony.stability=Math.min(100,colony.stability+5);pushEmpireEvent({icon:"✦",title:"KERESKEDELMI BOOM",kind:"good",colony:colony.planet.name,text:`A kikötő forgalma rekordot döntött. +${coins} érme.`});}
    else if(roll<.55&&colony.building==="relic"){const relics=1+Math.floor(colony.level/3);addInventory("alienRelics",relics);pushEmpireEvent({icon:"🏛️",title:"ŐSI RELIKVIA",kind:"good",colony:colony.planet.name,text:`Az ásatás idegen technológiát talált. +${relics} relikvia.`});}
    else if(roll<.7&&colony.building==="biodome"){const samples=4+colony.level*2;addInventory("bioSamples",samples);colony.stability=Math.max(0,colony.stability-7);pushEmpireEvent({icon:"🧬",title:"BIOKITÖRÉS",kind:"bad",colony:colony.planet.name,text:`Extra minták érkeztek, de a kolónia kockázata nőtt. +${samples} biominta, -7 stabilitás.`});}
    else if(roll<.84&&["glitch","phantom"].includes(colony.planet.type)){colony.skipProduction=1;colony.stability=Math.max(0,colony.stability-10);pushEmpireEvent({icon:"🕳️",title:"VOID KORRUPCIÓ",kind:"bad",colony:colony.planet.name,text:"A kolónia egy szkennelésre elvesztette a termelését. -10 stabilitás."});}
    else if(roll<.94){colony.stability=Math.max(0,colony.stability-8);pushEmpireEvent({icon:"⛏️",title:"BÁNYABALESET",kind:"bad",colony:colony.planet.name,text:"Egy ipari baleset leállást okozott. -8 stabilitás."});}
    else{colony.stability=Math.min(100,colony.stability+10);colony.population+=75*colony.level;pushEmpireEvent({icon:"🎉",title:"KOLÓNIAFESZTIVÁL",kind:"good",colony:colony.planet.name,text:"+10 stabilitás és új telepesek érkeztek."});}
  };
  const runColonyProduction=()=>{
    const income=colonyIncome();state.colonies.forEach(c=>{c.cycles=(c.cycles||0)+1;if(c.skipProduction>0)c.skipProduction--;const growthBoost=c.policy==="growth"?1.35:c.policy==="fortress"?.82:1,growth=c.stability<=0?0:Math.max(3,Math.round((c.planet.habitability||30)*(c.level||1)*(c.stability/100)*growthBoost));c.population+=growth;const culture=cultureDefs[c.culture]||cultureDefs.mining;if(culture.risk>0&&Math.random()<culture.risk/520){c.stability=Math.max(0,c.stability-5);clampMood("tension",2);if(c.culture==="cult"){state.consequence.patterns.unshift({planet:c.planet.name,signal:c.planet.colonyRumor||"colony pattern",date:new Date().toISOString()});state.consequence.patterns.length=Math.min(8,state.consequence.patterns.length);refreshCodex();}if(c.culture==="research")state.research.points+=1;}if(c.culture==="military"&&c.stability<80)c.stability=Math.min(100,c.stability+2);});
    Object.entries(income).forEach(([k,v])=>{addInventory(k,v);if(k!=="coins")state.missions.produced[k]=(state.missions.produced[k]||0)+v;});
    if(state.factions.miners>=10&&state.colonies.length){addInventory("metal",1);state.missions.produced.metal=(state.missions.produced.metal||0)+1;}
    if(state.market.owned.includes("autoBroker"))addInventory("coins",2);
    if(empireLevel()>=6){addInventory("starDust",1);addInventory("coins",3);state.missions.produced.starDust=(state.missions.produced.starDust||0)+1;}
    runEmpireEvent();return income;
  };
  const raritySound=p=>{
    const sounds={
      epic:[[392,.08,"square",.025],[523,.1,"triangle",.03,.08],[784,.18,"triangle",.035,.17]],
      legendary:[[440,.07,"square",.03],[660,.09,"square",.03,.07],[880,.1,"triangle",.035,.15],[1320,.22,"sine",.03,.24]],
      mythic:[[330,.1,"sine",.025],[660,.12,"triangle",.035,.08],[990,.14,"triangle",.035,.18],[1480,.28,"sine",.035,.3]],
      glitched:[[190,.05,"sawtooth",.025],[850,.05,"square",.025,.06],[270,.06,"sawtooth",.03,.12],[1280,.18,"square",.025,.2]],
      cosmic:[[523,.1,"sine",.03],[784,.12,"triangle",.035,.1],[1047,.14,"triangle",.035,.2],[1568,.3,"sine",.04,.33]]
    };
    (sounds[p.rarity]||(["rare"].includes(p.rarity)?[[520,.07,"triangle",.025],[760,.12,"triangle",.025,.08]]:[])).forEach(args=>tone(...args));
  };
  const legacyPlanetArt=(p,small=false)=>{
    const h=hash(p.id),x=18+h%55,y=22+(h>>4)%48,moonCount=Math.max(0,Math.min(12,Number(p.moons)||0));
    const scale=Math.min(1.22,Math.max(.66,.76+(p.sizeScale||1)*.12));
    const p1=p.colors?.[0]||"#7df9ff",p2=p.colors?.[1]||"#b47cff",rare=p.rarityColor||"#7df9ff";
    const moonHtml=Array.from({length:moonCount},(_,i)=>{
      const angle=(h*(i+3)*17+i*360/Math.max(1,moonCount))%360,orbit=(small?48:104)+i*(small?7:12)+(h>>i&7),size=(small?6:10)+(h>>(i+2)&5);
      return `<i class="sf-moon" style="--a:${angle}deg;--r:${orbit}px;--m:${size}px;--delay:${-i*.42}s"><b>${i+1}</b></i>`;
    }).join("");
    const markers=[p.life!=="Nincs"?"life":"",p.danger>70?"danger":"",p.event?"event":"",p.deepScanned?"deep":"",p.colonizable?"colony":""].filter(Boolean).map((m,i)=>`<em class="sf-marker ${m}" style="--mx:${16+(h>>(i+1))%68}%;--my:${18+(h>>(i+4))%62}%"></em>`).join("");
    const caption=`${p.typeName||"Világ"} • ${moonCount} hold${p.rings?" • gyűrű":""}`;
    return `<div class="sf-planet-wrap ${small?"small":""} planet-${p.type}" tabindex="0" role="img" aria-label="${esc(p.name)}: ${esc(caption)}" style="--planet-scale:${scale};--p1:${p1};--p2:${p2};--rare:${rare};--spot-x:${x}%;--spot-y:${y}%;--danger:${p.danger||0};--moon-count:${moonCount}"><div class="sf-orbit ${moonCount?"":"empty"}">${moonHtml}</div>${p.rings?`<div class="sf-ring-system"><span></span><span></span></div>`:""}<div class="sf-planet type-${p.type} ${p.rings?"ringed":""} rarity-${p.rarity}"><span class="sf-surface"></span><span class="sf-clouds"></span><span class="sf-detail"></span><span class="sf-night"></span>${markers}</div><div class="sf-planet-caption"><b>${esc(p.typeName||"ISMERETLEN")}</b><small>${moonCount} HOLD${p.rings?" • GYŰRŰS":""}</small></div></div>`;
  };
  const allRenderablePlanets=()=>[
    current,...state.atlas,...state.colonies.map(c=>c.planet),
    ...Object.values(state.rivals||{}).flatMap(r=>r.planets||[])
  ].filter(Boolean);
  const paintPlanetCanvases=()=>{
    const planets=new Map(allRenderablePlanets().map(p=>[String(p.id),p]));
    $$(".sf-procedural-planet").forEach(canvas=>{
      const p=planets.get(canvas.dataset.planetId);
      if(p)renderStarfarerPlanet(canvas,p);
    });
  };
  const planetArt=(p,small=false)=>{
    sfMigratePlanetVisuals(p);
    const moonCount=Math.max(0,Math.min(12,Number(p.moons)||0));
    const caption=`${p.typeName||"World"} / ${p.subtype} / ${moonCount} moons${p.rings?" / ringed":""}`;
    return `<figure class="sf-planet-wrap ${small?"small":""} planet-${p.type}" tabindex="0" role="img" aria-label="${esc(p.name)}: ${esc(caption)}" style="--rare:${p.rarityColor||"#7df9ff"}"><canvas class="sf-procedural-planet" width="320" height="320" data-planet-id="${esc(String(p.id))}" aria-hidden="true"></canvas><figcaption class="sf-planet-caption"><b>${esc(p.subtype||p.typeName||"UNKNOWN")}</b><small>${moonCount} MOON${moonCount===1?"":"S"}${p.rings?" / RINGED":""}</small></figcaption></figure>`;
  };
  const cargoTotal=()=>Object.values(state.inventory).reduce((n,v)=>n+v,0);
  const topbar=()=>`<header class="sf-topbar"><div><small>STARSHIP // GSA-01</small><b>${sector().icon} ${sector().name}</b></div><div class="sf-counters"><span>⛽ <b>${state.fuel}/${maxFuel()}</b></span><span>▣ <b>${cargoTotal()}</b></span><span>🪐 <b>${state.atlas.length}</b></span><span>● <b>${currentPlayer.coins}</b></span></div></header>`;
  const nav=()=>`<nav class="sf-tabs">${[["bridge","⌁","HÍD"],["atlas","▦","ATLASZ"],["codex","◫","KÓDEX"],["ship","△","HAJÓ"],["cargo","▣","RAKTÁR"],["market","◆","PIAC"],["empire","✦","BIRODALOM"],["missions","◎","KÜLDETÉS"]].map(([id,icon,label])=>`<button data-sf-view="${id}" class="${view===id?"active":""}"><span>${icon}</span>${label}</button>`).join("")}</nav>`;
  const bindNav=()=>$$("[data-sf-view]").forEach(b=>b.onclick=()=>{view=b.dataset.sfView;render();});
  const empireEventHtml=()=>state.lastEmpireEvent?`<aside class="sf-empire-event ${state.lastEmpireEvent.kind}"><span>${state.lastEmpireEvent.icon}</span><div><small>EMPIRE EVENT // ${state.lastEmpireEvent.colony}</small><b>${state.lastEmpireEvent.title}</b><p>${state.lastEmpireEvent.text}</p></div><button data-dismiss-empire-event aria-label="Bezárás">×</button></aside>`:"";
  const incidentHtml=()=>state.pendingIncident?`<section class="sf-live-incident"><header><span>${state.pendingIncident.icon}</span><div><small>${state.pendingIncident.channel}</small><b>${state.pendingIncident.title} // ${state.colonies.find(c=>c.id===state.pendingIncident.colonyId)?.planet.name||"ISMERETLEN KOLÓNIA"}</b></div></header><blockquote>${state.pendingIncident.text}</blockquote><div><button data-incident-choice="pay">FIZETÉS • 20 ▣</button><button data-incident-choice="refuse">ELUTASÍTÁS</button><button data-incident-choice="threaten">FENYEGETÉS</button></div></section>`:"";
  const livingPanelHtml=()=>{
    const log=state.living.logs[0],crew=crewLine(current);
    return `<section class="sf-living-panel"><div class="sf-mood-strip"><span>MORÁL <b>${Math.round(state.living.morale)}</b><i><u style="width:${state.living.morale}%"></u></i></span><span>FESZÜLTSÉG <b>${Math.round(state.living.tension)}</b><i><u style="width:${state.living.tension}%"></u></i></span><span>AI BIZALOM <b>${Math.round(state.living.trust)}</b><i><u style="width:${state.living.trust}%"></u></i></span></div><article class="sf-mira-line"><span>M9</span><div><small>MIRA-9 STATE // ${state.miraState}</small><p>„${miraComment(current)}”</p></div></article><article class="sf-crew-line"><small>${crew[0]}</small><p>„${crew[1]}”</p></article>${log?`<article class="sf-log-preview"><small>HAJÓNAPLÓ // ${String(log.scan).padStart(3,"0")} // ${log.voice}</small><b>${log.title}</b><p>${log.text}</p></article>`:""}<div class="sf-radio-chatter"><b>● RADIO CHATTER</b><span>${state.living.chatter||"…helyi relé keresése… csatorna nyitva…"}</span></div></section>`;
  };
  const bindEmpireEvent=()=>{const b=$("[data-dismiss-empire-event]");if(b)b.onclick=()=>{state.lastEmpireEvent=null;saveData();render();};};
  const planetEnvironmentHtml=p=>{
    const e=sfPlanetEnvironment(p),rows=[["TEMP","🌡",e.temperature],["WATER","◒",e.water],["ATMOS","◎",e.atmosphere],["STORMS","ϟ",e.storminess],["TECTONIC","⌁",e.tectonic],["RADIATION","☢",e.radiation],["LIFE","🧬",e.life],["VEGETATION","♧",e.vegetation]];
    return `<section class="sf-environment"><header><div><small>PROCEDURAL SURVEY PROFILE</small><b>${esc(p.typeName)} / ${esc(p.subtype||sfPlanetArchetype(p))}</b></div><span>SEED ${p.seed}</span></header><div class="sf-environment-grid">${rows.map(([label,icon,value])=>`<label><span>${icon} ${label}</span><i><u style="width:${value}%"></u></i><b>${value}</b></label>`).join("")}</div><footer><span>${p.rings?"◉ RING SYSTEM":"○ NO RINGS"}</span><span>☾ ${Number(p.moons)||0} MOONS</span><span>${String(p.visualType||"rocky").toUpperCase()}</span></footer></section>`;
  };
  const renderBridge=()=>{
    const s=sector();
    const revealClass=current?`sf-reveal-${current.rarity} ${["epic","legendary","mythic","glitched","cosmic"].includes(current.rarity)?"sf-shake":""}`:"";
    const radarLabel=scanPhase==="signal"?"SIGNAL FOUND":scanPhase==="sweeping"?"SEARCHING SECTOR...":"SECTOR READY";
    const radarSub=scanPhase==="signal"?"Ismeretlen égitest pályája rögzítve.":scanPhase==="sweeping"?"Frekvenciák elemzése • mélyradar aktív":s.desc;
    setStage(`<div class="starfarer ${revealClass}" style="${current?`--rare:${current.rarityColor}`:""}">${topbar()}${nav()}${empireEventHtml()}${incidentHtml()}<main class="sf-bridge">
      <section class="sf-space"><div class="sf-stars"></div>${current?`<div class="sf-reveal-burst"></div>${planetArt(current)}`:`<div class="sf-radar phase-${scanPhase}"><i></i><b>${radarLabel}</b><small>${radarSub}</small>${scanPhase==="signal"?'<em>◈ CONTACT LOCKED ◈</em>':`<button type="button" class="sf-radar-launch" data-sf-quick-scan ${!state.fuel||scanning||state.pendingIncident?"disabled":""}>${state.fuel?"SZKENNELÉS INDÍTÁSA":"NINCS ÜZEMANYAG"}</button>`}</div>`}</section>
      <aside class="sf-console">${current?planetCard(current):`<p class="eyebrow">NAVIGÁCIÓ</p><h3>VÁLASSZ SZEKTORT</h3>${starfarerStatusReport()}${nextGoalHtml()}${bridgePanelHtml()}<div class="sf-sector-list">${sectors.map(x=>`<button data-sector="${x.id}" class="${x.id===state.sector?"active":""}" ${x.level>maxSector()?"disabled":""} style="--sector:${x.color}"><span>${x.icon}</span><div><b>${x.name}</b><small>${x.level>maxSector()?`ENGINE ${x.level} SZÜKSÉGES`:x.desc}</small></div></button>`).join("")}</div><button id="sf-scan" class="pixel-btn primary sf-scan" ${!state.fuel||scanning||state.pendingIncident?"disabled":""}>${state.fuel?"RADAR SCAN • 1 ⛽":"NINCS ÜZEMANYAG"}</button>${state.fuel?`<small class="sf-hint">Scanner szint ${state.upgrades.scanner} • ritkább jel esélye nő</small>`:`<button id="sf-refuel" class="pixel-btn secondary">EXPEDÍCIÓ FELTÖLTÉSE • ${20+maxFuel()*3} ●</button>`}${livingPanelHtml()}</aside>`}
      </aside></main></div>`);
    if(current)$(".sf-reveal dl")?.insertAdjacentHTML("afterend",planetEnvironmentHtml(current));
    paintPlanetCanvases();
    bindNav();
    bindEmpireEvent();
    $$("[data-incident-choice]").forEach(b=>b.onclick=()=>resolveIncident(b.dataset.incidentChoice));$$("[data-bridge-choice]").forEach(b=>b.onclick=()=>resolveBridgeChoice(b.dataset.bridgeChoice));
    $$("[data-sector]").forEach(b=>b.onclick=()=>{state.sector=b.dataset.sector;saveData();renderBridge();});
    if($("#sf-scan"))$("#sf-scan").onclick=scan;
    if($("[data-sf-quick-scan]"))$("[data-sf-quick-scan]").onclick=scan;
    if($("#sf-refuel"))$("#sf-refuel").onclick=refuel;
    bindActions();
  };
  const deepScanCost=()=>Math.max(0,(state.factions.survey>=10?0:1)-researchBonus("voidPattern",1));
  const factionInterestHtml=p=>{const f=factionDefs[p.factionId];return `<section class="sf-faction-interest" style="--faction:${f.color}"><header><span>${f.icon}</span><div><small>FRAKCIÓÉRDEK</small><b>${f.short}</b></div></header><p>${p.factionInterest}</p>${p.factionResolved?`<em>KAPCSOLAT RÖGZÍTVE • ${p.factionResolved==="cooperate"?"+2":"-1"} REPUTÁCIÓ</em>`:`<div><button data-faction-choice="cooperate">EGYÜTTMŰKÖDÉS • +2 REP</button><button data-faction-choice="reject">ELUTASÍTÁS • -1 REP</button></div>`}</section>`;};
  const planetLoreHtml=p=>`${memorablePlanetText(p)}${factionInterestHtml(p)}${planetMemory(p)?`<section class="sf-world-memory"><small>VISSZATÉRÉSI JELENTÉS // A VILÁG EMLÉKSZIK</small><p>${planetMemory(p)}</p></section>`:""}<section class="sf-planet-lore ${p.deepScanned?"unlocked":"locked"}"><header><span>◫</span><div><small>DEEP SCAN REPORT</small><b>${p.deepScanned?"ARCHÍVUM FELOLDVA":"LORE LOCKED"}</b></div></header><p>${p.summary}</p>${p.deepScanned?`<article><h4>MÉLYSZKENNELÉSI JELENTÉS</h4><p>${p.deepScan}</p></article><article><h4>EREDETELMÉLET</h4><p>${p.originTheory}</p></article><article><h4>TUDOMÁNYOS MEGJEGYZÉS</h4><p>${p.scientificNote}</p></article><article class="anomaly"><h4>ANOMÁLIA</h4><p>${p.anomalyText}</p></article>`:`<div class="sf-lore-lock">A geológiai történet és az anomáliaadatok titkosítva vannak.<button data-sf-action="deep-scan">MÉLYSZKENNELÉS • ${deepScanCost()} ✦</button></div>`}</section>`;
  const planetCard=p=>`<div class="sf-reveal rarity-${p.rarity}" style="--rare:${p.rarityColor}">${p.isNew?'<div class="sf-new-entry">+ NEW ATLAS ENTRY</div>':""}<p class="eyebrow">SCAN COMPLETE // ${p.sectorName}</p><h2>${p.name}</h2><div class="sf-rarity">${p.rarityName}</div>${colonyFor(p.id)?'<div class="sf-colony-tag">✦ BIRODALMI VILÁG</div>':""}<article class="sf-mira-line sf-mira-planet"><span>M9</span><div><small>MIRA-9 STATE // ${state.miraState}</small><p>„${miraComment(p)}”</p></div></article><dl><div><dt>TÍPUS</dt><dd>${p.typeName}</dd></div><div><dt>SZEKTOR</dt><dd>${p.sectorName}</dd></div><div><dt>MÉRET</dt><dd>${p.size||"Közepes"}</dd></div><div><dt>GRAVITÁCIÓ</dt><dd>${p.gravity||"Ismeretlen"} ${p.gravityG?`• ${p.gravityG}G`:""}</dd></div><div><dt>ÉLET</dt><dd>${p.life}</dd></div><div><dt>VESZÉLY</dt><dd>${p.danger}% • ${dangerTier(p).label}</dd></div><div><dt>LAKHATÓSÁG</dt><dd>${p.habitability??20}% ${p.colonizable?"• ALKALMAS":"• NEM ALKALMAS"}</dd></div><div><dt>HŐMÉRSÉKLET</dt><dd>${p.temp}°C</dd></div></dl><div class="sf-resources"><small>ÉSZLELT NYERSANYAGOK</small><p>${(p.resources||[p.resource||"Ismeretlen"]).map(x=>`<span>◈ ${x}</span>`).join("")}</p></div>${planetLoreHtml(p)}${p.event?`<div class="sf-event"><span>${p.event[0]}</span><p><b>ESEMÉNY</b>${p.event[1]}</p></div>`:""}<div class="sf-reward">ADATÉRTÉK <b>${p.value} ●</b> <span>+${Math.round(p.value/3)} XP</span></div><div class="sf-actions"><button data-sf-action="land">LESZÁLLÁS</button><button data-sf-action="analyze">ELEMZÉS</button><button data-sf-action="favorite">${state.favorites.includes(p.id)?"★ KEDVENC":"☆ KEDVENC"}</button><button data-sf-action="sell">ADAT ELADÁSA</button></div>${p.colonizable&&!colonyFor(p.id)?`<button data-sf-action="colonize" class="pixel-btn secondary sf-colonize">KOLONIZÁLÁS • 50 ▣ + 10 ◇</button>`:""}<button id="sf-next" class="pixel-btn primary">KÖVETKEZŐ SZKENNELÉS</button></div>`;
  const scan=()=>{
    if(scanning||state.fuel<1||state.pendingIncident)return;
    scanTimers.forEach(clearTimeout);scanTimers=[];scanning=true;scanPhase="sweeping";state.fuel--;current=null;renderBridge();sfx("boost");
    scanTimers.push(setTimeout(()=>{scanPhase="signal";renderBridge();tone(760,.08,"square",.025);tone(1040,.12,"square",.022,.09);},900));
    scanTimers.push(setTimeout(()=>{
      current=makePlanet();scanning=false;scanPhase="reveal";state.totalScans=(state.totalScans||0)+1;if(current.sector==="void")state.missions.voidScans=(state.missions.voidScans||0)+1;state.bestValue=Math.max(state.bestValue||0,current.value);
      state.atlas.unshift(current);if(state.atlas.length>500)state.atlas.length=500;applyPlanetConsequences(current);if(["legendary","mythic","glitched","cosmic"].includes(current.rarity)){pushGalacticNews(current.life!=="Nincs"?"🧬":"🪐",`${current.rarityName} FELFEDEZÉS`,planetNewsText(current));addTransmission(current.factionId,"RITKA FELFEDEZÉS",current);}else if(Math.random()<.28)addTransmission(current.factionId,"ÚJ JEL",current);refreshCodex();runColonyProduction();
      const lowFuel=state.fuel<=2,voidWorld=current.sector==="void"||["glitch","phantom"].includes(current.type);clampMood("tension",Math.round(current.danger/24)+(voidWorld?5:0));clampMood("morale",current.life!=="Nincs"?2:lowFuel?-2:0);if(voidWorld)clampMood("trust",-1);else clampMood("tension",-2);updateChatter(current);
      const observation=voidWorld?"A rádió a hajó nevét ismételte egy még meg sem nyitott csatornán.":current.life!=="Nincs"?`A tudományos tiszt ${current.life.toLowerCase()} életjeleket erősített meg. MIRA-9 már a minták kereskedelmi értékét számolja.`:current.danger>70?"A legénység kérte, hogy tartsunk nagyobb távolságot. A pálya mégis stabil. Egyelőre.":"A felmérés rendben lezárult. A csendes világokkal az a baj, hogy idővel elkezdesz válaszra várni.";
      addCaptainLog(`${current.name} // ${current.rarityName}`,`${lowFuel?"Alacsony üzemanyaggal léptünk a szektorba. ":""}${observation}`);
      const baseCoins=Math.max(4,Math.round(current.value*.12)),xp=Math.max(6,Math.round(current.value/3));
      reward(baseCoins,xp,{result:["legendary","mythic","glitched","cosmic"].includes(current.rarity)?"win":"played",score:current.value});
      renderBridge();raritySound(current);
    },1550));
  };
  const refuel=()=>{
    const cost=20+maxFuel()*3;if(currentPlayer.coins<cost)return toast("NINCS ELÉG ÉRMÉD!");
    currentPlayer.coins-=cost;state.fuel=maxFuel();saveData();updateHud();sfx("save");renderBridge();
  };
  const bindActions=()=>{
    if($("#sf-next"))$("#sf-next").onclick=()=>{current=null;renderBridge();};
    $$("[data-sf-action]").forEach(b=>b.onclick=()=>act(b.dataset.sfAction));
    $$("[data-faction-choice]").forEach(b=>b.onclick=()=>respondFaction(current,b.dataset.factionChoice,renderBridge));
  };
  const respondFaction=(p,choice,rerender)=>{if(!p||p.factionResolved)return;const id=p.factionId,good=choice==="cooperate",repGain=good?(state.market.owned.includes("signalDecoder")?3:2):-1;p.factionResolved=choice;changeRep(id,repGain);if(good){if(id==="miners")addInventory("metal",4);if(id==="relic")addInventory("starDust",2);if(id==="void")addInventory("darkMatter",1);if(id==="survey")currentPlayer.xp+=6;if(id==="pirates")currentPlayer.coins+=20;if(id==="choir")addInventory("starDust",1);}addTransmission(id,good?"EGYÜTTMŰKÖDÉS":"ELUTASÍTÁS",p,good?`A ${factionDefs[id].short} elfogadta az együttműködést. A kapcsolat erősödött.`:`A ${factionDefs[id].short} tudomásul vette az elutasítást.`);saveData();sfx(good?"save":"lose");toast(`${factionDefs[id].short.toUpperCase()} • ${repGain>=0?"+":""}${repGain} REPUTÁCIÓ`);rerender();};
  const deepScanPlanet=p=>{if(p.deepScanned)return true;const cost=deepScanCost();if(state.inventory.starDust<cost){toast(`KELL: ${cost} CSILLAGPOR`);return false;}state.inventory.starDust-=cost;p.deepScanned=true;state.research.points+=1;p.interactions=(p.interactions||0)+1;const saved=state.atlas.find(x=>x.id===p.id);if(saved){saved.deepScanned=true;saved.interactions=p.interactions;}if(p.factionId==="survey")changeRep("survey",1);if(p.sector==="void"&&state.factions.void>=10)addInventory("darkMatter",1);clampMood("tension",p.danger>70?4:1);addCaptainLog(`MÉLYSZKENNELÉS // ${p.name}`,`${p.anomalyText} MIRA-9 szerint az adat konzisztens. A tudományos tiszt szerint ettől csak rosszabb.`,"TUDOMÁNYOS NAPLÓ");addTransmission(p.factionId,"MÉLYSZKENNELÉS",p);saveData();sfx("win");toast("MÉLYSZKENNELÉSI ARCHÍVUM FELOLDVA");return true;};
  const act=action=>{
    if(!current)return;
    if(action==="deep-scan"){if(deepScanPlanet(current))renderBridge();return;}
    if(action==="favorite"){const i=state.favorites.indexOf(current.id);if(i>=0)state.favorites.splice(i,1);else state.favorites.unshift(current.id);saveData();renderBridge();return;}
    if(action==="colonize"){
      if(!current.colonizable)return toast("EZ A VILÁG NEM KOLONIZÁLHATÓ");
      if(state.colonies.length>=colonyLimit())return toast(`KOLÓNIALIMIT: ${colonyLimit()} • FEJLESZD A BIRODALMAT`);
      if(state.inventory.metal<50||state.inventory.crystal<10)return toast("KELL: 50 FÉM + 10 KRISTÁLY");
      let recommended=["ocean","jungle","living","paradise"].includes(current.type)?"biodome":["ice","gas","storm"].includes(current.type)?"refinery":["grave","machine","glitch","phantom"].includes(current.type)?"relic":"mine";if((buildingUnlock[recommended]||0)>empireLevel())recommended="mine";
      state.inventory.metal-=50;state.inventory.crystal-=10;const culture=cultureForPlanet(current);state.colonies.push({id:`colony_${Date.now()}`,planet:{...current,isNew:false},building:recommended,culture,level:1,stability:100,population:120,skipProduction:0,created:new Date().toISOString()});
      clampMood("morale",8);clampMood("tension",-4);addCaptainLog(`ÚJ ELŐŐRS // ${current.name}`,"Az első telepesmodul elérte a felszínt. A mérnökök ünnepeltek. MIRA-9 kiszámolta az ünneplés oxigénköltségét.");refreshCodex();pushGalacticNews("🏕️","ÚJ KOLÓNIA",`${current.name} felszínén megkezdődött az első állandó telep építése.`);addTransmission(current.factionId,"KOLÓNIA ALAPÍTVA",current);saveData();sfx("win");toast(`ÚJ ELŐŐRS: ${current.name}`);renderBridge();return;
    }
    if(action==="sell"){grant(current.value,0,`CSILLAGADAT ELADVA • +${current.value} ÉRME`);}
    if(action==="analyze"){const gain=Math.max(1,Math.round((2+current.value*.025+state.upgrades.lab*1.5)*(current.life!=="Nincs"&&hasResearch("alienBiology")?1.2:1))),key=current.life!=="Nincs"?"bioSamples":"starDust",relicChance=.24+(state.factions.relic>=10?.12:0)+researchBonus("relicAuth",.1),relicFound=["machine","grave","phantom"].includes(current.type)&&Math.random()<relicChance;addInventory(key,gain);if(relicFound){addInventory("alienRelics",1);addTransmission("relic","RELIKVIA TALÁLAT",current);}grant(0,Math.round(gain*1.4),`ELEMZÉS KÉSZ • ${inventoryLabel(key,gain)}${relicFound?" • 🏛️ +1 RELIKVIA":""}`);}
    if(action==="land"){
      const safe=Math.max(8,82-current.danger+state.upgrades.shield*11),success=Math.random()*100<safe;
      if(success){const loot=landingLoot(current);Object.entries(loot).forEach(([k,v])=>addInventory(k,v));const total=Object.values(loot).reduce((n,v)=>n+v,0);grant(Math.round(total*.7),total,`RAKOMÁNY: ${Object.entries(loot).map(([k,v])=>inventoryLabel(k,v)).join(" • ")}`);}
      else{state.fuel=Math.max(0,state.fuel-1);grant(0,3,"VIHAR SÉRÜLÉS • -1 ÜZEMANYAG");sfx("lose");}
    }
    current.interactions=(current.interactions||0)+1;const remembered=state.atlas.find(p=>p.id===current.id);if(remembered)remembered.interactions=current.interactions;
    current=null;saveData();renderBridge();
  };
  const renderAtlas=()=>{
    const list=[...state.atlas].sort((a,b)=>(state.favorites.includes(b.id)-state.favorites.includes(a.id))||b.value-a.value);
    const focus=atlasFocus&&state.atlas.find(p=>p.id===atlasFocus);
    if(focus)setStage(`<div class="starfarer">${topbar()}${nav()}<main class="sf-atlas-dossier" style="--rare:${focus.rarityColor}"><button id="sf-atlas-back">← ATLASZ</button><section class="sf-dossier-hero">${planetArt(focus)}<div><small>${focus.rarityName} • ${focus.sectorName}</small><h2>${focus.name}</h2><p>${focus.summary}</p><div class="sf-dossier-tags"><span>${focus.typeName}</span><span>${focus.size}</span><span>${focus.gravity}</span><span>${focus.life}</span></div></div></section>${planetLoreHtml(focus)}${!focus.deepScanned?`<button id="sf-atlas-deep" class="pixel-btn secondary">MÉLYSZKENNELÉS • ${deepScanCost()} ✦</button>`:""}</main></div>`);
    else setStage(`<div class="starfarer">${topbar()}${nav()}<main class="sf-atlas"><header><div><p class="eyebrow">SZEMÉLYES CSILLAGKÓDEX</p><h2>${state.atlas.length} FELFEDEZETT VILÁG</h2></div><div class="sf-atlas-stats"><span>LEGBECSESEBB <b>${state.bestValue||0} ●</b></span><span>MÉLYSZKENNELT <b>${state.atlas.filter(p=>p.deepScanned).length}</b></span><span>SZKENNELÉSEK <b>${state.totalScans||0}</b></span></div></header><div class="sf-atlas-grid">${list.length?list.map(p=>`<article style="--rare:${p.rarityColor}">${planetArt(p,true)}<div><small>${state.favorites.includes(p.id)?"★ ":""}${p.rarityName}</small><h3>${p.name}</h3><p>${p.typeName} • ${p.sectorName}</p><span>${p.life!=="Nincs"?"🧬 "+p.life:"◌ Élettelen"}</span><em>${p.deepScanned?"◫ MÉLYSZKENNELT":"▧ LORE ZÁROLVA"}</em><b>${p.value} ●</b><button data-atlas-open="${p.id}">MEGNYITÁS</button></div></article>`).join(""):`<div class="sf-empty"><span>🪐</span><h3>AZ ATLASZ MÉG ÜRES</h3><p>Indíts radarszkennelést az első világ felfedezéséhez.</p></div>`}</div></main></div>`);
    if(focus)$(".sf-dossier-hero>div")?.insertAdjacentHTML("beforeend",planetEnvironmentHtml(focus));
    paintPlanetCanvases();
    bindNav();
    $$("[data-atlas-open]").forEach(b=>b.onclick=()=>{atlasFocus=b.dataset.atlasOpen;renderAtlas();});
    if($("#sf-atlas-back"))$("#sf-atlas-back").onclick=()=>{atlasFocus=null;renderAtlas();};
    $$('[data-sf-action="deep-scan"]').forEach(b=>b.onclick=()=>{if(deepScanPlanet(focus))renderAtlas();});
    $$("[data-faction-choice]").forEach(b=>b.onclick=()=>respondFaction(focus,b.dataset.factionChoice,renderAtlas));
    if($("#sf-atlas-deep"))$("#sf-atlas-deep").onclick=()=>{if(deepScanPlanet(focus))renderAtlas();};
  };
  const codexSection=(icon,kicker,title,items,empty)=>`<section class="sf-codex-section"><header><span>${icon}</span><div><small>${kicker}</small><h3>${title}</h3></div></header><div class="sf-codex-grid">${items.length?items.join(""):`<p class="sf-codex-empty">${empty}</p>`}</div></section>`;
  const renderCodex=()=>{
    const discovered=Object.entries(types).filter(([id])=>state.atlas.some(p=>p.type===id));
    const lives=[...new Set(state.atlas.map(p=>p.life).filter(x=>x&&x!=="Nincs"))];
    const dangers=[...state.atlas].sort((a,b)=>b.danger-a.danger).slice(0,5);
    const anomalies=state.atlas.filter(p=>p.deepScanned).slice(0,12);
    const typeItems=discovered.map(([id,t])=>`<article><b>${t.name}</b><small>${state.atlas.filter(p=>p.type===id).length} FELFEDEZÉS • ${t.atmos.join(" / ")}</small><p>${typeLore[id]?.codex||"A planetáris osztály részletes felmérése folyamatban van."}</p><em>GYAKORI ANYAGOK: ${t.resources.join(", ")}</em></article>`);
    const techItems=Object.entries(buildingDefs).map(([id,b])=>`<article class="${buildingUnlocked(id)?"unlocked":"locked"}"><b>${b.icon} ${b.name}</b><small>${buildingUnlocked(id)?"FELOLDVA":`SZINT ${buildingUnlock[id]}`}</small><p>${b.desc}</p></article>`);
    const lifeItems=lives.map(l=>{const p=state.atlas.find(x=>x.life===l);return `<article><b>${l}</b><small>${p.name}</small><p>${p.scientificNote}</p></article>`;});
    const dangerItems=dangers.map(p=>`<article><b>${p.danger}% • ${p.name}</b><small>${p.typeName}</small><p>${p.atmosphere}. ${p.colonizable?"Kockázatos kolonizáció lehetséges.":"Felszíni telepítés nem ajánlott."}</p></article>`);
    const anomalyItems=anomalies.map(p=>`<article class="anomaly"><b>${p.name}</b><small>${p.sectorName}</small><p>${p.anomalyText}</p></article>`);
    const fragments=fragmentDefs.map(f=>{const open=state.codex.fragments.includes(f.id);return `<article class="${open?"unlocked":"locked"}"><span>${open?f.icon:"?"}</span><div><small>${open?"ARCHÍVUM FELOLDVA":"TITKOSÍTOTT TÖREDÉK"}</small><h3>${open?f.title:"••• ••••••• •••"}</h3><p>${open?f.text:"Folytasd a felfedezést és a birodalom építését."}</p></div></article>`;});
    const researchItems=Object.entries(researchDefs).map(([id,r])=>{const open=hasResearch(id),ready=r.req();return `<article class="${open?"unlocked":ready?"ready":"locked"}"><b>${r.icon} ${r.name}</b><small>${open?"ACTIVE":ready?`${r.cost} RP`:"LOCKED"}</small><p>${r.desc}</p><button data-research="${id}" ${open||!ready||state.research.points<r.cost?"disabled":""}>${open?"ACTIVE":ready?"UNLOCK":"LOCKED"}</button></article>`;});
    const news=state.galacticNews.slice(0,5).map(n=>`<article><span>${n.icon}</span><div><b>${n.title}</b><p>${n.text}</p></div></article>`).join("");
    const bonuses={survey:"10 REP: ingyenes mélyszkennelés + scanner bónusz",void:"10 REP: +1 sötét anyag Void mélyszkenneléskor",relic:"10 REP: nagyobb relikviaesély",miners:"10 REP: +1 fém minden termelési ciklusban",pirates:"-10 REP: több rajtaütés • +10 REP: fekete piac",choir:"5 REP: különleges csillagpor-csere"};
    const factionSection=`<section class="sf-codex-section factions"><header><span>◎</span><div><small>DIPLOMATIC NETWORK</small><h3>FRAKCIÓK</h3></div></header><div class="sf-faction-grid">${Object.entries(factionDefs).map(([id,f])=>{const rep=state.factions[id]||0,offer=factionTrades[id],locked=rep<(offer.rep||0);return `<article style="--faction:${f.color}"><header><span>${f.icon}</span><div><b>${f.name}</b><small>REPUTÁCIÓ ${rep>=0?"+":""}${rep}</small></div></header><p>${f.desc}</p><em>${bonuses[id]}</em><button data-faction-trade="${id}" ${locked?"disabled":""}>${locked?`${offer.rep} REP SZÜKSÉGES`:offer.label}</button></article>`;}).join("")}</div></section>`;
    const transmissionSection=`<section class="sf-codex-section transmissions"><header><span>📻</span><div><small>INTERCEPTED SIGNAL ARCHIVE</small><h3>FOGOTT ADÁSOK</h3></div></header><div class="sf-transmission-list">${state.transmissions.length?state.transmissions.slice(0,20).map(t=>{const f=factionDefs[t.faction];return `<article class="${t.read?"":"unread"}" style="--faction:${f.color}"><header><span>${f.icon}</span><div><small>ADÁS // ${f.name}</small><b>${t.trigger}${t.planetName?` • ${t.planetName}`:""}</b></div></header><blockquote>„${t.text}”</blockquote></article>`;}).join(""):'<p class="sf-codex-empty">Még nem fogtunk frakciós adást.</p>'}</div></section>`;
    setStage(`<div class="starfarer">${topbar()}${nav()}<main class="sf-codex"><header><div><p class="eyebrow">IMPERIAL KNOWLEDGE ARCHIVE</p><h2>KÓDEX</h2></div><span>${state.codex.fragments.length}/${fragmentDefs.length} TÖRTÉNET • ${anomalies.length} ANOMÁLIA • ${state.transmissions.filter(t=>!t.read).length} ÚJ ADÁS</span></header>${news?`<section class="sf-galactic-news"><header><b>GUBUNTU GALACTIC NEWSWIRE</b><small>LIVE ARCHIVE</small></header>${news}</section>`:""}<section class="sf-codex-section sf-research"><header><span>RP</span><div><small>CODEX RESEARCH // ${state.research.points} RP</small><h3>KUTATASI BONUSZOK</h3></div></header><div class="sf-codex-grid">${researchItems.join("")}</div></section>${codexSection("🪐","DISCOVERED CLASSIFICATIONS","BOLYGÓTÍPUSOK",typeItems,"Új típusokat szkenneléssel oldhatsz fel.")}${codexSection("⚙️","EMPIRE RESEARCH TREE","BIRODALMI TECHNOLÓGIA",techItems,"Nincs technológiai adat.")}${codexSection("🧬","XENOBIOLOGY RECORDS","FAJOK / ÉLETJELEK",lifeItems,"Még nem észleltünk idegen életet.")}${codexSection("⚠️","HAZARD DATABASE","VESZÉLYEK",dangerItems,"Nincs elég veszélyadat.")}${codexSection("🕳️","DEEP SCAN ONLY","ŰRANOMÁLIÁK",anomalyItems,"Végezz mélyszkennelést az anomáliák feltárásához.")}<section class="sf-codex-section fragments"><header><span>📜</span><div><small>COLLECTIBLE STORY PAGES</small><h3>TÖRTÉNETI TÖREDÉKEK</h3></div></header><div class="sf-fragment-list">${fragments.join("")}</div></section>${factionSection}${transmissionSection}</main></div>`);
    bindNav();
    $$("[data-faction-trade]").forEach(b=>b.onclick=()=>{tradeFaction(b.dataset.factionTrade);renderCodex();});$$("[data-research]").forEach(b=>b.onclick=()=>buyResearch(b.dataset.research));
    if(state.transmissions.some(t=>!t.read)){state.transmissions.forEach(t=>t.read=true);saveData();}
  };
  const renderCargo=()=>{
    const capacity=120+state.upgrades.cargo*80,used=cargoTotal(),pct=Math.min(100,Math.round(used/capacity*100));
    setStage(`<div class="starfarer">${topbar()}${nav()}<main class="sf-cargo"><header><div><p class="eyebrow">GSA-01 // MODULÁRIS RAKTÁR</p><h2>RAKOMÁNYJEGYZÉK</h2></div><div class="sf-capacity"><span>${used}/${capacity} EGYSÉG</span><i><u style="width:${pct}%"></u></i></div></header><section class="sf-cargo-grid">${Object.entries(resourceDefs).map(([id,r])=>`<article style="--resource:${r.color}" title="${r.desc}"><span>${r.icon}</span><div><small>${id.toUpperCase()}</small><h3>${r.name}</h3><b>${state.inventory[id]||0}</b><p>${r.desc}</p></div></article>`).join("")}</section><section class="sf-cargo-help"><div><b>LESZÁLLÁS</b><span>A bolygótípushoz illő nyersanyagokat hoz a raktárba.</span></div><div><b>ELEMZÉS</b><span>Élettel rendelkező világokon biomintát, máshol csillagport ad.</span></div><div><b>KOLÓNIÁK</b><span>Minden új szkennelés után automatikusan termelnek.</span></div></section></main></div>`);
    bindNav();
  };
  const marketAmount=(key,value)=>`${resourceDefs[key]?.icon||"●"} ${value} ${resourceDefs[key]?.name||"ÉRME"}`;
  const marketList=data=>Object.entries(data).map(([key,value])=>marketAmount(key,value)).join(" + ");
  const canPay=cost=>Object.entries(cost).every(([key,value])=>(key==="coins"?currentPlayer.coins:state.inventory[key]||0)>=value);
  const applyMarketValues=(values,direction)=>Object.entries(values).forEach(([key,value])=>{if(key==="coins")currentPlayer.coins=Math.max(0,currentPlayer.coins+value*direction);else state.inventory[key]=Math.max(0,(state.inventory[key]||0)+value*direction);});
  const todaysMarketOffers=()=>{
    const day=Math.floor(Date.now()/86400000),start=(day+state.totalScans)%marketOffers.length;
    return Array.from({length:4},(_,i)=>marketOffers[(start+i*2)%marketOffers.length]);
  };
  const marketAiLine=()=>{updateMiraState();if(state.miraState==="Corrupted")return "Prices are a social fiction. I have improved the fiction.";if(state.miraState==="Sarcastic")return "I found several deals. Some are even legal, which feels unimaginative.";
    const scarce=Object.keys(resourceDefs).sort((a,b)=>(state.inventory[a]||0)-(state.inventory[b]||0))[0],owned=state.market.owned.length;
    if(currentPlayer.coins<40)return `Likviditásod alacsony. A ${resourceDefs[scarce].name.toLowerCase()} készlet helyett először eladási szerződést javaslok.`;
    if(owned>=4)return "A hajód kereskedelmi profilja kivételes. A következő cél egy teljesen automatizált csillagközi ellátási lánc.";
    if(state.inventory.alienRelics>0)return "Relikviát észleltem a raktárban. A nyílt piac jól fizet, de az ilyen tárgyak értéke ritkán csak pénzben mérhető.";
    return `Készletelemzés kész. A legszűkebb erőforrásod: ${resourceDefs[scarce].name}. Az árfolyamokat ehhez igazítottam.`;
  };
  const completeMarketTrade=(cost,gain,label)=>{
    if(!canPay(cost))return toast(`NINCS ELÉG FEDEZET • ${marketList(cost)}`);
    applyMarketValues(cost,-1);applyMarketValues(gain,1);state.market.purchases++;
    state.market.history.unshift({label,detail:`${marketList(cost)} → ${marketList(gain)}`,date:new Date().toISOString()});
    state.market.history.length=Math.min(12,state.market.history.length);saveData();updateHud();sfx("coin");toast(`MIRA-9 • TRANZAKCIÓ JÓVÁHAGYVA`);renderMarket();
  };
  const buyMarketModule=id=>{
    const item=marketModules[id];if(!item||state.market.owned.includes(id))return;
    if(!canPay(item.cost))return toast(`NINCS ELÉG FEDEZET • ${marketList(item.cost)}`);
    applyMarketValues(item.cost,-1);state.market.owned.push(id);state.market.purchases++;
    state.market.history.unshift({label:item.name,detail:`TECHNOLÓGIA AKTIVÁLVA • ${marketList(item.cost)}`,date:new Date().toISOString()});
    state.market.history.length=Math.min(12,state.market.history.length);pushGalacticNews(item.icon,"MIRA-9 TECHNOLÓGIAI ÜGYLET",`${item.name} integrálva a GSA-01 rendszereibe.`);saveData();updateHud();sfx("win");toast(`${item.name} • TELEPÍTVE`);renderMarket();
  };
  const renderMarket=()=>{
    const offers=todaysMarketOffers(),owned=state.market.owned;
    setStage(`<div class="starfarer">${topbar()}${nav()}<main class="sf-market"><header class="sf-market-hero"><div class="sf-ai-core"><i></i><b>M9</b></div><div><p class="eyebrow">NEURAL COMMERCE NETWORK // ONLINE</p><h2>MIRA-9 AI MARKET</h2><blockquote>„${marketAiLine()}”</blockquote></div><aside><small>PIACI BIZALOM</small><b>${Math.min(99,32+state.market.purchases*3)}%</b><span>${state.market.purchases} LEZÁRT ÜGYLET</span></aside></header><section class="sf-market-wallet"><span>● <b>${currentPlayer.coins}</b> ÉRME</span>${Object.entries(resourceDefs).map(([id,r])=>`<span title="${r.name}">${r.icon} <b>${state.inventory[id]}</b></span>`).join("")}</section><section class="sf-market-block"><header><div><small>ROTATING EXCHANGE // 24H</small><h3>MAI AJÁNLATOK</h3></div><span>ÁRFOLYAM ELLENŐRIZVE</span></header><div class="sf-offer-grid">${offers.map(o=>`<article><span>${o.icon}</span><div><small>${o.id.toUpperCase()}</small><h4>${o.name}</h4><p>${o.desc}</p><em>${marketList(o.gain)}</em></div><button data-market-offer="${o.id}" ${canPay(o.cost)?"":"disabled"}><small>ÁR</small>${marketList(o.cost)}</button></article>`).join("")}</div></section><section class="sf-market-block sf-tech-market"><header><div><small>PERMANENT SHIP LICENSES</small><h3>RITKA TECHNOLÓGIÁK</h3></div><span>${owned.length}/${Object.keys(marketModules).length} AKTÍV</span></header><div class="sf-module-grid">${Object.entries(marketModules).map(([id,m])=>{const active=owned.includes(id);return `<article class="${active?"owned":""}"><span>${m.icon}</span><small>${m.tag}</small><h4>${m.name}</h4><p>${m.desc}</p><button data-market-module="${id}" ${active||!canPay(m.cost)?"disabled":""}>${active?"✓ AKTÍV":marketList(m.cost)}</button></article>`;}).join("")}</div></section>${state.market.history.length?`<section class="sf-market-log"><header>LEGUTÓBBI TRANZAKCIÓK</header>${state.market.history.slice(0,5).map(h=>`<article><span>✓</span><div><b>${h.label}</b><small>${h.detail}</small></div><time>${new Date(h.date).toLocaleDateString("hu-HU")}</time></article>`).join("")}</section>`:""}</main></div>`);
    bindNav();
    $$("[data-market-offer]").forEach(b=>b.onclick=()=>{const offer=marketOffers.find(o=>o.id===b.dataset.marketOffer);if(offer)completeMarketTrade(offer.cost,offer.gain,offer.name);});
    $$("[data-market-module]").forEach(b=>b.onclick=()=>buyMarketModule(b.dataset.marketModule));
  };
  const missionDefs=()=>[
    {id:"first-colony",icon:"🏕️",title:"ELSŐ KOLÓNIA",desc:"Alapíts legalább 1 kolóniát.",now:state.colonies.length,goal:1,reward:"100 ● + 40 XP",grant:()=>{currentPlayer.coins+=100;currentPlayer.xp+=40;}},
    {id:"industrial",icon:"▣",title:"IPARI LENDÜLET",desc:"Termelj összesen 50 fémet.",now:state.missions.produced.metal||0,goal:50,reward:"FEJLESZTÉSI KEDVEZMÉNY",grant:()=>state.missions.industrialDiscount=true},
    {id:"biology",icon:"🧬",title:"IDEGEN BIOLÓGIA",desc:"Gyűjts össze 20 biomintát.",now:state.inventory.bioSamples||0,goal:20,reward:"+10 ✦ + LAB BÓNUSZ",grant:()=>{state.inventory.starDust+=10;state.missions.labBonus=true;}},
    {id:"void-run",icon:"🕳️",title:"VOID EXPEDÍCIÓ",desc:"Szkennelj 5 világot a Void Peremen.",now:state.missions.voidScans||0,goal:5,reward:"+12 ◈ SÖTÉT ANYAG",grant:()=>state.inventory.darkMatter+=12},
    {id:"network",icon:"✦",title:"BIRODALMI HÁLÓZAT",desc:"Birtokolj egyszerre 3 kolóniát.",now:state.colonies.length,goal:3,reward:"+1 BIRODALMI SZINT",grant:()=>state.missions.levelBonus=(state.missions.levelBonus||0)+1},
    {id:"ancient",icon:"🏛️",title:"ŐSI KAPCSOLAT",desc:"Találj összesen 3 idegen relikviát.",now:Math.max(state.missions.totalRelics||0,state.inventory.alienRelics||0),goal:3,reward:"ŐSI TECHNOLÓGIA",grant:()=>state.missions.ancientTech=true}
  ];
  const nextGoalHtml=()=>{
    const mission=missionDefs().find(m=>!state.missions.claimed.includes(m.id));
    if(!mission)return `<button class="sf-next-goal complete" data-sf-view="missions"><span>✓</span><div><small>BIRODALMI CÉLOK</small><b>MINDEN KÜLDETÉS TELJESÍTVE</b><em>Nyisd meg a szerződéseket.</em></div></button>`;
    const done=mission.now>=mission.goal;
    return `<button class="sf-next-goal ${done?"ready":""}" data-sf-view="missions"><span>${mission.icon}</span><div><small>${done?"JUTALOM ÁTVEHETŐ":"KÖVETKEZŐ CÉL"} • ${Math.min(mission.now,mission.goal)}/${mission.goal}</small><b>${mission.title}</b><em>${mission.desc} • ${mission.reward}</em></div></button>`;
  };
  const renderMissions=()=>{
    const missions=missionDefs();
    setStage(`<div class="starfarer">${topbar()}${nav()}<main class="sf-missions"><header><div><p class="eyebrow">IMPERIAL CONTRACT NETWORK</p><h2>KÜLDETÉSEK</h2></div><span>${state.missions.claimed.length}/${missions.length} TELJESÍTVE</span></header><section class="sf-mission-grid">${missions.map(m=>{const claimed=state.missions.claimed.includes(m.id),done=m.now>=m.goal,pct=Math.min(100,Math.round(m.now/m.goal*100));return `<article class="${done?"done":""} ${claimed?"claimed":""}"><span>${m.icon}</span><div><small>CONTRACT // ${m.id.toUpperCase()}</small><h3>${m.title}</h3><p>${m.desc}</p><div class="sf-mission-progress"><i><u style="width:${pct}%"></u></i><b>${Math.min(m.now,m.goal)}/${m.goal}</b></div><em>${m.reward}</em></div><button data-mission="${m.id}" ${!done||claimed?"disabled":""}>${claimed?"TELJESÍTVE":"BEVÁLTÁS"}</button></article>`;}).join("")}</section></main></div>`);
    bindNav();
    $$("[data-mission]").forEach(b=>b.onclick=()=>{const mission=missionDefs().find(m=>m.id===b.dataset.mission);if(!mission||mission.now<mission.goal||state.missions.claimed.includes(mission.id))return;mission.grant();state.missions.claimed.push(mission.id);currentPlayer.rank=rankOf(currentPlayer);saveData();updateHud();sfx("win");toast(`KÜLDETÉS TELJESÍTVE: ${mission.title}`);renderMissions();});
  };
  const levelNames=["","ELŐŐRS","TELEP","KOLÓNIA","CSILLAGBÁZIS","FŐVILÁG"];
  const settlementHtml=c=>{const memory=(c.cycles||0)>18?"A telepesek a déli krátert Gubuntu Szemének nevezik. Senki sem emlékszik, ki javasolta.":(c.cycles||0)>8?"Az esti műszak minden ciklusban ugyanazt az ismeretlen fényt látja a horizonton.":c.planet.colonyNote;return `<div class="sf-settlement level-${c.level} ${state.capitalId===c.id?"capital":""}">${state.capitalId===c.id?'<b>♛</b>':""}${Array.from({length:Math.min(7,1+c.level)},(_,i)=>`<i style="--building:${i}"></i>`).join("")}</div><p class="sf-colony-story">${memory}</p>`;};
  const renderEmpire=()=>{
    const income=colonyIncome(),level=empireLevel(),limit=colonyLimit();
    setStage(`<div class="starfarer">${topbar()}${nav()}<main class="sf-empire"><header><div><p class="eyebrow">GALAKTIKUS HÁLÓZAT</p><h2>BIRODALOM • SZINT ${level}</h2></div><div class="sf-empire-summary"><span>KOLÓNIÁK <b>${state.colonies.length}/${limit}</b></span><span>NÉPESSÉG <b>${state.colonies.reduce((n,c)=>n+c.population,0).toLocaleString("hu-HU")}</b></span><span>TERMELÉS / SCAN <b>${Object.entries(income).length?Object.entries(income).map(([k,v])=>`${resourceDefs[k]?.icon||"●"}${v}`).join("  "):"—"}</b></span></div></header><section class="sf-unlock-track">${[[1,"2 KOLÓNIA"],[2,"KERESKEDELMI KIKÖTŐ"],[3,"4 KOLÓNIA + HAJÓGYÁR"],[4,"RELIKVIA-ÁSATÁS"],[5,"FŐVILÁG"],[6,"AUTO-PROBE"]].map(([n,label])=>`<span class="${level>=n?"on":""}"><b>${n}</b><small>${label}</small></span>`).join("")}</section><section class="sf-building-strip">${Object.entries(buildingDefs).map(([id,b])=>`<span class="${buildingUnlocked(id)?"":"locked"}" title="${b.desc}">${b.icon}<small>${b.name}${buildingUnlocked(id)?"":` • LVL ${buildingUnlock[id]}`}</small><em>${b.desc}</em></span>`).join("")}</section>${state.eventLog.length?`<section class="sf-event-log"><header>RECENT EMPIRE LOG</header>${state.eventLog.slice(0,5).map(e=>`<article class="${e.kind}"><span>${e.icon}</span><div><b>${e.title}</b><small>${e.colony}</small><p>${e.text}</p></div></article>`).join("")}</section>`:""}<section class="sf-colony-grid">${state.colonies.length?state.colonies.map(c=>{const p=c.planet,def=buildingDefs[c.building]||buildingDefs.mine,lvl=c.level||1,discount=state.missions.industrialDiscount?.8:1,metalCost=Math.round(35*lvl*discount),crystalCost=Math.round(12*lvl*discount),relicCost=lvl>=3?lvl-2:0,status=c.stability<=0?"stopped":c.stability<40?"unstable":c.stability<70?"warning":"stable",isCapital=state.capitalId===c.id,corrupted=c.skipProduction>0;return `<article class="${status} ${corrupted?"corrupted":""} ${isCapital?"capital":""}" style="--rare:${p.rarityColor}"><div class="sf-colony-world">${planetArt(p,true)}${settlementHtml(c)}<span>${p.habitability||20}% LAKHATÓ</span></div><div class="sf-colony-info"><small>${isCapital?"♛ FŐVILÁG • ":""}${p.sectorName} • ${p.rarityName}</small><h3>${p.name}</h3><p title="${def.desc}">${def.icon} ${def.name}<small>${def.desc}</small></p>${cultureHtml(c)}<div class="sf-colony-level"><b>${levelNames[lvl]}</b><i>${Array.from({length:5},(_,i)=>`<u class="${i<lvl?"on":""}"></u>`).join("")}</i></div><div class="sf-colony-vitals"><span>NÉPESSÉG <b>${Math.round(c.population).toLocaleString("hu-HU")}</b></span><span>STABILITÁS <b>${Math.round(c.stability)}% • ${status.toUpperCase()}</b></span><i><u style="width:${c.stability}%"></u></i></div>${status==="stopped"?'<strong class="sf-unstable">⛔ TERMELÉS LEÁLLT • STABILITÁS 0</strong>':status==="unstable"?'<strong class="sf-unstable">⚠ KOLÓNIA INSTABIL • 50% TERMELÉS</strong>':status==="warning"?'<strong class="sf-warning">▲ STABILITÁSI FIGYELMEZTETÉS • 75% TERMELÉS</strong>':""}<em>TERMELÉS: ${corrupted?`🕳 KORRUPTÁLT • ${c.skipProduction} SCAN`:(Object.entries(def.produces).map(([k,v])=>`${resourceDefs[k]?.icon||"●"} ${v*lvl}`).join(" • "))}</em><div class="sf-colony-actions"><button data-colony-type="${c.id}" title="Váltás a következő feloldott épülettípusra.">ÉPÜLETVÁLTÁS • 20 ▣</button><button data-colony-upgrade="${c.id}" ${lvl>=5?"disabled":""}>${lvl>=5?"MAX SZINT":`FEJLESZTÉS • ${metalCost} ▣ + ${crystalCost} ◇${relicCost?` + ${relicCost} 🏛️`:""}`}</button>${!state.capitalId&&level>=5?`<button class="capital-btn" data-make-capital="${c.id}">♛ FŐVILÁGGÁ TESZEM • 80 ▣ + 30 ◇ + 2 🏛️</button>`:""}</div></div></article>`;}).join(""):`<div class="sf-empty"><span>✦</span><h3>A BIRODALOM MÉG CSAK EGY TERV</h3><p>Találj lakható bolygót, gyűjts 50 fémet és 10 kristályt, majd alapíts előőrsöt.</p></div>`}</section></main></div>`);
    bindNav();
    $(".sf-colony-grid")?.insertAdjacentHTML("beforebegin",strategyPanelHtmlV2(level));
    paintPlanetCanvases();
    $$("[data-colony-upgrade]").forEach(btn=>{const colony=state.colonies.find(c=>c.id===btn.dataset.colonyUpgrade),actions=btn.closest(".sf-colony-actions");if(!colony||!actions)return;const emergency=colony.stability<=0,drone=state.market.owned.includes("stabilizerDrone"),metal=emergency?(drone?22:30):(drone?10:15),crystal=emergency?(drone?7:10):(drone?3:5),policyLabel={growth:"NÖVEKEDÉS",industry:"IPAR",science:"KUTATÁS",fortress:"ERŐD"}[colony.policy||"growth"];actions.insertAdjacentHTML("afterbegin",`<button class="stabilize-btn" data-colony-stabilize="${colony.id}">${emergency?"VÉSZHELYZETI JAVÍTÁS":"STABILIZÁLÁS"} • ${metal} ▣ + ${crystal} ◇</button>`);actions.insertAdjacentHTML("beforeend",`<button class="policy-btn" data-policy="${colony.id}">KOLÓNIA POLITIKA • ${policyLabel}</button><button class="terraform-btn" data-terraform="${colony.id}" ${(empireLevel()<6&&!state.capitalId)||(colony.terraformLevel||0)>=5?"disabled":""}>${(colony.terraformLevel||0)>=5?"TERRAFORM MAX":`TERRAFORM ${colony.terraformLevel||0}/5 • ${empireCostLabel(terraformCost(colony))}`}</button>`);});
    $$("[data-colony-stabilize]").forEach(b=>b.onclick=()=>{const colony=state.colonies.find(c=>c.id===b.dataset.colonyStabilize);if(!colony)return;const emergency=colony.stability<=0,drone=state.market.owned.includes("stabilizerDrone"),metal=emergency?(drone?22:30):(drone?10:15),crystal=emergency?(drone?7:10):(drone?3:5),boost=(emergency?35:18)+researchBonus("colonialLogistics",5);if(state.inventory.metal<metal||state.inventory.crystal<crystal)return toast(`KELL: ${metal} FÉM + ${crystal} KRISTÁLY`);state.inventory.metal-=metal;state.inventory.crystal-=crystal;colony.stability=Math.min(100,colony.stability+boost);pushEmpireEvent({icon:"🛠️",title:emergency?"VÉSZHELYZETI JAVÍTÁS":"STABILIZÁLÁS",kind:"good",colony:colony.planet.name,text:`Mérnöki csapatok helyreállították a kolónia infrastruktúráját. +${boost} stabilitás.`});saveData();sfx("save");renderEmpire();});
    $$("[data-colony-type]").forEach(b=>b.onclick=()=>{const colony=state.colonies.find(c=>c.id===b.dataset.colonyType);if(!colony)return;if(state.inventory.metal<20)return toast("KELL: 20 FÉM");const ids=Object.keys(buildingDefs).filter(buildingUnlocked),next=(ids.indexOf(colony.building)+1)%ids.length;state.inventory.metal-=20;colony.building=ids[next];saveData();sfx("save");renderEmpire();});
    $$("[data-colony-upgrade]").forEach(b=>b.onclick=()=>{const colony=state.colonies.find(c=>c.id===b.dataset.colonyUpgrade);if(!colony)return;const lvl=colony.level||1,discount=state.missions.industrialDiscount?.8:1,metal=Math.round(35*lvl*discount),crystal=Math.round(12*lvl*discount),relic=lvl>=3?lvl-2:0;if(state.inventory.metal<metal||state.inventory.crystal<crystal||state.inventory.alienRelics<relic)return toast(`KELL: ${metal} FÉM + ${crystal} KRISTÁLY${relic?` + ${relic} RELIKVIA`:""}`);state.inventory.metal-=metal;state.inventory.crystal-=crystal;state.inventory.alienRelics-=relic;colony.level=Math.min(5,lvl+1);colony.stability=Math.min(100,colony.stability+8);colony.population+=250*colony.level;saveData();sfx("win");toast(`${colony.planet.name} • ${levelNames[colony.level]}`);renderEmpire();});
    $$("[data-make-capital]").forEach(b=>b.onclick=()=>{if(level<5)return toast("BIRODALMI SZINT 5 SZÜKSÉGES");if(state.inventory.metal<80||state.inventory.crystal<30||state.inventory.alienRelics<2)return toast("KELL: 80 FÉM + 30 KRISTÁLY + 2 RELIKVIA");state.inventory.metal-=80;state.inventory.crystal-=30;state.inventory.alienRelics-=2;state.capitalId=b.dataset.makeCapital;state.title="GALAKTIKUS BIRODALOM";const colony=state.colonies.find(c=>c.id===state.capitalId);if(colony){colony.stability=100;colony.population+=1000;}refreshCodex();saveData();sfx("win");toast(`♛ FŐVILÁG: ${colony?.planet.name||"ISMERETLEN"}`);renderEmpire();});
    $$("[data-doctrine]").forEach(b=>b.onclick=()=>setDoctrine(b.dataset.doctrine));
    $$("[data-policy]").forEach(b=>b.onclick=()=>cyclePolicy(b.dataset.policy));
    $$("[data-rival-act]").forEach(b=>b.onclick=()=>{const [rid,kind]=b.dataset.rivalAct.split(":");rivalAction(rid,kind);});
    $$("[data-terraform]").forEach(b=>b.onclick=()=>terraformColony(b.dataset.terraform));
    $$("[data-conquer]").forEach(b=>b.onclick=()=>{const [rid,pid]=b.dataset.conquer.split(":");conquerWorld(rid,pid);});
  };
  const upgrades=[
    ["scanner","📡","SCANNER","Növeli a ritka bolygók esélyét."],["tank","⛽","FUEL TANK","+3 üzemanyag expedíciónként."],["engine","⚡","ENGINE","Új galaktikus szektorokat nyit meg."],["shield","⬡","SHIELD","Biztonságosabb leszállás veszélyes világokon."],["cargo","▣","CARGO BAY","Több nyersanyag fér a hajóra."],["probe","🛰️","PROBE DRONE","Növeli az expedíciós adatértéket."],["lab","🧬","LAB MODULE","Több kutatási nyersanyagot ad."]
  ];
  const renderShip=()=>{
    setStage(`<div class="starfarer">${topbar()}${nav()}<main class="sf-ship"><section class="sf-ship-visual"><div class="sf-starship"><i></i><b>GSA-01</b></div><p>ENGINE RANGE <b>${maxSector()+1}/6</b></p><div class="sf-range"><i style="width:${(maxSector()+1)/6*100}%"></i></div></section><section class="sf-upgrades"><p class="eyebrow">HAJÓMODULOK</p><h2>EXPEDÍCIÓS FEJLESZTÉSEK</h2>${upgrades.map(([id,icon,name,desc])=>{const lvl=state.upgrades[id],max=id==="engine"?5:8,cost=90+lvl*85+(id==="engine"?lvl*60:0);return `<article><span>${icon}</span><div><b>${name}</b><small>${desc}</small><i>${Array.from({length:max},(_,i)=>`<u class="${i<lvl?"on":""}"></u>`).join("")}</i></div><button data-upgrade="${id}" data-cost="${cost}" ${lvl>=max?"disabled":""}>${lvl>=max?"MAX":cost+" ●"}</button></article>`;}).join("")}</section></main></div>`);
    bindNav();
    $$("[data-upgrade]").forEach(b=>b.onclick=()=>{
      const cost=+b.dataset.cost,id=b.dataset.upgrade;if(currentPlayer.coins<cost)return toast("NINCS ELÉG ÉRMÉD!");
      currentPlayer.coins-=cost;state.upgrades[id]++;if(id==="tank")state.fuel=Math.min(maxFuel(),state.fuel+3);
      saveData();updateHud();sfx("save");toast("HAJÓMODUL FEJLESZTVE");renderShip();
    });
  };
  const render=()=>view==="atlas"?renderAtlas():view==="codex"?renderCodex():view==="ship"?renderShip():view==="cargo"?renderCargo():view==="market"?renderMarket():view==="empire"?renderEmpire():view==="missions"?renderMissions():renderBridge();
  setActiveCleanup(()=>{scanning=false;scanTimers.forEach(clearTimeout);scanTimers=[];});
  render();
}

const CARD_LOUNGE_CONTRACTS=[
  {id:"bj-three",label:"Win three Blackjack hands",key:"blackjackWins",target:3},
  {id:"bj-no-hit",label:"Win a Blackjack hand without taking a hit",key:"blackjackNoHit",target:1},
  {id:"poker-flush",label:"Reach a flush or better in Video Poker",key:"pokerFlush",target:1},
  {id:"positive",label:"Finish a session with positive profit",key:"positiveSession",target:1},
  {id:"double",label:"Double a payout successfully",key:"doubleWin",target:1}
];
function ensureCardLounge(){
  const lounge=currentPlayer.cardLounge||={reputation:0,level:1,tablesUnlocked:["casual"],dailyProfit:0,bestSession:0};
  lounge.reputation=Math.max(0,Number(lounge.reputation)||0);lounge.level=Math.max(1,1+Math.floor(lounge.reputation/100));lounge.tablesUnlocked||=["casual"];lounge.contractProgress||={};lounge.completedContracts||=[];lounge.cosmetics||=[];
  const today=new Date().toISOString().slice(0,10);if(lounge.profitDay!==today){lounge.profitDay=today;lounge.dailyProfit=0;}
  if(lounge.repDay!==today){lounge.repDay=today;lounge.repToday=0;lounge.dailyRepClaims=[];}lounge.repToday=Math.max(0,Number(lounge.repToday)||0);lounge.dailyRepClaims||=[];
  if(lounge.level>=2&&!lounge.tablesUnlocked.includes("neon"))lounge.tablesUnlocked.push("neon");if(lounge.level>=4&&!lounge.tablesUnlocked.includes("vip"))lounge.tablesUnlocked.push("vip");
  const rewards=[[1,"CLASSIC CARD BACK"],[2,"NEON FELT THEME"],[3,"MIRA DEALER PORTRAIT"],[4,"PRISM CHIP DESIGN"],[5,"ROYAL CARD BACK"],[6,"VAULT TABLE THEME"]];
  rewards.filter(([level])=>lounge.level>=level).forEach(([,item])=>{if(!lounge.cosmetics.includes(item))lounge.cosmetics.push(item);});
  return lounge;
}
function cardLoungeDailyRep(key,amount,label){
  const lounge=ensureCardLounge();if(lounge.dailyRepClaims.includes(key)||lounge.repToday>=100)return 0;
  const granted=Math.min(amount,100-lounge.repToday);if(!granted)return 0;lounge.dailyRepClaims.push(key);lounge.repToday+=granted;lounge.reputation+=granted;ensureCardLounge();saveData();toast(`${label} • +${granted} REP`);return granted;
}
function activeCardContract(){
  const day=new Date().toISOString().slice(0,10),index=Math.floor(Date.parse(`${day}T00:00:00Z`)/86400000)%CARD_LOUNGE_CONTRACTS.length;
  return {...CARD_LOUNGE_CONTRACTS[index],day,runId:`${day}:${CARD_LOUNGE_CONTRACTS[index].id}`};
}
function cardLoungeProgress(key,amount=1){
  const lounge=ensureCardLounge(),contract=activeCardContract();if(contract.key!==key||lounge.completedContracts.includes(contract.runId))return;
  lounge.contractProgress[contract.runId]=Math.min(contract.target,(lounge.contractProgress[contract.runId]||0)+amount);
  if(lounge.contractProgress[contract.runId]>=contract.target){lounge.completedContracts.push(contract.runId);cardLoungeDailyRep(`contract:${contract.runId}`,40,"CARD LOUNGE CONTRACT COMPLETE");}saveData();
}
function cardLoungePanel(){
  const lounge=ensureCardLounge(),contract=activeCardContract(),progress=lounge.completedContracts.includes(contract.runId)?contract.target:(lounge.contractProgress[contract.runId]||0),next=100-(lounge.reputation%100);
  return `<section class="lounge-profile"><div><small>CARD LOUNGE PROFILE</small><b>LEVEL ${lounge.level} • ${lounge.reputation} REP</b><span>${next} REP TO NEXT LEVEL • TODAY ${lounge.repToday}/100</span></div><div><small>ROTATING CONTRACT • +40 REP</small><b>${contract.label}</b><span>${progress}/${contract.target}${progress>=contract.target?" • COMPLETE":""}</span></div><div><small>DAILY BONUSES</small><b>+15 SESSION • +10 BJ • +10 POKER</b><span>${lounge.dailyRepClaims.filter(key=>!key.startsWith("contract:")).length}/3 claimed today</span></div></section>`;
}
const cardTierButtons=(selected,units=false)=>{
  const lounge=ensureCardLounge(),tiers={casual:["CASUAL CLUB","Low bets, basic rules",units?"×5 credit value":"5–100 coins"],neon:["NEON FLOOR","Medium bets, bonus objectives",units?"×50 credit value":"50–1,000 coins"],vip:["VIP VAULT","High bets, stricter entry requirement",units?"×500 credit value":"250–10,000 coins"]};
  return `<div class="casino-table-select">${Object.entries(tiers).map(([id,[name,desc,limits]])=>{const open=lounge.tablesUnlocked.includes(id);return `<button data-card-tier="${id}" class="${id===selected?"active":""}" ${open?"":"disabled"}><b>${name}</b><span>${desc}</span><small>${open?limits:`LOCKED • LEVEL ${id==="neon"?2:4}`}</small></button>`;}).join("")}</div>`;
};

function startBlackjack(){
  const stats=currentPlayer.gameStats.blackjack||={plays:0,wins:0,losses:0,draws:0,best:null};
  Object.assign(stats,{handsPlayed:stats.handsPlayed||0,sessionProfit:0,largestWin:stats.largestWin||0,bestWinStreak:stats.bestWinStreak||0,totalBlackjacks:stats.totalBlackjacks||stats.naturals||0,royalFlushes:stats.royalFlushes||0});
  ensureCardLounge();const tables={casual:{name:"CASUAL CLUB",min:5,max:100,step:5,color:"#31f5ff"},neon:{name:"NEON FLOOR",min:50,max:1000,step:25,color:"#ffe84c"},vip:{name:"VIP VAULT",min:250,max:10000,step:250,color:"#ff3eb5"}};
  let tableId="casual",bet=5,deck=[],dealer=[],hands=[],activeHand=0,done=true,sessionStart=currentPlayer.coins,sessionStreak=0,totalStake=0;
  const loungeHead=(mode,subtitle)=>`<header class="card-lounge-head"><span>♠</span><div><p class="eyebrow">GUBUNTU CARD LOUNGE</p><h3>${mode}</h3><small>${subtitle}</small></div><em>SESSION ${currentPlayer.coins-sessionStart>=0?"+":""}${currentPlayer.coins-sessionStart} ●</em></header>`;
  const clampBet=value=>{const table=tables[tableId];return Math.max(table.min,Math.min(table.max,Math.floor(Number(value)||table.min),Math.max(table.min,currentPlayer.coins)));};
  const lobby=()=>{
    done=true;const table=tables[tableId];bet=clampBet(bet);
    setStage(`<div class="card-lounge blackjack-lounge">${loungeHead("BLACKJACK 21","Natural Blackjack pays 3:2 • Dealer stands on all 17s")}${cardLoungePanel()}${cardTierButtons(tableId)}<section class="casino-bet-panel"><span>TABLE BET</span><button data-bj-bet="-${table.step}">−${table.step}</button><b>${bet} ●</b><button data-bj-bet="${table.step}">+${table.step}</button><button data-bj-max>MAX</button><small>${table.name} LIMITS ${table.min.toLocaleString()}–${table.max.toLocaleString()}</small></section><div class="card-lounge-rules"><span>BLACKJACK <b>3:2</b></span><span>DOUBLE DOWN <b>ONE CARD</b></span><span>SPLIT <b>EQUAL RANKS</b></span><span>DEALER <b>STANDS 17</b></span></div><button id="bj-deal" class="pixel-btn primary">DEAL • ${bet} ●</button><div class="casino-career"><span>HANDS <b>${stats.handsPlayed}</b></span><span>LARGEST WIN <b>${stats.largestWin}</b></span><span>BEST STREAK <b>${stats.bestWinStreak}</b></span><span>BLACKJACKS <b>${stats.totalBlackjacks}</b></span></div></div>`);
    $$("[data-card-tier]").forEach(button=>button.onclick=()=>{tableId=button.dataset.cardTier;bet=tables[tableId].min;lobby();});
    $$("[data-bj-bet]").forEach(button=>button.onclick=()=>{bet=clampBet(bet+(+button.dataset.bjBet));lobby();});
    $("[data-bj-max]").onclick=()=>{bet=clampBet(Math.min(table.max,currentPlayer.coins));lobby();};
    $("#bj-deal").onclick=deal;
  };
  const deal=()=>{
    if(currentPlayer.coins<bet)return toast("NINCS ELÉG ÉRMÉD!");
    currentPlayer.coins-=bet;totalStake=bet;saveData();updateHud();deck=newDeck();dealer=[deck.pop(),deck.pop()];hands=[{cards:[deck.pop(),deck.pop()],bet,done:false,natural:false}];activeHand=0;done=false;
    hands[0].natural=handValue(hands[0].cards)===21;
    if(hands[0].natural){stats.totalBlackjacks++;stats.naturals=(stats.naturals||0)+1;return settle();}
    render();
  };
  const canSplit=()=>hands.length===1&&hands[0].cards.length===2&&hands[0].cards[0].rank===hands[0].cards[1].rank&&currentPlayer.coins>=hands[0].bet;
  const canDouble=hand=>hand.cards.length===2&&currentPlayer.coins>=hand.bet;
  const adviceFor=hand=>{
    const value=handValue(hand.cards),up=dealer[0].rank==="A"?11:dealer[0].value,pair=hand.cards.length===2&&hand.cards[0].rank===hand.cards[1].rank,aces=hand.cards.filter(card=>card.rank==="A").length,soft=aces>0&&hand.cards.reduce((sum,card)=>sum+card.value,0)+10===value;
    if(pair){const rank=hand.cards[0].rank;if(["A","8"].includes(rank))return["SPLIT","Aces and eights gain the most from two hands."];if(rank==="10")return["STAND","Never split a made 20."];if(rank==="9"&&![7,10,11].includes(up))return["SPLIT","Nines perform better split against this upcard."];if(["2","3","7"].includes(rank)&&up<=7)return["SPLIT","This low pair benefits from two starting hands."];}
    if(soft){if(value>=19)return["STAND","Strong soft total."];if(value===18){if(up>=9)return["HIT","Soft 18 needs improvement against a strong dealer."];if(up>=3&&up<=6&&canDouble(hand))return["DOUBLE","Soft 18 is a profitable double against a weak upcard."];return["STAND","Soft 18 is strong enough here."];}if(value<=17&&up>=3&&up<=6&&canDouble(hand))return["DOUBLE","Use the ace as protection while doubling against a weak dealer."];return["HIT","Improve the soft total without immediate bust risk."];}
    if(value>=17)return["STAND","Hard 17 or better should stand."];if(value>=13&&up<=6)return["STAND","Let the weak dealer upcard take the bust risk."];if(value===12&&up>=4&&up<=6)return["STAND","Dealer 4–6 is vulnerable; avoid taking extra risk."];if(value===11&&canDouble(hand))return["DOUBLE","Eleven is the strongest doubling total."];if(value===10&&up<=9&&canDouble(hand))return["DOUBLE","Ten is favored against this dealer card."];if(value===9&&up>=3&&up<=6&&canDouble(hand))return["DOUBLE","Nine can press the advantage against a weak dealer."];return["HIT","The total is too low to stand safely."];
  };
  const render=(reveal=false,message="")=>{
    const hand=hands[activeHand]||hands[0],allHands=hands.map((item,index)=>`<article class="blackjack-hand ${index===activeHand&&!done?"active":""} ${item.result||""}"><header><span>HAND ${index+1}</span><b>${handValue(item.cards)}</b><em>${item.bet} ●</em></header><div class="playing-cards">${cardsHtml(item.cards)}</div>${item.result?`<small>${item.result.toUpperCase()}</small>`:""}</article>`).join("");
    setStage(`<div class="card-lounge blackjack-lounge">${loungeHead("BLACKJACK 21",`${tables[tableId].name} TABLE • BET ${totalStake} ●`)}<section class="dealer-zone"><p>DEALER • ${reveal?handValue(dealer):dealer[0]?.value||0}</p><div class="playing-cards">${cardsHtml(dealer,!reveal)}</div></section><section class="blackjack-hands">${allHands}</section><div class="game-actions">${done?`<button id="bj-again" class="pixel-btn primary">NEW HAND</button>`:`<button id="bj-hit" class="pixel-btn secondary">HIT</button><button id="bj-stand" class="pixel-btn primary">STAND</button><button id="bj-double" class="pixel-btn secondary" ${canDouble(hand)?"":"disabled"}>DOUBLE DOWN</button><button id="bj-split" class="pixel-btn secondary" ${canSplit()?"":"disabled"}>SPLIT</button><button id="bj-advisor" class="pixel-btn advisor">ASK ADVISOR</button>`}</div><p id="bj-advice" class="casino-advice" hidden></p><p class="result">${message||`PLAYING HAND ${activeHand+1}/${hands.length} • VALUE ${handValue(hand.cards)}`}</p><div class="casino-career"><span>SESSION <b>${stats.sessionProfit>=0?"+":""}${stats.sessionProfit}</b></span><span>HANDS <b>${stats.handsPlayed}</b></span><span>LARGEST WIN <b>${stats.largestWin}</b></span><span>BEST STREAK <b>${stats.bestWinStreak}</b></span></div></div>`);
    if(done)$("#bj-again").onclick=lobby;
    else{$("#bj-hit").onclick=hit;$("#bj-stand").onclick=stand;$("#bj-double").onclick=doubleDown;$("#bj-split").onclick=split;$("#bj-advisor").onclick=()=>{const [action,reason]=adviceFor(hand),panel=$("#bj-advice");panel.hidden=false;panel.innerHTML=`<b>${action}</b><span>${reason}</span><small>Strategy guidance only • outcomes remain random</small>`;};}
  };
  const advance=()=>{
    hands[activeHand].done=true;
    const next=hands.findIndex((hand,index)=>index>activeHand&&!hand.done);
    if(next>=0){activeHand=next;return render();}
    settle();
  };
  const hit=()=>{
    const hand=hands[activeHand];hand.hitTaken=true;hand.cards.push(deck.pop());
    if(handValue(hand.cards)>21){hand.result="bust";advance();}else if(handValue(hand.cards)===21)advance();else render();
  };
  const stand=()=>{hands[activeHand].result="stand";advance();};
  const doubleDown=()=>{
    const hand=hands[activeHand];if(!canDouble(hand))return;
    currentPlayer.coins-=hand.bet;totalStake+=hand.bet;hand.bet*=2;hand.doubled=true;hand.cards.push(deck.pop());hand.result=handValue(hand.cards)>21?"bust":"double";saveData();updateHud();advance();
  };
  const split=()=>{
    if(!canSplit())return;const original=hands[0],splitBet=original.bet;currentPlayer.coins-=splitBet;totalStake+=splitBet;
    const left=original.cards[0],right=original.cards[1];hands=[{cards:[left,deck.pop()],bet:splitBet,done:false,natural:false},{cards:[right,deck.pop()],bet:splitBet,done:false,natural:false}];activeHand=0;saveData();updateHud();render();
  };
  const settle=()=>{
    done=true;
    if(hands.some(hand=>handValue(hand.cards)<=21)&&!hands[0]?.natural)while(handValue(dealer)<17)dealer.push(deck.pop());
    const dealerValue=handValue(dealer);let totalPayout=0,winningHands=0;
    hands.forEach(hand=>{
      const value=handValue(hand.cards);let payout=0,result="lost";
      if(value>21)result="bust";
      else if(hand.natural&&dealerValue===21&&dealer.length===2){payout=hand.bet;result="push";}
      else if(hand.natural){payout=Math.floor(hand.bet*2.5);result="blackjack";winningHands++;}
      else if(dealerValue>21||value>dealerValue){payout=hand.bet*2;result="won";winningHands++;}
      else if(value===dealerValue){payout=hand.bet;result="push";}
      hand.result=result;totalPayout+=payout;stats.largestWin=Math.max(stats.largestWin,payout-hand.bet);
      if(result==="won"||result==="blackjack"){cardLoungeProgress("blackjackWins");cardLoungeDailyRep("first-blackjack-win",10,"FIRST BLACKJACK WIN TODAY");if(!hand.hitTaken)cardLoungeProgress("blackjackNoHit");if(hand.doubled)cardLoungeProgress("doubleWin");}
      if(result==="won"||result==="blackjack"){sessionStreak++;stats.bestWinStreak=Math.max(stats.bestWinStreak,sessionStreak);}else if(result!=="push")sessionStreak=0;
    });
    stats.handsPlayed+=hands.length;currentPlayer.coins+=totalPayout;if(totalPayout>0){currentPlayer.coinsEarned=(currentPlayer.coinsEarned||0)+totalPayout;addDaily("coins",totalPayout);}stats.sessionProfit=currentPlayer.coins-sessionStart;saveData();updateHud();
    const net=totalPayout-totalStake,message=`SETTLED ${hands.length} HAND${hands.length>1?"S":""} • ${net>=0?"+":""}${net} ● • DEALER ${dealerValue}`;const lounge=ensureCardLounge();lounge.dailyProfit+=net;lounge.bestSession=Math.max(lounge.bestSession,currentPlayer.coins-sessionStart);if(currentPlayer.coins-sessionStart>0){cardLoungeProgress("positiveSession");cardLoungeDailyRep("first-positive-session",15,"FIRST POSITIVE SESSION TODAY");}
    render(true,message);reward(0,winningHands?18:5,{result:net>0?"win":net===0?"draw":"loss",score:Math.max(...hands.map(hand=>handValue(hand.cards)))});
  };
  lobby();
}

function pokerRank(hand){
  const rankValue=rank=>"23456789TJQKA".indexOf(rank.replace("10","T"))+2,nums=hand.map(card=>rankValue(card.rank)).sort((a,b)=>a-b),rankCounts=hand.reduce((map,card)=>(map[card.rank]=(map[card.rank]||0)+1,map),{}),counts=Object.values(rankCounts).sort((a,b)=>b-a),flush=hand.every(card=>card.suit===hand[0].suit),straight=new Set(nums).size===5&&(nums[4]-nums[0]===4||nums.join(",")==="2,3,4,5,14"),pairRank=Object.keys(rankCounts).find(rank=>rankCounts[rank]===2),pairQualifies=pairRank&&rankValue(pairRank)>=11;
  if(straight&&flush&&nums[0]===10)return ["ROYAL FLUSH",250,"royal"];
  if(straight&&flush)return["STRAIGHT FLUSH",50,"legendary"];
  if(counts[0]===4)return["FOUR OF A KIND",25,"legendary"];
  if(counts[0]===3&&counts[1]===2)return["FULL HOUSE",9,"epic"];
  if(flush)return["FLUSH",6,"rare"];
  if(straight)return["STRAIGHT",4,"rare"];
  if(counts[0]===3)return["THREE OF A KIND",3,"uncommon"];
  if(counts[0]===2&&counts[1]===2)return["TWO PAIR",2,"uncommon"];
  if(counts[0]===2&&pairQualifies)return["JACKS OR BETTER",1,"common"];
  return["NO WIN",0,"none"];
}
function startPoker(){
  const stats=currentPlayer.gameStats.poker||={plays:0,wins:0,losses:0,draws:0,best:null};
  ensureCardLounge();
  Object.assign(stats,{handsPlayed:stats.handsPlayed||0,sessionProfit:0,largestWin:stats.largestWin||0,bestWinStreak:stats.bestWinStreak||0,totalBlackjacks:stats.totalBlackjacks||0,royalFlushes:stats.royalFlushes||0});
  const paytable=[["JACKS OR BETTER",1],["TWO PAIR",2],["THREE OF A KIND",3],["STRAIGHT",4],["FLUSH",6],["FULL HOUSE",9],["FOUR OF A KIND",25],["STRAIGHT FLUSH",50],["ROYAL FLUSH",250]];
  let deck=[],hand=[],held=[],phase="lobby",bet=1,tableId="casual",sessionStart=currentPlayer.coins,sessionStreak=0,lastRank="";
  const tierUnit=()=>({casual:5,neon:50,vip:500})[tableId]||5;
  const loungeHead=()=>`<header class="card-lounge-head"><span>♦</span><div><p class="eyebrow">GUBUNTU CARD LOUNGE</p><h3>JACKS OR BETTER</h3><small>Five-credit Royal Flush pays ×800</small></div><em>SESSION ${currentPlayer.coins-sessionStart>=0?"+":""}${currentPlayer.coins-sessionStart} ●</em></header>`;
  const tableHtml=()=>`<aside class="poker-paytable"><h4>PAYTABLE</h4>${[...paytable].reverse().map(([name,multi])=>`<span class="${lastRank===name?"active":""}"><b>${name}</b><em>×${name==="ROYAL FLUSH"&&bet===5?800:multi}</em></span>`).join("")}</aside>`;
  const lobby=()=>{
    phase="lobby";lastRank="";
    setStage(`<div class="card-lounge poker-lounge">${loungeHead()}${cardLoungePanel()}${cardTierButtons(tableId,true)}<div class="poker-layout">${tableHtml()}<main class="poker-terminal"><div class="big-icon">🃏</div><p class="table-title">SELECT 1–5 CREDITS • UNIT ${tierUnit()} ●</p><div class="credit-select">${[1,2,3,4,5].map(value=>`<button data-credit="${value}" class="${bet===value?"active":""}">${value}<small>CREDIT${value>1?"S":""}</small></button>`).join("")}</div><button id="poker-deal" class="pixel-btn primary">DEAL • ${bet*tierUnit()} ●</button><p class="result">Jacks or Better pair required. One draw only. Table tiers change stakes, never odds.</p></main></div><div class="casino-career"><span>HANDS <b>${stats.handsPlayed}</b></span><span>LARGEST WIN <b>${stats.largestWin}</b></span><span>BEST STREAK <b>${stats.bestWinStreak}</b></span><span>ROYAL FLUSHES <b>${stats.royalFlushes}</b></span></div></div>`);
    $$("[data-card-tier]").forEach(button=>button.onclick=()=>{tableId=button.dataset.cardTier;lobby();});$$("[data-credit]").forEach(button=>button.onclick=()=>{bet=+button.dataset.credit;lobby();});$("#poker-deal").onclick=deal;
  };
  const deal=()=>{
    const stake=bet*tierUnit();if(currentPlayer.coins<stake)return toast("NINCS ELÉG ÉRMÉD!");
    currentPlayer.coins-=stake;saveData();updateHud();deck=newDeck();hand=Array.from({length:5},()=>deck.pop());held=[];phase="hold";render();
  };
  const suggestion=()=>{
    const remaining=newDeck().filter(card=>!hand.some(heldCard=>heldCard.rank===card.rank&&heldCard.suit===card.suit)),seedText=hand.map(card=>card.rank+card.suit).join(""),seedBase=[...seedText].reduce((n,char)=>Math.imul(n^char.charCodeAt(0),16777619)>>>0,2166136261);let best={mask:0,ev:-1};
    for(let mask=0;mask<32;mask++){const kept=hand.filter((_,index)=>mask&(1<<index)),draws=5-kept.length,samples=draws===0?1:220;let total=0,seed=(seedBase^Math.imul(mask+1,2654435761))>>>0;for(let sample=0;sample<samples;sample++){const pool=[...remaining];for(let i=pool.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[pool[i],pool[j]]=[pool[j],pool[i]];}let [,multi]=pokerRank([...kept,...pool.slice(0,draws)]);if(multi===250&&bet===5)multi=800;total+=multi;}const ev=total/samples-kept.length*.0001;if(ev>best.ev)best={mask,ev};}
    held=hand.map((_,index)=>best.mask&(1<<index)?index:-1).filter(index=>index>=0);render(`SMART ADVISOR • HOLD ${held.length?held.map(index=>`${hand[index].rank}${hand[index].suit}`).join(" • "):"NOTHING"} • EST. PAYTABLE RETURN ×${Math.max(0,best.ev).toFixed(2)}`);
  };
  const render=(message="Select cards to HOLD, then draw.",comment="")=>{
    setStage(`<div class="card-lounge poker-lounge ${phase==="done"?`win-${pokerRank(hand)[2]}`:""}">${loungeHead()}<div class="poker-layout">${tableHtml()}<main class="poker-terminal"><p class="table-title">BET ${bet} CREDIT${bet>1?"S":""}</p><div class="playing-cards">${cardsHtml(hand,false,phase==="hold",held)}</div><div class="hold-labels">${hand.map((_,index)=>`<span class="${held.includes(index)?"on":""}">${held.includes(index)?"HELD":"DRAW"}</span>`).join("")}</div><div class="game-actions">${phase==="hold"?`<button id="poker-suggest" class="pixel-btn secondary">HOLD SUGGESTION</button><button id="poker-draw" class="pixel-btn primary">DRAW ${5-held.length}</button>`:`<button id="poker-again" class="pixel-btn primary">NEW HAND</button>`}</div><p class="result">${message}</p>${comment}</main></div><div class="casino-career"><span>SESSION <b>${stats.sessionProfit>=0?"+":""}${stats.sessionProfit}</b></span><span>HANDS <b>${stats.handsPlayed}</b></span><span>LARGEST WIN <b>${stats.largestWin}</b></span><span>BEST STREAK <b>${stats.bestWinStreak}</b></span></div></div>`);
    if(phase==="hold"){
      $$("[data-card]").forEach(card=>card.onclick=()=>{const index=+card.dataset.card;held=held.includes(index)?held.filter(value=>value!==index):[...held,index];render();});
      $("#poker-suggest").textContent="SMART HOLD ADVISOR";$("#poker-suggest").onclick=suggestion;$("#poker-draw").onclick=draw;
    }else $("#poker-again").onclick=lobby;
  };
  const draw=()=>{
    hand=hand.map((card,index)=>held.includes(index)?card:deck.pop());phase="done";
    let [name,multi,rarity]=pokerRank(hand);if(name==="ROYAL FLUSH"&&bet===5)multi=800;
    const stake=bet*tierUnit(),payout=stake*multi,profit=payout-stake;lastRank=name;currentPlayer.coins+=payout;if(payout>0){currentPlayer.coinsEarned=(currentPlayer.coinsEarned||0)+payout;addDaily("coins",payout);}stats.handsPlayed++;stats.sessionProfit=currentPlayer.coins-sessionStart;stats.largestWin=Math.max(stats.largestWin,profit);
    if(payout){sessionStreak++;stats.bestWinStreak=Math.max(stats.bestWinStreak,sessionStreak);}else sessionStreak=0;
    if(name==="ROYAL FLUSH")stats.royalFlushes++;if(payout>0)cardLoungeDailyRep("first-paying-poker",10,"FIRST PAYING POKER HAND TODAY");if(["FLUSH","FULL HOUSE","FOUR OF A KIND","STRAIGHT FLUSH","ROYAL FLUSH"].includes(name))cardLoungeProgress("pokerFlush");const lounge=ensureCardLounge();lounge.dailyProfit+=profit;lounge.bestSession=Math.max(lounge.bestSession,stats.sessionProfit);if(stats.sessionProfit>0){cardLoungeProgress("positiveSession");cardLoungeDailyRep("first-positive-session",15,"FIRST POSITIVE SESSION TODAY");}
    saveData();updateHud();render(`${name}${payout?` • ×${multi} • +${payout} ●`:" • NO PAYOUT"}`,arcadeComment(rarity==="royal"||rarity==="legendary"?"jackpot":payout?"win":"lose"));
    reward(0,payout?Math.min(80,8+multi):4,{result:profit>0?"win":profit===0?"draw":"loss",score:multi});
  };
  lobby();
}

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
async function cacheReady(){if(!("caches" in window))return false;try{return (await caches.keys()).some(key=>key.includes(`v${APP_VERSION}`));}catch{return false;}}
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
  return {save:testLocalStorage(),games:Array.isArray(games)&&games.length>0,profiles:Array.isArray(data?.profiles),pwa:"serviceWorker" in navigator};
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
  $("#arcade-screen")?.addEventListener("pointermove",e=>{if(reduceMotion())return;const x=Math.round(e.clientX/window.innerWidth*100),y=Math.round(e.clientY/window.innerHeight*100);document.documentElement.style.setProperty("--mx",`${x}%`);document.documentElement.style.setProperty("--my",`${y}%`);});
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
  $("#profile-form").onsubmit=e=>{e.preventDefault();const name=$("#player-name").value.trim();if(!name)return;const colors=["#31f5ff","#ff3eb5","#ffe84c","#72ff77","#8e5bff"];const p={id:crypto.randomUUID?.()||String(Date.now()),name,avatar:selectedAvatar,color:colors[data.profiles.length%colors.length],coins:100,xp:0,plays:0,bestStreak:0,currentStreak:0,totalWins:0,totalLosses:0,rank:"ÚJONC",inventory:[],achievements:[],gameStats:{},openRoadMissions:{},daily:null,lastGame:null};data.profiles.push(p);saveData();renderProfiles();closeDialogAnimated($("#profile-dialog"));e.target.reset();selectPlayer(p.id);};
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
