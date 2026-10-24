# FlowForge AI ⚡

**Intelligent Workflow Execution & Empirical Verification Platform**  
*Built for the Nebius x NVIDIA Global AI Hackathon 2026*  
**Official Track:** Best Apps and Agents  
**License:** [MIT License](LICENSE)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Nebius Token Factory](https://img.shields.io/badge/Inference-Nebius%20Token%20Factory-0ea5e9.svg)](https://tokenfactory.nebius.com)
[![NVIDIA Nemotron](https://img.shields.io/badge/Model-NVIDIA%20Nemotron-76b900.svg)](https://developer.nvidia.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 Overview

Standard AI chatbots output static text instructions that leave execution and verification entirely to the user. **FlowForge AI** reimagines workflow automation by connecting high-throughput **NVIDIA Nemotron open-source model inference on Nebius Token Factory** to a real, stateful execution engine:

1. **Neural Planning:** NVIDIA Nemotron models break down complex user objectives into sequential phases (`Plan`, `Execute`, `Verify`) with measurable success criteria.
2. **Human-in-the-Loop & Safe Local Execution:** Inspect, approve, and execute real local system actions (file structure audits, package schema validation, syntax integrity checks, release checklist artifact generation).
3. **Empirical Verification Engine:** Evaluates outcomes against explicit criteria with observable evidence—never claiming success without verifiable ground truth.
4. **Futuristic 3D Interface:** An interactive Three.js WebGL hero canvas visualizing the live orbital loop of planning, execution, and verification.

---

## 🏛️ System Architecture

```
+-----------------------------------------------------------------------------------+
|                               FlowForge AI Platform                               |
+-----------------------------------------------------------------------------------+
                                          |
                +-------------------------+-------------------------+
                |                                                   |
                v                                                   v
    +-----------------------+                           +-----------------------+
    |   Frontend Client     |                           |    Backend Service    |
    |  (React 18 / Vite /   |   HTTP / REST API         |  (Node.js / Express / |
    |   Tailwind CSS /      | <=======================> |   TypeScript / Zod)   |
    |   Three.js 3D WebGL)  |   Port 5173 / Port 3001   |                       |
    +-----------------------+                           +-----------------------+
                |                                                   |
                |                               +-------------------+-------------------+
                |                               |                                       |
                v                               v                                       v
    +-----------------------+       +-----------------------+               +-----------------------+
    | Interactive 3D Canvas |       | Nebius Token Factory  |               | Safe Local Execution  |
    |  - Plan Node (Cyan)   |       |  Inference API        |               |  & Verification Engine|
    |  - Exec Node (Blue)   |       |  (NVIDIA Nemotron-    |               |  - Structure Check    |
    |  - Verify Node (Violet|       |   3.5-Lightning /     |               |  - JSON Validation    |
    |  - Particle Field     |       |   Nemotron-3-Super)   |               |  - Artifact Generator |
    +-----------------------+       +-----------------------+               +-----------------------+
                                                |                                       |
                                                v                                       v
                                    +-----------------------+               +-----------------------+
                                    | High-Speed Reasoning  |               | Persistent Storage    |
                                    |  JSON Guardrail Schema|               |  server/data/         |
                                    |  Token / Latency Logs |               |  workflows.json       |
                                    +-----------------------+               +-----------------------+
```

---

## ⚡ Tech Stack

- **AI Inference:** [Nebius Token Factory](https://tokenfactory.nebius.com) (`https://api.tokenfactory.nebius.com/v1`)
- **Foundational Model:** NVIDIA Nemotron Family (`nebius/nvidia/Nemotron-3_5-Lightning`, `nebius/nvidia/nemotron-3-super-120b-a12b`, `nebius/nvidia/Nemotron-3-Ultra-550b-a55b`)
- **Backend Service:** Node.js, Express, TypeScript, Zod Schema Validation
- **Frontend App:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **3D Graphics:** Pure Three.js WebGL canvas with dynamic orbit controls and CSS fallback
- **Data Persistence:** Atomic JSON-backed storage (`server/data/workflows.json`, `activity.json`)

---

## 🖥️ Application Sections

FlowForge AI features 8 dedicated modules:

1. **Home (`/`):** Futuristic 3D hero visualization showing the connected triad of Plan → Execute → Verify, live Nebius connectivity badge, and instant goal exploration presets.
2. **AI Workspace:** Enter custom goals or pick presets (GitHub prep, Study plan, CI/CD pipeline). Select eligible NVIDIA Nemotron model variants and generate structured workflows.
3. **Workflow Dashboard:** Active workflow overview, progress bar, error counter, and phase matrix columns (`Plan` in cyan, `Execute` in blue, `Verify` in violet).
4. **Task Details:** Deep inspection of individual steps, human-in-the-loop approval gate, step editing form, execution controls (Real, Manual, Simulated), live terminal stdout, and artifact viewer.
5. **Verification Center:** Ground-truth audit of every success criterion, percentage completeness score, honest assessment report, and actionable remediation fixes.
6. **Activity History:** Chronological audit trail logging plan generations, approvals, step executions, and benchmark latency.
7. **Model & Infrastructure:** Telemetry dashboard verifying Nebius Token Factory connection, real-time ping benchmark, model capabilities, and credential health without exposing secrets.
8. **Hackathon Submission:** Central hub for track compliance (**Best Apps and Agents**), deliverables checklist, and 3-minute video demonstration script.

---

## 🛠️ Quickstart & Local Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher (v22+ recommended)
- **npm:** v9.0.0 or higher

### 1. Clone & Install Dependencies

```bash
# Navigate to the project directory
cd flowforge-ai

# Install root, backend, and frontend dependencies
npm run install:all
```

*(Alternatively: run `npm install` in the root, `cd server && npm install`, and `cd client && npm install`)*.

### 2. Configure Environment Variables

```bash
# Copy example environment configuration
cp .env.example .env
```

Edit `.env` to include your Nebius Token Factory API key:

```env
PORT=3001
NEBIUS_BASE_URL=https://api.tokenfactory.nebius.com/v1
NEBIUS_API_KEY=your_actual_nebius_api_key_here
NEBIUS_MODEL=nebius/nvidia/Nemotron-3_5-Lightning
NODE_ENV=development
```

> **Note on Demo Mode:** If `NEBIUS_API_KEY` is not provided, FlowForge AI automatically launches in a clearly labeled **Standalone Demo Mode** with high-fidelity deterministic templates. The application never fakes an API response or claims live inference when operating offline.

### 3. Start Application in Development

```bash
npm run dev
```

This concurrently launches:
- **Backend API Service:** `http://localhost:3001`
- **Frontend Vite Client:** `http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

To run the automated backend test suite (validates plan generation, storage persistence, safe local action execution, and verification engine score calculation):

```bash
npm test
```

Or run directly inside `server/`:
```bash
cd server
npm test
```

To verify the client build and TypeScript compilation:
```bash
cd client
npm run build
```

---

## 📦 Production Build & Deployment

To compile both client and server for production:

```bash
npm run build
npm start
```

The server on port 3001 will automatically serve both the REST API endpoints (`/api/*`) and the static production client bundle (`client/dist/index.html`).

---

## 📋 Hackathon Documentation & Submission Files

- **Architecture Deep-Dive:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- **3-Minute YouTube Video Script:** [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md)
- **Official Submission Checklist:** [`docs/SUBMISSION_CHECKLIST.md`](docs/SUBMISSION_CHECKLIST.md)
- **License:** [`LICENSE`](LICENSE) (MIT)

---

## 🐙 GitHub Publishing Instructions

To publish this project to GitHub under the repository name **`FlowForge-AI`**:

```bash
# 1. Initialize git repository in project root
git init

# 2. Add files (verifies .gitignore protects secrets & node_modules)
git add .

# 3. Create initial commit
git commit -m "feat: FlowForge AI for Nebius x NVIDIA Global AI Hackathon 2026"

# 4. Set main branch
git branch -M main

# 5. Link to your public GitHub repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/FlowForge-AI.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🔒 Security & Data Integrity

- **Zero Secret Exposure:** `NEBIUS_API_KEY` is consumed exclusively server-side. It is never transmitted to the browser or stored in git.
- **Truthful Action Execution:** Simulated demo runs are explicitly stamped with `SIMULATED_DEMO`, and local actions are stamped with `LOCAL_CHECK` or `REAL_EXECUTION`.
- **Zod Schema Guardrails:** Prevents malformed or hallucinated responses from reaching workflow execution.
