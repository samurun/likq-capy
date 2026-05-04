import type { Locale } from "@/lib/quiz/types"
import type { LocalizedString, LocalizedStringList } from "./types"

export function tt(localized: LocalizedString, locale: Locale): string {
  return localized[locale] ?? localized.en
}

export function ttl(localized: LocalizedStringList, locale: Locale): string[] {
  return localized[locale] ?? localized.en
}
