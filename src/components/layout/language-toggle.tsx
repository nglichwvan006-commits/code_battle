"use client";
/* eslint-disable */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useI18nStore } from "@/stores/i18n-store";
import { useEffect, useState } from "react";

export function LanguageToggle() {
  const { language, setLanguage } = useI18nStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />; // Placeholder to avoid layout shift
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === "en" ? "vi" : "en")}
      className="h-9 w-9 rounded-full text-base font-bold"
      title={language === "en" ? "Switch to Vietnamese" : "Chuyển sang tiếng Anh"}
    >
      {language === "en" ? "🇺🇸" : "🇻🇳"}
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}
