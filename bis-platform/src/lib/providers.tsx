"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Persona, Language } from "@/lib/types";
import { translations, type Translations } from "@/lib/i18n/translations";

// ============================================================================
// Persona Context
// ============================================================================

interface PersonaContextType {
  persona: Persona | null;
  setPersona: (p: Persona) => void;
  clearPersona: () => void;
}

const PersonaContext = createContext<PersonaContextType>({
  persona: null,
  setPersona: () => {},
  clearPersona: () => {},
});

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<Persona | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bis-persona");
    if (stored === "industry" || stored === "consumer") {
      setPersonaState(stored);
    }
  }, []);

  const setPersona = useCallback((p: Persona) => {
    setPersonaState(p);
    localStorage.setItem("bis-persona", p);
  }, []);

  const clearPersona = useCallback(() => {
    setPersonaState(null);
    localStorage.removeItem("bis-persona");
  }, []);

  return (
    <PersonaContext.Provider value={{ persona, setPersona, clearPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}

// ============================================================================
// Language Context
// ============================================================================

interface LanguageContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("bis-language");
    if (stored === "en" || stored === "hi") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((l: Language) => {
    setLanguageState(l);
    localStorage.setItem("bis-language", l);
  }, []);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// ============================================================================
// Sidebar Context
// ============================================================================

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  toggle: () => {},
  close: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
