"use strict";

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

GubuntuGames.register("fishing",startFishing);
