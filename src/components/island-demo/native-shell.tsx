import { useEffect, useRef, useState, type RefObject } from "react";

// 复用 IslandShape 的三次贝塞尔肩弧与圆角参数，尺寸跟着实际内容变化。
export function islandPath(width: number, height: number, expanded: boolean) {
  const s = Math.min(expanded ? 12 : 4, width / 8, height / 4),
    r = Math.min(expanded ? 24 : 15, (width - s * 2) / 2, height - s),
    k = 0.55228475,
    l = s,
    right = width - s;
  return `M0 0H${width}C${width - k * s} 0 ${right} ${s - k * s} ${right} ${s}V${height - r}C${right} ${height - r + k * r} ${right - r + k * r} ${height} ${right - r} ${height}H${l + r}C${l + r - k * r} ${height} ${l} ${height - r + k * r} ${l} ${height - r}V${s}C${l} ${s - k * s} ${k * s} 0 0 0Z`;
}
export function NativeOutline({
  expanded,
  height,
}: {
  expanded: boolean;
  height: number;
}) {
  const width = expanded ? 670 : 246;
  return (
    <svg
      className="native-outline"
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <path d={islandPath(width, height, expanded)} fill="#000" />
    </svg>
  );
}
export function useNativeHeight(
  inner: RefObject<HTMLDivElement | null>,
  body: RefObject<HTMLDivElement | null>,
) {
  const [height, setHeight] = useState(350);
  useEffect(() => {
    if (!inner.current || !body.current) return;
    const measure = () => {
      const header = inner.current?.querySelector<HTMLElement>(".f-toolbar");
      if (header && body.current)
        setHeight(Math.ceil(header.offsetHeight + body.current.offsetHeight));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(body.current);
    const header = inner.current.querySelector(".f-toolbar");
    if (header) observer.observe(header);
    measure();
    return () => observer.disconnect();
  }, [inner, body]);
  return height;
}
const stages = ["monitor", "approve", "ask", "jump"];
const durations = [5500, 5600, 4300, 12800];
export function useDemoTimeline(
  step: string,
  playing: boolean,
  next: (value: string) => void,
  restartKey = 0,
) {
  const ref = useRef<HTMLDivElement>(null),
    callback = useRef(next),
    elapsed = useRef(0),
    previousStep = useRef(step),
    previousRestart = useRef(restartKey);
  const [visible, setVisible] = useState(false),
    [reduce, setReduce] = useState(true);
  useEffect(() => {
    callback.current = next;
  }, [next]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries.some((e) => e.isIntersecting)),
      { threshold: 0.2 },
    );
    observer.observe(
      ref.current.closest("#demo")?.querySelector(".scene") || ref.current,
    );
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (
      previousStep.current !== step ||
      previousRestart.current !== restartKey
    ) {
      elapsed.current = 0;
      previousStep.current = step;
      previousRestart.current = restartKey;
    }
    let frame = 0,
      last = performance.now();
    const draw = (now: number) => {
      const delta = now - last;
      last = now;
      // 只在当前演示的文本编辑期间让计时等候；读取真实焦点，避免输入框移除后残留暂停。
      const active = document.activeElement;
      const editing =
        active instanceof HTMLElement &&
        ref.current?.closest("#demo")?.contains(active) &&
        !active.closest("[inert]") &&
        active.matches(
          'textarea, input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]), [contenteditable="true"]',
        );
      if (playing && visible && !reduce && !editing)
        elapsed.current += Math.min(delta, 100);
      const index = stages.indexOf(step),
        duration = durations[index] ?? 5500,
        progress = Math.min(1, elapsed.current / duration);
      ref.current?.style.setProperty("--demo-progress", String(progress));
      ref.current?.setAttribute(
        "aria-valuenow",
        String(Math.round(((index + progress) / stages.length) * 100)),
      );
      if (progress >= 1 && !editing) {
        elapsed.current = 0;
        callback.current(stages[(index + 1) % stages.length]);
        return;
      }
      if (playing && visible && !reduce) frame = requestAnimationFrame(draw);
    };
    draw(last);
    return () => cancelAnimationFrame(frame);
  }, [step, playing, visible, reduce, restartKey]);
  return ref;
}
