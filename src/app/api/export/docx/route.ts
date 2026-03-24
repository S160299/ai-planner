import { NextRequest } from "next/server";
import { generateDocx } from "@/lib/export/docx-generator";
import { ReportData } from "@/lib/agents/types";

export async function POST(request: NextRequest) {
  try {
    const report: ReportData = await request.json();

    if (!report || !report.plannerOutput) {
      return new Response(
        JSON.stringify({ error: "Valid report data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const buffer = await generateDocx(report);

    return new Response(buffer.buffer as ArrayBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="AI-Planning-Report-${Date.now()}.docx"`,
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
