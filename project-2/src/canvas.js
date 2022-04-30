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
let images;
let switchLamp = false, time, delay, opacity = 0;
let color1, color2, color3, index1, index2, index3;
let prevAudioData = null, lowAudioData = null;
let rain;


function setupCanvas(bgCanvas, lledCanvas, mledCanvas, rledCanvas, analyserNodeRef, imageList) {
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

    warp = pwarp.getProjectionMatrix(0, 540, 213, 229,
        85, 540, 298, 233.09,
        85, 580, 298, 273,
        0, 580, 213, 269);
    rledCanvas.style.transform = warp;

    // Grab images to draw
    images = imageList;
    index1 = 1;
    color1 = images.cl1[index1];
    index2 = 0;
    color2 = images.cl2[index2];
    index3 = 0;
    color3 = images.cl3[index3];

    startTimer();
    delay = utils.getRandom(1100, 6000);
}

function draw(params = {}, dt = 0) {
    // Populate the audioData array with the frequency data from the analyserNode
    analyserNode.getByteFrequencyData(audioData);

    // Draw background
    drawBackground();

    // Draw changing background lights
    // drawCityLights(7,14,7.5);
    drawCityLights(params, 1.3, 3.7, 2);

    // Draw flickering lamp
    if (params.showFlicker) {
        if (getTimer() > delay && !switchLamp && params.playing) {
            switchLamp = true;
            delay = utils.getRandom(1100, 6000);
            startTimer();
        }
        drawLightFlicker();
    }

    // Draw bass thumping donut
    drawDonut(params);

    // Draw visualizer bars
    clearBars();
    drawBars();
    setDashesForBars(ctxLled, lledCanvasWidth, lledCanvasHeight);
    setDashesForBars(ctxMled, mledCanvasWidth, mledCanvasHeight);
    setDashesForBars(ctxRled, rledCanvasWidth, rledCanvasHeight);

    // Draw randomized rain
    if (params.showRRain) {
        if (!rain) {
            rain = new Rain(ctxBg, bgCanvasWidth, audioData, dt);
        }
        if (!params.playing) dt = 0;
        rain.setDt(dt);
        rain.randomRain(params.rainDensity, params.rRainSize, params.rRainSpeed, params.rRainOpacity);
    }

    // Draw music synched rain
    if (params.showMRain) {
        if (!rain) {
            rain = new Rain(ctxBg, bgCanvasWidth, audioData, dt);
        }
        if (!params.playing) dt = 0;
        rain.setDt(dt);
        rain.rainWithThreshold(params.rainThreshold, params.mRainSize, params.mRainSpeed, params.mRainOpacity);
    }
}

function drawBackground() {
    ctxBg.save();
    ctxBg.globalAlpha = 0.3;
    ctxBg.drawImage(images.bg, 0, 0, bgCanvasWidth, bgCanvasHeight);
    ctxBg.restore();
}

function drawLightFlicker() {
    ctxBg.save();
    if (switchLamp) {
        opacity = utils.getRandom(0.0, 1.0);
        if (opacity > .99) {
            opacity = 1;
            switchLamp = false;
        }
        if (opacity < .01) {
            opacity = 0;
            switchLamp = false;
        }
    }
    ctxBg.globalAlpha = opacity;
    ctxBg.drawImage(images.lamp, 0, 0, bgCanvasWidth, bgCanvasHeight);
    ctxBg.restore();
}

