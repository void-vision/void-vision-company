import { NextResponse, type NextRequest } from "next/server";

/** 对外英文无前缀，内部复用现有 /en 页面；旧英文链接永久跳转。 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/zh" || pathname.startsWith("/zh/")) return;
  const url = request.nextUrl.clone();
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // 静态资源、元数据文件与 Next 内部请求保持原路径。
  matcher: ["/((?!_next/|icon|apple-icon|.*\\.[\\w-]+$).*)"],
};
