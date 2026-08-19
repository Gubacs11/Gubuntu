"use strict";

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

GubuntuGames.register("blackjack",startBlackjack);
