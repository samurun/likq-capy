"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

import { ArchetypeIllustration } from "@/components/mascots/archetype-illustration";
import { Button } from "@/components/ui/button";
import { ARCHETYPES } from "@/lib/quiz/archetypes";
import { ACCENT_BG, ACCENT_TEXT } from "@/lib/quiz/accent";
import { clearResults, deleteResult, useResults } from "@/lib/quiz/history";
import type { Locale } from "@/lib/quiz/types";
import { activeTheme } from "@/lib/themes/active";
import { tt } from "@/lib/themes/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/lookup";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const emptyInitial = { opacity: 0, y: 10 };
const emptyAnimate = { opacity: 1, y: 0 };
const emptyTransition = { duration: 0.5, ease };

const itemInitial = { opacity: 0, y: 12 };
const itemAnimate = { opacity: 1, y: 0 };
const itemExit = { opacity: 0, x: -20, height: 0, marginBottom: 0 };

function formatDate(ts: number, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}

export function HistoryList({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const records = useResults();

  const handleClear = () => {
    if (window.confirm(dict.ui.historyClearConfirm)) {
      clearResults();
    }
  };

  // Pre-hydration / SSR placeholder
  if (records === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        {dict.ui.loading}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <motion.div
        initial={emptyInitial}
        animate={emptyAnimate}
        transition={emptyTransition}
        className="flex flex-col items-center gap-6 rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center"
      >
        <p className="text-pretty text-foreground/70">{dict.ui.historyEmpty}</p>
        <Button asChild size="lg" className="rounded-full px-6">
          <Link href={`/${locale}/quiz`}>{dict.ui.start}</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {format(dict.ui.playthroughs, { count: records.length })}
        </span>
        <Button variant="ghost" size="xs" onClick={handleClear}>
          {dict.ui.historyClear}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {records.map((record, index) => {
          const archetype = ARCHETYPES[record.archetype];
          const name = tt(activeTheme.archetypes[record.archetype].name, locale);
          return (
            <motion.div
              key={record.id}
              layout
              initial={itemInitial}
              animate={itemAnimate}
              exit={itemExit}
              transition={{
                duration: 0.35,
                delay: 0.04 * Math.min(index, 6),
                ease,
              }}
              className={cn(
                "relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4",
              )}
            >
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 -z-10 opacity-60",
                  ACCENT_BG[archetype.accent],
                )}
              />

              <Link
                href={`/${locale}/result/${record.archetype}`}
                className="flex grow items-center gap-4"
              >
                <div className="size-14 shrink-0">
                  <ArchetypeIllustration
                    id={record.archetype}
                    title={name}
                  />
                </div>
                <div className="flex min-w-0 grow flex-col gap-0.5">
                  <span
                    className={cn(
                      "truncate text-base font-medium",
                      ACCENT_TEXT[archetype.accent],
                    )}
                  >
                    {name}
                  </span>
                  <span className="font-mono text-[0.7rem] text-muted-foreground">
                    {format(dict.ui.takenOn, {
                      date: formatDate(record.timestamp, locale),
                    })}
                  </span>
                </div>
              </Link>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => deleteResult(record.id)}
                aria-label={dict.ui.historyClear}
                className="shrink-0 opacity-60 hover:opacity-100"
              >
                ×
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
