import type { ReactElement } from "react"

import { OgCapy } from "./capy"

export type OgMascotProps = {
  variant?: string
  expression?: "open" | "closed" | "happy"
  accentColor?: string
  width: number
}

type OgRenderer = (props: OgMascotProps) => ReactElement

const REGISTRY: Record<string, OgRenderer> = {
  capy: OgCapy,
}

export function getOgMascot(id: string): OgRenderer {
  const renderer = REGISTRY[id]
  if (!renderer) throw new Error(`Unknown OG mascot id: ${id}`)
  return renderer
}
