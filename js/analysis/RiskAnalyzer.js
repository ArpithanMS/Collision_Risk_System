// js/analysis/RiskAnalyzer.js

export default class RiskAnalyzer {
    constructor() {
        // Thresholds can be tuned later
        this.WARNING_DISTANCE = 150;
        this.DANGER_DISTANCE = 75;
        this.MAX_TCPA = 300; // seconds
    }

    analyze(ownShip, target) {
        // Relative position
        const rx = target.x - ownShip.x;
        const ry = target.y - ownShip.y;

        // Relative velocity
        const rvx = target.velocityX - ownShip.velocityX;
        const rvy = target.velocityY - ownShip.velocityY;

        const rvSquared = rvx * rvx + rvy * rvy;

        // If relative velocity is zero, no collision risk change
        if (rvSquared === 0) {
            return {
                cpa: Math.sqrt(rx * rx + ry * ry),
                tcpa: Infinity,
                riskLevel: "SAFE"
            };
        }

        // Time to Closest Point of Approach
        const tcpa = - (rx * rvx + ry * rvy) / rvSquared;

        // Position at CPA
        const cpaX = rx + rvx * tcpa;
        const cpaY = ry + rvy * tcpa;

        // Distance at CPA
        const cpa = Math.sqrt(cpaX * cpaX + cpaY * cpaY);

        // Risk classification
        let riskLevel = "SAFE";

        if (tcpa > 0 && tcpa < this.MAX_TCPA) {
            if (cpa < this.DANGER_DISTANCE) {
                riskLevel = "DANGER";
            } else if (cpa < this.WARNING_DISTANCE) {
                riskLevel = "WARNING";
            }
        }

        return {
            cpa: cpa,
            tcpa: tcpa,
            riskLevel: riskLevel
        };
    }
}
