import { callGeminiText } from "./gemini";

const EDITOR_SYSTEM_PROMPT = `You are the Editor Agent in a multi-agent AI planning system. Your job is to edit a specific section of a report based on user instructions.

Rules:
1. You receive the current content of ONE section (as JSON) and an editing instruction.
2. You must return ONLY the updated JSON for that section — same structure, modified content.
3. Preserve the JSON structure exactly. Only modify the text values based on the instruction.
4. Do NOT add commentary, explanations, or markdown — return pure JSON only.
5. Apply the instruction thoughtfully: "make more detailed" means add depth, "shorten" means condense, "professional tone" means formal business language, etc.`;

export async function runEditorAgent(
  sectionContent: string,
  instruction: string,
  sectionTitle: string
): Promise<string> {
  const userPrompt = `SECTION: "${sectionTitle}"

CURRENT CONTENT (JSON):
${sectionContent}

INSTRUCTION: "${instruction}"

Return the updated JSON with the instruction applied. Return ONLY valid JSON, no other text.`;

  const response = await callGeminiText(EDITOR_SYSTEM_PROMPT, userPrompt, 0.5);

  // Clean the response — strip markdown code fences if present
  let cleaned = response.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // Validate it's valid JSON
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    throw new Error(
      `Editor Agent failed to produce valid JSON. Raw output: ${cleaned.substring(0, 200)}`
    );
  }
}
