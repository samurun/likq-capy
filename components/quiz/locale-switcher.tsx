"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LOCALES, type Locale } from "@/lib/quiz/types"

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const swap = (next: Locale) => {
    if (next === current) return
    const segments = pathname.split("/")
    if (segments[1] && (LOCALES as readonly string[]).includes(segments[1])) {
      segments[1] = next
    } else {
      segments.splice(1, 0, next)
    }
    router.replace(segments.join("/") || `/${next}`)
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background/60 p-0.5"
    >
      {LOCALES.map((loc) => (
        <Button
          key={loc}
          size="xs"
          variant={loc === current ? "secondary" : "ghost"}
          onClick={() => swap(loc)}
          aria-pressed={loc === current}
        >
          {loc === "th" ? "TH" : "EN"}
        </Button>
      ))}
    </div>
  )
}
