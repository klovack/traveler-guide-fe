import { Container } from "@mantine/core";
import { HeroSection } from "./_components/HeroSection";
import { StorySection } from "./_components/StorySection";

export default function HomePage() {
  return (
    <Container size="xl" py="xl">
      <HeroSection />
      <StorySection />
    </Container>
  );
}
