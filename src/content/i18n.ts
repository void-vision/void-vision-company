// Locale constants, kept separate from the copy so client components can
// import them without bundling the dictionaries.

export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";
/** Remembers an explicit language choice so "/" redirects to it next time. */
export const localeCookie = "vv-locale";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** BCP 47 tags used for `<html lang>`, hreflang and `inLanguage`. */
export const localeTag: Record<Locale, string> = { zh: "zh-CN", en: "en" };
export const ogLocale: Record<Locale, string> = { zh: "zh_CN", en: "en_AU" };
