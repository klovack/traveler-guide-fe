import {
  Box,
  Container,
  Text,
  Title,
  Grid,
  Stack,
  Paper,
  Group,
  Badge,
  GridCol,
  Image,
} from "@mantine/core";
import { useTranslations } from "next-intl";

export function HowItWorksSection() {
  const t = useTranslations("HomePage.HowItWorksSection");
  const steps = [
    {
      id: "tell_us_about_your_trip",
      imageUrl: "/assets/mascots/mimi_on_laptop.png",
    },
    {
      id: "get_matched_with_guides",
      imageUrl: "/assets/mascots/mimi_show_itinerary.png",
    },
    {
      id: "travel_together",
      imageUrl: "/assets/mascots/mimi_travel_together.png",
    },
  ];

  return (
    <Box component="section" py="xl" bg="brand.0" px="md">
      <Container size="xl" px="md">
        <Stack align="center" gap="md" mb="xl">
          <Title order={2} size="h1" ta="center">
            {t("title")}
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={600}>
            {t("description")}
          </Text>
        </Stack>

        <Grid>
          {steps.map((step, index) => (
            <GridCol key={step.id} span={{ base: 12, md: 4 }}>
              <Box pos="relative">
                <Paper
                  radius="xl"
                  p="xl"
                  shadow="lg"
                  pos="relative"
                  style={{ zIndex: 10 }}
                >
                  <Stack gap="lg">
                    <Image
                      src={step.imageUrl}
                      alt={t(`steps.${step.id}.title`)}
                    />

                    <Stack gap="xs">
                      <Title order={3} size="h3">
                        {t(`steps.${step.id}.title`)}
                      </Title>
                      <Text c="dimmed">
                        {t(`steps.${step.id}.description`)}
                      </Text>
                    </Stack>

                    <Group justify="center">
                      <Badge size="lg" variant="light" radius="xl" color="blue">
                        {index + 1}
                      </Badge>
                    </Group>
                  </Stack>
                </Paper>
              </Box>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
