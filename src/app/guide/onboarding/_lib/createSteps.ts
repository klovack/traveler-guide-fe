import { useTranslations } from "next-intl";

export function createSteps(t: ReturnType<typeof useTranslations>, namespace: string) {
  const numOfSteps = 8;
  return Array.from({ length: numOfSteps }, (_, i) => ({
    n: i + 1,
    label: t(`${namespace}.steps.${i + 1}.label`),
    description: t(`${namespace}.steps.${i + 1}.title`),
  }));
}
