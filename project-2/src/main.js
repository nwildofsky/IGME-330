/*
    main.js is primarily responsible for hooking up the UI to the rest of the application 
    and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';
import * as ajax from './ajax.js';
import './app-controls.js';

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

function loadDefaults(imageList) {
    images = imageList;
    defaults = ajax.fetchJSON('./data/defaults.json', defaultsLoaded);
}

function defaultsLoaded(json) {
    defaults = json;
    init();
}

function init() {
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);

    audio.setupWebAudio(defaults.song);

    let bgCanvas = document.querySelector("#bg");
    let lledCanvas = document.querySelector("#left-led");
    let mledCanvas = document.querySelector("#mid-led");
    let rledCanvas = document.querySelector("#right-led");
    setupUI(bgCanvas);
    canvas.setupCanvas(bgCanvas, lledCanvas, mledCanvas, rledCanvas, audio.analyserNode, images);

    loop();
}

function setupUI(bgCanvas) {
    const controls = document.createElement('app-controls');
    controls.drawParams = drawParams;
    document.querySelector('#app').appendChild(controls);
    controls.reset(defaults);
    controls.resetButton.onclick = () => controls.reset(defaults);
} // end setupUI

function loop(timestamp) {
    requestAnimationFrame(loop);
    dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    canvas.draw(drawParams, dt);
}

export { loadDefaults };