import {
  Paper,
  Group,
  Text,
  Divider,
  Stack,
  List,
  ThemeIcon,
  Badge,
  Button,
} from "@mantine/core";
import {
  IconMapPin,
  IconRefresh,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";
import { TripWizardResponse } from "tg-sdk";
import { useFormatter } from "next-intl";

interface OverviewTimelineProps {
  days: TripWizardResponse["suggested_itinerary"];
}

export function OverviewTimeline({ days }: Readonly<OverviewTimelineProps>) {
  const format = useFormatter();

  return (
    <Stack gap="lg">
      {days.map((day, i) => (
        <Paper key={day.description} withBorder p="md" radius="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text fw={600} size="md">
                {format.dateTimeRange(
                  new Date(day.itinerary_time.start),
                  new Date(day.itinerary_time.end),
                  {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                  }
                )}
              </Text>
              <Text c="dimmed" size="sm">
                {day.description}
              </Text>
            </div>
          </Group>
          <Divider my="sm" />

          <Stack gap={4}>
            <List
              type="ordered"
              spacing="xs"
              icon={
                <ThemeIcon radius="xl" variant="light">
                  <IconSquareRoundedChevronRightFilled size={18} />
                </ThemeIcon>
              }
            >
              {day.activities.map((act: string) => (
                <List.Item key={act}>{act}</List.Item>
              ))}
            </List>
          </Stack>

          <Group mt="md" align="center" justify="space-between">
            <Group align="center" gap="xs">
              {day.locations?.map((loc: string) => (
                <Badge
                  key={loc}
                  size="md"
                  leftSection={<IconMapPin size={12} />}
                  variant="light"
                >
                  {loc}
                </Badge>
              ))}
            </Group>

            <Button
              variant="light"
              leftSection={<IconRefresh size={16} />}
              size="xs"
            >
              Regenerate This Day
            </Button>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}
