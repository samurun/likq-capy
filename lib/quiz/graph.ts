import { activeTheme } from "@/lib/themes/active"
import type { ThemeQuestion } from "@/lib/themes/types"

// Thin re-exports over the active theme so engine code (store, runner,
// score, verify-graph) keeps working without knowing which theme is loaded.
export const NODES: Record<string, ThemeQuestion> = activeTheme.questions
export const START: string = activeTheme.start
export const ESTIMATED_DEPTH: number = activeTheme.estimatedDepth

export function getNode(id: string): ThemeQuestion {
  const node = NODES[id]
  if (!node) throw new Error(`Unknown quiz node: ${id}`)
  return node
}
