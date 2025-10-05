"use client";

import { Flex, Stack, Title, Text, Box } from "@mantine/core";
import { StoryCarousel } from "./StoryCarousel";
import { useMediaQuery } from "@mantine/hooks";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { useTranslations } from "next-intl";

export function StorySection() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.md})`, true);
  const t = useTranslations("HomePage.StorySection");

  return (
    <Box
      component="section"
      style={{
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}
      px="md"
    >
      <Flex
        direction={isMobile ? "column-reverse" : "row"}
        align="center"
        mx="auto"
        py="xl"
        gap="xl"
      >
        <StoryCarousel w={isMobile ? "90vw" : "50%"} />

        <Stack align="left" my="xl" w={isMobile ? "90vw" : "50%"}>
          <Title order={2} size="2rem">
            {t.rich("title", {
              br: () => <br />,
            })}
          </Title>
          <Text size="lg" c="dimmed">
            {t.rich("description", {
              br: () => <br />,
            })}
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
}
