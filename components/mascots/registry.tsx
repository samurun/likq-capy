import type { ComponentType } from "react"

import { Capy, type Accessory } from "./capy"

export type MascotProps = {
  variant?: string
  expression?: "open" | "closed" | "happy"
  accentClassName?: string
  className?: string
  title?: string
}

type Entry = {
  Component: ComponentType<MascotProps>
}

const REGISTRY: Record<string, Entry> = {
  capy: {
    Component: ({ variant, expression, accentClassName, className, title }) => (
      <Capy
        accessory={(variant ?? "none") as Accessory}
        eyes={expression ?? "open"}
        accentClassName={accentClassName}
        className={className}
        title={title}
      />
    ),
  },
}

export function getMascot(id: string): Entry {
  const entry = REGISTRY[id]
  if (!entry) throw new Error(`Unknown mascot id: ${id}`)
  return entry
}
