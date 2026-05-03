import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getDictionary, isLocale } from "@/lib/i18n/dictionaries";
import { LOCALES } from "@/lib/quiz/types";
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
  const dict = getDictionary(locale);
  const url = canonicalUrl(locale);
  return {
    title: { absolute: dict.meta.ogTitle },
    description: dict.meta.ogDescription,
    alternates: {
      canonical: url,
      languages: languageAlternates(""),
    },
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
      siteName: dict.meta.siteName,
      url,
      type: "website",
      locale: OG_LOCALE[locale],
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
      images: ["/og.png"],
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
  const dict = getDictionary(locale);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dict.meta.siteName,
    url: canonicalUrl(locale),
    inLanguage: locale,
    description: dict.meta.ogDescription,
    publisher: { "@type": "Organization", name: dict.meta.siteName },
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
