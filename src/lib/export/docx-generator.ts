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
  TabStopPosition,
  TabStopType,
} from "docx";
import { ReportData } from "@/lib/agents/types";

// Purple theme colors matching the UI
const COLORS = {
  purple: "6B21A8",
  purpleDark: "581C87",
  purpleLight: "F3E8FF",
  purpleMid: "DDD6FE",
  black: "1A1A2E",
  darkGray: "374151",
  gray: "6B7280",
  lightGray: "F9FAFB",
  white: "FFFFFF",
  accent: "7C3AED",
  border: "E5E7EB",
};

function createTitle(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 52,
        color: COLORS.purple,
        font: "Calibri",
      }),
    ],
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.LEFT,
    spacing: { after: 200 },
  });
}

function createSubtitle(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22,
        color: COLORS.gray,
        font: "Calibri",
        italics: true,
      }),
    ],
    spacing: { after: 400 },
  });
}

function createHeading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 30,
        color: COLORS.purple,
        font: "Calibri",
      }),
    ],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 500, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.purpleMid, space: 4 },
    },
  });
}

function createSubheading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        color: COLORS.purpleDark,
        font: "Calibri",
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });
}

function createSectionLabel(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 18,
        color: COLORS.purple,
        font: "Calibri",
      }),
    ],
    spacing: { before: 200, after: 80 },
  });
}

function createBody(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22,
        color: COLORS.darkGray,
        font: "Calibri",
      }),
    ],
    spacing: { after: 120, line: 276 },
  });
}

function createBullet(text: string, level = 0): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `• ${text}`,
        size: 22,
        color: COLORS.darkGray,
        font: "Calibri",
      }),
    ],
    indent: { left: 400 + level * 300 },
    spacing: { after: 60 },
  });
}

function createLabeledText(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        size: 22,
        color: COLORS.purpleDark,
        font: "Calibri",
      }),
      new TextRun({
        text: value,
        size: 22,
        color: COLORS.darkGray,
        font: "Calibri",
      }),
    ],
    spacing: { after: 80 },
  });
}

function createCalloutBox(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 20,
        italics: true,
        color: COLORS.purpleDark,
        font: "Calibri",
      }),
    ],
    spacing: { before: 100, after: 100 },
    indent: { left: 200 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 6, color: COLORS.purple, space: 8 },
    },
    shading: { type: ShadingType.SOLID, color: COLORS.purpleLight },
  });
}

function createRecommendedBadge(): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: "⭐ RECOMMENDED",
        bold: true,
        size: 18,
        color: COLORS.purple,
        font: "Calibri",
      }),
    ],
    spacing: { after: 60 },
    shading: { type: ShadingType.SOLID, color: COLORS.purpleLight },
    indent: { left: 200 },
  });
}

function createStyledTable(
  headers: string[],
  rows: string[][]
): Table {
  // A4 usable width in DXA (1 DXA = 1/20th of a point)
  // A4 = 210mm, margins ~25mm each side = 160mm usable
  // 160mm * 56.7 DXA/mm ≈ 9072 DXA
  const TABLE_WIDTH_DXA = 9072;
  const colWidthDxa = Math.floor(TABLE_WIDTH_DXA / headers.length);

  const headerCells = headers.map(
    (h) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: h, bold: true, size: 20, font: "Calibri", color: COLORS.white }),
            ],
            spacing: { before: 60, after: 60 },
          }),
        ],
        shading: { type: ShadingType.SOLID, color: COLORS.purple },
        width: { size: colWidthDxa, type: WidthType.DXA },
      })
  );

  const dataRows = rows.map(
    (row, rowIndex) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: cell, size: 20, font: "Calibri", color: COLORS.darkGray }),
                  ],
                  spacing: { before: 40, after: 40 },
                }),
              ],
              width: { size: colWidthDxa, type: WidthType.DXA },
              shading: rowIndex % 2 === 0
                ? { type: ShadingType.SOLID, color: COLORS.lightGray }
                : { type: ShadingType.SOLID, color: COLORS.white },
            })
        ),
      })
  );

  return new Table({
    rows: [new TableRow({ children: headerCells }), ...dataRows],
    width: { size: TABLE_WIDTH_DXA, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
      left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
      right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
    },
  });
}

function createDivider(): Paragraph {
  return new Paragraph({
    children: [],
    spacing: { before: 200, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.purpleMid, space: 8 },
    },
  });
}

