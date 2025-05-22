// Remet la page en haut au rechargement
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

export function scroll() {
  const scroller = scrollama(); // Initialise Scrollama
  let isScrolling = false; // Empêche les scrolls multiples
  let currentStepIndex = 0; // Index de la question en cours

  const steps = document.querySelectorAll(".step"); // Chaque étape = une question

  // Configure Scrollama
  scroller
    .setup({
      step: ".step", // Les éléments à surveiller
      offset: 0.5,   // Déclenchement quand l'élément est au milieu
    })
.onStepEnter((response) => {
  const el = response.element;
  el.classList.add("is-active");

  const footer = document.querySelector("h3");
  const title = document.querySelector("h1");
  
  // First define questionEl
  const questionEl = el.querySelector("question-element");
  
  // Then use it to access option values
  const option1 = questionEl?.getAttribute("option1");
  const option2 = questionEl?.getAttribute("option2");
  
    // Pour les questions/réponses
  const questionText = questionEl?.getAttribute("currentQuestion");
  
  if (title && questionText) {
    title.textContent = questionText;
  }

  // Si c'est l'explication, utilise les data-attributes
  if (el.classList.contains("explication")) {
    if (title) title.textContent = el.getAttribute("data-header") || "Explication du jeu";
    if (footer) footer.textContent = el.getAttribute("data-footer") || "";
    // Masque la balance si besoin
    const balance = document.querySelector("#center");
    if (balance) balance.style.display = "none";
    return;
  } else {
    // Affiche la balance sur les autres étapes
    const balance = document.querySelector("#center");
    if (balance) balance.style.display = "";
  }



  if (footer) {
    const footerText = questionEl?.getAttribute("footer");
    footer.textContent = footerText;
  }

  // Affiche la réponse (si elle existe dans l'étape)
  const answerEl = el.querySelector("answer-element");
  if (answerEl) {
    answerEl.classList.add("is-visible");
    const footerText = answerEl?.getAttribute("footer");
    if (footer && footerText) {
      footer.textContent = footerText;
    }
  }

  // Enregistre l'index de l'étape actuelle
  currentStepIndex = [...document.querySelectorAll(".step")].indexOf(el);
});

  scroller.resize(); // Recalcule les positions

  // Force l'affichage immédiat de la première question
  const firstStep = document.querySelector(".step");
  if (firstStep) {
    const title = document.querySelector("h1");
    const questionEl = firstStep.querySelector("question-element");
    const questionText = questionEl?.getAttribute("currentQuestion");

    if (title && questionText) {
      title.textContent = questionText;
    }

    currentStepIndex = 0;
    firstStep.classList.add("is-active");

    const firstAnswer = firstStep.querySelector("answer-element");
    if (firstAnswer) {
      firstAnswer.classList.add("is-visible");
    }
  }

  // Fonction pour scroller vers une étape précise
  function goToStep(index) {
    if (index >= 0 && index < steps.length) {
      steps[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Mise à jour après décalage
      setTimeout(() => {
        scroller.resize();
        currentStepIndex = index;
      }, 500);
    }
  }

  // Scroll avec la molette
  document.addEventListener(
    "wheel",
    (e) => {
      if (isScrolling || Math.abs(e.deltaY) < 5) return;

      isScrolling = true;
      e.preventDefault();

      if (e.deltaY > 0) {
        goToStep(currentStepIndex + 1);
      } else {
        goToStep(currentStepIndex - 1);
      }

      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    },
    { passive: false }
  );

  // Navigation au clavier (flèches haut/bas)
  document.addEventListener("keydown", (e) => {
    if (isScrolling) return;

    if (e.key === "ArrowDown") {
      isScrolling = true;
      goToStep(currentStepIndex + 1);
    } else if (e.key === "ArrowUp") {
      isScrolling = true;
      goToStep(currentStepIndex - 1);
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setTimeout(() => {
        isScrolling = false;
      }, 700);
    }
  });

  window.addEventListener("resize", scroller.resize); // Recalcule en cas de redimensionnement
}
