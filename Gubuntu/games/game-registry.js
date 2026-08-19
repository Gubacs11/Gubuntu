"use strict";

// One deliberately small global replaces the launcher's direct dependency on
// every game's implementation symbol. Duplicate ids fail immediately during
// boot instead of silently replacing another cabinet.
window.GubuntuGames=(()=>{
  const starters=new Map();
  return Object.freeze({
    register(id,starter){
      if(typeof id!=="string"||!id||typeof starter!=="function")throw new TypeError("Invalid game registration");
      if(starters.has(id))throw new Error(`Duplicate game registration: ${id}`);
      starters.set(id,starter);
    },
    get:id=>starters.get(id),
    has:id=>starters.has(id),
    ids:()=>Object.freeze([...starters.keys()])
  });
})();
