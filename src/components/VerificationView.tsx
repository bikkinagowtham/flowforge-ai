import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Copy,
  Search,
  FileCheck,
  Check,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import type { Workflow, VerificationCriterion } from '../types/workflow';

interface VerificationViewProps {
  workflow: Workflow | null;
  onVerifyAll: (workflowId: string) => Promise<void>;
  onNavigateToDashboard: () => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  workflow,
  onVerifyAll,
  onNavigateToDashboard,
}) => {
  const [filter, setFilter] = useState<'all' | 'passed' | 'pending'>('all');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!workflow) {
    return (
      <div className="text-center py-20 space-y-4">
        <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Workflow to Verify</h2>
        <p className="text-sm text-slate-400">
          Select or synthesize a workflow first to audit verifiable outcomes.
        </p>
      </div>
    );
  }

  // Aggregate all criteria across steps
  const allCriteria: { criterion: VerificationCriterion; stepTitle: string; stepPhase: string }[] = [];
  workflow.steps.forEach((s) => {
    s.verificationCriteria.forEach((c) => {
      allCriteria.push({
        criterion: c,
        stepTitle: s.title,
        stepPhase: s.phase,
      });
    });
  });

  const passedCount = allCriteria.filter((c) => c.criterion.passed).length;
  const totalCount = allCriteria.length;
  const scorePercent = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  const filteredCriteria = allCriteria.filter((item) => {
    if (filter === 'passed') return item.criterion.passed;
    if (filter === 'pending') return !item.criterion.passed;
    return true;
  });

  const handleReverify = async () => {
    setIsVerifying(true);
    try {
      await onVerifyAll(workflow.id);
    } finally {
      setIsVerifying(false);
    }
  };

  const copyReport = () => {
    const report = `# FlowForge AI — Empirical Verification Report
Workflow: ${workflow.title}
Goal: ${workflow.goal}
Model: ${workflow.model}
Score: ${scorePercent}% (${passedCount}/${totalCount} criteria passed)
Generated: ${new Date().toISOString()}

## Ground-Truth Audit Trail:
${allCriteria
  .map(
    (c, i) =>
      `${i + 1}. [${c.criterion.passed ? 'PASSED' : 'PENDING'}] ${c.criterion.description}\n   Phase: ${c.stepPhase} | Step: ${c.stepTitle}\n   Evidence: ${c.criterion.evidence || 'None'}\n   Remediation: ${c.criterion.remediation || 'N/A'}`
  )
  .join('\n\n')}`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    const report = `# FlowForge AI — Empirical Verification Report
Workflow: ${workflow.title}
Goal: ${workflow.goal}
Model: ${workflow.model}
Score: ${scorePercent}% (${passedCount}/${totalCount} criteria passed)
Generated: ${new Date().toISOString()}

## Ground-Truth Audit Trail:
${allCriteria
  .map(
    (c, i) =>
      `${i + 1}. [${c.criterion.passed ? 'PASSED' : 'PENDING'}] ${c.criterion.description}\n   Phase: ${c.stepPhase} | Step: ${c.stepTitle}\n   Evidence: ${c.criterion.evidence || 'None'}\n   Remediation: ${c.criterion.remediation || 'N/A'}`
  )
  .join('\n\n')}`;

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(report);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `flowforge-verification-${workflow.id}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Empirical Ground-Truth Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Verification Center</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Audit objective evidence against explicit success criteria. FlowForge tests verifiable ground truth rather than assuming model confidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition-colors border border-slate-700"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={downloadReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition-colors border border-slate-700"
            title="Download Markdown Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export MD</span>
          </button>

          <button
            disabled={isVerifying}
            onClick={handleReverify}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md shadow-purple-950"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>Re-verify All Gates</span>
          </button>
        </div>
      </div>

      {/* Score Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-slate-950/60 border border-purple-900/40">
        {/* Gauge */}
        <div className="md:col-span-4 flex items-center gap-5">
          <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-slate-950 border-4 border-slate-800 shadow-xl shrink-0">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-purple-400 to-cyan-400">
              {scorePercent}%
            </span>
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">Verification Score</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {passedCount} of {totalCount} Passed
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {scorePercent >= 80 ? (
                <span className="text-emerald-400">High Confidence Ground Truth</span>
              ) : (
                <span className="text-amber-400">Verification in progress</span>
              )}
            </div>
          </div>
        </div>

        {/* Breakdown Summary */}
        <div className="md:col-span-8 grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 font-mono">Total Gates</span>
            <div className="text-base font-bold text-white mt-1">{totalCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
            <span className="text-emerald-400 font-mono">Passed</span>
            <div className="text-base font-bold text-emerald-300 mt-1">{passedCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40">
            <span className="text-amber-400 font-mono">Unmet / Pending</span>
            <div className="text-base font-bold text-amber-300 mt-1">
              {totalCount - passedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          {(['all', 'passed', 'pending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filter === tab
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? `All Criteria (${totalCount})` : tab === 'passed' ? `Passed (${passedCount})` : `Pending (${totalCount - passedCount})`}
            </button>
          ))}
        </div>
        <button
          onClick={onNavigateToDashboard}
          className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1"
        >
          <span>Open Execution DAG</span>
        </button>
      </div>

      {/* Criteria Breakdown Cards */}
      <div className="space-y-3">
        {filteredCriteria.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No criteria match selected filter.
          </div>
        ) : (
          filteredCriteria.map((item, idx) => {
            const { criterion, stepTitle, stepPhase } = item;
            return (
              <div
                key={criterion.id || idx}
                className={`p-4 rounded-xl border space-y-2 transition-all ${
                  criterion.passed
                    ? 'bg-slate-900/60 border-emerald-500/30 shadow-sm'
                    : 'bg-slate-900/30 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {criterion.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        {criterion.description}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-1">
                        <span className="capitalize px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {stepPhase}
                        </span>
                        <span>•</span>
                        <span>{stepTitle}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 ${
                      criterion.passed
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {criterion.passed ? 'Verified' : 'Pending'}
                  </span>
                </div>

                {/* Evidence or Remediation Block */}
                {criterion.evidence && (
                  <div className="mt-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-slate-300">
                    <span className="text-emerald-400 font-bold">Observable Evidence:</span>{' '}
                    {criterion.evidence}
                  </div>
                )}

                {!criterion.passed && criterion.remediation && (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-[11px] font-mono text-amber-300">
                    <span className="text-amber-400 font-bold">Remediation Advice:</span>{' '}
                    {criterion.remediation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
