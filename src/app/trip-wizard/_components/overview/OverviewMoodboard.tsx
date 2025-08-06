import { Paper, Text, Group, Badge } from "@mantine/core";

export type OverviewMoodboardProps = {
  summary?: string | null;
  tags?: string[];
};

export function OverviewMoodboard({
  summary,
  tags = [],
}: Readonly<OverviewMoodboardProps>) {
  return (
    <Paper withBorder p="md" radius="md" bg="gray.0" className="box-content">
      <Text size="md" fw={500} mb={4}>
        {summary}
      </Text>
      <Group gap="xs">
        {tags.map((tag) => (
          <Badge key={tag} size="md" color="blue" variant="light">
            {tag}
          </Badge>
        ))}
      </Group>
    </Paper>
  );
}
