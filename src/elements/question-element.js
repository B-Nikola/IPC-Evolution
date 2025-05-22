class QuestionElement extends HTMLElement {
  static get observedAttributes() {
    return ["currentQuestion", "footer", "left", "right"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
<div class="game-container">
  <div id="center">
    <svg class="balance-svg" width="300" height="400">
      <!-- Tige -->
      <image class="tige" id="tige" href="./src/balance/tige.svg" />
      <!-- Socle -->
      <image class="socle" id="socle" href="./src/balance/socle.svg" />
    </svg>

    <!-- Plateaux déplacés ici -->
    <svg class="plateau left-plateau" width="120" height="160">
      <image href="${this.getAttribute("left")}"  x="10" y="0" width="100" height="100" />
      <image href="./src/balance/plateau.svg" x="10" y="60" width="100" height="60" />
    </svg>
    <svg class="plateau right-plateau" width="120" height="160">
      <image href="${this.getAttribute("right")}" x="10" y="0" width="100" height="100" />
      <image href="./src/balance/plateau.svg" x="10" y="60" width="100" height="60" />
    </svg>
  </div>

  <!-- Ces divs restent pour la couleur et les événements -->
  <div id="left"></div>
  <div id="right"></div>
</div>

  `;
  }
}

customElements.define("question-element", QuestionElement);
