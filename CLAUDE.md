# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **bun** (see `bun.lock`).

- `bun run dev` — Next.js dev server (Turbopack) on port 3000.
- `bun run build` — Production build.
- `bun run start` — Run the production build.
- `bun run typecheck` — `tsc --noEmit`.
- `bun run lint` — ESLint (extends `eslint-config-next` core-web-vitals + typescript).
- `bun run format` — Prettier write across `**/*.{ts,tsx}`.
- `bun run e2e` — Playwright tests (Chromium only). The config auto-starts the dev server via `bun run dev`. Add `--ui` for the inspector, `--grep <pattern>` to run a single test, or `<file>:<line>` to target one spec.
- `bun scripts/verify-graph.ts` — Sanity-checks the quiz graph (reachability, no cycles, every node/choice has a translation in both `en.json` and `th.json`, every archetype reachable from some path). Run after editing `lib/quiz/graph.ts`, `lib/quiz/archetypes.ts`, or either i18n dictionary.

Prettier is configured with `semi: false`, `singleQuote: false`, and the Tailwind plugin (sorts classes; recognises `cn` and `cva`). Some legacy files still use semicolons — leave them; Prettier will normalise on `format`.

## Architecture

Next.js 16 App Router with React 19. Tailwind v4 + shadcn-style UI in `components/ui`. Animations with `motion/react`. Client-side state with `zustand`. Theme via `next-themes`. No backend — everything is static/edge.

### Routing & i18n

All user-facing routes live under `app/[locale]/...`. Locales are defined in `lib/quiz/types.ts` (`LOCALES = ["en", "th"]`).

`proxy.ts` (Next.js middleware, named `proxy` not `middleware`) handles two jobs on every non-asset request:

1. If the path lacks a locale prefix, redirect to `/<detected-locale><pathname>` based on `Accept-Language`.
2. If it has one, forward the request with `x-locale` and `x-pathname` headers set.

The root layout (`app/layout.tsx`) reads `x-locale` from `headers()` and uses it to set `<html lang>` server-side. This is why `[locale]` routes render dynamically rather than fully statically — that's the deliberate tradeoff for correct per-locale `lang` and HTML-level SEO. Do not reintroduce a client-side `<html lang>` setter.

Dictionaries are JSON files in `lib/i18n/`. `getDictionary(locale)` is server-only (`import "server-only"`); pass the resolved `dict` down to client components as a prop rather than re-importing. Use `lookup(dict, "questions.q_intro.prompt")` for dot-path access and `format(template, vars)` for `{placeholder}` substitution.

### SEO

Per-route metadata lives in `generateMetadata`. Helpers in `lib/site.ts` produce canonical URLs and the `alternates.languages` hreflang map (including `x-default`). `SITE_URL` reads `NEXT_PUBLIC_SITE_URL` with a fallback. JSON-LD is injected via inline `<script type="application/ld+json">` (a `WebSite` schema in `[locale]/layout.tsx`, a `CreativeWork` schema in the result page). `app/sitemap.ts` and `app/robots.ts` enumerate all locale × route × archetype combinations.

### Quiz engine

The quiz is a directed graph, not a fixed-length list:

- `lib/quiz/graph.ts` — `NODES` map keyed by node id; each `QuestionNode` has `choices`, each choice has `tags` (a `TagDelta`) and a `next` node id (or `null` for terminal). `START = "q_intro"`. Edit this graph and re-run `verify-graph.ts`.
- `lib/quiz/archetypes.ts` — Each archetype has a tag `profile` vector, an `accent` colour token (`chart-1`..`chart-5`), and an `accessory` (drives the mascot SVG).
- `lib/quiz/score.ts` — As the player moves, choice `tags` accumulate into per-tag totals. Final archetype is picked by **cosine similarity** between user totals and each archetype's profile (dot product divided by profile magnitude). Tiebreaks by `ARCHETYPE_LIST` order. To tune outcomes, adjust the `profile` vectors in `archetypes.ts` rather than the graph.
- `lib/quiz/store.ts` — Zustand store with `sessionStorage` persistence (`skipHydration: true` — `QuizRunner` calls `useQuizStore.persist.rehydrate()` on mount). Terminal node id is the sentinel string `"__terminal__"` (don't hardcode this elsewhere; use `isTerminalNode`).
- `lib/quiz/history.ts` — Persisted past results in `localStorage`. Implemented as a snapshot store consumed via `useResults()` (a `useSyncExternalStore` hook). Mutations (`addResult`, `deleteResult`, `clearResults`) update the cache and notify subscribers; cross-tab updates land via `storage` events. Components must not maintain their own `useState` mirror — read from `useResults()`.

### Quiz flow

1. `app/[locale]/quiz/page.tsx` (server) → `QuizRunner` (client) drives the store.
2. On terminal, `QuizRunner` computes the archetype with `archetypeFromHistory`, persists the run via `addResult`, clears quiz state, and `router.replace`s to `/[locale]/result/[archetype]`.
3. The result page is statically generated for every (locale, archetype) pair via `generateStaticParams`.

### Mascot rendering

`Capy` (`components/mascots/capy.tsx`) is a single inline SVG; its colours come from CSS custom properties (`--capy`, `--capy-shadow`, `--capy-water`, plus `--chart-*`) defined in `app/globals.css`. `ArchetypeIllustration` is a thin wrapper that maps an `ArchetypeId` → accessory + eye expression + accent class.

A second renderer in `lib/quiz/share-image.ts` re-implements the same Capy as a string-built SVG drawn into a 1080×1920 canvas for Instagram/Facebook/TikTok story sharing. **Both renderers must stay visually in sync** — if you change accessory shapes or proportions in `capy.tsx`, mirror the change in `renderCapySvg` inside `share-image.ts`. Theme colours are read at render time via a hidden probe element so that `oklch()` CSS values resolve to concrete `rgb()` strings the canvas can rasterize.

### Shared accent maps

`lib/quiz/accent.ts` exposes `ACCENT_BG` and `ACCENT_TEXT` keyed by `Archetype["accent"]`. Use these instead of redeclaring per-component class maps. Tailwind needs the literal class strings to be statically present — keep these maps as-is (don't construct class names dynamically with template strings).
