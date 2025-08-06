import { Paper, Group, Button, SegmentedControl } from "@mantine/core";
import { IconExchange, IconPlus, IconHeart } from "@tabler/icons-react";

export function OverviewControls() {
  return (
    <Paper withBorder p="md" radius="md" bg="gray.0">
      <Group gap="md" wrap="wrap">
        <SegmentedControl
          data={[
            { label: "Relaxed", value: "relaxed" },
            { label: "Balanced", value: "balanced" },
            { label: "Intense", value: "intense" },
          ]}
          defaultValue="balanced"
        />
        <Button
          leftSection={<IconExchange size={16} />}
          variant="outline"
          color="blue"
        >
          Swap City
        </Button>
        <Button
          leftSection={<IconPlus size={16} />}
          variant="outline"
          color="blue"
        >
          Add Another Destination
        </Button>
        <Button variant="outline" color="gray">
          Save This Trip for Later
        </Button>
        <Button leftSection={<IconHeart size={16} />} color="red">
          I Like This Trip → Continue
        </Button>
      </Group>
    </Paper>
  );
}
