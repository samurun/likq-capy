// Engine-level types shared across the quiz machinery. The concrete tag set,
// archetype set, and node graph all come from the active theme — these types
// are intentionally string-based so any theme shape works.

export const LOCALES = ["en", "th"] as const
export type Locale = (typeof LOCALES)[number]

export type Tag = string
export type ArchetypeId = string

export type TagDelta = Record<string, number>

export type HistoryEntry = { nodeId: string; choiceId: string }

export type QuizState = {
  currentNodeId: string
  history: HistoryEntry[]
  tagTotals: Record<string, number>
}
