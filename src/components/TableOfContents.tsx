"use client";

import { motion } from "framer-motion";
import { ReportSectionId } from "@/lib/agents/types";
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

interface Section {
  id: ReportSectionId;
  title: string;
}

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

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string | null;
  onSectionClick: (id: string) => void;
}

export default function TableOfContents({
  sections,
  activeSection,
  onSectionClick,
}: TableOfContentsProps) {
  return (
    <nav className="space-y-1">
      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold px-3 mb-3">
        Report Sections
      </p>
      {sections.map((section, index) => {
        const Icon = sectionIcons[section.id] || LayoutGrid;
        const isActive = activeSection === section.id;

        return (
          <motion.button
            key={section.id}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onSectionClick(section.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all ${
              isActive
                ? "bg-purple-500/20 text-purple-300 border-l-2 border-purple-400"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            }`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{section.title}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
