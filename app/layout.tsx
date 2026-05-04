import { Sriracha, Geist_Mono } from "next/font/google"
import { headers } from "next/headers"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { SITE_URL } from "@/lib/site"
import { LOCALES, type Locale } from "@/lib/quiz/types"

const playpen = Sriracha({
  subsets: ["thai"],
  variable: "--font-sans",
  weight: "400",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Capybara Quiz — What Capybara Are You? Cozy Personality Test",
    template: "%s · Capybara Quiz",
  },
  description:
    "A non-linear personality quiz with a capybara mascot. Drift through 5 cozy questions and meet your inner capy.",
  applicationName: "Capybara Quiz",
  keywords: [
    "capybara",
    "personality quiz",
    "capybara quiz",
    "what capybara are you",
    "cozy quiz",
    "non-linear quiz",
  ],
  authors: [{ name: "Capybara Quiz" }],
  creator: "Capybara Quiz",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    siteName: "Capybara Quiz",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
}

function isLocale(value: string | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const h = await headers()
  const headerLocale = h.get("x-locale")
  const lang: Locale = isLocale(headerLocale) ? headerLocale : "th"

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        playpen.variable
      )}
    >
      <body className="min-h-svh bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
