# AI-Pipeline-Builder
A full-stack AI pipeline builder built with React + FastAPI.

---

## What Was Built

### Part 1 — Node Abstraction
Config-driven factory pattern (`BaseNode.jsx` + `nodeFactory.js`) that eliminates
boilerplate across all node types. Adding a new node requires only a config object —
no repeated JSX, no manual state management.

**5 demo nodes built using the abstraction:**

| Node | Demonstrates |
|---|---|
| Filter | Condition-based branching, true/false output handles |
| API Call | HTTP method selector, response/error output handles |
| Math | Two target handles (A, B), single result output |
| Note | Zero handles — shows factory works for annotation nodes |
| Condition | Operator comparison, true/false branching |

### Part 2 — Styling
VectorShift-inspired design using Tailwind CSS:
- Color-coded nodes with unique accent color per type
- Clean white cards with colored top borders
- Dot grid canvas, color-matched MiniMap and controls

### Part 3 — Text Node Logic
- **Auto-resize** — textarea grows in height and width as the user types
- **Variable detection** — typing `{{variableName}}` automatically creates
  a target Handle on the left side, evenly spaced per variable count

### Part 4 — Backend Integration
- Submit button sends nodes + edges to `POST /pipelines/parse`
- FastAPI backend counts nodes/edges, runs DAG check via Kahn's Algorithm
- Returns `{ num_nodes, num_edges, is_dag }` shown in a user-friendly alert

### Bonus Features
- **Undo / Redo** — full history stack for node additions, edge connections, and node moves
- **Loading state** — Submit button shows `⟳ Analyzing...` while awaiting response
- **Visible edges** — indigo-colored connection lines with directional arrows

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, ReactFlow, Zustand, Tailwind CSS |
| Backend | Python, FastAPI, Pydantic, Uvicorn |
| Algorithm | Kahn's BFS topological sort (DAG detection) |

---

## Project Structure

```
VectorShift/
├── frontend/
│   ├── src/
│   │   ├── nodes/
│   │   │   ├── BaseNode.jsx         # Core node abstraction
│   │   │   ├── nodeFactory.js       # Config-driven node factory
│   │   │   ├── inputNode.js         # Refactored using factory
│   │   │   ├── outputNode.js        # Refactored using factory
│   │   │   ├── llmNode.js           # Refactored using factory
│   │   │   ├── textNode.js          # Part 3 — resize + variable handles
│   │   │   ├── filterNode.js        # Demo node 1
│   │   │   ├── apiNode.js           # Demo node 2
│   │   │   ├── mathNode.js          # Demo node 3
│   │   │   ├── noteNode.js          # Demo node 4
│   │   │   └── conditionNode.js     # Demo node 5
│   │   ├── store.js                 # Zustand state + undo/redo history
│   │   ├── ui.js                    # ReactFlow canvas
│   │   ├── toolbar.js               # Node toolbar + undo/redo buttons
│   │   ├── submit.js                # Pipeline submit + loading state
│   │   └── draggableNode.js         # Draggable toolbar buttons
│   ├── tailwind.config.js
│   └── package.json
└── backend/
├── main.py                      # FastAPI app + Kahn's DAG algorithm
└── requirements.txt

```
---

## How to Run

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
uvicorn main:app --reload
```

Runs on `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`

---

## How to Use

1. Drag any node from the toolbar onto the canvas
2. Connect nodes by dragging from one handle dot to another
3. Type `{{variableName}}` in a Text node to create dynamic input handles
4. Click **Run Pipeline** to analyze — backend returns node count, edge count, DAG validity
5. Use **↩ Undo** / **Redo ↪** in the toolbar to step through history

---

## Key Engineering Decisions

**Factory pattern over copy-paste** — `createNode(config)` makes the system
scalable to dozens of node types without touching shared rendering logic.

**Kahn's Algorithm over DFS** — BFS-based topological sort gives a clean
is-DAG result in a single O(V+E) pass, easier to extend later.

**Split useEffect for handle updates** — `useUpdateNodeInternals` runs in a
separate effect with `setTimeout(0)` to guarantee ReactFlow reads handle
positions after React has committed the new state to the DOM.
