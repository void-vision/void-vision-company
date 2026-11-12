import type { CSSProperties } from "react";

/**
 * Island 用到的图标，照原生岛（void-calendar/app/src-tauri/native/island）画：
 * - 标签栏和按钮：原生用系统图标，这里照着 14pt / medium 的样子重画成矢量；记录是原生自己描的实心铅笔（照 islandJournalPencilPath）。
 * - AI 小猫、用量电池、会话状态光标：照 agentCatFrame、agentBatteryShape、会话光标的算法移植。
 * - Claude / OpenAI 标志：原生 Agents.swift 里同一份 24 × 24 路径。
 */
export type GlyphName =
  | "journal"
  | "coffee"
  | "focus"
  | "focusRunning"
  | "calendar"
  | "git"
  | "sound"
  | "muted"
  | "settings"
  | "gear"
  | "plus"
  | "sparkles"
  | "refresh"
  | "chevronDown"
  | "chevronRight"
  | "check"
  | "list"
  | "stash"
  | "swift"
  | "doc";

// 齿轮：8 个齿，靠描边把拐角磨圆；中间的孔按奇偶规则挖掉。
const gearOutline = (() => {
  const points: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    for (const [r, d] of [
      [6.9, -0.43],
      [8.7, -0.21],
      [8.7, 0.21],
      [6.9, 0.43],
    ])
      points.push(
        `${(10 + Math.cos(a + d) * r).toFixed(2)} ${(10 + Math.sin(a + d) * r).toFixed(2)}`,
      );
  }
  return `M${points.join("L")}Z`;
})();
const gearHole = "M13.6 10a3.6 3.6 0 1 0-7.2 0 3.6 3.6 0 0 0 7.2 0z";

// 四角星：四条边向里收的弧。
const star = (cx: number, cy: number, r: number) => {
  const k = r * 0.14;
  return `M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`;
};

// 记录的铅笔：原生按 9 × 9 格、每格 1.5pt 的像素铅笔描成矢量，u = x + y 横跨笔身，v = x − y 顺着笔身。
const pencil = (() => {
  const px = 13.5 / 9;
  const point = (u: number, v: number) =>
    `${(((u + v) / 2) * px).toFixed(2)} ${(((u - v) / 2) * px).toFixed(2)}`;
  const polygon = (corners: [number, number][]) =>
    `M${corners.map(([u, v]) => point(u, v)).join("L")}Z`;
  const joint = -3.6,
    tipBase = -4.5,
    tip = -8.5,
    half = (4 * (tipBase - tip)) / (joint - tip);
  return [
    ...[
      [4.5, 6.6],
      [7.4, 9.6],
      [10.4, 12.5],
    ].map(([low, high]) =>
      polygon([
        [low, 1.1],
        [high, 1.1],
        [high, joint],
        [low, joint],
      ]),
    ),
    polygon([
      [4.5, 4.5],
      [12.5, 4.5],
      [12.5, 1.9],
      [4.5, 1.9],
    ]),
    polygon([
      [8.5 - half, tipBase],
      [8.5 + half, tipBase],
      [8.5, tip],
    ]),
  ].join("");
})();

