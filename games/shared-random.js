"use strict";

(function installRandomUtilities(root){
  function shuffle(array,random=Math.random){
    const result=[...array];
    for(let i=result.length-1;i>0;i--){
      const j=Math.floor(random()*(i+1));
      [result[i],result[j]]=[result[j],result[i]];
    }
    return result;
  }

  root.GubuntuRandom=Object.freeze({shuffle});
  root.shuffle=shuffle;
})(globalThis);
