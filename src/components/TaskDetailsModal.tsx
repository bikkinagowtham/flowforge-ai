import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  Edit3,
  FileCode,
  Terminal,
  ShieldAlert,
  Loader2,
  Copy,
  Zap,
  Search,
} from 'lucide-react';
import type { WorkflowStep, Workflow } from '../types/workflow';

interface TaskDetailsModalProps {
  workflow: Workflow;
  step: WorkflowStep | null;
  onClose: () => void;
  onApprove: (stepId: string) => Promise<void>;
  onReject?: (stepId: string) => Promise<void>;
  onExecute: (stepId: string, mode: 'REAL_EXECUTION' | 'LOCAL_CHECK' | 'SIMULATED_DEMO') => Promise<void>;
  onUpdateStep: (stepId: string, updates: { title?: string; description?: string; action?: any }) => Promise<void>;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  workflow,
  step,
  onClose,
  onApprove,
  onReject,
  onExecute,
  onUpdateStep,
}) => {
  if (!step) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(step.title);
  const [editDesc, setEditDesc] = useState(step.description);
  const [editTarget, setEditTarget] = useState(step.action.target || step.action.artifactName || '');
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'terminal' | 'artifact'>('details');

  const phaseColors = {
    plan: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
    execute: 'text-blue-400 border-blue-500/40 bg-blue-950/40',
    verify: 'text-purple-400 border-purple-500/40 bg-purple-950/40',
  };

  const handleSaveEdit = async () => {
    await onUpdateStep(step.id, {
      title: editTitle,
      description: editDesc,
      action: {
        ...step.action,
        target: editTarget,
      },
    });
    setIsEditing(false);
  };

  const handleTriggerExecute = async (mode: 'REAL_EXECUTION' | 'LOCAL_CHECK' | 'SIMULATED_DEMO') => {
    setIsExecuting(true);
    try {
      await onExecute(step.id, mode);
      setActiveTab('terminal');
    } finally {
      setIsExecuting(false);
    }
  };

  const copyStdout = () => {
    if (step.output) {
      navigator.clipboard.writeText(step.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono uppercase font-bold border ${
                phaseColors[step.phase]
              }`}
            >
              Phase: {step.phase}
            </span>
            <span className="text-xs font-mono text-slate-400">Step {step.order} of {workflow.totalSteps}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/80 bg-slate-950/20 text-xs font-mono">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2 px-1 border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Step Specification
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`pb-2 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'terminal'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal Output</span>
            {step.output && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
          </button>
          {step.action.artifactContent && (
            <button
              onClick={() => setActiveTab('artifact')}
              className={`pb-2 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'artifact'
                  ? 'border-cyan-400 text-cyan-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Artifact Asset</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'details' && (
            <>
              {/* Step Title & Description */}
              {!isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Step</span>
                    </button>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
                </div>
              ) : (
                <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-cyan-800/60">
                  <div className="text-xs font-mono text-cyan-400 font-bold">Edit Step Definition</div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
                    placeholder="Step Title"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    placeholder="Step Description"
                  />
                  <input
                    type="text"
                    value={editTarget}
                    onChange={(e) => setEditTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                    placeholder="Target file or pattern"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 text-xs rounded bg-slate-800 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 text-xs rounded bg-cyan-600 text-slate-950 font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Action Specification */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center justify-between">
                  <span>Action Primitives</span>
                  <span className="text-cyan-400">{step.action.type}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                  <div>
                    <span className="text-slate-500">Target:</span>{' '}
                    <span className="text-slate-300">{step.action.target || step.action.artifactName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Last Mode:</span>{' '}
                    <span className="text-slate-300">{step.executionMode || 'Pending Run'}</span>
                  </div>
                </div>
              </div>

              {/* Verification Criteria */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center justify-between">
                  <span>Verifiable Success Criteria ({step.verificationCriteria.length})</span>
                </div>
                <div className="space-y-2">
                  {step.verificationCriteria.map((vc) => (
                    <div
                      key={vc.id}
                      className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                        vc.passed
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : vc.evaluated
                          ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {vc.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : vc.evaluated ? (
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0 mt-0.5" />
                        )}
                        <span className="font-medium">{vc.description}</span>
                      </div>

                      {vc.evidence && (
                        <div className="pl-6 text-[11px] font-mono text-slate-400">
                          <strong className="text-slate-500">Evidence:</strong> {vc.evidence}
                        </div>
                      )}

                      {vc.remediation && (
                        <div className="pl-6 text-[11px] font-mono text-amber-400">
                          <strong className="text-amber-500">Remediation:</strong> {vc.remediation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'terminal' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Process Stdout / Stderr</span>
                {step.output && (
                  <button
                    onClick={copyStdout}
                    className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy Output'}</span>
                  </button>
                )}
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto min-h-[220px] whitespace-pre-wrap leading-relaxed shadow-inner">
                {step.output || (
                  <span className="text-slate-600 italic">
                    No stdout recorded yet. Select an execution mode below to run action and capture process evidence.
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'artifact' && step.action.artifactContent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 font-bold">
                  {step.action.artifactName || 'Artifact Blueprint'}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {step.action.artifactContent.split('\n').length} lines
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-[300px]">
                {step.action.artifactContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions (Human in the loop approval & execution controls) */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {step.status === 'needs_approval' && (
              <button
                onClick={() => onApprove(step.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-emerald-950"
              >
                <Check className="w-4 h-4 text-slate-950" />
                <span>Approve Step</span>
              </button>
            )}

            {step.status === 'approved' && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
                  <Check className="w-3.5 h-3.5" />
                  <span>Approved</span>
                </span>
                {onReject && (
                  <button
                    onClick={() => onReject(step.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 text-xs font-mono transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}

            {(step.status === 'completed' || step.status === 'failed') && onReject && (
              <button
                onClick={() => onReject(step.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-mono transition-colors border border-slate-700"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Re-open Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={isExecuting}
              onClick={() => handleTriggerExecute('REAL_EXECUTION')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md shadow-blue-950"
              title="Execute mutation on filesystem / workspace"
            >
              {isExecuting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5 fill-current" />
              )}
              <span>Real Run</span>
            </button>

            <button
              disabled={isExecuting}
              onClick={() => handleTriggerExecute('LOCAL_CHECK')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-950"
              title="Audit structure & schema without mutation"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Local Check</span>
            </button>

            <button
              disabled={isExecuting}
              onClick={() => handleTriggerExecute('SIMULATED_DEMO')}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-mono transition-colors border border-slate-700"
              title="Virtual simulation"
            >
              <span>Simulate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
