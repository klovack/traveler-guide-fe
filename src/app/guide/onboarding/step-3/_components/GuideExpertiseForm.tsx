"use client";

import { useTranslations } from "next-intl";
import { OnboardingSkeleton } from "../../_components/OnboardingSkeleton";
import { useOnboardingForm } from "../../_hooks/useOnboardingForm";
import { SelectPersonality } from "@/components/form/expertise/SelectPersonality";

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
    </form>
  );
}
