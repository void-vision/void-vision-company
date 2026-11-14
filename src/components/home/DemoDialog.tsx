"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 作品墙里的“看演示”：点开后用原生 <dialog> 盖在页面上，只放演示本身，关掉回到原位置。
 * 演示内容只在打开时挂载，所以每次打开都从头播放，关着时也不占计时器。
 */
export function DemoDialog({
  label,
  closeLabel,
  title,
  cover = false,
  children,
}: {
  label: string;
  closeLabel: string;
  title: string;
  /** 按钮的点击区域铺满整张产品卡片。 */
  cover?: boolean;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
    if (!open) return;
    // 打开时锁住页面滚动，只让弹出层自己滚。
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button type="button" className={cover ? "work-demo work-cover" : "work-demo"} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {label}
      </button>
      <dialog
        ref={dialog}
        className="demo-dialog"
        aria-label={title}
        onClose={() => setOpen(false)}
        // 点在弹出层外的遮罩上也关闭。
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        {open && (
          <div className="demo-dialog-body">
            <button type="button" className="demo-close" aria-label={closeLabel} onClick={() => setOpen(false)}>
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
              </svg>
            </button>
            {children}
          </div>
        )}
      </dialog>
    </>
  );
}
