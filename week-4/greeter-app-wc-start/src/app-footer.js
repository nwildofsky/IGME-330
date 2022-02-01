const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
footer {
  user-select: none;
}
</style>
<footer class="footer p-1 has-background-grey-lighter has-text-dark">
		<div class="content has-text-centered">
			<p>
				<strong>Greeter</strong> by Ace Coder
			</p>
		</div>
	</footer>
`;

class AppFooter extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  
  connectedCallback(){
    this._counter = 0;

    this.onclick = () => {
      this._counter++;
      this.render();
    };

    this.render();
  }

  // NEW
  static get observedAttributes() {
    return ["data-text"];
  }

  attributeChangedCallback(attributeName, oldVal, newVal) {
    console.log(attributeName, oldVal, newVal);
    this.render();
  }

  render(){
    const text = this.dataset["text"] || "Nobody";
    this.shadowRoot.querySelector("footer p").innerHTML = `
    <b>Greeter</b> by ${text} - Count = ${this._counter}
    `;
  }
} 

customElements.define('app-footer', AppFooter);