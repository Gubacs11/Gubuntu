"use strict";

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

GubuntuGames.register("poker",startPoker);
