import { Paper, Group, SegmentedControl, ActionIcon } from "@mantine/core";
import { IconHeart, IconShare } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function OverviewControls() {
  const t = useTranslations("TripWizardPage.itinerary");

  return (
    <Paper withBorder p="md" radius="md" bg="gray.0">
      <Group gap="md" wrap="wrap" justify="space-between">
        <SegmentedControl
          data={[
            { label: t("preferences.relaxed"), value: "relaxed" },
            { label: t("preferences.balanced"), value: "balanced" },
            { label: t("preferences.intense"), value: "intense" },
          ]}
          defaultValue="balanced"
        />

        <Group>
          <ActionIcon variant="subtle">
            <IconHeart />
          </ActionIcon>
          <ActionIcon variant="subtle">
            <IconShare />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
}
