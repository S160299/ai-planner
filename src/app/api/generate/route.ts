import { NextRequest } from "next/server";
import { runAgentPipeline } from "@/lib/agents/orchestrator";
import { AgentStep } from "@/lib/agents/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { problem } = await request.json();

  if (!problem || typeof problem !== "string" || problem.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: "Problem statement is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const report = await runAgentPipeline(
          problem.trim(),
          (steps: AgentStep[]) => {
            const event = `data: ${JSON.stringify({ type: "progress", steps })}\n\n`;
            controller.enqueue(encoder.encode(event));
          }
        );

        const finalEvent = `data: ${JSON.stringify({ type: "complete", report })}\n\n`;
        controller.enqueue(encoder.encode(finalEvent));
        controller.close();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        const errorEvent = `data: ${JSON.stringify({ type: "error", error: errorMessage })}\n\n`;
        controller.enqueue(encoder.encode(errorEvent));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
