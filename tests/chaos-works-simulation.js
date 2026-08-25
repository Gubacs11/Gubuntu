"use strict";

globalThis.GubuntuGames={register(){}};
require("../games/chaos-works.js");

const core=globalThis.ChaosWorksCore;
const total=200000,types=Object.keys(core.PRODUCT_TYPES),rarities={},traits={},legacyTraits={};
let seed=0xC0FFEE,valueTotal=0,costTotal=0,losses=0;
const values=[];
const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
let legacySeed=0xC0FFEE;
const legacyRng=()=>{legacySeed=(legacySeed*1664525+1013904223)>>>0;return legacySeed/4294967296};
const legacyChoose=type=>{const allowed=Object.entries(core.TRAITS).filter(([,trait])=>Object.keys(trait.mods).some(stat=>stat in core.PRODUCT_TYPES[type].stats));let count=legacyRng()<.72?1:0;if(legacyRng()<.3)count++;if(legacyRng()<.08)count++;const result=[];for(let i=0;i<count&&allowed.length;i++){const index=Math.floor(legacyRng()*allowed.length),[id]=allowed.splice(index,1)[0];result.push(id)}return result};

for(let index=0;index<total;index++){
  const product=core.generateProduct(types[index%types.length],rng);
  rarities[product.rarity]=(rarities[product.rarity]||0)+1;
  for(const trait of product.traits)traits[trait]=(traits[trait]||0)+1;
  valueTotal+=product.value;costTotal+=product.productionCost;values.push(product.value);
  if(product.value<product.productionCost)losses++;
  for(const trait of legacyChoose(types[index%types.length]))legacyTraits[trait]=(legacyTraits[trait]||0)+1;
}

values.sort((a,b)=>a-b);
const pct=count=>`${(count/total*100).toFixed(4)}%`;
const report={
  seed:"0xC0FFEE",generated:total,
  rarityDistribution:Object.fromEntries(core.RARITIES.map(({name})=>[name,{count:rarities[name]||0,percent:pct(rarities[name]||0)}]).concat([["ANOMALOUS",{count:rarities.ANOMALOUS||0,percent:pct(rarities.ANOMALOUS||0)}]])),
  averageSaleValue:Number((valueTotal/total).toFixed(2)),medianSaleValue:values[Math.floor(total/2)],averageManufacturingCost:Number((costTotal/total).toFixed(2)),averageSellProfit:Number(((valueTotal-costTotal)/total).toFixed(2)),lossMakingProducts:{count:losses,percent:pct(losses)},
  scrapRecovery:{level0:"35%",level4:"65%"},
  legacyUniformRareTraitFrequencies:{experimentalAlloy:{count:legacyTraits.experimental||0,percent:pct(legacyTraits.experimental||0)},impossibleTolerance:{count:legacyTraits.impossible||0,percent:pct(legacyTraits.impossible||0)}},
  traitFrequencies:Object.fromEntries(Object.entries(core.TRAITS).map(([id,trait])=>[trait.name,{count:traits[id]||0,percent:pct(traits[id]||0),weight:trait.weight}]))
};

console.log(JSON.stringify(report,null,2));
