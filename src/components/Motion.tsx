"use client";

import { useEffect } from "react";

/**
 * Progressive-enhancement motion layer ported from the Void Vision v2 design.
 * All content is server-rendered and visible without JS; this only hides
 * below-the-fold blocks until they scroll in, and drives the nav, progress
 * bar, phone parallax and contact zoom. Like the design, it runs for everyone.
 */
export function Motion() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("[data-nav]");
    const bar = document.querySelector<HTMLElement>("[data-progress]");

    // Chrome's own scroll restoration lands ~10px below where you left off on
    // this page, and the error compounds on every reload. Take it over: remember
    // the offset per URL and write it back verbatim, so 0 stays 0.
    const scrollKey = `vv:scroll:${location.pathname}`;
    const readScroll = () => {
      try {
        return Number(sessionStorage.getItem(scrollKey));
      } catch {
        return NaN;
      }
    };
    const saveScroll = () => {
      try {
        sessionStorage.setItem(scrollKey, String(Math.round(window.scrollY)));
      } catch {
        /* private mode / storage disabled: fall back to no restoration */
      }
    };
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (entry && (entry.type === "reload" || entry.type === "back_forward")) {
      const saved = readScroll();
      if (Number.isFinite(saved) && saved >= 0) window.scrollTo({ top: saved, left: 0, behavior: "instant" });
    }
    window.addEventListener("pagehide", saveScroll);

    const zoomPending: HTMLElement[] = [];
    const vh0 = window.innerHeight;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.remove("is-pending");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh0 * 0.95 && r.bottom > 0) return;
      el.classList.add("is-pending");
      io.observe(el);
    });
    document.querySelectorAll<HTMLElement>("[data-zoomin]").forEach((el) => {
      el.classList.add("is-zoom-pending");
      zoomPending.push(el);
    });

    const trigger = document.querySelector<HTMLElement>("[data-zoom-trigger]");
    const phoneRows = Array.from(document.querySelectorAll<HTMLElement>("[data-phones]"));
    let raf = 0;

    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      nav?.classList.toggle("is-scrolled", y > 40);
      if (bar) {
        const max = document.documentElement.scrollHeight - vh;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, y / max)) : 0})`;
      }
      if (trigger && zoomPending.length) {
        const r = trigger.getBoundingClientRect();
        if (r.top < vh * 0.72 && r.bottom > vh * 0.1) {
          zoomPending.splice(0).forEach((el) => el.classList.remove("is-zoom-pending"));
        }
      }
      for (const row of phoneRows) {
        const r = row.getBoundingClientRect();
        if (r.bottom < -300 || r.top > vh + 300) continue;
        const t = (vh - r.top) / (vh + r.height) - 0.5;
        Array.from(row.children).forEach((el, i) => {
          (el as HTMLElement).style.translate = `0 ${(-t * (i % 2 === 1 ? 0.16 : 0.06) * 190).toFixed(1)}px`;
        });
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    frame();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("pagehide", saveScroll);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return null;
}
