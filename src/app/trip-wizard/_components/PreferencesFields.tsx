'use client';

import { Textarea, RangeSliderValue, Collapse, Switch } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import { interestOptions, languageOptions } from "../_hooks/useTripWizardForm";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { TripWizardRequest } from "tg-sdk";
import { OptionalPreferencesFields } from "./PreferencesGroupFields";
import { useDisclosure } from "@mantine/hooks";

export default function PreferencesFields() {
  const t = useTranslations("TripWizardPage.preferences");
  const locale = useLocale();
  const { register, watch, setValue, getFieldState } =
    useFormContext<TripWizardRequest>();
  const [optionalPreferenceOpened, { toggle: toggleOptionalPreference }] =
    useDisclosure();

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
        required
        label={t("form.description.label")}
        placeholder={t("form.description.placeholder")}
        rows={4}
        error={getFieldState("trip_description").error?.message}
      />

      <Switch
        checked={optionalPreferenceOpened}
        onChange={() => toggleOptionalPreference()}
        label={t("form.addDetails.label")}
      />

      <Collapse in={optionalPreferenceOpened}>
        <OptionalPreferencesFields
          languageSelectOptions={languageSelectOptions}
          interestOptionsSelect={interestOptionsSelect}
          groupSizeValue={groupSizeValue}
          setValue={setValue}
          watch={watch}
        />
      </Collapse>
    </div>
  );
}
