const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css">
<style>
.level {
  margin: 0 1rem 1.5rem;
  cursor: pointer;
  justify-content: center;
}
</style>
<div class="level" id="item">
  <div class="level-item">
    <p id="magnitude" class="title is-4">5.6</p>
  </div>
  <div class="level-item">
    <div>
      <p id="location" class="title is-5">S of Central Alaska</p>
      <p id="time" class="heading is-6">123456789</p>
    </div>
  </div>
  <div class="level-item">
    <p id="depth">10km</p>
  </div>
</div>
`;

class ListItem extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.magHTML = this.shadowRoot.querySelector('#magnitude');
    this.locHTML = this.shadowRoot.querySelector('#location');
    this.timHTML = this.shadowRoot.querySelector('#time');
    this.depHTML = this.shadowRoot.querySelector('#depth');
    this._magnitude = '5.5';
    this._location = 'S of Central Alaska';
    this._time = '123456789';
    this._depth = '10km';
  }

  render() {
    if (this._magnitude != this.magHTML.innerHTML) this.magHTML.innerHTML = this._magnitude;
    if (this._location != this.locHTML.innerHTML) this.locHTML.innerHTML = this._location;
    if (this._time != this.timHTML.innerHTML) this.timHTML.innerHTML = this._time;
    if (this._depth != this.depHTML.innerHTML) this.depHTML.innerHTML = this._depth;
  }

  get magnitude() {
    return this._magnitude;
  }

  set magnitude(val) {
    this._magnitude = val;
    this.render();
  }

  get location() {
    return this._location;
  }

  set location(val) {
    this._location = val;
    this.render();
  }

  get time() {
    return this._time;
  }

  set time(val) {
    this._time = val;
    this.render();
  }

  get depth() {
    return this._depth;
  }

  set depth(val) {
    this._depth = val;
    this.render();
  }
}

customElements.define("list-item", ListItem);