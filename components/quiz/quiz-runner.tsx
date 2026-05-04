"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import { QuestionCard } from "./question-card";
import { ProgressBar } from "./progress-bar";
import { Button } from "@/components/ui/button";
import { getMascot } from "@/components/mascots/registry";
import { ESTIMATED_DEPTH, getNode } from "@/lib/quiz/graph";
import {
  applyChoice,
  archetypeFromHistory,
  pickArchetype,
} from "@/lib/quiz/score";
import { addResult } from "@/lib/quiz/history";
import { isTerminalNode, useQuizStore } from "@/lib/quiz/store";
import { ARCHETYPE_IDS } from "@/lib/quiz/archetypes";
import type { Locale } from "@/lib/quiz/types";
import { activeTheme } from "@/lib/themes/active";
import { tt } from "@/lib/themes/i18n";
import type { ThemeChoice } from "@/lib/themes/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/lookup";

const Mascot = getMascot(activeTheme.mascotId).Component;

const ease = [0.22, 1, 0.36, 1] as const;
const preparingInitial = { opacity: 0 };
const preparingAnimate = { opacity: 1 };
const preparingTransition = { duration: 0.35, ease };
const preparingMascotAnimate = { y: [0, -6, 0] };
const preparingMascotTransition = {
  duration: 2.4,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export function QuizRunner({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const router = useRouter();
  const currentNodeId = useQuizStore((s) => s.currentNodeId);
  const history = useQuizStore((s) => s.history);
  const choose = useQuizStore((s) => s.choose);
  const back = useQuizStore((s) => s.back);
  const reset = useQuizStore((s) => s.reset);

  // Hydrate persisted state on mount (skipHydration in store config)
  useEffect(() => {
    void useQuizStore.persist.rehydrate();
  }, []);

  // Result pages are statically generated — prefetch once so the
  // transition from final choice → result is essentially instant.
  useEffect(() => {
    for (const id of ARCHETYPE_IDS) {
      router.prefetch(`/${locale}/result/${id}`);
    }
  }, [locale, router]);

  const isTerminal = isTerminalNode(currentNodeId);

  // Fallback: if we ever land here in terminal state (e.g. unexpected
  // rehydrate), recover by computing the archetype and navigating.
  // Don't reset the store here — the result page will do that on mount.
  // Resetting now would flip currentNodeId back to START before the route
  // transition completes and cause a Q1 flash.
  useEffect(() => {
    if (!isTerminal) return;
    const snapshot = useQuizStore.getState();
    const archetype = archetypeFromHistory(snapshot.history);
    addResult({ archetype, locale, path: snapshot.history });
    useQuizStore.persist.clearStorage();
    router.replace(`/${locale}/result/${archetype}`);
  }, [isTerminal, locale, router]);

  if (isTerminal) {
    return <PreparingState label={dict.ui.loading} />;
  }

  const node = getNode(currentNodeId);
  const step = history.length + 1;
  const total = ESTIMATED_DEPTH;
  const prompt = tt(node.prompt, locale);
  const labelFor = (choice: ThemeChoice) => tt(choice.label, locale);

  const handleChoose = (choice: ThemeChoice) => {
    // For the terminal choice, short-circuit: compute the archetype, persist
    // the run and navigate without ever transitioning the store into the
    // TERMINAL state. We deliberately do not call reset() here — that would
    // flip currentNodeId to START synchronously and cause a Q1 flash before
    // the route transition completes. The result page resets the store on
    // mount, so the next /quiz visit still starts fresh.
    if (choice.next === null) {
      const snapshot = useQuizStore.getState();
      const finalHistory = [
        ...snapshot.history,
        { nodeId: snapshot.currentNodeId, choiceId: choice.id },
      ];
      const finalTotals = applyChoice(
        snapshot.tagTotals,
        snapshot.currentNodeId,
        choice.id,
      );
      const archetype = pickArchetype(finalTotals);
      addResult({ archetype, locale, path: finalHistory });
      useQuizStore.persist.clearStorage();
      router.replace(`/${locale}/result/${archetype}`);
      return;
    }
    choose(choice);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-5 py-10 sm:py-16">
      <ProgressBar
        current={Math.min(step, total)}
        total={total}
        label={format(dict.ui.progress, { current: step, total })}
      />

      <QuestionCard
        nodeId={currentNodeId}
        node={node}
        prompt={prompt}
        labelFor={labelFor}
        onChoose={handleChoose}
        questionLabel={`${dict.ui.questionLabel} ${step} ${dict.ui.of} ${total}`}
      />

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={back}
          disabled={history.length === 0}
        >
          ← {dict.ui.back}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          disabled={history.length === 0}
        >
          {dict.ui.restart}
        </Button>
      </div>
    </div>
  );
}

function PreparingState({ label }: { label: string }) {
  return (
    <motion.div
      initial={preparingInitial}
      animate={preparingAnimate}
      transition={preparingTransition}
      className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-5 px-5"
    >
      <motion.div
        animate={preparingMascotAnimate}
        transition={preparingMascotTransition}
        className="w-40"
      >
        <Mascot variant="leaf" expression="happy" accentClassName="text-chart-2" />
      </motion.div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </motion.div>
  );
}
