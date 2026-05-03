"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const fillInitial = { width: 0 };
const fillTransition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

export function ProgressBar({
  current,
  total,
  label,
  className,
}: {
  current: number;
  total: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground tabular-nums">
        <span>{label}</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <motion.div
          className="h-full rounded-full bg-foreground"
          initial={fillInitial}
          animate={{ width: `${pct}%` }}
          transition={fillTransition}
        />
      </div>
    </div>
  );
}
