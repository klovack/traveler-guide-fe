import { Container, Title } from "@mantine/core";
import TripWizardSteps from "./_components/TripWizardSteps";

export default function TripWizardPage() {
  return (
    <Container>
      <Title mb="md">Plan Your Trip</Title>
      <TripWizardSteps />
    </Container>
  );
}
