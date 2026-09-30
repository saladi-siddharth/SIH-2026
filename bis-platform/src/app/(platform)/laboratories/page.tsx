"use client";

import React from "react";
import { motion } from "framer-motion";
import { FlaskConical, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/lib/providers";
import { EmptyState } from "@/components/shared/states";

export default function LaboratoriesPage() {
  const { t } = useLanguage();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{t.laboratories.title}</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>{t.laboratories.subtitle}</p>
      </motion.div>

      {/* Search placeholder */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder={t.laboratories.searchPlaceholder}
          className="bis-input"
          disabled
          id="lab-search"
        />
      </div>

      {/* Empty state — no fabricated lab data */}
      <EmptyState
        icon={<FlaskConical size={24} />}
        title={t.laboratories.noData}
        description={t.laboratories.noDataDesc}
      />
    </div>
  );
}
