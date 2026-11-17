import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { companyBrand } from "@/lib/brand";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  const mark = await readFile(join(process.cwd(), "public", companyBrand.mark.rasterSrc));
  const width = Math.round(size.width * 0.88);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: companyBrand.background }}>
        <img src={`data:image/png;base64,${mark.toString("base64")}`} width={width} height={Math.round(width * companyBrand.mark.height / companyBrand.mark.width)} alt="" />
      </div>
    ),
    size,
  );
}
