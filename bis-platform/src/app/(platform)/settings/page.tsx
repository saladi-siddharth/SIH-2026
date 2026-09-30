"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, User, Palette, Bell } from "lucide-react";
import { useLanguage, usePersona } from "@/lib/providers";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { persona, setPersona, clearPersona } = usePersona();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{t.nav.settings}</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>Configure your platform preferences.</p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
        {/* Language */}
        <div className="bis-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Globe size={20} color="var(--primary-500)" />
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Language</h3>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setLanguage("en")}
              className={`bis-btn ${language === "en" ? "bis-btn-primary" : "bis-btn-secondary"} bis-btn-sm`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`bis-btn ${language === "hi" ? "bis-btn-primary" : "bis-btn-secondary"} bis-btn-sm`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Persona */}
        <div className="bis-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <User size={20} color="var(--primary-500)" />
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Persona</h3>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setPersona("industry")}
              className={`bis-btn ${persona === "industry" ? "bis-btn-primary" : "bis-btn-secondary"} bis-btn-sm`}
            >
              {t.persona.industry.label}
            </button>
            <button
              onClick={() => setPersona("consumer")}
              className={`bis-btn ${persona === "consumer" ? "bis-btn-primary" : "bis-btn-secondary"} bis-btn-sm`}
            >
              {t.persona.consumer.label}
            </button>
          </div>
          <button
            onClick={clearPersona}
            className="bis-btn bis-btn-ghost bis-btn-sm"
            style={{ marginTop: 10, fontSize: 12 }}
          >
            Reset persona (go to landing page)
          </button>
        </div>
      </div>
    </div>
  );
}
