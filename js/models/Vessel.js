// js/models/Vessel.js

export default class Vessel {
    constructor(x, y, speed, heading) {
        this.x = x;               // position x
        this.y = y;               // position y
        this.speed = speed;       // units per second
        this.heading = heading;   // radians
    }

    // Velocity components
    get velocityX() {
        return this.speed * Math.cos(this.heading);
    }

    get velocityY() {
        return this.speed * Math.sin(this.heading);
    }

    // Update position based on time step (dt in seconds)
    update(dt) {
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
    }
}
