"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { Container, Title, Text, Paper, ContainerProps } from "@mantine/core";
import { useTranslations } from "next-intl";

export type StoryCarouselProps = ContainerProps;

type CarouselItem = {
  id: string;
  imageUrl: string;
};

const carouselData: CarouselItem[] = [
  {
    id: "caring",
    imageUrl:
      "https://images.unsplash.com/photo-1604995908118-3058971cd69c?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "safety",
    imageUrl:
      "https://images.unsplash.com/photo-1522506209496-4536d9020ec4?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "culture",
    imageUrl:
      "https://images.unsplash.com/photo-1583440772344-edd2e043742c?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export function StoryCarousel(props: Readonly<StoryCarouselProps>) {
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const t = useTranslations("HomePage.StorySection.stories");

  return (
    <Container {...props}>
      <Carousel
        withIndicators
        emblaOptions={{ loop: true }}
        height={400}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={() => autoplay.current.play()}
        slideGap="md"
      >
        {carouselData.map((data) => (
          <CarouselSlide key={data.id}>
            <Paper
              shadow="md"
              p="xl"
              radius="lg"
              h="100%"
              style={{
                backgroundImage: `url(${data.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "bottom center",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.2)",
                backgroundBlendMode: "darken",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <Title order={3} size="1.8rem">
                {t(`${data.id}.title`)}
              </Title>

              <Text size="md">{t(`${data.id}.description`)}</Text>
            </Paper>
          </CarouselSlide>
        ))}
      </Carousel>
    </Container>
  );
}
