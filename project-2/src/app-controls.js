import * as audio from './audio.js';

const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css">
<style>
#controls{
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin-left: 1rem;
  padding: 1rem;
  width: fit-content;
  height: fit-content;
  background-color: rgb(23, 23, 23);
  border-radius: 10px;
}

#controls section{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: fit-content;
  align-items: center;
  column-gap: 2.7rem;
  row-gap: .5rem;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #8cd3d6;
}
#reset-btn {
  width: fit-content;
}

.select {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: fit-content;
  align-items: center;
  column-gap: .3rem;
  margin: 0;
}
.select label {
  order: 0;
}

.button.is-success {
  background-color: #2edf84 !important;
  color: black !important;
}
.button.is-success:hover {
  background-color: #189b57 !important;
  color: black !important;
}
.button.is-success:active {
  background-color: #8cd3d6 !important;
  color: black !important;
}

.checkbox:hover {
  color: #8cd3d6;
}

button[data-playing="yes"]:after{
  content: "Pause";
}

button[data-playing="no"]:after{
  content: "Play";
}

.slider {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: fit-content;
  align-items: center;
  column-gap: .3rem;
  margin: 0;
}

input[type = 'range'], input[type = 'checkbox'] {
  accent-color: #2edf84;
}
</style>
<div id="controls">
  <section>
    <button id="play-btn" class="button is-success" data-playing="no"></button>

    <div class="select is-success">
      <label for="sl-track">Track:</label>
      <select id="sl-track">
      <option value="media/sincere.mp3" selected>Sincere</option>
      <option value="media/rain-on-sunday.mp3">Rain on Sunday</option>
      <option value="media/planet-buddies.mp3">Planet Buddies</option>
      <option value="media/mist.mp3">Mist</option>
      <option value="media/dusk.mp3">Dusk</option>
      <option value="media/mourning-dove.mp3">Mourning Dove</option>

      </select>
    </div>

    <div class="slider">
      <span>Volume: </span>
      <input type="range" id="volume" min="0" max="2" value="1" step="0.01">
      <span id="volume-label">???</span>
    </div>
  </section>

  <section>
    <label class="checkbox">
      <input type="checkbox" id="cb-rrain" checked>
      Random Rain
    </label>

    <div class="slider">
      <span>Rain Density: </span>
      <input type="range" id="rain-density" min=".00001" max="3" value="1" step="0.001">
      <span id="density-label">???</span>
    </div>

    <div class="slider">
      <span>Rain Size: </span>
      <input type="range" id="rrain-size" min="0" max="3" value=".25" step="0.01">
      <span id="rsize-label">???</span>
    </div>

    <div class="slider">
      <span>Rain Speed: </span>
      <input type="range" id="rrain-speed" min=".01" max="2" value=".6" step="0.01">
      <span id="rspeed-label">???</span>
    </div>

    <div class="slider">
      <span>Rain Opacity: </span>
      <input type="range" id="rrain-opacity" min="0" max="1" value=".15" step="0.01">
      <span id="ropacity-label">???</span>
    </div>
  </section>

  <section>
    <label class="checkbox">
      <input type="checkbox" id="cb-mrain" checked>
      Music Synched Rain
    </label>

    <div class="slider">
      <span>Music Threshold: </span>
      <input type="range" id="threshold" min="0" max="1" value=".34" step="0.01">
      <span id="threshold-label">???</span>
    </div>

    <div class="slider">
      <span>Rain Size: </span>
      <input type="range" id="mrain-size" min="0" max="6" value="3.9" step="0.01">
      <span id="msize-label">???</span>
    </div>

    <div class="slider">
      <span>Rain Speed: </span>
      <input type="range" id="mrain-speed" min=".01" max="2" value=".3" step="0.01">
      <span id="mspeed-label">???</span>
    </div>

    <div class="slider">
      <span>Rain Opacity: </span>
      <input type="range" id="mrain-opacity" min="0" max="1" value=".35" step="0.01">
      <span id="mopacity-label">???</span>
    </div>
  </section>

  <section>
    <label class="checkbox">
      <input type="checkbox" id="cb-flicker" checked>
      Flickering Lamp
    </label>

    <label class="checkbox">
      <input type="checkbox" id="cb-lights" checked>
      Color Changing City Lights
    </label>

    <label class="checkbox">
      <input type="checkbox" id="cb-donut" checked>
      Bass Synched Donut
    </label>
  </section>

  <button id="reset-btn" class="button is-success">Reset Parameters</button>
