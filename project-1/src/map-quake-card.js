const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css">
<style>
.is-orange {
  background-color: rgb(231, 105, 2);
  border-color: transparent;
  color: #fff;
}

#map-quake-card {
  position: absolute;
  bottom: 10px;
  left: 450px;
  width: 330px;
  z-index: 2;
  transition: all 300ms ease;
}
#map-quake-card.collapsed {
  left: 20px;
}
@media screen and (max-width: 440px) {
  #map-quake-card.collapsed {
    left: 0px !important;
    width: 100%;
  }
}

.horizontal-labels {
  display: grid;
  grid-template-columns: 33% 67%;
}
.horizontal-labels p {
  font-size: .95rem;
}

.buttons-right {
  display: flex;
  justify-content: flex-end;
  margin-top: .8rem;
}
.buttons-right button {
  margin: 0 .5rem;
}

/* https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript */
#type::first-letter {
  text-transform: capitalize;
}
</style>
<div id="map-quake-card">
      <div class="box">
        <h1 class="title is-5" id="place">M 1.2 - 5km WSW of Anguanga, CA</h1>
        <h2 class="subtitle" id="type">Earthquake</h2>
        <div class="horizontal-labels">
          <div class="labels">
            <p>Time:</p>
            <p>Location:</p>
            <p>Magnitude:</p>
            <p>Depth:</p>
          </div>
          <div class="label-content">
            <p id="time">2022-02-28 12:00:06 (UTC)</p>
            <p id="location">59.991N 152.463W</p>
            <p id="magnitude">1.2</p>
            <p id="depth">100.1km</p>
          </div>
        </div>
        <div class="buttons-right">
          <button class="button is-orange" id="favorite-btn">Favorite</button>
          <button class="button is-link" id="close-btn">Close</button>
        </div>
      </div>
    </div>
`;

class MapQuakeCard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._place = 'S of Central Alaska';
    this._type = 'Earthquake';
    this._magnitude = '5.5';
    this._location = 'S of Central Alaska';
    this._time = '123456789';
    this._depth = '10km';
  }

  connectedCallback() {
    this.placeHTML = this.shadowRoot.querySelector('#place');
    this.typeHTML = this.shadowRoot.querySelector('#type');
    this.magHTML = this.shadowRoot.querySelector('#magnitude');
    this.locHTML = this.shadowRoot.querySelector('#location');
    this.timHTML = this.shadowRoot.querySelector('#time');
    this.depHTML = this.shadowRoot.querySelector('#depth');
    this.closeButton = this.shadowRoot.querySelector('#close-btn');
    this.favoriteButton = this.shadowRoot.querySelector('#favorite-btn');
    this.div = this.shadowRoot.querySelector('#map-quake-card');
  }

  render() {
    if (this._place != this.placeHTML.innerHTML) this.placeHTML.innerHTML = this._place;
    if (this._type != this.typeHTML.innerHTML) this.typeHTML.innerHTML = this._type;
    if (this._magnitude != this.magHTML.innerHTML) this.magHTML.innerHTML = this._magnitude;
    if (this._location != this.locHTML.innerHTML) this.locHTML.innerHTML = this._location;
    if (this._time != this.timHTML.innerHTML) this.timHTML.innerHTML = this._time;
    if (this._depth != this.depHTML.innerHTML) this.depHTML.innerHTML = this._depth;
  }

  get place() {
    return this._place;
  }

  set place(val) {
    this._place = val;
    this.render();
  }

  get type() {
    return this._type;
  }

  set type(val) {
    this._type = val;
    this.render();
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

  get id() {
    return this._id;
  }

  set id(val) {
    this._id = val;
  }
}

customElements.define("map-quake-card", MapQuakeCard);