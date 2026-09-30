"use client";

import React from "react";
import { PersonaProvider, LanguageProvider, SidebarProvider } from "@/lib/providers";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <PersonaProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </PersonaProvider>
    </LanguageProvider>
  );
}
