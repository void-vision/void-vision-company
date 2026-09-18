// Single source of truth for all site copy. Pages, JSON-LD, sitemap and
// llms.txt are all generated from this file, so crawlers and AI agents see
// exactly the same facts as human visitors.

import type { Locale } from "./i18n";

export * from "./i18n";

export const company = {
  name: "Void Vision",
  legalName: "Void Vision Pty Ltd",
  email: "hello@voidvision.ai",
  foundingYear: 2026,
  city: "Sydney",
  region: "NSW",
  country: "AU",
  productCount: 3,
} as const;

export type ProductId = "voidbook" | "airfluence" | "unilinx";

export type Screen = { src: string; width: number; height: number; alt: string; bar: "auto" | "island" | "none"; tone?: string };

export type Product = {
  id: ProductId;
  /** Anchor id kept from the original design (#gb, #af, #ul). */
  anchor: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  links: { label: string; href: string; primary?: boolean }[];
  status?: string;
  /** Former name, shown next to the store links while a listing still carries it. */
  alias?: string;
  screens: Screen[];
  accent: "green" | "rose" | "cyan";
};

export type Member = {
  name: string;
  /** Name in the other language, used for `alternateName` in structured data. */
  altName: string;
  role: string;
  jobTitle: string;
  image: string;
  chips: string[];
  bio: string;
};

export type Dictionary = {
  meta: { title: string; description: string; keywords: string[]; ogAlt: string };
  nav: { products: string; team: string; contact: string; switchLabel: string; switchTo: string; home: string };
  hero: { kicker: string; title: [string, string]; sub?: [string, string]; cta: string };
  about: string;
  stats: { value: string; label: string }[];
  productsHeading: string;
  products: Product[];
  team: { title: string; sub: string; members: Member[] };
  contact: { title: string };
  footer: { rights: string; privacy: string };
  privacy: {
    metaTitle: string;
    metaDescription: string;
    kicker: string;
    title: string;
    intro: string;
    updated: string;
    updatedISO: string;
    entity: string;
    contactLabel: string;
    back: string;
    sections: { no: string; h: string; p: string[] }[];
  };
};

const W = { gb: [760, 1652], af: [804, 1748], ul: [780, 1696] } as const;

const screens = {
  voidbook: (alts: [string, string, string]): Screen[] =>
    (["gb-following.jpg", "gb-explore.jpg", "gb-summary.jpg"] as const).map((f, i) => ({
      src: `/images/screens/${f}`, width: W.gb[0], height: W.gb[1], alt: alts[i], bar: "auto",
    })),
  airfluence: (alts: [string, string, string, string]): Screen[] => [
    { src: "/images/screens/af-onboarding.png", width: W.af[0], height: W.af[1], alt: alts[0], bar: "none", tone: "#c9a29a" },
    { src: "/images/screens/af-discover.png", width: W.af[0], height: W.af[1], alt: alts[1], bar: "none" },
    { src: "/images/screens/af-profile.png", width: W.af[0], height: W.af[1], alt: alts[2], bar: "none" },
    { src: "/images/screens/af-messages.png", width: W.af[0], height: W.af[1], alt: alts[3], bar: "none", tone: "#f3efe9" },
  ],
  unilinx: (alts: [string, string, string]): Screen[] => [
    { src: "/images/screens/ul-seniors.png", width: W.ul[0], height: W.ul[1], alt: alts[0], bar: "island", tone: "#f2f3f5" },
    { src: "/images/screens/ul-home.png", width: W.ul[0], height: W.ul[1], alt: alts[1], bar: "island", tone: "#bfe4ec" },
    { src: "/images/screens/ul-tasks.png", width: W.ul[0], height: W.ul[1], alt: alts[2], bar: "island", tone: "#bfe4ec" },
  ],
};

export const productUrls = {
  voidbook: { site: "https://grainbook.app/", appStore: "https://apps.apple.com/app/grainbook/id6754638202" },
  airfluence: { site: "https://airfluence.ai/" },
} as const;

