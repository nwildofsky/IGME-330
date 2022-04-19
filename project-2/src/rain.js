import * as utils from './utils.js'

class Rain {
    constructor(ctx, ctxWidth, audioData, dt) {
        Object.assign(this, { ctx, ctxWidth, audioData, dt });
        this.droplets = [];
        this.waitTime = [];
        this.waitTime = Array(audioData.length).fill(0);
    }

    rainWithThreshold(threshold) {
        for (let i = 0; i < this.audioData.length; i++) {
            if (this.audioData[i] / 256 >= threshold && !this.droplets[i]) {
                const x = (i / this.audioData.length) * this.ctxWidth;
                const size = utils.getRandom(.5, 2.5);
                const speed = utils.getRandom(.4, 1);
                this.droplets[i] = new Raindrop(x, 0, size, '#abe6ff', speed);
            }
        }

        if (this.dt && this.dt != 0) {
            for (let i = 0; i < this.droplets.length; i++) {

                if (this.droplets[i]) {
                    if (this.droplets[i].y <= 500) {
                        this.droplets[i].draw(this.ctx);
                        this.droplets[i].fall(this.dt);
                    }
                    else {
                        this.droplets[i] = null;
                    }
                }
            }
        }
    }

    setDt(dt) {
        this.dt = dt;
    }
}

class Raindrop {
    constructor(x = 0, y = 0, size = 1, color = 'white', speed = 1) {
        Object.assign(this, { x, y, size, color, speed });
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