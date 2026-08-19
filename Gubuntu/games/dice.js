"use strict";

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

GubuntuGames.register("dice",startDice);
