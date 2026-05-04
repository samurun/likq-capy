import { ImageResponse } from "next/og"

import { getDictionary, isLocale } from "@/lib/i18n/dictionaries"
import { ARCHETYPES, isArchetypeId } from "@/lib/quiz/archetypes"
import { ARCHETYPE_IDS, LOCALES, type ArchetypeId } from "@/lib/quiz/types"
import { OgCapy } from "@/lib/og/capy"
import {
  ACCENT_BG_TINT,
  ACCENT_COLORS,
  THEME,
  loadDisplayFont,
} from "@/lib/og/palette"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    ARCHETYPE_IDS.map((archetype) => ({ locale, archetype })),
  )
}

const CTA_BY_LOCALE: Record<string, string> = {
  en: "Take the quiz →",
  th: "ลองทำควิซ →",
}

const LEAD_BY_LOCALE: Record<string, string> = {
  en: "You are",
  th: "คุณคือ",
}

const EYES_BY_ARCHETYPE: Record<ArchetypeId, "open" | "closed" | "happy"> = {
  "zen-master": "closed",
  "foodie-lounger": "happy",
  "adventure-seeker": "open",
  "social-bather": "happy",
  "lone-floater": "closed",
  "hot-spring-sage": "closed",
  sunbather: "happy",
  "night-owl": "open",
}

export default async function ResultOgImage({
  params,
}: {
  params: Promise<{ locale: string; archetype: string }>
}) {
  const { locale: rawLocale, archetype: rawArchetype } = await params
  const locale = isLocale(rawLocale) ? rawLocale : "th"
  if (!isArchetypeId(rawArchetype)) {
    return new Response("Not found", { status: 404 })
  }
  const dict = getDictionary(locale)
  const meta = dict.archetypes[rawArchetype]
  const archetype = ARCHETYPES[rawArchetype]
  const [, accent] = ACCENT_COLORS[archetype.accent]
  const tint = ACCENT_BG_TINT[archetype.accent]
  const fontData = await loadDisplayFont()
  const cta = CTA_BY_LOCALE[locale] ?? CTA_BY_LOCALE.en
  const lead = LEAD_BY_LOCALE[locale] ?? LEAD_BY_LOCALE.en

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: THEME.background,
          color: THEME.foreground,
          fontFamily: "Capy, system-ui, sans-serif",
          padding: 48,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            background: tint,
            border: `1px solid ${THEME.border}`,
            borderRadius: 36,
            padding: "44px 56px",
            position: "relative",
          }}
        >
          {/* Brand mark — top-left */}
          <div
            style={{
              position: "absolute",
              top: 36,
              left: 56,
              display: "flex",
              alignItems: "center",
              fontSize: 20,
              color: THEME.mutedForeground,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: accent,
                marginRight: 12,
              }}
            />
            {dict.meta.siteName}
          </div>

          {/* Mascot — left half */}
          <div
            style={{
              width: 460,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 32,
            }}
          >
            <OgCapy
              accessory={archetype.accessory}
              eyes={EYES_BY_ARCHETYPE[rawArchetype]}
              accentColor={accent}
              width={420}
            />
          </div>

          {/* Content — right half */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              paddingLeft: 16,
              marginTop: 56,
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: THEME.mutedForeground,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              {lead}
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 64,
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: -1,
                color: accent,
                maxWidth: 560,
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {meta.name}
            </div>

            <div
              style={{
                marginTop: 22,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: "flex-start",
              }}
            >
              {meta.traits.slice(0, 2).map((trait) => (
                <div
                  key={trait}
                  style={{
                    display: "flex",
                    padding: "6px 16px",
                    border: `1px solid ${accent}`,
                    color: accent,
                    borderRadius: 999,
                    fontSize: 18,
                    background: "rgba(253,250,244,0.7)",
                  }}
                >
                  {trait}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 28px",
                  background: "#1a1a1a",
                  color: "#fdfaf4",
                  borderRadius: 999,
                  fontSize: 22,
                  fontWeight: 500,
                }}
              >
                {cta}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: THEME.mutedForeground,
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                capybaraquiz.app
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Capy",
              data: fontData,
              style: "normal",
              weight: 400,
            },
          ]
        : undefined,
    },
  )
}