const nativeToolbarSymbols = {
  coffee: {
    height: 14,
    pointSize: 14,
    symbol: "cup.and.saucer.fill",
    weight: "medium",
    width: 18,
  },
  git: {
    height: 14,
    pointSize: 14,
    symbol: "arrow.triangle.branch",
    weight: "medium",
    width: 13,
  },
  muted: {
    height: 13.5,
    pointSize: 14,
    symbol: "speaker.slash.fill",
    weight: "regular",
    width: 13.25,
  },
  plus: {
    height: 12,
    pointSize: 14,
    symbol: "plus",
    weight: "regular",
    width: 11.25,
  },
  settings: {
    height: 15,
    pointSize: 14,
    symbol: "gearshape.fill",
    weight: "regular",
    width: 15,
  },
  sound: {
    height: 13,
    pointSize: 14,
    symbol: "speaker.wave.2.fill",
    weight: "regular",
    width: 15.75,
  },
} as const;
export function Glyph({ name }: { name: GlyphName }) {
  if (name in nativeToolbarSymbols) {
    const glyph =
      nativeToolbarSymbols[name as keyof typeof nativeToolbarSymbols];
    return (
      <span
        className="vi-glyph native-symbol"
        aria-hidden="true"
        style={{
          width: glyph.width,
          height: glyph.height,
          display: "block",
          backgroundColor: "currentColor",
          mask: `url(/images/island-demo/native-symbols/${name}.png) center / contain no-repeat`,
          WebkitMask: `url(/images/island-demo/native-symbols/${name}.png) center / contain no-repeat`,
        }}
      />
    );
  }
  const props = {
    viewBox: "0 0 20 20",
    "aria-hidden": true as const,
    className: "vi-glyph",
  };
  const rounded = {
    stroke: "currentColor",
    strokeWidth: 0.9,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "journal":
      return (
        <svg
          {...props}
          viewBox="-3.25 -3.25 20 20"
          fill="currentColor"
          {...rounded}
          strokeWidth={0.45}
        >
          <path d={pencil} />
        </svg>
      );
    case "coffee":
      return (
        <svg {...props} fill="currentColor">
          <path
            d="M2.9 4.3h12v3.6c0 3.3-2.6 5.6-6 5.6s-6-2.3-6-5.6z"
            {...rounded}
          />
          <path
            d="M14.6 5.7h.9a2.15 2.15 0 0 1 0 4.3h-1.3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M.9 14.4c1.3 1 4.5 1.7 8 1.7s6.7-.7 8-1.7c-.1 2-3.6 3.3-8 3.3s-7.9-1.3-8-3.3z"
            {...rounded}
          />
        </svg>
      );
    case "focus":
    case "focusRunning":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.6 2.4h10.8M4.6 17.6h10.8" strokeWidth="1.9" />
          <path d="M6.3 2.6c0 3.5 2.7 4.7 2.7 7.4s-2.7 3.9-2.7 7.4M13.7 2.6c0 3.5-2.7 4.7-2.7 7.4s2.7 3.9 2.7 7.4" />
          {name === "focusRunning" && (
            <path
              d="M7.4 16.8c.4-1.9 1.8-3 2.6-3.6.8.6 2.2 1.7 2.6 3.6z"
              fill="currentColor"
              stroke="none"
            />
          )}
        </svg>
      );
    case "calendar":
      return (
        <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2.2" y="2.9" width="15.6" height="14.6" rx="3" />
          <path
            d="M2.2 6.1v-.2a3 3 0 0 1 3-3h9.6a3 3 0 0 1 3 3v.2z"
            fill="currentColor"
          />
          <g fill="currentColor" stroke="none">
            {[
              [7.75, 10.25, 12.5, 14.75],
              [5.5, 7.75, 10, 12.25, 14.5],
              [5.5, 7.75, 10],
            ].flatMap((xs, row) =>
              xs.map((x) => (
                <rect
                  key={`${row}-${x}`}
                  x={x - 0.8}
                  y={8.6 + row * 2.6}
                  width="1.6"
                  height="1.6"
                  rx=".3"
                />
              )),
            )}
          </g>
        </svg>
      );
    case "git":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 18.2v-6.4c0-2.3-1.4-3.9-5.5-8.2M10 11.8c0-2.3 1.4-3.9 5.5-8.2" />
          <path d="M3.9 7.6V3h4.6M16.1 7.6V3h-4.6" />
        </svg>
      );
    case "sound":
    case "muted":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path
            d="M2.4 7.8c0-.5.4-.9.9-.9h2.4l3.7-3.3c.6-.5 1.4-.1 1.4.6v11.6c0 .7-.8 1.1-1.4.6L5.7 13.1H3.3c-.5 0-.9-.4-.9-.9z"
            fill="currentColor"
            stroke="none"
          />
          {name === "sound" ? (
            <>
              <path d="M13.3 7.6a3.4 3.4 0 0 1 0 4.8" />
              <path d="M15.6 5.4a6.6 6.6 0 0 1 0 9.2" />
            </>
          ) : (
            <path d="m13.2 8 4 4m0-4-4 4" />
          )}
        </svg>
      );
    case "settings":
      return (
        <svg {...props} fill="currentColor" fillRule="evenodd">
          <path d={gearOutline + gearHole} {...rounded} strokeWidth={1.1} />
        </svg>
      );
    case "gear":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        >
          <path d={gearOutline} />
          <path d={gearHole} />
        </svg>
      );
    case "plus":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        >
          <path d="M10 3.5v13M3.5 10h13" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...props} fill="currentColor">
          <path
            d={
              star(11.6, 12.4, 6.4) + star(5.4, 6.6, 2.8) + star(12.6, 2.6, 1.7)
            }
          />
        </svg>
      );
    case "refresh":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16.2 10.3a6.2 6.2 0 1 1-1.9-4.6" />
          <path d="M15 2.4v3.6h-3.6" />
        </svg>
      );
    case "chevronDown":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      );
    case "chevronRight":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m7.5 5 5 5-5 5" />
        </svg>
      );
    case "check":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m4 10.4 3.8 3.8L16 6" />
        </svg>
      );
    case "list":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        >
          <path d="M7.5 5h9.5M7.5 10h9.5M7.5 15h9.5" />
          <g fill="currentColor" stroke="none">
            <circle cx="3.6" cy="5" r="1.1" />
            <circle cx="3.6" cy="10" r="1.1" />
            <circle cx="3.6" cy="15" r="1.1" />
          </g>
        </svg>
      );
    case "stash":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 2.5v7.2M7.2 7l2.8 2.8L12.8 7" />
          <path d="M3 11.2 4.6 6h2M16.9 11.2 15.3 6h-2M3 11.2v4.1c0 .9.7 1.6 1.6 1.6h10.7c.9 0 1.6-.7 1.6-1.6v-4.1h-4.4a2.5 2.5 0 0 1-5 0z" />
        </svg>
      );
    case "swift":
      return (
        <svg {...props} fill="currentColor">
          <path d="M16.9 13.3c.9-2.9-.4-6.4-3.6-8.7 1.5 2.1 2.2 4.6 1.6 6.4-2.6-1.9-6.2-4.6-9-6.8 1.6 1.9 3.4 3.6 5 5C8.8 8 6.3 6.3 4 4.3c2.2 3.2 5.6 6.6 8.9 8.8-2.4 1.4-6.2 1.4-9.7-.8 2 3 5.4 4.6 8.6 4.6 2 0 3.2-.7 4.3-.7.8 0 1.4.4 1.8 1 .2-1.2-.2-2.8-1-3.9z" />
        </svg>
      );
    case "doc":
      return (
        <svg
          {...props}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        >
          <path d="M5.2 2.4h6.4l3.4 3.4v10.6c0 .7-.5 1.2-1.2 1.2H5.2c-.7 0-1.2-.5-1.2-1.2V3.6c0-.7.5-1.2 1.2-1.2z" />
          <path
            d="M11.4 2.6v3.4h3.4M6.8 10h6.4M6.8 12.6h6.4M6.8 15.1h4"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

/* ---------- AI 小猫：照 agentCatFrame（11 列 × 8 行）。 ---------- */
export type CatMood = "calm" | "working" | "waiting";
const catColumns = 11;
function catRows(mood: CatMood) {
  const ears = "#.....#",
    nose = "#######";
  const eyes = "#.###.#";
  const tail: [number, number][] =
    mood === "waiting"
      ? [
          [6, 7],
          [7, 6],
          [7, 5],
          [8, 4],
        ]
      : [
          [6, 7],
          [7, 6],
          [8, 5],
        ];
  const grid = [
    ears,
    "##...##",
    "#######",
    eyes,
    nose,
    ".#####.",
    ".#####.",
    ".#####.",
  ].map((row) => [...row.padEnd(catColumns, ".")]);
  for (const [x, y] of tail) grid[y][x] = "#";
  return grid.map((row) => row.join(""));
}
/**
 * 小猫：身体是心情的颜色（平静是正文色、处理中白、等你橙）；等待输入的会话占几成，就从下往上灌几成蓝（agentCatFillRows）。
 * 等你时右边一列「!」一闪一闪、小猫往上一跳；处理中右边冒思考泡泡。
 */
export function PixelCat({
  mood,
  color,
  fill,
  px = 2,
  blue = "#4a8dff",
  style,
}: {
  mood: CatMood;
  color: string;
  fill: number;
  px?: number;
  blue?: string;
  style?: CSSProperties;
}) {
  const rows = catRows(mood);
  const level = rows.length - fill;
  return (
    <svg
      className={`vi-cat-glyph vi-cat-${mood}`}
      width={catColumns * px}
      height={8 * px}
      viewBox={`0 0 ${catColumns} 8`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={style}
    >
      <g className="vi-cat-body">
        {rows.flatMap((row, y) =>
          [...row].map((cell, x) =>
            cell === "." ? null : (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="1"
                height="1"
                fill={y >= level ? blue : color}
                opacity={cell === "+" ? 0.42 : 1}
              />
            ),
          ),
        )}
      </g>
      <path
        d="M3.1 4.7 3.5 4.3 3.9 4.7"
        fill="none"
        stroke="#000"
        strokeWidth=".275"
        strokeLinejoin="miter"
      />
      {mood === "waiting" && (
        <g className="vi-cat-mark" fill={color}>
          {[0, 1, 2, 4].map((y) => (
            <rect key={y} x="10" y={y} width="1" height="1" />
          ))}
        </g>
      )}
      {mood === "working" && (
        <g className="vi-cat-think" fill={color}>
          {[7, 5, 3].map((y, index) => (
            <rect
              key={y}
              x="10"
              y={y}
              width="1"
              height="1"
              style={{ animationDelay: `${index * 0.22}s` }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}

/* ---------- 用量电池：照 agentBatteryShape，高 16，细的 6、粗的 9。 ---------- */
const half = (v: number) => Math.round(v * 2) / 2;
export function Battery({
  remaining,
  thin = false,
}: {
  remaining: number;
  thin?: boolean;
}) {
  const w = thin ? 6 : 9,
    h = 16;
  const stroke = Math.max(1, half(w * 0.12)),
    gap = Math.max(0.5, half(w * 0.09));
  const capThick = Math.max(1, half(w * 0.15)),
    capLength = Math.max(2, half(w * 0.36)),
    capGap = Math.max(0.5, half(w * 0.05));
  const body = { x: 0, y: capThick + capGap, w, h: h - capThick - capGap };
  const radius = half(w * 0.3);
  const inner = {
    x: stroke + gap,
    y: body.y + stroke + gap,
    w: w - 2 * (stroke + gap),
    h: body.h - 2 * (stroke + gap),
  };
  const level = Math.max(0, Math.min(1, remaining));
  const fillH =
    level <= 0 ? 0 : Math.min(inner.h, Math.max(1, half(inner.h * level)));
  const color = level <= 0.2 ? "#ff6246" : level <= 0.5 ? "#ff9233" : "#34d158";
  const glass = "rgba(245,245,247,.55)";
  const id = `vi-bat-${thin ? "t" : "w"}-${Math.round(level * 100)}`;
  return (
    <svg
      className="vi-battery"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
    >
      <rect
        x={stroke / 2}
        y={body.y + stroke / 2}
        width={w - stroke}
        height={body.h - stroke}
        rx={radius - stroke / 2}
        fill="none"
        stroke={glass}
        strokeWidth={stroke}
      />
      <path
        d={`M${(w - capLength) / 2} ${capThick}V${capThick / 2}a${capThick / 2} ${capThick / 2} 0 0 1 ${capThick / 2}-${capThick / 2}h${capLength - capThick}a${capThick / 2} ${capThick / 2} 0 0 1 ${capThick / 2} ${capThick / 2}V${capThick}z`}
        fill={glass}
      />
      {fillH > 0 && (
        <>
          <clipPath id={id}>
            <rect
              x={inner.x}
              y={inner.y + inner.h - fillH}
              width={inner.w}
              height={fillH}
            />
          </clipPath>
          <rect
            x={inner.x}
            y={inner.y}
            width={inner.w}
            height={inner.h}
            rx={Math.max(0.5, Math.min(inner.w / 2, radius - stroke - gap))}
            fill={color}
            clipPath={`url(#${id})`}
          />
        </>
      )}
    </svg>
  );
}

/* ---------- Claude / OpenAI 标志：原生 Agents.swift 的 claudeLogoPath、openAILogoPath，24 × 24。 ---------- */
const claudePath =
  "M4.709 15.955L9.429 13.308L9.509 13.078L9.429 12.95L9.2 12.95L8.41 12.902L5.712 12.829L3.373 12.732L1.107 12.61L0.536 12.489L0 11.784L0.055 11.432L0.535 11.111L1.221 11.171L2.741 11.274L5.019 11.432L6.671 11.529L9.12 11.784L9.509 11.784L9.564 11.627L9.43 11.529L9.327 11.432L6.969 9.836L4.417 8.148L3.081 7.176L2.357 6.685L1.993 6.223L1.835 5.215L2.491 4.493L3.372 4.553L3.597 4.614L4.49 5.3L6.398 6.776L8.889 8.609L9.254 8.913L9.399 8.81L9.418 8.737L9.254 8.463L7.899 6.017L6.453 3.527L5.809 2.495L5.639 1.876C5.574 1.638 5.539 1.393 5.535 1.147L6.283 0.134L6.696 0L7.692 0.134L8.112 0.498L8.732 1.912L9.734 4.141L11.289 7.171L11.745 8.069L11.988 8.901L12.079 9.156L12.237 9.156L12.237 9.01L12.365 7.304L12.602 5.209L12.832 2.514L12.912 1.754L13.288 0.844L14.035 0.352L14.619 0.632L15.099 1.317L15.032 1.761L14.746 3.612L14.187 6.515L13.823 8.457L14.035 8.457L14.278 8.215L15.263 6.909L16.915 4.845L17.645 4.025L18.495 3.121L19.042 2.69L20.075 2.69L20.835 3.819L20.495 4.985L19.431 6.332L18.55 7.474L17.286 9.174L16.496 10.534L16.569 10.644L16.757 10.624L19.613 10.018L21.156 9.738L22.997 9.423L23.83 9.811L23.921 10.206L23.593 11.013L21.624 11.499L19.315 11.961L15.876 12.774L15.834 12.804L15.883 12.865L17.432 13.011L18.094 13.047L19.716 13.047L22.736 13.272L23.526 13.794L24 14.432L23.921 14.917L22.706 15.537L21.066 15.148L17.237 14.238L15.925 13.909L15.743 13.909L15.743 14.019L16.836 15.087L18.842 16.897L21.351 19.227L21.478 19.805L21.156 20.26L20.816 20.211L18.611 18.554L17.76 17.807L15.834 16.187L15.706 16.187L15.706 16.357L16.15 17.006L18.495 20.527L18.617 21.607L18.447 21.96L17.839 22.173L17.171 22.051L15.797 20.126L14.382 17.959L13.239 16.016L13.099 16.096L12.425 23.35L12.109 23.72L11.38 24L10.773 23.539L10.451 22.792L10.773 21.316L11.162 19.392L11.477 17.862L11.763 15.962L11.933 15.33L11.921 15.288L11.781 15.306L10.347 17.273L8.167 20.218L6.441 22.063L6.027 22.227L5.31 21.857L5.377 21.195L5.778 20.606L8.166 17.57L9.606 15.688L10.536 14.602L10.53 14.444L10.475 14.444L4.132 18.56L3.002 18.706L2.515 18.25L2.576 17.504L2.807 17.261L4.715 15.949L4.709 15.955Z";
const openAIPath =
  "M9.205 8.658L9.205 6.398C9.205 6.208 9.277 6.065 9.443 5.97L13.986 3.354C14.605 2.997 15.342 2.831 16.103 2.831C18.957 2.831 20.765 5.043 20.765 7.397C20.765 7.564 20.765 7.754 20.741 7.944L16.031 5.185C15.77 5.019 15.436 5.019 15.175 5.185L9.205 8.658ZM19.814 17.458L19.814 12.06C19.814 11.727 19.671 11.49 19.385 11.323L13.415 7.85L15.365 6.732C15.509 6.637 15.697 6.637 15.841 6.732L20.384 9.349C21.693 10.109 22.573 11.727 22.573 13.297C22.573 15.105 21.503 16.77 19.813 17.46ZM7.802 12.703L5.852 11.561C5.685 11.466 5.613 11.323 5.613 11.133L5.613 5.899C5.613 3.354 7.563 1.427 10.204 1.427C11.204 1.427 12.131 1.76 12.916 2.355L8.23 5.067C7.945 5.233 7.802 5.471 7.802 5.804L7.802 12.702ZM12 15.128L9.205 13.558L9.205 10.228L12 8.658L14.795 10.228L14.795 13.558L12 15.128ZM13.796 22.358C12.796 22.358 11.869 22.026 11.084 21.431L15.77 18.719C16.055 18.553 16.198 18.315 16.198 17.982L16.198 11.084L18.172 12.226C18.339 12.321 18.41 12.464 18.41 12.654L18.41 17.887C18.41 20.432 16.436 22.359 13.796 22.359ZM8.159 17.055L3.615 14.438C2.307 13.677 1.427 12.06 1.427 10.49C1.421 8.665 2.521 7.019 4.21 6.327L4.21 11.75C4.21 12.083 4.353 12.321 4.638 12.488L10.585 15.937L8.635 17.055C8.491 17.15 8.303 17.15 8.159 17.055ZM7.897 20.955C5.209 20.955 3.235 18.934 3.235 16.436C3.235 16.246 3.259 16.056 3.282 15.866L7.968 18.576C8.254 18.743 8.539 18.743 8.824 18.576L14.794 15.128L14.794 17.388C14.794 17.578 14.724 17.721 14.557 17.816L10.014 20.432C9.395 20.789 8.658 20.955 7.897 20.955ZM13.796 23.785C16.622 23.785 19.057 21.797 19.623 19.029C22.287 18.339 24 15.84 24 13.296C24 11.631 23.287 10.014 22.002 8.848C22.121 8.348 22.192 7.849 22.192 7.35C22.192 3.949 19.433 1.403 16.246 1.403C15.604 1.403 14.986 1.498 14.366 1.713C13.256 0.62 11.763 0.006 10.205 0C7.379 0 4.943 1.988 4.378 4.757C1.713 5.447 0 7.945 0 10.49C0 12.156 0.713 13.773 1.998 14.938C1.879 15.438 1.808 15.938 1.808 16.437C1.808 19.838 4.567 22.383 7.754 22.383C8.396 22.383 9.014 22.288 9.634 22.074C10.744 23.167 12.238 23.782 13.796 23.787Z";

export type AgentKind = "claude" | "codex";
/** 边长照原生：Claude 17 格、OpenAI 15 格，乘上 px；处理中 Claude 呼吸、OpenAI 的结顺时针转。 */
export function AgentLogo({
  agent,
  px = 1,
  busy = false,
  dim = false,
}: {
  agent: AgentKind;
  px?: number;
  busy?: boolean;
  dim?: boolean;
}) {
  const side = (agent === "claude" ? 17 : 15) * px;
  return (
    <svg
      className={`vi-agent-logo ${busy ? `vi-agent-logo-busy-${agent}` : ""}`}
      width={side}
      height={side}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ opacity: dim ? 0.5 : 1 }}
    >
      <path
        d={agent === "claude" ? claudePath : openAIPath}
        fill={agent === "claude" ? "#d97757" : "#f5f5f7"}
        fillRule="evenodd"
      />
    </svg>
  );
}

/** 会话行 logo 后面的状态光标：16 × 16；处理中是圆环加载圈，其余是 6 × 12 的圆角竖条加同色辉光，轮到你时像终端光标一样闪。 */
export function AgentCursor({
  color,
  spinning = false,
  blink = false,
}: {
  color: string;
  spinning?: boolean;
  blink?: boolean;
}) {
  if (spinning)
    return (
      <svg
        className="vi-agent-cursor vi-agent-spinner"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="vi-spin-arc" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          cx="8"
          cy="8"
          r="5.5"
          fill="none"
          stroke={color}
          strokeOpacity=".18"
          strokeWidth="3"
        />
        <path
          d="M8 2.5a5.5 5.5 0 0 1 5.08 7.6"
          fill="none"
          stroke="url(#vi-spin-arc)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  return (
    <svg
      className={`vi-agent-cursor ${blink ? "vi-agent-blink" : ""}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{
        filter:
          color === "#8e8e93" ? undefined : `drop-shadow(0 0 3px ${color})`,
      }}
    >
      <rect x="5" y="2" width="6" height="12" rx="3" fill={color} />
    </svg>
  );
}
