"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { AirfluenceDemo, Screen } from "@/content/site";
import "./airfluence.css";

/**
 * Airfluence 的两块展示：作品墙里是 airfluence.ai 首屏的缩略预览（循环视频 + 轮换标题），
 * 整块是一个链接；“看演示”弹出层里是“品牌发布 → 创作者发现 → 触达受众”的自动演示。
 */

/** True while the element is on screen and the tab is in the foreground. */
function useOnScreen<T extends HTMLElement>(threshold: number) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = false;
    const sync = () => setOn(visible && !document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [threshold]);
  return [ref, on] as const;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export function AirfluenceSitePreview({ site, href }: { site: AirfluenceDemo["site"]; href: string }) {
  const [ref, onScreen] = useOnScreen<HTMLAnchorElement>(0.15);
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const host = new URL(href).host;

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    if (onScreen && !reduced) void player.play()?.catch(() => {});
    else player.pause();
  }, [onScreen, reduced]);

  return (
    <a ref={ref} href={href} target="_blank" rel="noopener" className="af-site" aria-label={site.label}>
      <span className="af-window">
        <span className="af-chrome" aria-hidden="true">
          <span className="af-lights"><i /><i /><i /></span>
          <span className="af-url">
            <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="7" width="10" height="7" rx="1.6" />
              <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
            </svg>
            {host}
          </span>
          <span className="af-open">
            {site.open}
            <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M5 11 11 5M6 5h5v5" />
            </svg>
          </span>
        </span>
        <span className="af-viewport" aria-hidden="true" lang="en">
          <span className="af-stage">
            <video
              ref={video}
              className="af-backdrop"
              src="/images/airfluence/hero-loop.mp4"
              poster="/images/airfluence/hero-poster.webp"
              muted
              loop
              playsInline
              preload="metadata"
              tabIndex={-1}
            />
            <span className="af-shade" />
            <span className="af-nav">
              <span className="af-lang">{site.langSwitch}</span>
              {/* eslint-disable-next-line @next/next/no-img-element -- 小尺寸 SVG 标识，无需图片优化 */}
              <img src="/images/airfluence/lockup-white.svg" alt="" width={170} height={30} className="af-lockup" />
              <span className="af-menu"><i /><i /><i /></span>
            </span>
            <span className="af-copy">
              <span className="af-chips">
                <span className="af-chip"><i className="af-dot" />{site.chips[0]}</span>
                {/* eslint-disable-next-line @next/next/no-img-element -- 平台小图标 */}
                <span className="af-chip"><img src="/images/airfluence/instagram.png" alt="" />{site.chips[1]}</span>
                {/* eslint-disable-next-line @next/next/no-img-element -- 平台小图标 */}
                <span className="af-chip"><img src="/images/airfluence/xiaohongshu.svg" alt="" />{site.chips[2]}</span>
              </span>
              <span className="af-headlines">
                {site.headlines.map((h, i) => (
                  <span key={h} className="af-headline" style={{ "--i": i, "--n": site.headlines.length } as CSSProperties}>
                    {h}
                  </span>
                ))}
              </span>
              <span className="af-lede">{site.lede}</span>
              <span className="af-actions">
                <span className="af-btn af-btn-solid">{site.actions[0]} <b>→</b></span>
                <span className="af-btn af-btn-line">{site.actions[1]}</span>
              </span>
              <span className="af-fine">{site.fine}</span>
            </span>
            <span className="af-links">
              {site.links.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
            <span className="af-meta">
              <span className="af-film">{site.film}</span>
              <span className="af-play">
                <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M2.5 1.2v9.6L10.5 6z" /></svg>
                {site.play}
                <small>0:46</small>
              </span>
            </span>
          </span>
        </span>
      </span>
    </a>
  );
}

/** One full pass through the three stages, then a short hold on the spread-out audience. */
const RUN_MS = 15000;
const HOLD_MS = 2600;
const STAGES = [0, 0.34, 0.67] as const;
/** Where each stage button jumps to; reduced motion shows the finished frame of each stage. */
const STAGE_STILL = [0.3, 0.6, 1] as const;

const phaseOf = (p: number) => (p < STAGES[1] ? 0 : p < STAGES[2] ? 1 : 2);
/** Brand phone: the four publish steps, then the campaign list once the brief is live. */
const brandScreenOf = (p: number) => (p < 0.1 ? 0 : p < 0.18 ? 1 : p < 0.26 ? 2 : p < 0.34 ? 3 : 4);

// [name, x%, y%, size%] — same constellation as the airfluence.ai story.
const PORTRAITS = [
  ["maya-lin", 50, 48, 24], ["kenji-park", 29, 26, 15], ["priya-shah", 58, 17, 16],
  ["lea-moreau", 77, 40, 15], ["diego-vasquez", 70, 72, 16], ["aria-tanaka", 41, 78, 15],
  ["noor-khalil", 18, 57, 14], ["sam-ortiz", 12, 16, 10], ["dana-whitfield", 39, 6, 10],
  ["ren-kobayashi", 87, 16, 12], ["sara-ito", 93, 64, 11], ["lina-chen", 85, 88, 10],
  ["mia-jones", 57, 92, 11], ["sora-kim", 14, 85, 12], ["alex-wu", 6, 38, 10],
] as const;

