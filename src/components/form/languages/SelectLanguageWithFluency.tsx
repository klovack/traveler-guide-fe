import { LanguageWithFluency } from "tg-sdk";
import { SelectLanguage, SelectLanguageProps } from "./SelectLanguage";
import { Grid, ActionIcon, Text, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { LanguageFluency, SupportedLanguages } from "@/constants/languages";
import { SelectFluency, SelectFluencyProps } from "./SelectFluency";
import { useTranslations } from "next-intl";
import { IconX } from "@tabler/icons-react";

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
    handleOnChange();
  };

  const handleOnChange = () => {
    props.onChange?.(
      langs.map((code) => ({ code, fluency: fluencies[code] || "" }))
    );
  };

  const handleDeleteLanguage = (language: SupportedLanguages) => {
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
    handleOnChange();
  };

  useEffect(() => {
    setLangs(props.value?.map((l) => l.code) ?? []);
    setFluencies(
      Object.fromEntries(
        props.value?.map((l) => [l.code, l.fluency]) ?? []
      ) as Record<SupportedLanguages, LanguageFluency>
    );
  }, [props.value]);

  return (
    <>
      <SelectLanguage
        value={langs}
        onChange={handleLanguageChange}
        {...props.selectLanguageProps}
      />

      <Grid w="100%" mt="sm" align="center">
        {langs.map((lang) => (
          <>
            <Grid.Col span={3}>
              <Group gap="xs">
                <ActionIcon
                  variant="transparent"
                  color="gray"
                  onClick={() => handleDeleteLanguage(lang)}
                >
                  <IconX style={{ width: "70%", height: "70%" }} />
                </ActionIcon>
                <Text>{t(`common.languages.options.${lang}`)}</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={9}>
              <SelectFluency
                value={fluencies[lang] || undefined}
                onChange={(value) => {
                  setFluencies((prevFluency) => {
                    return {
                      ...prevFluency,
                      [lang]: value as LanguageFluency,
                    };
                  });
                  handleOnChange();
                }}
                {...props.selectFluencyProps}
              />
            </Grid.Col>
          </>
        ))}
      </Grid>
    </>
  );
}
