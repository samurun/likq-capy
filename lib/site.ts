import { LOCALES, type Locale } from "@/lib/quiz/types";

export const DEFAULT_LOCALE: Locale = "th";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://capybaraquiz.app";

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  th: "th_TH",
};

export function languageAlternates(
  pathSuffix: string,
): Record<string, string> {
  const trimmed = pathSuffix.replace(/^\/+/, "");
  const langs: Record<string, string> = {};
  for (const loc of LOCALES) {
    langs[loc] = `${SITE_URL}/${loc}${trimmed ? `/${trimmed}` : ""}`;
  }
  langs["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${
    trimmed ? `/${trimmed}` : ""
  }`;
  return langs;
}

export function canonicalUrl(locale: Locale, pathSuffix = ""): string {
  const trimmed = pathSuffix.replace(/^\/+/, "");
  return `${SITE_URL}/${locale}${trimmed ? `/${trimmed}` : ""}`;
}
