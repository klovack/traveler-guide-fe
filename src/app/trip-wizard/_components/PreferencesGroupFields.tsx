import { Group, Stack, Text, RangeSlider, MultiSelect } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import { TripWizardRequest } from "tg-sdk";
import { useTranslations } from "next-intl";

interface OptionalPreferencesFieldsProps {
  languageSelectOptions: { value: string; label: string }[];
  interestOptionsSelect: { value: string; label: string }[];
  groupSizeValue: [number, number] | undefined;
  setValue: ReturnType<typeof useFormContext<TripWizardRequest>>["setValue"];
  watch: ReturnType<typeof useFormContext<TripWizardRequest>>["watch"];
}

export function OptionalPreferencesFields({
  languageSelectOptions,
  interestOptionsSelect,
  groupSizeValue,
  setValue,
  watch,
}: OptionalPreferencesFieldsProps) {
  const t = useTranslations("TripWizardPage.preferences");

  return (
    <>
      <Group w="100%" justify="center" grow gap="xl" className="mb-8">
        <Stack>
          <Text size="sm" fw={500}>
            {t("form.groupSize.label")}
          </Text>
          <RangeSlider
            label={(count) => t("form.groupSize.person", { count })}
            min={1}
            max={10}
            minRange={0}
            maxRange={10}
            value={groupSizeValue}
            onChange={(val) =>
              setValue("group_size", {
                min: val[0],
                max: val[1],
              })
            }
            marks={[
              { value: 1, label: t("form.groupSize.solo") },
              { value: 5, label: t("form.groupSize.family") },
              { value: 10, label: t("form.groupSize.group") },
            ]}
          />
        </Stack>
      </Group>

      <Stack w="100%" justify="stretch" gap="md" align="stretch">
        <MultiSelect
          label={t("form.languages.label")}
          placeholder={t("form.languages.placeholder")}
          data={languageSelectOptions}
          value={watch("languages") ?? undefined}
          onChange={(value) =>
            setValue("languages", value as TripWizardRequest["languages"])
          }
          searchable
          clearable
        />

        <MultiSelect
          label={t("form.interests.label")}
          placeholder={t("form.interests.placeholder")}
          data={interestOptionsSelect}
          value={watch("interests") ?? undefined}
          onChange={(value) => setValue("interests", value)}
          searchable
          clearable
        />
      </Stack>
    </>
  );
}
