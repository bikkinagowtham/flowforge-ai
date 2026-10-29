import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Activity,
  Zap,
  Layers,
  FileCheck,
  Search,
  ExternalLink,
} from 'lucide-react';
import { ThreeHeroCanvas } from './ThreeHeroCanvas';
import type { SystemStatus, Workflow } from '../types/workflow';

interface HomeViewProps {
  systemStatus: SystemStatus | null;
  activeWorkflow: Workflow | null;
  onNavigate: (tab: any) => void;
  onSelectPreset: (presetText: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  systemStatus,
  activeWorkflow,
  onNavigate,
  onSelectPreset,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<'plan' | 'execute' | 'verify'>('plan');

  const presets = [
    {
      title: 'GitHub Repo Prep & Pre-flight Audit',
      description: 'Audit directory structure, validate package metadata, generate CI/CD release workflow, and test compliance.',
      tag: 'Best Apps & Agents',
      prompt: 'Audit project structure, validate package.json schema and dependencies, generate CI/CD pipeline, and empirically verify readiness for open-source release.',
    },
    {
      title: 'Containerized CI/CD & Image Verification',
      description: 'Synthesize multi-stage Docker build, audit security directives, and verify zero root execution.',
      tag: 'DevOps & Tooling',
      prompt: 'Generate multi-stage Dockerfile with Node 22, enforce non-root user, and run container security verification tests.',
    },
    {
      title: 'Autonomous Code Quality & Security Gate',
      description: 'Scan repository for secrets, enforce strict TypeScript compiler options, and generate immutable audit badge.',
      tag: 'Security & Quality',
      prompt: 'Scan project for leaked secrets, validate TypeScript strict mode, and generate an empirical security audit report.',
    },
  ];

  const phaseExplanations = {
    plan: {
      title: 'Phase 1: Neural Planning (Cyan)',
      badge: 'NVIDIA Nemotron Reasoning',
      description:
        'Nemotron decomposes complex objectives into sequential steps. Each step defines explicit expected patterns, pre-conditions, and verifiable ground-truth benchmarks before any code runs.',
    },
    execute: {
      title: 'Phase 2: Safe Local Execution (Blue)',
      badge: 'Human-in-the-Loop Safeguards',
      description:
        'Steps enter an approval gate before executing. Operators can inspect commands, edit payloads, or run sandboxed checks (structure checks, JSON validation, artifact generation) with real stdout logging.',
    },
    verify: {
      title: 'Phase 3: Empirical Verification (Violet)',
      badge: 'Ground-Truth Testing',
      description:
        'Instead of assuming code worked, the Verification Center audits observable evidence against explicit pass/fail criteria, producing a verifiable percentage completeness score.',
    },
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Nebius x NVIDIA Global AI Hackathon 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Intelligent Workflow Execution &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                Empirical Verification
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Standard AI chatbots output text instructions and leave testing to chance.{' '}
              <strong className="text-white">FlowForge AI</strong> bridges the execution gap:
              generating multi-stage neural plans with <strong>NVIDIA Nemotron</strong> on{' '}
              <strong>Nebius Token Factory</strong>, gating actions through human approval, and
              empirically proving success with verifiable ground-truth evidence.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('workspace')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Launch AI Workspace</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>View Active Workflow</span>
              </button>

              <button
                onClick={() => onNavigate('hackathon')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 font-mono text-xs transition-all"
              >
                <span>Track: Best Apps & Agents</span>
              </button>
            </div>

            {/* Platform Highlights Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <div className="text-xs font-mono text-slate-400">Model Inference</div>
                <div className="text-sm font-bold text-cyan-400 mt-1 truncate">
                  Nemotron 3.5
                </div>
                <div className="text-[11px] text-slate-500">Nebius Token Factory</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <div className="text-xs font-mono text-slate-400">Execution Gate</div>
                <div className="text-sm font-bold text-blue-400 mt-1">
                  Human-in-the-Loop
                </div>
                <div className="text-[11px] text-slate-500">Zero rogue commands</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <div className="text-xs font-mono text-slate-400">Verification</div>
                <div className="text-sm font-bold text-purple-400 mt-1">
                  Empirical Proof
                </div>
                <div className="text-[11px] text-slate-500">Ground-truth evidence</div>
              </div>
            </div>
          </div>

          {/* Right 3D WebGL Canvas */}
          <div className="lg:col-span-6 space-y-4">
            <ThreeHeroCanvas
              activePhase={selectedPhase}
              onSelectPhase={(phase) => setSelectedPhase(phase)}
            />

            {/* Dynamic Card Explaining Selected Node in the 3D Triad */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-200 text-sm">
                  {phaseExplanations[selectedPhase].title}
                </span>
                <span className="font-mono text-[11px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                  {phaseExplanations[selectedPhase].badge}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {phaseExplanations[selectedPhase].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preset Starters Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Instant Workflow Presets</span>
            </h2>
            <p className="text-sm text-slate-400">
              One-click autonomous agent workflows ready to plan, execute, and verify.
            </p>
          </div>
          <button
            onClick={() => onNavigate('workspace')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Custom Goal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presets.map((preset, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                    {preset.tag}
                  </span>
                  <Terminal className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h3 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">
                  {preset.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">NVIDIA Nemotron 3.5</span>
                <button
                  onClick={() => {
                    onSelectPreset(preset.prompt);
                    onNavigate('workspace');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Deploy Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Triad Architecture Explainer */}
      <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/60 via-slate-950/80 to-slate-900/60 border border-slate-800/80 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>The FlowForge Triad: Why Empirical Verification Matters</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            AI agents shouldn't be judged by how confident their answers sound, but by whether the resulting software compiles, passes schemas, and fulfills functional requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-cyan-900/30">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center border border-cyan-500/40 text-cyan-400 font-bold font-mono text-xs">
              01
            </div>
            <h4 className="font-bold text-sm text-cyan-300">Deterministic Neural DAGs</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nemotron models enforce strict JSON guardrails. Rather than unpredictable agent loops, workflows follow directed acyclic graphs with predefined stages and success gates.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-blue-900/30">
            <div className="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center border border-blue-500/40 text-blue-400 font-bold font-mono text-xs">
              02
            </div>
            <h4 className="font-bold text-sm text-blue-300">Operator In-The-Loop Safety</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every system action presents inspectable parameters and requires explicit human operator sign-off. Choose between real local execution or zero-side-effect simulations.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-purple-900/30">
            <div className="w-8 h-8 rounded-lg bg-purple-950 flex items-center justify-center border border-purple-500/40 text-purple-400 font-bold font-mono text-xs">
              03
            </div>
            <h4 className="font-bold text-sm text-purple-300">Observable Ground Truth</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verification criteria inspect real files, process exit codes, and JSON schemas. If a step fails, FlowForge generates remediation advice rather than hallucinating success.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
