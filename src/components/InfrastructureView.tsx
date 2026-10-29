import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Server,
  Lock,
} from 'lucide-react';
import type { SystemStatus, ModelInfo } from '../types/workflow';

interface InfrastructureViewProps {
  systemStatus: SystemStatus | null;
  availableModels: ModelInfo[];
  onRefreshStatus: () => Promise<void>;
}

export const InfrastructureView: React.FC<InfrastructureViewProps> = ({
  systemStatus,
  availableModels,
  onRefreshStatus,
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{
    ok: boolean;
    mode: string;
    latencyMs: number;
    message: string;
    endpoint: string;
  } | null>(null);

  const handlePing = async () => {
    setIsPinging(true);
    try {
      const res = await fetch('/api/ping-nebius', { method: 'POST' });
      const data = await res.json();
      setPingResult(data);
      await onRefreshStatus();
    } catch (err: unknown) {
      setPingResult({
        ok: false,
        mode: 'error',
        latencyMs: 0,
        message: err instanceof Error ? err.message : 'Ping failed',
        endpoint: systemStatus?.baseUrl || 'unknown',
      });
    } finally {
      setIsPinging(false);
    }
  };

  const isLive = systemStatus?.mode === 'live';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Cpu className="w-4 h-4" />
            <span>Nebius Token Factory & NVIDIA Hardware</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Model & Infrastructure Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time diagnostics and inference cluster telemetry verifying low-latency NVIDIA Nemotron model serving.
          </p>
        </div>

        <button
          disabled={isPinging}
          onClick={handlePing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-emerald-950"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          <span>Ping Inference API</span>
        </button>
      </div>

      {/* Cluster Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Connection State */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Connection Status</span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </div>
          <div className="text-lg font-bold text-white">
            {isLive ? 'Live Nebius Connected' : 'Standalone Demo Mode'}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isLive
              ? 'Real-time HTTP requests dispatched to Nebius Token Factory inference endpoints.'
              : 'Autonomous fallback active with deterministic templates. No API key required for full feature exploration.'}
          </p>
        </div>

        {/* Inference Endpoint */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Gateway URL</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xs font-mono text-cyan-300 break-all bg-slate-950 p-2 rounded-lg border border-slate-800">
            {systemStatus?.baseUrl || 'https://api.tokenfactory.nebius.com/v1'}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Standard OpenAI-compatible JSON schema API
          </p>
        </div>

        {/* Secret & Credential Safety */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Credential Safety</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs font-mono text-emerald-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
            {isLive ? 'NEBIUS_API_KEY: Configured (Protected)' : 'NEBIUS_API_KEY: Not Set (Safe)'}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Zero secret exposure: Keys are parsed server-side only and never sent to browser bundles.
          </p>
        </div>
      </div>

      {/* Ping Benchmark Result if triggered */}
      {pingResult && (
        <div
          className={`p-4 rounded-xl border text-xs font-mono space-y-1 transition-all ${
            pingResult.ok
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span>Diagnostics Output: {pingResult.ok ? 'HEALTHY' : 'DEGRADED'}</span>
            <span>Latency: {pingResult.latencyMs} ms</span>
          </div>
          <p className="text-[11px] text-slate-300">{pingResult.message}</p>
        </div>
      )}

      {/* Model Specifications Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Supported NVIDIA Nemotron Models</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableModels.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{m.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {(m.contextWindow / 1024).toFixed(0)}k
                  </span>
                </div>
                <div className="text-[11px] font-mono text-cyan-400 truncate">{m.id}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800/60">
                <div className="text-[10px] font-mono uppercase text-slate-500">Key Strengths</div>
                <div className="flex flex-wrap gap-1">
                  {m.strengths.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
