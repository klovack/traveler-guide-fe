'use server';

import { cookies } from 'next/headers';
import { Locale, defaultLocale, locales } from "@/i18n/config";
import { FlagProps } from 'react-flagpack';

// Now the locale is read from a cookie. We could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (value && locales.includes(value as Locale)) {
    return value as Locale;
  }
  return defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}