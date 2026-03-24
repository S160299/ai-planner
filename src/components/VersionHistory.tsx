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
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
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
                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white/5 border border-white/5"
              >
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 truncate">
                    &ldquo;{edit.instruction}&rdquo;
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">
                    {new Date(edit.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => onRevert(edit)}
                  className="flex-shrink-0 p-1 rounded hover:bg-white/10 text-gray-500 hover:text-amber-400 transition-colors"
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
