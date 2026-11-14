// 全站文案的唯一来源，页面、结构化数据与 llms.txt 均从这里生成。

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
  productCount: 5,
} as const;

export type ProductId = "voidbook" | "voidcalendar" | "voidisland" | "airfluence" | "unilinx";

export type Screen = {
  src: string; width: number; height: number; alt: string; bar: "auto" | "island" | "none"; tone?: string;
  /** Tab text when a desktop product shows several shots in one window. */
  label?: string;
};

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
  logo?: string;
  features?: { title: string; description: string }[];
  connection?: string;
  screenCaption?: string;
  /** Former name, shown next to the store links while a listing still carries it. */
  alias?: string;
  screens: Screen[];
  /** 产品墙用：一句话概括、首屏目录里的短分类与平台。 */
  summary: string;
  short: string;
  platforms: string;
  /** Desktop products show one Mac window instead of a row of phones. */
  device?: "phone" | "mac";
  accent: "green" | "blue" | "rose" | "cyan";
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

/** Airfluence 展示区：官网首屏的缩略预览，以及“品牌发布 → 创作者发现 → 触达受众”的自动演示。 */
export type AirfluenceDemo = {
  site: {
    /** Accessible name of the whole preview, which links to the live site. */
    label: string;
    open: string;
    langSwitch: string;
    chips: [string, string, string];
    headlines: string[];
    lede: string;
    actions: [string, string];
    fine: string;
    links: string[];
    film: string;
    play: string;
  };
  story: {
    label: string;
    eyebrow: string;
    stages: { label: string; line: string }[];
    captions: [string, string, string];
    reach: { kicker: string; title: [string, string]; note: string; alt: string };
  };
};

