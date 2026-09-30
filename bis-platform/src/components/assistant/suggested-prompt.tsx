"use client";

import React from "react";
import { motion } from "framer-motion";

interface SuggestedPromptProps {
  text: string;
  onClick: (text: string) => void;
}

export default function SuggestedPrompt({ text, onClick }: SuggestedPromptProps) {
  return (
    <motion.button
      onClick={() => onClick(text)}
      className="bis-card bis-card-interactive"
      style={{
        padding: "12px 16px",
        fontSize: 13,
        color: "var(--text-secondary)",
        textAlign: "left",
        cursor: "pointer",
        lineHeight: 1.5,
        border: "1px solid var(--border-light)",
        background: "white",
        width: "100%",
      }}
      whileHover={{ borderColor: "var(--primary-300)" }}
      transition={{ duration: 0.15 }}
    >
      &ldquo;{text}&rdquo;
    </motion.button>
  );
}
