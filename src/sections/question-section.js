import { scroll } from "../scroll.js";
import "../elements/answer-element.js";
import { questions } from "../../data/questions.js";

export function QuestionSection() {
  
  const scrollySteps = document.querySelector("#scrolly .scrolly-steps");

   const explications = `
<div class="step explication" data-header="Bienvenue sur le jeu !" data-footer="Prêt ? Fais défiler pour commencer !">
  <div class="explication-contenu">
    <p>
      À chaque étape, il faut choisir entre les deux options donner la quelle a subbit la plus grande inflation.<br>
      Clique sur le plateau de gauche ou de droite pour choisir ta réponse.<br>
      La balance s’inclinera selon ton choix et tu découvriras la bonne réponse avec une explication.<br>
      Sur le graphique continue en survolant chaque point vous obtiendrer le détail de la valeur et en cliquand sur ce dernier vous effecturer une recherche pour chercher les raisons potentielle du changement de l'IPC.
      En cliquant sur le titre d'une des deux courbes vous pouvez la cacher pour mieux voir la valeur de la seconde.
      
      
      Prends le temps de réfléchir et amuse-toi bien&nbsp;!
    </p>
  </div>
</div>`;
  scrollySteps.insertAdjacentHTML("beforeend", explications);
  let id = 0;
  questions.forEach((q) => {
    // SECTION QUESTION
    const sectionQuestion = document.createElement("section");
    sectionQuestion.classList.add("step");

    const questionElement = document.createElement("question-element");
    questionElement.setAttribute("left", `./src/icones/${q.option1}.svg`);
    questionElement.setAttribute("right", `./src/icones/${q.option2}.svg`);
    questionElement.setAttribute("option1", `${q.option1}`);
    questionElement.setAttribute("option2", `${q.option2}`);
    questionElement.setAttribute("currentQuestion", q.question);
    questionElement.setAttribute("footer", "Répondez à la question");

    sectionQuestion.appendChild(questionElement);
    scrollySteps.appendChild(sectionQuestion);

    // SECTION REPONSE
    const sectionAnswer = document.createElement("section");
    sectionAnswer.classList.add("step");

    const answerElement = document.createElement("answer-element");
    answerElement.setAttribute("id", `${id}`);
    
    answerElement.setAttribute("currentAnswer", q.reponse || "");
    answerElement.setAttribute("footer", "Prêt pour la prochaine question ?");

    sectionAnswer.appendChild(answerElement);
    scrollySteps.appendChild(sectionAnswer);
    id++;
  });

  // Lance Scrollama après que toutes les sections soient prêtes
  requestAnimationFrame(() => {
    scroll();
  });
}
