import type { Metadata } from "next";
import Link from "next/link";
import { helveticaRounded, inter, instrumentSans, notoSansSC } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 · Void Vision",
  description: "这个页面不存在。This page doesn’t exist.",
};

// Bilingual: unmatched URLs have no locale to render in.
export default function GlobalNotFound() {
  return (
    <html lang="zh-CN" className={`${instrumentSans.variable} ${inter.variable} ${notoSansSC.variable} ${helveticaRounded.variable}`}>
      <body>
        <main id="main" className="not-found">
          <p className="legal-kicker">404</p>
          <h1>这个页面不存在。</h1>
          <p lang="en">This page doesn’t exist. It may have moved, or the link may be mistyped.</p>
          <p className="not-found-links">
            <Link href="/zh">返回首页</Link>
            <Link href="/" lang="en">Back to home</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
