// js/rendering/Renderer.js

export default class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Convert world coordinates to screen coordinates
    worldToScreen(x, y, ownShip) {
        return {
            x: this.centerX + (x - ownShip.x),
            y: this.centerY + (y - ownShip.y)
        };
    }

    drawOwnShip(ownShip) {
        const ctx = this.ctx;

        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 7, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();

        this.drawVelocityVector(
            this.centerX,
            this.centerY,
            ownShip.velocityX,
            ownShip.velocityY
        );
    }

    drawTarget(target, ownShip) {
        const { x, y } = this.worldToScreen(target.x, target.y, ownShip);

        let color = "green";
        if (target.riskLevel === "WARNING") color = "orange";
        if (target.riskLevel === "DANGER") color = "red";

        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        this.drawVelocityVector(
            x,
            y,
            target.velocityX,
            target.velocityY
        );
    }

    drawVelocityVector(x, y, vx, vy, scale = 10) {
        const ctx = this.ctx;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + vx * scale, y + vy * scale);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    drawVesselWorld(vessel, color = "blue") {
        const ctx = this.ctx;

        ctx.beginPath();
        ctx.arc(vessel.x, vessel.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        this.drawVelocityVector(
            vessel.x,
            vessel.y,
            vessel.velocityX,
            vessel.velocityY
        );
    }

    drawRadarBoundary(radius) {
        const ctx = this.ctx;

        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }


    applyRadarClip(radius) {
        const ctx = this.ctx;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
        ctx.clip();
    }

    restoreClip() {
        this.ctx.restore();
    }
}
