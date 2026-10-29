import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  Sliders,
  Send,
  Loader2,
  CheckCircle2,
  Terminal,
  Zap,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import type { ModelInfo, SystemStatus, Workflow } from '../types/workflow';

interface WorkspaceViewProps {
  systemStatus: SystemStatus | null;
  availableModels: ModelInfo[];
  initialGoal?: string;
  onWorkflowGenerated: (wf: Workflow) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  systemStatus,
  availableModels,
  initialGoal = '',
  onWorkflowGenerated,
}) => {
  const [goal, setGoal] = useState<string>(
    initialGoal ||
      'Audit repository file structure, validate package metadata, generate CI/CD release workflow, and empirically verify readiness for open-source release.'
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    systemStatus?.activeModel || 'nebius/nvidia/Nemotron-3_5-Lightning'
  );
  const [temperature, setTemperature] = useState<number>(0.2);
  const [reasoningEffort, setReasoningEffort] = useState<'low' | 'balanced' | 'high'>('balanced');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sampleGoals = [
    {
      label: 'GitHub Pre-flight',
      text: 'Audit repository file structure, validate package metadata, generate CI/CD release workflow, and empirically verify readiness for open-source release.',
    },
    {
      label: 'Container CI/CD',
      text: 'Generate multi-stage Dockerfile with Node 22, enforce non-root user, and run container security verification tests.',
    },
    {
      label: 'Security & Typecheck',
      text: 'Scan project for leaked secrets, validate TypeScript strict mode, and generate an empirical security audit report.',
    },
    {
      label: 'Microservice API Gate',
      text: 'Deconstruct REST endpoint schemas, generate Zod verification guards, and audit test coverage evidence.',
    },
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goal.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/workflows/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          model: selectedModel,
          temperature,
          reasoningEffort,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const newWorkflow: Workflow = await res.json();
      onWorkflowGenerated(newWorkflow);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate workflow';
      setError(`Generation failed: ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentModelMeta = availableModels.find((m) => m.id === selectedModel);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <span>Neural Workflow Planning</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          AI Workspace & DAG Generator
        </h1>
        <p className="text-sm text-slate-400">
          Formulate objectives for NVIDIA Nemotron. The engine synthesizes a verifiable 3-phase DAG
          with pre-conditions, safe actions, and empirical verification criteria.
        </p>
      </div>

      {/* Main Generator Form */}
      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Goal Input Area */}
        <div className="space-y-3 p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold font-mono uppercase text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Objective or Goal Description</span>
            </label>
            <span className="text-xs text-slate-500 font-mono">
              {goal.length} chars
            </span>
          </div>

          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={4}
            placeholder="Describe the automation objective, target files, or verification criteria you wish to execute..."
            className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 text-slate-100 placeholder:text-slate-600 text-sm leading-relaxed resize-y font-sans transition-all"
            required
          />

          {/* Quick Preset Pills */}
          <div className="pt-2">
            <div className="text-[11px] font-mono text-slate-400 mb-2">Preset Templates:</div>
            <div className="flex flex-wrap gap-2">
              {sampleGoals.map((sample, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setGoal(sample.text)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-xs text-slate-300 transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Model & Parameter Selection */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Model Card Selector */}
          <div className="md:col-span-7 space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <label className="text-xs font-bold font-mono uppercase text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>NVIDIA Nemotron Foundational Model</span>
            </label>

            <div className="space-y-2.5">
              {availableModels.map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/40 to-slate-900 border-cyan-500/70 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full border ${
                            isSelected
                              ? 'bg-cyan-400 border-cyan-300'
                              : 'border-slate-600'
                          }`}
                        />
                        <span className="font-bold text-xs text-slate-200">
                          {model.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {(model.contextWindow / 1024).toFixed(0)}k ctx
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      {model.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {model.strengths.slice(0, 2).map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/40"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hyperparameters & Reasoning Controls */}
          <div className="md:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <label className="text-xs font-bold font-mono uppercase text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Inference Controls</span>
              </label>

              {/* Temperature */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Temperature</span>
                  <span className="text-cyan-400">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Deterministic (0.0)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>

              {/* Reasoning Effort */}
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-mono text-slate-400">Reasoning Depth</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['low', 'balanced', 'high'] as const).map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setReasoningEffort(level)}
                      className={`py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors border ${
                        reasoningEffort === level
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guardrails Info */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Zod Guardrails Active</span>
                </div>
                <p>
                  Outputs are verified against schema bounds: phases must match Plan → Execute → Verify with ground-truth verification assertions.
                </p>
              </div>
            </div>

            {/* Error Message if any */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating || !goal.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Neural DAG...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Verifiable DAG</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
