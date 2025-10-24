"use client";
import { useLanguage } from '@/contexts/LanguageContext';

export function useTranslations() {
  return useLanguage();
}