const zh: Dictionary = {
  meta: {
    title: "Void Vision · 从虚空中看见未来 | 悉尼 AI 产品公司",
    description:
      "Void Vision 是一家 2026 年成立于悉尼的 AI 产品公司，打造了 VoidBook（AI 阅读应用）、Airfluence（AI 达人与品牌合作平台）与优渡 Unilinx（留学生落地服务平台）。",
    keywords: ["Void Vision", "VoidBook", "Airfluence", "优渡", "Unilinx", "AI 阅读", "AI 摘要", "达人营销", "留学生落地服务", "悉尼 AI 公司"],
    ogAlt: "Void Vision — 从虚空中看见未来",
  },
  nav: { products: "产品", team: "团队", contact: "联系", switchLabel: "Switch to English", switchTo: "EN", home: "Void Vision 首页" },
  hero: { kicker: "Sydney · Est. 2026", title: ["从虚空中", "看见未来"], sub: ["See the unseen", "in the void"], cta: "查看产品" },
  about:
    "Void Vision 成立于 2026 年，总部位于悉尼。我们相信最好的产品诞生于空白之处——在无人涉足的地方，看见值得抵达的未来。目前已上线三款产品。",
  stats: [
    { value: "2026", label: "成立于悉尼" },
    { value: "3", label: "已上线产品" },
  ],
  productsHeading: "我们的产品",
  products: [
    {
      id: "voidbook", anchor: "gb", name: "VoidBook", accent: "green",
      tagline: "信息如海，知识成粒。",
      description: "AI 阅读应用。把你关注的每一条视频、播客与 newsletter，由 AI 浓缩成一篇三分钟的阅读。",
      category: "AI 阅读应用 · iOS",
      alias: "原 GrainBook",
      links: [
        { label: "App Store", href: productUrls.voidbook.appStore, primary: true },
        { label: "grainbook.app", href: productUrls.voidbook.site },
      ],
      screens: screens.voidbook(["VoidBook 关注信息流界面", "VoidBook 探索信息流界面", "VoidBook 视频转写与 AI 摘要阅读界面"]),
    },
    {
      id: "airfluence", anchor: "af", name: "Airfluence", accent: "rose",
      tagline: "Where influence flows through AI.",
      description: "AI 驱动的达人与品牌合作平台——智能匹配博主、管理活动排期与合作沟通、追踪数据表现，一站完成。",
      category: "AI 达人营销平台",
      links: [{ label: "airfluence.ai", href: productUrls.airfluence.site, primary: true }],
      screens: screens.airfluence(["Airfluence 登录界面", "Airfluence 博主发现与 AI 匹配界面", "Airfluence 博主主页与收益界面", "Airfluence 合作消息收件箱"]),
    },
    {
      id: "unilinx", anchor: "ul", name: "优渡 Unilinx", accent: "cyan",
      tagline: "落地无忧，有人接你。",
      description: "面向留学生的落地服务平台——新生落地无忧套餐、海外翻译与旅游陪同，由认证学长姐一对一接应，管家全程托管。",
      category: "留学生落地服务平台",
      links: [],
      screens: screens.unilinx(["优渡 Unilinx 认证学长姐大厅", "优渡 Unilinx 落地服务首页", "优渡 Unilinx 任务大厅"]),
    },
  ],
  team: {
    title: "我们是谁",
    sub: "四个人的团队，工程与研究背景横跨 Hulu、微软、华为、迪士尼、Amazon、Atlassian 与戴尔。",
    members: [
      { image: "/images/team/team-1.png", name: "龙源", altName: "Yuan Long", role: "CEO · 产品与商业化", jobTitle: "CEO", chips: ["Hulu", "蔚来", "微软", "UNSW 硕士"], bio: "具备从 0 到 1 的完整开发与商业化经验，同时是另外两个已盈利海外项目的联合创始人。" },
      { image: "/images/team/team-2.png", name: "Theo Chen", altName: "Theo Chen", role: "CTO · 全平台架构", jobTitle: "CTO", chips: ["华为", "迪士尼", "CJLU"], bio: "负责 iOS、Android、Web 与 Chrome 插件的基础架构，具备移动端与大数据经验。" },
      { image: "/images/team/team-3.png", name: "何溱扬", altName: "Zhenyang He", role: "AI · 模型与推荐", jobTitle: "AI 负责人", chips: ["Amazon", "Atlassian", "UW–Madison 博士"], bio: "现任 Amazon 应用科学家，专长模型训练与推荐算法，负责 AI 能力评估与技术路径。" },
      { image: "/images/team/team-4.png", name: "钱易宇", altName: "Yiyu Qian", role: "工程 · 数据与训练", jobTitle: "工程师", chips: ["戴尔", "RMIT 博士"], bio: "皇家墨尔本理工大学计算机博士，曾在戴尔任软件工程师，负责数据管线与模型训练相关工程。" },
    ],
  },
  contact: { title: "一起看见未来" },
  footer: { rights: "© 2026 Void Vision Pty Ltd · Sydney", privacy: "隐私政策" },
  privacy: {
    metaTitle: "网站隐私声明 · Void Vision",
    metaDescription:
      "voidvision.ai 不做统计分析、没有埋点与表单，也不向第三方发起请求。本页说明本站使用的浏览器本地存储，以及各产品隐私政策的所在位置。",
    kicker: "网站隐私声明",
    title: "这个网站如何处理你的数据",
    intro:
      "本站是 Void Vision Pty Ltd 的公司官网。它不做统计分析、没有埋点，没有表单和账号，也不向任何第三方发起请求。我们参与开发的产品各自由其运营方发布隐私政策，见第 03 节。",
    updated: "更新于 2026 年 9 月 18 日",
    updatedISO: "2026-09-18",
    entity: "Void Vision Pty Ltd · 悉尼",
    contactLabel: "隐私相关问询",
    back: "返回首页",
    sections: [
      { no: "01", h: "我们不收集什么", p: [
        "本站没有接入任何统计分析或用户行为分析服务，没有第三方埋点、像素或广告 SDK，也没有表单、注册与登录。",
        "字体与图片全部由本站自行托管，浏览页面时不会向 Google 等第三方发出请求。",
        "托管服务商在提供服务的过程中会生成标准的访问日志（通常包含 IP 地址与 User-Agent），我们不使用这些日志做分析、画像或广告。",
      ] },
      { no: "02", h: "浏览器本地存储", p: [
        "vv-locale（cookie，有效期一年）：记住你选择的语言，避免每次访问都重新判断。",
        "vv-breath 与 vv:scroll:*（sessionStorage，关闭标签页即失效）：记住开场音效是否已经播放过，以及刷新后回到你原来的滚动位置。",
        "这三项只存在于你自己的浏览器中，不会发送给我们，也不会发送给任何第三方。",
      ] },
      { no: "03", h: "产品的隐私政策", p: [
        "VoidBook（App Store 内目前显示为 GrainBook）的隐私政策：https://grainbook.app/privacy。",
        "Airfluence 与优渡 Unilinx 的隐私政策由各自的运营方发布。Void Vision 参与了这两款产品的创办与开发，但不是其运营主体，也不控制其用户数据；与这两款产品相关的隐私问题，请联系对应的运营方。",
      ] },
      { no: "04", h: "联系与变更", p: [
        "与本站有关的隐私问题，可以发邮件到 hello@voidvision.ai。",
        "本声明如有变更，我们会更新页首的日期。",
      ] },
    ],
  },
};

