"use client";

import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { useSidebar } from "@/lib/providers";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Header />
      <main
        className="main-content"
        style={{
          marginLeft: isOpen ? "var(--sidebar-width)" : 0,
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
