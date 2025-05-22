import { gameData, fullData, calculateDiffValue, createComparisonBarGraph, createComparisonLineGraph } from "./dataHandler";
import "./elements/question-element.js";
import { QuestionSection } from "./sections/question-section.js";
import "./elements/answer-element.js";
import { AnswerSection } from "./sections/answer-section.js";


let score = 0;
let currentIndex = 0;
let id = 0;

// Keep track of answered questions
const answeredQuestions = new Set();

const game = () => {
  gameInit();

  // Add event listener to block unwanted scrolling
  document.addEventListener('wheel', preventUnauthorizedScroll, { passive: false });
  document.addEventListener('keydown', preventUnauthorizedKeyScroll);
  
  setTimeout(() => {
    const questionSteps = document.querySelectorAll(".step question-element");

    questionSteps.forEach((questionEl, index) => {
      
      const leftItem = questionEl.querySelector("#left");
      const rightItem = questionEl.querySelector("#right");

      if (!leftItem || !rightItem) return;

      // Événements gauche
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

      
      // Événements droite
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
        handleClick("left");
      });

      // Clic droite
      rightItem.addEventListener("click", () => {
        handleClick("right");
      });
    });
  }, 500);
};

const getPlateauSvg = (item) => {
  const questionEl = item.closest("question-element");
  if (!questionEl) return null;
  if (item.id === "left") {
    return questionEl.querySelector(".left-plateau");
  } else if (item.id === "right") {
    return questionEl.querySelector(".right-plateau");
  }
  return null;
}

// Fonction appelée au clic sur une réponse

const handleClick = (side) => {
  console.log("id : ",id)
  // Find the current step's question element
  const currentQuestionEl = document.querySelectorAll(".step question-element")[currentIndex];
  
  // Get the item that was clicked (left or right)
  const clickedItem = currentQuestionEl.querySelector(`#${side}`);
  
  // Get the other item
  const otherSide = side === "left" ? "right" : "left";
  const otherItem = currentQuestionEl.querySelector(`#${otherSide}`);
  
  // Get data-option values
  const clickedOption = clickedItem.getAttribute("data-option");
  const otherOption = otherItem.getAttribute("data-option");
  
  // Calculate diff values using the data-option values
  const clickedDiffValue = calculateDiffValue(clickedOption);
  const otherDiffValue = calculateDiffValue(otherOption);
  
  
  // Determine if the choice is correct (clicked item has higher diff value)
  const isCorrect = clickedDiffValue > otherDiffValue;

  // Update score if correct
  if (isCorrect) score++;
  
  // Update score display in all score elements
  const scoreElements = document.querySelectorAll(".score");
  scoreElements.forEach(element => {
    element.textContent = `Score: ${score}/30`;
  });
  
  // Remove click event listener from both items to prevent further clicks
  // Remove click event listener from both items to prevent further clicks
  if (clickedItem) {
    clickedItem.style.pointerEvents = "none";
    clickedItem.style.opacity = isCorrect ? "1" : "0.6";
    clickedItem.style.border = isCorrect ? "5px solid green" : "5px solid red";
  }
  
  if (otherItem) {
    otherItem.style.pointerEvents = "none";
    otherItem.style.opacity = "0.6";
  }
    
    // Use setTimeout to ensure the DOM has updated
    setTimeout(() => {
      console.log("Clicked option:", clickedOption ," Other option:", otherOption);
      // Create visualizations using the selected options
      createComparisonLineGraph(clickedOption, otherOption, '#line-'+id);
      createComparisonBarGraph(clickedOption, otherOption, '#bars-'+id);
      
  id++
    }, 300);
  

  // Update current index
  currentIndex +=1;
  
  // Mark this question as answered
  if (currentQuestionEl) {
    answeredQuestions.add(currentIndex);
  }
  
  // Scroll to next step after a delay
  setTimeout(() => {
    
// Find the first step element that doesn't have is-active class
  const allSteps = Array.from(document.querySelectorAll(".step"));
  const nextStep = allSteps.find(step => !step.classList.contains("is-active"));
  
  console.log("nextStep:", nextStep);
  
console.log("nextStep : ",nextStep)
    if (nextStep) {
      nextStep.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }
  }, 200);
  
  
  // Scroll to next step after a delay
  setTimeout(() => {
    
// Find the first step element that doesn't have is-active class
  const allSteps = Array.from(document.querySelectorAll(".step"));
  const nextStep = allSteps.find(step => !step.classList.contains("is-active"));
  
  console.log("nextStep:", nextStep);
  
console.log("nextStep : ",nextStep)
    if (nextStep) {
      nextStep.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }
  }, 200);
};

const moveDown = (item) => {
  const svg = getPlateauSvg(item);
  if (svg) {
    svg.style.transform = `translateY(30px)`;
    svg.style.transition = "all 0.2s ease-out";
  }

  const tige = item.closest("question-element")?.querySelector("#tige");
  if (item.id === "left" && tige) {
    tige.style.transform = "rotate(-10deg)";
  } else if (item.id === "right" && tige) {
    tige.style.transform = "rotate(10deg)";
  }
  if (tige) {
    tige.style.transformOrigin = "center center";
    tige.style.transition = "transform 0.2s ease-out";
  }
};

const moveUp = (item) => {
  const svg = getPlateauSvg(item);
  if (svg) {
    svg.style.transform = `translateY(-30px)`;
    svg.style.transition = "all 0.2s ease-out";
  }

  const tige = item.closest("question-element")?.querySelector("#tige");
  if (item.id === "left" && tige) {
    tige.style.transform = "rotate(10deg)";
  } else if (item.id === "right" && tige) {
    tige.style.transform = "rotate(-10deg)";
  }
  if (tige) {
    tige.style.transformOrigin = "center center";
    tige.style.transition = "transform 0.2s ease-out";
  }
};

const resetPosition = (item) => {
  const svg = getPlateauSvg(item);
  if (svg) {
    svg.style.transform = `translateY(0px)`;
    svg.style.transition = "all 0.2s ease-out";
  }

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

const gameInit = () => {
  QuestionSection();
  AnswerSection();
};

// Function to prevent unauthorized scrolling
function preventUnauthorizedScroll(e) {
  // Always allow scrolling up
  if (e.deltaY < 0) return;
  
  // For scrolling down, check if current question is answered
  if (!answeredQuestions.has(currentIndex)) {
    e.preventDefault();
    e.stopPropagation();
    
    // Optional: add visual feedback that user needs to answer first
    const currentQuestionEl = document.querySelectorAll(".step question-element")[currentIndex];
    if (currentQuestionEl) {
      currentQuestionEl.classList.add('require-answer');
      setTimeout(() => {
        currentQuestionEl.classList.remove('require-answer');
      }, 500);
    }
  }
}

// Function to prevent unauthorized key scrolling
function preventUnauthorizedKeyScroll(e) {
  if (e.key === "ArrowDown" && !answeredQuestions.has(currentIndex)) {
    e.preventDefault();
    e.stopPropagation();
    
    // Optional: add visual feedback
    const currentQuestionEl = document.querySelectorAll(".step question-element")[currentIndex];
    if (currentQuestionEl) {
      currentQuestionEl.classList.add('require-answer');
      setTimeout(() => {
        currentQuestionEl.classList.remove('require-answer');
      }, 500);
    }
  }
}

export { game };