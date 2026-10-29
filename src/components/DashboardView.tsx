import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Clock,
  Terminal,
  ExternalLink,
  ChevronRight,
  Filter,
  Trash2,
  Download,
  Zap,
} from 'lucide-react';
import type { Workflow, WorkflowStep } from '../types/workflow';
import { TaskDetailsModal } from './TaskDetailsModal';

interface DashboardViewProps {
  workflows: Workflow[];
  activeWorkflow: Workflow | null;
  onSelectWorkflow: (wf: Workflow) => void;
  onApproveStep: (stepId: string) => Promise<void>;
  onRejectStep?: (stepId: string) => Promise<void>;
  onExecuteStep: (stepId: string, mode: 'REAL_EXECUTION' | 'LOCAL_CHECK' | 'SIMULATED_DEMO') => Promise<void>;
  onUpdateStep: (stepId: string, updates: any) => Promise<void>;
  onVerifyAll: (workflowId: string) => Promise<void>;
  onResetWorkflow?: (workflowId: string) => Promise<void>;
  onDeleteWorkflow?: (workflowId: string) => Promise<void>;
  onRunApproved?: (workflowId: string) => Promise<void>;
  onNavigateToWorkspace: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  workflows,
  activeWorkflow,
  onSelectWorkflow,
  onApproveStep,
  onRejectStep,
  onExecuteStep,
  onUpdateStep,
  onVerifyAll,
  onResetWorkflow,
  onDeleteWorkflow,
  onRunApproved,
  onNavigateToWorkspace,
}) => {
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'plan' | 'execute' | 'verify'>('all');
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  if (!activeWorkflow) {
    return (
      <div className="text-center py-20 space-y-4">
        <Layers className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Active Workflows</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          No workflow has been created yet. Launch the AI Workspace to formulate an objective and synthesize a verifiable DAG.
        </p>
        <button
          onClick={onNavigateToWorkspace}
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          Create First Workflow
        </button>
      </div>
    );
  }

  const planSteps = activeWorkflow.steps.filter((s) => s.phase === 'plan');
  const executeSteps = activeWorkflow.steps.filter((s) => s.phase === 'execute');
  const verifySteps = activeWorkflow.steps.filter((s) => s.phase === 'verify');

  const pendingApprovalCount = activeWorkflow.steps.filter((s) => s.status === 'needs_approval').length;
  const approvedCount = activeWorkflow.steps.filter((s) => s.status === 'approved').length;

  const handleBatchRun = async () => {
    if (!onRunApproved) return;
    setIsBatchRunning(true);
    try {
      await onRunApproved(activeWorkflow.id);
    } finally {
      setIsBatchRunning(false);
    }
  };

  const exportWorkflowJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeWorkflow, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeWorkflow.id}-dag.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const statusBadge = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3" />
            <span>Passed</span>
          </span>
        );
      case 'needs_approval':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>Needs Approval</span>
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
            <span>Approved</span>
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60 animate-spin">
            <span>Executing</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60">
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            <span>Pending</span>
          </span>
        );
    }
  };

  const renderStepCard = (step: WorkflowStep) => {
    return (
      <div
        key={step.id}
        onClick={() => setSelectedStep(step)}
        className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all shadow-sm group space-y-2.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500 font-bold">
            Step {step.order}
          </span>
          {statusBadge(step.status)}
        </div>

        <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
          {step.title}
        </h4>

        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
          {step.description}
        </p>

        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="text-cyan-400/80">{step.action.type}</span>
          <span>{step.verificationCriteria.length} criteria</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Workflow Selector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Active Workflow</span>
            <span>•</span>
            <span className="text-cyan-400">{activeWorkflow.model}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {activeWorkflow.title}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl line-clamp-1">
            {activeWorkflow.goal}
          </p>
        </div>

        {/* Workflow Switcher & Action buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {workflows.length > 1 && (
            <select
              value={activeWorkflow.id}
              onChange={(e) => {
                const found = workflows.find((w) => w.id === e.target.value);
                if (found) onSelectWorkflow(found);
              }}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              {workflows.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title.length > 28 ? w.title.substring(0, 28) + '...' : w.title}
                </option>
              ))}
            </select>
          )}

          {/* Batch Run button if steps approved or ready */}
          {(approvedCount > 0 || pendingApprovalCount > 0) && onRunApproved && (
            <button
              disabled={isBatchRunning}
              onClick={handleBatchRun}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-950"
              title="Run all approved steps in batch"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Run Approved ({approvedCount + pendingApprovalCount})</span>
            </button>
          )}

          <button
            onClick={() => onVerifyAll(activeWorkflow.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-md shadow-purple-950"
            title="Audit all verification gates"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Proof</span>
          </button>

          {/* Reset button */}
          {onResetWorkflow && (
            <button
              onClick={() => onResetWorkflow(activeWorkflow.id)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors border border-slate-700"
              title="Reset workflow execution state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Export JSON button */}
          <button
            onClick={exportWorkflowJson}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors border border-slate-700"
            title="Export DAG JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Delete workflow button if multiple exist */}
          {workflows.length > 1 && onDeleteWorkflow && (
            <button
              onClick={() => {
                if (window.confirm('Delete this workflow?')) {
                  onDeleteWorkflow(activeWorkflow.id);
                }
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 text-xs transition-colors border border-slate-700"
              title="Delete workflow"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Workflow Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <div className="text-[11px] font-mono text-slate-400">Completion Progress</div>
          <div className="text-lg font-bold text-white mt-1">
            {activeWorkflow.completedSteps} / {activeWorkflow.totalSteps}{' '}
            <span className="text-xs font-normal text-slate-400">steps</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all"
              style={{
                width: `${(activeWorkflow.completedSteps / activeWorkflow.totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <div className="text-[11px] font-mono text-slate-400">Empirical Score</div>
          <div className="text-lg font-bold text-purple-400 mt-1">
            {activeWorkflow.verificationScore}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Observable Proof</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <div className="text-[11px] font-mono text-slate-400">Synthesis Latency</div>
          <div className="text-lg font-bold text-cyan-400 mt-1">
            {activeWorkflow.latencyMs || 340} ms
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Nebius Inference</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <div className="text-[11px] font-mono text-slate-400">DAG Token Count</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">
            {activeWorkflow.tokenCount || 820}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Structured Schema</div>
        </div>
      </div>

      {/* 3-Column Phase Matrix (Plan -> Execute -> Verify) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Plan (Cyan) */}
        <div className="space-y-4 p-4 rounded-2xl bg-slate-900/40 border border-cyan-900/30">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-900/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-cyan-300">
                Phase 1: Plan ({planSteps.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Pre-conditions</span>
          </div>
          <div className="space-y-3">
            {planSteps.map((step) => renderStepCard(step))}
          </div>
        </div>

        {/* Column 2: Execute (Blue) */}
        <div className="space-y-4 p-4 rounded-2xl bg-slate-900/40 border border-blue-900/30">
          <div className="flex items-center justify-between pb-2 border-b border-blue-900/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-blue-300">
                Phase 2: Execute ({executeSteps.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Safe Actions</span>
          </div>
          <div className="space-y-3">
            {executeSteps.map((step) => renderStepCard(step))}
          </div>
        </div>

        {/* Column 3: Verify (Violet) */}
        <div className="space-y-4 p-4 rounded-2xl bg-slate-900/40 border border-purple-900/30">
          <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-purple-300">
                Phase 3: Verify ({verifySteps.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Ground Truth</span>
          </div>
          <div className="space-y-3">
            {verifySteps.map((step) => renderStepCard(step))}
          </div>
        </div>
      </div>

      {/* Modal for detailed inspection */}
      {selectedStep && (
        <TaskDetailsModal
          workflow={activeWorkflow}
          step={selectedStep}
          onClose={() => setSelectedStep(null)}
          onApprove={async (stepId) => {
            await onApproveStep(stepId);
            const updated = activeWorkflow.steps.find((s) => s.id === stepId);
            if (updated) setSelectedStep({ ...updated, status: 'approved' });
          }}
          onReject={async (stepId) => {
            if (onRejectStep) {
              await onRejectStep(stepId);
              const updated = activeWorkflow.steps.find((s) => s.id === stepId);
              if (updated) setSelectedStep({ ...updated, status: 'needs_approval' });
            }
          }}
          onExecute={async (stepId, mode) => {
            await onExecuteStep(stepId, mode);
            const updated = activeWorkflow.steps.find((s) => s.id === stepId);
            if (updated) setSelectedStep({ ...updated });
          }}
          onUpdateStep={async (stepId, updates) => {
            await onUpdateStep(stepId, updates);
            const updated = activeWorkflow.steps.find((s) => s.id === stepId);
            if (updated) setSelectedStep({ ...updated });
          }}
        />
      )}
    </div>
  );
};
