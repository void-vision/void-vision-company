import type { Metadata } from "next";
import {
  company,
  getDictionary,
  localeTag,
  locales,
  ogLocale,
  productUrls,
  type Locale,
} from "@/content/site";

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL in Vercel (Production) to the
 * custom domain; falls back to Vercel's production URL, then the brand domain.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://voidvision.ai")
).replace(/\/+$/, "");

/** Only the production deployment may be indexed; previews stay private. */
export const isIndexable =
  process.env.VERCEL_ENV === undefined || process.env.VERCEL_ENV === "production";

export type PagePath = "" | "/privacy";

export const absolute = (path: string) => `${siteUrl}${path}`;
export const localizedPath = (locale: Locale, path: PagePath) => `/${locale}${path}`;

export function languageAlternates(path: PagePath) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeTag[l]] = absolute(localizedPath(l, path));
  // "/" negotiates the visitor's language, so it is the x-default entry.
  languages["x-default"] = absolute(path || "/");
  return languages;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: {
  locale: Locale;
  path: PagePath;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata {
  const dict = getDictionary(locale);
  const url = absolute(localizedPath(locale, path));
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: dict.meta.keywords,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
      types: { "text/markdown": absolute("/llms-full.txt") },
    },
    openGraph: {
      type: "website",
      url,
      siteName: company.name,
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const ids = {
  org: absolute("/#organization"),
  site: absolute("/#website"),
  product: (id: string) => absolute(`/#product-${id}`),
  person: (n: number) => absolute(`/#person-${n + 1}`),
};

/** Entity graph for the home page: Organization, WebSite, products, people. */
export function homeJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  const pageUrl = absolute(localizedPath(locale, ""));
  const inLanguage = localeTag[locale];

  const organization = {
    "@type": "Organization",
    "@id": ids.org,
    name: company.name,
    legalName: company.legalName,
    url: siteUrl,
    logo: { "@type": "ImageObject", url: absolute("/images/vv-mark.png"), width: 1108, height: 340 },
    image: absolute(`/${locale}/opengraph-image`),
    description: dict.meta.description,
    slogan: dict.hero.title.join(" "),
    email: company.email,
    foundingDate: String(company.foundingYear),
    foundingLocation: { "@type": "Place", name: `${company.city}, Australia` },
    address: {
      "@type": "PostalAddress",
      addressLocality: company.city,
      addressRegion: company.region,
      addressCountry: company.country,
    },
    areaServed: "Worldwide",
    numberOfEmployees: { "@type": "QuantitativeValue", value: dict.team.members.length },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: company.email,
      availableLanguage: ["Chinese", "English"],
    },
    founder: dict.team.members.map((_, i) => ({ "@id": ids.person(i) })),
    employee: dict.team.members.map((_, i) => ({ "@id": ids.person(i) })),
    owns: dict.products.map((p) => ({ "@id": ids.product(p.id) })),
    knowsAbout: ["Artificial intelligence", "Large language models", "Recommendation systems", "Mobile apps", "Creator marketing", "International students"],
  };

  const website = {
    "@type": "WebSite",
    "@id": ids.site,
    url: siteUrl,
    name: company.name,
    publisher: { "@id": ids.org },
    inLanguage: locales.map((l) => localeTag[l]),
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: dict.meta.title,
    description: dict.meta.description,
    inLanguage,
    isPartOf: { "@id": ids.site },
    about: { "@id": ids.org },
    primaryImageOfPage: absolute(`/${locale}/opengraph-image`),
    mainEntity: { "@id": ids.org },
  };

  const products = dict.products.map((p) => {
    const base = {
      "@id": ids.product(p.id),
      name: p.name,
      alternateName: p.id === "unilinx" ? ["Unilinx", "优渡"] : undefined,
      description: `${p.tagline} ${p.description}`,
      applicationCategory: p.id === "voidbook" ? "EducationApplication" : "BusinessApplication",
      publisher: { "@id": ids.org },
      creator: { "@id": ids.org },
      screenshot: p.screens.map((s) => absolute(s.src)),
      inLanguage,
    };
    if (p.id === "voidbook") {
      return {
        ...base,
        "@type": "MobileApplication",
        operatingSystem: "iOS",
        url: productUrls.voidbook.site,
        installUrl: productUrls.voidbook.appStore,
        sameAs: [productUrls.voidbook.appStore],
      };
    }
    if (p.id === "airfluence") {
      return { ...base, "@type": "SoftwareApplication", url: productUrls.airfluence.site };
    }
    return { ...base, "@type": "SoftwareApplication", url: `${pageUrl}#${p.anchor}` };
  });

  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#products`,
    name: dict.productsHeading,
    itemListElement: dict.products.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": ids.product(p.id) } })),
  };

  const people = dict.team.members.map((m, i) => ({
    "@type": "Person",
    "@id": ids.person(i),
    name: m.name,
    alternateName: m.altName,
    jobTitle: m.jobTitle,
    description: `${m.role}. ${m.bio}`,
    image: absolute(m.image),
    worksFor: { "@id": ids.org },
    knowsAbout: m.chips,
  }));

  return { "@context": "https://schema.org", "@graph": [organization, website, webpage, itemList, ...products, ...people] };
}

export function privacyJsonLd(locale: Locale) {
  const p = getDictionary(locale).privacy;
  const url = absolute(localizedPath(locale, "/privacy"));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: p.metaTitle,
        description: p.metaDescription,
        inLanguage: localeTag[locale],
        dateModified: p.updatedISO,
        isPartOf: { "@id": ids.site },
        publisher: { "@id": ids.org },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: company.name, item: absolute(localizedPath(locale, "")) },
            { "@type": "ListItem", position: 2, name: p.kicker, item: url },
          ],
        },
      },
    ],
  };
}

/** Serialise JSON-LD safely for inline `<script>` (escapes `<`). */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
