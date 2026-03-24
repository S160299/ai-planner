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
    return <p className="text-gray-300 text-sm leading-relaxed">{content}</p>;
  }

  if (Array.isArray(content)) {
    // Check if it's an array of objects or primitives
    if (content.length === 0) return null;

    if (typeof content[0] === "string") {
      return (
        <ul className="space-y-1.5">
          {content.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-purple-400 mt-1 text-xs">▸</span>
              <span>{item}</span>
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
            className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
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
      <div className="space-y-2">
        {Object.entries(obj).map(([key, value]) => {
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase())
            .trim();

          if (typeof value === "boolean") {
            return (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 font-medium">{formattedKey}:</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    value
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
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
                <span className="text-gray-500 font-medium">{formattedKey}:</span>
                <span className="text-white font-semibold">{value}</span>
              </div>
            );
          }

          if (typeof value === "string") {
            return (
              <div key={key} className="text-sm">
                <span className="text-gray-500 font-medium">{formattedKey}: </span>
                <span className="text-gray-300">{value}</span>
              </div>
            );
          }

          return (
            <div key={key}>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">
                {formattedKey}
              </p>
              {renderContent(value)}
            </div>
          );
        })}
      </div>
    );
  }

  return <p className="text-gray-300 text-sm">{String(content)}</p>;
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
  const badge = agentBadges[agentSource];

  return (
    <motion.div
      id={`section-${id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm hover:border-white/[0.15] transition-all duration-300">
        {/* Subtle gradient accent at top */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base">{title}</h3>
                {badge && (
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onEditClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/40 transition-all opacity-0 group-hover:opacity-100"
            >
              <Sparkles className="w-3 h-3" />
              Edit with AI
            </button>
          </div>

          {/* Content */}
          <div className="text-gray-300">{renderContent(content)}</div>

          {/* Version History */}
          <VersionHistory edits={edits} onRevert={onRevert} />
        </div>
      </div>
    </motion.div>
  );
}
