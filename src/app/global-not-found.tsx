import type { Metadata } from "next";
import Link from "next/link";
import { helveticaRounded, instrumentSans, notoSansSC } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 · Void Vision",
  description: "从虚空中，什么也没找到。Nothing was found in the void.",
};

// Bilingual: unmatched URLs have no locale to render in.
export default function GlobalNotFound() {
  return (
    <html lang="zh-CN" className={`${instrumentSans.variable} ${notoSansSC.variable} ${helveticaRounded.variable}`}>
      <body>
        <main id="main" className="not-found">
          <p className="legal-kicker">404</p>
          <h1>从虚空中，什么也没找到。</h1>
          <p lang="en">Nothing was found in the void.</p>
          <p className="not-found-links">
            <Link href="/zh">返回首页</Link>
            <Link href="/en" lang="en">Back to home</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
