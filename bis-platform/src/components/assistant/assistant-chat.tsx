"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Search, BookOpen, FileText, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage, Citation } from "@/lib/types";
import { useLanguage } from "@/lib/providers";
import StreamingMessage from "./streaming-message";
import SuggestedPrompt from "./suggested-prompt";
import SourceDrawer from "./source-drawer";

export default function AssistantChat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleCitationClick = useCallback((citation: Citation) => {
    setSelectedCitation(citation);
    setIsDrawerOpen(true);
  }, []);

  const handleSubmit = useCallback(async (query?: string) => {
    const text = query || input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      citations: [],
      timestamp: new Date(),
    };

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      citations: [],
      isStreaming: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setIsLoading(true);
    setStatusText(t.assistant.searching);

    try {
      const response = await fetch("/api/assistant/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedContent = "";
      let accumulatedCitations: Citation[] = [];

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

              switch (event.type) {
                case "status":
                  setStatusText(event.data);
                  break;
                case "sources":
                  accumulatedCitations = event.data as Citation[];
                  break;
                case "token":
                  accumulatedContent += event.data;
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.role === "assistant") {
                      updated[updated.length - 1] = {
                        ...last,
                        content: accumulatedContent,
                        citations: accumulatedCitations,
                      };
                    }
                    return updated;
                  });
                  break;
                case "done":
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.role === "assistant") {
                      updated[updated.length - 1] = {
                        ...last,
                        content: accumulatedContent || event.data,
                        citations: accumulatedCitations,
                        isStreaming: false,
                      };
                    }
                    return updated;
                  });
                  break;
                case "error":
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.role === "assistant") {
                      updated[updated.length - 1] = {
                        ...last,
                        content: event.data || t.assistant.noEvidence,
                        isStreaming: false,
                      };
                    }
                    return updated;
                  });
                  break;
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            content: "The knowledge service is temporarily unavailable. Please try again.",
            isStreaming: false,
          };
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
      setStatusText("");
    }
  }, [input, isLoading, t]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFollowUp = useCallback((text: string) => {
    setInput(text);
    setTimeout(() => handleSubmit(text), 100);
  }, [handleSubmit]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--header-height) - 48px)" }}>
      {/* AI Transparency Banner */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        background: "var(--primary-50)",
        borderRadius: "var(--radius-md)",
        marginBottom: 16,
        fontSize: 13,
        color: "var(--primary-600)",
        border: "1px solid var(--primary-200)",
      }}>
        <Info size={14} />
        <span>{t.assistant.evidenceTooltip}</span>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
        {messages.length === 0 ? (
          <div style={{ padding: "40px 0" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <Search size={24} color="#0f172a" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{t.assistant.title}</h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto" }}>
                {t.assistant.subtitle}
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 10,
              maxWidth: 640,
              margin: "0 auto",
            }}>
              {t.suggestedPrompts.map((prompt, i) => (
                <SuggestedPrompt key={i} text={prompt} onClick={() => handleSubmit(prompt)} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            {messages.map((msg) => (
              <StreamingMessage
                key={msg.id}
                message={msg}
                onCitationClick={handleCitationClick}
              />
            ))}
          </div>
        )}

        {/* Status indicator */}
        <AnimatePresence>
          {isLoading && statusText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                background: "var(--gray-50)",
                borderRadius: "var(--radius-md)",
                margin: "12px 0",
                fontSize: 13,
                color: "var(--text-secondary)",
              }}
            >
              <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
              <span>{statusText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        borderTop: "1px solid var(--border-light)",
        paddingTop: 16,
        background: "white",
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)",
          padding: "12px 16px",
          background: "white",
          transition: "border-color var(--transition-fast)",
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.assistant.inputPlaceholder}
            rows={1}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: "inherit",
              background: "transparent",
              color: "var(--text-primary)",
              minHeight: 24,
              maxHeight: 120,
            }}
            id="assistant-input"
            aria-label={t.assistant.inputPlaceholder}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            className="bis-btn bis-btn-primary"
            style={{ padding: "8px 14px", borderRadius: 8 }}
            id="assistant-send-btn"
            aria-label={t.assistant.send}
          >
            {isLoading ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Source Drawer */}
      <SourceDrawer
        citation={selectedCitation}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAskFollowUp={handleFollowUp}
      />

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
