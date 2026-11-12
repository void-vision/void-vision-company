import { describe, expect, test } from "bun:test";
import { NextRequest } from "next/server";
import { proxy } from "../src/proxy";
import { homeJsonLd, languageAlternates, localizedPath } from "../src/lib/seo";

describe("英文默认路径", () => {
  test("中文浏览器和旧语言 cookie 不改变英文首页", () => {
    const request = new NextRequest("https://voidvision.ai/?from=demo", {
      headers: { "accept-language": "zh-CN,zh;q=0.9", cookie: "vv-locale=zh" },
    });
    const response = proxy(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBe("https://voidvision.ai/en?from=demo");
  });

  test.each(["/zh", "/zh/privacy"])("中文路径 %s 直接呈现", (path) => {
    expect(proxy(new NextRequest(`https://voidvision.ai${path}`))).toBeUndefined();
  });

  test.each([["/en", "/"], ["/en/privacy", "/privacy"]])("旧路径 %s 永久跳转并保留参数", (oldPath, path) => {
    const response = proxy(new NextRequest(`https://voidvision.ai${oldPath}?from=demo`));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(`https://voidvision.ai${path}?from=demo`);
  });

  test("英文隐私页使用无前缀路径", () => {
    const response = proxy(new NextRequest("https://voidvision.ai/privacy"));
    expect(response.headers.get("x-middleware-rewrite")).toBe("https://voidvision.ai/en/privacy");
    expect(localizedPath("en", "/privacy")).toBe("/privacy");
  });

  test("搜索引擎与结构化数据公开规范路径", () => {
    expect(languageAlternates("")).toEqual({
      "zh-CN": "https://voidvision.ai/zh", en: "https://voidvision.ai/", "x-default": "https://voidvision.ai/",
    });
    expect(languageAlternates("/privacy").en).toBe("https://voidvision.ai/privacy");
    const page = homeJsonLd("en")["@graph"].find((item) => item["@type"] === "WebPage");
    expect(page.url).toBe("https://voidvision.ai/");
  });
});
