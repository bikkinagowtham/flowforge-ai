import React, { useState, useEffect } from 'react';
import { Navigation, NavTab } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { WorkspaceView } from './components/WorkspaceView';
import { DashboardView } from './components/DashboardView';
import { VerificationView } from './components/VerificationView';
import { ActivityView } from './components/ActivityView';
import { InfrastructureView } from './components/InfrastructureView';
import { HackathonView } from './components/HackathonView';
import { GitHubSyncCard } from './components/GitHubSyncCard';
import type { Workflow, ActivityEvent, SystemStatus, ModelInfo } from './types/workflow';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [workspaceInitialGoal, setWorkspaceInitialGoal] = useState<string>('');

  const refreshStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  const refreshModels = async () => {
    try {
      const res = await fetch('/api/models');
      if (res.ok) {
        const data = await res.json();
        setAvailableModels(data);
      }
    } catch (err) {
      console.error('Failed to fetch models:', err);
    }
  };

  const refreshWorkflows = async () => {
    try {
      const res = await fetch('/api/workflows');
      if (res.ok) {
        const data: Workflow[] = await res.json();
        setWorkflows(data);
        if (data.length > 0 && !activeWorkflow) {
          setActiveWorkflow(data[0]);
        } else if (activeWorkflow) {
          const updated = data.find((w) => w.id === activeWorkflow.id);
          if (updated) setActiveWorkflow(updated);
        }
      }
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
    }
  };

  const refreshActivities = async () => {
    try {
      const res = await fetch('/api/activities');
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    }
  };

  useEffect(() => {
    refreshStatus();
    refreshModels();
    refreshWorkflows();
    refreshActivities();
  }, []);

  const handleApproveStep = async (stepId: string) => {
    if (!activeWorkflow) return;
    try {
      const res = await fetch(`/api/workflows/${activeWorkflow.id}/steps/${stepId}/approve`, {
        method: 'POST',
      });
      if (res.ok) {
        await refreshWorkflows();
        await refreshActivities();
      }
    } catch (err) {
      console.error('Error approving step:', err);
    }
  };

  const handleExecuteStep = async (
    stepId: string,
    mode: 'REAL_EXECUTION' | 'LOCAL_CHECK' | 'SIMULATED_DEMO'
  ) => {
    if (!activeWorkflow) return;
    try {
      const res = await fetch(`/api/workflows/${activeWorkflow.id}/steps/${stepId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executionMode: mode }),
      });
      if (res.ok) {
        await refreshWorkflows();
        await refreshActivities();
      }
    } catch (err) {
      console.error('Error executing step:', err);
    }
  };

  const handleUpdateStep = async (stepId: string, updates: any) => {
    if (!activeWorkflow) return;
    try {
      const res = await fetch(`/api/workflows/${activeWorkflow.id}/steps/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await refreshWorkflows();
        await refreshActivities();
      }
    } catch (err) {
      console.error('Error updating step:', err);
    }
  };

  const handleVerifyAll = async (workflowId: string) => {
    try {
      const res = await fetch(`/api/workflows/${workflowId}/verify-all`, {
        method: 'POST',
      });
      if (res.ok) {
        await refreshWorkflows();
        await refreshActivities();
      }
    } catch (err) {
      console.error('Error verifying all:', err);
    }
  };

  const handleRejectStep = async (stepId: string) => {
    if (!activeWorkflow) return;
    try {
      const res = await fetch(`/api/workflows/${activeWorkflow.id}/steps/${stepId}/reject`, {
        method: 'POST',
      });
      if (res.ok) {
        await refreshWorkflows();
        await refreshActivities();
      }
    } catch (err) {
      console.error('Error resetting step:', err);
    }
  };

  const handleResetWorkflow = async (workflowId: string) => {
    try {
      const res = await fetch(`/api/workflows/${workflowId}/reset`, {
        method: 'POST',
      });
      if (res.ok) {
        await refreshWorkflows();
        await refreshActivities();
      }
    } catch (err) {
      console.error('Error resetting workflow:', err);
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    try {
      const res = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const remaining = workflows.filter((w) => w.id !== workflowId);
        setWorkflows(remaining);
        if (remaining.length > 0) {
          setActiveWorkflow(remaining[0]);
        } else {
          setActiveWorkflow(null);
        }
        await refreshActivities();
      }
    } catch (err) {
      console.error('Error deleting workflow:', err);
    }
  };

  const handleRunApproved = async (workflowId: string) => {
    try {
      const res = await fetch(`/api/workflows/${workflowId}/run-approved`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executionMode: 'LOCAL_CHECK' }),
      });
      if (res.ok) {
        await refreshWorkflows();
        await refreshActivities();
      }
    } catch (err) {
      console.error('Error running approved steps:', err);
    }
  };

  const handleWorkflowGenerated = (wf: Workflow) => {
    setWorkflows((prev) => [wf, ...prev]);
    setActiveWorkflow(wf);
    setCurrentTab('dashboard');
    refreshActivities();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        systemStatus={systemStatus}
        activeWorkflowTitle={activeWorkflow?.title}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === 'home' && (
          <HomeView
            systemStatus={systemStatus}
            activeWorkflow={activeWorkflow}
            onNavigate={setCurrentTab}
            onSelectPreset={(presetPrompt) => {
              setWorkspaceInitialGoal(presetPrompt);
              setCurrentTab('workspace');
            }}
          />
        )}

        {currentTab === 'workspace' && (
          <WorkspaceView
            systemStatus={systemStatus}
            availableModels={availableModels}
            initialGoal={workspaceInitialGoal}
            onWorkflowGenerated={handleWorkflowGenerated}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            workflows={workflows}
            activeWorkflow={activeWorkflow}
            onSelectWorkflow={setActiveWorkflow}
            onApproveStep={handleApproveStep}
            onRejectStep={handleRejectStep}
            onExecuteStep={handleExecuteStep}
            onUpdateStep={handleUpdateStep}
            onVerifyAll={handleVerifyAll}
            onResetWorkflow={handleResetWorkflow}
            onDeleteWorkflow={handleDeleteWorkflow}
            onRunApproved={handleRunApproved}
            onNavigateToWorkspace={() => setCurrentTab('workspace')}
          />
        )}

        {currentTab === 'verification' && (
          <VerificationView
            workflow={activeWorkflow}
            onVerifyAll={handleVerifyAll}
            onNavigateToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'activity' && <ActivityView activities={activities} />}

        {currentTab === 'infrastructure' && (
          <InfrastructureView
            systemStatus={systemStatus}
            availableModels={availableModels}
            onRefreshStatus={refreshStatus}
          />
        )}

        {currentTab === 'github' && (
          <div className="max-w-4xl mx-auto space-y-6 pb-16">
            <GitHubSyncCard />
          </div>
        )}

        {currentTab === 'hackathon' && <HackathonView />}
      </main>
    </div>
  );
}
