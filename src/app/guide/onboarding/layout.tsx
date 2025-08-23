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
  const t = useTranslations("GuideOnboardingPage");
  const locale = useLocale();
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.md})`, true);

  const active = useMemo(() => {
    const match = stepRegex.exec(pathname);
    return match ? Number(match[1]) - 1 : 0;
  }, [pathname]);

  const go = (n: number) => router.push(`./step-${n}`);

  const steps = useMemo(() => {
    return createSteps(t);
  }, [t, locale]);

  return (
    <Container size="md">
      <Group justify="space-between" mb="sm">
        <Title order={2} size={isMobile ? "md" : undefined}>
          {t("title")}
        </Title>
        <Button variant="subtle" component={Link} href="/guide/preview/me">
          {t("previewProfile")}
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
        </Paper>
      </Group>
    </Container>
  );
}
