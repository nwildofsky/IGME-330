const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css">
<style>
.level {
  margin: 0 0 1.5rem;
  cursor: pointer;
  justify-content: center;
  width: 100%;
  flex: 1;
}
.level-item {
  flex-direction: column;
  min-width: 50px;
  max-width: 250px;
}
.level-item .text-overflow {
  display: inline-block;
  width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
<div class="level is-mobile" id="item">
  <div class="level-item">
    <p class="heading">Magnitude</p>
    <p id="magnitude" class="subtitle is-4">5.6</p>
  </div>
  <div class="level-item">
    <div>
      <p id="location" class="title is-5 text-overflow">S of Central Alaskaaaaaaaaaaaaaaaaaaaaa</p>
      <p id="time" class="is-size-6 text-overflow">12345678900000000000000000000000000000</p>
    </div>
  </div>
  <div class="level-item">
    <p class="heading">Depth</p>
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