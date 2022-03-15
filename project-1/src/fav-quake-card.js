const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css">

<style>
.is-orange {
  background-color: rgb(231, 105, 2);
  border-color: transparent;
  color: #fff;
}

:host {
  flex: 1 1 310px;
  max-width: 450px;
}

#map-quake-card .box {
  position: relative;
}

#place {
  width: 90%;
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
button a {
  color: #fff;
}

/* https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript */
#type::first-letter {
  text-transform: capitalize;
}

#map-link {
  position: absolute;
  top: 20px;
  right: 30px;
  width: 25px;
  height: 25px;
  cursor: pointer;
}

@media screen and (max-width: 400px) {
  #place {
    font-size: 1.1rem;
  }
  #type {
    font-size: 1.1rem;
  }
  .horizontal-labels p {
    font-size: .8rem;
  }
  .button {
    font-size: .8rem;
  }
  #map-link {
    right: 20px;
    width: 20px;
    height: 20px;
  }
}
@media screen and (max-width: 345px) {
  :host {
    width: 100%;
  }
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
      <button class="button is-orange" id="favorite-btn">Remove</button>
      <button class="button is-link"><a href="" id="learn-more">Learn More</a></button>
    </div>

    <div id="map-link">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M408 120C408 174.6 334.9 271.9 302.8 311.1C295.1 321.6 280.9 321.6 273.2 311.1C241.1 271.9 168 174.6 168 120C168 53.73 221.7 0 288 0C354.3 0 408 53.73 408 120zM288 152C310.1 152 328 134.1 328 112C328 89.91 310.1 72 288 72C265.9 72 248 89.91 248 112C248 134.1 265.9 152 288 152zM425.6 179.8C426.1 178.6 426.6 177.4 427.1 176.1L543.1 129.7C558.9 123.4 576 135 576 152V422.8C576 432.6 570 441.4 560.9 445.1L416 503V200.4C419.5 193.5 422.7 186.7 425.6 179.8zM150.4 179.8C153.3 186.7 156.5 193.5 160 200.4V451.8L32.91 502.7C17.15 508.1 0 497.4 0 480.4V209.6C0 199.8 5.975 190.1 15.09 187.3L137.6 138.3C140 152.5 144.9 166.6 150.4 179.8H150.4zM327.8 331.1C341.7 314.6 363.5 286.3 384 255V504.3L192 449.4V255C212.5 286.3 234.3 314.6 248.2 331.1C268.7 357.6 307.3 357.6 327.8 331.1L327.8 331.1z"/></svg>
    </div>
  </div>
</div>
`;

class FavQuakeCard extends HTMLElement {
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
    this._link = 'https://';
  }

  connectedCallback() {
    this.placeHTML = this.shadowRoot.querySelector('#place');
    this.typeHTML = this.shadowRoot.querySelector('#type');
    this.magHTML = this.shadowRoot.querySelector('#magnitude');
    this.locHTML = this.shadowRoot.querySelector('#location');
    this.timHTML = this.shadowRoot.querySelector('#time');
    this.depHTML = this.shadowRoot.querySelector('#depth');
    this.linkHTML = this.shadowRoot.querySelector('#learn-more');
    this.favoriteButton = this.shadowRoot.querySelector('#favorite-btn');
    this.mapLink = this.shadowRoot.querySelector('#map-link');
  }

  render() {
    if (this._place != this.placeHTML.innerHTML) this.placeHTML.innerHTML = this._place;
    if (this._type != this.typeHTML.innerHTML) this.typeHTML.innerHTML = this._type;
    if (this._magnitude != this.magHTML.innerHTML) this.magHTML.innerHTML = this._magnitude;
    if (this._location != this.locHTML.innerHTML) this.locHTML.innerHTML = this._location;
    if (this._time != this.timHTML.innerHTML) this.timHTML.innerHTML = this._time;
    if (this._depth != this.depHTML.innerHTML) this.depHTML.innerHTML = this._depth;
    if (this._link != this.linkHTML.href) this.linkHTML.href = this._link;
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

  get link() {
    return this._link;
  }

  set link(val) {
    this._link = val;
    this.render();
  }
}

customElements.define("fav-quake-card", FavQuakeCard);