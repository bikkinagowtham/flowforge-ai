# Nebius x NVIDIA Global AI Hackathon 2026 — Submission Checklist

**Track:** Best Apps and Agents  
**Project:** FlowForge AI  

- [x] **Core Model Integration**: Uses NVIDIA Nemotron model family (`Nemotron-3_5-Lightning`, `nemotron-3-super-120b-a12b`, `Nemotron-3-Ultra-550b-a55b`).
- [x] **Infrastructure**: Configured for Nebius Token Factory inference endpoint (`https://api.tokenfactory.nebius.com/v1`).
- [x] **Fallback & Demo Mode**: Implements Standalone Demo Mode with truthful telemetry when running without production API credentials.
- [x] **Agentic Architecture**: Structured 3-phase execution cycle (Plan -> Execute -> Verify).
- [x] **Human-in-the-Loop Safeguards**: Explicit approval gates before step execution.
- [x] **Empirical Ground-Truth Verification**: Verifies criteria against real outputs, computes verification scores, and provides remediation hints.
- [x] **3D Visual Experience**: Three.js WebGL visualization of the agentic orbital workflow.
- [x] **Documentation**: Complete Architecture documentation, Demo Video Script, and GitHub instructions.
- [x] **Open Source Compliance**: MIT License, clean package dependencies, zero hardcoded secrets.
