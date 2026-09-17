import type { MetadataRoute } from "next";
import { getDictionary, locales } from "@/content/site";
import { absolute, languageAlternates, localizedPath, type PagePath } from "@/lib/seo";

const pages: { path: PagePath; priority: number; lastModified: string }[] = [
  { path: "", priority: 1, lastModified: "2026-09-17" },
  { path: "/privacy", priority: 0.3, lastModified: getDictionary("en").privacy.updatedISO },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({ path, priority, lastModified }) =>
    locales.map((locale) => ({
      url: absolute(localizedPath(locale, path)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: languageAlternates(path) },
      images: path === "" ? getDictionary(locale).products.flatMap((p) => p.screens.map((s) => absolute(s.src))) : undefined,
    })),
  );
}
