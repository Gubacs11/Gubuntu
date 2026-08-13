"use strict";

function newDeck(){
  const suits=["♠","♥","♦","♣"],ranks=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
  return shuffle(suits.flatMap(suit=>ranks.map((rank,i)=>({suit,rank,value:rank==="A"?1:Math.min(i+2,10)}))));
}
function handValue(hand){let value=hand.reduce((n,c)=>n+c.value,0),aces=hand.filter(c=>c.rank==="A").length;while(aces--&&value+10<=21)value+=10;return value;}
function cardsHtml(cards,hidden=false,clickable=false,held=[]){return cards.map((c,i)=>hidden&&i===1?`<div class="playing-card dealer-hidden">?</div>`:`<button class="playing-card ${"♥♦".includes(c.suit)?"red":""} ${held.includes(i)?"held":""}" ${clickable?`data-card="${i}"`:"disabled"}><small>${c.rank}${c.suit}</small><b>${c.suit}</b></button>`).join("");}

/* Starfarer procedural planet renderer. Visual randomness is isolated from
   gameplay randomness: every decision comes from the saved seed and stats. */

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
