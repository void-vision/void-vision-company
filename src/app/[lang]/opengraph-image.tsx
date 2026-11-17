import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { locales } from "@/content/i18n";
import { companyBrand } from "@/lib/brand";

export const alt = "Void Vision — Put AI into the products people actually use every day.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 与首页产品墙同序；分享图不区分语言，产品名本身就是英文。
const PRODUCTS = ["Airfluence", "VoidBook", "Voido", "Void Island", "Unilinx"];

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OpenGraphImage() {
  const [mark, word, rounded] = await Promise.all([
    readFile(join(process.cwd(), "public", companyBrand.mark.rasterSrc)),
    readFile(join(process.cwd(), "public/images/vv-wordmark.png")),
    readFile(join(process.cwd(), "src/fonts/HelveticaRoundedBold.otf")),
  ]);
  const src = (buf: Buffer) => `data:image/png;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 45%, #04060c 0%, #04060c 30%, rgba(152,176,224,0.55) 38%, #0a1830 52%, #04060c 80%)",
          color: "#f2f4f7",
        }}
      >
        <img src={src(mark)} width={220} height={Math.round(220 * companyBrand.mark.height / companyBrand.mark.width)} alt="" />
        <img src={src(word)} width={433} height={34} alt="" style={{ marginTop: 24 }} />
        <div style={{ marginTop: 44, fontSize: 34, letterSpacing: -0.5, color: "#e6ebf2" }}>Put AI into the products people actually use every day.</div>
        <div style={{ marginTop: 52, display: "flex", gap: 34, fontFamily: "Rounded", fontSize: 26, color: "#99a4b1" }}>
          {PRODUCTS.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Rounded", data: rounded, weight: 700, style: "normal" }] },
  );
}
