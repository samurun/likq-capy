import type { MetadataRoute } from "next";

import { ARCHETYPE_IDS } from "@/lib/quiz/archetypes";
import { LOCALES } from "@/lib/quiz/types";
import { SITE_URL, canonicalUrl, languageAlternates } from "@/lib/site";

const ROUTES = ["", "quiz", "history"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  entries.push({
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 1,
  });

  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      entries.push({
        url: canonicalUrl(locale, route),
        lastModified: now,
        changeFrequency: route === "" ? "monthly" : "yearly",
        priority: route === "" ? 0.9 : 0.6,
        alternates: { languages: languageAlternates(route) },
      });
    }

    for (const archetype of ARCHETYPE_IDS) {
      const suffix = `result/${archetype}`;
      entries.push({
        url: canonicalUrl(locale, suffix),
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.7,
        alternates: { languages: languageAlternates(suffix) },
      });
    }
  }

  return entries;
}
