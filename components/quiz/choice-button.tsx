"use client";

import * as motion from "motion/react-client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const letters = ["A", "B", "C", "D"];
const ease = [0.22, 1, 0.36, 1] as const;
const initial = { opacity: 0, y: 8 };
const animate = { opacity: 1, y: 0 };
const exit = { opacity: 0, y: -8 };
const hover = { x: 2 };
const tap = { scale: 0.985 };

export function ChoiceButton({
  label,
  onSelect,
  index,
  disabled,
}: {
  label: string;
  onSelect: () => void;
  index: number;
  disabled?: boolean;
}) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.25, delay: 0.05 * index, ease }}
      whileHover={hover}
      whileTap={tap}
      className="w-full"
    >
      <Button
        variant="outline"
        size="lg"
        onClick={onSelect}
        disabled={disabled}
        className={cn(
          "h-auto w-full justify-start gap-3 rounded-2xl border-border/80 bg-card/60 px-4 py-4 text-left text-sm whitespace-normal",
          "hover:bg-muted hover:border-foreground/30 transition-colors",
          "focus-visible:border-foreground/40",
        )}
      >
        <span
          aria-hidden
          className="grid size-7 shrink-0 place-items-center rounded-full border border-border bg-background text-xs font-medium text-muted-foreground tabular-nums"
        >
          {letters[index] ?? index + 1}
        </span>
        <span className="grow leading-relaxed">{label}</span>
      </Button>
    </motion.div>
  );
}
