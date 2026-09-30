"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/providers";
import DocumentCard from "@/components/documents/document-card";
import { EmptyState, LoadingSkeleton, ErrorState } from "@/components/shared/states";
import type { BISDocument } from "@/lib/types";

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<BISDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((data) => setDocuments(data.documents || []))
      .catch(() => setError("Failed to load documents."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = documents.filter((doc) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      doc.filename.toLowerCase().includes(q) ||
      (doc.is_code || "").toLowerCase().includes(q) ||
      (doc.title || "").toLowerCase().includes(q) ||
      (doc.category || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{t.documents.title}</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>{t.documents.subtitle}</p>
      </motion.div>

      {/* Search */}
      <div style={{ marginBottom: 24, position: "relative" }}>
        <Search
          size={18}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--gray-400)",
          }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.documents.searchPlaceholder}
          className="bis-input"
          style={{ paddingLeft: 42 }}
          id="documents-search"
        />
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <ErrorState title={error} onRetry={() => window.location.reload()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t.common.noResults}
          description="Try adjusting your search terms."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((doc, i) => (
            <DocumentCard key={doc.id} document={doc} delay={i} />
          ))}
        </div>
      )}
    </div>
  );
}
