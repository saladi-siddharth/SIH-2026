"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Bookmark, FileText } from "lucide-react";
import Link from "next/link";
import type { BISStandard } from "@/lib/types";
import { useLanguage } from "@/lib/providers";

interface StandardCardProps {
  standard: BISStandard;
  onSave?: (standard: BISStandard) => void;
  delay?: number;
}

export default function StandardCard({ standard, onSave, delay = 0 }: StandardCardProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      className="bis-card"
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.05 }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "var(--primary-50)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <BookOpen size={18} color="var(--primary-500)" />
          </div>
          <div>
            <div className="bis-badge bis-badge-primary" style={{ marginBottom: 4 }}>
              {standard.is_code}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
              {standard.title}
            </div>
          </div>
        </div>
      </div>

      {/* Category */}
      {standard.category && (
        <div style={{ display: "flex", gap: 6 }}>
          <span className="bis-badge bis-badge-neutral">{standard.category}</span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
        <Link href={`/standards/${standard.id}`} className="bis-btn bis-btn-secondary bis-btn-sm" style={{ textDecoration: "none" }}>
          <FileText size={14} />
          {t.standards.view}
        </Link>
        <Link href={`/assistant?q=Tell me about ${encodeURIComponent(standard.is_code)}`} className="bis-btn bis-btn-secondary bis-btn-sm" style={{ textDecoration: "none" }}>
          <MessageSquare size={14} />
          {t.standards.askAI}
        </Link>
        {onSave && (
          <button onClick={() => onSave(standard)} className="bis-btn bis-btn-ghost bis-btn-sm">
            <Bookmark size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
