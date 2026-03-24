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
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-background border rounded-xl shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-foreground" />
                <h3 className="text-foreground tracking-tight font-semibold">Edit with AI</h3>
              </div>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none bg-secondary p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <p className="text-sm text-muted-foreground">
                Editing: <span className="text-foreground font-medium">{sectionTitle}</span>
              </p>

              {/* Quick Actions */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.instruction)}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none h-8 px-3 text-xs font-medium transition-colors shadow-sm"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Instruction */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Custom Instruction
                </p>
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="e.g., Add more technical details about the implementation..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!instruction.trim() || isLoading}
                className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI is editing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
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
