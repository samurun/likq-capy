# Capybara Quiz

A non-linear personality quiz with a capybara mascot. Drift through a handful of cozy questions and meet your inner capy.

Built with Next.js 16 (App Router) + React 19, Tailwind v4, shadcn-style UI, `motion/react` animations, and Zustand. Bilingual: English and Thai.

## Getting started

```bash
bun install
bun run dev
```

The app runs at <http://localhost:3000>. The root redirects to `/th` (the default locale); visit `/en` directly for English. Locale detection from `Accept-Language` is intentionally **off** — see `proxy.ts` for the rationale.

### Environment

Set `NEXT_PUBLIC_SITE_URL` to your deployed origin (used for canonical URLs, hreflang, sitemap, OG tags). Defaults to `https://capybaraquiz.app` if unset.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

### Static assets to provide

Drop these into `public/` (the OG card itself is generated dynamically — no static `og.png` needed):

- `favicon.ico`
- `apple-touch-icon.png`

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Dev server (Turbopack) |
| `bun run build` | Production build |
| `bun run start` | Run the production build |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | ESLint |
| `bun run format` | Prettier write |
| `bun run e2e` | Playwright tests (auto-starts dev server) |
| `bun run e2e:ui` | Playwright with the inspector UI |
| `bun scripts/verify-graph.ts` | Validate the active theme: graph soundness, archetype reachability, snapshot scoring, i18n parity, tag wiring |

Run `verify-graph.ts` after editing the theme file, the engine, or either locale dictionary.

## Project layout

```
app/
  [locale]/                         localized routes
    page.tsx                        landing
    quiz/page.tsx                   quiz runner
    result/[archetype]/             per-archetype result page (statically generated)
    history/page.tsx                past playthroughs
    opengraph-image.tsx             dynamic OG card (Satori)
    result/[archetype]/opengraph-image.tsx
  layout.tsx                        root: <html lang> from x-locale header
  sitemap.ts                        multi-locale sitemap with hreflang
  robots.ts                         robots.txt
components/
  landing/  quiz/  result/  history/  ui/
  mascots/                          mascot SVG components + registry
lib/
  themes/                           one file = one quiz (see below)
    types.ts                        Theme interface
    capybara-cozy.ts                the active demo theme
    active.ts                       which theme to serve
    i18n.ts                         tt() / ttl() helpers for LocalizedString
  i18n/                             engine UI text only (Next/Back/Share/etc.)
  quiz/                             engine: graph, archetypes, score, store, history, accent
  og/                               OG image building blocks
    palette.ts                      colour tokens + Google Fonts loader
    mascots/                        Satori-friendly mascot renderers + registry
  site.ts                           canonical URL + hreflang helpers
proxy.ts                            Next.js middleware (named `proxy`) — root → /th + headers
scripts/verify-graph.ts             theme validator
```

## Architecture: themes vs engine

The codebase is split into **engine** (the machinery — routing, scoring, store, mascot rendering, OG layout) and **theme** (the content — questions, archetypes, mascot reference, all per-locale text).

A theme is a single file under `lib/themes/`. The active theme is selected by [`lib/themes/active.ts`](lib/themes/active.ts):

```ts
export { theme as activeTheme } from "./capybara-cozy"
```

Swap that import to switch which quiz the app serves. Everything else — engine modules, components, OG routes, sitemap, verify script — reads through `activeTheme`.

### What lives in a theme

```ts
// lib/themes/capybara-cozy.ts (excerpt)
export const theme: Theme = {
  id: "capybara-cozy",
  mascotId: "capy",          // → components/mascots/registry.tsx
  start: "q_intro",
  estimatedDepth: 5,
  tags: ["chill", "social", "adventure", ...],
  meta: {
    siteName: { en: "Capybara Quiz", th: "คาปิบาร่า ควิซ" },
    ogTitle:  { ... },
    ...
  },
  archetypes: {
    "zen-master": {
      profile: { chill: 2, wise: 2, nocturnal: -1 },
      accent: "chart-2",
      mascot: { variant: "leaf", expression: "closed" },
      name:        { en: "The Zen Master", th: "เซน มาสเตอร์" },
      description: { ... },
      traits:      { en: [...], th: [...] },
    },
    ...
  },
  questions: {
    q_intro: {
      prompt: { en: "...", th: "..." },
      choices: [
        { id: "a", label: { en: "...", th: "..." }, tags: { chill: 2, wise: 1 }, next: "q_morning" },
        ...
      ],
    },
    ...
  },
}
```

