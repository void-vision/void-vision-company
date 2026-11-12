import Link from "next/link";
import { type Locale } from "@/content/i18n";

/** 使用显式语言路径切换，不再根据 cookie 改写首页语言。 */
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
    >
      {text}
    </Link>
  );
}
