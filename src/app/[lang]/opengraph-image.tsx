import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { locales } from "@/content/i18n";

export const alt = "Void Vision — 从虚空中看见未来 · See the unseen in the void";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OpenGraphImage() {
  const [mark, word, rounded] = await Promise.all([
    readFile(join(process.cwd(), "public/images/vv-mark.png")),
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
        <img src={src(mark)} width={277} height={85} alt="" />
        <img src={src(word)} width={433} height={34} alt="" style={{ marginTop: 34 }} />
        <div style={{ marginTop: 44, fontSize: 30, letterSpacing: 8, color: "#c4cede" }}>SEE THE UNSEEN IN THE VOID</div>
        <div style={{ marginTop: 56, display: "flex", gap: 36, fontFamily: "Rounded", fontSize: 28, color: "#99a4b1" }}>
          <span>VoidBook</span>
          <span>Airfluence</span>
          <span>Unilinx</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Rounded", data: rounded, weight: 700, style: "normal" }] },
  );
}
