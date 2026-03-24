import { NextRequest, NextResponse } from "next/server";
import { runEditorAgent } from "@/lib/agents/editor";

export async function POST(request: NextRequest) {
  const { sectionId, sectionTitle, currentContent, instruction } =
    await request.json();

  if (!sectionId || !currentContent || !instruction) {
    return NextResponse.json(
      { error: "sectionId, currentContent, and instruction are required" },
      { status: 400 }
    );
  }

  try {
    const contentStr =
      typeof currentContent === "string"
        ? currentContent
        : JSON.stringify(currentContent, null, 2);

    const updatedContent = await runEditorAgent(
      contentStr,
      instruction,
      sectionTitle || sectionId
    );

    return NextResponse.json({
      sectionId,
      updatedContent: JSON.parse(updatedContent),
      instruction,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
