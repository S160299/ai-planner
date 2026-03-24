"use client";

import { motion } from "framer-motion";
import { FileText, FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { ReportData } from "@/lib/agents/types";

interface ExportToolbarProps {
  report: ReportData;
}

export default function ExportToolbar({ report }: ExportToolbarProps) {
  const [exportingDocx, setExportingDocx] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const handleExport = async (format: "docx" | "pdf") => {
    const setLoading = format === "docx" ? setExportingDocx : setExportingPdf;
    setLoading(true);

    try {
      const response = await fetch(`/api/export/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AI-Planning-Report.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`${format.toUpperCase()} export failed:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3"
    >
      <button
        onClick={() => handleExport("docx")}
        disabled={exportingDocx}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 hover:border-blue-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exportingDocx ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        Download DOCX
      </button>

      <button
        onClick={() => handleExport("pdf")}
        disabled={exportingPdf}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 hover:border-red-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exportingPdf ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        Download PDF
      </button>
    </motion.div>
  );
}
