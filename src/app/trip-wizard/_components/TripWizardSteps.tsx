"use client";

import { Stepper, Text, Group, Button } from "@mantine/core";
import { useState } from "react";
import TripWizardForm from "./TripWizardForm";
import { TripWizardProvider } from "../_hooks/useTripWizard";

export default function TripWizardSteps() {
  const [active, setActive] = useState(0);
  const nextStep: () => void = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep: () => void = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <TripWizardProvider>
        <Stepper active={active}>
          <Stepper.Step>
            <TripWizardForm onSubmit={nextStep} />
          </Stepper.Step>

          <Stepper.Step>
            <Text>Step 2 Confirm this is your dream trip</Text>
          </Stepper.Step>

          <Stepper.Step>Step 3 Share or book a guide</Stepper.Step>

          <Stepper.Completed>Completed</Stepper.Completed>
        </Stepper>
      </TripWizardProvider>

      <Group justify="space-between" mt="xl" w="100%">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next</Button>
      </Group>
    </>
  );
}
