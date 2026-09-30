"use client";

import React from "react";
import { FileText, BookOpen } from "lucide-react";
import type { Citation } from "@/lib/types";

interface CitationBadgeProps {
  citation: Citation;
  index: number;
  onClick?: (citation: Citation) => void;
}

export default function CitationBadge({ citation, index, onClick }: CitationBadgeProps) {
  const label = [
    citation.is_code || "BIS",
    citation.page ? `p.${citation.page}` : null,
    citation.clause ? `${citation.clause}` : null,
  ].filter(Boolean).join(" • ");

  return (
    <button
      className="citation-badge"
      onClick={() => onClick?.(citation)}
      title={`View source: ${label}`}
      aria-label={`Citation ${index + 1}: ${label}`}
    >
      <FileText size={12} />
      <span>{label}</span>
    </button>
  );
}

interface CitationListProps {
  citations: Citation[];
  onCitationClick?: (citation: Citation) => void;
}

export function CitationList({ citations, onCitationClick }: CitationListProps) {
  if (!citations.length) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        color: "var(--text-secondary)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        <BookOpen size={13} />
        Sources
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {citations.map((citation, i) => (
          <CitationBadge
            key={`${citation.document_id}-${citation.page}-${citation.clause}-${i}`}
            citation={citation}
            index={i}
            onClick={onCitationClick}
          />
        ))}
      </div>
    </div>
  );
}
