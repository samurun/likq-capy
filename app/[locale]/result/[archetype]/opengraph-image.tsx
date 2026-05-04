import { ImageResponse } from "next/og"

import { getDictionary, isLocale } from "@/lib/i18n/dictionaries"
import { ARCHETYPES, isArchetypeId } from "@/lib/quiz/archetypes"
import { ARCHETYPE_IDS, LOCALES } from "@/lib/quiz/types"
import { ACCENT_COLORS, loadDisplayFont } from "@/lib/og/palette"

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

const HEADLINE_BY_LOCALE: Record<string, string> = {
  en: "I'm a",
  th: "ฉันคือ",
}

export default async function ResultOgImage({
  params,
}: {
  params: Promise<{ locale: string; archetype: string }>
}) {
  const { locale: rawLocale, archetype: rawArchetype } = await params
  const locale = isLocale(rawLocale) ? rawLocale : "en"
  if (!isArchetypeId(rawArchetype)) {
    return new Response("Not found", { status: 404 })
  }
  const dict = getDictionary(locale)
  const meta = dict.archetypes[rawArchetype]
  const archetype = ARCHETYPES[rawArchetype]
  const [c1, c2] = ACCENT_COLORS[archetype.accent]
  const fontData = await loadDisplayFont()
  const cta = CTA_BY_LOCALE[locale] ?? CTA_BY_LOCALE.en
  const lead = HEADLINE_BY_LOCALE[locale] ?? HEADLINE_BY_LOCALE.en

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
          color: "#fffaf2",
          fontFamily: "Capy, system-ui, sans-serif",
          padding: 56,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "rgba(255,250,242,0.96)",
            color: "#2d2418",
            borderRadius: 48,
            padding: "56px 64px",
            boxShadow: "0 24px 60px rgba(20,40,30,0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 26,
              color: c2,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: c2,
                marginRight: 12,
              }}
            />
            {dict.meta.siteName}
          </div>

          <div
            style={{
              marginTop: 16,
              fontSize: 36,
              opacity: 0.7,
            }}
          >
            {lead}
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 110,
              lineHeight: 1.02,
              fontWeight: 700,
              letterSpacing: -1.5,
              color: c2,
              maxWidth: 980,
            }}
          >
            {meta.name}
          </div>

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {meta.traits.slice(0, 3).map((trait) => (
                <div
                  key={trait}
                  style={{
                    display: "flex",
                    padding: "10px 22px",
                    border: `2px solid ${c2}`,
                    borderRadius: 999,
                    fontSize: 24,
                    color: c2,
                  }}
                >
                  {trait}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "16px 28px",
                  background: c2,
                  color: "#fffaf2",
                  borderRadius: 999,
                  fontSize: 28,
                  fontWeight: 600,
                }}
              >
                {cta}
              </div>
              <div style={{ fontSize: 22, opacity: 0.6 }}>
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
