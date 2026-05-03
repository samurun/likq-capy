import Link from "next/link";
import { notFound } from "next/navigation";

import { HistoryList } from "@/components/history/history-list";
import { LocaleSwitcher } from "@/components/quiz/locale-switcher";
import { getDictionary, isLocale } from "@/lib/i18n/dictionaries";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main className="relative mx-auto flex min-h-svh w-full max-w-xl flex-col gap-8 px-5 py-8 sm:py-12">
      <header className="flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="font-mono text-xs tracking-wide text-muted-foreground hover:text-foreground"
        >
          ← {dict.meta.siteName}
        </Link>
        <LocaleSwitcher current={locale} />
      </header>

      <div className="flex flex-col gap-2">
        <h1 className="text-balance text-2xl leading-tight font-medium sm:text-3xl">
          {dict.ui.historyTitle}
        </h1>
      </div>

      <HistoryList locale={locale} dict={dict} />
    </main>
  );
}
