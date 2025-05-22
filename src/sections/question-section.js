import { scroll } from "../scroll.js";
import "../elements/answer-element.js";

export function QuestionSection() {
  const scrollySteps = document.querySelector("#scrolly .scrolly-steps");
  const questions = [
    {
      question: "Pain vs Viennoiseries et produits de pâtisserie",
      option1: "Pain",
      option2: "Viennoiseries et produits de pâtisserie",
      reponse: "pain",
    },
    {
      question: "Riz vs Pâtes alimentaires",
      option1: "Riz",
      option2: "Pâtes alimentaires",
    },
    {
      question: "Viande de bœuf vs Viande de volaille",
      option1: "Viande de bœuf",
      option2: "Viande de volaille",
    },
    {
      question: "Poissons frais vs Poissons congelés",
      option1: "Poissons frais",
      option2: "Poissons congelés",
    },
    {
      question: "Beurre vs Margarine",
      option1: "Beurre",
      option2: "MargarineMargarine, graisses, huiles comestibles",
    },
    {
      question: "Eaux minérales vs Boissons sucrées",
      option1: "Eaux minérales",
      option2: "Boissons sucrées",
    },
    {
      question: "Vin rouge vs Vin blanc",
      option1: "Vin rouge",
      option2: "Vin blanc",
    },
    {
      question: "Chaussures pour hommes vs Chaussures pour femmes",
      option1: "Chaussures pour hommes",
      option2: "Chaussures pour femmes",
    },
    { question: "Diesel vs Essence", option1: "Diesel", option2: "Essence" },
    {
      question: "Voitures neuves vs Voitures d’occasion",
      option1: "Voitures neuves",
      option2: "Voitures d’occasion",
    },
    {
      question: "Pain vs Pizzas et quiches",
      option1: "Pain",
      option2: "Pizzas et quiches",
    },
    {
      question: "Produits de biscuiterie vs Chocolat",
      option1: "Produits de biscuiterie",
      option2: "Chocolat",
    },
    { question: "Crème vs Beurre", option1: "Crème", option2: "Beurre" },
    {
      question: "Jus de fruits vs Fruits entiers",
      option1: "Jus de fruits ou de légumes",
      option2: "Fruits",
    },
    {
      question: "Café (commerce de détail) vs Thé (commerce de détail)",
      option1: "Café (commerce de détail)",
      option2: "Thé (commerce de détail)",
    },
    {
      question: "Spiritueux vs Bière (commerce de détail)",
      option1: "Spiritueux (commerce de détail)",
      option2: "Bière (commerce de détail)",
    },
    {
      question: "Vêtements pour hommes vs Vêtements pour femmes",
      option1: "Vêtements pour hommes",
      option2: "Vêtements pour femmes",
    },
    { question: "Electricité vs Gaz", option1: "Electricité", option2: "Gaz" },
    {
      question: "Pellets de bois vs Bûches de bois",
      option1: "Pellets de bois",
      option2: "Bûches de bois",
    },

    {
      question: "Services postaux vs Communication réseau mobile",
      option1: "Services postaux",
      option2: "Communication réseau mobile",
    },
    {
      question: "Livres fiction vs Livres scolaires",
      option1: "Livres fictions",
      option2: "Livres scolaires et éducatifs",
    },
    {
      question: "Téléviseurs vs Cinéma",
      option1: "Téléviseurs",
      option2: "Cinéma",
    },
    {
      question: "Ordinateurs personnels vs Equipement et matériel téléphonique",
      option1: "Ordinateurs personnels",
      option2: "Equipement et matériel téléphonique",
    },
    {
      question: "Taxi vs Transports aériens",
      option1: "Taxi",
      option2: "Transports aériens",
    },
    { question: "Fruits vs Légumes", option1: "Fruits", option2: "Légumes" },
    {
      question: "Boissons alcoolisées vs Tabac",
      option1: "Boissons alcoolisées",
      option2: "Tabac",
    },
    {
      question: "Vin (commerce de détail) vs Bière (commerce de détail)",
      option1: "Vin (commerce de détail)",
      option2: "Bière (commerce de détail)",
    },
    {
      question: "Bicyclettes électriques vs Bicyclettes",
      option1: "Bicyclettes électriques",
      option2: "Bicyclettes",
    },
    {
      question: "Motocycles vs Bicyclettes",
      option1: "Motocycles",
      option2: "Bicyclettes",
    },
    {
      question:
        "Lave_linge, sèche_linge et lave_vaisselle vs Réfrigérateurs et congélateurs",
      option1: "Lave_linge, sèche_linge et lave_vaisselle",
      option2: "Réfrigérateurs et congélateurs",
    },
  ]; // Ton tableau
  const explications = `
<div class="step explication" data-header="Bienvenue sur le jeu !" data-footer="Prêt ? Fais défiler pour commencer !">
  <div class="explication-contenu">
    <p>
      À chaque étape, une question te sera posée.<br>
      Clique sur le plateau de gauche ou de droite pour choisir ta réponse.<br>
      La balance s’inclinera selon ton choix et tu découvriras la bonne réponse avec une explication.<br>
      Prends le temps de réfléchir et amuse-toi bien&nbsp;!
    </p>
  </div>
</div>`;
  scrollySteps.insertAdjacentHTML("beforeend", explications);

  questions.forEach((q) => {
    // SECTION QUESTION
    const sectionQuestion = document.createElement("section");
    sectionQuestion.classList.add("step");

    const questionElement = document.createElement("question-element");
    questionElement.setAttribute("left", `./src/icones/${q.option1}.svg`);
    questionElement.setAttribute("right", `./src/icones/${q.option2}.svg`);
    questionElement.setAttribute("currentQuestion", q.question);
    questionElement.setAttribute("footer", "Répondez à la question");

    sectionQuestion.appendChild(questionElement);
    scrollySteps.appendChild(sectionQuestion);

    // SECTION REPONSE
    const sectionAnswer = document.createElement("section");
    sectionAnswer.classList.add("step");

    const answerElement = document.createElement("answer-element");
    answerElement.setAttribute("currentAnswer", q.reponse || "");
    answerElement.setAttribute("footer", "Prêt pour la prochaine question ?");

    sectionAnswer.appendChild(answerElement);
    scrollySteps.appendChild(sectionAnswer);
  });

  // Lance Scrollama après que toutes les sections soient prêtes
  requestAnimationFrame(() => {
    scroll();
  });
}
