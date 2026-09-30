"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  loading?: boolean;
}

export default function MetricCard({ label, value, icon: Icon, color = "var(--primary-500)", loading }: MetricCardProps) {
  return (
    <motion.div
      className="bis-card"
      style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: `${color}12`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ minWidth: 0 }}>
        {loading ? (
          <>
            <div className="skeleton" style={{ width: 60, height: 28, marginBottom: 4 }} />
            <div className="skeleton" style={{ width: 100, height: 14 }} />
          </>
        ) : (
          <>
            <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, color: "var(--text-primary)" }}>
              {value}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
              {label}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
