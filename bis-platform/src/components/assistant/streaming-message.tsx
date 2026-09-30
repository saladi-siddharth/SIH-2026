"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Shield, BookOpen } from "lucide-react";
import type { ChatMessage, Citation } from "@/lib/types";
import CitationBadge, { CitationList } from "./citation-badge";

interface StreamingMessageProps {
  message: ChatMessage;
  onCitationClick?: (citation: Citation) => void;
}

export default function StreamingMessage({ message, onCitationClick }: StreamingMessageProps) {
  const isUser = message.role === "user";

  return (
    <div style={{
      display: "flex",
      gap: 12,
      padding: "16px 0",
      borderBottom: isUser ? "none" : "1px solid var(--border-light)",
    }}>
      {/* Avatar */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: isUser ? "var(--primary-100)" : "linear-gradient(135deg, #f59e0b, #d97706)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 2,
      }}>
        {isUser ? (
          <User size={16} color="var(--primary-600)" />
        ) : (
          <Shield size={16} color="#0f172a" />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
          {isUser ? "You" : "BIS Assistant"}
        </div>

        {isUser ? (
          <div style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.6 }}>
            {message.content}
          </div>
        ) : (
          <div className={`markdown-content ${message.isStreaming ? "streaming-cursor" : ""}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Citations */}
        {!isUser && !message.isStreaming && message.citations.length > 0 && (
          <CitationList citations={message.citations} onCitationClick={onCitationClick} />
        )}
      </div>
    </div>
  );
}
