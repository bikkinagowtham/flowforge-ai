import React from 'react';
import {
  Zap,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Cpu,
  Trophy,
  Activity,
  Terminal,
  GitBranch,
} from 'lucide-react';
import type { SystemStatus } from '../types/workflow';

export type NavTab =
  | 'home'
  | 'workspace'
  | 'dashboard'
  | 'verification'
  | 'activity'
  | 'infrastructure'
  | 'github'
  | 'hackathon';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  systemStatus: SystemStatus | null;
  activeWorkflowTitle?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  systemStatus,
  activeWorkflowTitle,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Zap },
    { id: 'workspace', label: 'AI Workspace', icon: Sparkles },
    { id: 'dashboard', label: 'Workflow DAG', icon: Layers },
    { id: 'verification', label: 'Verification Center', icon: CheckCircle2 },
    { id: 'activity', label: 'Audit Trail', icon: Clock },
    { id: 'infrastructure', label: 'Nebius & Models', icon: Cpu },
    { id: 'github', label: 'GitHub Sync', icon: GitBranch },
    { id: 'hackathon', label: 'Hackathon Hub', icon: Trophy },
  ];

  const isLive = systemStatus?.mode === 'live';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all border border-cyan-400/30">
            <Zap className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                FlowForge AI
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                v1.0
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
              NVIDIA Nemotron • Empirical Verification
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            onClick={() => onSelectTab('infrastructure')}
            className={`cursor-pointer flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              isLive
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-300 hover:bg-amber-950/50'
            }`}
            title={
              isLive
                ? 'Connected to live Nebius Token Factory inference'
                : 'Running in Standalone Demo Mode (no API key required)'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="hidden sm:inline">
              {isLive ? 'Nebius: Live' : 'Nebius: Demo Mode'}
            </span>
            <span className="sm:hidden">{isLive ? 'Live' : 'Demo'}</span>
          </div>

          <button
            onClick={() => onSelectTab('github')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              currentTab === 'github'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-800 hover:text-cyan-400'
            }`}
            title="GitHub Repository Sync & Backup Center"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">GitHub Sync</span>
          </button>

          <button
            onClick={() => onSelectTab('workspace')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-600/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline">New Workflow</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center justify-start gap-1 overflow-x-auto px-4 py-2 border-t border-slate-900 bg-slate-950 text-xs no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium text-xs transition-colors ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
