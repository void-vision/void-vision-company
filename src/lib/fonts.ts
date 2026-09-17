import { Instrument_Sans, Noto_Sans_SC } from "next/font/google";
import localFont from "next/font/local";

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
});

// CJK font is served as unicode-range slices; preloading all of them would hurt LCP.
export const notoSansSC = Noto_Sans_SC({
  weight: ["300", "400", "500"],
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
