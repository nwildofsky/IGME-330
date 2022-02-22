const template = document.createElement("template");
template.innerHTML = `
<style>
header{
    color: white;
    background-color: black;
    padding: .5rem;
    margin-top: .5rem;
}
</style>
<header>
Custom Header
</header>
`;

class CustomHeader extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define("custom-header", CustomHeader);