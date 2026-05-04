import { ImageResponse } from "next/og"

import { isLocale } from "@/lib/i18n/dictionaries"
import { LOCALES } from "@/lib/quiz/types"
import { activeTheme } from "@/lib/themes/active"
import { tt } from "@/lib/themes/i18n"
import { getOgMascot } from "@/lib/og/mascots/registry"
import { THEME, loadDisplayFont } from "@/lib/og/palette"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const CTA_BY_LOCALE: Record<string, string> = {
  en: "Start the quiz →",
  th: "เริ่มทำควิซ →",
}

export default async function HomeOgImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : "th"
  const fontData = await loadDisplayFont()
  const cta = CTA_BY_LOCALE[locale] ?? CTA_BY_LOCALE.en
  const Mascot = getOgMascot(activeTheme.mascotId)
  const siteName = tt(activeTheme.meta.siteName, locale)
  const ogTitle = tt(activeTheme.meta.ogTitle, locale)
  const tagline = tt(activeTheme.meta.tagline, locale)

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
          padding: "56px 72px",
        }}
      >
        {/* Left mascot column */}
        <div
          style={{
            width: 520,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mascot
            variant="leaf"
            expression="happy"
            accentColor="#3b8a4d"
            width={460}
          />
        </div>

        {/* Right content column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            paddingLeft: 24,
          }}
        >
          {/* Brand mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 22,
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
                background: "#3b8a4d",
                marginRight: 12,
              }}
            />
            {siteName}
          </div>

          {/* Title */}
          <div
            style={{
              marginTop: 28,
              fontSize: locale === "th" ? 52 : 60,
              lineHeight: 1.12,
              fontWeight: 500,
              letterSpacing: -0.5,
              color: THEME.foreground,
              maxWidth: 580,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {ogTitle}
          </div>

          {/* Tagline */}
          <div
            style={{
              marginTop: 22,
              fontSize: 26,
              lineHeight: 1.4,
              color: "rgba(37,37,37,0.7)",
              maxWidth: 560,
            }}
          >
            {tagline}
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "18px 32px",
                background: "#1a1a1a",
                color: "#fdfaf4",
                borderRadius: 999,
                fontSize: 26,
                fontWeight: 500,
              }}
            >
              {cta}
            </div>
            <div
              style={{
                fontSize: 20,
                color: THEME.mutedForeground,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
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
