"use client";

import {
  Container,
  Title,
  Text,
  Button,
  Grid,
  Card,
  Group,
  Badge,
} from "@mantine/core";
import { IconMapPin, IconCategory, IconArrowRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Guide } from "tg-sdk";

export default function HomePage() {
  const t = useTranslations("HomePage");

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {};

    fetchGuides();
  }, []);

  return (
    <Container size="xl" py="xl">
      {/* Hero Section */}
      <div className="text-center py-16">
        <Title order={1} size="3.5rem" mb="md" className="text-gradient">
          {t("title")}
        </Title>
        <Text size="xl" c="dimmed" mb="xl" maw={600} mx="auto">
          {t("description")}
        </Text>
        <Group>
          <Link href="/trip-wizard" style={{ textDecoration: "none" }}>
            <Button
              size="lg"
              radius="md"
              rightSection={<IconArrowRight size={20} />}
            >
              Get Started
            </Button>
          </Link>
          <Link href="/guide" style={{ textDecoration: "none" }}>
            <Button
              variant="light"
              size="lg"
              radius="md"
              rightSection={<IconArrowRight size={20} />}
            >
              Become Guide
            </Button>
          </Link>
        </Group>
      </div>

      {/* Featured Guides */}
      <div className="mb-16">
        <Title order={2} mb="lg" ta="center">
          Featured Travel Guides
        </Title>
        <Grid>
          {loading ? (
            <Grid.Col span={12}>
              <Text ta="center" c="dimmed">
                Loading guides...
              </Text>
            </Grid.Col>
          ) : (
            guides.map((guide) => (
              <Grid.Col key={guide.id} span={{ base: 12, md: 6, lg: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text fw={500} size="lg" lineClamp={1}>
                      {guide.title}
                    </Text>
                    <Badge color="blue" variant="light">
                      {guide.category}
                    </Badge>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={3} mb="md">
                    {guide.description}
                  </Text>

                  <Group gap="xs" c="dimmed">
                    <IconMapPin size={16} />
                    <Text size="sm">{guide.location}</Text>
                  </Group>

                  <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    mt="md"
                    radius="md"
                    rightSection={<IconArrowRight size={16} />}
                  >
                    Read Guide
                  </Button>
                </Card>
              </Grid.Col>
            ))
          )}
        </Grid>
      </div>

      {/* Categories Section */}
      <div className="mb-16">
        <Title order={2} mb="lg" ta="center">
          Explore by Category
        </Title>
        <Grid>
          {["Beach", "Mountain", "City", "Food", "Culture", "Adventure"].map(
            (category) => (
              <Grid.Col key={category} span={{ base: 6, md: 4 }}>
                <Card
                  shadow="sm"
                  padding="xl"
                  radius="md"
                  withBorder
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="text-center">
                    <IconCategory
                      size={48}
                      className="mx-auto mb-4 text-blue-500"
                    />
                    <Text fw={500} size="lg">
                      {category}
                    </Text>
                  </div>
                </Card>
              </Grid.Col>
            )
          )}
        </Grid>
      </div>
    </Container>
  );
}
