import {
  INDONESIAN_REGIONAL_LANGUAGES,
  LANGUAGES,
  SupportedLanguages,
} from "@/constants/languages";
import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { useTranslations } from "next-intl";

export type SelectLanguageProps =
  | Omit<MultiSelectProps, "data">
  | {
      onChange?: (value: SupportedLanguages[]) => void;
    };

export function SelectLanguage(props: Readonly<SelectLanguageProps>) {
  const t = useTranslations();

  return (
    <MultiSelect
      label={t("common.languages.label")}
      data={[
        {
          group: "International",
          items: LANGUAGES.filter((l) => t.has(`common.languages.options.${l}`))
            .map((l) => ({
              value: l,
              label: t(`common.languages.options.${l}`),
            }))
            .toSorted((a, b) => a.label.localeCompare(b.label)),
        },
        {
          group: "Regional",
          items: INDONESIAN_REGIONAL_LANGUAGES.map((l) => ({
            value: l,
            label: t(`common.languages.options.${l}`),
          })).toSorted((a, b) => a.label.localeCompare(b.label)),
        },
      ]}
      {...props}
      onChange={(value) => props.onChange?.(value as SupportedLanguages[])}
    />
  );
}
