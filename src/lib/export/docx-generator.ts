import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Packer,
  ShadingType,
} from "docx";
import { ReportData } from "@/lib/agents/types";

function createTitle(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 48,
        color: "1a1a2e",
        font: "Calibri",
      }),
    ],
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  });
}

function createHeading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28,
        color: "16213e",
        font: "Calibri",
      }),
    ],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  });
}

function createSubheading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        color: "0f3460",
        font: "Calibri",
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });
}

function createBody(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22,
        font: "Calibri",
      }),
    ],
    spacing: { after: 120 },
  });
}

function createBullet(text: string, level = 0): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22,
        font: "Calibri",
      }),
    ],
    bullet: { level },
    spacing: { after: 80 },
  });
}

function createLabeledText(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        size: 22,
        font: "Calibri",
      }),
      new TextRun({
        text: value,
        size: 22,
        font: "Calibri",
      }),
    ],
    spacing: { after: 80 },
  });
}

function createSimpleTable(
  headers: string[],
  rows: string[][]
): Table {
  const headerCells = headers.map(
    (h) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: h, bold: true, size: 20, font: "Calibri", color: "FFFFFF" }),
            ],
          }),
        ],
        shading: { type: ShadingType.SOLID, color: "16213e" },
        width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
      })
  );

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: cell, size: 20, font: "Calibri" }),
                  ],
                }),
              ],
              width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
            })
        ),
      })
  );

  return new Table({
    rows: [new TableRow({ children: headerCells }), ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
  });
}

export async function generateDocx(report: ReportData): Promise<Uint8Array> {
  const sections: (Paragraph | Table)[] = [];

  // Title
  sections.push(createTitle("AI Planning Report"));
  sections.push(createBody(`Generated: ${new Date(report.generatedAt).toLocaleDateString()}`));
  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Problem Statement: ", bold: true, size: 22, font: "Calibri" }),
        new TextRun({ text: report.problemStatement, italics: true, size: 22, font: "Calibri" }),
      ],
      spacing: { after: 400 },
    })
  );

  // ---- PLANNER OUTPUT ----
  sections.push(createHeading("1. Problem Breakdown"));
  sections.push(createSubheading(report.plannerOutput.problemBreakdown.title));
  sections.push(createBody(report.plannerOutput.problemBreakdown.description));
  sections.push(createSubheading("Core Areas"));
  report.plannerOutput.problemBreakdown.coreAreas.forEach((area) => {
    sections.push(createBullet(area));
  });

  sections.push(createHeading("2. Stakeholders"));
  report.plannerOutput.stakeholders.forEach((s) => {
    sections.push(createSubheading(s.name));
    sections.push(createLabeledText("Role", s.role));
    s.needs.forEach((need) => {
      sections.push(createBullet(need));
    });
  });

  sections.push(createHeading("3. Scope"));
  sections.push(createSubheading("In Scope"));
  report.plannerOutput.scope.inScope.forEach((item) => {
    sections.push(createBullet(item));
  });
  sections.push(createSubheading("Out of Scope"));
  report.plannerOutput.scope.outOfScope.forEach((item) => {
    sections.push(createBullet(item));
  });

  sections.push(createHeading("4. Constraints"));
  report.plannerOutput.constraints.forEach((c) => {
    sections.push(createBullet(c));
  });

  // ---- INSIGHT OUTPUT ----
  sections.push(createHeading("5. Market Context"));
  sections.push(createBody(report.insightOutput.marketContext.overview));
  sections.push(createSubheading("Industry Trends"));
  report.insightOutput.marketContext.trends.forEach((t) => {
    sections.push(createBullet(t));
  });
  sections.push(createSubheading("Competitive Landscape"));
  sections.push(createBody(report.insightOutput.marketContext.competitiveLandscape));

  sections.push(createHeading("6. Risk Analysis"));
  const riskRows = report.insightOutput.risks.map((r) => [
    r.category,
    r.description,
    r.likelihood,
    r.mitigation,
  ]);
  
  sections.push(
    createSimpleTable(
      ["Category", "Description", "Likelihood", "Mitigation"],
      riskRows
    )
  );

  sections.push(createHeading("7. Solution Approaches"));
  report.insightOutput.solutionApproaches.forEach((sa) => {
    sections.push(
      createSubheading(`${sa.name}${sa.recommended ? " ⭐ Recommended" : ""}`)
    );
    sections.push(createBody(sa.description));
    sections.push(createLabeledText("Pros", ""));
    sa.pros.forEach((p) => sections.push(createBullet(p, 1)));
    sections.push(createLabeledText("Cons", ""));
    sa.cons.forEach((c) => sections.push(createBullet(c, 1)));
  });

  // ---- EXECUTION OUTPUT ----
  sections.push(createHeading("8. Action Plan"));
  report.executionOutput.actionPlan.forEach((phase) => {
    sections.push(createSubheading(`${phase.phase}: ${phase.title} (${phase.duration})`));
    const taskRows = phase.tasks.map((t) => [t.task, t.priority, t.owner]);
    sections.push(
      createSimpleTable(["Task", "Priority", "Owner"], taskRows)
    );
    sections.push(createLabeledText("Deliverables", ""));
    phase.deliverables.forEach((d) => sections.push(createBullet(d)));
  });

  sections.push(createHeading("9. Technology Recommendations"));
  const techRows = report.executionOutput.technologyRecommendations.map((t) => [
    t.category,
    t.recommendation,
    t.reasoning,
  ]);
  sections.push(
    createSimpleTable(["Category", "Recommendation", "Reasoning"], techRows)
  );

  sections.push(createHeading("10. Resource Estimates"));
  const resRows = report.executionOutput.resourceEstimates.map((r) => [
    r.role,
    r.count.toString(),
    r.duration,
  ]);
  sections.push(
    createSimpleTable(["Role", "Count", "Duration"], resRows)
  );

  sections.push(createHeading("11. Budget Estimate"));
  const budgetRows = report.executionOutput.budgetEstimate.map((b) => [
    b.category,
    b.estimatedCost,
    b.notes,
  ]);
  sections.push(
    createSimpleTable(["Category", "Estimated Cost", "Notes"], budgetRows)
  );

  sections.push(createHeading("12. Success Metrics"));
  const metricRows = report.executionOutput.successMetrics.map((m) => [
    m.metric,
    m.target,
    m.timeframe,
  ]);
  sections.push(
    createSimpleTable(["Metric", "Target", "Timeframe"], metricRows)
  );

  const doc = new Document({
    sections: [
      {
        children: sections,
      },
    ],
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22,
          },
        },
      },
    },
  });

  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}
