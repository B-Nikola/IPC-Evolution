// Pour importer les données vous pouvez soit importer directement les csv (@rollup/plugin-dsv), soit utiliser la méthode csv de d3-fetch

import { game } from "./gameLogic"
game();



//logique des données

import {  gameData,fullData, createBarGraph, createFullLineGraph,createComparisonLineGraph, createComparisonBarGraph } from './dataHandler.js';
import { create } from "d3-selection";

//affichage des questions réponses
// import "./elements/question-element.js";
// import { QuestionSection } from "./sections/question-section.js";
// QuestionSection();
// import "./elements/answer-element.js";
// import { AnswerSection } from "./sections/answer-section.js";
// AnswerSection();

// Add a div element to your HTML with id="chart"
// <div id="chart"></div>


let value1 = 0;
let value2 = 0;

//on input1 value change
const input1 = document.getElementById('input1');
input1.addEventListener('input', (event) => {
    const value = event.target.value;
    console.log(value);
    value1 = value;
    //update the graph with the new value
    createComparisonLineGraph(fullData[value1], fullData[value2], '#line');
    createComparisonBarGraph(fullData[value1], fullData[value2], '#bars');
});
//on input2 value change
const input2 = document.getElementById('input2');
input2.addEventListener('input', (event) => {
    const value = event.target.value;
    console.log(value);
    value2 = value;
    //update the graph with the new value
    createComparisonLineGraph(fullData[value1], fullData[value2], '#line');
    createComparisonBarGraph(fullData[value1], fullData[value2], '#bars');
});


//console.log(fullData);

//after delai de 2 secondes, on lance le jeu
setTimeout(() => {
    //game();
}, 500);
