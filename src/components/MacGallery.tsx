"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { Screen } from "@/content/site";

/** How long each shot stays up before the bar moves on. */
const SLIDE_MS = 6000;

/**
 * Several desktop screenshots in one Mac window. A segmented bar below plays them in turn:
 * the current segment fills like a progress bar, then the next shot fades in.
 * Every shot stays in the DOM (stacked in one grid cell) so the frame never changes height.
 * The fill is a CSS animation; its `animationend` advances the slide, so pausing the
 * animation (off-screen) pauses the whole sequence.
 */
export function MacGallery({ screens, sizes, label }: { screens: Screen[]; sizes: string; label: string }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = (i: number) => setActive((i + screens.length) % screens.length);
  // Only pauses off screen: people rest the pointer on the shot or click a tab, and either
  // used to freeze the bar. A click restarts the fill from the chosen tab instead.
  const playing = visible;

  return (
    <div ref={root} className="mac-gallery">
      <figure className="mac">
        <div className="mac-body mac-stack">
          {screens.map((s, i) => (
            <div
              key={s.src}
              id={`${id}-${i}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${i}`}
              aria-hidden={i !== active}
              className="mac-stack-item"
              data-active={i === active || undefined}
            >
              <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes={sizes} className="mac-shot" />
            </div>
          ))}
        </div>
      </figure>
      <div role="tablist" aria-label={label} className="mac-tabs" data-playing={playing || undefined}>
        {screens.map((s, i) => (
          <button
            key={s.src}
            id={`${id}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-${i}`}
            tabIndex={i === active ? 0 : -1}
            className="mac-tab"
            onClick={() => select(i)}
            onKeyDown={(e) => {
              const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (!step) return;
              e.preventDefault();
              const next = (active + step + screens.length) % screens.length;
              select(next);
              document.getElementById(`${id}-tab-${next}`)?.focus();
            }}
          >
            {i === active && (
              // Keyed by slide so the fill restarts from zero whenever the shot changes.
              <span
                key={active}
                aria-hidden="true"
                className="mac-tab-fill"
                style={{ animationDuration: `${SLIDE_MS}ms` }}
                onAnimationEnd={() => select(active + 1)}
              />
            )}
            <span className="mac-tab-num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mac-tab-label">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
