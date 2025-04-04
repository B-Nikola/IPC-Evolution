import * as d3 from "d3";
import { json } from "d3-fetch";


const sourceFile = './data/ipcEvolution.json';



const data = await json(sourceFile)
    .then(data => {
        
        return data;
    })
    .catch(error => {
        console.error('Error loading the CSV file:', error);
    });


const diffValue = data[0].value - data[data.length - 1].value;


export { data };