import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Filter,
  Layers,
  Terminal,
  Copy,
} from 'lucide-react';
import type { ActivityEvent } from '../types/workflow';

interface ActivityViewProps {
  activities: ActivityEvent[];
}

export const ActivityView: React.FC<ActivityViewProps> = ({ activities }) => {
  const [filter, setFilter] = useState<'all' | 'success' | 'info' | 'error'>('all');
  const [copied, setCopied] = useState(false);

  const filtered = activities.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `flowforge-activity-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyLog = () => {
    const text = activities
      .map((a) => `[${a.timestamp}] [${a.type.toUpperCase()}] [${a.workflowTitle}]: ${a.details}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Clock className="w-4 h-4" />
            <span>Audit Trail & Telemetry Logs</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Activity History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological audit log tracking neural planning, operator approvals, and execution benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyLog}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition-colors border border-slate-700"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={exportJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-mono">
        {(['all', 'success', 'info', 'error'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
              filter === status
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {status} ({activities.filter((a) => (status === 'all' ? true : a.status === status)).length})
          </button>
        ))}
      </div>

      {/* Timeline items */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No activity events recorded under this filter.
          </div>
        ) : (
          filtered.map((act) => {
            return (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        act.status === 'success'
                          ? 'bg-emerald-400'
                          : act.status === 'error'
                          ? 'bg-rose-400'
                          : 'bg-cyan-400'
                      }`}
                    />
                    <span className="font-bold text-slate-300 uppercase">
                      {act.type.replace('_', ' ')}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 truncate max-w-xs">{act.workflowTitle}</span>
                  </div>
                  <span className="text-slate-500">
                    {new Date(act.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{act.details}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
