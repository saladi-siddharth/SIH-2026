"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Search, MessageSquare, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { BISDocument } from "@/lib/types";
import { useLanguage } from "@/lib/providers";

interface DocumentCardProps {
  document: BISDocument;
  delay?: number;
}

export default function DocumentCard({ document, delay = 0 }: DocumentCardProps) {
  const { t } = useLanguage();

  const statusConfig = {
    indexed: {
      icon: CheckCircle2,
      label: t.documents.indexed,
      className: "bis-badge-success",
    },
    processing: {
      icon: Clock,
      label: t.documents.processing,
      className: "bis-badge-warning",
    },
    error: {
      icon: AlertTriangle,
      label: t.documents.error,
      className: "bis-badge-error",
    },
  };

  const status = statusConfig[document.status] || statusConfig.indexed;

  return (
    <motion.div
      className="bis-card"
      style={{ padding: 20 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.05 }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "var(--accent-50)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <FileText size={20} color="var(--accent-500)" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            {document.is_code && (
              <span className="bis-badge bis-badge-primary">{document.is_code}</span>
            )}
            <span className={`bis-badge ${status.className}`}>
              <status.icon size={11} />
              {status.label}
            </span>
          </div>

          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
            {document.title || document.filename}
          </div>

          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-secondary)" }}>
            {document.pages && (
              <span>{document.pages} {t.documents.pages}</span>
            )}
            {document.category && (
              <span>{document.category}</span>
            )}
            <span>{document.source}</span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="bis-btn bis-btn-secondary bis-btn-sm">
              <Search size={14} />
              {t.documents.search}
            </button>
            <a href={`/assistant?q=Tell me about ${encodeURIComponent(document.is_code || document.title || "")}`} className="bis-btn bis-btn-secondary bis-btn-sm" style={{ textDecoration: "none" }}>
              <MessageSquare size={14} />
              {t.documents.askAI}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
