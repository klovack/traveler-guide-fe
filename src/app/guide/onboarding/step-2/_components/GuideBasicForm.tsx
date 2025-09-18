"use client";

import { useOnboardingForm } from "../../_hooks/useOnboardingForm";
import { useTranslations } from "next-intl";
import { SelectLanguageWithFluency } from "@/components/form/languages/SelectLanguageWithFluency";
import { SelectCity } from "@/components/form/cities/SelectCity";
import { MultiSelectCity } from "@/components/form/cities/MultiSelectCity";
import { OnboardingSkeleton } from "../../_components/OnboardingSkeleton";
import { NumberInput } from "@mantine/core";

export function GuideBasicForm() {
  const t = useTranslations("GuideOnboardingPage.steps.2");
  const t_common = useTranslations("common");
  const { form, isLoading } = useOnboardingForm();

  if (!form || isLoading) {
    return <OnboardingSkeleton numberOfFields={4} />;
  }

  const {
    formState: { errors },
  } = form;

  return (
    <form>
      <SelectCity
        label={t("form.baseCity.label")}
        placeholder={t("form.baseCity.placeholder")}
        value={form.watch("base_city") || undefined}
        onChange={(v) => form.setValue("base_city", v)}
        error={errors.base_city?.message}
        required
        mb="md"
      />

      <MultiSelectCity
        label={t("form.operatingRegions.label")}
        placeholder={t("form.operatingRegions.placeholder")}
        value={form.watch("operating_regions") ?? undefined}
        onChange={(v) => {
          form.setValue("operating_regions", v);
        }}
        error={errors.operating_regions?.message}
        required
        mb="md"
      />

      <NumberInput
        label={t("form.travelRadius.label")}
        placeholder={t("form.travelRadius.placeholder")}
        hideControls
        value={form.watch("travel_radius_km") ?? undefined}
        onChange={(v) =>
          form.setValue("travel_radius_km", v as number | undefined)
        }
        rightSection={
          <span style={{ marginRight: 20 }} className="text-sm text-gray-500">
            {t_common("unit.km")}
          </span>
        }
        error={errors.travel_radius_km?.message}
        required
        mb="md"
      />

      <SelectLanguageWithFluency
        value={form.getValues("languages")}
        onChange={(v) => {
          form.setValue("languages", v);
        }}
      />
    </form>
  );
}
