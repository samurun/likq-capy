"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"

import { ArchetypeIllustration } from "@/components/mascots/archetype-illustration"
import { Button } from "@/components/ui/button"
import { ShareButtons } from "@/components/quiz/share-buttons"
import { ARCHETYPES } from "@/lib/quiz/archetypes"
import { ACCENT_BG, ACCENT_TEXT } from "@/lib/quiz/accent"
import { useQuizStore } from "@/lib/quiz/store"
import type { ArchetypeId, Locale } from "@/lib/quiz/types"
import { activeTheme } from "@/lib/themes/active"
import { tt, ttl } from "@/lib/themes/i18n"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { format } from "@/lib/i18n/lookup"
import { cn } from "@/lib/utils"
import { badgeVariants } from "../ui/badge"

const ease = [0.22, 1, 0.36, 1] as const

const cardInitial = { opacity: 0, y: 16, scale: 0.98 }
const cardAnimate = { opacity: 1, y: 0, scale: 1 }
const cardTransition = { duration: 0.6, ease }

const accentBgInitial = { opacity: 0 }
const accentBgAnimate = { opacity: 1 }
const accentBgTransition = { duration: 0.8, ease }

const mascotInitial = { opacity: 0, scale: 0.85 }
const mascotAnimate = { opacity: 1, scale: 1, y: [0, -6, 0] }
const mascotTransition = {
  opacity: { duration: 0.5, delay: 0.1, ease },
  scale: { duration: 0.5, delay: 0.1, ease },
  y: { duration: 4, delay: 0.6, repeat: Infinity, ease: "easeInOut" as const },
}

const headerStagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
}
const fadeUpSm = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
}
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}
const fadeUpSmTransition = { duration: 0.4, ease }
const fadeUpTransition = { duration: 0.5, ease }

const traitsContainerInitial = { opacity: 0 }
const traitsContainerAnimate = { opacity: 1 }
const traitsContainerTransition = { duration: 0.5, delay: 0.55, ease }
const traitsListStagger = {
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.6 } },
}
const traitItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}
const traitItemTransition = { duration: 0.35, ease }
const traitItemHover = { y: -2 }

const footerInitial = { opacity: 0, y: 8 }
const footerAnimate = { opacity: 1, y: 0 }
const footerTransition = { duration: 0.5, delay: 0.85, ease }

export function ResultCard({
  archetypeId,
  locale,
  dict,
}: {
  archetypeId: ArchetypeId
  locale: Locale
  dict: Dictionary
}) {
  const archetype = ARCHETYPES[archetypeId]
  const meta = {
    name: tt(activeTheme.archetypes[archetypeId].name, locale),
    description: tt(activeTheme.archetypes[archetypeId].description, locale),
    traits: ttl(activeTheme.archetypes[archetypeId].traits, locale),
  }

  // Reset the quiz store on mount so that returning to /quiz starts fresh.
  // Done here (not in QuizRunner on terminal choice) to avoid a Q1 flash
  // during the route transition out of the runner.
  useEffect(() => {
    useQuizStore.getState().reset()
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-5 py-10 sm:py-16">
      <motion.div
        initial={cardInitial}
        animate={cardAnimate}
        transition={cardTransition}
        className={cn(
          "relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10"
        )}
      >
        <motion.div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10",
            ACCENT_BG[archetype.accent]
          )}
          initial={accentBgInitial}
          animate={accentBgAnimate}
          transition={accentBgTransition}
        />

        <motion.div
          className="w-full max-w-65"
          initial={mascotInitial}
          animate={mascotAnimate}
          transition={mascotTransition}
        >
          <ArchetypeIllustration id={archetypeId} title={meta.name} />
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-2 text-center"
          initial="hidden"
          animate="visible"
          variants={headerStagger}
        >
          <motion.span
            variants={fadeUpSm}
            transition={fadeUpSmTransition}
            className="font-mono text-[0.7rem] tracking-wide text-muted-foreground uppercase"
          >
            {dict.ui.yourArchetype}
          </motion.span>
          <motion.h1
            variants={fadeUp}
            transition={fadeUpTransition}
            className={cn(
              "text-3xl font-medium text-balance sm:text-4xl",
              ACCENT_TEXT[archetype.accent]
            )}
          >
            {meta.name}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={fadeUpTransition}
            className="leading-relaxed text-pretty text-foreground/80 sm:text-base"
          >
            {meta.description}
          </motion.p>
        </motion.div>

        <motion.div
          className="flex w-full flex-col gap-2"
          initial={traitsContainerInitial}
          animate={traitsContainerAnimate}
          transition={traitsContainerTransition}
        >
          <span className="font-mono text-[0.7rem] tracking-wide text-muted-foreground uppercase">
            {dict.ui.traits}
          </span>
          <motion.ul
            className="flex flex-wrap gap-2"
            initial="hidden"
            animate="visible"
            variants={traitsListStagger}
          >
            {meta.traits.map((trait) => (
              <motion.li
                key={trait}
                variants={traitItemVariants}
                transition={traitItemTransition}
                whileHover={traitItemHover}
                className={cn(badgeVariants({ variant: "outline" }))}
              >
                {trait}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between"
        initial={footerInitial}
        animate={footerAnimate}
        transition={footerTransition}
      >
        <ShareButtons
          shareTitle={tt(activeTheme.meta.ogTitle, locale)}
          shareText={format(dict.ui.shareText, { archetype: meta.name })}
          shareLabel={dict.ui.share}
          copyLabel={dict.ui.copy}
          copiedLabel={dict.ui.copied}
          imageReadyLabel={dict.ui.imageReady}
          archetypeId={archetypeId}
          archetypeName={meta.name}
          archetypeDescription={meta.description}
          accent={archetype.accent}
          siteName={tt(activeTheme.meta.siteName, locale)}
          storyTopLabel={dict.ui.yourArchetype}
          storyBottomLabel={dict.ui.storyCta}
        />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/${locale}/history`}>{dict.ui.viewHistory}</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/${locale}/quiz`}>{dict.ui.tryAnother}</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
