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
        <p>Earthquake data provided by: <slot name="api"></slot></p>
        <p>Mapping features provided by: <slot name="map"></slot></p>
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