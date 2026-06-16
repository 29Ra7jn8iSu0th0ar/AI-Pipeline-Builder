# AI Pipeline Builder

A full-stack visual AI pipeline builder built with React + FastAPI.
Drag, connect, and analyze AI workflows — with real-time DAG validation,
dynamic variable detection, and a clean VectorShift-inspired UI.

---

## Problem Statement

Building AI workflows requires connecting multiple components — LLMs, inputs,
outputs, filters, and API calls — in a specific order. The core challenge is:

1. **Maintainability** — how do you add new node types without rewriting the
   same boilerplate code every time?
2. **Reliability** — how do you guarantee a pipeline is a valid directed acyclic
   graph (DAG) before executing it? Cycles in a pipeline cause infinite loops.
3. **Usability** — how do you let users define dynamic variables inside nodes
   without writing code?

This project solves all three.

---

## Why This Architecture Exists

The original starter code had 4 node types — each one a copy-paste of the same
structure with minor variations. This approach breaks down at scale:

- Changing shared styling requires editing every node file
- Adding a new node means duplicating ~40 lines of boilerplate
- No abstraction means no consistency guarantee across node types

The solution is a **config-driven factory pattern** — one `BaseNode` component
handles all rendering, and `nodeFactory` converts a config object into a fully
working React component. New nodes cost 15 lines of config, not 40 lines of JSX.

---

## Design Principles

**1. Single source of truth for rendering**
All node rendering logic lives in `BaseNode.jsx`. Style changes, padding,
handle sizing — all controlled from one place, applied everywhere instantly.

**2. Config over code**
Node definitions are data, not components. A node is described by what it has
(title, color, fields, handles) — not how it renders. This separates concerns
cleanly and makes the system extensible.

**3. Defensive state management**
Undo/Redo saves snapshots at meaningful moments — node addition, edge connection,
and completed node moves (not during drag). This prevents history bloat while
keeping every user action reversible.

**4. Fail loudly, recover gracefully**
The Submit button catches all backend errors and surfaces them to the user
immediately. A loading state prevents double-submission. The DAG check guards
against invalid pipelines before execution.

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                 │
│                                                     │
│  ┌──────────┐    ┌──────────┐    ┌───────────────┐  │
│  │ Toolbar  │    │  Canvas  │    │ Submit Button │  │
│  │          │    │          │    │               │  │
│  │ Draggable│    │ReactFlow │    │ fetch POST    │  │
│  │ nodes    │───▶│  + Nodes│     │ /pipelines/  │  │
│  └──────────┘    │  + Edges │    │ parse         │  │
│                  └────┬─────┘    └──────┬────────┘  │
│                       │                 │           │
│              ┌────────▼─────────────────▼────────┐  │
│              │         Zustand Store             │  │
│              │  nodes / edges / history / future │  │
│              └───────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
│
HTTP POST (JSON)
│
┌─────────────────────────────▼───────────────────────┐
│                  Backend (FastAPI)                  │
│                                                     │
│  POST /pipelines/parse                              │
│  ├── Count nodes and edges                          │
│  ├── Build adjacency list                           │
│  ├── Run Kahn's Algorithm (BFS topological sort)    │
│  └── Return { num_nodes, num_edges, is_dag }        │
└─────────────────────────────────────────────────────┘
```

---

## Workflow Lifecycle
```
User drags node → Canvas renders via ReactFlow
│
▼
User connects nodes → Edge saved to Zustand store
│              History snapshot saved
▼
User types {{var}} → Regex detects variable name
│             New Handle created on left side
│             useUpdateNodeInternals fires
▼
User clicks Submit → nodes + edges sent to FastAPI
│             Button shows ⟳ Analyzing...
▼
FastAPI receives → Counts nodes and edges
│           Builds adjacency list from edges
│           Runs Kahn's BFS cycle detection
│           Returns { num_nodes, num_edges, is_dag }

▼

Frontend receives → Alert displays result

Button resets to Run Pipeline
```

---

## What Was Built

### Part 1 — Node Abstraction
Config-driven factory pattern (`BaseNode.jsx` + `nodeFactory.js`) that eliminates
boilerplate across all node types. Adding a new node requires only a config object
— no repeated JSX, no manual state management.

**5 demo nodes built using the abstraction:**

| Node | Demonstrates |
|---|---|
| Filter | Condition-based branching, true/false output handles |
| API Call | HTTP method selector, response/error output handles |
| Math | Two target handles (A, B), single result output |
| Note | Zero handles — factory works for annotation nodes |
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
- **Undo / Redo** — full history stack for node additions, edge connections,
  and node moves
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
ai-pipeline-builder/
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

> **Note:** Backend must be running before clicking Submit on the frontend.

---

## How to Use

1. Drag any node from the toolbar onto the canvas
2. Connect nodes by dragging from one handle dot to another
3. Type `{{variableName}}` in a Text node to create dynamic input handles
4. Click **Run Pipeline** to analyze — backend returns node count, edge count,
   and DAG validity
5. Use **↩ Undo** / **Redo ↪** in the toolbar to step through history

---

## Key Engineering Decisions

**Factory pattern over copy-paste**
`createNode(config)` makes the system scalable to dozens of node types without
touching shared rendering logic. The original 4 nodes were each ~40 lines.
After refactoring, each is ~15 lines of config with zero JSX.

**Kahn's Algorithm over DFS**
BFS-based topological sort gives a clean is-DAG result in a single O(V+E) pass.
If the number of processed nodes equals the total node count, no cycle exists.
Easier to extend later — the same pass can return topological order for execution.

**Split useEffect for handle updates**
`useUpdateNodeInternals` runs in a separate `useEffect` with `setTimeout(0)` to
guarantee ReactFlow reads handle positions after React has committed the new state
to the DOM. Calling it in the same effect as `setVariables` causes a race condition
where ReactFlow reads stale positions.

**History snapshots on completed actions only**
Undo/Redo saves snapshots when `dragging === false` on position changes — not on
every pixel of drag. This keeps the history stack clean and meaningful.

---

## DAG Validation — How It Works
Input:  nodes = [A, B, C]

edges = [A→B, B→C]
Step 1: Build in-degree map

{ A: 0, B: 1, C: 1 }
Step 2: Queue all nodes with in-degree 0

queue = [A]
Step 3: BFS

Process A → reduce B in-degree to 0 → queue = [B]

Process B → reduce C in-degree to 0 → queue = [C]

Process C → queue = []
Step 4: processed = 3, total = 3 → is_dag = True
If a cycle exists (A→B→A):

processed = 0 (no node ever reaches in-degree 0)

processed ≠ total → is_dag = False

---

*Built by Rajni Suthar · github.com/29Ra7jn8iSu0th0ar*
