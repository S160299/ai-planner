import { jsPDF } from "jspdf";
import { ReportData } from "@/lib/agents/types";

// Purple theme colors (RGB)
const COLORS = {
  purple: [107, 33, 168] as [number, number, number],
  purpleDark: [88, 28, 135] as [number, number, number],
  purpleLight: [243, 232, 255] as [number, number, number],
  purpleMid: [221, 214, 254] as [number, number, number],
  black: [26, 26, 46] as [number, number, number],
  darkGray: [55, 65, 81] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],
  lightGray: [249, 250, 251] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  border: [229, 231, 235] as [number, number, number],
};

const PAGE_WIDTH = 170;
const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 190;

export function generatePdf(report: ReportData): Uint8Array {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let y = 20;

  function checkPage(needed = 25) {
    if (y + needed > 275) {
      doc.addPage();
      y = 20;
    }
  }

  function drawTitle(text: string) {
    checkPage(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(...COLORS.purple);
    doc.text(text, MARGIN_LEFT, y);
    y += 12;
  }

  function drawSubtitle(text: string) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.gray);
    doc.text(text, MARGIN_LEFT, y);
    y += 8;
  }

  function drawHeading(text: string) {
    checkPage(18);
    // Purple heading with bottom line
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...COLORS.purple);
    doc.text(text, MARGIN_LEFT, y);
    y += 2;
    doc.setDrawColor(...COLORS.purpleMid);
    doc.setLineWidth(0.5);
    doc.line(MARGIN_LEFT, y, MARGIN_RIGHT, y);
    y += 8;
  }

  function drawSubheading(text: string) {
    checkPage(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.purpleDark);
    doc.text(text, MARGIN_LEFT, y);
    y += 7;
  }

  function drawSectionLabel(text: string) {
    checkPage(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.purple);
    doc.text(text.toUpperCase(), MARGIN_LEFT, y);
    y += 5;
  }

  function drawBody(text: string, indent = 0) {
    checkPage(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.darkGray);
    const lines = doc.splitTextToSize(text, PAGE_WIDTH - indent);
    lines.forEach((line: string) => {
      checkPage(6);
      doc.text(line, MARGIN_LEFT + indent, y);
      y += 5;
    });
    y += 2;
  }

  function drawBullet(text: string, indent = 0) {
    checkPage(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.darkGray);
    const bulletX = MARGIN_LEFT + 4 + indent;
    // Purple bullet dot
    doc.setFillColor(...COLORS.purple);
    doc.circle(bulletX - 1, y - 1.2, 0.8, "F");
    const lines = doc.splitTextToSize(text, PAGE_WIDTH - 8 - indent);
    lines.forEach((line: string, i: number) => {
      checkPage(6);
      doc.text(line, bulletX + 2, y);
      y += 5;
    });
    y += 1;
  }

  function drawLabeledText(label: string, value: string, indent = 0) {
    checkPage(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.purpleDark);
    const labelWidth = doc.getTextWidth(`${label}: `);
    doc.text(`${label}: `, MARGIN_LEFT + indent, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkGray);
    const valueLines = doc.splitTextToSize(value, PAGE_WIDTH - labelWidth - indent);
    valueLines.forEach((line: string, i: number) => {
      if (i === 0) {
        doc.text(line, MARGIN_LEFT + indent + labelWidth, y);
      } else {
        y += 5;
        checkPage(6);
        doc.text(line, MARGIN_LEFT + indent + labelWidth, y);
      }
    });
    y += 6;
  }

  function drawCalloutBox(text: string) {
    checkPage(14);
    const lines = doc.splitTextToSize(text, PAGE_WIDTH - 12);
    const boxHeight = lines.length * 5 + 6;
    // Light purple background
    doc.setFillColor(...COLORS.purpleLight);
    doc.rect(MARGIN_LEFT, y - 4, PAGE_WIDTH, boxHeight, "F");
    // Purple left border
    doc.setFillColor(...COLORS.purple);
    doc.rect(MARGIN_LEFT, y - 4, 1.5, boxHeight, "F");
    // Text
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(...COLORS.purpleDark);
    lines.forEach((line: string) => {
      doc.text(line, MARGIN_LEFT + 6, y);
      y += 5;
    });
    y += 4;
  }

  function drawRecommendedBadge() {
    checkPage(8);
    doc.setFillColor(...COLORS.purpleLight);
    doc.roundedRect(MARGIN_LEFT + 4, y - 4, 35, 6, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.purple);
    doc.text("★ RECOMMENDED", MARGIN_LEFT + 7, y);
    y += 5;
  }

  function drawDivider() {
    y += 3;
    doc.setDrawColor(...COLORS.purpleMid);
    doc.setLineWidth(0.3);
    doc.line(MARGIN_LEFT, y, MARGIN_RIGHT, y);
    y += 6;
  }

  function drawTable(headers: string[], rows: string[][]) {
    const colCount = headers.length;
    const colWidth = PAGE_WIDTH / colCount;
    const rowHeight = 8;

    // Check if we need a new page for at least header + 1 row
    checkPage(rowHeight * 2 + 4);

    // Header row - purple background
    doc.setFillColor(...COLORS.purple);
    doc.rect(MARGIN_LEFT, y - 5, PAGE_WIDTH, rowHeight, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.white);
    headers.forEach((h, i) => {
      doc.text(h, MARGIN_LEFT + i * colWidth + 2, y - 0.5, { maxWidth: colWidth - 4 });
    });
    y += rowHeight - 5;

    // Data rows with alternating colors
    rows.forEach((row, rowIndex) => {
      // Calculate how tall this row needs to be
      let maxLines = 1;
      row.forEach((cell) => {
        const lines = doc.splitTextToSize(cell, colWidth - 4);
        if (lines.length > maxLines) maxLines = lines.length;
      });
      const thisRowHeight = Math.max(rowHeight, maxLines * 4.5 + 3);

      checkPage(thisRowHeight + 2);

      // Alternating background
      if (rowIndex % 2 === 0) {
        doc.setFillColor(...COLORS.lightGray);
      } else {
        doc.setFillColor(...COLORS.white);
      }
      doc.rect(MARGIN_LEFT, y - 4, PAGE_WIDTH, thisRowHeight, "F");

      // Cell borders
      doc.setDrawColor(...COLORS.border);
      doc.setLineWidth(0.2);
      doc.line(MARGIN_LEFT, y - 4, MARGIN_LEFT + PAGE_WIDTH, y - 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.darkGray);
      row.forEach((cell, i) => {
        const lines = doc.splitTextToSize(cell, colWidth - 4);
        lines.forEach((line: string, li: number) => {
          doc.text(line, MARGIN_LEFT + i * colWidth + 2, y + li * 4.5);
        });
      });
      y += thisRowHeight - 3;
    });

    // Bottom border
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_LEFT, y - 1, MARGIN_LEFT + PAGE_WIDTH, y - 1);
    y += 6;
  }

  // ===========================
  //  TITLE PAGE
  // ===========================
  drawTitle("AI Planning Report");
  drawSubtitle(
    `Generated: ${new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
  );
  y += 2;
  drawCalloutBox(`Problem Statement: "${report.problemStatement}"`);
  drawDivider();

  // ===========================
  //  1. PLANNER OUTPUT
  // ===========================
  drawHeading("1. Problem Breakdown");
  drawSubheading(report.plannerOutput.problemBreakdown.title);
  drawBody(report.plannerOutput.problemBreakdown.description);
  drawSectionLabel("Core Areas");
  (report.plannerOutput.problemBreakdown.coreAreas || []).forEach((area) => {
    drawBullet(area);
  });

  drawHeading("2. Stakeholders");
  (report.plannerOutput.stakeholders || []).forEach((s) => {
    drawSubheading(s.name);
    drawLabeledText("Role", s.role);
    drawSectionLabel("Needs");
    (s.needs || []).forEach((need) => {
      drawBullet(need, 4);
    });
  });

  drawHeading("3. Scope");
  drawSectionLabel("In Scope");
  (report.plannerOutput.scope?.inScope || []).forEach((item) => {
    drawBullet(item);
  });
  drawSectionLabel("Out of Scope");
  (report.plannerOutput.scope?.outOfScope || []).forEach((item) => {
    drawBullet(item);
  });

  drawHeading("4. Constraints");
  (report.plannerOutput.constraints || []).forEach((c) => {
    drawBullet(c);
  });

  // ===========================
  //  2. INSIGHT OUTPUT
  // ===========================
  drawDivider();
  drawHeading("5. Market Context");
  drawBody(report.insightOutput.marketContext?.overview || "N/A");
  drawSectionLabel("Industry Trends");
  (report.insightOutput.marketContext?.trends || []).forEach((t) => {
    drawBullet(t);
  });
  drawSectionLabel("Competitive Landscape");
  drawBody(report.insightOutput.marketContext?.competitiveLandscape || "N/A");

  drawHeading("6. Risk Analysis");
  drawTable(
    ["Category", "Description", "Likelihood", "Mitigation"],
    (report.insightOutput.risks || []).map((r) => [
      r.category || "N/A",
      r.description || "N/A",
      r.likelihood || "N/A",
      r.mitigation || "N/A",
    ])
  );

  drawHeading("7. Solution Approaches");
  (report.insightOutput.solutionApproaches || []).forEach((sa) => {
    drawSubheading(sa.name);
    if (sa.recommended) {
      drawRecommendedBadge();
    }
    drawBody(sa.description);
    drawSectionLabel("Pros");
    (sa.pros || []).forEach((p) => drawBullet(p, 4));
    drawSectionLabel("Cons");
    (sa.cons || []).forEach((c) => drawBullet(c, 4));
  });

  // ===========================
  //  3. EXECUTION OUTPUT
  // ===========================
  drawDivider();
  drawHeading("8. Action Plan");
  (report.executionOutput.actionPlan || []).forEach((phase) => {
    drawSubheading(`${phase.phase}: ${phase.title}`);
    drawCalloutBox(`Duration: ${phase.duration}`);
    drawTable(
      ["Task", "Priority", "Owner"],
      (phase.tasks || []).map((t) => [t.task || "N/A", t.priority || "N/A", t.owner || "N/A"])
    );
    drawSectionLabel("Deliverables");
    (phase.deliverables || []).forEach((d) => drawBullet(d));
  });

  drawHeading("9. Technology Recommendations");
  drawTable(
    ["Category", "Recommendation", "Reasoning"],
    (report.executionOutput.technologyRecommendations || []).map((t) => [
      t.category || "N/A",
      t.recommendation || "N/A",
      t.reasoning || "N/A",
    ])
  );

  drawHeading("10. Resource Estimates");
  drawTable(
    ["Role", "Count", "Duration"],
    (report.executionOutput.resourceEstimates || []).map((r) => [
      r.role || "N/A",
      (r.count || 0).toString(),
      r.duration || "N/A",
    ])
  );

  drawHeading("11. Budget Estimate");
  drawTable(
    ["Category", "Estimated Cost", "Notes"],
    (report.executionOutput.budgetEstimate || []).map((b) => [
      b.category || "N/A",
      b.estimatedCost || "N/A",
      b.notes || "N/A",
    ])
  );

  drawHeading("12. Success Metrics");
  drawTable(
    ["Metric", "Target", "Timeframe"],
    (report.executionOutput.successMetrics || []).map((m) => [
      m.metric || "N/A",
      m.target || "N/A",
      m.timeframe || "N/A",
    ])
  );

  // Footer
  drawDivider();
  checkPage(10);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.text(
    "Generated by PlannerAI — Multi-Agent AI Planning System",
    105,
    y,
    { align: "center" }
  );

  const arrayBuffer = doc.output("arraybuffer");
  return new Uint8Array(arrayBuffer);
}
