"use client";

import { AnimatePresence, motion } from "motion/react";

import { ChoiceButton } from "./choice-button";
import { Capy } from "@/components/mascots/capy";
import type { Choice, QuestionNode } from "@/lib/quiz/types";

const ease = [0.22, 1, 0.36, 1] as const;
const cardInitial = { opacity: 0, y: 12 };
const cardAnimate = { opacity: 1, y: 0 };
const cardExit = { opacity: 0, y: -12 };
const cardTransition = { duration: 0.22, ease };
const mascotAnimate = { y: [0, -3, 0] };
const mascotTransition = {
  duration: 3.6,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export function QuestionCard({
  node,
  prompt,
  labelFor,
  onChoose,
  questionLabel,
}: {
  node: QuestionNode;
  prompt: string;
  labelFor: (choice: Choice) => string;
  onChoose: (choice: Choice) => void;
  questionLabel: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={node.id}
        initial={cardInitial}
        animate={cardAnimate}
        exit={cardExit}
        transition={cardTransition}
        className="flex w-full flex-col gap-6"
      >
        <div className="flex items-start gap-4">
          <motion.div
            className="hidden size-16 shrink-0 sm:block"
            animate={mascotAnimate}
            transition={mascotTransition}
          >
            <Capy
              className="size-16"
              accentClassName="text-chart-2"
              eyes="happy"
            />
          </motion.div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.7rem] tracking-wide text-muted-foreground uppercase">
              {questionLabel}
            </span>
            <h2 className="text-balance text-xl leading-snug font-medium sm:text-2xl">
              {prompt}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {node.choices.map((c, i) => (
            <ChoiceButton
              key={c.id}
              index={i}
              label={labelFor(c)}
              onSelect={() => onChoose(c)}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
