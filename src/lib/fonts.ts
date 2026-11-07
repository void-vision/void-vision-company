import { Instrument_Sans, Inter, Noto_Sans_SC } from "next/font/google";
import localFont from "next/font/local";

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
});

// 英文正文（宣言、产品描述、团队、法律页）。Instrument Sans 没有 300，撑不起轻的段落。
// 正文都在首屏以下，且 /zh 不会用到，所以不预加载。
export const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

// 中文使用可变字重，保证首屏 300 到 400 的呼吸动画连续过渡。
// 字体仍按 unicode-range 切片加载；全部预加载会拖慢 LCP。
export const notoSansSC = Noto_Sans_SC({
  weight: "variable",
  variable: "--font-noto-sc",
  display: "swap",
  preload: false,
});

export const helveticaRounded = localFont({
  src: "../fonts/HelveticaRoundedBold.otf",
  weight: "700",
  variable: "--font-rounded",
  display: "swap",
});
