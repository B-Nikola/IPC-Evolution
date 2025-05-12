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
      const el = response.element; // Élément activé
      el.classList.add("is-active");

      // Affiche le texte de la question dans le <h1>
      const questionEl = el.querySelector("question-element");
      const questionText = questionEl?.getAttribute("currentQuestion");
      const title = document.querySelector("h1");
      if (title && questionText) {
        title.textContent = questionText;
      }

      // Affiche le texte de bas de page
      const footer = document.querySelector("h3");
      if (footer) {
        const footerText = questionEl?.getAttribute("footer");
        footer.textContent = footerText;
      }

      // Affiche la réponse (si elle existe dans l'étape)
      const answerEl = el.querySelector("answer-element");
      if (answerEl) {
        answerEl.classList.add("is-visible");

        // Met à jour le footer si l'attribut est défini
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