Every user-visible string is `{ en: string, th: string }` — read with `tt(...)` / `ttl(...)` from `lib/themes/i18n.ts`. The engine `Tag` and `ArchetypeId` types are plain `string`, so a theme is free to declare its own tag set and archetype IDs.

### How the quiz works

The graph runs as a directed graph, not a fixed-length list. Each choice carries a tag delta and points to the next node id or `null` (terminal). Accumulated tag totals are matched against each archetype's profile vector via cosine similarity (`lib/quiz/score.ts`) to pick the final archetype. Tune outcomes by editing `profile` vectors in the theme file.

Quiz progress is persisted in `sessionStorage`; past results in `localStorage`. Both clear cleanly via the in-app controls.

## Adding a new quiz

Reuse the same mascot, just write new content:

1. Copy [`lib/themes/capybara-cozy.ts`](lib/themes/capybara-cozy.ts) → `lib/themes/<your-id>.ts`
2. Edit the new file: `id`, `meta`, `archetypes` (profile + name/description/traits in both locales), `questions`, and `tags` if you need a different tag set
3. Point [`lib/themes/active.ts`](lib/themes/active.ts) at the new file
4. Run `bun scripts/verify-graph.ts`

Tag wiring is checked: every tag used in a choice or archetype profile must be declared in `theme.tags`. If your theme id doesn't match a known fixture set in the verify script, the snapshot-scoring section is skipped automatically.

## Adding a new mascot

The mascot is referenced by id in the theme (`mascotId`) and resolved through two parallel registries — one for the web (React) and one for OG cards (Satori-friendly JSX, hardcoded colours).

1. **Web SVG** — create `components/mascots/<id>.tsx` exporting a component with the `MascotProps` shape (`variant`, `expression`, `accentClassName`, `className`, `title`).
2. **OG SVG** — create `lib/og/mascots/<id>.tsx` exporting a function that renders pure SVG with hardcoded fills (Satori does not process Tailwind or CSS variables).
3. **Register both** — add an entry to [`components/mascots/registry.tsx`](components/mascots/registry.tsx) and [`lib/og/mascots/registry.tsx`](lib/og/mascots/registry.tsx).
4. **Theme** — set `mascotId: "<id>"` and use whatever `mascot.variant` / `mascot.expression` strings your mascot understands per archetype.
5. **Story-image sharing (optional)** — `lib/quiz/share-image.ts` currently only knows how to draw the Capy. To support a new mascot in shareable Instagram/Facebook/TikTok images, add a parallel canvas renderer keyed by `activeTheme.mascotId` and dispatch in `generateStoryImage`.

The web Capy lives at [`components/mascots/capy.tsx`](components/mascots/capy.tsx); the OG Capy at [`lib/og/mascots/capy.tsx`](lib/og/mascots/capy.tsx). They mirror each other path-for-path — keep them in sync.

## i18n

Two layers:

- **Engine text** (Next, Back, Share, progress label, etc.) — JSON dictionaries in `lib/i18n/`. Add a new locale by adding the code to `LOCALES` in `lib/quiz/types.ts`, dropping a `<locale>.json`, registering it in `lib/i18n/dictionaries.ts`, and adding an OG locale tag to `OG_LOCALE` in `lib/site.ts`.
- **Quiz content** (questions, archetype text, site meta) — embedded inside the theme file as `{ en: "...", th: "..." }` records. Add a new locale here by adding the key to every `LocalizedString` in the theme.

`bun scripts/verify-graph.ts` enforces full locale coverage on every theme string.

## OG / social cards

Open Graph cards are generated at request time by [`app/[locale]/opengraph-image.tsx`](app/[locale]/opengraph-image.tsx) and [`app/[locale]/result/[archetype]/opengraph-image.tsx`](app/[locale]/result/[archetype]/opengraph-image.tsx) using `next/og` (Satori). Each combination is statically prerendered at build time. The mascot, palette, and per-locale text all come from the active theme.

## Sharing

The result page can generate a 1080×1920 story image via `lib/quiz/share-image.ts` and attempt to share it through the Web Share API (with file fallback). See "Adding a new mascot" for how to extend it beyond Capy.

## Adding shadcn UI

```bash
npx shadcn@latest add <component>
```

Components land under `components/ui/`. Import as `@/components/ui/<component>`.

## Further reading

See [`CLAUDE.md`](./CLAUDE.md) for the deeper architectural notes (intentionally written for AI agents but useful for humans too).
