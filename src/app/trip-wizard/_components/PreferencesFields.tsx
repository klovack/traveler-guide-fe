'use client';

import {
  Group,
  RangeSlider,
  Stack,
  Textarea,
  Text,
  MultiSelect,
  RangeSliderValue,
} from "@mantine/core";
import { useFormContext } from "react-hook-form";
import { interestOptions, languageOptions } from "../_hooks/useTripWizardForm";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { TripWizardRequest } from "tg-sdk";

export default function PreferencesFields() {
  const t = useTranslations("TripWizardPage.preferences");
  const locale = useLocale();
  const { register, watch, setValue, getFieldState } =
    useFormContext<TripWizardRequest>();

  const groupSize = watch("group_size");
  const groupSizeValue = useMemo((): RangeSliderValue | undefined => {
    if (groupSize?.min == null || groupSize?.max == null) return;

    return [groupSize.min, groupSize.max];
  }, [groupSize]);

  const languageSelectOptions = useMemo(() => {
    return languageOptions
      .map((value) => {
        const hasTranslation = t.has(`form.languages.options.${value}`);
        if (!hasTranslation) {
          return null;
        }

        return {
          value,
          label: t(`form.languages.options.${value}`),
        };
      })
      .filter((option) => option !== null);
  }, [locale, t]);

  const interestOptionsSelect = useMemo(() => {
    return interestOptions.map((value) => ({
      value,
      label: t(`form.interests.options.${value}`),
    }));
  }, [locale, t]);

  return (
    <div className="space-y-4">
      <Textarea
        {...register("trip_description")}
        label={t("form.description.label")}
        placeholder={t("form.description.placeholder")}
        rows={4}
        error={getFieldState("trip_description").error?.message}
      />

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
    </div>
  );
}
