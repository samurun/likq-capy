import type { Locale } from "@/lib/quiz/types"

export type LocalizedString = Record<Locale, string>
export type LocalizedStringList = Record<Locale, string[]>

export type AccentToken = "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5"

export type ThemeChoice = {
  id: string
  label: LocalizedString
  tags: Record<string, number>
  next: string | null
}

export type ThemeQuestion = {
  prompt: LocalizedString
  choices: ThemeChoice[]
}

export type ThemeArchetype = {
  profile: Record<string, number>
  accent: AccentToken
  // Free-form props passed through to the mascot component. Each mascot
  // interprets these in its own way (e.g. Capy reads `variant` as accessory
  // and `expression` as eyes).
  mascot: {
    variant?: string
    expression?: string
  }
  name: LocalizedString
  description: LocalizedString
  traits: LocalizedStringList
}

export type ThemeMeta = {
  siteName: LocalizedString
  tagline: LocalizedString
  ogTitle: LocalizedString
  ogDescription: LocalizedString
}

export type Theme = {
  id: string
  // Reference to a mascot in components/mascots/registry.ts
  mascotId: string
  estimatedDepth: number
  start: string
  // Names of all tags scored against. Order is irrelevant for cosine
  // similarity, but listing them explicitly catches typos in profiles/choices
  // at verify-time.
  tags: readonly string[]
  meta: ThemeMeta
  archetypes: Record<string, ThemeArchetype>
  questions: Record<string, ThemeQuestion>
}