export type Dictionary = {
  meta: { title: string; description: string; keywords: string[]; ogAlt: string };
  nav: { products: string; about: string; team: string; contact: string; switchLabel: string; switchTo: string; home: string };
  /** 首屏标题就是公司使命。 */
  hero: { kicker: string; title: [string, string]; sub: string; cta: string; indexLabel: string };
  about: { kicker: string; body: string; founded: string };
  productsHeading: string;
  productsNote: string;
  work: { demo: string; close: string; demoNote: string };
  products: Product[];
  airfluenceDemo: AirfluenceDemo;
  team: { title: string; sub: string; members: Member[] };
  contact: {
    title: string;
    sub: string;
    /** `email` 不填时用公司邮箱；营销合作直接发到 Airfluence。 */
    cards: { kind: "business" | "marketing"; kicker: string; title: string; body: string; subject: string; email?: string; link?: { label: string; href: string } }[];
  };
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

const W = { ul: [780, 1696] } as const;

const screens = {
  voidisland: (locale: Locale, shots: [label: string, alt: string][]): Screen[] =>
    (["ai", "git", "awake"] as const).map((scene, i) => ({
      src: `/images/screens/void-island-${scene}-${locale}.webp`,
      width: 1200, height: 690, label: shots[i][0], alt: shots[i][1], bar: "none",
    })),
  voidcalendar: (locale: Locale, shots: [label: string, alt: string][]): Screen[] =>
    (["tasks", "canvas", "calendar", "project"] as const).map((scene, i) => ({
      src: `/images/screens/voido-demo-${scene}-${locale}.webp`,
      width: 2880,
      height: 1800,
      label: shots[i][0],
      alt: shots[i][1],
      bar: "none",
    })),
  // 两张图本身带手机外框，作品墙里直接叠放展示。
  voidbook: (alts: [string, string]): Screen[] =>
    (["voidbook-following.webp", "voidbook-transcript.webp"] as const).map((f, i) => ({
      src: `/images/screens/${f}`, width: 590, height: 1223, alt: alts[i], bar: "none",
    })),
  // 前五张是品牌端发布活动的连续步骤，最后一张是创作者端的发现页，顺序即演示顺序。
  airfluence: (locale: Locale, alts: [string, string, string, string, string, string]): Screen[] =>
    (["publish-brief", "publish-budget", "publish-schedule", "publish-preview", "brand-real-campaigns", "creator-real-campaigns"] as const).map((scene, i) => ({
      src: `/images/airfluence/screens/${scene}-${locale}.webp`, width: 720, height: 1566, alt: alts[i], bar: "none",
    })),
  unilinx: (alts: [string, string, string]): Screen[] => [
    { src: "/images/screens/ul-seniors.png", width: W.ul[0], height: W.ul[1], alt: alts[0], bar: "island", tone: "#f2f3f5" },
    { src: "/images/screens/ul-home.png", width: W.ul[0], height: W.ul[1], alt: alts[1], bar: "island", tone: "#bfe4ec" },
    { src: "/images/screens/ul-tasks.png", width: W.ul[0], height: W.ul[1], alt: alts[2], bar: "island", tone: "#bfe4ec" },
  ],
};

export const productUrls = {
  voidbook: { site: "https://grainbook.app/", appStore: "https://apps.apple.com/app/grainbook/id6754638202" },
  voidcalendar: {
    site: { zh: "https://voido.ai/", en: "https://voido.ai/en" },
    repo: "https://github.com/void-vision/void-calendar-website",
  },
  voidisland: {
    site: { zh: "https://voidisland.app/zh", en: "https://voidisland.app/" },
    repo: "https://github.com/void-vision/void-island",
    community: "https://discord.gg/Z3fh88qHwN",
  },
  airfluence: { site: "https://airfluence.ai/" },
} as const;

/** airfluence.ai 英文首页的文案，中英文两页的预览共用。 */
const airfluenceSiteEn: AirfluenceDemo["site"] = {
  label: "Preview of the Airfluence homepage. Opens airfluence.ai",
  open: "Visit site",
  langSwitch: "中文",
  chips: ["Across the Globe", "Instagram", "Xiaohongshu"],
  headlines: ["Where Influence Flows Through AI", "Find creators. Build trust", "Your Story, Beyond Borders", "One Platform. From Match to Post"],
  lede: "Airfluence AI finds the creators your audience already trusts, briefs them in their own culture, and tracks every post from booking to results.",
  actions: ["I'm a brand", "I'm a creator"],
  fine: "For brands, agencies and creators around the world.",
  links: ["How it works", "Product tour", "Case studies", "Campaigns", "Contact"],
  film: "Grand Talon creator night",
  play: "Play with sound",
};

const zh: Dictionary = {
  meta: {
    title: "Void Vision · 让智能在使用中生长 | RSI",
    description:
      "Void Vision 是悉尼的 AI 产品公司，把 AI 做进人们每天真正在用的产品里。我们的产品包括达人营销平台 Airfluence、AI 日历 Voido、Mac 刘海里的 Void Island、知识库 VoidBook 与留学生服务平台优渡 Unilinx。",
    keywords: ["Void Vision", "VoidBook", "Voido", "Void Island", "Airfluence", "优渡", "Unilinx", "RSI", "递归自我改进", "知识库", "信息聚合", "AI 笔记", "AI 日历", "时间盒", "达人营销", "留学生落地服务", "悉尼 AI 公司"],
    ogAlt: "Void Vision — 把 AI 做进人们每天真正在用的产品里",
  },
  nav: { products: "产品", about: "关于", team: "团队", contact: "联系我们", switchLabel: "Switch to English", switchTo: "EN", home: "Void Vision 首页" },
  hero: {
    kicker: "AI 产品公司 · 悉尼",
    title: ["把 AI 做进人们每天", "真正在用的产品里。"],
    sub: "Void Vision 是悉尼的 AI 产品公司。我们做知识库、AI 日历和 Mac 工具，也做达人营销与留学生服务。",
    cta: "看看我们的产品",
    indexLabel: "产品目录",
  },
  about: {
    kicker: "我们相信",
    body: "智能应该在使用中生长。Void Vision 致力于推动 AI 在真实工作中递归自我改进（RSI）：从信息与反馈中学习，持续改进自己的工作方法。",
    founded: "成立于悉尼 · 2026",
  },
  productsHeading: "我们的产品",
  productsNote: "覆盖 iOS、Android、Web 与 macOS · 团队有亿级用户规模的项目经验",
  work: { demo: "看演示", close: "关闭演示", demoNote: "演示使用虚构数据。" },
  products: [
    {
      id: "voidbook", anchor: "gb", name: "VoidBook", accent: "green",
      tagline: "自带信息聚合功能的知识库。",
      summary: "播客、视频与 newsletter 汇成一个信息流，AI 给出摘要和逐字稿。",
      short: "知识库",
      platforms: "iOS",
      description: "将你关注的视频、播客与 newsletter 汇集到自己的知识库，与笔记一起管理。用 AI 辅助理解、筛选和整理，在积累的内容上继续思考与创作，形成自己的观点、文章和方案。",
      category: "知识库 · 信息聚合 · AI 笔记 · iOS",
      alias: "原 GrainBook",
      links: [
        { label: "App Store", href: productUrls.voidbook.appStore, primary: true },
        { label: "grainbook.app", href: productUrls.voidbook.site },
      ],
      screens: screens.voidbook(["VoidBook 关注页：播客、视频等来源汇成一个信息流", "VoidBook 视频页：逐字稿与 AI 摘要"]),
    },
    {
      id: "voidcalendar", anchor: "vc", name: "Voido", accent: "blue", device: "mac",
      logo: "/images/voido.png",
      tagline: "把想法安排进时间。",
      summary: "日程、任务、笔记与 AI 放在一起。交给 AI 的任务在列表里看得到进度，结果写回旁边的对话。",
      short: "AI 日历与任务",
      platforms: "macOS",
      description: "Mac 上的 AI 日历与时间盒应用，把日程、任务、笔记与专注放在一起。告诉 AI 要做什么，它会避开已有日程，把事情放进真正空着的时间；连接 Apple 日历、iCloud、Google 和 Outlook。",
      category: "AI 日历 · 时间盒 · macOS",
      status: "免费公开测试版",
      links: [{ label: "voido.ai", href: productUrls.voidcalendar.site.zh, primary: true }],
      screens: screens.voidcalendar("zh", [
        ["任务与 AI", "Voido 任务列表：进行中、待验收和待办的任务带着项目与 AI 状态，右侧 AI 面板给出竞品定价调研的结论（虚构数据）"],
        ["画布", "Voido 画布：从发布目标出发，把调研、开发和测试任务连成一条发布流程（虚构数据）"],
        ["AI 日历", "Voido 周视图：站会、开发任务和访谈排在一周的时间块里（虚构数据）"],
        ["项目", "Voido 项目页：Nova 2.0 发布的里程碑、本周进展和 AI 自动更新（虚构数据）"],
      ]),
    },
    {
      id: "voidisland", anchor: "island", name: "Void Island", accent: "blue", device: "mac",
      logo: "/images/void-island.png",
      tagline: "AI 在工作，你继续专注。",
      summary: "Claude、Codex 与 Cursor 的会话、授权和提问，收进 Mac 刘海。",
      short: "AI 会话工作流",
      platforms: "macOS",
      description: "把 Claude、Codex 和 Cursor 的会话状态、授权与提问，收进 Mac 顶部的刘海。少找一个窗口，多留一点思路。原生 macOS 应用，可独立运行。",
      category: "AI 会话工作流 · Git · 保持唤醒 · macOS",
      features: [
        { title: "AI 会话", description: "观察进度、处理授权与提问，需要时返回对应的原应用。" },
        { title: "Git", description: "在小岛里查看分支、文件改动与提交记录。" },
        { title: "保持唤醒", description: "需要时让 Mac 保持唤醒，工作结束后再停下。" },
      ],
      connection: "内置三种插件，无需 Voido 也可使用；连接 Voido 后，还可扩展日历、笔记与专注工作流。",
      links: [
        { label: "探索 Void Island", href: productUrls.voidisland.site.zh, primary: true },
        { label: "GitHub", href: productUrls.voidisland.repo },
        { label: "Discord 社区", href: productUrls.voidisland.community },
      ],
      screenCaption: "产品官网演示 · 使用虚构数据，展示 AI 授权、Git 与保持唤醒界面。",
      screens: screens.voidisland("zh", [
        ["AI 会话", "Void Island 示例：在刘海小岛中查看 AI 会话状态并处理读取文件的授权"],
        ["Git 改动", "Void Island 示例：查看虚构项目的分支、暂存文件与更改列表"],
        ["保持唤醒", "Void Island 示例：保持唤醒的时长、结束条件与自动规则界面"],
      ]),
    },
    {
      id: "airfluence", anchor: "af", name: "Airfluence", accent: "rose",
      tagline: "Where influence flows through AI.",
      summary: "智能匹配博主、管理活动排期与合作沟通、追踪数据表现。",
      short: "达人营销",
      platforms: "iOS / Android / Web",
      description: "AI 驱动的达人与品牌合作平台——智能匹配博主、管理活动排期与合作沟通、追踪数据表现，一站完成。",
      category: "AI 达人营销平台",
      links: [{ label: "airfluence.ai", href: productUrls.airfluence.site, primary: true }],
      screens: screens.airfluence("zh", ["Airfluence 品牌端：填写活动说明", "Airfluence 品牌端：设置预算", "Airfluence 品牌端：安排日程", "Airfluence 品牌端：预览并发布活动", "Airfluence 品牌端：活动列表", "Airfluence 创作者端：发现合作活动"]),
    },
    {
      id: "unilinx", anchor: "ul", name: "优渡 Unilinx", accent: "cyan",
      tagline: "落地无忧，有人接你。",
      summary: "新生落地套餐、海外翻译与旅游陪同，由认证学长姐一对一接应。",
      short: "留学生服务",
      platforms: "手机 App",
      description: "面向留学生的落地服务平台——新生落地无忧套餐、海外翻译与旅游陪同，由认证学长姐一对一接应，管家全程托管。",
      category: "留学生落地服务平台",
      links: [],
      screens: screens.unilinx(["优渡 Unilinx 认证学长姐大厅", "优渡 Unilinx 落地服务首页", "优渡 Unilinx 任务大厅"]),
    },
  ],
  airfluenceDemo: {
    // 预览画的是 airfluence.ai 的英文首页，中文页也照原样显示英文；只有窗口按钮和读屏名称用中文。
    site: { ...airfluenceSiteEn, label: "Airfluence 官网首页预览，点击访问 airfluence.ai", open: "访问官网" },
    story: {
      label: "Airfluence 合作流程演示",
      eyebrow: "一次合作的传播过程",
      stages: [
        { label: "品牌发布活动", line: "故事，从你的品牌开始。" },
        { label: "创作者发现并创作", line: "创作者发现合作，用自己的方式讲述。" },
        { label: "内容触达更广泛的受众", line: "他们的内容，让更多人看见你的品牌。" },
      ],
      captions: ["品牌发布", "创作者发现", "更广泛的受众"],
      reach: { kicker: "让内容传播", title: ["一次活动。", "无数次连接。"], note: "受众传播示意", alt: "创作者内容触达更多人的传播示意" },
    },
  },
  team: {
    title: "我们是谁",
    sub: "三个人的团队，工程与研究背景横跨 Hulu、微软、华为、迪士尼、Amazon 与 Atlassian。",
    members: [
      { image: "/images/team/team-1.png", name: "龙源", altName: "Yuan Long", role: "CEO · 产品与商业化", jobTitle: "CEO", chips: ["Hulu", "蔚来", "微软", "UNSW 硕士"], bio: "具备从 0 到 1 的完整产品开发与商业化经验，曾参与亿万级用户项目。注重用户体验研究，兼具审美判断与交互设计思维。" },
      { image: "/images/team/team-2.png", name: "Theo Chen", altName: "Theo Chen", role: "CTO · 全平台架构", jobTitle: "CTO", chips: ["华为", "迪士尼", "CJLU"], bio: "曾参与亿万级用户流媒体项目，具备复杂系统架构、移动端与大数据工程经验。负责 iOS、Android、Web 与 Chrome 插件的全平台架构，兼顾系统性能、稳定性与扩展能力。" },
      { image: "/images/team/team-3.png", name: "何溱扬", altName: "Zhenyang He", role: "AI · 模型与推荐", jobTitle: "AI 负责人", chips: ["Amazon", "Atlassian", "UW–Madison 博士"], bio: "威斯康星大学麦迪逊分校博士，现任 Amazon 应用科学家。专长模型训练与推荐算法，负责 AI 技术路线与能力评估，推动研究成果转化为实际产品能力。" },
    ],
  },
  contact: {
    title: "一起看见未来",
    sub: "投资、合作、媒体，或者想用 Airfluence 做一次推广，都可以写信给我们。",
    cards: [
      { kind: "business", kicker: "商务合作", title: "投资、产品合作与媒体", body: "想了解我们在做的事，或者有合作的想法，直接写信给我们。", subject: "商务合作" },
      { kind: "marketing", kicker: "营销合作", title: "让创作者讲你的品牌故事", body: "通过 Airfluence 匹配小红书、Instagram 等平台的创作者，从发布活动到追踪内容表现。", subject: "营销合作", email: "hello@airfluence.ai", link: { label: "airfluence.ai", href: productUrls.airfluence.site } },
    ],
  },
  footer: { rights: "© 2026 Void Vision Pty Ltd · Sydney", privacy: "隐私政策" },
  privacy: {
    metaTitle: "网站隐私声明 · Void Vision",
    metaDescription:
      "voidvision.ai 不做统计分析、没有埋点与表单，也不向第三方发起请求。本页说明本站使用的浏览器本地存储，以及各产品隐私政策的所在位置。",
    kicker: "网站隐私声明",
    title: "这个网站如何处理你的数据",
    intro:
      "本站是 Void Vision Pty Ltd 的公司官网。它不做统计分析、没有埋点，没有表单和账号，也不向任何第三方发起请求。各款产品的隐私政策见第 03 节。",
    updated: "更新于 2026 年 11 月 15 日",
    updatedISO: "2026-11-15",
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
        "为了让你刷新后回到原来的位置，本站会在浏览器的 sessionStorage 里记下滚动位置（键名 vv:scroll:）。关闭标签页即清除，不会发送给服务器。",
        "页面语言由网址决定。本站不设置任何 cookie。",
      ] },
      { no: "03", h: "产品的隐私政策", p: [
        "VoidBook（App Store 内目前显示为 GrainBook）的隐私政策：https://grainbook.app/privacy。",
        "Voido 的隐私政策：https://voido.ai/privacy。",
        "Airfluence 的隐私政策：https://www.airfluence.ai/privacy/。",
        "优渡 Unilinx 的隐私政策以产品内公布的为准。",
        "Void Island 目前还没有单独的隐私政策页面，相关问题请发邮件到 hello@voidvision.ai。",
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
    title: "Void Vision · Intelligence that grows through use | RSI",
    description:
      "Void Vision is an AI product company in Sydney that puts AI into the products people actually use every day. Our products include the Airfluence influencer platform, the Voido AI calendar, Void Island in the Mac notch, the VoidBook knowledge base and the Unilinx student services platform.",
    keywords: ["Void Vision", "VoidBook", "Voido", "Void Island", "Airfluence", "Unilinx", "RSI", "recursive self-improvement", "knowledge base", "content aggregation", "AI notes", "AI calendar", "time blocking", "influencer marketing platform", "international student arrival services", "Sydney AI company"],
    ogAlt: "Void Vision — Put AI into the products people actually use every day.",
  },
  nav: { products: "Products", about: "About", team: "Team", contact: "Contact", switchLabel: "切换到中文", switchTo: "ZH", home: "Void Vision home" },
  hero: {
    kicker: "AI product company · Sydney",
    title: ["Put AI into the products", "people actually use every day."],
    sub: "Void Vision is an AI product company in Sydney. We make a knowledge base, an AI calendar and Mac tools, plus influencer marketing and student services.",
    cta: "See our products",
    indexLabel: "Our products",
  },
  about: {
    kicker: "What we believe",
    body: "Intelligence should grow through use. Void Vision pursues recursive self-improvement (RSI) through real work: AI that learns from information and feedback to continually improve how it works.",
    founded: "Founded in Sydney · 2026",
  },
  productsHeading: "Our products",
  productsNote: "Across iOS, Android, web and macOS · The team has worked on products used by hundreds of millions of people",
  work: { demo: "See it in action", close: "Close demo", demoNote: "Demos use sample data." },
  products: [
    {
      id: "voidbook", anchor: "gb", name: "VoidBook", accent: "green",
      tagline: "A knowledge base with built-in content aggregation.",
      summary: "Podcasts, videos and newsletters in one feed, with AI summaries and transcripts.",
      short: "Knowledge base",
      platforms: "iOS",
      description: "Bring the videos, podcasts and newsletters you follow into your own knowledge base, alongside your notes. Use AI to understand, filter and organise your content, then build on what you have gathered to develop your own perspectives, articles and plans.",
      category: "Knowledge base · Content aggregation · AI notes · iOS",
      alias: "Formerly GrainBook",
      links: [
        { label: "App Store", href: productUrls.voidbook.appStore, primary: true },
        { label: "grainbook.app", href: productUrls.voidbook.site },
      ],
      screens: screens.voidbook(["VoidBook Following: podcasts, videos and other sources in one feed", "VoidBook video page with transcript and AI summary"]),
    },
    {
      id: "voidcalendar", anchor: "vc", name: "Voido", accent: "blue", device: "mac",
      logo: "/images/voido.png",
      tagline: "Turn ideas into time.",
      summary: "Calendar, tasks, notes and AI in one place. Tasks handed to AI show their progress in the list, and results land in the chat beside it.",
      short: "AI calendar & tasks",
      platforms: "macOS",
      description: "An AI calendar and time-blocking app for Mac that brings events, tasks, notes and focus together. Tell the AI what needs doing and it plans around your existing events, into time that is genuinely free. Works with Apple Calendar, iCloud, Google and Outlook.",
      category: "AI calendar · Time blocking · macOS",
      status: "Free public beta",
      links: [{ label: "voido.ai", href: productUrls.voidcalendar.site.en, primary: true }],
      screens: screens.voidcalendar("en", [
        ["Tasks & AI", "Voido task list with in-progress, in-review and to-do tasks carrying project and AI status, and the AI panel summarising a pricing study (sample data)"],
        ["Canvas", "Voido canvas linking research, build and test tasks from a launch goal into one release flow (sample data)"],
        ["AI calendar", "Voido week view with stand-ups, build tasks and interviews in time blocks (sample data)"],
        ["Projects", "Voido project page for the Nova 2.0 launch with milestones, this week's progress and AI updates (sample data)"],
      ]),
    },
    {
      id: "voidisland", anchor: "island", name: "Void Island", accent: "blue", device: "mac",
      logo: "/images/void-island.png",
      tagline: "AI is working. Stay in your flow.",
      summary: "Claude, Codex and Cursor sessions, approvals and questions, in the Mac notch.",
      short: "AI session workflow",
      platforms: "macOS",
      description: "Bring Claude, Codex and Cursor session status, approvals and questions into your Mac’s notch. Fewer windows. More room to think. A native macOS app that runs on its own.",
      category: "AI session workflows · Git · Keep awake · macOS",
      features: [
        { title: "AI sessions", description: "Follow progress, handle approvals and questions, then return to the original app." },
        { title: "Git", description: "See your branch, changed files and commits from the island." },
        { title: "Keep awake", description: "Keep your Mac awake when you need it. Stop when the work is done." },
      ],
      connection: "Use all three built-in plugins without Voido. Connect Voido to add calendar, notes and focus workflows.",
      links: [
        { label: "Explore Void Island", href: productUrls.voidisland.site.en, primary: true },
        { label: "GitHub", href: productUrls.voidisland.repo },
        { label: "Discord community", href: productUrls.voidisland.community },
      ],
      screenCaption: "Product website demo · Fictional data showing AI approvals, Git and keep-awake controls.",
      screens: screens.voidisland("en", [
        ["AI sessions", "Void Island demo: AI session status and a file-read approval in the Mac’s notch"],
        ["Git changes", "Void Island demo: branch, staged files and changes in a fictional project"],
        ["Keep awake", "Void Island demo: keep-awake durations, end conditions and automatic rules"],
      ]),
    },
    {
      id: "airfluence", anchor: "af", name: "Airfluence", accent: "rose",
      tagline: "Where influence flows through AI.",
      summary: "Matches brands with creators, runs campaign schedules and conversations, and tracks results.",
      short: "Influencer marketing",
      platforms: "iOS / Android / Web",
      description: "An AI-powered creator–brand platform: match with the right creators, run campaigns and conversations, and track performance — all in one place.",
      category: "AI creator marketing platform",
      links: [{ label: "airfluence.ai", href: productUrls.airfluence.site, primary: true }],
      screens: screens.airfluence("en", ["Airfluence brand app: campaign brief", "Airfluence brand app: budget", "Airfluence brand app: schedule", "Airfluence brand app: preview and publish", "Airfluence brand app: campaign list", "Airfluence creator app: discover campaigns"]),
    },
    {
      id: "unilinx", anchor: "ul", name: "Unilinx", accent: "cyan",
      tagline: "Land softly. Someone is there for you.",
      summary: "Arrival packages, translation and travel companions for international students, with verified senior students on hand.",
      short: "Student services",
      platforms: "Mobile app",
      description: "Arrival services for international students — landing packages, translation and travel companionship, delivered one-on-one by verified senior students with full concierge support.",
      category: "Arrival services for international students",
      links: [],
      screens: screens.unilinx(["Unilinx verified senior-student hall", "Unilinx arrival services home", "Unilinx task hall"]),
    },
  ],
  airfluenceDemo: {
    site: airfluenceSiteEn,
    story: {
      label: "Airfluence collaboration walkthrough",
      eyebrow: "How one campaign travels",
      stages: [
        { label: "Brands publish a campaign", line: "Your brand starts the story." },
        { label: "Creators discover & create", line: "Creators discover it and make it their own." },
        { label: "Content reaches a wider audience", line: "Their content reaches a wider audience." },
      ],
      captions: ["Brand publishes", "Creators discover", "The wider audience"],
      reach: { kicker: "Content travels", title: ["One campaign.", "Many conversations."], note: "Audience illustration", alt: "Illustration of creator content reaching a wider audience" },
    },
  },
  team: {
    title: "Who we are",
    sub: "A team of three, with engineering and research backgrounds across Hulu, Microsoft, Huawei, Disney, Amazon and Atlassian.",
    members: [
      { image: "/images/team/team-1.png", name: "Yuan Long", altName: "龙源", role: "CEO · Product & Growth", jobTitle: "CEO", chips: ["Hulu", "NIO", "Microsoft", "MSc UNSW"], bio: "End-to-end experience in product development and commercialisation, from zero to one, with contributions to projects serving hundreds of millions of users. Brings a focus on user experience research, a discerning eye for aesthetics and a thoughtful approach to interaction design." },
      { image: "/images/team/team-2.png", name: "Theo Chen", altName: "Theo Chen", role: "CTO · Platform Architecture", jobTitle: "CTO", chips: ["Huawei", "Disney", "CJLU"], bio: "Contributed to streaming projects serving hundreds of millions of users, with experience in complex system architecture, mobile development and big data engineering. Leads architecture across iOS, Android, Web and Chrome extensions, balancing performance, reliability and scalability." },
      { image: "/images/team/team-3.png", name: "Zhenyang He", altName: "何溱扬", role: "AI · Models & Recommendation", jobTitle: "Head of AI", chips: ["Amazon", "Atlassian", "PhD UW–Madison"], bio: "PhD from the University of Wisconsin–Madison and currently an Applied Scientist at Amazon. Specialises in model training and recommendation algorithms, leading AI technical direction and capability evaluation to turn research into practical product capabilities." },
    ],
  },
  contact: {
    title: "See the future with us",
    sub: "Investment, partnerships, press, or a campaign with Airfluence: write to us.",
    cards: [
      { kind: "business", kicker: "Business", title: "Investment, partnerships and press", body: "Want to know what we're working on, or have an idea to explore together? Write to us.", subject: "Business enquiry" },
      { kind: "marketing", kicker: "Marketing", title: "Let creators tell your brand's story", body: "Through Airfluence we match creators on Xiaohongshu, Instagram and more, from publishing the campaign to tracking how the content performs.", subject: "Marketing enquiry", email: "hello@airfluence.ai", link: { label: "airfluence.ai", href: productUrls.airfluence.site } },
    ],
  },
  footer: { rights: "© 2026 Void Vision Pty Ltd · Sydney", privacy: "Privacy" },
  privacy: {
    metaTitle: "Website Privacy Notice · Void Vision",
    metaDescription:
      "voidvision.ai runs no analytics, no tracking and no forms, and makes no third-party requests. This page covers the browser storage the site uses and where each product's privacy policy lives.",
    kicker: "Website Privacy Notice",
    title: "How this website handles your data",
    intro:
      "This is the corporate website of Void Vision Pty Ltd. It runs no analytics, carries no tracking, has no forms or accounts, and makes no requests to third parties. Each product's privacy policy is listed in section 03.",
    updated: "Updated 15 November 2026",
    updatedISO: "2026-11-15",
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
        "To bring you back to where you were after a reload, the site remembers your scroll position in your browser's sessionStorage (key vv:scroll:). It is cleared when you close the tab and is never sent to our server.",
        "The URL determines the page language. This site sets no cookies.",
      ] },
      { no: "03", h: "Product privacy policies", p: [
        "VoidBook, currently listed on the App Store as GrainBook: https://grainbook.app/privacy",
        "Voido: https://voido.ai/en/privacy",
        "Airfluence: https://www.airfluence.ai/privacy/",
        "Unilinx publishes its privacy policy in the product.",
        "Void Island does not have a separate privacy policy page yet; please email privacy questions to hello@voidvision.ai.",
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

// 互动演示与产品官网使用同一组虚构数据；由服务端只传递当前语言。
const islandDemoTexts: Record<Locale, Record<string,string>> = {
  "zh": {
    "d001": "处理中",
    "d002": "等待授权",
    "d003": "等待回答",
    "d004": "等待输入",
    "d005": "刚刚",
    "d006": "6 分钟",
    "d007": "你：",
    "d008": ":",
    "d009": "请求已拒绝，等待你的新指令。",
    "d010": "已允许读取示例文件，继续整理。",
    "d011": "展开 {v0} 示例会话",
    "d012": "AI 会话",
    "d013": "观察",
    "d014": "审批",
    "d015": "提问",
    "d016": "返回",
    "d017": "整理产品说明",
    "d018": "检查实际截图",
    "d019": "先保留当前结果",
    "d020": "1 小时",
    "d021": "3 小时",
    "d022": "一直",
    "d023": "一直",
    "d024": "Void Island 互动演示",
    "d025": "LIVE PLAYGROUND / ",
    "d026": "交互示例",
    "d027": "移到顶部小岛，体验一下",
    "d028": "Mac演示，窄屏可横向滚动",
    "d029": "Void Island 小岛示例",
    "d030": "AI 会话",
    "d031": "{v0}",
    "d032": "新建会话入口示意",
    "d033": "收起用量",
    "d034": "保持唤醒",
    "d035": "Git 改动",
    "d036": "切换演示声音图标",
    "d037": "只切换图标，不播放声音",
    "d038": "演示设置",
    "d039": "Git 改动",
    "d040": "保持唤醒",
    "d041": "读取项目文件",
    "d042": "Read · README.md",
    "d043": "是否允许读取当前项目的产品说明？",
    "d044": "请求已拒绝，等待你的新指令。",
    "d045": "已允许这一次，继续处理。",
    "d046": "允许一次",
    "d047": "拒绝",
    "d048": "下一步先做什么？",
    "d049": "已选择：",
    "d050": "展开小岛示例",
    "d051": "个 AI 会话",
    "d052": "停止保持唤醒",
    "d053": "保持唤醒",
    "d054": "Git 改动",
    "d055": "保持唤醒已开启",
    "d056": "保持唤醒已关闭",
    "d057": "保持唤醒设置",
    "d058": "移动设置窗口",
    "d059": "关闭演示设置",
    "d060": "Void Island · ",
    "d061": "设置",
    "d062": "保持唤醒",
    "d063": "高级模式",
    "d064": "关闭时，点击咖啡即可开关；开启后可设置时长、结束条件和自动规则。",
    "d065": "只改变当前演示，不修改电脑设置。",
    "d066": "VOID ISLAND / DEMO",
    "d067": "体验工作流",
    "d068": "0",
    "d069": "重置示例",
    "d070": "收起小岛",
    "d071": "展开小岛",
    "d072": "自动演示进度",
    "d073": "暂停自动演示",
    "d074": "继续自动演示",
    "d075": "窄屏可在演示画面内横向滑动，查看完整原生界面",
    "d076": "示例数据 · 不会操作你的终端或系统设置",
    "d077": "5小时",
    "d078": "2时15分",
    "d079": "本周",
    "d080": "4天14时",
    "d081": "本周",
    "d082": "4天14时",
    "d083": "%",
    "d084": "15 分钟",
    "d085": "30 分钟",
    "d086": "1 小时",
    "d087": "2 小时",
    "d088": "3 小时",
    "d089": "一直",
    "d090": "保持唤醒 · {v0}",
    "d091": "自动保持唤醒",
    "d092": "再点一次选项停止",
    "d093": "有 AI 会话在跑",
    "d094": "保持多久",
    "d095": "合盖也不睡",
    "d096": "屏幕也亮着",
    "d097": "到几点…",
    "d098": "保持唤醒到几点",
    "d099": "直到这件事结束",
    "d100": "当前日程结束",
    "d101": "这一轮专注结束",
    "d102": "AI 会话都跑完",
    "d103": "自动保持唤醒",
    "d104": "电量低于 10% 时停止 · 更多在设置里",
    "d105": "等待输入 · 开始于 10:18 · 平均一轮 30 秒",
    "d106": "定位示例终端",
    "d107": "返回",
    "d108": "运行了 3 条命令",
    "d109": "Read(src/ui/navigation.tsx)",
    "d110": "Edit(src/ui/navigation.tsx)",
    "d111": "Bash(bun test navigation)",
    "d112": "我检查了示例应用并调整了键盘导航。焦点顺序与页面一致，按 Escape 会返回之前的控件。",
    "d113": "修改仅涉及演示界面，8 项示例检查均已通过。",
    "d114": "给我看看改动",
    "d115": "预览已准备好，你可以在示例终端中查看焦点状态和更新后的交互。",
    "d116": "演示回复：已收到消息。本对话仅在当前网页中展示，不会发送给 AI 服务。",
    "d117": "演示消息",
    "d118": "给 {v0} 发消息，回车发送",
    "d119": "发送演示消息",
    "d120": "其余示例会话已隐藏 · 再点一次标题收起",
    "d121": "Finder",
    "d122": "文件",
    "d123": "编辑",
    "d124": "显示",
    "d125": "前往",
    "d126": "窗口",
    "d127": "帮助",
    "d128": "11 月 11 日 周三 10:24",
    "d129": "移动 {v0} 终端",
    "d130": "拖动移动 · 方向键调整位置",
    "d131": " — ",
    "d132": "zsh",
    "d133": "●",
    "d134": "正在分析搜索类型…",
    "d135": "●",
    "d136": "Read(src/search/types.ts)",
    "d137": "└─ 1.2 KB",
    "d138": "●",
    "d139": "检查结果结构",
    "d140": "Codex",
    "d141": "GPT · orbit-ui",
    "d142": "›",
    "d143": "优化键盘导航",
    "d144": "•",
    "d145": "检查焦点顺序",
    "d146": " src/ui/navigation.tsx",
    "d147": "✓",
    "d148": "已更新示例控件",
    "d149": "›",
    "d150": "剩余上下文 100% · ? 查看快捷键",
    "d151": "Claude Code",
    "d152": "pixel-garden",
    "d153": "正在完善暂停菜单。",
    "d154": "●",
    "d155": "Read(src/menu/pause.tsx)",
    "d156": " └─ Read 84 lines",
    "d157": "●",
    "d158": "Edit(src/menu/pause.tsx)",
    "d159": " └─ Updated (+12 −3)",
    "d160": "− return null;",
    "d161": "+ return <PauseMenu onResume={resume} />;",
    "d162": "●",
    "d163": "Bash(bun test menu)",
    "d164": "└─",
    "d165": "8 passed",
    "d166": "等待你允许后继续。",
    "d167": "下一步先完善哪个细节？",
    "d168": "已回到这条会话，随时可以继续。",
    "d169": "已完成！暂停菜单已准备好，等待检查。",
    "d170": "❯",
    "d171": "shift+tab ",
    "d172": "切换模式",
    "d173": "已提交 {v0} · {v1} 个文件",
    "d174": "更新 {v0}",
    "d175": "暂存",
    "d176": "取消暂存",
    "d177": "添加 Git 项目",
    "d178": "添加 Git 项目",
    "d179": "Git 设置",
    "d180": "Git 设置",
    "d181": "main",
    "d182": "刷新",
    "d183": "刷新",
    "d184": "更改",
    "d185": "以树形式查看",
    "d186": "以树形式查看",
    "d187": "储藏更改",
    "d188": "储藏更改…",
    "d189": "提交",
    "d190": "提交 ⌘↵",
    "d191": "提交说明（⌘回车提交）",
    "d192": "提交说明",
    "d193": "生成提交说明",
    "d194": "生成提交说明",
    "d195": "提交",
    "d196": "更多提交操作",
    "d197": "更多提交操作",
    "d198": "已暂存的更改",
    "d199": "更改",
    "d200": "图谱",
    "d201": "alex",
    "d202": "AI 在跑时",
    "d203": "专注计时时",
    "d204": "只在接电源时",
    "d205": "刚刚",
    "catWorking": "小猫：AI 正在工作",
    "catWaiting": "小猫：有 AI 会话需要你处理",
    "catCalm": "小猫",
    "questionSource": "ChatGPT 的提问",
    "questionPlaceholder": "输入或粘贴回答…",
    "questionSubmit": "提交回答",
    "answerSent": "已回答：{v0}",
    "answerContinuing": "已收到回答，继续处理。"
  },
  "en": {
    "d001": "Working",
    "d002": "Needs approval",
    "d003": "Needs an answer",
    "d004": "Waiting for input",
    "d005": "Now",
    "d006": "6 min",
    "d007": "You: ",
    "d008": ":",
    "d009": "Request denied. Waiting for your next instruction.",
    "d010": "Access allowed. Continuing with the example.",
    "d011": "Expand {v0} example session",
    "d012": "AI sessions",
    "d013": "Monitor",
    "d014": "Approve",
    "d015": "Ask",
    "d016": "Jump",
    "d017": "Refine the product intro",
    "d018": "Check the screenshots",
    "d019": "Keep the current result",
    "d020": "1 hour",
    "d021": "3 hours",
    "d022": "Always",
    "d023": "Always",
    "d024": "Interactive Void Island demo",
    "d025": "LIVE PLAYGROUND / ",
    "d026": "INTERACTIVE DEMO",
    "d027": "Hover over the notch to explore",
    "d028": "Mac demo, scroll horizontally on small screens",
    "d029": "Example Void Island panel",
    "d030": "AI sessions",
    "d031": "{v1}",
    "d032": "Example new session entry",
    "d033": "Close usage",
    "d034": "Keep awake",
    "d035": "Git changes",
    "d036": "Toggle demo sound icon",
    "d037": "Changes the icon; no audio plays",
    "d038": "Demo settings",
    "d039": "Git changes",
    "d040": "Keep awake",
    "d041": "Read project files",
    "d042": "Read · README.md",
    "d043": "Allow reading this project’s product description?",
    "d044": "Request denied. Waiting for your next instruction.",
    "d045": "Allowed once. Work continues.",
    "d046": "Allow once",
    "d047": "Deny",
    "d048": "What should we do next?",
    "d049": "Selected: ",
    "d050": "Expand example island",
    "d051": "AI sessions",
    "d052": "Stop keeping awake",
    "d053": "Keep awake",
    "d054": "Git changes",
    "d055": "Keep awake is on",
    "d056": "Keep awake is off",
    "d057": "Keep awake settings",
    "d058": "Move settings window",
    "d059": "Close demo settings",
    "d060": "Void Island · ",
    "d061": "Settings",
    "d062": "Keep awake",
    "d063": "Advanced mode",
    "d064": "Click the coffee cup to toggle keep awake. Advanced mode adds durations, end conditions and automatic rules.",
    "d065": "Only changes this preview, not your system settings.",
    "d066": "VOID ISLAND / DEMO",
    "d067": "Explore the workflow",
    "d068": "0",
    "d069": "Reset demo",
    "d070": "Collapse island",
    "d071": "Expand island",
    "d072": "Automatic demo progress",
    "d073": "Pause autoplay",
    "d074": "Resume autoplay",
    "d075": "Scroll within the demo to see the complete native interface.",
    "d076": "Sample data · This demo does not control your terminal or system settings",
    "d077": "5h",
    "d078": "2h15m",
    "d079": "week",
    "d080": "4d14h",
    "d081": "week",
    "d082": "4d14h",
    "d083": "%",
    "d084": "15 min",
    "d085": "30 min",
    "d086": "1 hr",
    "d087": "2 hr",
    "d088": "3 hr",
    "d089": "Always",
    "d090": "Keeping awake · {v0}",
    "d091": "Keep awake automatically",
    "d092": "Click the selected option to stop",
    "d093": "AI sessions are running",
    "d094": "For how long",
    "d095": "Keep awake with lid closed",
    "d096": "Keep screen on",
    "d097": "Until…",
    "d098": "Keep awake until time",
    "d099": "Until this ends",
    "d100": "Current event",
    "d101": "This focus round",
    "d102": "All AI sessions finish",
    "d103": "Keep awake automatically",
    "d104": "Stops below 10% battery · More in Settings",
    "d105": "Waiting for input · Started at 10:18 · Average turn 30 sec",
    "d106": "Highlight the example terminal",
    "d107": "Return",
    "d108": "Ran 3 commands",
    "d109": "Read(src/ui/navigation.tsx)",
    "d110": "Edit(src/ui/navigation.tsx)",
    "d111": "Bash(bun test navigation)",
    "d112": "I reviewed the example app and updated the keyboard navigation. Focus follows the visual order, and Escape returns to the previous control.",
    "d113": "The changes are limited to the demo interface. All 8 example checks passed.",
    "d114": "Show me the changes",
    "d115": "The preview is ready. You can review the focus states and the updated interactions in the example terminal.",
    "d116": "Demo reply: message received. This conversation stays in your browser and is not sent to an AI service.",
    "d117": "Demo message",
    "d118": "Message {v0} · Enter to send",
    "d119": "Send demo message",
    "d120": "Other example sessions are hidden · Click the title again to collapse",
    "d121": "Finder",
    "d122": "File",
    "d123": "Edit",
    "d124": "View",
    "d125": "Go",
    "d126": "Window",
    "d127": "Help",
    "d128": "Wed Nov 11 10:24",
    "d129": "Move {v0} terminal",
    "d130": "Drag to move · Arrow keys to reposition",
    "d131": " — ",
    "d132": "zsh",
    "d133": "●",
    "d134": "Analyzing the search types…",
    "d135": "●",
    "d136": "Read(src/search/types.ts)",
    "d137": "└─ 1.2 KB",
    "d138": "●",
    "d139": "Checking the result schema",
    "d140": "Codex",
    "d141": "GPT · orbit-ui",
    "d142": "›",
    "d143": "Improve keyboard navigation",
    "d144": "•",
    "d145": "Reviewing focus order",
    "d146": " src/ui/navigation.tsx",
    "d147": "✓",
    "d148": "Updated the example controls",
    "d149": "›",
    "d150": "100% context left · ? for shortcuts",
    "d151": "Claude Code",
    "d152": "pixel-garden",
    "d153": "Working on the pause menu.",
    "d154": "●",
    "d155": "Read(src/menu/pause.tsx)",
    "d156": " └─ Read 84 lines",
    "d157": "●",
    "d158": "Edit(src/menu/pause.tsx)",
    "d159": " └─ Updated (+12 −3)",
    "d160": "− return null;",
    "d161": "+ return <PauseMenu onResume={resume} />;",
    "d162": "●",
    "d163": "Bash(bun test menu)",
    "d164": "└─",
    "d165": "8 passed",
    "d166": "Waiting for your permission to continue.",
    "d167": "Which detail should we work on next?",
    "d168": "Back in this session. Ready when you are.",
    "d169": "All done! The pause menu is ready for review.",
    "d170": "❯",
    "d171": "shift+tab ",
    "d172": "to cycle modes",
    "d173": "Committed {v0} · {v1} file{v2}",
    "d174": "Update {v1}",
    "d175": "Stage",
    "d176": "Unstage",
    "d177": "Add Git project",
    "d178": "Add Git project",
    "d179": "Git settings",
    "d180": "Git settings",
    "d181": "main",
    "d182": "Refresh",
    "d183": "Refresh",
    "d184": "CHANGES",
    "d185": "View as tree",
    "d186": "View as tree",
    "d187": "Stash changes",
    "d188": "Stash changes…",
    "d189": "Commit",
    "d190": "Commit ⌘↵",
    "d191": "Message (⌘↵ to commit)",
    "d192": "Commit message",
    "d193": "Generate commit message",
    "d194": "Generate commit message",
    "d195": "Commit",
    "d196": "More commit actions",
    "d197": "More commit actions",
    "d198": "Staged Changes",
    "d199": "Changes",
    "d200": "GRAPH",
    "d201": "alex",
    "d202": "While AI runs",
    "d203": "While focusing",
    "d204": "Only on power",
    "d205": "now",
    "catWorking": "Cat: an AI session is working",
    "catWaiting": "Cat: an AI session needs you",
    "catCalm": "Cat",
    "questionSource": "ChatGPT’s question",
    "questionPlaceholder": "Type or paste an answer…",
    "questionSubmit": "Submit answer",
    "answerSent": "Answered: {v0}",
    "answerContinuing": "Answer received. Continuing with the task."
  }
};
const islandDemoSessions = [
  {
    name: "orbit-ui",
    agent: "Codex",
    icon: "openai",
    host: "ChatGPT.app",
    hostIcon: null,
    status: "working",
    prompt: ["优化页面的键盘导航", "Improve keyboard navigation"],
    reply: ["焦点顺序已调整，等待你检查。", "Focus order updated. Ready for your review."],
  },
  {
    name: "pixel-garden",
    agent: "Claude",
    icon: "claude",
    host: "Claude.app",
    hostIcon: null,
    status: "working",
    prompt: ["给游戏添加暂停菜单", "Add a pause menu to the game"],
    reply: ["菜单已完成，正在检查交互。", "The menu is ready. Checking the interactions."],
  },
  {
    name: "atlas-search",
    agent: "Gemini CLI",
    icon: "gemini",
    host: "Ghostty",
    hostIcon: "terminal",
    status: "working",
    prompt: ["整理搜索结果的类型定义", "Review the search result types"],
    reply: ["已补充类型，等待下一步。", "Types added. Waiting for the next step."],
  },
  {
    name: "harbor-api",
    agent: "Codex",
    icon: "openai",
    host: "iTerm2",
    hostIcon: "iterm2",
    status: "input",
    prompt: ["完善接口的错误提示", "Improve API error messages"],
    reply: ["正在检查示例请求。", "Checking the example requests."],
  },
  {
    name: "menu-cli",
    agent: "Claude Code",
    icon: "claude",
    host: "Terminal",
    hostIcon: "terminal",
    status: "working",
    prompt: ["检查菜单的交互细节", "Review the menu interactions"],
    reply: ["正在整理键盘操作。", "Reviewing keyboard controls."],
  },
  {
    name: "studio-kit",
    agent: "Cursor",
    icon: "cursor",
    host: "Cursor",
    hostIcon: "cursor",
    status: "input",
    prompt: ["检查按钮组件的视觉状态", "Review the button states"],
    reply: ["正在整理悬停与禁用状态。", "Reviewing hover and disabled states."],
  },
  {
    name: "paper-trail",
    agent: "OpenCode",
    icon: "opencode",
    host: "iTerm2",
    hostIcon: "iterm2",
    status: "input",
    prompt: ["补充快速开始文档", "Add a quick-start guide"],
    reply: ["文档初稿已准备好。", "The guide draft is ready."],
  },
  {
    name: "cloud-sketch",
    agent: "CodeBuddy",
    icon: "codebuddy",
    host: "Terminal",
    hostIcon: "terminal",
    status: "input",
    prompt: ["整理图标导出脚本", "Review the icon export script"],
    reply: ["正在检查导出格式。", "Checking export formats."],
  },
  {
    name: "note-lab",
    agent: "WorkBuddy",
    icon: "workbuddy",
    host: "WorkBuddy",
    hostIcon: null,
    status: "input",
    prompt: ["汇总演示中的修改点", "Summarize the demo changes"],
    reply: ["示例清单已准备好。", "The example checklist is ready."],
  },
  {
    name: "tiny-tools",
    agent: "pi",
    icon: "pi",
    host: "iTerm2",
    hostIcon: "iterm2",
    status: "input",
    prompt: ["检查工具函数的边界条件", "Check utility edge cases"],
    reply: ["正在运行本地示例。", "Running the local examples."],
  },
  {
    name: "lumen-docs",
    agent: "Kimi CLI",
    icon: "kimi",
    host: "Terminal",
    hostIcon: "terminal",
    status: "input",
    prompt: ["完善安装说明", "Improve the setup guide"],
    reply: ["说明已整理好，等待检查。", "The guide is ready for review."],
  },
] as const;
type IslandDemoCommit = {
  id:string; zh:string; en:string; hash:string; ago:{zh:string;en:string};
  refs?:{label:string;tone:"branch"|"tag"|"side"}[]; lane?:boolean;
};
const islandDemoCommits: IslandDemoCommit[] = [
  {
    id: "c1",
    zh: "添加暂停菜单",
    en: "Add a pause menu",
    hash: "18367aa",
    ago: { zh: "3 小时前", en: "3h ago" },
    refs: [{ label: "main", tone: "branch" }],
  },
  {
    id: "c2",
    zh: "HUD 显示分数和关卡",
    en: "Show score and level in the HUD",
    hash: "948fd13",
    ago: { zh: "5 小时前", en: "5h ago" },
  },
  {
    id: "c3",
    zh: "修复穿墙时的碰撞判断",
    en: "Fix wall collision",
    hash: "58d98c2",
    ago: { zh: "20 小时前", en: "20h ago" },
  },
  {
    id: "c4",
    zh: "合并 feature/levels",
    en: "Merge feature/levels",
    hash: "f562ea6",
    ago: { zh: "1 天前", en: "1d ago" },
    refs: [{ label: "v0.2.0", tone: "tag" }],
  },
  {
    id: "c5",
    zh: "每一关加快速度",
    en: "Speed up each level",
    hash: "741a45a",
    ago: { zh: "2 天前", en: "2d ago" },
    refs: [{ label: "feature/levels", tone: "side" }],
    lane: true,
  },
  {
    id: "c6",
    zh: "本地记录最高分",
    en: "Save the high score locally",
    hash: "55d116c",
    ago: { zh: "2 天前", en: "2d ago" },
  },
];
export function getIslandDemoContent(locale:Locale) {
 return { text:islandDemoTexts[locale], sessions:islandDemoSessions.slice(0, 4).map(s=>({...s,prompt:s.prompt[locale==='zh'?0:1],reply:s.reply[locale==='zh'?0:1]})), commits:islandDemoCommits.map(c=>({...c, zh:c[locale], en:c[locale], ago:{zh:c.ago[locale],en:c.ago[locale]}})) };
}
export type IslandDemoContent = ReturnType<typeof getIslandDemoContent>;
