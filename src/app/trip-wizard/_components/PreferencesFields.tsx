'use client';

import {
  Group,
  RangeSlider,
  Stack,
  Textarea,
  Text,
  MultiSelect,
} from "@mantine/core";
import { useFormContext } from "react-hook-form";
import {
  interestOptions,
  languageOptions,
  TripWizardFormValues,
} from "../_hooks/useTripWizard";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export default function PreferencesFields() {
  const t = useTranslations("TripWizardPage.preferences");
  const { register, watch, setValue, getFieldState } =
    useFormContext<TripWizardFormValues>();

  const groupSize = watch("groupSize");
  const groupSizeValue = useMemo<[number, number] | undefined>(() => {
    if (!groupSize) return;

    return [groupSize.min, groupSize.max];
  }, [groupSize]);

  return (
    <div className="space-y-4">
      <Textarea
        {...register("tripDescription")}
        label={t("form.description.label")}
        placeholder={t("form.description.placeholder")}
        rows={4}
        error={getFieldState("tripDescription").error?.message}
      />

      <Group w="100%" justify="center" grow gap="xl" className="mb-8">
        <Stack>
          <Text size="sm" fw={500}>
            {t("form.groupSize.label")}
          </Text>
          <RangeSlider
            label={(value) => `${value} ${value > 1 ? "Persons" : "Person"}`}
            min={1}
            max={10}
            minRange={0}
            maxRange={10}
            value={groupSizeValue}
            onChange={(val) =>
              setValue("groupSize", {
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
          data={Object.values(languageOptions).map((val) => val)}
          value={watch("languages")}
          onChange={(value) => setValue("languages", value)}
          searchable
          clearable
        />

        <MultiSelect
          label={t("form.interests.label")}
          placeholder={t("form.interests.placeholder")}
          data={Object.values(interestOptions).map((val) => val)}
          value={watch("interests")}
          onChange={(value) => setValue("interests", value)}
          searchable
          clearable
        />
      </Stack>
    </div>
  );
}
