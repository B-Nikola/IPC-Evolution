// Pour importer les données vous pouvez soit importer directement les csv (@rollup/plugin-dsv), soit utiliser la méthode csv de d3-fetch

import { data } from "./dataHandler"



//foreach data compare first and last value and print in the console


data.forEach(element => {
    let index = 1;
    element = Object.values(element);

    let a = parseInt(element[index]);
    let b = parseInt(element[element.length - 1]);
    
    while (!a) {
        a = parseInt(element[++index]);
    }
    let diffValue = Math.abs(b - a);
    console.log("Diff "+element[0] +" : " + diffValue);
});


