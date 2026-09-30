"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: string;
}

export default function QuickActionCard({ title, description, icon: Icon, href, color = "var(--primary-500)" }: QuickActionCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <motion.div
        className="bis-card bis-card-interactive"
        style={{
          padding: "20px 24px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          height: "100%",
        }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${color}12`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Icon size={20} color={color} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
            {title}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {description}
          </div>
        </div>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500, color }}>
          <span>Get started</span>
          <ArrowRight size={14} />
        </div>
      </motion.div>
    </Link>
  );
}
