"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  LayoutGrid,
  Users,
  Target,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  Lightbulb,
  ListChecks,
  Cpu,
  UserCheck,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { ReportSectionId, SectionEdit } from "@/lib/agents/types";
import VersionHistory from "./VersionHistory";

const sectionIcons: Record<ReportSectionId, React.ElementType> = {
  problemBreakdown: LayoutGrid,
  stakeholders: Users,
  scope: Target,
  constraints: AlertTriangle,
  marketContext: TrendingUp,
  risks: ShieldAlert,
  solutionApproaches: Lightbulb,
  actionPlan: ListChecks,
  technologyRecommendations: Cpu,
  resourceEstimates: UserCheck,
  budgetEstimate: DollarSign,
  successMetrics: BarChart3,
};

const agentBadges: Record<string, { label: string; color: string }> = {
  planner: { label: "Planner Agent", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  insight: { label: "Insight Agent", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  executor: {
    label: "Execution Agent",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
};

interface ReportSectionProps {
  id: ReportSectionId;
  title: string;
  agentSource: string;
  content: unknown;
  edits: SectionEdit[];
  onEditClick: () => void;
  onRevert: (edit: SectionEdit) => void;
  index: number;
}

function renderContent(content: unknown): React.ReactNode {
  if (content === null || content === undefined) return null;

  if (typeof content === "string") {
    return <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>;
  }

  if (Array.isArray(content)) {
    if (content.length === 0) return null;

    if (typeof content[0] === "string") {
      return (
        <ul className="space-y-1.5 list-disc list-inside">
          {content.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="space-y-3">
        {content.map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-muted/40 border"
          >
            {renderContent(item)}
          </div>
        ))}
      </div>
    );
  }

  if (typeof content === "object") {
    const obj = content as Record<string, unknown>;
    return (
      <div className="space-y-3">
        {Object.entries(obj).map(([key, value]) => {
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase())
            .trim();

          if (typeof value === "boolean") {
            return (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground font-medium">{formattedKey}:</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                    value
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}
                >
                  {value ? "Yes" : "No"}
                </span>
              </div>
            );
          }

          if (typeof value === "number") {
            return (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground font-medium">{formattedKey}:</span>
                <span className="font-semibold">{value}</span>
              </div>
            );
          }

          if (typeof value === "string") {
            return (
              <div key={key} className="text-sm">
                <span className="text-muted-foreground font-medium">{formattedKey}: </span>
                <span>{value}</span>
              </div>
            );
          }

          return (
            <div key={key} className="mt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {formattedKey}
              </p>
              {renderContent(value)}
            </div>
          );
        })}
      </div>
    );
  }

  return <p className="text-muted-foreground text-sm">{String(content)}</p>;
}

export default function ReportSection({
  id,
  title,
  agentSource,
  content,
  edits,
  onEditClick,
  onRevert,
  index,
}: ReportSectionProps) {
  const Icon = sectionIcons[id] || LayoutGrid;
  
  // Generic Shadcn pill style instead of bright colors
  const badgeLabel = agentBadges[agentSource]?.label || agentSource;

  return (
    <motion.div
      id={`section-${id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center border">
                <Icon className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold tracking-tight">{title}</h3>
                <span
                  className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium border bg-muted text-muted-foreground"
                >
                  {badgeLabel}
                </span>
              </div>
            </div>

            <button
              onClick={onEditClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground shadow-sm border hover:bg-secondary/80 transition-all opacity-0 group-hover:opacity-100"
            >
              <Sparkles className="w-3 h-3" />
              Edit with AI
            </button>
          </div>

          {/* Content */}
          <div className="text-foreground">{renderContent(content)}</div>

          {/* Version History */}
          <VersionHistory edits={edits} onRevert={onRevert} />
        </div>
      </div>
    </motion.div>
  );
}
