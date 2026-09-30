"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Filter, LayoutGrid, List } from "lucide-react";
import { useLanguage } from "@/lib/providers";
import StandardCard from "@/components/standards/standard-card";
import { EmptyState, LoadingSkeleton, ErrorState } from "@/components/shared/states";
import type { BISStandard } from "@/lib/types";

export default function StandardsPage() {
  const { t } = useLanguage();
  const [standards, setStandards] = useState<BISStandard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [total, setTotal] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchStandards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      const res = await fetch(`/api/standards?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStandards(data.standards || []);
      setTotal(data.total || 0);
    } catch {
      setError("Failed to load standards. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    fetchStandards();
  }, [fetchStandards]);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{t.standards.title}</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>{t.standards.subtitle}</p>
      </motion.div>

      {/* Search */}
      <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
        <div style={{ flex: 1, position: "relative" }}>
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
            placeholder={t.standards.searchPlaceholder}
            className="bis-input"
            style={{ paddingLeft: 42 }}
            id="standards-search"
          />
        </div>
      </div>

      {/* Results Count */}
      {!loading && !error && (
        <div style={{ marginBottom: 16, fontSize: 13, color: "var(--text-secondary)" }}>
          {total} standard{total !== 1 ? "s" : ""} found
          {debouncedQuery && ` for "${debouncedQuery}"`}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <ErrorState title={error} onRetry={fetchStandards} />
      ) : standards.length === 0 ? (
        <EmptyState
          title={t.standards.noResults}
          description={t.standards.tryAdjusting}
          action={
            query ? (
              <button
                onClick={() => setQuery("")}
                className="bis-btn bis-btn-primary bis-btn-sm"
              >
                Clear Search
              </button>
            ) : undefined
          }
        />
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 16,
        }}>
          {standards.map((standard, i) => (
            <StandardCard key={standard.id} standard={standard} delay={i} />
          ))}
        </div>
      )}
    </div>
  );
}
