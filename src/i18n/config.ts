import { FlagProps } from "react-flagpack";

export type Locale = (typeof locales)[number];

export const locales = ['id', 'en', 'de'] as const;
export const defaultLocale: Locale = 'id';
export const localeToFlag: Record<Locale, FlagProps["code"]> = {
  id: "ID",
  en: "GBR",
  de: "DE",
};
