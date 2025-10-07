import { Flex, Stack, Title, Text, Box, Container } from "@mantine/core";
import { StoryCarousel } from "./StoryCarousel";
import { useTranslations } from "next-intl";

export function StorySection() {
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
      <Container size="xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          mx="auto"
          py="xl"
          gap="xl"
        >
          <StoryCarousel w={{ base: "90vw", md: "50%" }} />

          <Stack align="left" my="xl" w={{ base: "90vw", md: "50%" }}>
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
      </Container>
    </Box>
  );
}
