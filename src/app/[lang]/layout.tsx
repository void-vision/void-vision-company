import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { company, getDictionary, hasLocale, localeTag, locales } from "@/content/site";
import { helveticaRounded, instrumentSans, notoSansSC } from "@/lib/fonts";
import { isIndexable, siteUrl } from "@/lib/seo";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#04060c",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s · ${company.name}` },
    description: dict.meta.description,
    applicationName: company.name,
    authors: [{ name: company.legalName, url: siteUrl }],
    creator: company.legalName,
    publisher: company.legalName,
    category: "technology",
    formatDetection: { email: false, telephone: false, address: false },
    robots: isIndexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
      : { index: false, follow: false },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={localeTag[lang]}
      className={`${instrumentSans.variable} ${notoSansSC.variable} ${helveticaRounded.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <a className="skip-link" href="#main">
          {lang === "zh" ? "跳到主要内容" : "Skip to content"}
        </a>
        {children}
      </body>
    </html>
  );
}
