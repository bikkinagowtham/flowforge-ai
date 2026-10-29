# FlowForge AI — Architecture Deep Dive

## 1. System Vision & Problem Statement
Modern generative chatbots generate isolated text instructions without verifying if instructions succeed or fail in practice. **FlowForge AI** solves the execution and verification gap for agentic systems:
- It transforms natural language objectives into strict 3-phase structured DAG workflows: **Plan** (cyan), **Execute** (blue), and **Verify** (violet).
- It introduces an **Empirical Verification Engine** that tests real ground-truth outcomes rather than relying on model self-reporting.
- It provides a **Human-in-the-Loop** approval gate before any executable command or mutation is triggered.

## 2. Model Selection: NVIDIA Nemotron on Nebius Token Factory
FlowForge AI harnesses the NVIDIA Nemotron model family hosted on Nebius Token Factory:
- **`nebius/nvidia/Nemotron-3_5-Lightning`**: Optimized for sub-second planning latency, high prompt adherence, and concise operational directives.
- **`nebius/nvidia/nemotron-3-super-120b-a12b`**: Balanced reasoning model specialized in complex dependency analysis and test-case derivation.
- **`nebius/nvidia/Nemotron-3-Ultra-550b-a55b`**: High-capacity orchestrator for enterprise-scale multi-phase pipelines.

## 3. Safe Local Execution Engine
To prevent destructive arbitrary code execution, the platform executes actions within sandboxed verification primitives:
1. `structure_check`: Directory tree audits, essential file validations, and path integrity.
2. `json_validation`: Strict schema enforcement against Zod/JSON-Schema specifications.
3. `syntax_check`: Static syntax scans, license validation, and TypeScript export verification.
4. `artifact_generator`: Automated generation of immutable deployment assets (CI/CD YAML, release checklists, container configurations).

## 4. Verification Protocol
Each step generates verifiable criteria:
- **Expected Pattern / Metric**: What verifiable state must exist.
- **Observed Evidence**: The actual terminal stdout, exit code, or file checksum.
- **Remediation**: Immediate corrective action if the check fails.
- **Score Calculation**: Weighted empirical percentage of passed verification gates.
