// 客户端只导入语言工具，避免把双语文案一起打包。

export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** 英文使用无前缀路径，中文使用 /zh。 */
export const localizedPath = (locale: Locale, path = "") =>
  `${locale === defaultLocale ? "" : `/${locale}`}${path}` || "/";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** BCP 47 tags used for `<html lang>`, hreflang and `inLanguage`. */
export const localeTag: Record<Locale, string> = { zh: "zh-CN", en: "en" };
export const ogLocale: Record<Locale, string> = { zh: "zh_CN", en: "en_AU" };
