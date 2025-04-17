import { gameData } from "./dataHandler"

const gameQuestion= `<div class="game-area">
    
        <!-- Container Gauche-->
        <div class="game-container" id="left">
          <g>
            <svg height="80px" width="80px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve">
              <path style="fill:#ED8A19;" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
                c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
                c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
                c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
                c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
                C22.602,0.567,25.338,0.567,26.285,2.486z"/>
            </svg>
          </g>
        </div>

        

        <!-- Container Droite-->
        <div class="game-container" id="right">
          <svg version="1.1" height="80px" width="80px" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve">	
            <path style="fill:#D1D4D1;stroke:#D1D4D1;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" d="M58.432,20.432
                c-0.464-3.578-1.152-6.834-1.799-9.432l2.153-1.82c0.131-0.11,0.187-0.285,0.146-0.451L57,1h-7.231c-0.086,0-0.469,0-0.58,0
                c-0.652,0-1.316,0.104-1.967,0.324c-3.143,1.061-4.811,4.409-3.727,7.48c2.196,6.259,6.495,24.402,0.113,33.131
                c-2.606,3.564-6.972,5.297-13.348,5.297h-0.52c-6.382,0-10.751-1.736-13.356-5.308c-6.372-8.736-1.936-27.302,0.12-33.117
                c1.086-3.071-0.582-6.421-3.726-7.482c-0.792-0.267-1.603-0.363-2.389-0.308C10.335,1.014,10.285,1,10.231,1H3L1.068,8.729
                C1.026,8.895,1.083,9.07,1.213,9.18L3.367,11c-0.647,2.598-1.334,5.854-1.799,9.432c-1.569,12.086,0.116,21.615,5.006,28.32
                C9.984,53.427,16.771,59,29.74,59h0.52c7.159,0,16.988-1.778,23.166-10.248C58.316,42.047,60.001,32.518,58.432,20.432z M9.5,6
                C10.881,6,12,7.119,12,8.5c0,1.381-1.119,2.5-2.5,2.5C8.119,11,7,9.881,7,8.5C7,7.119,8.119,6,9.5,6z M7.5,18
                c1.381,0,2.5,1.119,2.5,2.5c0,1.381-1.119,2.5-2.5,2.5C6.119,23,5,21.881,5,20.5C5,19.119,6.119,18,7.5,18z M12.6,46.899
                c-0.355,0.259-0.769,0.384-1.177,0.384c-0.617,0-1.227-0.284-1.618-0.821c-3.092-4.239-4.707-9.769-4.801-16.433
                c-0.016-1.104,0.867-2.013,1.972-2.028c1.057,0.001,2.013,0.867,2.028,1.972c0.082,5.82,1.438,10.575,4.033,14.132
                C13.688,44.997,13.492,46.248,12.6,46.899z M38.54,53.927c-2.561,0.718-5.365,1.082-8.334,1.082h-0.412
                c-2.999,0-5.804-0.361-8.338-1.073c-1.063-0.3-1.684-1.403-1.385-2.467s1.4-1.685,2.467-1.385c2.182,0.614,4.623,0.925,7.256,0.925
                h0.412c2.604,0,5.045-0.314,7.254-0.934c1.063-0.299,2.167,0.322,2.466,1.386C40.224,52.524,39.604,53.629,38.54,53.927z M50.5,6
                C51.881,6,53,7.119,53,8.5c0,1.381-1.119,2.5-2.5,2.5C49.119,11,48,9.881,48,8.5C48,7.119,49.119,6,50.5,6z M50.199,46.462
                c-0.392,0.537-1.001,0.821-1.618,0.821c-0.408,0-0.821-0.125-1.177-0.384c-0.893-0.651-1.088-1.902-0.438-2.795
                c2.595-3.557,3.951-8.312,4.033-14.132c0.016-1.104,0.972-1.971,2.028-1.972c1.104,0.016,1.987,0.924,1.972,2.028
                C54.906,36.693,53.291,42.223,50.199,46.462z M52.5,23c-1.381,0-2.5-1.119-2.5-2.5c0-1.381,1.119-2.5,2.5-2.5
                c1.381,0,2.5,1.119,2.5,2.5C55,21.881,53.881,23,52.5,23z"/>
            </svg>
        
        </div>


        <!-- Container Centre
        <div id="center">
          <svg height="100%" width="100%" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve">
            <path style="fill:#ED8A19;"  d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
              c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956C22.602,0.567,25.338,0.567,26.285,2.486z"/>
          
              <rect x="10" y="10" width="200" height="100" stroke="red" stroke-width="6" fill="blue" />
          </svg>
          
          
          </svg>  
        </div>
        -->
  </div>`;
  const gameIds = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
let score = 0;

const game = () => {
    gameInit();

    
    const leftItem = document.querySelector("#left");
    const rightItem = document.querySelector("#right");

    

leftItem.addEventListener("click", () => {
    console.log(gameData[4].name + " est monté de " + gameData[4].diffValue);
    gameControl("left");
    //
}
);
rightItem.addEventListener("click", () => {
    console.log(gameData[5].name + " est monté de " + gameData[5].diffValue);
    gameControl("right");
}
);





leftItem.addEventListener("mouseover", () => {
    moveDown(leftItem);
    cssGrowth(leftItem);
});
leftItem.addEventListener("mouseleave", () => {
    resetPosition(leftItem);
    resetCss(leftItem);
});
rightItem.addEventListener("mouseover", () => {
    moveDown(rightItem);
    cssGrowth(rightItem);
});
rightItem.addEventListener("mouseleave", () => {
    resetPosition(rightItem );
    resetCss(rightItem);
});


}

const gameControl = (answer) => {

    switch (answer) {
        case "left":
            if(gameData[0].diffValue > gameData[1].diffValue){
                console.log("Gagné");
                score++;
            }
            break;
        case "right":
            if(gameData[0].diffValue < gameData[1].diffValue){
                console.log("Gagné");
                score++;
            }
            break;
            
    }
    gameData.shift();
    gameData.shift();

    console.log(score);
}

const gameCorrection =() => {


}

const moveDown = (item) => {
    const svg = item.querySelector("svg");
    svg.style.transform = `translateY( 120px)`;
    svg.style.transition = "all 0.05s ease-out";
}
const resetPosition = (item) => {
    const svg = item.querySelector("svg");
    svg.style.transform = `translateY(0px)`;
    svg.style.transition = "all 0.05s ease-out";
}

const cssGrowth = (item) => {
    item.style.width = "calc(100% + 75vh)";
    item.style.transition = "all 0.05s ease-out";
}

const resetCss = (item) => {
    item.style.width = "100%";
    item.style.transition = "all 0.05s ease-out";
}


const gameInit = () => {
//query selector on main for putting inner text
document.querySelector("main").innerHTML =gameQuestion;

}

export {game}