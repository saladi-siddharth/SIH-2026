"use client";

import React from "react";
import { SearchX, AlertCircle, FileX } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 24px",
      textAlign: "center",
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 14,
        background: "var(--gray-100)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        color: "var(--gray-400)",
      }}>
        {icon || <SearchX size={24} />}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
        {title}
      </div>
      {description && (
        <div style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 400, lineHeight: 1.6 }}>
          {description}
        </div>
      )}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ title = "Something went wrong", description, onRetry, retryLabel = "Try Again" }: ErrorStateProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 24px",
      textAlign: "center",
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 14,
        background: "var(--error-50)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}>
        <AlertCircle size={24} color="var(--error-500)" />
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
        {title}
      </div>
      {description && (
        <div style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 400, lineHeight: 1.6 }}>
          {description}
        </div>
      )}
      {onRetry && (
        <button onClick={onRetry} className="bis-btn bis-btn-primary bis-btn-sm" style={{ marginTop: 16 }}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export function LoadingSkeleton({ rows = 3, style }: { rows?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, ...style }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bis-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: "60%", height: 16, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: "40%", height: 14 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
