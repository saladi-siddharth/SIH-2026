"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  Building2,
  ShoppingBag,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Search,
  FileText,
  FlaskConical,
} from "lucide-react";
import { usePersona, useLanguage } from "@/lib/providers";

export default function LandingPage() {
  const router = useRouter();
  const { persona, setPersona } = usePersona();
  const { t, language, setLanguage } = useLanguage();

  // If persona is already selected, redirect to overview
  React.useEffect(() => {
    if (persona) {
      router.replace("/overview");
    }
  }, [persona, router]);

  const handlePersonaSelect = (p: "industry" | "consumer") => {
    setPersona(p);
    router.push("/overview");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      {/* Header */}
      <header style={{
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "white",
        borderBottom: "1px solid var(--border-light)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Shield size={20} color="#0f172a" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{t.appName}</div>
          </div>
        </div>

        <button
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className="bis-btn bis-btn-secondary bis-btn-sm"
        >
          {language === "en" ? "हिंदी" : "English"}
        </button>
      </header>

      {/* Hero Section */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <Shield size={32} color="#0f172a" strokeWidth={2} />
          </div>

          <h1 style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800,
            lineHeight: 1.2,
            color: "var(--text-primary)",
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}>
            {t.hero.title}
          </h1>
          <p style={{
            fontSize: "clamp(15px, 2vw, 17px)",
            color: "var(--text-secondary)",
            maxWidth: 580,
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            {t.hero.subtitle}
          </p>
        </motion.div>

        {/* Persona Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 24,
            color: "var(--text-primary)",
          }}>
            {t.persona.chooserTitle}
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 48,
          }}>
            {/* Industry Card */}
            <motion.button
              onClick={() => handlePersonaSelect("industry")}
              className="bis-card"
              style={{
                padding: 28,
                cursor: "pointer",
                textAlign: "left",
                border: "2px solid var(--border-light)",
                background: "white",
                width: "100%",
              }}
              whileHover={{ borderColor: "var(--primary-400)", y: -3 }}
              transition={{ duration: 0.2 }}
              id="persona-industry-btn"
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "var(--primary-50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}>
                <Building2 size={24} color="var(--primary-500)" />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
                {t.persona.industry.label}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                {t.persona.industry.description}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--primary-500)" }}>
                {t.persona.industry.cta}
                <ArrowRight size={16} />
              </div>
            </motion.button>

            {/* Consumer Card */}
            <motion.button
              onClick={() => handlePersonaSelect("consumer")}
              className="bis-card"
              style={{
                padding: 28,
                cursor: "pointer",
                textAlign: "left",
                border: "2px solid var(--border-light)",
                background: "white",
                width: "100%",
              }}
              whileHover={{ borderColor: "var(--accent-400)", y: -3 }}
              transition={{ duration: 0.2 }}
              id="persona-consumer-btn"
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "var(--accent-50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}>
                <ShoppingBag size={24} color="var(--accent-500)" />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
                {t.persona.consumer.label}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                {t.persona.consumer.description}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--accent-500)" }}>
                {t.persona.consumer.cta}
                <ArrowRight size={16} />
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}>
            {[
              { icon: Search, label: "Standards Discovery", desc: "Search by product, material or IS code" },
              { icon: MessageSquare, label: "AI Assistant", desc: "Evidence-backed BIS answers" },
              { icon: FileText, label: "Document Library", desc: "Browse indexed BIS standards" },
              { icon: ShieldCheck, label: "Certification Check", desc: "Validate BIS mark formats" },
            ].map((feature, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 20px",
                background: "white",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-light)",
              }}>
                <feature.icon size={20} color="var(--primary-500)" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{feature.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
