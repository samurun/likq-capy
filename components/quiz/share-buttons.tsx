"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Copy, Share2 } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ArchetypeId } from "@/lib/quiz/types"
import { cn } from "@/lib/utils"

// share-image pulls in a ~400-line canvas/SVG renderer used only when the user
// actually clicks share. Lazy-load it so the result page TTI isn't paying for
// it up front.
const loadShareImage = () => import("@/lib/quiz/share-image")

type Status = "idle" | "copied" | "image-ready"

const triggerHover = { scale: 1.04 }
const triggerTap = { scale: 0.96 }
const statusInitial = { opacity: 0, y: -4 }
const statusAnimate = { opacity: 1, y: 0 }
const statusExit = { opacity: 0, y: -4 }
const statusTransition = { duration: 0.2 }

export function ShareButtons({
  shareTitle,
  shareText,
  shareLabel,
  copyLabel,
  copiedLabel,
  imageReadyLabel,
  archetypeId,
  archetypeName,
  archetypeDescription,
  accent,
  siteName,
  storyTopLabel,
  storyBottomLabel,
}: {
  shareTitle: string
  shareText: string
  shareLabel: string
  copyLabel: string
  copiedLabel: string
  imageReadyLabel: string
  archetypeId: ArchetypeId
  archetypeName: string
  archetypeDescription: string
  accent: string
  siteName: string
  storyTopLabel: string
  storyBottomLabel: string
}) {
  const [status, setStatus] = useState<Status>("idle")

  const flash = (next: Status) => {
    setStatus(next)
    setTimeout(() => setStatus("idle"), 2200)
  }

  const getUrl = () =>
    typeof window === "undefined" ? "" : window.location.href

  const handleNativeShare = async () => {
    const url = getUrl()
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url })
        return
      } catch {
        /* fall through */
      }
    }
    await handleCopy()
  }

  const handleCopy = async () => {
    const url = getUrl()
    if (!url || typeof navigator === "undefined") return
    try {
      await navigator.clipboard.writeText(url)
      flash("copied")
    } catch {
      /* ignore */
    }
  }

  const buildStoryImage = async () => {
    const url = getUrl()
    const { generateStoryImage } = await loadShareImage()
    return generateStoryImage({
      archetypeId,
      archetypeName,
      description: archetypeDescription,
      siteName,
      siteUrl: url,
      accent,
      ctaTop: storyTopLabel,
      ctaBottom: storyBottomLabel,
    })
  }

  const tryShareFile = async (
    blob: Blob,
    filename: string
  ): Promise<boolean> => {
    if (typeof navigator === "undefined") return false
    const file = new File([blob], filename, { type: blob.type })
    const nav = navigator as Navigator & {
      canShare?: (data: ShareData) => boolean
    }
    if (
      typeof nav.canShare !== "function" ||
      !nav.canShare({ files: [file] }) ||
      typeof nav.share !== "function"
    ) {
      return false
    }
    try {
      await nav.share({ title: shareTitle, text: shareText, files: [file] })
      return true
    } catch {
      return false
    }
  }

  const shareToPlatform = async (
    platform: "instagram" | "facebook" | "tiktok"
  ) => {
    const blob = await buildStoryImage()
    if (!blob) return
    const filename = `capybara-${platform}-story.png`

    if (await tryShareFile(blob, filename)) return

    const { downloadBlob } = await loadShareImage()
    downloadBlob(blob, filename)
    flash("image-ready")
  }

  const statusLabel =
    status === "copied"
      ? copiedLabel
      : status === "image-ready"
        ? imageReadyLabel
        : null

  return (
    <div className="flex flex-col items-stretch gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileHover={triggerHover}
            whileTap={triggerTap}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full"
            )}
            aria-label={shareLabel}
          >
            <Share2 className="size-4" />
            {shareLabel}
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-52">
          <DropdownMenuItem onSelect={handleNativeShare}>
            <Share2 />
            {shareLabel}…
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => shareToPlatform("instagram")}>
            <InstagramIcon />
            Instagram Story
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => shareToPlatform("facebook")}>
            <FacebookIcon />
            Facebook Story
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => shareToPlatform("tiktok")}>
            <TikTokIcon />
            TikTok
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleCopy}>
            {status === "copied" ? <Check /> : <Copy />}
            {copyLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AnimatePresence>
        {statusLabel ? (
          <motion.span
            key={statusLabel}
            initial={statusInitial}
            animate={statusAnimate}
            exit={statusExit}
            transition={statusTransition}
            className="text-xs text-muted-foreground"
            role="status"
          >
            {statusLabel}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.25-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H8v3h2.5V21h3z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 3c.4 1.7 1.5 3 3.4 3.3v2.5a6 6 0 0 1-3.4-1.1v6.5a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.6a3 3 0 1 0 2.1 2.9V3h2.6z" />
    </svg>
  )
}
