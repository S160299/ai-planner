"use client";

import { motion, AnimatePresence } from "framer-motion";
import { History, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { SectionEdit } from "@/lib/agents/types";

interface VersionHistoryProps {
  edits: SectionEdit[];
  onRevert: (edit: SectionEdit) => void;
}

export default function VersionHistory({ edits, onRevert }: VersionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (edits.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-2"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <History className="w-3 h-3" />
        <span>{edits.length} edit{edits.length > 1 ? "s" : ""}</span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2"
          >
            {edits.map((edit, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-2 p-3 rounded-md bg-muted/50 border"
              >
                <div className="min-w-0">
                  <p className="text-xs text-foreground truncate font-medium">
                    &ldquo;{edit.instruction}&rdquo;
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(edit.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => onRevert(edit)}
                  className="flex-shrink-0 p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-colors shadow-sm"
                  title="Revert to previous"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
