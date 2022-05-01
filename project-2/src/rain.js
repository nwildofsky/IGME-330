/*
    rain.js is a module containing the raindrop class and the manager class for all the raindrops,
    the rain class. Since rain in this application is many small circles drawn onto the canvas
    that fall down over time, it is easiest to control this functionality with its own class.
*/

import * as utils from './utils.js'

// Class that manages all of the raindrop objects in the scene
export class Rain {
    constructor(ctx, ctxWidth, audioData, dt) {
        Object.assign(this, { ctx, ctxWidth, audioData, dt });
        this.prevAudioData = [...audioData];
        this.musicDrops = [];
        this.randDrops = [];
        this.timer = Date.now();
    }

    // Add rain that is synched to the music beats
    // The threshold specified causes rain only to be created if any of the
    // audio bins have frequency increases that frame that are greater than the threshold
    rainWithThreshold(threshold, sizeMean, speedStart, alphaStart) {
        if (this.dt) {
            let increase = Array(this.audioData.length).fill(0);
            for (let i = 0; i < this.audioData.length; i++) {
                // Calculate the difference from the current frequency and the last baseline's frequency
                const diff = this.audioData[i] / 256 - this.prevAudioData[i] / 256;
                // If the difference is positive, record the increase
                if (diff > 0) {
                    increase[i] += diff;
                }
                // If the difference is negative, record the new baseline and zero the increase
                else {
                    this.prevAudioData[i] = this.audioData[i];
                    increase[i] = 0;
                }

                // Create the raindrops
                if (increase[i] >= threshold) {
                    const x = (i / this.audioData.length) * this.ctxWidth;
                    const size = utils.lerp(utils.clamp(sizeMean - 2, 0, 6), utils.clamp(sizeMean + 2, 0, 6), increase[i] - threshold);
                    const speed = utils.getRandom(speedStart, utils.clamp(speedStart+0.3, 0, 2));
                    const alpha = utils.getRandom(alphaStart, utils.clamp(alphaStart+0.3, 0, 1));
                    const limit = utils.getRandom(500, 540);
                    this.musicDrops.push(new Raindrop(x, 0, size, `rgba(117, 195, 235, ${alpha})`, speed, limit));

                    // To limit the number of raindrops created, mark each beat as the next baseline
                    this.prevAudioData[i] = this.audioData[i];
                    increase[i] = 0;
                }
            }
        }

        // Call each raindrop's fall and draw methods
        for (let i = 0; i < this.musicDrops.length; i++) {

            if (this.musicDrops[i]) {
                if (this.musicDrops[i].y <= this.musicDrops[i].limit) {
                    this.musicDrops[i].draw(this.ctx);
                    this.musicDrops[i].fall(this.dt);
                }
                // Remove the raindrops from the array when they "hit the ground"
                else {
                    this.musicDrops[i] = null;
                    this.musicDrops.splice(i, 1);
                }
            }
        }
    }

    // Add rain that is randomly placed across the screen horizontally
    // The delay specified is how long to wait until another raindrop is drawn
    randomRain(delay, sizeStart, speedStart, alphaStart) {
        if (this.dt) {
            if (this.getTimer() >= delay) {
                // Clamp the upper bound of the timer so the canvas doesn't slow with
                // way too much rain being drawn after long wait times
                const iterations = utils.clamp(this.getTimer() / delay, 0, 100);
                // Create a raindrop for every delay timeframe that has passed
                for (let i = 0; i <= iterations; i++) {
                    const x = utils.getRandom(0, this.ctxWidth);
                    const size = utils.getRandom(sizeStart, utils.clamp(sizeStart + .85, 0, 3));
                    const speed = utils.getRandom(speedStart, utils.clamp(speedStart + .4, 0, 2));
                    const alpha = utils.getRandom(alphaStart, utils.clamp(alphaStart + .45, 0, 1));
                    const limit = utils.getRandom(460, 540);
                    this.randDrops.push(new Raindrop(x, 0, size, `rgba(117, 195, 235, ${alpha})`, speed, limit));
                }
                this.startTimer();
            }
        }
        // Don't let the timer keep running in the background when the audio is paused
        else {
            this.startTimer();
        }

        // Call each raindrop's fall and draw methods
        for (let i = 0; i < this.randDrops.length; i++) {
            if (this.randDrops[i].y <= this.randDrops[i].limit) {
                this.randDrops[i].draw(this.ctx);
                this.randDrops[i].fall(this.dt);
            }
            else {
                this.randDrops[i] = null;
                this.randDrops.splice(i, 1);
            }
        }
    }

    setDt(dt) {
        this.dt = dt;
    }

    startTimer() {
        this.timer = Date.now();
    }

    getTimer() {
        const elapsed = Date.now() - this.timer;
        return elapsed;
    }
}

// Class for each individual rain droplet in the canvas
// Raindrops can each have different positions, sizes, colors, speeds, and cutoff points
class Raindrop {
    constructor(x = 0, y = 0, size = 1, color = 'white', speed = 1, limit = 520) {
        Object.assign(this, { x, y, size, color, speed, limit });
    }

    // Move the raindrop down the canvas according to its speed
    fall(dt) {
        this.y += this.speed * dt;
    }

    // Draw the raindrop on the canvas
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}