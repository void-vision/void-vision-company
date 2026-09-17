import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { Motion } from "@/components/Motion";
import { company, getDictionary, hasLocale } from "@/content/site";
import { pageMetadata, privacyJsonLd, serializeJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const p = getDictionary(lang).privacy;
  return pageMetadata({ locale: lang, path: "/privacy", title: p.metaTitle, description: p.metaDescription, absoluteTitle: true });
}

export default async function Privacy({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const p = t.privacy;
  const other = lang === "zh" ? "en" : "zh";

  return (
    <div className="legal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(privacyJsonLd(lang)) }} />
      <Motion />
      <nav data-nav className="legal-nav" aria-label={lang === "zh" ? "页面导航" : "Page"}>
        <div data-progress className="nav-progress" aria-hidden="true" />
        <Link href={`/${lang}`} className="legal-back">← {company.name}</Link>
        <LangSwitch href={`/${other}/privacy`} target={other} label={t.nav.switchLabel} text={t.nav.switchTo} className="lang-btn" />
      </nav>

      <main id="main">
        <article>
          <header className="legal-header">
            <p className="legal-kicker">{p.kicker}</p>
            <h1>{p.title}</h1>
            <p className="legal-intro">{p.intro}</p>
            <p className="legal-meta">
              <time dateTime={p.updatedISO}>{p.updated}</time>
              <span>{p.entity}</span>
            </p>
          </header>

          <div className="legal-body">
            {p.sections.map((s) => (
              <section key={s.no} className="legal-section" aria-labelledby={`s-${s.no}`}>
                <div className="legal-heading">
                  <span aria-hidden="true">{s.no}</span>
                  <h2 id={`s-${s.no}`}>{s.h}</h2>
                </div>
                <div className="legal-paras">
                  {s.p.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </section>
            ))}

            <section className="legal-contact">
              <span>{p.contactLabel}</span>
              <a href={`mailto:${company.email}`} className="btn-outline"><span className="btn-label">{company.email}</span><span aria-hidden="true" className="btn-arrow">→</span></a>
            </section>
          </div>
        </article>
      </main>

      <footer className="legal-footer">
        <div>
          <span>{t.footer.rights}</span>
          <Link href={`/${lang}`}>{p.back}</Link>
        </div>
      </footer>
    </div>
  );
}
