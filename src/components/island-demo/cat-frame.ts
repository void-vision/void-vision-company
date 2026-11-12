import type { CatMood } from "./glyphs";

/** 原生 agentCatFrame 的三种演示状态，时间单位为秒，位移单位为逻辑像素。 */
export function catFrame(mood: CatMood, time: number, animated: boolean) {
  const t = animated ? time : 0;
  const cycle = (period: number) => t % period;
  const step = (period: number) => Math.floor(t / period);
  let ears = "#.....#",
    eyes = "#.###.#",
    paws = ".#####.";
  let tail = [
    [6, 7],
    [7, 6],
    [8, 5],
  ];
  let marks: number[][] = [];
  let dy = 0;
  if (mood === "calm") {
    if (cycle(4.2) > 4.05) eyes = "#+###+#";
    if (cycle(3.1) >= 2.5 && cycle(3.1) < 2.9)
      tail = [
        [6, 7],
        [7, 7],
        [8, 6],
      ];
    if (cycle(7.3) > 7.1) ears = "#......";
  } else if (mood === "working") {
    paws = step(0.16) % 2 === 0 ? ".#.###." : ".###.#.";
    dy = step(0.32) % 2 === 0 ? 0 : -1;
    if (step(0.6) % 2 === 1)
      tail = [
        [6, 7],
        [7, 7],
        [8, 6],
      ];
    marks = [[10, [7, 5, 3][step(0.22) % 3]]];
    if (cycle(3.6) > 3.45) eyes = "#+###+#";
  } else {
    dy = cycle(0.9) < 0.14 ? -2 : 0;
    if (step(0.45) % 2 === 0)
      marks = [
        [10, 0],
        [10, 1],
        [10, 2],
        [10, 4],
      ];
    tail = [
      [6, 7],
      [7, 6],
      [7, 5],
      [8, 4],
    ];
  }
  const grid = [
    ears,
    "##...##",
    "#######",
    eyes,
    "#######",
    ".#####.",
    ".#####.",
    paws,
  ].map((row) => [...row.padEnd(11, ".")]);
  for (const [x, y] of [...tail, ...marks]) grid[y][x] = "#";
  return { rows: grid.map((row) => row.join("")), dy: animated ? dy : 0 };
}
