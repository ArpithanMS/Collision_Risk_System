// js/main.js

import Vessel from "./models/Vessel.js";
import Target from "./models/Target.js";
import Simulator from "./simulation/Simulator.js";
import RiskAnalyzer from "./analysis/RiskAnalyzer.js";
import Renderer from "./rendering/Renderer.js";
import InfoPanel from "./ui/InfoPanel.js";


// UI controls
const toggleButton = document.getElementById("toggleSim");
const speedSlider = document.getElementById("speedControl");
const speedValue = document.getElementById("speedValue");

// Canvas setup
const canvas = document.getElementById("simulationCanvas");

// Core components
const renderer = new Renderer(canvas);
const simulator = new Simulator();
const analyzer = new RiskAnalyzer();
const infoPanel = new InfoPanel("infoPanel");

// Own ship (fixed near center)
const ownShip = new Vessel(
    canvas.width / 2,
    canvas.height / 2,
    30,
    0
);

// Fixed-size traffic pool (simulated nearby vessels)
const targets = [
    new Target(1, 100, 100, 20, Math.PI / 4),
    new Target(2, 700, 150, 25, Math.PI),
    new Target(3, 400, 500, 15, -Math.PI / 2)
];

// Radar Radius
const MAX_RANGE = 250; // pixels from own ship

// View mode control
let viewMode = "SHIP_CENTERED";

function respawnTarget(target, ownShip) {
    // Pick a random point on the radar boundary
    const angle = Math.random() * Math.PI * 2;

    target.x = ownShip.x + Math.cos(angle) * MAX_RANGE;
    target.y = ownShip.y + Math.sin(angle) * MAX_RANGE;

    // Heading roughly toward the center (with small variation)
    const inwardAngle =
        angle + Math.PI + (Math.random() - 0.5) * (Math.PI / 4);

    target.heading = inwardAngle;
}


const viewSelect = document.getElementById("viewMode");
const viewLabel = document.getElementById("viewLabel");

viewSelect.addEventListener("change", () => {
    viewMode = viewSelect.value;
    viewLabel.textContent =
        viewMode === "SHIP_CENTERED"
            ? "Current View: Ship-Centered"
            : "Current View: World";
});


// Register objects in simulator
simulator.addObject(ownShip);
targets.forEach(t => simulator.addObject(t));

// Start simulation
simulator.start();

// Pause / Resume
toggleButton.addEventListener("click", () => {
    if (simulator.isRunning) {
        simulator.pause();
        toggleButton.textContent = "Resume";
    } else {
        simulator.start();
        toggleButton.textContent = "Pause";
    }
});

// Speed control
speedSlider.addEventListener("input", () => {
    const speed = parseFloat(speedSlider.value);
    simulator.setSpeed(speed);
    speedValue.textContent = `${speed.toFixed(1)}×`;
});


// Main animation loop
function animate(timestamp) {
    simulator.update(timestamp);

    // Respawn targets that move too far away
    // Traffic pool lifecycle
    for (const target of targets) {
        const dx = target.x - ownShip.x;
        const dy = target.y - ownShip.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > MAX_RANGE && target.active) {
            target.active = false;

            // respawn after short delay
            setTimeout(() => {
                respawnTarget(target, ownShip);
                target.active = true;
            }, 1000);
        }
    }


    for (const target of targets) {
        if (!target.active) continue;

        const dx = target.x - ownShip.x;
        const dy = target.y - ownShip.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= MAX_RANGE) {
            const result = analyzer.analyze(ownShip, target);
            target.updateRisk(result.cpa, result.tcpa, result.riskLevel);
        }
    }


    // Render (view-mode dependent)
    renderer.clear();

    if (viewMode === "SHIP_CENTERED") {
        // Draw radar boundary
        renderer.drawRadarBoundary(MAX_RANGE);

        // Clip all drawings to radar circle
        renderer.applyRadarClip(MAX_RANGE);

        // Draw own ship (centered)
        renderer.drawOwnShip(ownShip);

        // Draw targets inside radar
        for (const target of targets) {
            if (!target.active) continue;

            const dx = target.x - ownShip.x;
            const dy = target.y - ownShip.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= MAX_RANGE) {
                renderer.drawTarget(target, ownShip);
            }
        }

        // Restore normal drawing (VERY IMPORTANT)
        renderer.restoreClip();
    }
    else {
        renderer.drawVesselWorld(ownShip, "blue");
        for (const target of targets) {
            renderer.drawVesselWorld(target, "gray");
        }
    }

    infoPanel.update(targets);
    requestAnimationFrame(animate);
}


// Kick off loop
requestAnimationFrame(animate);
