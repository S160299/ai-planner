"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Save } from "lucide-react";
import Link from "next/link";
import { ReportData, AgentStep, ReportSectionId, SectionEdit } from "@/lib/agents/types";
import AgentProgress from "@/components/AgentProgress";
import ReportSection from "@/components/ReportSection";
import AIEditModal from "@/components/AIEditModal";
import ExportToolbar from "@/components/ExportToolbar";
import TableOfContents from "@/components/TableOfContents";

interface SectionDef {
  id: ReportSectionId;
  title: string;
  agentSource: "planner" | "insight" | "executor";
  getContent: (report: ReportData) => unknown;
}

const sectionDefs: SectionDef[] = [
  {
    id: "problemBreakdown",
    title: "Problem Breakdown",
    agentSource: "planner",
    getContent: (r) => r.plannerOutput.problemBreakdown,
  },
  {
    id: "stakeholders",
    title: "Stakeholders",
    agentSource: "planner",
    getContent: (r) => r.plannerOutput.stakeholders,
  },
  {
    id: "scope",
    title: "Scope",
    agentSource: "planner",
    getContent: (r) => r.plannerOutput.scope,
  },
  {
    id: "constraints",
    title: "Constraints",
    agentSource: "planner",
    getContent: (r) => r.plannerOutput.constraints,
  },
  {
    id: "marketContext",
    title: "Market Context",
    agentSource: "insight",
    getContent: (r) => r.insightOutput.marketContext,
  },
  {
    id: "risks",
    title: "Risk Analysis",
    agentSource: "insight",
    getContent: (r) => r.insightOutput.risks,
  },
  {
    id: "solutionApproaches",
    title: "Solution Approaches",
    agentSource: "insight",
    getContent: (r) => r.insightOutput.solutionApproaches,
  },
  {
    id: "actionPlan",
    title: "Action Plan",
    agentSource: "executor",
    getContent: (r) => r.executionOutput.actionPlan,
  },
  {
    id: "technologyRecommendations",
    title: "Technology Recommendations",
    agentSource: "executor",
    getContent: (r) => r.executionOutput.technologyRecommendations,
  },
  {
    id: "resourceEstimates",
    title: "Resource Estimates",
    agentSource: "executor",
    getContent: (r) => r.executionOutput.resourceEstimates,
  },
  {
    id: "budgetEstimate",
    title: "Budget Estimate",
    agentSource: "executor",
    getContent: (r) => r.executionOutput.budgetEstimate,
  },
  {
    id: "successMetrics",
    title: "Success Metrics",
    agentSource: "executor",
    getContent: (r) => r.executionOutput.successMetrics,
  },
];

