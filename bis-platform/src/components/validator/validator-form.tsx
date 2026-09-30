"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldX, ShieldAlert, Info, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/providers";
import type { ValidatorResult } from "@/lib/types";

// CM/L patterns (format only)
const CML_PATTERNS = [
  { pattern: /^CM\/L[-\s]?\d{5,8}$/i, type: "CM/L License" },
  { pattern: /^R[-\s]?\d{5,10}$/i, type: "Registration Number" },
  { pattern: /^[A-Z]{1,3}[-\s]?\d{4,8}$/i, type: "BIS License" },
];

// HUID pattern (6-char alphanumeric)
const HUID_PATTERN = /^[A-Z0-9]{6}$/i;

interface ValidatorFormProps {
  type: "cml" | "huid";
}

export default function ValidatorForm({ type }: ValidatorFormProps) {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ValidatorResult | null>(null);

  const handleCheck = () => {
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) return;

    if (type === "cml") {
      const match = CML_PATTERNS.find((p) => p.pattern.test(trimmed));
      setResult({
        input: trimmed,
        isValidFormat: !!match,
        formatType: match?.type || null,
        message: match
          ? `${t.validator.formatValid} — detected as ${match.type} format.`
          : t.validator.formatInvalid,
        disclaimer: t.validator.disclaimer,
      });
    } else {
      const isValid = HUID_PATTERN.test(trimmed) && trimmed.length === 6;
      setResult({
        input: trimmed,
        isValidFormat: isValid,
        formatType: isValid ? "HUID" : null,
        message: isValid
          ? `${t.validator.formatValid} — 6-character alphanumeric HUID format detected.`
          : t.validator.formatInvalid,
        disclaimer: t.validator.disclaimer,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheck();
  };

  const isCml = type === "cml";

  return (
    <div>
      <div className="bis-card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          {isCml ? t.validator.title : t.validator.huidTitle}
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
          {isCml ? t.validator.subtitle : t.validator.huidSubtitle}
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isCml ? t.validator.inputPlaceholder : t.validator.huidPlaceholder}
            className="bis-input"
            style={{ flex: 1, textTransform: "uppercase" }}
            id={`${type}-input`}
            aria-label={isCml ? t.validator.inputPlaceholder : t.validator.huidPlaceholder}
          />
          <button
            onClick={handleCheck}
            className="bis-btn bis-btn-primary"
            disabled={!input.trim()}
            id={`${type}-check-btn`}
          >
            {isCml ? t.validator.checkFormat : t.validator.huidCheck}
          </button>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="bis-card" style={{
              padding: 20,
              borderLeft: `4px solid ${result.isValidFormat ? "var(--success-500)" : "var(--error-500)"}`,
              marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: result.isValidFormat ? "var(--success-50)" : "var(--error-50)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {result.isValidFormat ? (
                    <ShieldCheck size={20} color="var(--success-500)" />
                  ) : (
                    <ShieldX size={20} color="var(--error-500)" />
                  )}
                </div>
                <div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: result.isValidFormat ? "var(--success-600)" : "var(--error-600)",
                    marginBottom: 4,
                  }}>
                    {result.isValidFormat ? t.validator.formatValid : t.validator.formatInvalid}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 4 }}>
                    Input: <code style={{ background: "var(--gray-100)", padding: "1px 6px", borderRadius: 4 }}>{result.input}</code>
                  </div>
                  {result.formatType && (
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      Detected format: {result.formatType}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "14px 16px",
              background: "var(--warning-50)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--accent-100)",
              fontSize: 13,
              color: "var(--gray-700)",
              lineHeight: 1.6,
            }}>
              <ShieldAlert size={18} color="var(--warning-600)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Important Disclaimer</div>
                <div>{result.disclaimer}</div>
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    color: "var(--primary-500)",
                    fontWeight: 500,
                    marginTop: 8,
                    textDecoration: "none",
                  }}
                >
                  Visit BIS Official Website <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
