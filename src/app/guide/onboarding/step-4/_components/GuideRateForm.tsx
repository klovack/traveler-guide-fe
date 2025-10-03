"use client";

import { useTranslations } from "next-intl";
import { OnboardingSkeleton } from "../../_components/OnboardingSkeleton";
import { useOnboardingForm } from "../../_hooks/useOnboardingForm";
import { NumberInput } from "@mantine/core";
import { useCurrency } from "@/hooks/useCurrency";
import { Currency } from "tg-sdk";
import { SliderWithLabel } from "@/components/form/SliderWithLabel";

export function GuideRateForm() {
  const t = useTranslations("GuideOnboardingPage.steps.4");
  const t_common = useTranslations("common");
  const { form, isLoading } = useOnboardingForm();
  const { data: currencies } = useCurrency();

  if (!form || isLoading) {
    return <OnboardingSkeleton numberOfFields={4} />;
  }

  const {
    formState: { errors },
  } = form;

  const currency: string =
    form.getValues("base_rate_day.currency.code") ?? "EUR";

  const handleChangeCurrency = (newCurrency: string) => {
    const curr =
      currencies?.[newCurrency] ?? ({ code: newCurrency } as Currency);
    form.setValue("base_rate_day.currency", curr);
    form.setValue("base_rate_hour.currency", curr);
  };

  return (
    <form>
      <NumberInput
        label={t("form.baseRateHour.label")}
        placeholder={t("form.baseRateHour.placeholder")}
        hideControls
        value={form.watch("base_rate_hour.amount") ?? undefined}
        onChange={(v) => {
          form.setValue("base_rate_hour.amount", v as number);
          handleChangeCurrency("EUR");
        }}
        rightSectionWidth={"80"}
        rightSection={
          <span className="text-sm text-gray-500">
            {t_common(`currencies.symbol.${currency}`)} /{" "}
            {t_common("unit.hour")}
          </span>
        }
        error={errors.base_rate_hour?.message}
        required
        mb="md"
      />

      <NumberInput
        label={t("form.baseRateDay.label")}
        placeholder={t("form.baseRateDay.placeholder")}
        hideControls
        value={form.watch("base_rate_day.amount") ?? undefined}
        onChange={(v) => {
          form.setValue("base_rate_day.amount", v as number);
          handleChangeCurrency("EUR");
        }}
        rightSectionWidth={"80"}
        rightSection={
          <span className="text-sm text-gray-500">
            {t_common(`currencies.symbol.${currency}`)} / {t_common("unit.day")}
          </span>
        }
        error={errors.base_rate_day?.message}
        required
        mb="md"
      />

      <SliderWithLabel
        label={t("form.maxGroupSize.label")}
        required
        slider={{
          marks: Array.from({ length: 10 }, (_, i) => ({
            value: i + 1,
            label: `${i + 1}`,
          })),
          min: 1,
          max: 10,
          value: form.watch("max_group_size") ?? 1,
          onChange: (val) => form.setValue("max_group_size", val),
          mb: "md",
        }}
      />
    </form>
  );
}
