"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

interface AIEditModalProps {
  isOpen: boolean;
  sectionTitle: string;
  onClose: () => void;
  onSubmit: (instruction: string) => void;
  isLoading: boolean;
}

const quickActions = [
  { label: "Make more detailed", instruction: "Make this section more detailed and comprehensive" },
  { label: "Professional tone", instruction: "Rewrite in a more professional and formal tone" },
  { label: "Shorten", instruction: "Shorten this section while keeping key points" },
  { label: "Add examples", instruction: "Add relevant practical examples" },
  { label: "Simplify", instruction: "Simplify the language for a broader audience" },
  { label: "More actionable", instruction: "Make the content more actionable with specific steps" },
];

export default function AIEditModal({
  isOpen,
  sectionTitle,
  onClose,
  onSubmit,
  isLoading,
}: AIEditModalProps) {
  const [instruction, setInstruction] = useState("");

  const handleSubmit = () => {
    if (instruction.trim()) {
      onSubmit(instruction.trim());
    }
  };

  const handleQuickAction = (quickInstruction: string) => {
    setInstruction(quickInstruction);
    onSubmit(quickInstruction);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-[#1a1a2e]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-semibold">Edit with AI</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-400">
                Editing: <span className="text-purple-300 font-medium">{sectionTitle}</span>
              </p>

              {/* Quick Actions */}
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.instruction)}
                      disabled={isLoading}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Instruction */}
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                  Custom Instruction
                </p>
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="e.g., Add more technical details about the implementation..."
                  className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!instruction.trim() || isLoading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI is editing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Apply Edit
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
