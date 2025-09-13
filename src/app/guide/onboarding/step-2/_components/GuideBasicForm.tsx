"use client";

import { Group, Button } from "@mantine/core";
import Link from "next/link";
import { useOnboardingForm } from "../../_hooks/useOnboardingForm";
import { useTranslations } from "next-intl";
import { SelectLanguageWithFluency } from "@/components/form/languages/SelectLanguageWithFluency";
import { SelectCity } from "@/components/form/cities/SelectCity";
import { MultiSelectCity } from "@/components/form/cities/MultiSelectCity";

export function GuideBasicForm() {
  const t = useTranslations("GuideOnboardingPage.steps.2");
  const { form } = useOnboardingForm();

  if (!form) {
    return <div>Loading...</div>;
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

      <SelectLanguageWithFluency
        value={form.getValues("languages")}
        onChange={(v) => {
          form.setValue("languages", v);
        }}
      />

      <Group justify="space-between" mt="lg">
        <Button
          variant="default"
          component={Link}
          href="/guide/onboarding/step-1"
        >
          Back
        </Button>
        <Button component={Link} href="/guide/onboarding/step-3">
          Next
        </Button>
      </Group>
    </form>
  );
}
