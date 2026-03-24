import { callGemini } from "./gemini";
import { InsightOutput, PlannerOutput } from "./types";

const INSIGHT_SYSTEM_PROMPT = `You are the Insight Agent in a multi-agent AI planning system. You receive a structured problem breakdown from the Planner Agent and enrich it with market context, risk analysis, and solution approaches.

You MUST return valid JSON matching this exact structure:
{
  "marketContext": {
    "overview": "string - 2-3 sentence market overview",
    "trends": ["string array - 4-5 relevant industry trends"],
    "competitiveLandscape": "string - brief competitive analysis"
  },
  "risks": [
    {
      "category": "string - e.g. 'Technical', 'Market', 'Operational', 'Financial'",
      "description": "string - description of the risk",
      "likelihood": "Low" | "Medium" | "High",
      "mitigation": "string - how to mitigate this risk"
    }
  ],
  "solutionApproaches": [
    {
      "name": "string - approach name",
      "description": "string - 2-3 sentence description",
      "pros": ["string array - 2-3 advantages"],
      "cons": ["string array - 2-3 disadvantages"],
      "recommended": boolean
    }
  ]
}

Provide 4-5 risks across different categories and 2-3 solution approaches (mark exactly one as recommended). Be insightful and strategic.`;

export async function runInsightAgent(
  problemStatement: string,
  plannerOutput: PlannerOutput
): Promise<InsightOutput> {
  const userPrompt = `Based on the following problem and its structured breakdown, provide market insights, risk analysis, and solution approaches.

ORIGINAL PROBLEM: "${problemStatement}"

PLANNER OUTPUT:
${JSON.stringify(plannerOutput, null, 2)}

Provide deep market context, identify risks, and propose solution approaches with pros/cons.`;

  const response = await callGemini(INSIGHT_SYSTEM_PROMPT, userPrompt, 0.7);

  try {
    const parsed = JSON.parse(response) as InsightOutput;
    return parsed;
  } catch {
    throw new Error(
      `Insight Agent failed to produce valid JSON. Raw output: ${response.substring(0, 200)}`
    );
  }
}
