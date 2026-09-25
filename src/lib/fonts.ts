import { Instrument_Sans, Noto_Sans_SC } from "next/font/google";
import localFont from "next/font/local";

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
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
