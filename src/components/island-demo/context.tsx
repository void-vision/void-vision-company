"use client";

import { createContext, useContext } from "react";
import type { IslandDemoContent } from "@/content/site";

export type Text = (key: string, values?: Record<string, unknown>) => string;
const DemoContext = createContext<IslandDemoContent | null>(null);
export const DemoProvider = DemoContext.Provider;

export function useDemoContent() {
  const content = useContext(DemoContext);
  if (!content) throw new Error("缺少互动演示文案");
  return content;
}

/** 插值只处理演示数据，文案由服务端按当前语言提供。 */
export function useText(): Text {
  const { text } = useDemoContent();
  return (key, values = {}) =>
    (text[key] ?? key).replace(/\{(v\d+)\}/g, (_, name) =>
      String(values[name] ?? ""),
    );
}
