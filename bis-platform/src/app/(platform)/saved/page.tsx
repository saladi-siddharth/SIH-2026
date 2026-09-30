"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { useLanguage } from "@/lib/providers";
import { EmptyState } from "@/components/shared/states";

export default function SavedPage() {
  const { t } = useLanguage();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{t.saved.title}</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>{t.saved.subtitle}</p>
      </motion.div>

      <EmptyState
        icon={<Bookmark size={24} />}
        title={t.saved.empty}
        description={t.saved.emptyDesc}
        action={
          <a href="/standards" className="bis-btn bis-btn-primary bis-btn-sm" style={{ textDecoration: "none" }}>
            Browse Standards
          </a>
        }
      />
    </div>
  );
}