function drawCityLights(params, bassThresh, midThresh, trebThresh) {
    if (params.showLights) {
        if (!prevAudioData || !lowAudioData) {
            prevAudioData = [...audioData];
            lowAudioData = [...audioData];
        }

        let bassIncrease = 0, midIncrease = 0, trebIncrease = 0;
        for (let i = 0; i < audioData.length; i++) {
            const diff = audioData[i] / 256 - lowAudioData[i] / 256;
            const direction = audioData[i] / 256 - prevAudioData[i] / 256;
            if (diff > 0) {
                // Bass
                if (i < 4) {
                    bassIncrease += diff;
                }
                // Midrange
                else if (i < 17) {
                    midIncrease += diff;
                }
                // Treble
                else {
                    trebIncrease += diff;
                }
            }
            if (direction < 0) {
                // Bass
                if (i < 4) {
                    bassIncrease = 0;
                }
                // Midrange
                else if (i < 17) {
                    midIncrease = 0;
                }
                // Treble
                else {
                    trebIncrease = 0;
                }
                lowAudioData[i] = audioData[i];
            }
            prevAudioData[i] = audioData[i];
        }
        if (bassIncrease >= bassThresh) {
            index1 = utils.getRandomDifferent(0, 5, index1);
            color1 = images.cl1[index1];
            console.log(`bass:${bassIncrease}`);
        }
        if (midIncrease >= midThresh) {
            index2 = utils.getRandomDifferent(0, 5, index2)
            color2 = images.cl2[index2];
            console.log(`mid:${midIncrease}`);
        }
        if (trebIncrease >= trebThresh) {
            index3 = utils.getRandomDifferent(0, 5, index3)
            color3 = images.cl3[index3];
            console.log(`treb:${trebIncrease}`);
        }
    }

    ctxBg.drawImage(color1, 0, 0, bgCanvasWidth, bgCanvasHeight);
    ctxBg.drawImage(color2, 0, 0, bgCanvasWidth, bgCanvasHeight);
    ctxBg.drawImage(color3, 0, 0, bgCanvasWidth, bgCanvasHeight);
}

function drawDonut(params) {
    ctxBg.save();
    ctxBg.translate(0.445 * bgCanvasWidth, 0.2148 * bgCanvasHeight);
    if (params.showDonut) {
        const bass = (audioData[0] * 0.5) + (audioData[1] * 0.6) + (audioData[2] * 1.6) + (audioData[3] * 0.55) + (audioData[4] * 0.45) + (audioData[5] * 0.3);
        const bassPercent = bass / (4 * 256);
        const scale = utils.lerp(1.0, 1.25, bassPercent);
        ctxBg.scale(scale, scale);
    }
    ctxBg.drawImage(images.donut, -97.5, -87.5, 0.203 * bgCanvasWidth, 0.324 * bgCanvasHeight);
    ctxBg.restore();
    ctxBg.drawImage(images.roof, 0, 0, bgCanvasWidth, bgCanvasHeight);
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
            barHeight = utils.clamp(barHeight, .1 * lledCanvasHeight, maxBarHeight);
            drawRect(ctxLled, (1.5 * margin) + (i * (barspacing + barWidth)), lledCanvasHeight - barHeight,
                barWidth, barHeight, barGradient);
        }
        else if (i / audioData.length <= .78) {
            margin = 1.8;
            if (middleStart == 0) middleStart = i;
            barHeight = (audioData[i] / 256) * mledCanvasHeight;
            barHeight = utils.clamp(barHeight, .1 * mledCanvasHeight, maxBarHeight);
            drawRect(ctxMled, (1.5 * margin) + ((i - middleStart) * (barspacing + barWidth)), mledCanvasHeight - barHeight,
                barWidth, barHeight, barGradient);
        }
        else {
            margin = .5
            if (rightStart == 0) rightStart = i;
            barHeight = (audioData[i] / 256) * rledCanvasHeight;
            barHeight = utils.clamp(barHeight, .1 * rledCanvasHeight, maxBarHeight);
            drawRect(ctxRled, (1.5 * margin) + ((i - rightStart) * (barspacing + barWidth)), rledCanvasHeight - barHeight,
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

function drawRect(ctx, x, y, width, height, fillStyle = 0, strokeStyle = 0) {
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

function startTimer() {
    time = Date.now();
}

function getTimer() {
    const elapsed = Date.now() - time;
    return elapsed;
}

export { setupCanvas, draw };