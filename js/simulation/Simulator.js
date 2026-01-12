// js/simulation/Simulator.js

export default class Simulator {
    constructor() {
        this.objects = [];       // vessels & targets
        this.isRunning = false;
        this.speedMultiplier = 1.0;
        this.lastTimestamp = null;
    }

    addObject(obj) {
        this.objects.push(obj);
    }

    setSpeed(multiplier) {
        this.speedMultiplier = multiplier;
    }

    start() {
        this.isRunning = true;
        this.lastTimestamp = null;
    }

    pause() {
        this.isRunning = false;
    }

    update(timestamp) {
        if (!this.isRunning) return;

        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
            return;
        }

        const deltaTime =
            (timestamp - this.lastTimestamp) / 1000 * this.speedMultiplier;

        this.lastTimestamp = timestamp;

        for (const obj of this.objects) {
            obj.update(deltaTime);
        }
    }
}
