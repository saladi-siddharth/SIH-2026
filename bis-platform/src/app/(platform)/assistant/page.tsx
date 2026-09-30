"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/providers";
import AssistantChat from "@/components/assistant/assistant-chat";

export default function AssistantPage() {
  const { t } = useLanguage();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 16 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{t.assistant.title}</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{t.assistant.subtitle}</p>
      </motion.div>

      <AssistantChat />
    </div>
  );
}
