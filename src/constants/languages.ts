import { IndonesiaRegionalLanguagesEnum, LanguagesEnum } from "tg-sdk";

export const LANGUAGES: LanguagesEnum[] = [
  "en",
  "id",
  "es",
  "fr",
  "de",
  "it",
  "nl",
  "pt",
  "ru",
  "zh",
  "ja",
  "ko",
] as const;

export const INDONESIAN_REGIONAL_LANGUAGES: IndonesiaRegionalLanguagesEnum[] = [
  "jawa",
  "sunda",
  "batak",
  "madura",
  "bali",
  "bugis",
  "aceh",
  "banjar",
  "betawi",
  "minangkabau",
  "sasak",
  "toraja",
  "ambon",
  "papua",
] as const;
export const ALL_LANGUAGES = [...LANGUAGES, ...INDONESIAN_REGIONAL_LANGUAGES] as const;

export type LanguageFluency = "basic" | "conversational" | "fluent" | "native";
export const FLUENCY: LanguageFluency[] = [
  "basic",
  "conversational",
  "fluent",
  "native",
] as const;

export type SupportedLanguages = LanguagesEnum | IndonesiaRegionalLanguagesEnum;