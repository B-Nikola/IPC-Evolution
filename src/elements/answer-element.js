class AnswerElement extends HTMLElement {
  static get observedAttributes() {return ["currentAnswer","footer"];} 
  connectedCallback() {

    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <div class="game-container">
reponse:${this.getAttribute("currentAnswer")}
          </div>
         `;
  }
}

customElements.define("answer-element", AnswerElement);
