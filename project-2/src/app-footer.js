const template = document.createElement("template");
template.innerHTML = `
<style>
footer{
    color: white;
    background-color: #181818;
    padding: .5rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    column-gap: 5rem;
}

#features p {
    margin-bottom: .4rem;
}
#features p:not(:first-child) {
    margin-top: .4rem;
}
</style>
<footer>
    <p id="name">&copy; <slot name="year">2022</slot> Nathan Wildofsky</p>
    <div id="features">
        <p>The images and music used in this project are not my own.</p>
        <p>The artist of the donut shop scene is: <slot></slot></p>
        <p>The artists of the lofi music used are linked in documentation.</p>
    </div>
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