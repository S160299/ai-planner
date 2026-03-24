"use client";

import { motion } from "framer-motion";
import { AgentStep } from "@/lib/agents/types";
import { Brain, Search, Zap, CheckCircle2, Loader2, Circle } from "lucide-react";

const agentIcons = {
  planner: Brain,
  insight: Search,
  executor: Zap,
};

const statusColors = {
  pending: "text-gray-500",
  running: "text-blue-400",
  completed: "text-emerald-400",
  error: "text-red-400",
};

export default function AgentProgress({ steps }: { steps: AgentStep[] }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        {steps.map((step, index) => {
          const Icon = agentIcons[step.agent];
          const isLast = index === steps.length - 1;

          return (
            <div key={step.agent} className="relative flex items-start gap-4 pb-8">
              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-[23px] top-[48px] w-[2px] h-[calc(100%-48px)]">
                  <div
                    className={`h-full w-full transition-colors duration-500 ${
                      step.status === "completed"
                        ? "bg-emerald-500/50"
                        : "bg-white/10"
                    }`}
                  />
                </div>
              )}

              {/* Icon Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                  step.status === "running"
                    ? "bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20"
                    : step.status === "completed"
                    ? "bg-emerald-500/20 border-emerald-500/50"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {step.status === "running" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-5 h-5 text-blue-400" />
                  </motion.div>
                ) : step.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Icon className={`w-5 h-5 ${statusColors[step.status]}`} />
                )}

                {step.status === "running" && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-blue-400/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.05 }}
                className="flex-1 min-w-0 pt-1"
              >
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-semibold text-sm transition-colors ${
                      step.status === "running"
                        ? "text-blue-300"
                        : step.status === "completed"
                        ? "text-emerald-300"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </h3>
                  {step.status === "running" && (
                    <motion.span
                      className="text-xs text-blue-400/70 font-mono"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      processing...
                    </motion.span>
                  )}
                  {step.status === "completed" && (
                    <span className="text-xs text-emerald-400/70">✓ done</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
