import { LanguageWithFluency } from "tg-sdk";
import { SelectLanguage, SelectLanguageProps } from "./SelectLanguage";
import { ActionIcon, Group, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { LanguageFluency, SupportedLanguages } from "@/constants/languages";
import { SelectFluency, SelectFluencyProps } from "./SelectFluency";
import { useTranslations } from "next-intl";
import { IconX } from "@tabler/icons-react";
import { useDebouncedCallback } from "@mantine/hooks";

export type SelectLanguageWithFluencyProps = {
  value?: LanguageWithFluency[] | null;
  onChange?: (value: LanguageWithFluency[]) => void;
  selectLanguageProps?: Omit<SelectLanguageProps, "value" | "onChange">;
  selectFluencyProps?: Omit<SelectFluencyProps, "value" | "onChange">;
};

export function SelectLanguageWithFluency(
  props: Readonly<SelectLanguageWithFluencyProps>
) {
  const t = useTranslations();
  const [langs, setLangs] = useState<SupportedLanguages[]>(
    props.value?.map((l) => l.code) ?? []
  );

  const [fluencies, setFluencies] = useState<
    Record<SupportedLanguages, LanguageFluency>
  >(
    Object.fromEntries(
      props.value?.map((l) => [l.code, l.fluency]) ?? []
    ) as Record<SupportedLanguages, LanguageFluency>
  );

  const handleLanguageChange = (value: SupportedLanguages[]) => {
    setLangs(value);
    setFluencies((prevFluency) => {
      const newFluencies: Record<SupportedLanguages, LanguageFluency> =
        {} as Record<SupportedLanguages, LanguageFluency>;
      value.forEach((lang) => {
        if (prevFluency[lang]) {
          newFluencies[lang] = prevFluency[lang];
        }
      });
      return newFluencies;
    });
    handleOnChangeDebounced();
  };

  const handleDeleteLanguage: (language: SupportedLanguages) => void = (
    language
  ) => {
    const newLangs = langs.filter((l) => l !== language);
    setLangs(newLangs);
    setFluencies((prevFluency) => {
      const newFluencies: Record<SupportedLanguages, LanguageFluency> =
        {} as Record<SupportedLanguages, LanguageFluency>;
      newLangs.forEach((lang) => {
        if (prevFluency[lang]) {
          newFluencies[lang] = prevFluency[lang];
        }
      });
      return newFluencies;
    });
    handleOnChangeDebounced();
  };

  useEffect(() => {
    setLangs(props.value?.map((l) => l.code) ?? []);
    setFluencies(
      Object.fromEntries(
        props.value?.map((l) => [l.code, l.fluency]) ?? []
      ) as Record<SupportedLanguages, LanguageFluency>
    );
  }, [props.value]);

  const handleOnChangeDebounced = useDebouncedCallback(() => {
    if (props.onChange) {
      props.onChange(
        langs.map((lang) => ({ code: lang, fluency: fluencies[lang] }))
      );
    }
  }, 300);

  return (
    <>
      <SelectLanguage
        value={langs}
        onChange={handleLanguageChange}
        label={t("common.languages.label")}
        placeholder={t("common.languages.placeholder")}
        onRemove={(value) => handleDeleteLanguage(value as SupportedLanguages)}
        {...props.selectLanguageProps}
      />

      <Stack w="100%" mt="sm">
        {langs.map((lang) => (
          <Group w="100%" gap="xs" key={lang} align="flex-end">
            <SelectFluency
              style={{ flexGrow: 1 }}
              label={t(`common.languages.options.${lang}`)}
              placeholder={t("common.languages.fluency.placeholder")}
              value={fluencies[lang] || undefined}
              onChange={(value) => {
                setFluencies((prevFluency) => {
                  return {
                    ...prevFluency,
                    [lang]: value as LanguageFluency,
                  };
                });
                handleOnChangeDebounced();
              }}
              {...props.selectFluencyProps}
            />

            <ActionIcon
              style={{
                position: "relative",
                top: "-0.5rem",
              }}
              variant="transparent"
              color="gray"
              onClick={() => handleDeleteLanguage(lang)}
            >
              <IconX style={{ width: "70%", height: "70%" }} />
            </ActionIcon>
          </Group>
        ))}
      </Stack>
    </>
  );
}
