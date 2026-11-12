import {
  useEffect,
  useRef,
  useState,
  useEffectEvent,
  type RefObject,
  type PointerEvent,
  type KeyboardEvent,
} from "react";

type Offset = { x: number; y: number };
type Drag = {
  pointer: number;
  handle: HTMLElement;
  startX: number;
  startY: number;
  offset: Offset;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  scaleX: number;
  scaleY: number;
};
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

// 坐标使用桌面自身的 CSS 单位，兼容演示缩放与窄屏局部滚动；只让标题栏接管手势。
export function useWindowDrag(
  windowRef: RefObject<HTMLDivElement | null>,
  onInteract?: () => void,
  visible = true,
) {
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const touched = useRef(false);
  const current = useRef(offset),
    drag = useRef<Drag | null>(null),
    interact = useRef(onInteract);
  useEffect(() => {
    interact.current = onInteract;
  }, [onInteract]);
  function bounds() {
    const window = windowRef.current;
    const host =
      window?.closest<HTMLElement>(".mac-windows") ??
      window?.closest<HTMLElement>(".scene");
    if (!window || !host) return null;
    const box = window.getBoundingClientRect(),
      area = host.getBoundingClientRect();
    const scaleX = area.width / host.clientWidth || 1,
      scaleY = area.height / host.clientHeight || 1;
    return {
      scaleX,
      scaleY,
      minX: (area.left - box.left) / scaleX + 8,
      maxX: (area.right - box.right) / scaleX - 8,
      minY: (area.top - box.top) / scaleY + 40,
      maxY: (area.bottom - box.bottom) / scaleY - 8,
    };
  }
  function apply(value: Offset) {
    current.current = value;
    setOffset(value);
  }
  function finish(cancel = false) {
    const active = drag.current;
    drag.current = null;
    setDragging(false);
    if (!active) return;
    if (cancel) apply(active.offset);
    if (active.handle.hasPointerCapture(active.pointer))
      active.handle.releasePointerCapture(active.pointer);
  }
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (
      !event.isPrimary ||
      event.button !== 0 ||
      (event.target as Element).closest("button,a,input,textarea,select")
    )
      return;
    const limits = bounds();
    if (!limits) return;
    event.preventDefault();
    touched.current = true;
    event.currentTarget.focus({ preventScroll: true });
    interact.current?.();
    drag.current = {
      ...limits,
      pointer: event.pointerId,
      handle: event.currentTarget,
      startX: event.clientX,
      startY: event.clientY,
      offset: { ...current.current },
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const active = drag.current;
    if (!active || active.pointer !== event.pointerId) return;
    apply({
      x:
        active.offset.x +
        clamp(
          (event.clientX - active.startX) / active.scaleX,
          active.minX,
          active.maxX,
        ),
      y:
        active.offset.y +
        clamp(
          (event.clientY - active.startY) / active.scaleY,
          active.minY,
          active.maxY,
        ),
    });
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && drag.current) {
      event.preventDefault();
      event.stopPropagation();
      finish(true);
      return;
    }
    if (event.target !== event.currentTarget) return;
    const step = event.shiftKey ? 40 : 10;
    const delta =
      event.key === "ArrowLeft"
        ? [-step, 0]
        : event.key === "ArrowRight"
          ? [step, 0]
          : event.key === "ArrowUp"
            ? [0, -step]
            : event.key === "ArrowDown"
              ? [0, step]
              : null;
    if (!delta) return;
    const limits = bounds();
    if (!limits) return;
    event.preventDefault();
    event.stopPropagation();
    touched.current = true;
    interact.current?.();
    apply({
      x: current.current.x + clamp(delta[0], limits.minX, limits.maxX),
      y: current.current.y + clamp(delta[1], limits.minY, limits.maxY),
    });
  }
  const finishObservedDrag = useEffectEvent(() => finish());
  const clampObservedWindow = useEffectEvent(() => {
    if (drag.current) return;
    const limits = bounds();
    if (!limits) return;
    const x = clamp(0, limits.minX, limits.maxX),
      y = clamp(0, limits.minY, limits.maxY);
    if (x || y) apply({ x: current.current.x + x, y: current.current.y + y });
  });
  useEffect(() => {
    if (!visible || !windowRef.current) return;
    const window = windowRef.current;
    const host =
      window.closest<HTMLElement>(".mac-windows") ??
      window.closest<HTMLElement>(".scene");
    if (!host) return;
    const observer = new ResizeObserver(() => clampObservedWindow());
    observer.observe(host);
    observer.observe(window);
    return () => {
      observer.disconnect();
      finishObservedDrag();
    };
  }, [windowRef, visible]);
  return {
    style: { translate: offset.x + "px " + offset.y + "px" },
    dragging,
    reset: () => {
      finish();
      touched.current = false;
      apply({ x: 0, y: 0 });
    },
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: () => finish(),
      onPointerCancel: () => finish(true),
      onLostPointerCapture: () => finish(),
      onKeyDown,
    },
  };
}
