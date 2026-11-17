import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { basename, resolve } from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';

// 构造图直接读取官网定稿源文件，输出到不对外提供的设计目录。
const folder = process.argv[3] ? `${resolve(process.argv[3])}/` : fileURLToPath(new URL('../design/brand/', import.meta.url));
const sourcePath = process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL('../public/images/void-vision-logo.svg', import.meta.url));
const version = process.argv[4] ?? '方案 03 · 微调定稿';
const source = await readFile(sourcePath, 'utf8');
const defs = source.match(/<defs>[\s\S]*?<\/defs>/)?.[0];
if (!defs) throw new Error('未找到当前方案的矢量定义');
const paths = [...source.matchAll(/<path id="([^"]+)" d="([^"]+)"\/>/g)].map(([, id, d]) => ({ id, d }));
assert.equal(paths.length, 3);

// 直接解析交付 SVG 中的曲线，不另画一套近似轮廓。
function parse(d) {
  const tokens = d.match(/[MCAZ]|-?(?:\d*\.)?\d+(?:e[+-]?\d+)?/gi);
  let current = [0, 0];
  let start = current;
  const segments = [];
  const point = () => [Number(tokens.shift()), Number(tokens.shift())];
  while (tokens.length) {
    const command = tokens.shift();
    if (command === 'M') start = current = point();
    else if (command === 'C') {
      const c1 = point();
      const c2 = point();
      const end = point();
      segments.push({ start: current, c1, c2, end });
      current = end;
    } else if (command === 'A') {
      tokens.splice(0, 5);
      current = point();
    } else if (command === 'Z') current = start;
    else throw new Error(`不支持的路径指令：${command}`);
  }
  return segments;
}

const parsed = paths.map((path) => ({ ...path, segments: parse(path.d) }));
const leftTip = parsed.find((path) => path.id === 'left').segments[0].end;
const rightTip = parsed.find((path) => path.id === 'outer-flow').segments[0].end;
assert.equal(leftTip[1], 0);
assert.equal(rightTip[1], 0);
assert.equal(-leftTip[0], rightTip[0]);
const tipLength = Math.abs(leftTip[0]);
const bg = '#0b131b';
const cyan = '#65d9eb';
const amber = '#edb773';
const purple = '#c6a1f3';
const cx = 650;
const cy = 640;
const scale = 1.35;
const degrees = Math.PI / 6;
const project = ([x, y]) => [cx + scale * (x * Math.cos(degrees) + y * Math.sin(degrees)), cy + scale * (-x * Math.sin(degrees) + y * Math.cos(degrees))];
const line = (a, b, stroke, attrs = '') => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${stroke}" ${attrs}/>`;
const text = (x, y, content, size = 20, fill = '#c7d4df', attrs = '') => `<text x="${x}" y="${y}" font-family="PingFang SC, Noto Sans CJK SC, sans-serif" font-size="${size}" fill="${fill}" ${attrs}>${content}</text>`;

const grid = [];
for (let x = -416; x <= 416; x += 32) grid.push(line([x, -256], [x, 256], '#263642', 'stroke-width="0.6"'));
for (let y = -256; y <= 256; y += 32) grid.push(line([-448, y], [448, y], '#263642', 'stroke-width="0.6"'));

const guides = [];
for (const path of parsed) {
  const color = path.id === 'outer-flow' ? purple : amber;
  guides.push(`<use href="#${path.id}" fill="none" stroke="${path.id === 'outer-flow' ? purple : cyan}" stroke-width="0.85"/>`);
  for (const { start, c1, c2, end } of path.segments) {
    guides.push(line(start, c1, color, 'stroke-width="0.75" opacity="0.75"'));
    guides.push(line(c2, end, color, 'stroke-width="0.75" opacity="0.75"'));
    guides.push(line(c1, c2, color, 'stroke-width="0.6" stroke-dasharray="3 4" opacity="0.4"'));
    for (const [x, y] of [c1, c2]) guides.push(`<rect x="${x - 2.1}" y="${y - 2.1}" width="4.2" height="4.2" fill="${bg}" stroke="${color}" stroke-width="0.8"/>`);
    for (const [x, y] of [start, end]) guides.push(`<circle cx="${x}" cy="${y}" r="2.5" fill="${path.id === 'outer-flow' ? purple : cyan}"/>`);
  }
}

// 三个平滑连接点的前后控制柄共线，标注实际满足的 G1 连续性。
const jointDefinitions = [
  { id: 'J1', path: 'inner-flow', before: 0, offset: [20, 11] },
  { id: 'J2', path: 'inner-flow', before: 2, offset: [19, 24] },
  { id: 'J3', path: 'outer-flow', before: 1, offset: [-34, -16] },
];
const labels = [];
for (const joint of jointDefinitions) {
  const { segments } = parsed.find((path) => path.id === joint.path);
  const previous = segments[joint.before];
  const next = segments[joint.before + 1];
  const incoming = previous.end.map((value, i) => value - previous.c2[i]);
  const outgoing = next.c1.map((value, i) => value - next.start[i]);
  assert.ok(Math.abs(incoming[0] * outgoing[1] - incoming[1] * outgoing[0]) < 1e-8);
  assert.ok(incoming[0] * outgoing[0] + incoming[1] * outgoing[1] > 0);
  const point = project(previous.end);
  labels.push(`<circle cx="${point[0]}" cy="${point[1]}" r="6.5" fill="${bg}" stroke="${purple}" stroke-width="1.5"/>`);
  labels.push(text(point[0] + joint.offset[0], point[1] + joint.offset[1], joint.id, 17, purple));
}

