export type PhaseType = 'plan' | 'execute' | 'verify';

export type StepStatus = 'pending' | 'needs_approval' | 'approved' | 'running' | 'completed' | 'failed';

export interface ActionDefinition {
  type: 'structure_check' | 'json_validation' | 'syntax_check' | 'artifact_generator' | 'custom_command';
  target?: string;
  command?: string;
  expectedPattern?: string;
  artifactName?: string;
  artifactContent?: string;
}

export interface VerificationCriterion {
  id: string;
  description: string;
  evaluated: boolean;
  passed: boolean;
  evidence?: string;
  remediation?: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  phase: PhaseType;
  status: StepStatus;
  order: number;
  action: ActionDefinition;
  verificationCriteria: VerificationCriterion[];
  output?: string;
  executionMode?: 'REAL_EXECUTION' | 'LOCAL_CHECK' | 'SIMULATED_DEMO';
  executedAt?: string;
  error?: string;
}

export interface Workflow {
  id: string;
  title: string;
  goal: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'in_progress' | 'completed' | 'failed';
  totalSteps: number;
  completedSteps: number;
  verificationScore: number;
  steps: WorkflowStep[];
  latencyMs?: number;
  tokenCount?: number;
  isSimulated?: boolean;
}

export interface ActivityEvent {
  id: string;
  workflowId: string;
  workflowTitle: string;
  type: 'plan_generated' | 'step_approved' | 'step_executed' | 'verification_evaluated' | 'workflow_completed' | 'step_edited' | 'workflow_deleted' | 'workflow_reset';
  timestamp: string;
  details: string;
  status: 'info' | 'success' | 'warning' | 'error';
  metadata?: Record<string, unknown>;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  description: string;
  strengths: string[];
  recommendedFor: string;
}

export interface SystemStatus {
  nebiusConfigured: boolean;
  baseUrl: string;
  activeModel: string;
  nodeEnv: string;
  mode: 'live' | 'standalone_demo';
  version: string;
  lastPingMs?: number;
}
