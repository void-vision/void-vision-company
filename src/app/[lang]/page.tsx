import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { AirfluenceSitePreview, AirfluenceStory } from "@/components/airfluence/Airfluence";
import { IslandDemo } from "@/components/island-demo/IslandDemo";
import { MacGallery } from "@/components/MacGallery";
import { Motion } from "@/components/Motion";
import { WorkGrid, WORK_ORDER } from "@/components/home/WorkGrid";
import { company, getDictionary, getIslandDemoContent, hasLocale, localizedPath, productUrls, type Product } from "@/content/site";
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
  const ordered = WORK_ORDER.map((id) => t.products.find((p) => p.id === id)).filter((p) => p !== undefined);
  const product = (id: Product["id"]) => t.products.find((p) => p.id === id)!;
  const mail = (email: string, subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeJsonLd(lang)) }} />
      <Motion />

      <nav data-nav className="site-nav" aria-label={lang === "zh" ? "主导航" : "Main"}>
        <div data-progress className="nav-progress" aria-hidden="true" />
        <a href="#top" className="brand" aria-label={t.nav.home}>
          <Image src="/images/vv-mark.png" alt="" width={1108} height={340} className="brand-mark" priority />
          <Image src="/images/vv-wordmark.png" alt={company.name} width={1083} height={86} className="brand-word" priority />
        </a>
        <div className="nav-links">
          <a href="#products">{t.nav.products}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#team">{t.nav.team}</a>
          <LangSwitch href={localizedPath(other)} target={other} label={t.nav.switchLabel} text={t.nav.switchTo} className="lang-btn" />
          <a href="#contact" className="nav-cta">{t.nav.contact}</a>
        </div>
      </nav>

      <main id="main">
        <header id="top" className="intro">
          <div aria-hidden="true" className="intro-sky">
            <div className="stars warp warp-a" />
            <div className="stars warp warp-b" />
            <div className="stars warp warp-c" />
            <div className="stars field-twinkle" />
            <div className="stars field-out" />
          </div>
          <div className="intro-inner">
            <div className="intro-copy">
              <p className="intro-kicker enter" style={{ "--i": 1 } as CSSProperties}>{t.hero.kicker}</p>
              <h1 className="intro-title enter" style={{ "--i": 2 } as CSSProperties}>
                {t.hero.title[0]}
                {/* 中文在宽屏按设计分两行；英文句子长，交给 text-wrap: balance 均衡折行。 */}
                {lang === "zh" ? <br className="intro-break" /> : " "}
                {t.hero.title[1]}
              </h1>
              <p className="intro-sub enter" style={{ "--i": 3 } as CSSProperties}>{t.hero.sub}</p>
              <div className="intro-actions enter" style={{ "--i": 4 } as CSSProperties}>
                <a href="#products" className="pill pill-solid">{t.hero.cta} ↓</a>
              </div>
            </div>
            <nav className="intro-index enter" style={{ "--i": 5 } as CSSProperties} aria-label={t.hero.indexLabel}>
              <ul>
                {ordered.map((p) => (
                  <li key={p.id}>
                    <a href={`#${p.anchor}`}>{p.name}</a>
                    <span>
                      {p.short} · {p.platforms}
                    </span>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <section id="products" className="work" aria-labelledby="products-title">
          <div data-reveal className="section-head work-head">
            <h2 id="products-title">{t.productsHeading}</h2>
            <p>{t.productsNote}</p>
          </div>
          <WorkGrid
            products={t.products}
            labels={t.work}
            media={{ airfluence: <AirfluenceSitePreview site={t.airfluenceDemo.site} href={productUrls.airfluence.site} /> }}
            demos={{
              airfluence: <AirfluenceStory story={t.airfluenceDemo.story} screens={product("airfluence").screens} />,
              voidcalendar: <MacGallery screens={product("voidcalendar").screens} label={product("voidcalendar").name} sizes="(max-width: 1240px) 92vw, 1200px" />,
              voidisland: <IslandDemo lang={lang} content={getIslandDemoContent(lang)} />,
            }}
          />
        </section>

        <section id="about" className="about" aria-labelledby="about-title">
          <h2 id="about-title" data-reveal className="about-kicker">{t.about.kicker}</h2>
          <div data-reveal className="about-copy">
            <p className="about-body">{t.about.body}</p>
            <p className="about-founded">{t.about.founded}</p>
          </div>
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
          <div aria-hidden="true" className="contact-decor">
            <div className="contact-stars">
              <div data-zoomin className="stars contact-field" />
              <div data-zoomin className="stars contact-core" />
              <div data-zoomin className="contact-warp">
                <div className="stars warp warp-a" />
                <div className="stars warp warp-b" />
                <div className="stars warp warp-c" />
              </div>
            </div>
          </div>
          <div className="contact-copy">
            <h2 id="contact-title" data-reveal data-zoom-trigger>{t.contact.title}</h2>
            <p data-reveal className="contact-sub">{t.contact.sub}</p>
            <address data-reveal className="contact-cards">
              {t.contact.cards.map((c) => (
                <div key={c.kind} className={`contact-card contact-${c.kind}`}>
                  <span className="contact-kicker">{c.kicker}</span>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                  <div className="contact-links">
                    <a href={mail(c.email ?? company.email, c.subject)} className="contact-mail">
                      {c.email ?? company.email}
                      <span aria-hidden="true">→</span>
                    </a>
                    {c.link && (
                      <a href={c.link.href} target="_blank" rel="noopener" className="contact-site">
                        {c.link.label} ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </address>
            <div aria-hidden="true" className="contact-rule" />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span className="footer-left">
          {t.footer.rights}
          <a href={localizedPath(lang, "/privacy")}>{t.footer.privacy}</a>
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

/** 弹出层里的内容：产品介绍、演示本身、特性与“虚构数据”说明。 */
