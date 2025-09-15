"use client";

import { useTranslations } from "next-intl";
import { OnboardingSkeleton } from "../../_components/OnboardingSkeleton";
import { useOnboardingForm } from "../../_hooks/useOnboardingForm";
import { SelectPersonality } from "@/components/form/expertise/SelectPersonality";
import { SelectInterest } from "@/components/form/expertise/SelectInterest";
import { Space } from "@mantine/core";

export function GuideExpertiseForm() {
  const t = useTranslations("GuideOnboardingPage.steps.3");
  const { form, isLoading } = useOnboardingForm();

  if (!form || isLoading) {
    return <OnboardingSkeleton numberOfFields={4} />;
  }

  const {
    formState: { errors },
  } = form;

  return (
    <form>
      <SelectPersonality
        label={t("form.personality.label")}
        description={t("form.personality.description", { max: 5 })}
        error={{
          required: errors.personality?.type === "required",
          min:
            (form.getValues("personality")?.length ?? 0) < 1
              ? t("form.personality.validationError.min", { min: 1 })
              : undefined,
          max:
            (form.getValues("personality")?.length ?? 0) > 5
              ? t("form.personality.validationError.max", { max: 5 })
              : undefined,
        }}
        required
        value={form.watch("personality") ?? undefined}
        onChange={(v) => form.setValue("personality", v)}
        max={5}
        min={1}
      />
      <Space h="lg" />
      <SelectInterest
        label={t("form.interest.label")}
        description={t("form.interest.description", { max: 5 })}
        error={{
          required: errors.interests?.type === "required",
          min:
            (form.getValues("interests")?.length ?? 0) < 1
              ? t("form.interest.validationError.min", { min: 1 })
              : undefined,
          max:
            (form.getValues("interests")?.length ?? 0) > 5
              ? t("form.interest.validationError.max", { max: 5 })
              : undefined,
        }}
        required
        value={form.watch("interests") ?? undefined}
        onChange={(v) => form.setValue("interests", v)}
        max={5}
        min={1}
      />
    </form>
  );
}
