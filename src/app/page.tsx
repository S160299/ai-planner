"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Brain, Search, Zap, ArrowRight, ChevronRight } from "lucide-react";

const examplePrompts = [
  "Build a creator marketplace platform",
  "Design an AI-powered customer support system",
  "Create a SaaS analytics dashboard for e-commerce",
  "Build a real-time collaboration tool for remote teams",
  "Design a personal finance management app",
];

export default function HomePage() {
  const [problem, setProblem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = () => {
    if (problem.trim()) {
      setIsLoading(true);
      router.push(`/report?problem=${encodeURIComponent(problem.trim())}`);
    }
  };

  const handleExample = (prompt: string) => {
    setProblem(prompt);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">PlannerAI</span>
          </div>
          <a
            href="https://github.com/S160299/ai-planner"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            View on GitHub →
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-6"
            >
              <Sparkles className="w-3 h-3" />
              Powered by Multi-Agent AI
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Turn Ideas Into
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Actionable Plans
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Enter your problem statement and let our AI agents analyze, strategize,
              and create a comprehensive execution plan for you.
            </p>
          </motion.div>

          {/* Agent Pipeline Graphic */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            {[
              { icon: Brain, label: "Planner", color: "blue" },
              { icon: Search, label: "Insight", color: "purple" },
              { icon: Zap, label: "Execution", color: "emerald" },
            ].map((agent, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                  <agent.icon className={`w-4 h-4 text-${agent.color}-400`} />
                  <span className="text-xs text-gray-300 font-medium">
                    {agent.label}
                  </span>
                </div>
                {i < 2 && <ArrowRight className="w-3 h-3 text-gray-600" />}
              </div>
            ))}
          </motion.div>

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 blur-lg opacity-50" />
              <div className="relative overflow-hidden rounded-2xl bg-[#12121f]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
                <textarea
                  id="problem-input"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Describe your problem or project idea..."
                  rows={4}
                  className="w-full px-6 py-5 bg-transparent text-white placeholder-gray-600 text-base resize-none focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleGenerate();
                    }
                  }}
                />
                <div className="px-6 py-4 border-t border-white/[0.05] flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {problem.length} characters
                    {problem.length > 0 && " • ⌘ + Enter to submit"}
                  </span>
                  <button
                    id="generate-button"
                    onClick={handleGenerate}
                    disabled={!problem.trim() || isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Plan
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="mt-6">
              <p className="text-xs text-gray-600 mb-3 px-1">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleExample(prompt)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-400 text-xs hover:bg-white/[0.06] hover:text-gray-200 hover:border-white/[0.12] transition-all"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center">
        <p className="text-xs text-gray-700">
          Built with Next.js • Powered by Google Gemini • Multi-Agent Architecture
        </p>
      </footer>
    </div>
  );
}
