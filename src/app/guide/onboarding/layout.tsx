import { Container, Paper, Title } from "@mantine/core";
import { ReactNode } from "react";

export default function OnboardingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="lg">
        Guide Onboarding
      </Title>
      <Paper shadow="sm" radius="md" p="lg" withBorder>
        {children}
      </Paper>
    </Container>
  );
}
