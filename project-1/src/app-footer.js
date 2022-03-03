const template = document.createElement("template");
template.innerHTML = `
<style>
footer{
    color: white;
    background-color: black;
    padding: .5rem;
    margin-top: auto;
}
</style>
<footer>
    &copy; 2022 Nathan Wildofsky
</footer>
`;

class AppFooter extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define("app-footer", AppFooter);