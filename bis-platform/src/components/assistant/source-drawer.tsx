"use client";

import React from "react";
import { X, FileText, BookOpen, Copy, MessageSquare, ExternalLink } from "lucide-react";
import type { Citation } from "@/lib/types";
import { useLanguage } from "@/lib/providers";

interface SourceDrawerProps {
  citation: Citation | null;
  isOpen: boolean;
  onClose: () => void;
  onAskFollowUp?: (text: string) => void;
}

export default function SourceDrawer({ citation, isOpen, onClose, onAskFollowUp }: SourceDrawerProps) {
  const { t } = useLanguage();

  const handleCopy = () => {
    if (!citation) return;
    const text = [
      citation.is_code ? `Standard: ${citation.is_code}` : "",
      citation.document_title ? `Document: ${citation.document_title}` : "",
      citation.page ? `Page: ${citation.page}` : "",
      citation.clause ? `Clause: ${citation.clause}` : "",
      "",
      citation.content,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 49,
          }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div className={`source-drawer ${isOpen ? "open" : ""}`}>
        {citation && (
          <>
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              background: "white",
              zIndex: 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BookOpen size={18} color="var(--primary-500)" />
                <span style={{ fontSize: 15, fontWeight: 600 }}>{t.citations.viewSource}</span>
              </div>
              <button
                onClick={onClose}
                className="bis-btn-ghost"
                style={{ padding: 6 }}
                aria-label={t.common.close}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: 20 }}>
              {/* Document Info */}
              <div className="bis-card" style={{ padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
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
                    <FileText size={20} color="var(--primary-500)" />
                  </div>
                  <div>
                    {citation.is_code && (
                      <div className="bis-badge bis-badge-primary" style={{ marginBottom: 6 }}>
                        {citation.is_code}
                      </div>
                    )}
                    {citation.document_title && (
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                        {citation.document_title}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 12, fontSize: 13, color: "var(--text-secondary)" }}>
                      {citation.page && (
                        <span>{t.citations.page} {citation.page}</span>
                      )}
                      {citation.clause && (
                        <span>{t.citations.clause} {citation.clause}</span>
                      )}
                      {citation.section && (
                        <span>{t.citations.section}: {citation.section}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Extracted Text */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 10,
                }}>
                  Relevant Text
                </div>
                <div style={{
                  padding: 16,
                  background: "var(--gray-50)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--text-primary)",
                  whiteSpace: "pre-wrap",
                }}>
                  {citation.content}
                </div>
              </div>

              {/* Similarity Score */}
              {citation.similarity !== undefined && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 8,
                  }}>
                    Relevance Score
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      flex: 1,
                      height: 6,
                      background: "var(--gray-200)",
                      borderRadius: "var(--radius-full)",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${Math.round(citation.similarity * 100)}%`,
                        height: "100%",
                        background: citation.similarity > 0.8 ? "var(--success-500)" : citation.similarity > 0.6 ? "var(--accent-400)" : "var(--warning-500)",
                        borderRadius: "var(--radius-full)",
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                      {Math.round(citation.similarity * 100)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={handleCopy} className="bis-btn bis-btn-secondary" style={{ width: "100%" }}>
                  <Copy size={15} />
                  {t.citations.copyCitation}
                </button>
                {onAskFollowUp && (
                  <button
                    onClick={() => {
                      const prompt = citation.clause
                        ? `Tell me more about ${citation.clause} in ${citation.is_code || "this standard"}`
                        : `Tell me more about ${citation.is_code || "this document"}`;
                      onAskFollowUp(prompt);
                      onClose();
                    }}
                    className="bis-btn bis-btn-secondary"
                    style={{ width: "100%" }}
                  >
                    <MessageSquare size={15} />
                    {t.citations.askFollowUp}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
