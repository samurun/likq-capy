# Capybara Quiz

A non-linear personality quiz with a capybara mascot. Drift through a handful of cozy questions and meet your inner capy.

Built with Next.js 16 (App Router) + React 19, Tailwind v4, shadcn-style UI, `motion/react` animations, and Zustand. Bilingual: English and Thai.

## Getting started

```bash
bun install
bun run dev
```

The app runs at <http://localhost:3000> and redirects to a locale-prefixed route (`/en` or `/th`) based on `Accept-Language`.

### Environment

Set `NEXT_PUBLIC_SITE_URL` to your deployed origin (used for canonical URLs, hreflang, sitemap, OG tags). Defaults to `https://capybaraquiz.app` if unset.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

### Static assets to provide

Drop these into `public/` for full SEO/social coverage:

- `og.png` — 1200×630 OpenGraph/Twitter card image
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
| `bun scripts/verify-graph.ts` | Validate the quiz graph and i18n coverage |

Run after editing `lib/quiz/graph.ts`, `lib/quiz/archetypes.ts`, or either dictionary in `lib/i18n/`:

```bash
bun scripts/verify-graph.ts
```

## Project layout

```
app/
  [locale]/              localized routes
    page.tsx             landing
    quiz/page.tsx        quiz runner
    result/[archetype]/  per-archetype result page (statically generated)
    history/page.tsx     past playthroughs
  layout.tsx             root: <html lang> from x-locale header
  sitemap.ts             multi-locale sitemap with hreflang
  robots.ts              robots.txt
components/
  landing/  quiz/  result/  history/  mascots/  ui/
lib/
  i18n/         dictionaries.ts + en.json + th.json
  quiz/         graph, archetypes, score, store, history, accent map
  site.ts       canonical URL + hreflang helpers
proxy.ts        Next.js middleware (named `proxy`) — locale redirect + headers
```

## How the quiz works

The quiz is a directed graph (`lib/quiz/graph.ts`), not a fixed-length list. Each choice carries a tag delta (e.g. `{ chill: 2, wise: 1 }`) and points to the next node or `null` for terminal. The accumulated tag totals are matched against archetype profile vectors via cosine similarity (`lib/quiz/score.ts`) to pick the final archetype. Tune outcomes by editing the `profile` vectors in `lib/quiz/archetypes.ts`.

Quiz progress is persisted in `sessionStorage`; past results in `localStorage`. Both clear cleanly via the in-app controls.

## i18n

All routes are localized under `app/[locale]/`. Locales are listed in `lib/quiz/types.ts`. Dictionaries are JSON; `getDictionary()` is server-only and the resolved `dict` is passed down to client components as a prop. Add a new locale by:

1. Add the code to `LOCALES` in `lib/quiz/types.ts`.
2. Drop a `<locale>.json` next to `en.json` / `th.json` and register it in `lib/i18n/dictionaries.ts`.
3. Add an OG locale tag to `OG_LOCALE` in `lib/site.ts`.
4. Re-run `bun scripts/verify-graph.ts` to confirm full coverage.

## Sharing

The result page can generate a 1080×1920 story image (Instagram / Facebook / TikTok) via `lib/quiz/share-image.ts`. It uses the Web Share API with files where supported, falling back to a file download. The mascot is re-rendered as a string-built SVG inside the canvas — if you change shapes in `components/mascots/capy.tsx`, mirror them there.

## Adding shadcn UI

```bash
npx shadcn@latest add <component>
```

Components land under `components/ui/`. Import as `@/components/ui/<component>`.

## Further reading

See [`CLAUDE.md`](./CLAUDE.md) for the deeper architectural notes (intentionally written for AI agents but useful for humans too).
