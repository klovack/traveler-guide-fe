"use client";

import { Stepper, Text } from "@mantine/core";
import TripWizardForm from "./TripWizardForm";

type TripWizardStepsProps = {
  active: number;
  goToStep: (idx: number) => void;
};

export default function TripWizardSteps({
  active,
  goToStep,
}: Readonly<TripWizardStepsProps>) {
  const nextStep = () => goToStep(active + 1);

  return (
    <Stepper
      active={active}
      onStepClick={goToStep}
      allowNextStepsSelect={false}
    >
      <Stepper.Step>
        <TripWizardForm onSubmit={nextStep} />
      </Stepper.Step>

      <Stepper.Step>
        <Text>Step 2 Confirm this is your dream trip</Text>
      </Stepper.Step>

      <Stepper.Step>Step 3 Share or book a guide</Stepper.Step>

      <Stepper.Completed>Completed</Stepper.Completed>
    </Stepper>
  );
}
