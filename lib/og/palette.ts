import type { Archetype } from "@/lib/quiz/types"

export const ACCENT_COLORS: Record<Archetype["accent"], [string, string]> = {
  "chart-1": ["#f7d985", "#dd9a3c"],
  "chart-2": ["#8fd09a", "#3b8a4d"],
  "chart-3": ["#f3b07b", "#cc7338"],
  "chart-4": ["#f0907a", "#b34a33"],
  "chart-5": ["#9088c2", "#3a2f6b"],
}

let fontCache: ArrayBuffer | null = null

export async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  if (fontCache) return fontCache
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Sriracha&display=swap",
    )
    const css = await cssRes.text()
    const url = css.match(
      /src:\s*url\((https:[^)]+)\)\s*format\('truetype'\)/,
    )?.[1]
    if (!url) return null
    const fontRes = await fetch(url)
    fontCache = await fontRes.arrayBuffer()
    return fontCache
  } catch {
    return null
  }
}
