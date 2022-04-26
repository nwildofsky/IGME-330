import * as utils from './utils.js'

class Rain {
    constructor(ctx, ctxWidth, audioData, dt) {
        Object.assign(this, { ctx, ctxWidth, audioData, dt });
        this.prevAudioData = [...audioData];
        this.musicDrops = [];
        this.randDrops = [];
        this.timer = Date.now();
        this.calls = 0;
        this.frameDiff = 5;
    }

    rainWithThreshold(threshold, frequency) {
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
                    const size = utils.lerp(0, 4.3, increase[i]);
                    const speed = utils.getRandom(.3, .6);
                    const limit = utils.getRandom(500, 540);
                    const alpha = utils.getRandom(.35, .7);
                    //this.musicDrops[i] = new Raindrop(x, 0, size, '#abe6ff', speed, limit);
                    this.musicDrops.push(new Raindrop(x, 0, size, `rgba(117, 195, 235, ${alpha})`, speed, limit));

                    this.prevAudioData[i] = this.audioData[i];
                    increase[i] = 0;
                }
            }

            if (this.getTimer() >= frequency) {
                // Droplets regardless of music
                for (let i = 0; i <= this.getTimer() / frequency; i++) {
                    const x = utils.getRandom(0, this.ctxWidth);
                    const size = utils.getRandom(.25, 1.1);
                    const speed = utils.getRandom(.6, 1);
                    const limit = utils.getRandom(460, 540);
                    const alpha = utils.getRandom(.15, .6);
                    this.randDrops.push(new Raindrop(x, 0, size, `rgba(117, 195, 235, ${alpha})`, speed, limit));
                }
                this.startTimer();
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

export { Rain };