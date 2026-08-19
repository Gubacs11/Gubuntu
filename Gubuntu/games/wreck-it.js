"use strict";

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
  let selected=null,parts=[],structureCount=0,score=0,totalDamage=0,destroyed=0,comboHits=0,bestCombo=1,bestChain=0,chainNow=0,lastDestroy=0,vehicleHp=100,time=60,ended=false,timer=null,sequence=0,contract=null;const timeouts=new Set(),schedule=(fn,ms)=>{const id=setTimeout(()=>{timeouts.delete(id);fn()},ms);timeouts.add(id);return id};
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
      const blast=$("#wreck-blast");blast?.classList.add("show");schedule(()=>blast?.classList.remove("show"),500);
      parts.filter(x=>x.hp>0&&Math.abs(x.id-p.id)<=8).forEach(x=>{const loss=Math.min(x.hp,58);x.hp-=loss;totalDamage+=loss;if(x.hp<=0)destroy(x,"explosion");});
    }
    score+=Math.round((remaining+20)*combo());
  };
  const ram=id=>{
    if(ended)return;const p=parts.find(x=>x.id===id);if(!p||p.hp<=0)return;
    if(performance.now()-lastDestroy>2000){comboHits=0;chainNow=0;}
    const blocked=p.heavy&&!selected.heavy,impact=selected.impact*(blocked?.45:1)*(p.type==="support"?.82:1),loss=Math.min(p.hp,impact);
    p.hp-=loss;totalDamage+=loss;vehicleHp=Math.max(0,vehicleHp-(p.heavy?7:4)*(100/selected.armor));$(".demolition-yard")?.classList.add("quake");schedule(()=>$(".demolition-yard")?.classList.remove("quake"),180);
    if(p.hp<=0)destroy(p);else chainNow=0;
    $("#wreck-result").textContent=blocked?"HEAVY PART: this vehicle cannot deliver full impact.":p.type==="support"?"SUPPORT WEAKENED • structural integrity falling.":"DIRECT HIT";
    if(vehicleHp<=0)return finish(false);refresh();
  };
  const finish=win=>{
    if(ended)return;ended=true;clearInterval(timer);const stats=currentPlayer.gameStats.wreck||={plays:0,wins:0,losses:0,draws:0,best:null};stats.bestCombo=Math.max(stats.bestCombo||0,bestCombo);stats.bestDamage=Math.max(stats.bestDamage||0,Math.floor(totalDamage));stats.contractsCompleted=(stats.contractsCompleted||0)+(win?1:0);const payout=win?Math.min(240,40+Math.floor(score/30)+bestCombo*10):Math.max(5,Math.floor(score/100));
    setStage(`<div class="wreck-summary"><div class="big-icon">${win?"💥":"🚧"}</div><h3>${win?"CONTRACT COMPLETE":"CONTRACT FAILED"}</h3><div class="career-grid"><article><span>DAMAGE</span><b>${Math.floor(totalDamage)}</b></article><article><span>OBJECTS</span><b>${destroyed}</b></article><article><span>BEST CHAIN</span><b>${bestChain}</b></article><article><span>VEHICLE</span><b>${Math.round(vehicleHp)}%</b></article></div><p>${contract.title} • ${contractProgress()}/${contract.target} • ${payout} coins</p><button id="wreck-again" class="pixel-btn primary">NEXT CONTRACT</button></div>`);
    reward(payout,win?45:8,{result:win?"win":"loss",score});$("#wreck-again").onclick=startWreck;
  };
  chooseVehicle();setActiveCleanup(()=>{ended=true;clearInterval(timer);timeouts.forEach(clearTimeout);timeouts.clear();});
}

GubuntuGames.register("wreck",startWreck);
