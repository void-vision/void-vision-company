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

function WorkTile({ p, labels, media, demo }: { p: Product; labels: Labels; media?: ReactNode; demo?: ReactNode }) {
  const site = p.links.find((l) => !l.href.includes("apps.apple.com")) ?? p.links[0];
  const store = p.links.find((l) => l.href.includes("apps.apple.com"));
  const external = p.id === "voidbook" ? store ?? site : site;
  const note = p.status ?? p.alias;
  return (
    <article id={p.anchor} data-reveal className={`work-tile work-${LAYOUT[p.id]} accent-${p.accent}`} aria-labelledby={`${p.anchor}-tile`}>
      <div className="work-copy">
        <p className="work-meta">
          {p.short} · {p.platforms}
        </p>
        <h3 id={`${p.anchor}-tile`} className="work-name">{p.name}</h3>
        <p className="work-summary">{p.summary}</p>
        {(demo || external || note) && (
          <div className="work-links">
            {demo && (
              <DemoDialog label={labels.demo} closeLabel={labels.close} title={p.name}>
                {demo}
              </DemoDialog>
            )}
            {external && (
              <a href={external.href} target="_blank" rel="noopener">
                {external.label} ↗
              </a>
            )}
            {note && <span className="work-note">{note}</span>}
          </div>
        )}
      </div>
      {media ?? <WorkMedia p={p} />}
    </article>
  );
}

function WorkMedia({ p }: { p: Product }) {
  if (p.id === "voidbook") {
    const [front, back] = p.screens;
    return (
      <div className="work-phones">
        <Image src={back.src} alt={back.alt} width={back.width} height={back.height} sizes="160px" className="work-phone work-phone-back" />
        <Image src={front.src} alt={front.alt} width={front.width} height={front.height} sizes="180px" className="work-phone work-phone-front" />
      </div>
    );
  }
  if (p.id === "unilinx") {
    // 首页在前，学长姐大厅在后，与 VoidBook 一样前后叠放两台。
    const [back, front] = p.screens;
    return (
      <div className="work-unilinx">
        <div className="work-unilinx-back">
          <PhoneFrame screen={back} sizes="130px" />
        </div>
        <div className="work-unilinx-front">
          <PhoneFrame screen={front} sizes="140px" />
        </div>
      </div>
    );
  }
  const s = p.screens[0];
  if (!s) return null;
  return (
    <div className="work-shot">
      <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes={p.id === "voidcalendar" ? "(max-width: 900px) 100vw, 820px" : "(max-width: 900px) 100vw, 600px"} />
    </div>
  );
}
