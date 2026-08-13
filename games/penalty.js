"use strict";

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

GubuntuGames.register("penalty",startPenalty);
