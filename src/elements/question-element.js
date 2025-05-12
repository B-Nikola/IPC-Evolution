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
    <link rel="stylesheet" href="./question-element.css">
    <div class="game-container">
      <div id="center">
        <svg class="balance-svg">
                  <!-- Tige -->
          <image class="tige" id="tige" href="./src/balance/tige.svg" />
          <!-- Socle -->
          <image class="socle" href="./src/balance/socle.svg" />

        </svg>
      </div>
      <div id="left">
        <svg class="plateau" width="120" height="160">
          <image  href="${this.getAttribute(
            "left"
          )}" x="10" y="0" width="100" height="100" />
          <image  href="./src/balance/plateau.svg" x="10" y="60" width="100" height="60" />
        </svg>
      </div>
      <div id="right">
        <svg class="plateau" width="120" height="160">
          <image href="${this.getAttribute(
            "right"
          )}" x="10" y="0" width="100" height="100" />
          <image href="./src/balance/plateau.svg" x="10" y="60" width="100" height="60" />
        </svg>
      </div>
    </div>
  `;
  }
}

customElements.define("question-element", QuestionElement);
