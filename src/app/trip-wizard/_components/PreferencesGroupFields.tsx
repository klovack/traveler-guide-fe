import { Stack } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import { TripWizardRequest } from "tg-sdk";
import { useTranslations } from "next-intl";
import { SelectLanguage } from "@/components/form/languages/SelectLanguage";
import { SupportedLanguages } from "@/constants/languages";
import { SelectInterest } from "@/components/form/expertise/SelectInterest";
import { SelectPersonality } from "@/components/form";

interface OptionalPreferencesFieldsProps {
  setValue: ReturnType<typeof useFormContext<TripWizardRequest>>["setValue"];
  watch: ReturnType<typeof useFormContext<TripWizardRequest>>["watch"];
}

export function OptionalPreferencesFields({
  setValue,
  watch,
}: Readonly<OptionalPreferencesFieldsProps>) {
  const t = useTranslations("TripWizardPage.preferences");

  return (
    <Stack w="100%" justify="stretch" gap="md" align="stretch">
      <SelectLanguage
        label={t("form.languages.label")}
        placeholder={t("form.languages.placeholder")}
        value={watch("languages") ?? undefined}
        onChange={(value: SupportedLanguages[]) =>
          setValue("languages", value as TripWizardRequest["languages"])
        }
        searchable
        clearable
      />

      <SelectInterest
        label={t("form.interests.label")}
        description={t("form.interests.description", { max: 5 })}
        min={0}
        max={5}
        value={watch("interests") ?? undefined}
        onChange={(value) => setValue("interests", value)}
      />

      <SelectPersonality
        label={t("form.personality.label")}
        description={t("form.personality.description", { max: 5 })}
        min={0}
        max={5}
        value={watch("guide_personality")}
        onChange={(value) => setValue("guide_personality", value)}
      />
    </Stack>
  );
}
