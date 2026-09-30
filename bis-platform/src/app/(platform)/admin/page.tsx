"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database, FileText, Layers, Clock, Search, Loader2 } from "lucide-react";
import MetricCard from "@/components/shared/metric-card";
import { useLanguage } from "@/lib/providers";

interface HealthData {
  documentsCount: number;
  chunksCount: number;
  standardsCount: number;
  categoriesCount: number;
  lastIngestion: string | null;
  status: string;
}

interface TestResult {
  query: string;
  chunks: Array<{
    content: string;
    page: number;
    clause: string;
    similarity: number;
    document_title?: string;
    is_code?: string;
  }>;
  answer: string;
}

export default function AdminPage() {
  const { t } = useLanguage();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [testQuery, setTestQuery] = useState("");
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth(null))
      .finally(() => setLoading(false));
  }, []);

  const runTest = async () => {
    if (!testQuery.trim() || testing) return;
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/assistant/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: testQuery }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      let chunks: TestResult["chunks"] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.slice(6));
              if (event.type === "sources") {
                chunks = event.data.map((c: Record<string, unknown>) => ({
                  content: (c.content as string || "").substring(0, 200) + "...",
                  page: c.page,
                  clause: c.clause,
                  similarity: c.similarity,
                  document_title: c.document_title,
                  is_code: c.is_code,
                }));
              } else if (event.type === "token") {
                answer += event.data;
              }
            } catch {}
          }
        }
      }

      setTestResult({ query: testQuery, chunks, answer });
    } catch (error) {
      setTestResult({ query: testQuery, chunks: [], answer: "Error: Failed to run test query." });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{t.admin.title}</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>{t.admin.subtitle}</p>
      </motion.div>

      {/* Health Metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 32,
      }}>
        <MetricCard
          label={t.admin.documentsIndexed}
          value={health?.documentsCount ?? "-"}
          icon={FileText}
          color="var(--primary-500)"
          loading={loading}
        />
        <MetricCard
          label={t.admin.totalChunks}
          value={health?.chunksCount ?? "-"}
          icon={Layers}
          color="var(--accent-500)"
          loading={loading}
        />
        <MetricCard
          label="Standards"
          value={health?.standardsCount ?? "-"}
          icon={Database}
          color="#16a34a"
          loading={loading}
        />
        <MetricCard
          label={t.admin.lastIngestion}
          value={health?.lastIngestion ? new Date(health.lastIngestion).toLocaleDateString() : "-"}
          icon={Clock}
          color="#8b5cf6"
          loading={loading}
        />
      </div>

      {/* Retrieval Test */}
      <div className="bis-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t.admin.testQuery}</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>
          Test the RAG pipeline end-to-end. See retrieved chunks, similarity scores, and the generated answer.
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runTest()}
            placeholder={t.admin.testQueryPlaceholder}
            className="bis-input"
            style={{ flex: 1 }}
            id="admin-test-query"
          />
          <button
            onClick={runTest}
            disabled={!testQuery.trim() || testing}
            className="bis-btn bis-btn-primary"
            id="admin-run-test"
          >
            {testing ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Search size={16} />}
            {t.admin.runTest}
          </button>
        </div>

        {/* Test Results */}
        {testResult && (
          <div>
            {/* Retrieved Chunks */}
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
              {t.admin.retrievedChunks} ({testResult.chunks.length})
            </h3>

            {testResult.chunks.length === 0 ? (
              <div style={{
                padding: 16,
                background: "var(--warning-50)",
                borderRadius: "var(--radius-md)",
                fontSize: 14,
                color: "var(--gray-700)",
                marginBottom: 20,
              }}>
                No chunks retrieved. The knowledge base may be empty or the query didn&apos;t match any indexed content.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {testResult.chunks.map((chunk, i) => (
                  <div key={i} style={{
                    padding: 14,
                    background: "var(--gray-50)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-light)",
                    fontSize: 13,
                  }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      {chunk.is_code && <span className="bis-badge bis-badge-primary">{chunk.is_code}</span>}
                      {chunk.clause && <span className="bis-badge bis-badge-neutral">{chunk.clause}</span>}
                      {chunk.page && <span className="bis-badge bis-badge-neutral">Page {chunk.page}</span>}
                      <span className="bis-badge bis-badge-success">
                        {t.admin.similarity}: {(chunk.similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{chunk.content}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Generated Answer */}
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Generated Answer</h3>
            <div style={{
              padding: 16,
              background: "var(--gray-50)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-light)",
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}>
              {testResult.answer || "No answer generated."}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
