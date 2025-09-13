"use client";

import { Button } from "@mantine/core";
import { useOnboardingForm } from "../../_hooks/useOnboardingForm";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function StartOnboardingButton() {
  const t = useTranslations("GuideOnboardingPage.steps.1");
  const { form, isLoading } = useOnboardingForm();

  console.log({ form });

  return (
    <Button
      loading={isLoading}
      component={Link}
      href="/guide/onboarding/step-2"
    >
      {t("start")}
    </Button>
  );
}
