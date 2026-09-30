"use client";

import React from "react";
import { Menu, Globe, Bell, User, ArrowLeftRight } from "lucide-react";
import { useSidebar, useLanguage, usePersona } from "@/lib/providers";

export default function Header() {
  const { isOpen, toggle } = useSidebar();
  const { language, setLanguage, t } = useLanguage();
  const { persona, setPersona } = usePersona();

  return (
    <header
      className="header"
      style={{ left: isOpen ? "var(--sidebar-width)" : 0 }}
    >
      {/* Left: Menu toggle */}
      <button
        onClick={toggle}
        className="bis-btn-ghost"
        style={{ padding: 8 }}
        aria-label="Toggle sidebar"
        id="sidebar-toggle-btn"
      >
        <Menu size={20} />
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Persona Switcher */}
      {persona && (
        <button
          onClick={() => setPersona(persona === "industry" ? "consumer" : "industry")}
          className="bis-btn-ghost bis-btn-sm"
          style={{ gap: 6, fontSize: 13 }}
          id="persona-switch-btn"
          aria-label={t.persona.switch}
        >
          <ArrowLeftRight size={14} />
          <span style={{ display: "inline-block" }}>
            {persona === "industry" ? t.persona.consumer.label : t.persona.industry.label}
          </span>
        </button>
      )}

      {/* Language Switcher */}
      <button
        onClick={() => setLanguage(language === "en" ? "hi" : "en")}
        className="bis-btn-ghost bis-btn-sm"
        style={{ gap: 6, fontSize: 13 }}
        id="language-switch-btn"
        aria-label="Switch language"
      >
        <Globe size={15} />
        <span>{language === "en" ? "हिंदी" : "English"}</span>
      </button>

      {/* Notifications */}
      <button
        className="bis-btn-ghost"
        style={{ padding: 8, position: "relative" }}
        aria-label="Notifications"
        id="notifications-btn"
      >
        <Bell size={18} />
      </button>

      {/* Profile */}
      <button
        className="bis-btn-ghost"
        style={{
          padding: 0,
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "var(--primary-100)",
          color: "var(--primary-600)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Profile"
        id="profile-btn"
      >
        <User size={16} />
      </button>
    </header>
  );
}
