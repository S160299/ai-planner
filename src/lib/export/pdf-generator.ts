import { jsPDF } from "jspdf";
import { ReportData } from "@/lib/agents/types";

export function generatePdf(report: ReportData): Uint8Array {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const colors = {
    primary: [22, 33, 62] as [number, number, number],
    secondary: [15, 52, 96] as [number, number, number],
    accent: [83, 52, 131] as [number, number, number],
    text: [30, 30, 30] as [number, number, number],
    lightGray: [240, 240, 245] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    border: [200, 200, 210] as [number, number, number],
  };

  function checkNewPage(needed: number) {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
      addFooter();
    }
  }

  function addFooter() {
    const pageNum = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(...colors.border);
    doc.text(
      `AI Planning Report | Page ${pageNum}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  function addTitle(text: string) {
    checkNewPage(20);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.primary);
    doc.text(text, pageWidth / 2, y, { align: "center" });
    y += 12;
  }

  function addHeading(text: string) {
    checkNewPage(15);
    y += 5;
    doc.setFillColor(...colors.primary);
    doc.rect(margin, y - 5, contentWidth, 10, "F");
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.white);
    doc.text(text, margin + 4, y + 1);
    y += 12;
  }

  function addSubheading(text: string) {
    checkNewPage(12);
    y += 2;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.secondary);
    doc.text(text, margin, y);
    y += 7;
  }

  function addBody(text: string) {
    checkNewPage(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.text);
    const lines = doc.splitTextToSize(text, contentWidth);
    for (const line of lines) {
      checkNewPage(6);
      doc.text(line, margin, y);
      y += 5;
    }
    y += 2;
  }

  function addBullet(text: string, indent = 0) {
    checkNewPage(8);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.text);
    const xPos = margin + 4 + indent * 5;
    doc.text("•", xPos - 4, y);
    const lines = doc.splitTextToSize(text, contentWidth - indent * 5 - 4);
    for (const line of lines) {
      checkNewPage(6);
      doc.text(line, xPos, y);
      y += 5;
    }
  }

  function addTable(headers: string[], rows: string[][]) {
    const colWidth = contentWidth / headers.length;

    checkNewPage(15);

    // Header row
    doc.setFillColor(...colors.primary);
    doc.rect(margin, y - 4, contentWidth, 8, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.white);
    headers.forEach((h, i) => {
      doc.text(h, margin + i * colWidth + 2, y);
    });
    y += 7;

    // Data rows
    rows.forEach((row, ri) => {
      const bgColor = ri % 2 === 0 ? colors.lightGray : colors.white;
      const rowHeight = 7;
      checkNewPage(rowHeight + 2);

      doc.setFillColor(...bgColor);
      doc.rect(margin, y - 4, contentWidth, rowHeight, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...colors.text);
      row.forEach((cell, i) => {
        const truncated =
          cell.length > Math.floor(colWidth / 2)
            ? cell.substring(0, Math.floor(colWidth / 2)) + "..."
            : cell;
        doc.text(truncated, margin + i * colWidth + 2, y);
      });
      y += rowHeight;
    });
    y += 5;
  }

  function addLabel(label: string, value: string) {
    checkNewPage(8);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.secondary);
    doc.text(`${label}: `, margin, y);
    const labelWidth = doc.getTextWidth(`${label}: `);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.text);
    const lines = doc.splitTextToSize(value, contentWidth - labelWidth);
    doc.text(lines[0], margin + labelWidth, y);
    y += 5;
    for (let i = 1; i < lines.length; i++) {
      checkNewPage(6);
      doc.text(lines[i], margin, y);
      y += 5;
    }
  }

  // === TITLE ===
  addTitle("AI Planning Report");
  doc.setFontSize(10);
  doc.setTextColor(...colors.border);
  doc.text(
    `Generated: ${new Date(report.generatedAt).toLocaleDateString()}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 8;
  addBody(`Problem Statement: "${report.problemStatement}"`);
  y += 5;

  // === PLANNER ===
  addHeading("1. Problem Breakdown");
  addSubheading(report.plannerOutput.problemBreakdown.title);
  addBody(report.plannerOutput.problemBreakdown.description);
  addSubheading("Core Areas");
  report.plannerOutput.problemBreakdown.coreAreas.forEach((a) => addBullet(a));
  y += 3;

  addHeading("2. Stakeholders");
  report.plannerOutput.stakeholders.forEach((s) => {
    addSubheading(s.name);
    addLabel("Role", s.role);
    s.needs.forEach((n) => addBullet(n, 1));
  });

  addHeading("3. Scope");
  addSubheading("In Scope");
  report.plannerOutput.scope.inScope.forEach((i) => addBullet(i));
  addSubheading("Out of Scope");
  report.plannerOutput.scope.outOfScope.forEach((i) => addBullet(i));

  addHeading("4. Constraints");
  report.plannerOutput.constraints.forEach((c) => addBullet(c));

  // === INSIGHT ===
  addHeading("5. Market Context");
  addBody(report.insightOutput.marketContext.overview);
  addSubheading("Industry Trends");
  report.insightOutput.marketContext.trends.forEach((t) => addBullet(t));
  addSubheading("Competitive Landscape");
  addBody(report.insightOutput.marketContext.competitiveLandscape);

  addHeading("6. Risk Analysis");
  addTable(
    ["Category", "Description", "Likelihood", "Mitigation"],
    report.insightOutput.risks.map((r) => [
      r.category,
      r.description,
      r.likelihood,
      r.mitigation,
    ])
  );

  addHeading("7. Solution Approaches");
  report.insightOutput.solutionApproaches.forEach((sa) => {
    addSubheading(`${sa.name}${sa.recommended ? " ⭐ Recommended" : ""}`);
    addBody(sa.description);
    addLabel("Pros", "");
    sa.pros.forEach((p) => addBullet(p, 1));
    addLabel("Cons", "");
    sa.cons.forEach((c) => addBullet(c, 1));
  });

  // === EXECUTION ===
  addHeading("8. Action Plan");
  report.executionOutput.actionPlan.forEach((phase) => {
    addSubheading(`${phase.phase}: ${phase.title} (${phase.duration})`);
    addTable(
      ["Task", "Priority", "Owner"],
      phase.tasks.map((t) => [t.task, t.priority, t.owner])
    );
    addLabel("Deliverables", "");
    phase.deliverables.forEach((d) => addBullet(d));
  });

  addHeading("9. Technology Recommendations");
  addTable(
    ["Category", "Recommendation", "Reasoning"],
    report.executionOutput.technologyRecommendations.map((t) => [
      t.category,
      t.recommendation,
      t.reasoning,
    ])
  );

  addHeading("10. Resource Estimates");
  addTable(
    ["Role", "Count", "Duration"],
    report.executionOutput.resourceEstimates.map((r) => [
      r.role,
      r.count.toString(),
      r.duration,
    ])
  );

  addHeading("11. Budget Estimate");
  addTable(
    ["Category", "Estimated Cost", "Notes"],
    report.executionOutput.budgetEstimate.map((b) => [
      b.category,
      b.estimatedCost,
      b.notes,
    ])
  );

  addHeading("12. Success Metrics");
  addTable(
    ["Metric", "Target", "Timeframe"],
    report.executionOutput.successMetrics.map((m) => [
      m.metric,
      m.target,
      m.timeframe,
    ])
  );

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...colors.border);
    doc.text(
      `AI Planning Report | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  const arrayBuffer = doc.output("arraybuffer");
  return new Uint8Array(arrayBuffer);
}
