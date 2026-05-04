import type { AccentToken } from "@/lib/themes/types"

export const ACCENT_COLORS: Record<AccentToken, [string, string]> = {
  "chart-1": ["#f7d985", "#dd9a3c"],
  "chart-2": ["#8fd09a", "#3b8a4d"],
  "chart-3": ["#f3b07b", "#cc7338"],
  "chart-4": ["#f0907a", "#b34a33"],
  "chart-5": ["#9088c2", "#3a2f6b"],
}

// Soft tinted backgrounds matching the result page accent halo on the web
export const ACCENT_BG_TINT: Record<AccentToken, string> = {
  "chart-1": "#fff6e0",
  "chart-2": "#e6f4ea",
  "chart-3": "#fdeedf",
  "chart-4": "#fbe1da",
  "chart-5": "#ebe9f4",
}

// Approximations of the design tokens from app/globals.css :root
export const THEME = {
  background: "#fdfaf4",
  foreground: "#252525",
  mutedForeground: "#8e8e8e",
  border: "#ebe5dc",
  capy: "#a08770",
  capyShadow: "#75603e",
  capyWater: "#cfe1ec",
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
