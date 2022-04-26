/*
    The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import * as pwarp from './pwarp.js';
import { Rain } from './rain.js';

let barGradient, analyserNode, audioData;
let ctxBg, bgCanvasWidth, bgCanvasHeight;
let ctxLled, lledCanvasWidth, lledCanvasHeight;
let ctxMled, mledCanvasWidth, mledCanvasHeight;
let ctxRled, rledCanvasWidth, rledCanvasHeight;
let bg, bgLoaded = false;
let rain;


function setupCanvas(bgCanvas, lledCanvas, mledCanvas, rledCanvas, analyserNodeRef) {
    // create drawing contexts
    ctxBg = bgCanvas.getContext("2d");
    bgCanvasWidth = bgCanvas.width;
    bgCanvasHeight = bgCanvas.height;
    ctxLled = lledCanvas.getContext("2d");
    lledCanvasWidth = lledCanvas.width;
    lledCanvasHeight = lledCanvas.height;
    ctxMled = mledCanvas.getContext("2d");
    mledCanvasWidth = mledCanvas.width;
    mledCanvasHeight = mledCanvas.height;
    ctxRled = rledCanvas.getContext("2d");
    rledCanvasWidth = rledCanvas.width;
    rledCanvasHeight = rledCanvas.height;

    // create the gradient for the bars
    barGradient = utils.getLinearGradient(ctxBg, 0, 2, 0, 42, [{ percent: 0, color: "#aff86d" },
    { percent: .32, color: "#aff86d" }, { percent: .33, color: "#ffff57" }, { percent: .66, color: "#ffff57" },
    { percent: .67, color: "#fed170" }]);

    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;

    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);

    // Set the LED canvas' into their proper spaces
    let warp = pwarp.getProjectionMatrix(0, 540, 220, 227.55,
                                         91, 540, 311, 220.5,
                                         91, 580, 311, 260.5,
                                         0, 580, 220, 267.5);
    lledCanvas.style.transform = warp;

    warp = pwarp.getProjectionMatrix(180, 540, 397, 227,
                                     390, 540, 607, 229,
                                     390, 580, 607, 269,
                                     180, 580, 397, 267);
    mledCanvas.style.transform = warp;

    // let x1s = 0;
    // let x2s = x1s + lledCanvasWidth, x3s = x2s, x4s = x1s;
    // let y1s = 540;
    // let y2s = y1s, y3s = y1s + mledCanvasHeight, y4s = y3s;
    // let x1d = 213;
    // let x2d = x1d + lledCanvasWidth, x3d = x2d, x4d = x1d;
    // let y1d = 230;
    // let y2d = y1d, y3d = y1d + mledCanvasHeight, y4d = y3d;
    warp = pwarp.getProjectionMatrix(0, 540, 213, 229,
                                     85, 540, 298, 233.09,
                                     85, 580, 298, 273,
                                     0, 580, 213, 269);
    rledCanvas.style.transform = warp;
}

function draw(params = {}, dt = 0) {
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
    analyserNode.getByteFrequencyData(audioData);
    // OR
    //analyserNode.getByteTimeDomainData(audioData); // waveform data

    // Draw background
    ctxBg.save();
    drawBackground('./images/background_full.png');

    // 4 - draw bars
    if (params.showBars) {
        clearBars();
        drawBars();
        setDashesForBars(ctxLled, lledCanvasWidth, lledCanvasHeight);
        setDashesForBars(ctxMled, mledCanvasWidth, mledCanvasHeight);
        setDashesForBars(ctxRled, rledCanvasWidth, rledCanvasHeight);
        if (!rain) {
            rain = new Rain(ctxBg, bgCanvasWidth, audioData, dt);
        }
        if (document.querySelector('#play-btn').dataset.playing == 'no') dt = 0;
        rain.setDt(dt);
        rain.rainWithThreshold(.34, 1);
    }

    if (params.showNoise || params.showInvert || params.showEmboss) {

        // A) grab all of the pixels on the canvas and put them in the `data` array
        // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
        // the variable `data` below is a reference to that array
        let imageData = ctxBg.getImageData(0, 0, bgCanvasWidth, bgCanvasHeight);
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width; // not using here

        // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
        for (let i = 0; i < length; i += 4) {
            // C) randomly change every 20th pixel to red
            if (params.showNoise && Math.random() < .05) {
                // data[i] is the red channel
                // data[i+1] is the green channel
                // data[i+2] is the blue channel
                // data[i+3] is the alpha channel
                data[i] = data[i + 1] = data[i + 2] = 0; // zero out the red and green and blue channel
                // make the noise light blue
                data[i] = 15;
                data[i + 1] = 217;
                data[i + 2] = 252;
            } // end if
            // D) Invert the rgb color channels
            if (params.showInvert) {
                let red = data[i], green = data[i + 1], blue = data[i + 2];
                data[i] = 255 - red; // set red value
                data[i + 1] = 255 - green; // set green value
                data[i + 2] = 255 - blue; // set blue value
                // data[i+3] is the alpha but we're leaving that alone
            }
        } // end for

        // note we are stepping through *each* sub-pixel
        if (params.showEmboss) {
            for (let i = 0; i < length; i++) {
                if (i % 4 == 3) continue; // skip alpha channel
                data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
            }
        }

        // D) copy image data back to canvas
        ctxBg.putImageData(imageData, 0, 0);
    }
}

function drawBackground(image) {
    ctxBg.save();
    if (!bgLoaded) { 
        bg = utils.preloadImage(image);
        bgLoaded = true;
    }
    ctxBg.globalAlpha = 0.3;
    ctxBg.drawImage(bg, 0, 0, 960, 540);
    ctxBg.restore();
}

function drawBars() {
    let barspacing = 2;
    let margin = 0;
    let screenWidthForBars = (lledCanvasWidth + mledCanvasWidth + rledCanvasWidth) - (audioData.length * barspacing) - margin * 2;
    let barWidth = screenWidthForBars / audioData.length;
    let barHeight = 1;
    let maxBarHeight = 35;

    // loop through the data and draw
    let middleStart = 0;
    let rightStart = 0;
    for (let i = 0; i < audioData.length; i++) {
        if (i / audioData.length <= .22) {
            barHeight = (audioData[i] / 256) * lledCanvasHeight;
            barHeight = utils.clamp(barHeight, .1*lledCanvasHeight, maxBarHeight);
            drawRect(ctxLled, (1.5*margin) + (i * (barspacing + barWidth)), lledCanvasHeight - barHeight,
                     barWidth, barHeight, barGradient);
        }
        else if (i / audioData.length <= .78) {
            margin = 1.8;
            if (middleStart == 0) middleStart = i;
            barHeight = (audioData[i] / 256) * mledCanvasHeight;
            barHeight = utils.clamp(barHeight, .1*mledCanvasHeight, maxBarHeight);
            drawRect(ctxMled, (1.5*margin) + ((i - middleStart) * (barspacing + barWidth)), mledCanvasHeight - barHeight,
                     barWidth, barHeight, barGradient);
        }
        else {
            margin = .5
            if (rightStart == 0) rightStart = i;
            barHeight = (audioData[i] / 256) * rledCanvasHeight;
            barHeight = utils.clamp(barHeight, .1*rledCanvasHeight, maxBarHeight);
            drawRect(ctxRled, (1.5*margin) + ((i - rightStart) * (barspacing + barWidth)), rledCanvasHeight - barHeight,
                     barWidth, barHeight, barGradient);
        }
    }
}

function clearBars() {
    ctxLled.beginPath();
    ctxLled.clearRect(0, 0, lledCanvasWidth, lledCanvasHeight);
    ctxLled.closePath();
    ctxMled.beginPath();
    ctxMled.clearRect(0, 0, mledCanvasWidth, mledCanvasHeight);
    ctxMled.closePath();
    ctxRled.beginPath();
    ctxRled.clearRect(0, 0, rledCanvasWidth, rledCanvasHeight);
    ctxRled.closePath();
}

function setDashesForBars(ctx, ctxWidth, ctxHeight) {
    let step = 4;
    let height = 1;
    ctx.save();
    ctx.fillStyle = '#201f1e';
    for (let i = step; i < ctxHeight; i += step) {
        ctx.fillRect(0, i, ctxWidth, height)
    }
    ctx.restore();
}

function saveAllCanvas() {
    ctxBg.save();
    ctxLled.save();
    ctxMled.save();
    ctxRled.save();
}
function restoreAllCanvas() {
    ctxBg.restore();
    ctxLled.restore();
    ctxMled.restore();
    ctxRled.restore();
}
function fillStyleAllCanvas(style) {
    ctxBg.fillStyle = style;
    ctxLled.fillStyle = style;
    ctxMled.fillStyle = style;
    ctxRled.fillStyle = style;
}

function drawRect(ctx, x, y, width, height, fillStyle=0, strokeStyle=0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
    if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.restore();
}

export { setupCanvas, draw };