"use client";

import Link from "next/link";
import { localeCookie, type Locale } from "@/content/i18n";

/** Real link to the other-language URL; also remembers the choice for "/". */
export function LangSwitch({ href, target, label, text, className }: {
  href: string;
  target: Locale;
  label: string;
  text: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      hrefLang={target === "zh" ? "zh-CN" : "en"}
      lang={target === "zh" ? "zh-CN" : "en"}
      aria-label={label}
      className={className}
      onClick={() => {
        document.cookie = `${localeCookie}=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
    >
      {text}
    </Link>
  );
}
