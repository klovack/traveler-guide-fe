"use client";

import { Stepper } from "@mantine/core";
import TripWizardForm from "./TripWizardForm";
import TripWizardOverview from "./TripWizardOverview";

export type TripWizardStepRouterOptions = {
  tripWizardId?: string;
};

export type TripWizardStepsProps = {
  active: number;
  goToStep: (idx: number, options?: TripWizardStepRouterOptions) => void;
};

export default function TripWizardSteps({
  active,
  goToStep,
}: Readonly<TripWizardStepsProps>) {
  const handleTripGenerationFinished = (tripWizardId: string) => {
    goToStep(active + 1, {
      tripWizardId,
    });
  };

  return (
    <Stepper active={active} onStepClick={goToStep} allowNextStepsSelect={true}>
      <Stepper.Step>
        <TripWizardForm onSubmit={handleTripGenerationFinished} />
      </Stepper.Step>

      <Stepper.Step>
        <TripWizardOverview />
      </Stepper.Step>

      <Stepper.Step>Step 3 Share or book a guide</Stepper.Step>

      <Stepper.Completed>Completed</Stepper.Completed>
    </Stepper>
  );
}
