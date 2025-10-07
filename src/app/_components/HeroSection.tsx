"use client";

import {
  Button,
  Image,
  Container,
  Grid,
  Stack,
  Title,
  Text,
  Group,
  Paper,
  Box,
  GridCol,
} from "@mantine/core";
import { HEIGHT_IN_PX } from "@/constants/layout";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { useMediaQuery } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.md})`, true);
  const t = useTranslations("HomePage.HeroSection");
  const router = useRouter();

  const handleFindGuide = () => {
    router.push("/trip-wizard ");
  };

  const handleBecomeGuide = () => {
    // TODO: Scroll to form section to become a guide
  };

  return (
    <Box
      component="section"
      style={{
        minHeight: `calc(100vh - ${HEIGHT_IN_PX.HEADER}px)`,
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}
      px="md"
    >
      <Container size="xl" px="xl">
        <Grid align="center" gutter="xl">
          {/* Left content */}
          <GridCol span={{ base: 12, lg: 6 }}>
            <Stack gap="xl">
              <Stack gap="lg">
                <Title
                  order={1}
                  size="3.5rem"
                  style={{
                    lineHeight: 1.2,
                    fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                  }}
                >
                  {t.rich("title", {
                    br: () => <br />,
                  })}
                </Title>
                <Text size="xl" c="dimmed" style={{ maxWidth: "28rem" }}>
                  {t("subtitle")}
                </Text>
              </Stack>

              <Group
                gap="md"
                style={{ flexDirection: isMobile ? "column" : "row" }}
              >
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleFindGuide}
                >
                  {t("actions.findGuideButton")}
                </Button>
                <Button size="lg" variant="outline" onClick={handleBecomeGuide}>
                  {t("actions.becomeGuideButton")}
                </Button>
              </Group>

              <Text size="sm" c="dimmed">
                {t("earlyAccess")}
              </Text>
            </Stack>
          </GridCol>

          {/* Right content - Split visual */}
          <GridCol span={{ base: 12, lg: 6 }}>
            <Box pos="relative">
              <Box
                pos="absolute"
                h="80%"
                bottom={-20}
                right={-30}
                style={{ zIndex: 1 }}
              >
                <Image
                  src="/assets/mascots/mimi_hug_backpack.svg"
                  alt="Traveler with guide companion"
                  h="100%"
                  fit="cover"
                  style={{
                    transform: "scaleX(-1)",
                    filter: "drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.1))",
                  }}
                />
              </Box>
              <Paper
                radius="xl"
                shadow="lg"
                h={425}
                style={{ overflow: "hidden", zIndex: 0 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1712479667983-9f2872d33fb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBtYXAlMjBwaW5zJTIwZGVzdGluYXRpb25zJTIwam91cm5leXxlbnwxfHx8fDE3NTk1NTkwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Travel map with destination pins"
                  h="100%"
                  fit="cover"
                  style={{ filter: "sepia(0.7)" }}
                />
              </Paper>
            </Box>
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
}
