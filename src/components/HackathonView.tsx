import React, { useState, useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  FileText,
  Video,
  GitBranch,
  ExternalLink,
  Code2,
  Check,
  Copy,
} from 'lucide-react';

export const HackathonView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'DEMO_SCRIPT.md' | 'ARCHITECTURE.md' | 'SUBMISSION_CHECKLIST.md'>('DEMO_SCRIPT.md');
  const [docContent, setDocContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/docs/${activeDoc}`)
      .then((res) => res.json())
      .then((data) => {
        setDocContent(data.content || '');
      })
      .catch((err) => {
        setDocContent(`Error loading document: ${err.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeDoc]);

  const copyDoc = () => {
    navigator.clipboard.writeText(docContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checklistItems = [
    { text: 'Target Track: Best Apps and Agents', completed: true },
    { text: 'NVIDIA Nemotron foundational model integration', completed: true },
    { text: 'Nebius Token Factory inference endpoint config', completed: true },
    { text: 'Human-in-the-loop approval gate on executable actions', completed: true },
    { text: 'Empirical verification engine measuring ground-truth evidence', completed: true },
    { text: 'Interactive 3D WebGL hero visualization (Three.js)', completed: true },
    { text: 'Zero hardcoded secrets, server-side API proxying', completed: true },
    { text: 'Complete Architecture, Demo Script, and Submission Docs', completed: true },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Track & Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-slate-950/60 border border-amber-900/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span>Nebius x NVIDIA Global AI Hackathon 2026</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Track: <strong className="text-white">Best Apps and Agents</strong>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Hackathon Submission & Compliance Hub
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Everything required for the official hackathon submission: compliance checklist,
          3-minute demonstration video script with timestamps, system architecture deep-dive,
          and verifiable technical artifacts.
        </p>
      </div>

      {/* Deliverables Checklist */}
      <div className="space-y-4 p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Track Deliverables Checklist</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {checklistItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5 text-slate-200"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-500/60 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Document Viewer */}
      <div className="space-y-4 p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveDoc('DEMO_SCRIPT.md')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeDoc === 'DEMO_SCRIPT.md'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>3-Min Demo Script</span>
            </button>
            <button
              onClick={() => setActiveDoc('ARCHITECTURE.md')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeDoc === 'ARCHITECTURE.md'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Architecture Deep-Dive</span>
            </button>
            <button
              onClick={() => setActiveDoc('SUBMISSION_CHECKLIST.md')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeDoc === 'SUBMISSION_CHECKLIST.md'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Submission Checklist</span>
            </button>
          </div>

          <button
            onClick={copyDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 self-start sm:self-auto"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied' : 'Copy Document'}</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-[460px] whitespace-pre-wrap">
          {isLoading ? (
            <div className="py-8 text-center text-slate-500">Loading documentation...</div>
          ) : (
            docContent
          )}
        </div>
      </div>

      {/* GitHub Repository Sync Guide */}
      <div className="space-y-4 p-6 rounded-2xl bg-slate-900/40 border border-cyan-800/40">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">GitHub Synchronization Instructions</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
            bikkinagowtham/flowforge-ai
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The code has been verified and compiled with zero errors. When you are ready to update your GitHub repository with this corrected, working version, use the following commands:
        </p>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 space-y-2">
          <div className="text-slate-500"># 1. Check local status & verified files</div>
          <div>git status</div>
          <div className="text-slate-500 pt-2"># 2. Stage all corrected project files (secrets & node_modules protected by .gitignore)</div>
          <div>git add .</div>
          <div className="text-slate-500 pt-2"># 3. Commit the full-stack working implementation</div>
          <div>git commit -m "fix: FlowForge AI working full-stack implementation with Nebius Token Factory & NVIDIA Nemotron"</div>
          <div className="text-slate-500 pt-2"># 4. Push to update your repository</div>
          <div>git push origin main</div>
        </div>
      </div>
    </div>
  );
};
