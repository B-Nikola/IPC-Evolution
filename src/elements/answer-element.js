class AnswerElement extends HTMLElement {
  static get observedAttributes() {
    return ["option1", "option2"];
  } 

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const id = this.getAttribute("id") || "";
    
    
    this.innerHTML = `
      <link rel="stylesheet" href="./answer-element.css">
      <div class="score"></div>
      <div class="answer-container">        
        <div class="charts-container">
          <div class="chart-section">
            <h4>Évolution dans le temps</h4>
            <div id="line-${id}" class="line-chart">
              <!-- Line chart will be rendered here -->
            </div>
          </div>
          
          <div class="chart-section">
            <h4>Comparaison des variations</h4>
            <div id="bars-${id}" class="bar-chart">
              <!-- Bar chart will be rendered here -->
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("answer-element", AnswerElement);
