// js/ui/InfoPanel.js

export default class InfoPanel {
    constructor(elementId) {
        this.container = document.getElementById(elementId);
    }

    update(targets) {
        if (!this.container) return;

        this.container.innerHTML = "<h3>Target Status</h3>";

        for (const target of targets) {
            const cpaText =
                target.cpa !== null ? target.cpa.toFixed(1) : "N/A";
            const tcpaText =
                target.tcpa !== null && target.tcpa !== Infinity
                    ? target.tcpa.toFixed(1)
                    : "N/A";

            const line = document.createElement("p");
            line.textContent =
                `Target ${target.id}: ` +
                `CPA = ${cpaText}, ` +
                `TCPA = ${tcpaText}, ` +
                `Risk = ${target.riskLevel}`;

            this.container.appendChild(line);
        }
    }
}
