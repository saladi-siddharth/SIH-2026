"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  FlaskConical,
  ShieldCheck,
  FileText,
  Bookmark,
  HelpCircle,
  Info,
  Settings,
  X,
  Shield,
} from "lucide-react";
import { useSidebar } from "@/lib/providers";
import { useLanguage } from "@/lib/providers";
import { usePersona } from "@/lib/providers";

const mainNavItems = [
  { key: "overview", icon: LayoutDashboard, href: "/overview" },
  { key: "standards", icon: BookOpen, href: "/standards" },
  { key: "assistant", icon: MessageSquare, href: "/assistant" },
  { key: "laboratories", icon: FlaskConical, href: "/laboratories" },
  { key: "validator", icon: ShieldCheck, href: "/validator" },
  { key: "documents", icon: FileText, href: "/documents" },
  { key: "saved", icon: Bookmark, href: "/saved" },
] as const;

const secondaryNavItems = [
  { key: "help", icon: HelpCircle, href: "/help" },
  { key: "about", icon: Info, href: "/about" },
  { key: "settings", icon: Settings, href: "/settings" },
] as const;

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
  const { t } = useLanguage();
  const { persona } = usePersona();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? "" : "sidebar-hidden"}`}>
        {/* Brand */}
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "white" }}>
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
                <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{t.appName}</div>
                <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 400 }}>{t.appTagline}</div>
              </div>
            </Link>
            <button
              onClick={close}
              className="bis-btn-ghost"
              style={{ padding: 4, display: "none", color: "rgba(255,255,255,0.7)" }}
              aria-label="Close sidebar"
              id="sidebar-close-btn"
            >
              <X size={18} />
            </button>
          </div>

          {/* Persona Indicator */}
          {persona && (
            <div style={{
              marginTop: 12,
              padding: "6px 10px",
              background: persona === "industry" ? "rgba(59, 130, 246, 0.15)" : "rgba(168, 85, 247, 0.15)",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              color: persona === "industry" ? "#93c5fd" : "#c4b5fd",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: persona === "industry" ? "#60a5fa" : "#a78bfa",
              }} />
              {persona === "industry" ? t.persona.industry.label : t.persona.consumer.label}
            </div>
          )}
        </div>

        {/* Main Nav */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          <div style={{ padding: "0 16px 8px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>
            Main
          </div>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (window.innerWidth < 1024) close();
                }}
                id={`nav-${item.key}`}
              >
                <item.icon size={18} />
                <span>{t.nav[item.key as keyof typeof t.nav]}</span>
              </Link>
            );
          })}

          <div style={{ margin: "16px 16px 8px", borderTop: "1px solid rgba(255,255,255,0.1)" }} />

          <div style={{ padding: "8px 16px 8px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>
            More
          </div>
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (window.innerWidth < 1024) close();
                }}
                id={`nav-${item.key}`}
              >
                <item.icon size={18} />
                <span>{t.nav[item.key as keyof typeof t.nav]}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className="pulse-dot" style={{ width: 6, height: 6 }} />
            <span>{t.assistant.evidenceBacked}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
