import { callGemini } from "./gemini";
import { PlannerOutput } from "./types";

const PLANNER_SYSTEM_PROMPT = `You are the Planner Agent in a multi-agent AI planning system. Your role is to break down a user's problem into structured components.

You MUST return valid JSON matching this exact structure:
{
  "problemBreakdown": {
    "title": "string - concise title for the problem",
    "description": "string - 2-3 sentence description of the core problem",
    "coreAreas": ["string array - 4-6 key areas that need to be addressed"]
  },
  "stakeholders": [
    {
      "name": "string - stakeholder type (e.g. 'End Users', 'Platform Admins')",
      "role": "string - their role in the ecosystem",
      "needs": ["string array - 2-3 key needs"]
    }
  ],
  "scope": {
    "inScope": ["string array - 4-6 items that are in scope"],
    "outOfScope": ["string array - 3-4 items explicitly out of scope"]
  },
  "constraints": ["string array - 3-5 key constraints or limitations to consider"]
}

Be specific, actionable, and thorough. Think from a product and business perspective.`;

export async function runPlannerAgent(
  problemStatement: string
): Promise<PlannerOutput> {
  const userPrompt = `Analyze and break down the following problem:\n\n"${problemStatement}"\n\nProvide a comprehensive breakdown with stakeholders, scope, and constraints.`;

  const response = await callGemini(PLANNER_SYSTEM_PROMPT, userPrompt, 0.7);

  try {
    const parsed = JSON.parse(response) as PlannerOutput;
    return parsed;
  } catch {
    throw new Error(
      `Planner Agent failed to produce valid JSON. Raw output: ${response.substring(0, 200)}`
    );
  }
}
