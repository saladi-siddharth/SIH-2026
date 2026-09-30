"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Database, Brain, BookOpen, FileText, ShieldCheck, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>About BIS Intelligence</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 32 }}>
          An evidence-backed BIS standards intelligence platform.
        </p>

        <div style={{ maxWidth: 700 }}>
          <div className="bis-card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>What is this platform?</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
              BIS Intelligence is an AI-powered platform that helps industry professionals, MSMEs, and consumers
              discover and understand Bureau of Indian Standards (BIS) documents. The platform uses a Retrieval-Augmented
              Generation (RAG) pipeline to provide evidence-backed answers grounded in actual BIS standard documents.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              Every response from the BIS Assistant is backed by specific citations — including the exact document,
              page number, and clause used to generate the answer. Users can inspect these sources to verify the
              information independently.
            </p>
          </div>

          <div className="bis-card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>How it works</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: FileText, step: "1", title: "Document Ingestion", desc: "Official BIS standard documents are parsed, chunked by clause, and indexed." },
                { icon: Database, step: "2", title: "Semantic Indexing", desc: "Document chunks are converted to vector embeddings and stored in a pgvector database." },
                { icon: Brain, step: "3", title: "Intelligent Retrieval", desc: "User queries are semantically matched against the indexed knowledge base." },
                { icon: BookOpen, step: "4", title: "Evidence-backed Response", desc: "Responses are generated using only the retrieved BIS document evidence." },
                { icon: ShieldCheck, step: "5", title: "Citation Transparency", desc: "Every claim is linked to the exact source document, page, and clause." },
              ].map((item) => (
                <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "var(--primary-50)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--primary-500)",
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            padding: "14px 18px",
            background: "var(--warning-50)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--accent-100)",
            fontSize: 13,
            color: "var(--gray-700)",
            lineHeight: 1.6,
          }}>
            <strong>Disclaimer:</strong> This platform is a prototype built for the Smart India Hackathon 2026.
            It is not an official BIS service. Always verify regulatory decisions against current official BIS sources at{" "}
            <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-500)" }}>
              bis.gov.in
            </a>.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
