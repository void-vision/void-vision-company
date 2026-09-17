# Void Vision — website

The company site for Void Vision Pty Ltd, built with [Next.js 16](https://nextjs.org) (App Router) and [Bun](https://bun.sh), and deployed on Vercel.

## Develop

```bash
bun install
bun dev          # http://localhost:3000
bun run lint
bun run typecheck
bun run build && bun run start
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/content/site.ts` | **All copy** (zh + en): company facts, products, team, privacy policy. Edit here. |
| `src/content/i18n.ts` | Locales and helpers shared by client code |
| `src/app/[lang]/` | Pages: home and `/privacy`, statically rendered for `/zh` and `/en` |
| `src/proxy.ts` | Sends `/` and paths without a locale to the visitor's language (cookie → `Accept-Language` → `zh`) |
| `src/lib/seo.ts` | Canonical URL, hreflang, Open Graph and JSON-LD (schema.org) graph |
| `src/lib/llms.ts` | `/llms.txt` and `/llms-full.txt` for AI agents |
| `src/app/globals.css`, `src/app/decor.css` | Styles ported from the v2 design (`decor.css` holds the star and halo layers) |
| `public/images/` | Logo, phone bezel, product screenshots, team photos |

The design source material (`raw/`) is kept out of git because it includes prototypes and internal documents.

## Search engine and AI discoverability

- Every page is prerendered HTML, so all text is readable without running JavaScript. Motion is a progressive enhancement and respects `prefers-reduced-motion`.
- Language-specific URLs (`/zh`, `/en`) have `<html lang>`, canonical links, and `hreflang` alternates (with `x-default` → `/`).
- Semantic markup: a single `h1`, a heading outline, `article`, `dl`, `address`, `time`, and descriptive `alt` text.
- JSON-LD `@graph`: `Organization`, `WebSite`, `WebPage`, `ItemList`, `MobileApplication` / `SoftwareApplication` per product, and `Person` per team member (with Chinese/English `alternateName`). The privacy page adds `BreadcrumbList`.
- `sitemap.xml` includes hreflang alternates and product screenshots. `robots.txt` explicitly allows the major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and others).
- `/llms.txt` (an index) and `/llms-full.txt` (the full bilingual content as markdown), linked from `<head>` via `rel="alternate" type="text/markdown"`.
- Each language gets a generated Open Graph image, plus a generated favicon, Apple touch icon and web manifest.
- Preview deployments (`VERCEL_ENV=preview`) are automatically `noindex` and disallowed in robots.txt; only production is indexable.

To update content, edit `src/content/site.ts`. The pages, structured data, sitemap images and llms files all update together. When the privacy policy changes, also update `updatedISO`.

## Deploy (Vercel)

1. Import the repo in Vercel. The framework is detected as Next.js, and the `bun.lock` file makes Vercel install with Bun.
2. Set `NEXT_PUBLIC_SITE_URL` (Production) to the final domain, e.g. `https://voidvision.ai`. See `.env.example`.
3. Add the custom domain. After launch, submit `https://<domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

No secrets or server-side credentials are needed; do not commit `.env*` files.
