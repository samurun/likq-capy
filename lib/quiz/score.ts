import { activeTheme } from "@/lib/themes/active"
import { ARCHETYPES, ARCHETYPE_LIST } from "./archetypes"
import type { ArchetypeId, HistoryEntry, Tag } from "./types"
import { NODES } from "./graph"

const TAGS = activeTheme.tags

export function emptyTotals(): Record<Tag, number> {
  return TAGS.reduce(
    (acc, t) => ((acc[t] = 0), acc),
    {} as Record<Tag, number>,
  )
}

export function applyChoice(
  totals: Record<Tag, number>,
  nodeId: string,
  choiceId: string,
): Record<Tag, number> {
  const node = NODES[nodeId]
  const choice = node?.choices.find((c) => c.id === choiceId)
  if (!choice) return totals
  const next = { ...totals }
  for (const [tag, delta] of Object.entries(choice.tags)) {
    next[tag] = (next[tag] ?? 0) + delta
  }
  return next
}

export function totalsFromHistory(history: HistoryEntry[]): Record<Tag, number> {
  return history.reduce(
    (acc, h) => applyChoice(acc, h.nodeId, h.choiceId),
    emptyTotals(),
  )
}

function profileMagnitude(profile: Record<string, number>): number {
  let sum = 0
  for (const tag of TAGS) {
    const v = profile[tag] ?? 0
    sum += v * v
  }
  return Math.sqrt(sum) || 1
}

export function pickArchetype(totals: Record<Tag, number>): ArchetypeId {
  let bestId: ArchetypeId = ARCHETYPE_LIST[0].id
  let bestScore = -Infinity
  for (const archetype of ARCHETYPE_LIST) {
    let dot = 0
    for (const tag of TAGS) {
      dot += (totals[tag] ?? 0) * (archetype.profile[tag] ?? 0)
    }
    // Normalize by profile magnitude so archetypes with bigger profile vectors
    // don't drown out narrower ones. Deterministic order by ARCHETYPE_LIST
    // ensures stable tiebreaks.
    const score = dot / profileMagnitude(archetype.profile)
    if (score > bestScore) {
      bestScore = score
      bestId = archetype.id
    }
  }
  return bestId
}

export function archetypeFromHistory(history: HistoryEntry[]): ArchetypeId {
  return pickArchetype(totalsFromHistory(history))
}

export function archetypeBreakdown(
  totals: Record<Tag, number>,
): { id: ArchetypeId; score: number }[] {
  return ARCHETYPE_LIST.map((a) => {
    let dot = 0
    for (const tag of TAGS) dot += (totals[tag] ?? 0) * (a.profile[tag] ?? 0)
    return { id: a.id, score: dot / profileMagnitude(a.profile) }
  }).sort((a, b) => b.score - a.score)
}

export { ARCHETYPES }
