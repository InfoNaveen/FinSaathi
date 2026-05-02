"use client";
import { useState, useCallback } from "react";
import type { Language } from "@/types";
import { LANGUAGE_FONT } from "@/types";

export function useLanguage(initial: Language = "EN") {
  const [language, setLanguage] = useState<Language>(initial);
  const [transitioning, setTransitioning] = useState(false);

  const switchLanguage = useCallback((lang: Language) => {
    setTransitioning(true);
    setTimeout(() => {
      setLanguage(lang);
      setTransitioning(false);
    }, 200);
  }, []);

  const fontClass = LANGUAGE_FONT[language];

  return { language, switchLanguage, transitioning, fontClass };
}
