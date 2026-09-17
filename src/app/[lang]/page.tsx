import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BreathSound } from "@/components/BreathSound";
import { LangSwitch } from "@/components/LangSwitch";
import { Motion } from "@/components/Motion";
import { PhoneFrame } from "@/components/PhoneFrame";
import { company, getDictionary, hasLocale } from "@/content/site";
import { homeJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata({ locale: lang, path: "", title: dict.meta.title, description: dict.meta.description, absoluteTitle: true });
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const other = lang === "zh" ? "en" : "zh";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeJsonLd(lang)) }} />
      <Motion />
      <BreathSound />

      <nav data-nav className="site-nav" aria-label={lang === "zh" ? "主导航" : "Main"}>
        <div data-progress className="nav-progress" aria-hidden="true" />
        <a href="#top" className="brand" aria-label={t.nav.home}>
          <Image src="/images/vv-mark.png" alt="" width={1108} height={340} className="brand-mark" priority />
          <Image src="/images/vv-wordmark.png" alt={company.name} width={1083} height={86} className="brand-word" priority />
        </a>
        <div className="nav-links">
          <a href="#products">{t.nav.products}</a>
          <a href="#team">{t.nav.team}</a>
          <a href="#contact">{t.nav.contact}</a>
          <LangSwitch href={`/${other}`} target={other} label={t.nav.switchLabel} text={t.nav.switchTo} className="lang-btn" />
        </div>
      </nav>

      <main id="main">
        <header id="top" className="hero">
          <div aria-hidden="true" className="hero-halo" />
          <div aria-hidden="true" className="hero-ring" />
          <div aria-hidden="true" className="hero-hole" />
          <div aria-hidden="true" className="stars warp warp-a" />
          <div aria-hidden="true" className="stars warp warp-b" />
          <div aria-hidden="true" className="stars warp warp-c" />
          <div aria-hidden="true" className="stars field-twinkle" />
          <div aria-hidden="true" className="stars field-out" />
          <div aria-hidden="true" className="stars field-in" />
          <div aria-hidden="true" className="stars field-in2" />
          <div aria-hidden="true" className="hero-fade" />
          <div className="hero-copy">
            <p className="hero-kicker enter" style={{ "--i": 1 } as CSSProperties}>{t.hero.kicker}</p>
            <h1 className="hero-title enter" style={{ "--i": 2 } as CSSProperties}>
              {t.hero.title[0]}
              <br />
              {t.hero.title[1]}
            </h1>
            {t.hero.sub && (
              <p className="hero-sub enter" style={{ "--i": 3 } as CSSProperties} lang={other}>
                {t.hero.sub[0]}
                <br />
                {t.hero.sub[1]}
              </p>
            )}
            <div className="enter hero-cta" style={{ "--i": 4 } as CSSProperties}>
              <a href="#products" className="btn-outline"><span className="btn-label">{t.hero.cta}</span><span aria-hidden="true" className="btn-arrow">→</span></a>
            </div>
          </div>
        </header>

        <section className="manifesto" aria-labelledby="about-title">
          <div className="container">
            <h2 id="about-title" className="sr-only">{lang === "zh" ? "关于 Void Vision" : "About Void Vision"}</h2>
            <p data-reveal className="manifesto-text">{t.about}</p>
            <dl data-reveal className="stats">
              {t.stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="products" aria-labelledby="products-title">
          <h2 id="products-title" className="sr-only">{t.productsHeading}</h2>
          {t.products.map((p) => (
            <article key={p.id} id={p.anchor} className={`product accent-${p.accent}`} aria-labelledby={`${p.anchor}-name`}>
              <div aria-hidden="true" className="product-glow" />
              <div data-reveal className="product-copy">
                <h3 id={`${p.anchor}-name`} className="product-name">{p.name}</h3>
                <p className="product-tag">{p.tagline}</p>
                <p className="product-desc">{p.description}</p>
                <p className="sr-only">{p.category}</p>
                <div className="product-actions">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener" className={l.primary ? "pill pill-solid" : "pill pill-outline"}>
                      {l.label}
                    </a>
                  ))}
                  {p.status && <span className="pill pill-muted">{p.status}</span>}
                </div>
              </div>
              <div data-reveal data-phones className={`phones phones-${p.screens.length}`}>
                {p.screens.map((s) => (
                  <div key={s.src} className="phone-slot">
                    <PhoneFrame screen={s} sizes={p.screens.length === 4 ? "(max-width: 900px) 168px, 238px" : "(max-width: 900px) 180px, 252px"} />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section id="team" className="team" aria-labelledby="team-title">
          <div className="container">
            <div data-reveal className="team-head">
              <h2 id="team-title">{t.team.title}</h2>
              <p>{t.team.sub}</p>
            </div>
            <ul className="team-grid">
              {t.team.members.map((m) => (
                <li key={m.name} data-reveal className="member">
                  <Image src={m.image} alt={m.name} width={264} height={264} sizes="88px" className="member-avatar" />
                  <h3 className="member-name">{m.name}</h3>
                  <p className="member-role">{m.role}</p>
                  <ul className="chips" aria-label={lang === "zh" ? "经历" : "Background"}>
                    {m.chips.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <p className="member-bio">{m.bio}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="contact" aria-labelledby="contact-title">
          <div aria-hidden="true" data-zoomin className="contact-glow" />
          <div aria-hidden="true" data-zoomin className="stars contact-field" />
          <div aria-hidden="true" data-zoomin className="stars contact-core" />
          <div aria-hidden="true" data-zoomin className="contact-warp">
            <div className="stars warp warp-a" />
            <div className="stars warp warp-b" />
            <div className="stars warp warp-c" />
          </div>
          <div className="contact-copy">
            <h2 id="contact-title" data-reveal data-zoom-trigger>{t.contact.title}</h2>
            <address data-reveal className="contact-cta">
              <a href={`mailto:${company.email}`} className="btn-outline btn-lg"><span className="btn-label">{company.email}</span><span aria-hidden="true" className="btn-arrow">→</span></a>
            </address>
            <div aria-hidden="true" className="contact-rule" />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span className="footer-left">
          {t.footer.rights}
          <a href={`/${lang}/privacy`}>{t.footer.privacy}</a>
        </span>
        <span className="footer-products">
          {t.products.map((p) =>
            p.links[0] ? (
              <a key={p.id} href={p.links.find((l) => !l.href.includes("apps.apple.com"))?.href ?? p.links[0].href} target="_blank" rel="noopener">
                {p.name}
              </a>
            ) : (
              <a key={p.id} href={`#${p.anchor}`}>{p.name}</a>
            ),
          )}
        </span>
      </footer>
    </>
  );
}
