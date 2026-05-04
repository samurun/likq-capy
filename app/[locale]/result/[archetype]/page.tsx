import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ResultCard } from "@/components/result/result-card";
import { LocaleSwitcher } from "@/components/quiz/locale-switcher";
import { ARCHETYPE_IDS, LOCALES } from "@/lib/quiz/types";
import { isArchetypeId } from "@/lib/quiz/archetypes";
import { getDictionary, isLocale } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/lookup";
import { OG_LOCALE, canonicalUrl, languageAlternates } from "@/lib/site";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    ARCHETYPE_IDS.map((archetype) => ({ locale, archetype })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; archetype: string }>;
}): Promise<Metadata> {
  const { locale, archetype } = await params;
  if (!isLocale(locale) || !isArchetypeId(archetype)) return {};
  const dict = getDictionary(locale);
  const meta = dict.archetypes[archetype];
  const title = meta.name;
  const description = format(dict.ui.shareText, { archetype: meta.name });
  const suffix = `result/${archetype}`;
  const url = canonicalUrl(locale, suffix);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(suffix),
    },
    openGraph: {
      title: `${meta.name} · ${dict.meta.siteName}`,
      description,
      siteName: dict.meta.siteName,
      url,
      type: "article",
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.name} · ${dict.meta.siteName}`,
      description,
    },
  };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ locale: string; archetype: string }>;
}) {
  const { locale, archetype } = await params;
  if (!isLocale(locale) || !isArchetypeId(archetype)) notFound();
  const dict = getDictionary(locale);
  const meta = dict.archetypes[archetype];
  const url = canonicalUrl(locale, `result/${archetype}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: meta.name,
    headline: meta.name,
    description: meta.description,
    inLanguage: locale,
    url,
    isPartOf: {
      "@type": "Quiz",
      name: dict.meta.siteName,
      url: canonicalUrl(locale),
    },
    keywords: meta.traits.join(", "),
  };

  return (
    <main className="relative min-h-svh">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mx-auto flex w-full max-w-xl items-center justify-between px-5 py-6">
        <Link
          href={`/${locale}`}
          className="font-mono text-xs tracking-wide text-muted-foreground hover:text-foreground"
        >
          ← {dict.meta.siteName}
        </Link>
        <LocaleSwitcher current={locale} />
      </header>
      <ResultCard archetypeId={archetype} locale={locale} dict={dict} />
    </main>
  );
}
