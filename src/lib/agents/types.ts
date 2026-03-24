// ============================================
// Types for the Multi-Agent Planning Pipeline
// ============================================

export interface PlannerOutput {
  problemBreakdown: {
    title: string;
    description: string;
    coreAreas: string[];
  };
  stakeholders: {
    name: string;
    role: string;
    needs: string[];
  }[];
  scope: {
    inScope: string[];
    outOfScope: string[];
  };
  constraints: string[];
}

export interface InsightOutput {
  marketContext: {
    overview: string;
    trends: string[];
    competitiveLandscape: string;
  };
  risks: {
    category: string;
    description: string;
    likelihood: "Low" | "Medium" | "High";
    mitigation: string;
  }[];
  solutionApproaches: {
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    recommended: boolean;
  }[];
}

export interface ExecutionOutput {
  actionPlan: {
    phase: string;
    title: string;
    duration: string;
    tasks: {
      task: string;
      priority: "Critical" | "High" | "Medium" | "Low";
      owner: string;
    }[];
    deliverables: string[];
  }[];
  technologyRecommendations: {
    category: string;
    recommendation: string;
    reasoning: string;
  }[];
  resourceEstimates: {
    role: string;
    count: number;
    duration: string;
  }[];
  budgetEstimate: {
    category: string;
    estimatedCost: string;
    notes: string;
  }[];
  successMetrics: {
    metric: string;
    target: string;
    timeframe: string;
  }[];
}

export interface ReportData {
  id: string;
  problemStatement: string;
  generatedAt: string;
  plannerOutput: PlannerOutput;
  insightOutput: InsightOutput;
  executionOutput: ExecutionOutput;
}

export interface SectionEdit {
  sectionId: string;
  timestamp: string;
  instruction: string;
  previousContent: string;
  newContent: string;
}

export interface AgentStep {
  agent: "planner" | "insight" | "executor";
  status: "pending" | "running" | "completed" | "error";
  label: string;
  description: string;
  startedAt?: string;
  completedAt?: string;
}

export type ReportSectionId =
  | "problemBreakdown"
  | "stakeholders"
  | "scope"
  | "constraints"
  | "marketContext"
  | "risks"
  | "solutionApproaches"
  | "actionPlan"
  | "technologyRecommendations"
  | "resourceEstimates"
  | "budgetEstimate"
  | "successMetrics";

export interface ReportSection {
  id: ReportSectionId;
  title: string;
  icon: string;
  agentSource: "planner" | "insight" | "executor";
  content: unknown;
}
