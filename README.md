# Situational Awareness & Collision Risk System

A browser-based 2D simulation that visualizes surrounding vessel traffic and continuously evaluates **collision risk** using **Closest Point of Approach (CPA)** and **Time to Closest Point of Approach (TCPA)**.

This project was built as part of a technical assessment to demonstrate:
- object-oriented design
- real-time simulation
- deterministic risk analysis
- clear visual and textual feedback

---

## Overview

The system simulates:
- one **own vessel** (reference vessel)
- multiple **target vessels** moving independently in a 2D space

At each simulation step, the system:
1. Updates vessel positions
2. Computes relative motion
3. Calculates CPA and TCPA
4. Classifies collision risk
5. Updates visual and textual indicators in real time

---

## Features

- Real-time 2D vessel simulation (Canvas)
- Continuous CPA / TCPA calculation
- Deterministic risk classification:
  - **SAFE**
  - **WARNING**
  - **DANGER**
- **Ship-Centered View (Primary)**  
  - Radar-style display
  - Collision risk is evaluated relative to the own vessel
  - CPA/TCPA indicators are meaningful in this view

- **World View (Secondary)**  
  - Absolute world-coordinate visualization
  - Included to demonstrate separation of simulation and rendering
  - Risk indicators remain relative to the own vessel

- Velocity vectors for motion clarity
- Pause / resume simulation
- Adjustable simulation speed
- Live information panel for all targets

## Radar Model & Target Lifecycle

The system uses a **ship-centered radar model**:

- The own vessel is fixed at the center of the display
- A circular radar boundary represents sensor range
- Target vessels:
  - enter the radar from the boundary
  - move through the radar space
  - exit and re-enter later as part of a fixed-size traffic pool

Targets outside the radar range:
- continue to exist in the simulation
- are not rendered or analyzed
- reappear only when re-entering the radar boundary

This mirrors how real situational awareness systems manage visibility and track lifecycle without modeling sensor detection directly.


## Risk Logic (Core Idea)

For each target vessel:
- Relative position and velocity are computed against the own vessel
- **TCPA** is calculated using relative motion projection
- **CPA** is derived from predicted closest approach
- Risk level is assigned using fixed, explainable thresholds

This keeps the logic:
- deterministic
- testable
- easy to extend later

---

## Design Principles

- **Separation of Concerns**
  - Simulation, analysis, rendering, and UI are isolated
- **Object-Oriented Design**
  - `Vessel` as a reusable base abstraction
- **Deterministic Logic**
  - No randomness in risk evaluation
- **Extensibility**
  - New risk models or vessel types can be added cleanly

The system prioritizes **explainable behavior** over visual complexity.

---

## How to Run

No build tools or dependencies required.

1. Clone the repository
2. Open `index.html` in a modern browser  
   (Chrome / Firefox recommended)

---

## Controls

- **Pause / Resume**: Toggle simulation state
- **Speed Slider**: Adjust simulation speed
- **View Mode**:
  - Ship-Centered (radar-style)
  - World coordinates

---

## Assumptions & Scope

- Motion is simulated (not real sensor data)
- Flat 2D space (no curvature or depth)
- Threshold values are fixed and demonstrative
- Focus is on logic clarity, not photorealism

---

## Possible Extensions

- Dynamic target creation/removal
- COLREG-style rule logic
- Historical track rendering
- Sensor noise simulation
- Target selection and focus mode

---

## Notes

This project intentionally avoids frameworks and build tools to keep:
- logic transparent
- math inspectable
- behavior easy to reason about
