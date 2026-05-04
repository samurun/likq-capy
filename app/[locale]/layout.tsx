import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { isLocale } from "@/lib/i18n/dictionaries";
import { LOCALES } from "@/lib/quiz/types";
import { activeTheme } from "@/lib/themes/active";
import { tt } from "@/lib/themes/i18n";
import {
  OG_LOCALE,
  canonicalUrl,
  languageAlternates,
} from "@/lib/site";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ogTitle = tt(activeTheme.meta.ogTitle, locale);
  const ogDescription = tt(activeTheme.meta.ogDescription, locale);
  const siteName = tt(activeTheme.meta.siteName, locale);
  const url = canonicalUrl(locale);
  return {
    title: { absolute: ogTitle },
    description: ogDescription,
    alternates: {
      canonical: url,
      languages: languageAlternates(""),
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName,
      url,
      type: "website",
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const siteName = tt(activeTheme.meta.siteName, locale);
  const ogDescription = tt(activeTheme.meta.ogDescription, locale);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: canonicalUrl(locale),
    inLanguage: locale,
    description: ogDescription,
    publisher: { "@type": "Organization", name: siteName },
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />
      {children}
    </>
  );
}
