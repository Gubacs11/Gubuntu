"use strict";

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

GubuntuGames.register("starfarer",startStarfarer);
