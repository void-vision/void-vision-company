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
  userCount: "10,000+",
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
      "Void Vision 是一家 2026 年成立于悉尼的 AI 产品公司，旗下自研 VoidBook（AI 阅读应用）、Airfluence（AI 达人与品牌合作平台）与优渡 Unilinx（留学生落地服务平台），服务全球超过一万名用户。",
    keywords: ["Void Vision", "VoidBook", "Airfluence", "优渡", "Unilinx", "AI 阅读", "AI 摘要", "达人营销", "留学生落地服务", "悉尼 AI 公司"],
    ogAlt: "Void Vision — 从虚空中看见未来",
  },
  nav: { products: "产品", team: "团队", contact: "联系", switchLabel: "Switch to English", switchTo: "EN", home: "Void Vision 首页" },
  hero: { kicker: "Sydney · Est. 2026", title: ["从虚空中", "看见未来"], sub: ["See the unseen", "in the void"], cta: "查看产品" },
  about:
    "Void Vision 成立于 2026 年，总部位于悉尼。我们相信最好的产品诞生于空白之处——在无人涉足的地方，看见值得抵达的未来。目前三款自研产品服务全球超过一万名用户。",
  stats: [
    { value: "2026", label: "成立于悉尼" },
    { value: "3", label: "自研产品" },
    { value: "10,000+", label: "全球用户" },
  ],
  productsHeading: "我们的产品",
  products: [
    {
      id: "voidbook", anchor: "gb", name: "VoidBook", accent: "green",
      tagline: "信息如海，知识成粒。",
      description: "AI 阅读应用。把你关注的每一条视频、播客与 newsletter，由 AI 浓缩成一篇三分钟的阅读。",
      category: "AI 阅读应用 · iOS",
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
      status: "官网筹备中",
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
  contact: { title: "一起看见未来。" },
  footer: { rights: "© 2026 Void Vision Pty Ltd · Sydney", privacy: "隐私政策" },
  privacy: {
    metaTitle: "隐私政策 · Void Vision",
    metaDescription: "Void Vision Pty Ltd 隐私政策：说明 VoidBook、Airfluence 与优渡 Unilinx 收集哪些信息、如何使用与保存，以及你可以行使的权利。",
    kicker: "隐私政策",
    title: "我们如何处理你的数据",
    intro: "Void Vision Pty Ltd（“我们”）开发并运营 VoidBook、Airfluence 与优渡 Unilinx。本政策说明我们在提供这些产品与本网站服务时，会收集哪些信息、如何使用与保存，以及你可以行使的权利。",
    updated: "更新于 2026 年 9 月 11 日",
    updatedISO: "2026-09-11",
    entity: "Void Vision Pty Ltd · 悉尼",
    contactLabel: "隐私相关问询",
    back: "返回首页",
    sections: [
      { no: "01", h: "我们收集的信息", p: [
        "账户信息：注册与登录时提供的邮箱、昵称、头像，以及第三方登录返回的基础标识。",
        "内容与使用信息：你在产品内保存、订阅或生成的内容（例如 VoidBook 中的订阅源与摘要记录、Airfluence 中的合作与消息记录、Unilinx 中的服务需求与行程信息），以及功能使用记录。",
        "设备与日志信息：设备型号、操作系统版本、语言、崩溃日志与访问时间，用于稳定性与安全排查。",
      ] },
      { no: "02", h: "我们如何使用信息", p: [
        "提供并维持产品功能，包括内容摘要、匹配推荐、订单与服务流程。",
        "改进产品质量：分析功能使用与失败情况，修复缺陷、优化性能。",
        "沟通：发送与服务相关的通知；仅在你同意的情况下发送产品资讯。",
        "安全与合规：识别滥用行为、防范欺诈，并履行适用法律要求。",
      ] },
      { no: "03", h: "AI 处理", p: [
        "我们的产品使用第三方大模型服务生成摘要、匹配与推荐结果。相关内容会在处理过程中传输至这些服务提供方。",
        "我们不会将你的个人内容用于训练我们自有模型，除非你另行明确同意。",
      ] },
      { no: "04", h: "第三方服务", p: [
        "我们使用云托管、身份认证、支付、错误监控与统计分析等第三方服务，仅向其提供实现相应功能所必需的数据。",
        "当你通过第三方平台授权连接账号（例如内容源或社交账号）时，我们仅获取该平台在授权范围内提供的信息。",
      ] },
      { no: "05", h: "数据存储与安全", p: [
        "数据存储于位于澳大利亚及其他地区的云服务器。传输过程使用加密连接，静态数据依托云服务商的加密与访问控制机制保护。",
        "我们对内部访问实行最小必要原则，但任何系统都无法保证绝对安全。",
      ] },
      { no: "06", h: "数据保留与删除", p: [
        "账户存续期间我们保留必要数据；你注销账户后，我们将在合理期限内删除或匿名化处理，法律要求保留的除外。",
        "你可以随时通过应用内设置或联系邮箱申请删除账户与相关数据。",
      ] },
      { no: "07", h: "你的权利", p: [
        "你有权访问、更正、导出或删除你的个人信息，也可以撤回此前给予的同意。",
        "如你位于欧洲经济区、英国或其他适用地区，还可依据当地法律行使限制处理与反对处理的权利。",
      ] },
      { no: "08", h: "跨境传输", p: [
        "我们的服务面向全球用户，你的数据可能被传输至你所在国家或地区以外的服务器进行处理。我们会采取合同与技术措施，确保传输过程符合适用法律要求。",
      ] },
      { no: "09", h: "未成年人", p: [
        "我们的产品不面向 13 岁以下（或当地法律规定的更高年龄）的儿童。若我们发现在未获得监护人同意的情况下收集了相关信息，将予以删除。",
      ] },
      { no: "10", h: "政策变更", p: [
        "本政策更新时，我们会在本页面更新日期；涉及重大变更的，我们会通过应用内或邮件提示。",
      ] },
    ],
  },
};

const en: Dictionary = {
  meta: {
    title: "Void Vision · See the unseen in the void | AI product studio in Sydney",
    description:
      "Void Vision is an AI product company founded in Sydney in 2026. We build VoidBook (an AI reading app), Airfluence (an AI creator–brand platform) and Unilinx (arrival services for international students), serving more than 10,000 users worldwide.",
    keywords: ["Void Vision", "VoidBook", "Airfluence", "Unilinx", "AI reading app", "AI summaries", "influencer marketing platform", "international student arrival services", "Sydney AI company"],
    ogAlt: "Void Vision — See the unseen in the void",
  },
  nav: { products: "Products", team: "Team", contact: "Contact", switchLabel: "切换到中文", switchTo: "ZH", home: "Void Vision home" },
  hero: { kicker: "Sydney · Est. 2026", title: ["See the unseen", "in the void"], cta: "Explore" },
  about:
    "Void Vision was founded in Sydney in 2026. We believe the best products are born in empty space — seeing a future worth reaching where no one has looked. Today our three products serve more than ten thousand users worldwide.",
  stats: [
    { value: "2026", label: "Founded in Sydney" },
    { value: "3", label: "Products built" },
    { value: "10,000+", label: "Users worldwide" },
  ],
  productsHeading: "Our products",
  products: [
    {
      id: "voidbook", anchor: "gb", name: "VoidBook", accent: "green",
      tagline: "An ocean of noise. One grain of knowledge.",
      description: "An AI reading app. Every video, podcast and newsletter you follow — distilled by AI into a three-minute read.",
      category: "AI reading app · iOS",
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
      status: "Website coming soon",
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
  contact: { title: "See the future with us." },
  footer: { rights: "© 2026 Void Vision Pty Ltd · Sydney", privacy: "Privacy" },
  privacy: {
    metaTitle: "Privacy Policy · Void Vision",
    metaDescription: "Void Vision Pty Ltd privacy policy: what VoidBook, Airfluence and Unilinx collect, how it is used and stored, and the rights you can exercise.",
    kicker: "Privacy Policy",
    title: "How we handle your data",
    intro: "Void Vision Pty Ltd (“we”) builds and operates VoidBook, Airfluence and Unilinx. This policy explains what we collect when you use those products and this website, how we use and store it, and the rights you can exercise.",
    updated: "Last updated 11 September 2026",
    updatedISO: "2026-09-11",
    entity: "Void Vision Pty Ltd · Sydney",
    contactLabel: "Privacy enquiries",
    back: "Back to home",
    sections: [
      { no: "01", h: "Information we collect", p: [
        "Account information: the email, display name and avatar you provide at sign-up, plus the basic identifiers returned by third-party sign-in.",
        "Content and usage: what you save, subscribe to or generate inside the products (feeds and summaries in VoidBook, campaigns and messages in Airfluence, service requests and itineraries in Unilinx), along with records of how features are used.",
        "Device and log data: device model, OS version, language, crash logs and access times, used for stability and security investigation.",
      ] },
      { no: "02", h: "How we use information", p: [
        "To provide and maintain product functionality, including summarisation, matching and service workflows.",
        "To improve quality: analysing feature usage and failures to fix defects and tune performance.",
        "To communicate: service notices always; product news only with your consent.",
        "For safety and compliance: detecting abuse, preventing fraud and meeting legal obligations.",
      ] },
      { no: "03", h: "AI processing", p: [
        "Our products use third-party large language model services to generate summaries, matches and recommendations. The relevant content is transmitted to those providers during processing.",
        "We do not use your personal content to train our own models unless you explicitly agree.",
      ] },
      { no: "04", h: "Third-party services", p: [
        "We rely on third parties for cloud hosting, authentication, payments, error monitoring and analytics, and share only the data needed for those functions.",
        "When you connect an external account (a content source or social platform), we receive only what that platform provides within the scope you authorise.",
      ] },
      { no: "05", h: "Storage and security", p: [
        "Data is stored on cloud servers in Australia and other regions. Traffic is encrypted in transit, and data at rest is protected by our providers' encryption and access controls.",
        "Internal access follows the principle of least privilege, though no system can be guaranteed absolutely secure.",
      ] },
      { no: "06", h: "Retention and deletion", p: [
        "We keep data for as long as your account is active. After you close it, we delete or anonymise your data within a reasonable period, except where retention is legally required.",
        "You can request deletion of your account and associated data at any time, in-app or by email.",
      ] },
      { no: "07", h: "Your rights", p: [
        "You may access, correct, export or delete your personal information, and withdraw consent you previously gave.",
        "If you are in the EEA, the UK or another applicable jurisdiction, you may also restrict or object to processing under local law.",
      ] },
      { no: "08", h: "International transfers", p: [
        "Our services are used worldwide, so your data may be processed on servers outside your country. We apply contractual and technical safeguards so those transfers meet applicable legal requirements.",
      ] },
      { no: "09", h: "Children", p: [
        "Our products are not directed to children under 13, or a higher age where local law requires it. If we learn we have collected such information without guardian consent, we delete it.",
      ] },
      { no: "10", h: "Changes to this policy", p: [
        "When this policy changes we update the date on this page, and for material changes we notify you in-app or by email.",
      ] },
    ],
  },
};

const dictionaries: Record<Locale, Dictionary> = { zh, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