export async function generateDocx(report: ReportData): Promise<Uint8Array> {
  const sections: (Paragraph | Table)[] = [];

  // Title Page
  sections.push(createTitle("AI Planning Report"));
  sections.push(createSubtitle(`Generated: ${new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`));
  
  // Problem Statement callout
  sections.push(createCalloutBox(`Problem Statement: "${report.problemStatement}"`));
  sections.push(createDivider());

  // ---- PLANNER OUTPUT ----
  sections.push(createHeading("1. Problem Breakdown"));
  sections.push(createSubheading(report.plannerOutput.problemBreakdown.title));
  sections.push(createBody(report.plannerOutput.problemBreakdown.description));
  sections.push(createSectionLabel("Core Areas"));
  (report.plannerOutput.problemBreakdown.coreAreas || []).forEach((area) => {
    sections.push(createBullet(area));
  });

  sections.push(createHeading("2. Stakeholders"));
  (report.plannerOutput.stakeholders || []).forEach((s) => {
    sections.push(createSubheading(s.name));
    sections.push(createLabeledText("Role", s.role));
    sections.push(createSectionLabel("Needs"));
    (s.needs || []).forEach((need) => {
      sections.push(createBullet(need));
    });
  });

  sections.push(createHeading("3. Scope"));
  sections.push(createSectionLabel("In Scope"));
  (report.plannerOutput.scope?.inScope || []).forEach((item) => {
    sections.push(createBullet(item));
  });
  sections.push(createSectionLabel("Out of Scope"));
  (report.plannerOutput.scope?.outOfScope || []).forEach((item) => {
    sections.push(createBullet(item));
  });

  sections.push(createHeading("4. Constraints"));
  (report.plannerOutput.constraints || []).forEach((c) => {
    sections.push(createBullet(c));
  });

  // ---- INSIGHT OUTPUT ----
  sections.push(createDivider());
  sections.push(createHeading("5. Market Context"));
  sections.push(createBody(report.insightOutput.marketContext.overview));
  sections.push(createSectionLabel("Industry Trends"));
  (report.insightOutput.marketContext?.trends || []).forEach((t) => {
    sections.push(createBullet(t));
  });
  sections.push(createSectionLabel("Competitive Landscape"));
  sections.push(createBody(report.insightOutput.marketContext?.competitiveLandscape || "N/A"));

  sections.push(createHeading("6. Risk Analysis"));
  const riskRows = (report.insightOutput.risks || []).map((r) => [
    r.category || "N/A",
    r.description || "N/A",
    r.likelihood || "N/A",
    r.mitigation || "N/A",
  ]);
  sections.push(
    createStyledTable(
      ["Category", "Description", "Likelihood", "Mitigation"],
      riskRows
    )
  );

  sections.push(createHeading("7. Solution Approaches"));
  (report.insightOutput.solutionApproaches || []).forEach((sa) => {
    sections.push(createSubheading(sa.name));
    if (sa.recommended) {
      sections.push(createRecommendedBadge());
    }
    sections.push(createBody(sa.description));
    sections.push(createSectionLabel("Pros"));
    (sa.pros || []).forEach((p) => sections.push(createBullet(p, 1)));
    sections.push(createSectionLabel("Cons"));
    (sa.cons || []).forEach((c) => sections.push(createBullet(c, 1)));
  });

  // ---- EXECUTION OUTPUT ----
  sections.push(createDivider());
  sections.push(createHeading("8. Action Plan"));
  (report.executionOutput.actionPlan || []).forEach((phase) => {
    sections.push(createSubheading(`${phase.phase}: ${phase.title}`));
    sections.push(createCalloutBox(`Duration: ${phase.duration}`));
    const taskRows = (phase.tasks || []).map((t) => [t.task || "N/A", t.priority || "N/A", t.owner || "N/A"]);
    sections.push(
      createStyledTable(["Task", "Priority", "Owner"], taskRows)
    );
    sections.push(createSectionLabel("Deliverables"));
    (phase.deliverables || []).forEach((d) => sections.push(createBullet(d)));
  });

  sections.push(createHeading("9. Technology Recommendations"));
  const techRows = (report.executionOutput.technologyRecommendations || []).map((t) => [
    t.category || "N/A",
    t.recommendation || "N/A",
    t.reasoning || "N/A",
  ]);
  sections.push(
    createStyledTable(["Category", "Recommendation", "Reasoning"], techRows)
  );

  sections.push(createHeading("10. Resource Estimates"));
  const resRows = (report.executionOutput.resourceEstimates || []).map((r) => [
    r.role || "N/A",
    (r.count || 0).toString(),
    r.duration || "N/A",
  ]);
  sections.push(
    createStyledTable(["Role", "Count", "Duration"], resRows)
  );

  sections.push(createHeading("11. Budget Estimate"));
  const budgetRows = (report.executionOutput.budgetEstimate || []).map((b) => [
    b.category || "N/A",
    b.estimatedCost || "N/A",
    b.notes || "N/A",
  ]);
  sections.push(
    createStyledTable(["Category", "Estimated Cost", "Notes"], budgetRows)
  );

  sections.push(createHeading("12. Success Metrics"));
  const metricRows = (report.executionOutput.successMetrics || []).map((m) => [
    m.metric || "N/A",
    m.target || "N/A",
    m.timeframe || "N/A",
  ]);
  sections.push(
    createStyledTable(["Metric", "Target", "Timeframe"], metricRows)
  );

  // Footer
  sections.push(createDivider());
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Generated by PlannerAI — Multi-Agent AI Planning System",
          size: 18,
          color: COLORS.gray,
          font: "Calibri",
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
    })
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
