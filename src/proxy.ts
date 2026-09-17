import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, localeCookie, locales, type Locale } from "@/content/i18n";

function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(localeCookie)?.value;
  if (saved && hasLocale(saved)) return saved;

  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (hasLocale(base)) return base;
  }
  return defaultLocale;
}

/** Every page lives under /zh or /en; bare paths are sent to the visitor's language. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if ((locales as readonly string[]).includes(first)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url, 307);
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  // Skip Next internals and any path with a file extension (images, llms.txt,
  // robots.txt, sitemap.xml, manifest) plus the generated /icon routes.
  matcher: ["/((?!_next/|icon|apple-icon|.*\\.[\\w-]+$).*)"],
};
