import { ImageResponse } from "next/og"

import { getDictionary, isLocale } from "@/lib/i18n/dictionaries"
import { LOCALES } from "@/lib/quiz/types"
import { ACCENT_COLORS, loadDisplayFont } from "@/lib/og/palette"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const CTA_BY_LOCALE: Record<string, string> = {
  en: "Take the quiz →",
  th: "เริ่มทำควิซ →",
}

export default async function HomeOgImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : "en"
  const dict = getDictionary(locale)
  const [c1, c2] = ACCENT_COLORS["chart-2"]
  const fontData = await loadDisplayFont()
  const cta = CTA_BY_LOCALE[locale] ?? CTA_BY_LOCALE.en

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
          color: "#fffaf2",
          fontFamily: "Capy, system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            opacity: 0.92,
            letterSpacing: 1,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#fffaf2",
              marginRight: 14,
            }}
          />
          {dict.meta.siteName}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: -1,
              maxWidth: 1020,
              textShadow: "0 4px 24px rgba(20,40,30,0.18)",
            }}
          >
            {dict.meta.ogTitle}
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              opacity: 0.92,
              maxWidth: 940,
              lineHeight: 1.35,
            }}
          >
            {dict.meta.tagline}
          </div>

          <div
            style={{
              marginTop: 44,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "18px 32px",
                background: "#fffaf2",
                color: "#2d2418",
                borderRadius: 999,
                fontSize: 30,
                fontWeight: 600,
              }}
            >
              {cta}
            </div>
            <div style={{ fontSize: 26, opacity: 0.85, marginLeft: 8 }}>
              capybaraquiz.app
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
