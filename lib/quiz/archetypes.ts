import { activeTheme } from "@/lib/themes/active"
import type { ThemeArchetype } from "@/lib/themes/types"
import type { ArchetypeId } from "./types"

// Thin re-exports over the active theme.
export const ARCHETYPES: Record<string, ThemeArchetype> = activeTheme.archetypes

export const ARCHETYPE_IDS: readonly string[] = Object.keys(activeTheme.archetypes)

export const ARCHETYPE_LIST: Array<ThemeArchetype & { id: ArchetypeId }> =
  ARCHETYPE_IDS.map((id) => ({ id, ...activeTheme.archetypes[id] }))

export function isArchetypeId(value: string): value is ArchetypeId {
  return value in activeTheme.archetypes
}
