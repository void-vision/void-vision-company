import { expect, test } from "bun:test";
import { demoState } from "../src/components/island-demo/demo-state";
const sessions = [{status:"working"}, {status:"working"}, {status:"working"}, {status:"input"}];

test("处理中按已就绪比例填蓝色，不按工作数量填充", () => {
  const state=demoState(sessions,"monitor",null,null);
  expect(state.count).toBe(4);
  expect(state.mood).toBe("working");
  expect(state.fill).toBe(2);
});
test("等待回答优先于其他工作会话，数量不丢失", () => {
  const state=demoState(sessions,"ask",null,null);
  expect(state.phases[0]).toBe("ask");
  expect(state.mood).toBe("waiting");
  expect(state.count).toBe(4);
});
test("等待审批进入相同的橙色提醒状态", () => {
  expect(demoState(sessions,"approve",null,null).mood).toBe("waiting");
});
test("回答或允许后恢复工作状态", () => {
  expect(demoState(sessions,"ask",null,"继续").mood).toBe("working");
  expect(demoState(sessions,"approve","allow",null).phases[0]).toBe("working");
});
test("拒绝与返回应用后将当前会话计入等待输入", () => {
  expect(demoState(sessions,"approve","deny",null).fill).toBe(4);
  expect(demoState(sessions,"jump",null,null).phases[0]).toBe("input");
});
test("没有等待输入的会话时不凭空填蓝色", () => {
  expect(demoState([{status:"working"}],"monitor",null,null).fill).toBe(0);
});

import { catFrame } from "../src/components/island-demo/cat-frame";
test("等待提醒只闪标记，猫的主体始终保留", () => {
  const visible=catFrame("waiting",.2,true),hidden=catFrame("waiting",.6,true);
  expect(visible.rows.some(row=>row[10]==="#")).toBe(true);
  expect(hidden.rows.every(row=>row[10]===".")).toBe(true);
  expect(visible.rows.map(row=>row.slice(0,9))).toEqual(hidden.rows.map(row=>row.slice(0,9)));
});
test("原生等待状态的轻跳与减少动态效果保持一致", () => {
  expect(catFrame("waiting",.05,true).dy).toBe(-2);
  expect(catFrame("waiting",.2,true).dy).toBe(0);
  expect(catFrame("waiting",.05,false).dy).toBe(0);
});
test("原生工作泡泡每次只有一个，按 220ms 向上移动", () => {
  const a=catFrame("working",0,true),b=catFrame("working",.23,true);
  expect(a.rows[7][10]).toBe("#");
  expect(b.rows[5][10]).toBe("#");
  expect(b.rows.filter(row=>row[10]==="#").length).toBe(1);
});
