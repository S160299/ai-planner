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
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Shadcn Subtle Grid Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold tracking-tight">PlannerAI</span>
          </div>
          <a
            href="https://github.com/S160299/ai-planner"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-[800px] space-y-10">
          
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
              <Sparkles className="mr-1 h-3 w-3" />
              Powered by Multi-Agent AI
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter sm:text-5xl lg:text-7xl">
              Turn Ideas Into <br className="hidden sm:inline" /> Actionable Plans
            </h1>

            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Enter your problem statement and let our AI agents analyze, strategize,
              and create a comprehensive execution plan for you.
            </p>
          </motion.div>

          {/* Agent Pipeline Graphic */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-card">
              <Brain className="w-4 h-4" /> Planner
            </div>
            <ArrowRight className="w-3 h-3" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-card">
              <Search className="w-4 h-4" /> Insight
            </div>
            <ArrowRight className="w-3 h-3" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-card">
              <Zap className="w-4 h-4" /> Execution
            </div>
          </motion.div>

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border bg-card text-card-foreground shadow-sm max-w-2xl mx-auto overflow-hidden"
          >
            <textarea
              id="problem-input"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your project idea or problem statement..."
              rows={4}
              className="w-full p-4 bg-transparent text-foreground placeholder:text-muted-foreground resize-none border-0 focus-visible:outline-none focus-visible:ring-0 text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleGenerate();
                }
              }}
            />
            
            <div className="p-4 border-t bg-muted/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {problem.length} characters
                {problem.length > 0 && " • ⌘ + Enter to submit"}
              </span>
              <button
                id="generate-button"
                onClick={handleGenerate}
                disabled={!problem.trim() || isLoading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Example Prompts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Try an example</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleExample(prompt)}
                  className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:bg-muted"
                >
                  <ChevronRight className="mr-1 h-3 w-3 text-muted-foreground" />
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row text-center md:text-left">
          <p className="text-sm leading-loose text-muted-foreground">
            Built by Naresh. The source code is available on{" "}
            <a href="https://github.com/S160299/ai-planner" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
