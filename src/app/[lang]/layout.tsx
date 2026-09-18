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
        {/* Restores the scroll offset BEFORE first paint. Doing it from a React
            effect paints the top first and then jumps, which reads as a flash;
            this runs at the end of <body>, after the render-blocking CSS, so the
            document is already laid out. Motion.tsx writes the value on pagehide. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual';" +
              "var n=performance.getEntriesByType('navigation')[0];" +
              "if(!n||(n.type!=='reload'&&n.type!=='back_forward'))return;" +
              "var y=parseInt(sessionStorage.getItem('vv:scroll:'+location.pathname),10);" +
              "if(y>0)window.scrollTo({top:y,left:0,behavior:'instant'});}catch(e){}})();",
          }}
        />
      </body>
    </html>
  );
}
