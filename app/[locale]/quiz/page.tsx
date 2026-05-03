import Link from "next/link";
import { notFound } from "next/navigation";

import { QuizRunner } from "@/components/quiz/quiz-runner";
import { LocaleSwitcher } from "@/components/quiz/locale-switcher";
import { getDictionary, isLocale } from "@/lib/i18n/dictionaries";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main className="relative min-h-svh">
      <header className="mx-auto flex w-full max-w-xl items-center justify-between px-5 py-6">
        <Link
          href={`/${locale}`}
          className="font-mono text-xs tracking-wide text-muted-foreground hover:text-foreground"
        >
          ← {dict.meta.siteName}
        </Link>
        <LocaleSwitcher current={locale} />
      </header>
      <QuizRunner locale={locale} dict={dict} />
    </main>
  );
}
