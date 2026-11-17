import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const images = new URL("../public/images/", import.meta.url);
const logo = await readFile(new URL("void-vision-logo.svg", images), "utf8");

// 保留选定标志的路径和 30° 变换，只为导航与分享图裁去方形画布的空白。
const mark = logo
  .replace('width="1024" height="1024" viewBox="0 0 1024 1024"', 'width="739" height="437" viewBox="143 293 739 437"')
  .replace(/<rect[^>]+\/>/, "");

await writeFile(new URL("void-vision-mark.svg", images), mark);
await sharp(Buffer.from(mark)).resize(1478, 874).png().toFile(fileURLToPath(new URL("void-vision-mark.png", images)));
await sharp(Buffer.from(logo)).png().toFile(fileURLToPath(new URL("void-vision-logo.png", images)));
console.log("已导出官网品牌资产：透明底标志、分享图 PNG 与黑底方形 Logo。");