export default function ReportPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    sectionId: ReportSectionId | null;
    sectionTitle: string;
  }>({ isOpen: false, sectionId: null, sectionTitle: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editHistory, setEditHistory] = useState<Record<string, SectionEdit[]>>({});
  const [saved, setSaved] = useState(false);

  // Load problem from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const problem = params.get("problem");

    // Check for saved report
    const savedReport = localStorage.getItem("ai-planning-report");
    const savedHistory = localStorage.getItem("ai-planning-edit-history");

    if (savedReport) {
      try {
        const parsed = JSON.parse(savedReport) as ReportData;
        // If the saved report has the same problem, restore it
        if (!problem || parsed.problemStatement === problem) {
          setReport(parsed);
          if (savedHistory) {
            setEditHistory(JSON.parse(savedHistory));
          }
          return;
        }
      } catch {
        // ignore
      }
    }

    if (problem) {
      generateReport(problem);
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (report) {
      localStorage.setItem("ai-planning-report", JSON.stringify(report));
      localStorage.setItem("ai-planning-edit-history", JSON.stringify(editHistory));
    }
  }, [report, editHistory]);

  const generateReport = async (problem: string) => {
    setIsGenerating(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });

      if (!response.ok) throw new Error("Failed to start generation");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "progress") {
                setAgentSteps(data.steps);
              } else if (data.type === "complete") {
                setReport(data.report);
                setIsGenerating(false);
              } else if (data.type === "error") {
                setError(data.error);
                setIsGenerating(false);
              }
            } catch {
              // ignore parse errors in stream
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsGenerating(false);
    }
  };

  const handleSectionEdit = async (instruction: string) => {
    if (!editModal.sectionId || !report) return;

    setIsEditing(true);
    const sectionId = editModal.sectionId;

    try {
      const sectionDef = sectionDefs.find((s) => s.id === sectionId);
      if (!sectionDef) return;

      const currentContent = sectionDef.getContent(report);

      const response = await fetch("/api/edit-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId,
          sectionTitle: sectionDef.title,
          currentContent,
          instruction,
        }),
      });

      if (!response.ok) throw new Error("Edit failed");

      const data = await response.json();

      // Save edit history
      const edit: SectionEdit = {
        sectionId,
        timestamp: new Date().toISOString(),
        instruction,
        previousContent: JSON.stringify(currentContent),
        newContent: JSON.stringify(data.updatedContent),
      };

      setEditHistory((prev) => ({
        ...prev,
        [sectionId]: [...(prev[sectionId] || []), edit],
      }));

      // Update report
      setReport((prev) => {
        if (!prev) return prev;
        const updated = structuredClone(prev);

        // Map sectionId to the correct path in the report
        const sectionMap: Record<string, { agent: string; key: string }> = {
          problemBreakdown: { agent: "plannerOutput", key: "problemBreakdown" },
          stakeholders: { agent: "plannerOutput", key: "stakeholders" },
          scope: { agent: "plannerOutput", key: "scope" },
          constraints: { agent: "plannerOutput", key: "constraints" },
          marketContext: { agent: "insightOutput", key: "marketContext" },
          risks: { agent: "insightOutput", key: "risks" },
          solutionApproaches: { agent: "insightOutput", key: "solutionApproaches" },
          actionPlan: { agent: "executionOutput", key: "actionPlan" },
          technologyRecommendations: {
            agent: "executionOutput",
            key: "technologyRecommendations",
          },
          resourceEstimates: { agent: "executionOutput", key: "resourceEstimates" },
          budgetEstimate: { agent: "executionOutput", key: "budgetEstimate" },
          successMetrics: { agent: "executionOutput", key: "successMetrics" },
        };

        const mapping = sectionMap[sectionId];
        if (mapping) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (updated as any)[mapping.agent][mapping.key] =
            data.updatedContent;
        }

        return updated;
      });

      setEditModal({ isOpen: false, sectionId: null, sectionTitle: "" });
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setIsEditing(false);
    }
  };

  const handleRevert = (edit: SectionEdit) => {
    if (!report) return;

    const previousContent = JSON.parse(edit.previousContent);
    setReport((prev) => {
      if (!prev) return prev;
      const updated = structuredClone(prev);

      const sectionMap: Record<string, { agent: string; key: string }> = {
        problemBreakdown: { agent: "plannerOutput", key: "problemBreakdown" },
        stakeholders: { agent: "plannerOutput", key: "stakeholders" },
        scope: { agent: "plannerOutput", key: "scope" },
        constraints: { agent: "plannerOutput", key: "constraints" },
        marketContext: { agent: "insightOutput", key: "marketContext" },
        risks: { agent: "insightOutput", key: "risks" },
        solutionApproaches: { agent: "insightOutput", key: "solutionApproaches" },
        actionPlan: { agent: "executionOutput", key: "actionPlan" },
        technologyRecommendations: {
          agent: "executionOutput",
          key: "technologyRecommendations",
        },
        resourceEstimates: { agent: "executionOutput", key: "resourceEstimates" },
        budgetEstimate: { agent: "executionOutput", key: "budgetEstimate" },
        successMetrics: { agent: "executionOutput", key: "successMetrics" },
      };

      const mapping = sectionMap[edit.sectionId];
      if (mapping) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (updated as any)[mapping.agent][mapping.key] =
          previousContent;
      }

      return updated;
    });

    // Remove the edit from history
    setEditHistory((prev) => ({
      ...prev,
      [edit.sectionId]: (prev[edit.sectionId] || []).filter((e) => e !== edit),
    }));
  };

  const handleSectionClick = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSave = () => {
    if (report) {
      localStorage.setItem("ai-planning-report", JSON.stringify(report));
      localStorage.setItem("ai-planning-edit-history", JSON.stringify(editHistory));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-foreground font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-foreground" />
                AI Planning Report
              </h1>
              {report && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                  {report.problemStatement}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {report && (
              <>
                <button
                  onClick={handleSave}
                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 ${
                    saved
                      ? "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border border-emerald-500/20"
                      : "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm"
                  }`}
                >
                  <Save className="w-3 h-3" />
                  {saved ? "Saved!" : "Save"}
                </button>
                <ExportToolbar report={report} />
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Agent Progress (shown while generating) */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto py-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Generating Your Plan
              </h2>
              <p className="text-sm text-muted-foreground">
                AI agents are analyzing your problem...
              </p>
            </div>
            <AgentProgress steps={agentSteps} />
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto py-16 text-center"
          >
            <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20">
              <h3 className="text-destructive font-semibold tracking-tight mb-2">Generation Failed</h3>
              <p className="text-destructive/80 text-sm">{error}</p>
              <Link
                href="/"
                className="inline-flex mt-4 h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Try Again
              </Link>
            </div>
          </motion.div>
        )}

        {/* Report Content */}
        {report && !isGenerating && (
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28">
                <TableOfContents
                  sections={sectionDefs.map((s) => ({ id: s.id, title: s.title }))}
                  activeSection={activeSection}
                  onSectionClick={handleSectionClick}
                />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 space-y-4">
              {/* Problem Statement Banner */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-accent/50 border shadow-sm"
              >
                <h3 className="text-sm font-semibold tracking-tight text-foreground mb-1">
                  Problem Statement
                </h3>
                <p className="text-muted-foreground text-sm">{report.problemStatement}</p>
                <p className="text-xs text-muted-foreground/70 mt-3">
                  Generated: {new Date(report.generatedAt).toLocaleString()}
                </p>
              </motion.div>

              {/* Sections */}
              {sectionDefs.map((sectionDef, index) => (
                <ReportSection
                  key={sectionDef.id}
                  id={sectionDef.id}
                  title={sectionDef.title}
                  agentSource={sectionDef.agentSource}
                  content={sectionDef.getContent(report)}
                  edits={editHistory[sectionDef.id] || []}
                  onEditClick={() =>
                    setEditModal({
                      isOpen: true,
                      sectionId: sectionDef.id,
                      sectionTitle: sectionDef.title,
                    })
                  }
                  onRevert={handleRevert}
                  index={index}
                />
              ))}
            </main>
          </div>
        )}

        {/* No problem - redirect to home */}
        {!isGenerating && !report && !error && (
          <div className="text-center py-24">
            <h3 className="text-lg font-semibold tracking-tight mb-2">No problem statement provided</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">Please return to the home page and specify a problem statement to generate a plan.</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 text-sm font-medium transition-colors"
            >
              Go to Home
            </Link>
          </div>
        )}
      </div>

      {/* AI Edit Modal */}
      <AIEditModal
        isOpen={editModal.isOpen}
        sectionTitle={editModal.sectionTitle}
        onClose={() => setEditModal({ isOpen: false, sectionId: null, sectionTitle: "" })}
        onSubmit={handleSectionEdit}
        isLoading={isEditing}
      />
    </div>
  );
}
