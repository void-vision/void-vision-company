# Void Vision — website

The company site for Void Vision Pty Ltd, built with [Next.js 16](https://nextjs.org) (App Router) and [Bun](https://bun.sh), and deployed on Vercel.

## Develop

```bash
bun install
bun dev          # http://localhost:4820
bun run lint
bun run typecheck
bun test
bun run build && bun run start
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/content/site.ts` | **All copy** (zh + en): company facts, products, team, privacy policy. Edit here. |
| `src/content/i18n.ts` | Locales and public URL helpers shared by client code |
| `src/components/island-demo/` | Self-contained interactive Void Island demo with fictional data and draggable windows |
| `src/app/[lang]/` | Internal locale pages; public English routes use `/` and `/privacy`, Chinese routes use `/zh` and `/zh/privacy` |
| `src/proxy.ts` | Rewrites unprefixed routes to English; permanently redirects legacy `/en` URLs to unprefixed routes |
| `src/lib/seo.ts` | Canonical URL, hreflang, Open Graph and JSON-LD (schema.org) graph |
| `src/lib/llms.ts` | `/llms.txt` and `/llms-full.txt` for AI agents |
| `src/app/globals.css`, `src/app/decor.css` | Styles ported from the v2 design (`decor.css` holds the star and halo layers) |
| `public/images/` | Logo, phone bezel, product screenshots, team photos |

The design source material (`raw/`) is kept out of git because it includes prototypes and internal documents.

## 品牌资产

官网采用方案 03 微调定稿版的白色流动错位标志，标准黑底矢量文件为 `public/images/void-vision-logo.svg`。导航与分享图使用同路径的透明底版本；图标使用黑底白标。资产尺寸与路径统一在 `src/lib/brand.ts` 中维护，执行 `bun run brand:export` 可重新生成导出文件。

对应的几何构造图位于 `design/brand/void-vision-construction.svg`（另附 PNG），执行 `bun run brand:construction` 可从官网定稿重新生成，并校验三个连接点的切线关系。设计图保存在 `public/` 之外。

## Search engine and AI discoverability

- Every page is prerendered HTML, so all text is readable without running JavaScript. Motion is a progressive enhancement and respects `prefers-reduced-motion`.
- Language-specific URLs (`/`, `/zh`) have `<html lang>`, canonical links, and `hreflang` alternates (with `x-default` → `/`).
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
