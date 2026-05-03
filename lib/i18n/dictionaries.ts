import "server-only";
import type { Locale } from "@/lib/quiz/types";
import { LOCALES } from "@/lib/quiz/types";

import en from "./en.json";
import th from "./th.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, th: th as Dictionary };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
