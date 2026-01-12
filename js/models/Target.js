// js/models/Target.js

import Vessel from "./Vessel.js";

export default class Target extends Vessel {
    constructor(id, x, y, speed, heading) {
        super(x, y, speed, heading);

        this.id = id;              // unique identifier
        this.riskLevel = "SAFE";   // SAFE | WARNING | DANGER
        this.cpa = null;           // closest point of approach
        this.tcpa = null;          // time to CPA

        this.active = true;
    }

    updateRisk(cpa, tcpa, riskLevel) {
        this.cpa = cpa;
        this.tcpa = tcpa;
        this.riskLevel = riskLevel;
    }
}