</div>
`;

class AppControls extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.drawParams = {};
  }

  connectedCallback() {
    // Get control elements
    this.densitySlider = this.shadowRoot.querySelector('#rain-density');
    this.densityLabel = this.shadowRoot.querySelector('#density-label');
    this.rSizeSlider = this.shadowRoot.querySelector('#rrain-size');
    this.rSizeLabel = this.shadowRoot.querySelector('#rsize-label');
    this.rSpeedSlider = this.shadowRoot.querySelector('#rrain-speed');
    this.rSpeedLabel = this.shadowRoot.querySelector('#rspeed-label');
    this.rOpacitySlider = this.shadowRoot.querySelector('#rrain-opacity');
    this.rOpacityLabel = this.shadowRoot.querySelector('#ropacity-label');
    this.thresholdSlider = this.shadowRoot.querySelector('#threshold');
    this.thresholdLabel = this.shadowRoot.querySelector('#threshold-label');
    this.mSizeSlider = this.shadowRoot.querySelector('#mrain-size');
    this.mSizeLabel = this.shadowRoot.querySelector('#msize-label');
    this.mSpeedSlider = this.shadowRoot.querySelector('#mrain-speed');
    this.mSpeedLabel = this.shadowRoot.querySelector('#mspeed-label');
    this.mOpacitySlider = this.shadowRoot.querySelector('#mrain-opacity');
    this.mOpacityLabel = this.shadowRoot.querySelector('#mopacity-label');
    this.rRainCB = this.shadowRoot.querySelector('#cb-rrain');
    this.mRainCB = this.shadowRoot.querySelector('#cb-mrain');
    this.flickerCB = this.shadowRoot.querySelector('#cb-flicker');
    this.lightsCB = this.shadowRoot.querySelector('#cb-lights');
    this.donutCB = this.shadowRoot.querySelector('#cb-donut');
    this.playButton = this.shadowRoot.querySelector("#play-btn");
    this.trackSelect = this.shadowRoot.querySelector('#sl-track');
    this.volumeSlider = this.shadowRoot.querySelector('#volume');
    this.volumeLabel = this.shadowRoot.querySelector('#volume-label');
    this.resetButton = this.shadowRoot.querySelector('#reset-btn');

    // Hookup play/pause button
    this.playButton.onclick = e => {
      console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

      // check if context is in suspended state (autoplay policy)
      if (audio.audioCtx.state == 'suspended') {
        audio.audioCtx.resume();
      }
      console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
      if (e.target.dataset.playing == 'no') {
        // if track is currently paused, play it
        audio.playCurrentSound();
        e.target.dataset.playing = 'yes'; // our CSS will set the text to pause
        this.drawParams.playing = true;
      }
      // if track is playing, pause it
      else {
        audio.pauseCurrentSound();
        e.target.dataset.playing = 'no'; // our CSS will set the text to play
        this.drawParams.playing = false;
      }
    };

    // Hookup tack <select>
    // add .onchange event to <select>
    this.trackSelect.onchange = e => {
      audio.loadSoundFile(e.target.value);
      // pause the current track if it is playing
      if (this.playButton.dataset.playing == 'yes') {
        this.playButton.dispatchEvent(new MouseEvent('click'));
      }
    };

    // Hookup volume slider & label
    // add .oninput event to slider
    this.volumeSlider.oninput = e => {
      // set the gain
      audio.setVolume(e.target.value);
      // update volume of label to match value of slider
      this.volumeLabel.innerHTML = Math.round(e.target.value / 2 * 100);
    };
    // set value of label to match initial value of slider
    this.volumeSlider.dispatchEvent(new Event('input'));

    // Hookup rain sliders and their labels
    // Random rain sliders
    this.densitySlider.oninput = e => {
      this.drawParams.rainDensity = Number(1 / e.target.value);
      this.densityLabel.innerHTML = Math.round(e.target.value / 3 * 100);
    };

    this.rSizeSlider.oninput = e => {
      this.drawParams.rRainSize = Number(e.target.value);
      this.rSizeLabel.innerHTML = Math.round(e.target.value / 3 * 100);
    };

    this.rSpeedSlider.oninput = e => {
      this.drawParams.rRainSpeed = Number(e.target.value);
      this.rSpeedLabel.innerHTML = Math.round(e.target.value / 2 * 100);
    };

    this.rOpacitySlider.oninput = e => {
      this.drawParams.rRainOpacity = Number(e.target.value);
      this.rOpacityLabel.innerHTML = Math.round(e.target.value * 100);
    };

    // Music synched rain sliders
    this.thresholdSlider.oninput = e => {
      this.drawParams.rainThreshold = Number(e.target.value);
      this.thresholdLabel.innerHTML = Math.round(e.target.value * 100);
    };

    this.mSizeSlider.oninput = e => {
      this.drawParams.mRainSize = Number(e.target.value);
      this.mSizeLabel.innerHTML = Math.round(e.target.value / 6 * 100);
    };

    this.mSpeedSlider.oninput = e => {
      this.drawParams.mRainSpeed = Number(e.target.value);
      this.mSpeedLabel.innerHTML = Math.round(e.target.value / 2 * 100);
    };

    this.mOpacitySlider.oninput = e => {
      this.drawParams.mRainOpacity = Number(e.target.value);
      this.mOpacityLabel.innerHTML = Math.round(e.target.value / 2 * 100);
    };

    // Hookup checkboxes
    this.rRainCB.onchange = e => {
      this.drawParams.showRRain = !this.drawParams.showRRain;
    }
    this.mRainCB.onchange = e => {
      this.drawParams.showMRain = !this.drawParams.showMRain;
    }
    this.flickerCB.onchange = e => {
      this.drawParams.showFlicker = !this.drawParams.showFlicker;
    }
    this.lightsCB.onchange = e => {
      this.drawParams.showLights = !this.drawParams.showLights;
    }
    this.donutCB.onchange = e => {
      this.drawParams.showDonut = !this.drawParams.showDonut;
    }
  }

  disconnectedCallback() {
    // Disconnect all event handlers when this component is removed from the page
    this.densitySlider.oninput = null;
    this.rSizeSlider.oninput = null;
    this.rSpeedSlider.oninput = null;
    this.rOpacitySlider.oninput = null;
    this.thresholdSlider.oninput = null;
    this.mSizeSlider.oninput = null;
    this.mSpeedSlider.oninput = null;
    this.rRainCB.onchange = null;
    this.mRainCB.onchange = null;
    this.flickerCB.onchange = null;
    this.lightsCB.onchange = null;
    this.donutCB.onchange = null;
  }

  // Use a defaults json object to reset every parameter that manipulates the scene
  reset(defaults) {
    // Reset random rain options
    this.rRainCB.checked = defaults.showRRain;
    this.drawParams.showRRain = defaults.showRRain;
    this.densitySlider.value = defaults.rainDensity;
    this.densitySlider.dispatchEvent(new Event('input'));
    this.rSizeSlider.value = defaults.rRainSize;
    this.rSizeSlider.dispatchEvent(new Event('input'));
    this.rSpeedSlider.value = defaults.rRainSpeed;
    this.rSpeedSlider.dispatchEvent(new Event('input'));
    this.rOpacitySlider.value = defaults.rRainOpacity;
    this.rOpacitySlider.dispatchEvent(new Event('input'));

    // Reset synched rain options
    this.mRainCB.checked = defaults.showMRain;
    this.drawParams.showMRain = defaults.showMRain;
    this.thresholdSlider.value = defaults.rainThreshold;
    this.thresholdSlider.dispatchEvent(new Event('input'));
    this.mSizeSlider.value = defaults.mRainSize;
    this.mSizeSlider.dispatchEvent(new Event('input'));
    this.mSpeedSlider.value = defaults.mRainSpeed;
    this.mSpeedSlider.dispatchEvent(new Event('input'));
    this.mOpacitySlider.value = defaults.mRainOpacity;
    this.mOpacitySlider.dispatchEvent(new Event('input'));

    // Reset additional checkbox options
    this.flickerCB.checked = defaults.showFlicker;
    this.drawParams.showFlicker = defaults.showFlicker;
    this.lightsCB.checked = defaults.showLights;
    this.drawParams.showLights = defaults.showLights;
    this.donutCB.checked = defaults.showDonut;
    this.drawParams.showDonut = defaults.showDonut;
  }
}

customElements.define("app-controls", AppControls);