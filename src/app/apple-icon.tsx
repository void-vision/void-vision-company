import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function Icon() {
  const mark = await readFile(join(process.cwd(), "public/images/vv-mark.png"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#04060c" }}>
        <img src={`data:image/png;base64,${mark.toString("base64")}`} width={Math.round(180 * 0.72)} height={Math.round(180 * 0.72 * 340 / 1108)} alt="" />
      </div>
    ),
    size,
  );
}
