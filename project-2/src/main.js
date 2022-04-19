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

const drawParams = {
    showGradient: true,
    showBars: true,
    showCircles: true,
    showNoise: false,
    showInvert: false,
    showEmboss: false
};
// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/Morning-Routine-Lofi-Study-Music.mp3"
});

let dt, lastTimestamp = 0;

function init() {
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebAudio(DEFAULTS.sound1);

    let bgCanvas = document.querySelector("#bg");
    let lledCanvas = document.querySelector("#left-led");
    let mledCanvas = document.querySelector("#mid-led");
    let rledCanvas = document.querySelector("#right-led");
    setupUI(bgCanvas);
    canvas.setupCanvas(bgCanvas, lledCanvas, mledCanvas, rledCanvas, audio.analyserNode);
    
    loop();
}

function setupUI(canvasElement) {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fs-btn");

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };

    const playButton = document.querySelector("#play-btn");
    playButton.onclick = e => {
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
        }
        // if track is playing, pause it
        else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = 'no'; // our CSS will set the text to play
        }
    };

    // C - hookup volume slider & label
    let volumeSlider = document.querySelector('#volume');
    let volumeLabel = document.querySelector('#volume-label');

    // add .oninput event to slider
    volumeSlider.oninput = e => {
        // set the gain
        audio.setVolume(e.target.value);
        // update volume of label to match value of slider
        volumeLabel.innerHTML = Math.round(e.target.value / 2 * 100);
    };

    // set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event('input'));

    // D - hookup tack <select>
    let trackSelect = document.querySelector('#sl-track');
    // add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        // pause the current track if it is playing
        if (playButton.dataset.playing == 'yes') {
            playButton.dispatchEvent(new MouseEvent('click'));
        }
    };

    const gradientCB = document.querySelector("#cb-gradient");
    gradientCB.onchange = e => {
        drawParams.showGradient = !drawParams.showGradient;
    }
    const barsCB = document.querySelector("#cb-bars");
    barsCB.onchange = e => {
        drawParams.showBars = !drawParams.showBars;
    }
    const circlesCB = document.querySelector("#cb-circles");
    circlesCB.onchange = e => {
        drawParams.showCircles = !drawParams.showCircles;
    }
    const noiseCB = document.querySelector("#cb-noise");
    noiseCB.onchange = e => {
        drawParams.showNoise = !drawParams.showNoise;
    }
    const invertCB = document.querySelector("#cb-invert");
    invertCB.onchange = e => {
        drawParams.showInvert = !drawParams.showInvert;
    }
    const embossCB = document.querySelector("#cb-emboss");
    embossCB.onchange = e => {
        drawParams.showEmboss = !drawParams.showEmboss;
    }

} // end setupUI

function loop(timestamp) {
    requestAnimationFrame(loop);
    dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    canvas.draw(drawParams, dt);
}

export { init };