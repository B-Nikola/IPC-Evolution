import { gameData } from "./dataHandler";
import "./elements/question-element.js";
import { QuestionSection } from "./sections/question-section.js";

import "./elements/answer-element.js";
import { AnswerSection } from "./sections/answer-section.js";

let score = 0;
let currentIndex = 0;

const game = () => {
  gameInit();

  // On attend que Scrollama et le DOM soient prêts
  setTimeout(() => {
    const questionSteps = document.querySelectorAll(".step question-element");

    questionSteps.forEach((questionEl, index) => {
      const leftItem = questionEl.querySelector("#left");
      const rightItem = questionEl.querySelector("#right");

      if (!leftItem || !rightItem) return;

      // Survol gauche
      leftItem.addEventListener("mouseover", () => {
        moveDown(leftItem);
        moveUp(rightItem);
        cssGrowth(leftItem);
        resetCss(rightItem);
        tiltBalanceLeft(leftItem);
      });

      leftItem.addEventListener("mouseleave", () => {
        resetPosition(leftItem);
        resetPosition(rightItem);
        resetCss(leftItem);
        resetCss(rightItem);
        resetBalance(leftItem);
      });

      // Survol droite
      rightItem.addEventListener("mouseover", () => {
        moveDown(rightItem);
        moveUp(leftItem);
        cssGrowth(rightItem);
        resetCss(leftItem);
        tiltBalanceRight(rightItem);
      });

      rightItem.addEventListener("mouseleave", () => {
        resetPosition(rightItem);
        resetPosition(leftItem);
        resetCss(rightItem);
        resetCss(leftItem);
        resetBalance(rightItem);
      });

      // Clic gauche
      leftItem.addEventListener("click", () => {
        if (index !== currentIndex) return;
        handleClick("left");
      });

      // Clic droite
      rightItem.addEventListener("click", () => {
        if (index !== currentIndex) return;
        handleClick("right");
      });
    });
  }, 500);
};

// Fonction appelée au clic sur une réponse
const handleClick = (side) => {
  const [itemA, itemB] = gameData;

  const isCorrect =
    (side === "left" && itemA.diffValue > itemB.diffValue) ||
    (side === "right" && itemB.diffValue > itemA.diffValue);

  console.log(isCorrect ? "✅ Gagné" : "❌ Perdu");

  if (isCorrect) score++;

  gameData.shift();
  gameData.shift();

  console.log("Score :", score);

  // passe à la prochaine question dans Scrollama
  currentIndex += 2;
};

// Animations visuelles
const moveDown = (item) => {
  const svg = item.querySelector("svg");
  svg.style.transform = `translateY(50px)`;
  svg.style.transition = "all 0.2s ease-out";

  const tige = item.closest("question-element")?.querySelector("#tige");

  if (item.id === "left" && tige) {
    tige.style.transform = "rotate(-10deg)";
    tige.style.transformOrigin = "center center";
    tige.style.transition = "transform 0.2s ease-out";
  } else if (item.id === "right" && tige) {
    tige.style.transform = "rotate(10deg)";
    tige.style.transformOrigin = "center center";
    tige.style.transition = "transform 0.2s ease-out";
  }
};

const moveUp = (item) => {
  const svg = item.querySelector("svg");
  svg.style.transform = `translateY(-50px)`;
  svg.style.transition = "all 0.2s ease-out";

  const tige = item.closest("question-element")?.querySelector("#tige");

  if (item.id === "left" && tige) {
    tige.style.transform = "rotate(10deg)";
    tige.style.transformOrigin = "center center";
    tige.style.transition = "transform 0.2s ease-out";
  } else if (item.id === "right" && tige) {
    tige.style.transform = "rotate(-10deg)";
    tige.style.transformOrigin = "center center";
    tige.style.transition = "transform 0.2s ease-out";
  }
};

const resetPosition = (item) => {
  const svg = item.querySelector("svg");
  svg.style.transform = `translateY(0px)`;
  svg.style.transition = "all 0.2s ease-out";

  const tige = item.closest("question-element")?.querySelector("#tige");

  if (tige) {
    tige.style.transform = "rotate(0deg)";
    tige.style.transition = "transform 0.2s ease-out";
  }
};

const cssGrowth = (item) => {
  item.style.transform = "scale(1.05)";
  item.style.transformOrigin = "center center";
  item.style.transition = "transform 0.2s ease-out";
  item.style.willChange = "transform";
};

const resetCss = (item) => {
  item.style.transform = "scale(1)";
  item.style.transition = "transform 0.2s ease-out";
};

const tiltBalanceLeft = (item) => {
  const tige = item.closest("question-element")?.querySelector("#tige");

  if (tige) {
    tige.style.transform = "rotate(-10deg)";
    tige.style.transition = "transform 0.2s ease-out";
  }
};

const tiltBalanceRight = (item) => {
  const tige = item.closest("question-element")?.querySelector("#tige");

  if (tige) {
    tige.style.transform = "rotate(10deg)";
    tige.style.transition = "transform 0.2s ease-out";
  }
};

const resetBalance = (item) => {
  const tige = item.closest("question-element")?.querySelector("#tige");

  if (tige) {
    tige.style.transform = "rotate(0deg)";
    tige.style.transition = "transform 0.2s ease-out";
  }
};

// Initialisation des sections
const gameInit = () => {
  QuestionSection();
  AnswerSection();
};

export { game };
