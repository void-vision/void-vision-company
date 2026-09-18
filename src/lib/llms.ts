import { company, getDictionary, locales, productUrls, type Locale } from "@/content/site";
import { absolute, localizedPath } from "@/lib/seo";

// Plain-markdown views of the site for LLMs and AI agents (https://llmstxt.org).

const productLinks = (locale: Locale) =>
  getDictionary(locale).products.map((p) => {
    const url = p.links.find((l) => !l.href.includes("apps.apple.com"))?.href ?? absolute(`${localizedPath(locale, "")}#${p.anchor}`);
    return `- [${p.name}](${url}): ${p.tagline} ${p.description}`;
  });

export function llmsTxt() {
  const en = getDictionary("en");
  return [
    `# ${company.name}`,
    "",
    `> ${en.meta.description}`,
    "",
    `${company.legalName} is headquartered in ${company.city}, Australia (founded ${company.foundingYear}). Contact: ${company.email}. The site is bilingual: Simplified Chinese (/zh) and English (/en).`,
    "",
    "## Products",
    "",
    ...productLinks("en"),
    `- [VoidBook on the App Store](${productUrls.voidbook.appStore}): iOS download`,
    "",
    "## Pages",
    "",
    `- [Home (English)](${absolute("/en")}): company overview, products, team and contact`,
    `- [首页（中文）](${absolute("/zh")}): 公司介绍、产品、团队与联系方式`,
    `- [Website Privacy Notice](${absolute("/en/privacy")}): what this site does and does not collect, and where each product's policy lives`,
    `- [网站隐私声明](${absolute("/zh/privacy")})`,
    "",
    "## Optional",
    "",
    `- [Full site content as markdown](${absolute("/llms-full.txt")}): every page in English and Chinese`,
    "",
  ].join("\n");
}

function localeFull(locale: Locale) {
  const t = getDictionary(locale);
  const lines: string[] = [
    `# ${t.meta.title}`,
    "",
    `Source: ${absolute(localizedPath(locale, ""))}`,
    "",
    `> ${t.meta.description}`,
    "",
    t.about,
    "",
    ...t.stats.map((s) => `- ${s.label}: ${s.value}`),
    "",
    `## ${t.productsHeading}`,
    "",
  ];
  for (const p of t.products) {
    lines.push(`### ${p.name}`, "", `*${p.tagline}*`, "", p.description, "", `- ${p.category}`);
    for (const l of p.links) lines.push(`- ${l.label}: ${l.href}`);
    if (p.alias) lines.push(`- ${p.alias}`);
    if (p.status) lines.push(`- ${p.status}`);
    lines.push("");
  }
  lines.push(`## ${t.team.title}`, "", t.team.sub, "");
  for (const m of t.team.members) {
    lines.push(`### ${m.name} (${m.altName})`, "", `${m.role} — ${m.chips.join(", ")}`, "", m.bio, "");
  }
  lines.push(`## ${t.nav.contact}`, "", `${t.contact.title} ${company.email}`, "");

  const p = t.privacy;
  lines.push(`## ${p.kicker}: ${p.title}`, "", `Source: ${absolute(localizedPath(locale, "/privacy"))}`, "", p.updated, "", p.intro, "");
  for (const s of p.sections) {
    lines.push(`### ${s.no}. ${s.h}`, "", ...s.p.flatMap((para) => [para, ""]));
  }
  return lines.join("\n");
}

export function llmsFullTxt() {
  const header = [`# ${company.name} — full site content`, "", `> ${getDictionary("en").meta.description}`].join("\n");
  return [header, ...locales.map(localeFull)].join("\n\n---\n\n");
}
