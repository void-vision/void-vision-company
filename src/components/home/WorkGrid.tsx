import Image from "next/image";
import type { ReactNode } from "react";
import type { Product, ProductId } from "@/content/site";
import { PhoneFrame } from "@/components/PhoneFrame";
import { DemoDialog } from "./DemoDialog";

/** 产品墙的排列顺序与每块的版式；每款产品只在这里出现一次，演示在弹出层里看。 */
export const WORK_ORDER: ProductId[] = ["airfluence", "voidbook", "voidcalendar", "voidisland", "unilinx"];

const LAYOUT: Record<ProductId, "feature" | "tall" | "wide" | "half"> = {
  airfluence: "feature",
  voidbook: "tall",
  voidcalendar: "wide",
  voidisland: "half",
  unilinx: "half",
};

type Labels = {
  demo: string;
  close: string;
  visit: string;
};

export function WorkGrid({
  products,
  labels,
  media,
  demos,
}: {
  products: Product[];
  labels: Labels;
  /** 替换某款产品默认的截图，例如 Airfluence 的官网动态预览。 */
  media: Partial<Record<ProductId, ReactNode>>;
  /** 有演示的产品：弹出层里的内容。 */
  demos: Partial<Record<ProductId, ReactNode>>;
}) {
  const byId = new Map(products.map((p) => [p.id, p]));
  return (
    <div className="work-grid">
      {WORK_ORDER.map((id) => {
        const p = byId.get(id);
        return p ? <WorkTile key={id} p={p} labels={labels} media={media[id]} demo={demos[id]} /> : null;
      })}
    </div>
  );
}

/**
 * 图在上、文字在下。整张卡片都能点：有演示的打开弹出层，没有的去官网或 App Store；
 * 角标在悬停时说明点了会发生什么。Airfluence 的官网预览本身是链接，所以不铺满整卡。
 */
function WorkTile({ p, labels, media, demo }: { p: Product; labels: Labels; media?: ReactNode; demo?: ReactNode }) {
  const site = p.links.find((l) => !l.href.includes("apps.apple.com")) ?? p.links[0];
  const store = p.links.find((l) => l.href.includes("apps.apple.com"));
  const external = p.id === "voidbook" ? store ?? site : site;
  const cover = !media;
  const chip = demo ? `▶ ${labels.demo}` : external && `${store && external === store ? "App Store" : labels.visit} ↗`;
  return (
    <article id={p.anchor} data-reveal className={`work-tile work-${LAYOUT[p.id]} accent-${p.accent}`} aria-labelledby={`${p.anchor}-tile`}>
      {media ?? <WorkMedia p={p} />}
      {cover && chip && (
        <span className="work-chip" aria-hidden="true">
          {chip}
        </span>
      )}
      <div className="work-copy">
        <p className="work-meta">
          {p.short} · {p.platforms}
        </p>
        <h3 id={`${p.anchor}-tile`} className="work-name">{p.name}</h3>
        <p className="work-summary">{p.summary}</p>
        {(demo || external || p.alias) && (
          <div className="work-links">
            {demo && (
              <DemoDialog label={labels.demo} closeLabel={labels.close} title={p.name} cover={cover}>
                {demo}
              </DemoDialog>
            )}
            {external && (
              <a href={external.href} target="_blank" rel="noopener" className={cover && !demo ? "work-cover" : undefined}>
                {external.label} ↗
              </a>
            )}
            {p.alias && <span className="work-note">{p.alias}</span>}
          </div>
        )}
      </div>
    </article>
  );
}

function WorkMedia({ p }: { p: Product }) {
  if (p.id === "voidbook") {
    const [front, back] = p.screens;
    return (
      <div className="work-media work-phones">
        <Image src={back.src} alt={back.alt} width={back.width} height={back.height} sizes="160px" className="work-phone work-phone-back" />
        <Image src={front.src} alt={front.alt} width={front.width} height={front.height} sizes="180px" className="work-phone work-phone-front" />
      </div>
    );
  }
  if (p.id === "unilinx") {
    // 首页在前，学长姐大厅在后，从卡片底边升起。
    const [back, front] = p.screens;
    return (
      <div className="work-media work-unilinx">
        <div className="work-unilinx-phones">
          <div className="work-unilinx-back">
            <PhoneFrame screen={back} sizes="140px" />
          </div>
          <div className="work-unilinx-front">
            <PhoneFrame screen={front} sizes="150px" />
          </div>
        </div>
      </div>
    );
  }
  if (p.id === "voidcalendar") {
    // 任务列表在前，画布在后，悬停时错开。
    const [front, back] = p.screens;
    return (
      <div className="work-media work-windows">
        <Image src={back.src} alt={back.alt} width={back.width} height={back.height} sizes="(max-width: 900px) 70vw, 560px" className="work-window work-window-back" />
        <Image src={front.src} alt={front.alt} width={front.width} height={front.height} sizes="(max-width: 900px) 80vw, 640px" className="work-window work-window-front" />
      </div>
    );
  }
  const s = p.screens[0];
  if (!s) return null;
  return (
    <div className="work-media work-shot">
      <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 900px) 100vw, 600px" />
    </div>
  );
}
