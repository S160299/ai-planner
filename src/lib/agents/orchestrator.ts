import { runPlannerAgent } from "./planner";
import { runInsightAgent } from "./insight";
import { runExecutionAgent } from "./executor";
import { ReportData, AgentStep } from "./types";

export type AgentProgressCallback = (steps: AgentStep[]) => void;

export async function runAgentPipeline(
  problemStatement: string,
  onProgress?: AgentProgressCallback
): Promise<ReportData> {
  const steps: AgentStep[] = [
    {
      agent: "planner",
      status: "pending",
      label: "Planner Agent",
      description: "Breaking down the problem into components",
    },
    {
      agent: "insight",
      status: "pending",
      label: "Insight Agent",
      description: "Enriching with market context and risk analysis",
    },
    {
      agent: "executor",
      status: "pending",
      label: "Execution Agent",
      description: "Generating action plan and recommendations",
    },
  ];

  const updateStep = (
    index: number,
    update: Partial<AgentStep>
  ) => {
    steps[index] = { ...steps[index], ...update };
    onProgress?.(structuredClone(steps));
  };

  // Step 1: Planner Agent
  updateStep(0, { status: "running", startedAt: new Date().toISOString() });
  const plannerOutput = await runPlannerAgent(problemStatement);
  updateStep(0, { status: "completed", completedAt: new Date().toISOString() });

  // Step 2: Insight Agent
  updateStep(1, { status: "running", startedAt: new Date().toISOString() });
  const insightOutput = await runInsightAgent(problemStatement, plannerOutput);
  updateStep(1, { status: "completed", completedAt: new Date().toISOString() });

  // Step 3: Execution Agent
  updateStep(2, { status: "running", startedAt: new Date().toISOString() });
  const executionOutput = await runExecutionAgent(
    problemStatement,
    plannerOutput,
    insightOutput
  );
  updateStep(2, { status: "completed", completedAt: new Date().toISOString() });

  const report: ReportData = {
    id: crypto.randomUUID(),
    problemStatement,
    generatedAt: new Date().toISOString(),
    plannerOutput,
    insightOutput,
    executionOutput,
  };

  return report;
}
