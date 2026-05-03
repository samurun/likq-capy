import Link from "next/link";
import { notFound } from "next/navigation";

import { LandingHero } from "@/components/landing/landing-hero";
import { LocaleSwitcher } from "@/components/quiz/locale-switcher";
import { getDictionary, isLocale } from "@/lib/i18n/dictionaries";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main className="relative mx-auto flex min-h-svh w-full max-w-xl flex-col px-5 py-8 sm:py-12">
      <header className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-wide text-muted-foreground">
          {dict.meta.siteName}
        </span>
        <LocaleSwitcher current={locale} />
      </header>

      <LandingHero locale={locale} dict={dict} />

      <footer className="flex flex-col items-center gap-3 pt-6 text-xs text-muted-foreground">
        <Link
          href={`/${locale}/history`}
          className="rounded-full border border-border bg-background/60 px-3 py-1 text-foreground/80 hover:bg-muted"
        >
          {dict.ui.viewHistory} →
        </Link>
        <div className="flex items-center">
          {dict.ui.footer}
          <span className="mx-2 opacity-40">·</span>
          <kbd className="font-mono">d</kbd>
          <span className="ml-1 opacity-70">{dict.ui.darkMode}</span>
        </div>
      </footer>
    </main>
  );
}
