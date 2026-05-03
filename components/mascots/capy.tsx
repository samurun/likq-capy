import { cn } from "@/lib/utils"

export type Accessory =
  | "none"
  | "leaf"
  | "sunglasses"
  | "hat"
  | "bowl"
  | "towel"
  | "moon"
  | "sun"

type Props = {
  accessory?: Accessory
  className?: string
  accentClassName?: string
  /** Optional eye state for variety */
  eyes?: "open" | "closed" | "happy"
  title?: string
}

export function Capy({
  accessory = "none",
  className,
  accentClassName,
  eyes = "open",
  title,
}: Props) {
  return (
    <svg
      viewBox="0 0 240 200"
      role="img"
      aria-label={title ?? "Capybara"}
      className={cn("h-auto w-full", className)}
    >
      {title ? <title>{title}</title> : null}

      {/* Hot spring water ripples */}
      <g
        className="text-capy-water"
        stroke="currentColor"
        strokeLinecap="round"
        fill="none"
      >
        <path
          d="M20 165 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0"
          strokeWidth="1.5"
        />
        <path
          d="M30 178 q12 -5 24 0 t24 0 t24 0 t24 0 t24 0 t24 0"
          strokeWidth="1.5"
        />
      </g>

      {/* Body — main blob */}
      <g className="text-capy" fill="currentColor">
        <ellipse cx="120" cy="130" rx="78" ry="42" />
      </g>

      {/* Body shadow / belly */}
      <g className="text-capy-shadow" fill="currentColor">
        <ellipse cx="120" cy="142" rx="62" ry="22" />
      </g>

      {/* Head */}
      <g className="text-capy" fill="currentColor">
        <ellipse cx="172" cy="92" rx="42" ry="34" />
        {/* Snout */}
        <ellipse cx="200" cy="100" rx="14" ry="11" />
      </g>

      {/* Ears */}
      <g className="text-capy-shadow" fill="currentColor">
        <circle cx="148" cy="64" r="8" />
        <circle cx="180" cy="60" r="8" />
      </g>

      {/* Eyes */}
      <g className="text-foreground" fill="currentColor">
        {eyes === "closed" || eyes === "happy" ? (
          <>
            <path
              d={eyes === "happy" ? "M165 85 q5 -6 10 0" : "M161 88 h12"}
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={eyes === "happy" ? "M186 84 q5 -6 10 0" : "M182 87 h12"}
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx="170" cy="86" r="3" />
            <circle cx="190" cy="84" r="3" />
          </>
        )}
      </g>

      {/* Nostrils */}
      <g className="text-capy-shadow" fill="currentColor">
        <circle cx="204" cy="98" r="1.4" />
        <circle cx="208" cy="103" r="1.4" />
      </g>

      {/* Mouth */}
      <g
        className="text-capy-shadow"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M196 108 q5 4 10 0" />
      </g>

      {/* Feet */}
      <g className="text-capy-shadow" fill="currentColor">
        <ellipse cx="78" cy="170" rx="10" ry="5" />
        <ellipse cx="118" cy="172" rx="10" ry="5" />
        <ellipse cx="158" cy="170" rx="10" ry="5" />
      </g>

      {/* Accessories */}
      {accessory === "leaf" && (
        <g className={cn("text-chart-2", accentClassName)} fill="currentColor">
          <path d="M158 50 q-12 -18 8 -28 q22 -8 26 14 q-10 22 -34 14 z" />
          <path
            d="M168 38 q6 6 14 8"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-background/70"
          />
        </g>
      )}

      {accessory === "sunglasses" && (
        <g className={cn("text-chart-5", accentClassName)} fill="currentColor">
          <rect x="158" y="80" width="20" height="12" rx="3" />
          <rect x="184" y="78" width="20" height="12" rx="3" />
          <path
            d="M178 84 h6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </g>
      )}

      {accessory === "hat" && (
        <g className={cn("text-chart-4", accentClassName)} fill="currentColor">
          <path d="M132 60 q40 -36 80 -8 q-2 8 -8 10 q-36 -16 -68 4 q-4 -2 -4 -6 z" />
          <ellipse cx="172" cy="60" rx="40" ry="6" />
        </g>
      )}

      {accessory === "bowl" && (
        <g className={cn("text-chart-3", accentClassName)} fill="currentColor">
          <path d="M40 130 q20 26 50 0 z" />
          <ellipse cx="65" cy="130" rx="25" ry="5" />
          <circle
            cx="58"
            cy="124"
            r="3"
            className="text-chart-1"
            fill="currentColor"
          />
          <circle
            cx="68"
            cy="125"
            r="3"
            className="text-chart-2"
            fill="currentColor"
          />
        </g>
      )}

      {accessory === "towel" && (
        <g className={cn("text-chart-1", accentClassName)} fill="currentColor">
          <path d="M132 56 q20 -10 40 -2 q4 8 -2 14 q-22 -8 -38 4 q-4 -8 0 -16 z" />
          <path
            d="M138 60 h28 M140 66 h26"
            stroke="currentColor"
            strokeWidth="1"
            className="text-background/40"
            fill="none"
          />
        </g>
      )}

      {accessory === "moon" && (
        <g className={cn("text-chart-2", accentClassName)} fill="currentColor">
          <path d="M40 50 a14 14 0 1 0 12 22 a11 11 0 1 1 -12 -22 z" />
        </g>
      )}

      {accessory === "sun" && (
        <g className={cn("text-chart-1", accentClassName)} fill="currentColor">
          <circle cx="48" cy="56" r="10" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M48 38 v-6" />
            <path d="M48 80 v-6" />
            <path d="M30 56 h-6" />
            <path d="M72 56 h-6" />
            <path d="M34 42 l-4 -4" />
            <path d="M62 70 l4 4" />
            <path d="M62 42 l4 -4" />
            <path d="M34 70 l-4 4" />
          </g>
        </g>
      )}
    </svg>
  )
}