export function AirfluenceStory({ story, screens }: { story: AirfluenceDemo["story"]; screens: Screen[] }) {
  const [ref, onScreen] = useOnScreen<HTMLDivElement>(0.25);
  const reduced = useReducedMotion();
  const elapsed = useRef(0);
  const [phase, setPhase] = useState(0);
  const [brand, setBrand] = useState(0);
  const brandScreens = screens.slice(0, 5);
  const creator = screens[5];

  // The frame loop writes --p straight onto the element; React only re-renders when the
  // stage or the brand phone's screen changes.
  const paint = (p: number) => {
    ref.current?.style.setProperty("--p", p.toFixed(4));
    setPhase(phaseOf(p));
    setBrand(brandScreenOf(p));
  };

  useEffect(() => {
    if (reduced) {
      paint(Math.min(1, elapsed.current / RUN_MS) || 1);
      return;
    }
    if (!onScreen) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed.current += Math.min(now - last, 100);
      last = now;
      if (elapsed.current > RUN_MS + HOLD_MS) elapsed.current = 0;
      paint(Math.min(1, elapsed.current / RUN_MS));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // paint only touches refs and state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onScreen, reduced]);

  const select = (i: number) => {
    elapsed.current = (reduced ? STAGE_STILL[i] : STAGES[i] + 0.005) * RUN_MS;
    paint(elapsed.current / RUN_MS);
  };

  return (
    <div
      ref={ref}
      className="af-story"
      role="group"
      aria-label={story.label}
      data-phase={phase}
      style={{ "--p": 0 } as CSSProperties}
    >
      <div className="af-hud">
        <div>
          <span className="af-eyebrow">{story.eyebrow}</span>
          <p aria-live="polite">{story.stages[phase].line}</p>
        </div>
        <span className="af-counter">0{phase + 1} / 03</span>
        <span className="af-meter" aria-hidden="true"><i /></span>
      </div>

      <div className="af-columns">
        <figure className="af-col af-col-phone" data-focus={phase === 0}>
          <StoryPhone screens={brandScreens} active={brand} tap={phase === 0 ? "publish" : null} />
          <figcaption>{story.captions[0]}</figcaption>
        </figure>
        <Connection from={0} to={0.32} />
        <figure className="af-col af-col-phone" data-focus={phase === 1}>
          <StoryPhone screens={[creator]} active={0} tap={phase === 1 ? "discover" : null} />
          <figcaption>{story.captions[1]}</figcaption>
        </figure>
        <Connection from={0.34} to={0.66} />
        <figure className="af-col af-col-reach" data-focus={phase === 2}>
          <div className="af-reach" role="img" aria-label={story.reach.alt}>
            <div className="af-reach-head">
              <span>{story.reach.kicker}</span>
              <b>{story.reach.title[0]}<br />{story.reach.title[1]}</b>
            </div>
            <div className="af-reach-people" aria-hidden="true">
              <svg className="af-globe" viewBox="0 0 300 300" fill="none">
                <circle cx="150" cy="150" r="112" />
                <ellipse cx="150" cy="150" rx="63" ry="112" />
                <path d="M38 150h224M58 88h184M58 212h184M150 38v224" />
              </svg>
              {PORTRAITS.map(([name, x, y, size], i) => (
                <span key={name} className="af-face" style={{ "--x": x, "--y": y, "--s": size, "--i": i } as CSSProperties}>
                  <Image src={`/images/airfluence/avatars/${name}.webp`} alt="" width={256} height={256} sizes="96px" />
                </span>
              ))}
            </div>
            <span className="af-reach-note">{story.reach.note}</span>
          </div>
          <figcaption>{story.captions[2]}</figcaption>
        </figure>
      </div>

      <ol className="af-steps">
        {story.stages.map((s, i) => (
          <li
            key={s.label}
            data-state={i === phase ? "on" : i < phase ? "done" : undefined}
            style={{ "--a": STAGES[i], "--b": STAGES[i + 1] ?? 1 } as CSSProperties}
          >
            <button type="button" aria-current={i === phase ? "step" : undefined} onClick={() => select(i)}>
              <i className="af-step-fill" aria-hidden="true" />
              <b>0{i + 1}</b>
              <span>{s.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StoryPhone({ screens, active, tap }: { screens: Screen[]; active: number; tap: "publish" | "discover" | null }) {
  return (
    <div className="phone af-phone">
      <div className="phone-body">
        <div className="phone-screen af-phone-screen">
          {screens.map((s, i) => (
            <Image
              key={s.src}
              src={s.src}
              alt={i === active ? s.alt : ""}
              aria-hidden={i !== active}
              width={s.width}
              height={s.height}
              sizes="(max-width: 900px) 46vw, 240px"
              className="phone-shot af-shot"
              data-active={i === active || undefined}
            />
          ))}
          {/* 每次切到下一步时，在“继续”按钮上点一下；创作者端则点开第一张合作卡片。 */}
          {tap && <span key={`${tap}-${active}`} className={`af-tap af-tap-${tap}`} aria-hidden="true" />}
        </div>
        <Image src="/images/iphone-16-pro-black.png" alt="" aria-hidden="true" width={1350} height={2760} sizes="(max-width: 900px) 46vw, 240px" className="phone-bezel" />
      </div>
    </div>
  );
}

function Connection({ from, to }: { from: number; to: number }) {
  return (
    <div className="af-link" aria-hidden="true" style={{ "--a": from, "--b": to } as CSSProperties}>
      <i className="af-link-fill" />
      <i className="af-link-dot" />
      <span className="af-link-label">Airfluence <b>✓</b></span>
    </div>
  );
}
