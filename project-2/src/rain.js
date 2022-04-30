import * as utils from './utils.js'

export class Rain {
    constructor(ctx, ctxWidth, audioData, dt) {
        Object.assign(this, { ctx, ctxWidth, audioData, dt });
        this.prevAudioData = [...audioData];
        this.musicDrops = [];
        this.randDrops = [];
        this.timer = Date.now();
    }

    rainWithThreshold(threshold, sizeMean, speedStart, alphaStart) {
        if (this.dt) {

            // Create the raindrops
            let increase = Array(this.audioData.length).fill(0);
            for (let i = 0; i < this.audioData.length; i++) {
                // Droplets with the music
                const diff = this.audioData[i] / 256 - this.prevAudioData[i] / 256;
                if (diff > 0) {
                    increase[i] += diff;
                }
                else {
                    this.prevAudioData[i] = this.audioData[i];
                    increase[i] = 0;
                }

                if (increase[i] >= threshold) {
                    const x = (i / this.audioData.length) * this.ctxWidth;
                    const size = utils.lerp(utils.clamp(sizeMean - 2, 0, 6), utils.clamp(sizeMean + 2, 0, 6), increase[i] - threshold);
                    const speed = utils.getRandom(speedStart, utils.clamp(speedStart+0.3, 0, 2));
                    const alpha = utils.getRandom(alphaStart, utils.clamp(alphaStart+0.3, 0, 1));
                    const limit = utils.getRandom(500, 540);
                    //this.musicDrops[i] = new Raindrop(x, 0, size, '#abe6ff', speed, limit);
                    this.musicDrops.push(new Raindrop(x, 0, size, `rgba(117, 195, 235, ${alpha})`, speed, limit));

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
                else {
                    this.musicDrops[i] = null;
                    this.musicDrops.splice(i, 1);
                }
            }
        }
    }

    randomRain(delay, sizeStart, speedStart, alphaStart) {
        if (this.dt) {
            if (this.getTimer() >= delay) {
                // Droplets regardless of music
                const iterations = utils.clamp(this.getTimer() / delay, 0, 100);
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
        else {
            this.startTimer();
        }

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

class Raindrop {
    constructor(x = 0, y = 0, size = 1, color = 'white', speed = 1, limit = 520) {
        Object.assign(this, { x, y, size, color, speed, limit });
    }

    fall(dt) {
        this.y += this.speed * dt;
    }

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