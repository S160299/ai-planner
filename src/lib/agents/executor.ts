import { callGemini } from "./gemini";
import { ExecutionOutput, InsightOutput, PlannerOutput } from "./types";

const EXECUTOR_SYSTEM_PROMPT = `You are the Execution Agent in a multi-agent AI planning system. You receive both the problem breakdown (from Planner Agent) and strategic insights (from Insight Agent), and generate a comprehensive execution plan.

You MUST return valid JSON matching this exact structure:
{
  "actionPlan": [
    {
      "phase": "string - e.g. 'Phase 1', 'Phase 2'",
      "title": "string - phase title",
      "duration": "string - e.g. '2-4 weeks'",
      "tasks": [
        {
          "task": "string - task description",
          "priority": "Critical" | "High" | "Medium" | "Low",
          "owner": "string - responsible team/role"
        }
      ],
      "deliverables": ["string array - key deliverables for this phase"]
    }
  ],
  "technologyRecommendations": [
    {
      "category": "string - e.g. 'Frontend', 'Backend', 'Database'",
      "recommendation": "string - specific technology",
      "reasoning": "string - why this choice"
    }
  ],
  "resourceEstimates": [
    {
      "role": "string - e.g. 'Full Stack Developer'",
      "count": number,
      "duration": "string - e.g. '6 months'"
    }
  ],
  "budgetEstimate": [
    {
      "category": "string - e.g. 'Development', 'Infrastructure'",
      "estimatedCost": "string - e.g. '$50,000 - $80,000'",
      "notes": "string - additional context"
    }
  ],
  "successMetrics": [
    {
      "metric": "string - what to measure",
      "target": "string - target value",
      "timeframe": "string - when to achieve"
    }
  ]
}

Provide 3-5 phases in the action plan, 5-7 technology recommendations, 4-6 resource estimates, 4-5 budget items, and 4-6 success metrics. Be practical and realistic.`;

export async function runExecutionAgent(
  problemStatement: string,
  plannerOutput: PlannerOutput,
  insightOutput: InsightOutput
): Promise<ExecutionOutput> {
  const userPrompt = `Based on the problem, its breakdown, and strategic insights, generate a comprehensive execution plan.

ORIGINAL PROBLEM: "${problemStatement}"

PLANNER OUTPUT:
${JSON.stringify(plannerOutput, null, 2)}

INSIGHT OUTPUT:
${JSON.stringify(insightOutput, null, 2)}

Create a detailed, phased execution plan with technology recommendations, resource needs, budget estimates, and success metrics.`;

  const response = await callGemini(EXECUTOR_SYSTEM_PROMPT, userPrompt, 0.7);

  try {
    const parsed = JSON.parse(response) as ExecutionOutput;
    return parsed;
  } catch {
    throw new Error(
      `Execution Agent failed to produce valid JSON. Raw output: ${response.substring(0, 200)}`
    );
  }
}
