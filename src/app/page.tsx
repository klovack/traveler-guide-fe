import { Container } from "@mantine/core";
import { HeroSection } from "./_components/HeroSection";
import { StorySection } from "./_components/StorySection";
import { HowItWorksSection } from "./_components/HowItWorksSection";

export default function HomePage() {
  return (
    <Container py="xl" px={0} fluid>
      <HeroSection />
      <StorySection />
      <HowItWorksSection />
    </Container>
  );
}
