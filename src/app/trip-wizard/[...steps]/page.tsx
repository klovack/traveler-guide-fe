"use client";

import { useRouter, useParams } from "next/navigation";
import { Container, Title, Text, Stack } from "@mantine/core";
import TripWizardSteps, {
  TripWizardStepsProps,
} from "../_components/TripWizardSteps";
import { TRIP_WIZARD_STEP, TRIP_WIZARD_STEPS } from "../constants";
import { useTranslations } from "next-intl";

export default function TripWizardStepPage() {
  const router = useRouter();
  const params = useParams();
  const stepIndex = TRIP_WIZARD_STEPS.indexOf(
    (params.steps?.[0] as TRIP_WIZARD_STEP) ?? "preferences"
  );
  const t = useTranslations("TripWizardPage");

  // Fallback to first step if invalid
  const active = stepIndex === -1 ? 0 : stepIndex;
  const step = TRIP_WIZARD_STEPS[active];

  const goToStep: TripWizardStepsProps["goToStep"] = (idx, options) => {
    let path = `/trip-wizard/${TRIP_WIZARD_STEPS[idx]}`;
    if (options && Object.keys(options).length > 0) {
      path += `/${Object.values(options).join("/")}`;
    }
    router.push(path);
  };

  return (
    <Container>
      <Stack align="center" gap={4}>
        <Title order={2} mb="md">
          {t(`${step}.title`)}
        </Title>
        <Text mb="md" size="lg" c="dimmed">
          {t(`${step}.subtitle`)}
        </Text>
      </Stack>

      <TripWizardSteps active={active} goToStep={goToStep} />
    </Container>
  );
}
