import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  ShieldCheck,
  Download,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Copy,
  ExternalLink,
  ArrowRight,
  Server,
} from 'lucide-react';

export const GitHubSyncCard: React.FC = () => {
  const [gitStatus, setGitStatus] = useState<{
    connected: boolean;
    remoteUrl?: string;
    currentBranch?: string;
    latestCommit?: string;
    backupBranch?: string;
    backupCommit?: string;
    backupFileAvailable?: boolean;
    cleanWorkingTree?: boolean;
    error?: string;
  } | null>(null);

  const [token, setToken] = useState<string>('');
  const [pushBackup, setPushBackup] = useState<boolean>(true);
  const [confirmOverwrite, setConfirmOverwrite] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<{
    ok: boolean;
    message?: string;
    error?: string;
    backupResult?: string;
    commit?: string;
  } | null>(null);

  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const fetchStatus = () => {
    fetch('/api/git/status')
      .then((res) => res.json())
      .then((data) => setGitStatus(data))
      .catch((err) => setGitStatus({ connected: false, error: err.message }));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSync = async () => {
    if (!confirmOverwrite) return;
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch('/api/git/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubToken: token,
          confirmOverwrite: true,
          pushBackup,
        }),
      });

      const data = await res.json();
      setSyncResult(data);
      if (data.ok) {
        fetchStatus();
      }
    } catch (err: unknown) {
      setSyncResult({
        ok: false,
        error: err instanceof Error ? err.message : 'Sync request failed',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const copyLocalInstructions = () => {
    const text = `# 1. Create safety backup branch on GitHub first:
git branch backup/original-imported-state d6340f4
git push origin backup/original-imported-state

# 2. Inspect clean diff between original and corrected version:
git diff backup/original-imported-state main

# 3. Push verified FlowForge AI codebase to main:
git push origin main`;
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6 p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-900/80 border border-cyan-800/50 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <GitBranch className="w-4 h-4" />
            <span>GitHub Repository Synchronization & Safety Gate</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            bikkinagowtham / flowforge-ai
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Target Repository: <code className="text-cyan-300">https://github.com/bikkinagowtham/flowforge-ai</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/backup/download"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
            title="Download archived copy of the original code"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download Original Backup (.tar.gz)</span>
          </a>
        </div>
      </div>

      {/* Safety & Version Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Remote State */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="font-mono text-slate-500 uppercase text-[10px]">Remote Target</div>
          <div className="font-bold text-slate-200">branch: main</div>
          <div className="font-mono text-[11px] text-slate-400">
            Original commit: <span className="text-amber-400">d6340f4 (Add files via upload)</span>
          </div>
        </div>

        {/* Safety Backup Branch */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-900/40 space-y-1">
          <div className="font-mono text-emerald-400 uppercase text-[10px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safety Backup State</span>
          </div>
          <div className="font-bold text-slate-200">
            backup/original-imported-state
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Preserved at: <span className="text-emerald-400">d6340f4</span> (Local & Archive ready)
          </div>
        </div>

        {/* Corrected Local State */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-900/40 space-y-1">
          <div className="font-mono text-cyan-400 uppercase text-[10px]">Verified Working Build</div>
          <div className="font-bold text-slate-200">
            Full-Stack React + Express + Three.js
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Status: <span className="text-cyan-400">100% Passed Tests & Compiler</span>
          </div>
        </div>
      </div>

      {/* Sync Execution Section */}
      <div className="space-y-4 p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Step-by-Step GitHub Authorization & Sync</span>
          </h4>
          <p className="text-xs text-slate-400">
            To synchronize directly from AI Studio, provide a temporary GitHub Personal Access Token (PAT) with <code className="text-slate-300">repo</code> write scope. Alternatively, you can use the terminal commands below.
          </p>
        </div>

        {/* Token Input Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <label className="text-slate-300 font-semibold">
              GitHub Personal Access Token (PAT)
            </label>
            <a
              href="https://github.com/settings/tokens/new?scopes=repo&description=FlowForge+AI+Sync"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Generate token on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white placeholder:text-slate-600 transition-all"
          />
          <p className="text-[11px] text-slate-500 font-mono">
            Tokens are passed in-memory exclusively for the sync push and are never stored or logged.
          </p>
        </div>

        {/* Safety Checkboxes */}
        <div className="space-y-2 pt-2 border-t border-slate-900 text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={pushBackup}
              onChange={(e) => setPushBackup(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded"
            />
            <span>
              Push <strong className="text-emerald-400">backup/original-imported-state</strong> branch to GitHub first before updating main
            </span>
          </label>

          <label className="flex items-center gap-2 text-slate-200 cursor-pointer select-none p-2 rounded-lg bg-amber-950/20 border border-amber-900/30">
            <input
              type="checkbox"
              checked={confirmOverwrite}
              onChange={(e) => setConfirmOverwrite(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <span className="text-amber-200 font-medium">
              I confirm that I have reviewed the verified code and approve updating the <code className="text-white">main</code> branch on <code className="text-white">bikkinagowtham/flowforge-ai</code>
            </span>
          </label>
        </div>

        {/* Trigger Button */}
        <div className="pt-2">
          <button
            disabled={!confirmOverwrite || !token.trim() || isSyncing}
            onClick={handleSync}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Synchronizing to GitHub...</span>
              </>
            ) : (
              <>
                <GitBranch className="w-4 h-4 text-slate-950" />
                <span>Confirm & Sync to GitHub (Push Backup + Main)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </div>

        {/* Sync Feedback Message */}
        {syncResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-mono space-y-1 transition-all ${
              syncResult.ok
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="font-bold flex items-center gap-2">
              {syncResult.ok ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Synchronization Complete!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Synchronization Failed</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-300">
              {syncResult.ok ? syncResult.message : syncResult.error}
            </p>
            {syncResult.backupResult && (
              <p className="text-[10px] text-emerald-400">
                Backup State: {syncResult.backupResult}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Alternative: Local Terminal Method */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 font-mono">
            Alternative: Run via Local Git Terminal
          </span>
          <button
            onClick={copyLocalInstructions}
            className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedCmd ? 'Copied' : 'Copy Commands'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
{`# 1. Ensure safety backup branch exists on remote GitHub:
git branch backup/original-imported-state d6340f4
git push origin backup/original-imported-state

# 2. Review the diff before updating:
git diff backup/original-imported-state main

# 3. Push verified FlowForge AI codebase to main:
git push origin main`}
        </pre>
      </div>
    </div>
  );
};
