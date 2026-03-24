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
  pending: "text-muted-foreground",
  running: "text-primary",
  completed: "text-emerald-500",
  error: "text-destructive",
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
                    className={`h-full w-full transition-colors duration-500 rounded-full ${
                      step.status === "completed"
                        ? "bg-primary"
                        : "bg-border"
                    }`}
                  />
                </div>
              )}

              {/* Icon Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  step.status === "running"
                    ? "bg-background border-primary"
                    : step.status === "completed"
                    ? "bg-primary/10 border-primary"
                    : "bg-background border-border"
                }`}
              >
                {step.status === "running" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-5 h-5 text-primary" />
                  </motion.div>
                ) : step.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Icon className={`w-5 h-5 ${statusColors[step.status]}`} />
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
                    className={`font-semibold text-sm transition-colors tracking-tight ${
                      step.status === "running"
                        ? "text-primary"
                        : step.status === "completed"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </h3>
                  {step.status === "running" && (
                    <motion.span
                      className="text-xs text-muted-foreground"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      processing...
                    </motion.span>
                  )}
                  {step.status === "completed" && (
                     <span className="text-xs text-muted-foreground">✓ done</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
