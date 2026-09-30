"use client";

import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, MessageSquare, BookOpen, Search, ShieldCheck, FileText, ExternalLink } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      q: "How does the BIS Assistant generate answers?",
      a: "The assistant uses Retrieval-Augmented Generation (RAG). When you ask a question, the system searches through indexed BIS standard documents using semantic similarity, retrieves the most relevant sections, and generates an answer grounded in that evidence. Every factual claim is backed by a citation you can inspect.",
    },
    {
      q: "Are the answers officially verified by BIS?",
      a: "No. This platform is an intelligence tool that helps you discover and understand BIS standards. It uses AI to summarize and explain the indexed documents, but responses are not officially verified by the Bureau of Indian Standards. Always verify regulatory decisions against official BIS sources.",
    },
    {
      q: "What standards are currently indexed?",
      a: "The knowledge base currently includes standards related to packaged drinking water (IS 14543), motorcycle helmets (IS 4151), PVC insulated cables (IS 694), and ordinary Portland cement (IS 269). You can view all indexed documents in the Document Library.",
    },
    {
      q: "What does the CM/L Validator do?",
      a: "The CM/L Validator checks whether a given identifier matches the expected format patterns for BIS license numbers. It performs format validation only — it does NOT confirm whether a license was genuinely issued or is currently valid. For official verification, visit the BIS website.",
    },
    {
      q: "Can I trust the citation sources?",
      a: "Citations point to the exact document, page, and clause used to generate the answer. You can click any citation to view the source text. This transparency allows you to verify the information independently.",
    },
    {
      q: "How do I switch between Industry and Consumer modes?",
      a: "Use the persona switcher in the header bar, or go to Settings to change your active persona. Each persona shows different dashboards and quick actions tailored to your needs.",
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Help & FAQ</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 32 }}>
          Common questions about using the BIS Intelligence platform.
        </p>

        <div style={{ maxWidth: 700, display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} className="bis-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>
                {faq.q}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