const axisEnd = project([420, 0]);
const axisStart = project([-420, 0]);
const radiusEnd = project([-120, 0]);
const radiusLabel = project([-88, -11]);
const diagram = `<g clip-path="url(#drawing-area)"><g transform="translate(${cx} ${cy}) scale(${scale}) rotate(-30)">${grid.join('')}<use href="#mark" fill="#fff" opacity="0.83"/><circle r="120" fill="none" stroke="${cyan}" stroke-width="0.9"/>${guides.join('')}</g>${line(axisStart, axisEnd, cyan, 'stroke-width="1" stroke-dasharray="6 6"')}${line([cx, cy - 235], [cx, cy + 235], '#526879', 'stroke-width="0.8" stroke-dasharray="4 6"')}${line([cx, cy], [cx + 300, cy], '#526879', 'stroke-width="0.8" stroke-dasharray="4 6"')}${line([cx, cy], radiusEnd, cyan, 'stroke-width="1.5"')}${text(radiusLabel[0], radiusLabel[1], 'R = 120', 18, cyan)}<circle cx="${cx}" cy="${cy}" r="3.5" fill="${cyan}"/><path d="M ${cx + 235} ${cy} A 235 235 0 0 0 ${cx + 235 * Math.cos(degrees)} ${cy - 117.5}" fill="none" stroke="${amber}" stroke-width="1.6"/>${text(cx + 254, cy - 47, '30°', 23, amber)}${labels.join('')}</g>`;

const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1320" viewBox="0 0 1800 1320" role="img"><title>Void ${version} · 实际几何构造</title>${defs}<defs><clipPath id="drawing-area"><rect x="64" y="180" width="1190" height="940"/></clipPath></defs><rect width="1800" height="1320" fill="${bg}"/>
${text(64, 78, 'VOID / 流动错位 · 几何构造', 34, '#f0f5f9')}
${text(64, 119, `${version} · 从当前 SVG 直接提取轮廓、节点与控制柄`, 19, '#8eabbc')}
${line([64, 151], [1736, 151], '#2b3f4e')}
${diagram}
${line([1300, 207], [1300, 1097], '#2b3f4e')}
${text(1350, 250, '构造参数', 25, '#f0f5f9')}
${text(1350, 305, '中央留白', 17, '#8eabbc')}
${text(1350, 341, '圆弧半径 R = 120', 24, '#eef3f7')}
${text(1350, 408, '整体主轴', 17, '#8eabbc')}
${text(1350, 444, '相对水平线向上 30°', 24, '#eef3f7')}
${text(1350, 478, `长尖端至圆心 L = ${tipLength}`, 19, '#8eabbc')}
${text(1350, 511, '轮廓组成', 17, '#8eabbc')}
${text(1350, 547, '3 个独立闭合形状', 24, '#eef3f7')}
${text(1350, 580, '左瓣 · 内侧曲面 · 外侧曲面', 19, '#8eabbc')}
${text(1350, 647, '曲线控制', 17, '#8eabbc')}
${text(1350, 683, '9 段三次贝塞尔曲线', 24, '#eef3f7')}
${text(1350, 716, '2 段圆弧保留中央圆形边界', 19, '#8eabbc')}
${text(1350, 783, '平滑连接', 17, '#8eabbc')}
${text(1350, 819, 'J1 / J2 / J3', 25, purple)}
${text(1350, 854, '节点两侧的控制柄共线', 20, '#eef3f7')}
${text(1350, 887, '切线方向连续（G1）', 20, '#eef3f7')}
${text(1350, 954, '错位留白', 17, '#8eabbc')}
${text(1350, 990, '由两条完整曲面共同围成', 22, '#eef3f7')}
${text(1350, 1025, '渐细缝隙与轮廓共同延展', 19, '#8eabbc')}
${line([64, 1154], [1736, 1154], '#2b3f4e')}
${line([64, 1200], [106, 1200], cyan, 'stroke-width="2"')}${text(120, 1207, '圆弧、轮廓与主轴', 20, cyan)}
${line([480, 1200], [522, 1200], amber, 'stroke-width="2"')}${text(536, 1207, '左瓣与内侧曲面控制柄', 20, amber)}
${line([990, 1200], [1032, 1200], purple, 'stroke-width="2"')}${text(1046, 1207, '外侧曲面控制柄与连接点', 20, purple)}
${text(64, 1264, '方格间距：32 单位。轮廓引用交付 Logo 的同一套路径；尖端保持收尖，标记节点按切线关系校验。', 18, '#8eabbc')}
</svg>`;

await mkdir(folder, { recursive: true });
await writeFile(`${folder}void-vision-construction.svg`, sheet);
await sharp(Buffer.from(sheet)).png().toFile(`${folder}void-vision-construction.png`);
console.log(JSON.stringify({ source: basename(sourcePath), version, tipLength, closedShapes: parsed.length, cubicSegments: parsed.reduce((sum, path) => sum + path.segments.length, 0), verifiedJoints: jointDefinitions.map((joint) => joint.id), output: `${folder}void-vision-construction.png` }));
