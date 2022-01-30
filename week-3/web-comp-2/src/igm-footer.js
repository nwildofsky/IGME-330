const template = document.createElement("template");
template.innerHTML = `
    <style>    
    :host{
        display: block;
        background-color: #ddd;

    }
    span{
        color: #F76902;
        font-variant: small-caps;
        font-weight: bolder;
        font-family: sans-serif;
        user-select: none;
    }
    hr{
        border: 3px solid red;
        background: red;
    }
    </style>
    <span></span>
    <hr>
`;

class IGMFooter extends HTMLElement {
    constructor() {
        super();

        // 1 - attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
        this.attachShadow({ mode: "open" });

        // 2 - clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // put this at the end of the constructor
        if (!this.dataset.year) this.dataset.year = 1989;
        if (!this.dataset.text) this.dataset.text = "Bill & Ted";

        // This line of code will create an property named `span` for us, so that we don't have to keep calling this.shadowRoot.querySelector("span");
        this.span = this.shadowRoot.querySelector("span");
        this.count = 0;
    }

    // 3 - called when the component is added to the page
    connectedCallback() {
        this.span.onclick = () => {
            this.count += 1;
            let year = +this.dataset.year + 1;
            this.dataset.year = year;

        };
        this.shadowRoot.querySelector("hr").onclick = () => {
            this.remove();
        }
        this.render();
    }

    disconnectedCallback() {
        this.span.onclick = null;
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    static get observedAttributes() {
        return ["data-year", "data-text"];
    }

    // 4 - a helper method to display the values of the attributes
    render() {
        // grab the attribute values, and assign a default value if necessary
        const year = this.getAttribute("data-year") ? this.getAttribute("data-year") : "1995";
        const text = this.getAttribute("data-text") ? this.getAttribute("data-text") : "Nobody";

        this.shadowRoot.querySelector("span").innerHTML = `&copy; Copyright ${year}, ${text}, Count: ${this.count}`;
    }
}

customElements.define('igm-footer', IGMFooter);