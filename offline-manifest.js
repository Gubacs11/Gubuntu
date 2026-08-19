"use strict";

(function installOfflineManifest(root){
  const gameModules=Object.freeze({
    guess:"guess.js",rps:"rock-paper-scissors.js",quiz:"quiz.js",penalty:"penalty.js",
    slots:"slots.js",dice:"dice.js",memory:"memory.js",reaction:"reaction.js",
    ttt:"tic-tac-toe.js",snake:"snake.js",pac:"pixel-pac.js",wreck:"wreck-it.js",
    fishing:"fishing.js",openroad:"open-road.js",starfarer:"starfarer.js",
    blackjack:"blackjack.js",poker:"poker.js",billiards:"billiards.js",
    salvager:"neon-salvager.js",towerdefense:"tower-defense.js",voidminer:"void-miner.js"
  });
  const versioned=(path,build)=>`${path}?v=${build}`;
  const assets=build=>Object.freeze([
    "./","./index.html",versioned("./styles.css",build),versioned("./offline-manifest.js",build),
    versioned("./games/shared-random.js",build),versioned("./games/game-registry.js",build),
    versioned("./games/card-games-shared.js",build),versioned("./app.js",build),
    ...Object.values(gameModules).map(file=>versioned(`./games/${file}`,build)),
    "./manifest.json","./icons/gubuntu.ico","./icons/icon-192.png","./icons/icon-512.png",
    "./icons/icon-maskable-512.png"
  ]);
  const cacheName=(appVersion,build)=>`gubuntu-arcade-shell-v${appVersion}-build${build}`;
  root.GubuntuOfflineManifest=Object.freeze({gameModules,assets,cacheName});
})(globalThis);
