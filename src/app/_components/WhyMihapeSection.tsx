"use client";

import { scrollToElement } from "@/lib/utils/scrollToElement";
import {
  Box,
  Container,
  Text,
  Title,
  Grid,
  Stack,
  Paper,
  ActionIcon,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function WhyMihapeSection() {
  const t = useTranslations("HomePage.WhyMihapeSection");
  const router = useRouter();
  const benefits = [
    {
      id: "families",
      color: "accent",
      link: "/trip-wizard",
    },
    {
      id: "travelers",
      color: "brand",
      link: "/trip-wizard",
    },
    {
      id: "guides",
      color: "accent",
      scrollTo: "waitlist",
    },
  ];

  const handleGoTo = (benefit: (typeof benefits)[number]) => {
    if (benefit.link) {
      router.push(benefit.link);
    }

    if (benefit.scrollTo) {
      scrollToElement(benefit.scrollTo);
    }
  };

  return (
    <Box
      component="section"
      py="xl"
      style={(theme) => ({
        background: `linear-gradient(135deg, ${theme.colors.gray[0]}, ${theme.colors.white})`,
      })}
      px="md"
    >
      <Container size="xl">
        <Stack align="center" gap="md" mb="xl">
          <Title order={2} size="h1" ta="center">
            {t("title")}
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={600}>
            {t("description")}
          </Text>
        </Stack>

        <Grid>
          {benefits.map((benefit, index) => (
            <Grid.Col key={index} span={{ base: 12, lg: 4 }}>
              <Paper
                radius="md"
                shadow="sm"
                style={(theme) => ({
                  background: `linear-gradient(135deg, ${
                    theme.colors[benefit.color as keyof typeof theme.colors][0]
                  }, ${
                    theme.colors[benefit.color as keyof typeof theme.colors][1]
                  })`,
                })}
              >
                <Stack gap="lg" p="xl">
                  <Stack gap="xs">
                    <Title order={3} size="h3">
                      {t(`benefits.${benefit.id}.title`)}
                    </Title>
                    <Text size="lg" fw={500}>
                      {t(`benefits.${benefit.id}.subtitle`)}
                    </Text>
                  </Stack>
                  <Text c="dimmed" lh={1.6}>
                    {t(`benefits.${benefit.id}.description`)}
                  </Text>

                  <ActionIcon
                    style={{ alignSelf: "flex-end" }}
                    onClick={() => handleGoTo(benefit)}
                    variant="subtle"
                    c="accent"
                    size="lg"
                    radius="xl"
                  >
                    <IconArrowRight />
                  </ActionIcon>
                </Stack>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
