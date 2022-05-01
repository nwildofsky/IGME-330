/*
    main.js is primarily responsible for hooking up the UI to the rest of the application 
    and setting up the main event loop
*/

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';
import * as ajax from './ajax.js';
import './app-controls.js';

// Parameters that control the drawing of all the elements on the canvas
const drawParams = {
    playing: false,
    showRRain: true,
    rainDensity: 1,
    rRainSize: 1,
    rRainSpeed: 1,
    rRainOpacity: 1,
    showMRain: true,
    rainThreshold: 1,
    mRainSize: 1,
    mRainSpeed: 1,
    mRainOpacity: 1,
    showFlicker: true,
    showLights: true,
    showDonut: true
};
let defaults, images;
let dt, lastTimestamp = 0;

// Load the defaults object from a json file before setting up the application
function loadDefaults(imageList) {
    images = imageList;
    defaults = ajax.fetchJSON('./data/defaults.json', defaultsLoaded);
}

// Callback function that begins app setup when the defaults are loaded
function defaultsLoaded(json) {
    defaults = json;
    init();
}

// Function to set up the application and start the drawing loop
function init() {
    audio.setupWebAudio(defaults.song);

    // Grab a reference to each canvas used
    let bgCanvas = document.querySelector("#bg");
    let lledCanvas = document.querySelector("#left-led");
    let mledCanvas = document.querySelector("#mid-led");
    let rledCanvas = document.querySelector("#right-led");
    setupUI(bgCanvas);
    canvas.setupCanvas(bgCanvas, lledCanvas, mledCanvas, rledCanvas, audio.analyserNode, images);

    // Start the loop that draws to the canvas each frame
    loop();
}

function setupUI(bgCanvas) {
    // All of the UI controls are handled within their own web component
    const controls = document.createElement('app-controls');
    // Give the controls component a reference to the drawParams so that changes
    // made in the component carry over to main's reference of the drawParams
    controls.drawParams = drawParams;
    document.querySelector('#app').appendChild(controls);
    // Calling reset once also functions as a setup for all the controls
    controls.reset(defaults);
    controls.resetButton.onclick = () => controls.reset(defaults);
}

// Loop function is called every frame
// Calculates the delta time and then makes a call to the canvas' draw method
// with the current drawParams and delta time
function loop(timestamp) {
    requestAnimationFrame(loop);
    dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    canvas.draw(drawParams, dt);
}

export { loadDefaults };