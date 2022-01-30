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
    }
    </style>
    <span></span>
    <hr>
`;

class IGMFooter extends HTMLElement{
    constructor(){
      super();

      // 1 - attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
      this.attachShadow({mode: "open"});

      // 2 - clone `template` and append it
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // 3 - called when the component is added to the page
    connectedCallback() {
        this.render();
    }

    // 4 - a helper method to display the values of the attributes
    render() {
        // grab the attribute values, and assign a default value if necessary
        const year = this.getAttribute("data-year") ? this.getAttribute("data-year") : "1995";
        const text = this.getAttribute("data-text") ? this.getAttribute("data-text") : "Nobody";

        this.shadowRoot.querySelector("span").innerHTML = `&copy; Copyright ${year}, ${text}`;
    }
  } 
	
  customElements.define('igm-footer', IGMFooter);