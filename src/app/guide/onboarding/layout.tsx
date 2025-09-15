"use client";

import {
  Container,
  Paper,
  Stepper,
  Group,
  Button,
  Title,
  Progress,
  Box,
} from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { createSteps } from "./_lib/createSteps";
import { useMediaQuery } from "@mantine/hooks";
import { BREAKPOINTS } from "@/constants/breakpoints";

const stepRegex = RegExp(/step-(\d+)/);

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.md})`, true);

  const active = useMemo(() => {
    const match = stepRegex.exec(pathname);
    return match ? Number(match[1]) - 1 : 0;
  }, [pathname]);
  const currentStep = active + 1;

  const go = (n: number) => router.push(`./step-${n}`);

  const steps = useMemo(() => {
    return createSteps(t, "GuideOnboardingPage");
  }, [t, locale]);

  return (
    <Container size="md">
      <Group justify="space-between" mb="sm">
        <Title order={2} size={isMobile ? "md" : undefined}>
          {t("GuideOnboardingPage.title")}
        </Title>
        <Button variant="subtle" component={Link} href="/guide/preview/me">
          {t("GuideOnboardingPage.previewProfile")}
        </Button>
      </Group>

      <Box mb="xs">
        <Progress value={((active + 1) / steps.length) * 100} />
      </Box>

      <Group pt="lg" gap="md" align="flex-start" wrap="nowrap">
        <Stepper
          active={active}
          onStepClick={(i) => go(i + 1)}
          allowNextStepsSelect={false}
          orientation="vertical"
          size={isMobile ? "sm" : "md"}
        >
          {steps.map((s) => (
            <Stepper.Step
              key={s.n}
              label={isMobile ? undefined : s.label}
              description={isMobile ? undefined : s.description}
            />
          ))}
        </Stepper>
        <Paper withBorder radius="md" p="lg" className="grow">
          {children}
          <Group justify="space-between" mt="lg">
            {currentStep > 1 && (
              <Button
                variant="default"
                component={Link}
                href={`/guide/onboarding/step-${currentStep - 1}`}
              >
                {t.has("GuideOnboardingPage.buttons.back")
                  ? t("GuideOnboardingPage.buttons.back")
                  : t("common.buttons.back")}
              </Button>
            )}
            {currentStep === 1 && (
              <Button
                variant="default"
                component={Link}
                href={`/guide/dashboard`}
              >
                {t("common.buttons.exit")}
              </Button>
            )}
            {currentStep < steps.length && (
              <Button
                component={Link}
                href={`/guide/onboarding/step-${currentStep + 1}`}
              >
                {t.has(`GuideOnboardingPage.steps.${currentStep}.buttons.next`)
                  ? t(`GuideOnboardingPage.steps.${currentStep}.buttons.next`)
                  : t("common.buttons.next")}
              </Button>
            )}
          </Group>
        </Paper>
      </Group>
    </Container>
  );
}
