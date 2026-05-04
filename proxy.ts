import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, type Locale } from "@/lib/quiz/types";

const LOCALE_SET = new Set<string>(LOCALES);
const DEFAULT_LOCALE: Locale = "th";
const LOCALE_HEADER = "x-locale";
const PATHNAME_HEADER = "x-pathname";

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

  // Always redirect to the default locale. We deliberately do not detect
  // the browser's Accept-Language — the audience is primarily Thai, and
  // users who want English can switch via the locale switcher or visit /en.
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
