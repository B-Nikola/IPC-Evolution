// Pour importer les données vous pouvez soit importer directement les csv (@rollup/plugin-dsv), soit utiliser la méthode csv de d3-fetch

import { game } from "./gameLogic"




//logique des données

import {  gameData,fullData, createBarGraph, createLineGraph,createLineGraphComparison } from './dataHandler.js';


// Add a div element to your HTML with id="chart"
// <div id="chart"></div>

// Create bar graph with default options
createBarGraph(gameData, '#chart');

// Or with custom options
createBarGraph(gameData, '#bars', {
  width: 100,
  height: 500,
  barColor: '#ff6b6b',
  title: 'Game IPC Evolution',
  xAxisLabel: 'Game Titles',
  yAxisLabel: 'IPC Difference'
});


console.log(fullData);

createLineGraphComparison(fullData[1], fullData[2], '#line');

//after delai de 2 secondes, on lance le jeu
setTimeout(() => {
    //game();
}, 500);