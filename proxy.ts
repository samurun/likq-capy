import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, type Locale } from "@/lib/quiz/types";

const LOCALE_SET = new Set<string>(LOCALES);
const DEFAULT_LOCALE: Locale = "en";
const LOCALE_HEADER = "x-locale";
const PATHNAME_HEADER = "x-pathname";

function detectLocale(req: NextRequest): Locale {
  const accept = req.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const tag = part.trim().split(";")[0].toLowerCase();
    const base = tag.split("-")[0];
    if (LOCALE_SET.has(base)) return base as Locale;
  }
  return DEFAULT_LOCALE;
}

function localeFromPath(pathname: string): Locale | null {
  const seg = pathname.split("/")[1];
  return seg && LOCALE_SET.has(seg) ? (seg as Locale) : null;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const pathLocale = localeFromPath(pathname);

  if (pathLocale) {
    const headers = new Headers(req.headers);
    headers.set(LOCALE_HEADER, pathLocale);
    headers.set(PATHNAME_HEADER, pathname);
    return NextResponse.next({ request: { headers } });
  }

  const url = req.nextUrl.clone();
  const locale = detectLocale(req);
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