const en: Dictionary = {
  meta: {
    title: "Void Vision · See the unseen in the void | AI product studio in Sydney",
    description:
      "Void Vision is an AI product studio founded in Sydney in 2026. We build VoidBook (an AI reading app), Airfluence (an AI creator–brand platform) and Unilinx (arrival services for international students).",
    keywords: ["Void Vision", "VoidBook", "Airfluence", "Unilinx", "AI reading app", "AI summaries", "influencer marketing platform", "international student arrival services", "Sydney AI company"],
    ogAlt: "Void Vision — See the unseen in the void",
  },
  nav: { products: "Products", team: "Team", contact: "Contact", switchLabel: "切换到中文", switchTo: "ZH", home: "Void Vision home" },
  hero: { kicker: "Sydney · Est. 2026", title: ["See the unseen", "in the void"], sub: ["从虚空中", "看见未来"], cta: "Explore" },
  about:
    "Void Vision was founded in Sydney in 2026. We believe the best products are born in empty space — seeing a future worth reaching where no one has looked. Three products are live today.",
  stats: [
    { value: "2026", label: "Founded in Sydney" },
    { value: "3", label: "Products shipped" },
  ],
  productsHeading: "Our products",
  products: [
    {
      id: "voidbook", anchor: "gb", name: "VoidBook", accent: "green",
      tagline: "An ocean of noise. One grain of knowledge.",
      description: "An AI reading app. Every video, podcast and newsletter you follow — distilled by AI into a three-minute read.",
      category: "AI reading app · iOS",
      alias: "Formerly GrainBook",
      links: [
        { label: "App Store", href: productUrls.voidbook.appStore, primary: true },
        { label: "grainbook.app", href: productUrls.voidbook.site },
      ],
      screens: screens.voidbook(["VoidBook Following feed", "VoidBook Explore feed", "VoidBook transcript and AI summary view"]),
    },
    {
      id: "airfluence", anchor: "af", name: "Airfluence", accent: "rose",
      tagline: "Where influence flows through AI.",
      description: "An AI-powered creator–brand platform: match with the right creators, run campaigns and conversations, and track performance — all in one place.",
      category: "AI creator marketing platform",
      links: [{ label: "airfluence.ai", href: productUrls.airfluence.site, primary: true }],
      screens: screens.airfluence(["Airfluence sign-in", "Airfluence creator discovery with AI Match", "Airfluence creator profile with earnings", "Airfluence campaign inbox"]),
    },
    {
      id: "unilinx", anchor: "ul", name: "Unilinx", accent: "cyan",
      tagline: "Land softly. Someone is there for you.",
      description: "Arrival services for international students — landing packages, translation and travel companionship, delivered one-on-one by verified senior students with full concierge support.",
      category: "Arrival services for international students",
      links: [],
      screens: screens.unilinx(["Unilinx verified senior-student hall", "Unilinx arrival services home", "Unilinx task hall"]),
    },
  ],
  team: {
    title: "Who we are",
    sub: "A team of four, with engineering and research backgrounds across Hulu, Microsoft, Huawei, Disney, Amazon, Atlassian and Dell.",
    members: [
      { image: "/images/team/team-1.png", name: "Yuan Long", altName: "龙源", role: "CEO · Product & Growth", jobTitle: "CEO", chips: ["Hulu", "NIO", "Microsoft", "MSc UNSW"], bio: "End-to-end experience taking products from zero to one and to revenue; co-founder of two other profitable overseas ventures." },
      { image: "/images/team/team-2.png", name: "Theo Chen", altName: "Theo Chen", role: "CTO · Platform Architecture", jobTitle: "CTO", chips: ["Huawei", "Disney", "CJLU"], bio: "Owns the foundations across iOS, Android, Web and Chrome extensions, with a background in mobile and big data." },
      { image: "/images/team/team-3.png", name: "Zhenyang He", altName: "何溱扬", role: "AI · Models & Recommendation", jobTitle: "Head of AI", chips: ["Amazon", "Atlassian", "PhD UW–Madison"], bio: "Applied Scientist at Amazon, specialising in model training and recommendation; leads AI capability evaluation and technical direction." },
      { image: "/images/team/team-4.png", name: "Yiyu Qian", altName: "钱易宇", role: "Engineering · Data & Training", jobTitle: "Engineer", chips: ["Dell", "PhD RMIT"], bio: "PhD in Computer Science from RMIT and former software engineer at Dell; builds the data pipelines and model-training infrastructure." },
    ],
  },
  contact: { title: "See the future with us" },
  footer: { rights: "© 2026 Void Vision Pty Ltd · Sydney", privacy: "Privacy" },
  privacy: {
    metaTitle: "Website Privacy Notice · Void Vision",
    metaDescription:
      "voidvision.ai runs no analytics, no tracking and no forms, and makes no third-party requests. This page covers the browser storage the site uses and where each product's privacy policy lives.",
    kicker: "Website Privacy Notice",
    title: "How this website handles your data",
    intro:
      "This is the corporate website of Void Vision Pty Ltd. It runs no analytics, carries no tracking, has no forms or accounts, and makes no requests to third parties. The products we help build publish their own privacy policies — see section 03.",
    updated: "Updated 18 September 2026",
    updatedISO: "2026-09-18",
    entity: "Void Vision Pty Ltd · Sydney",
    contactLabel: "Privacy enquiries",
    back: "Back to home",
    sections: [
      { no: "01", h: "What we do not collect", p: [
        "This site has no analytics or behavioural tracking of any kind, no third-party pixels or advertising SDKs, and no forms, sign-up or login.",
        "Fonts and images are served from this site itself, so viewing a page makes no request to Google or any other third party.",
        "Our hosting provider generates standard access logs in the course of serving the site, typically an IP address and user agent. We do not use those logs for analytics, profiling or advertising.",
      ] },
      { no: "02", h: "Browser storage", p: [
        "vv-locale (cookie, one year): remembers the language you chose, so the site does not have to guess on every visit.",
        "vv-breath and vv:scroll:* (sessionStorage, cleared when you close the tab): remember whether the opening sound has played, and return you to your scroll position after a reload.",
        "All three live only in your own browser. They are never sent to us or to anyone else.",
      ] },
      { no: "03", h: "Product privacy policies", p: [
        "VoidBook, currently listed on the App Store as GrainBook: https://grainbook.app/privacy",
        "Airfluence and Unilinx publish their own privacy policies through their respective operators. Void Vision co-founded and helped build both products but does not operate them and does not control their user data; please direct privacy questions about those products to their operators.",
      ] },
      { no: "04", h: "Contact and changes", p: [
        "For privacy questions about this website, email hello@voidvision.ai.",
        "If this notice changes, we will update the date at the top of the page.",
      ] },
    ],
  },
};

const dictionaries: Record<Locale, Dictionary> = { zh, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
