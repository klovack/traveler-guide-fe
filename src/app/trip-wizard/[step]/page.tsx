"use client";

import { useRouter, useParams } from "next/navigation";
import { Container, Title, Text } from "@mantine/core";
import TripWizardSteps from "../_components/TripWizardSteps";
import { TRIP_WIZARD_STEP, TRIP_WIZARD_STEPS } from "../constants";
import { useTranslations } from "next-intl";

export default function TripWizardStepPage() {
  const router = useRouter();
  const params = useParams();
  const stepIndex = TRIP_WIZARD_STEPS.indexOf(params.step as TRIP_WIZARD_STEP);
  const t = useTranslations("TripWizardPage");

  // Fallback to first step if invalid
  const active = stepIndex === -1 ? 0 : stepIndex;
  const step = TRIP_WIZARD_STEPS[active];

  const goToStep = (idx: number) => {
    router.push(`/trip-wizard/${TRIP_WIZARD_STEPS[idx]}`);
  };

  return (
    <Container>
      <Title mb="md">{t(`${step}.title`)}</Title>
      <Text mb="md">{t(`${step}.subtitle`)}</Text>
      <TripWizardSteps active={active} goToStep={goToStep} />
    </Container>
  );
}
