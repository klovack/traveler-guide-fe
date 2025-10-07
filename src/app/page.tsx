import { Container } from "@mantine/core";
import { HeroSection } from "./_components/HeroSection";
import { StorySection } from "./_components/StorySection";
import { HowItWorksSection } from "./_components/HowItWorksSection";
import { WhyMihapeSection } from "./_components/WhyMihapeSection";

export default function HomePage() {
  return (
    <Container py="xl" px={0} fluid>
      <HeroSection />
      <StorySection />
      <HowItWorksSection />
      <WhyMihapeSection />
    </Container>
  );
}
