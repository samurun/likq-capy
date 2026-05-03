"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Capy } from "@/components/mascots/capy";
import type { Locale } from "@/lib/quiz/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const mascotVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, y: [0, -6, 0] },
};
const mascotTransition = {
  opacity: { duration: 0.6, ease },
  scale: { duration: 0.6, ease },
  y: { duration: 4.2, delay: 0.7, repeat: Infinity, ease: "easeInOut" as const },
};
const titleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};
const titleTransition = { duration: 0.55, ease };
const ctaVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};
const ctaTransition = { duration: 0.5, ease };
const ctaHover = { scale: 1.04 };
const ctaTap = { scale: 0.96 };

export function LandingHero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <motion.div
      className="flex grow flex-col items-center justify-center gap-10 py-10 text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="w-full max-w-75"
        variants={mascotVariants}
        transition={mascotTransition}
      >
        <Capy
          accessory="leaf"
          eyes="happy"
          accentClassName="text-chart-2"
          title={dict.meta.siteName}
        />
      </motion.div>

      <motion.div
        className="flex flex-col gap-3"
        variants={titleVariants}
        transition={titleTransition}
      >
        <h1 className="text-balance text-3xl leading-tight font-medium sm:text-4xl">
          {dict.meta.ogTitle}
        </h1>
        <p className="text-pretty text-foreground/70 sm:text-base">
          {dict.meta.tagline}
        </p>
      </motion.div>

      <motion.div
        variants={ctaVariants}
        transition={ctaTransition}
        whileHover={ctaHover}
        whileTap={ctaTap}
      >
        <Button asChild size="lg" className="rounded-full px-6">
          <Link href={`/${locale}/quiz`}>{dict.ui.start}</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
