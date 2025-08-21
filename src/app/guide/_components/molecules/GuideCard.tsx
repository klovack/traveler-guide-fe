import { Card, Text, Group, Image } from "@mantine/core";

type GuideCardProps = {
  name: string;
  city: string;
  photoUrl?: string;
};

export function GuideCard({ name, city, photoUrl }: Readonly<GuideCardProps>) {
  return (
    <Card withBorder radius="md" p="md">
      <Group>
        {photoUrl && (
          <Image src={photoUrl} radius="sm" width={60} height={60} />
        )}
        <div>
          <Text fw={500}>{name}</Text>
          <Text size="sm" c="dimmed">
            {city}
          </Text>
        </div>
      </Group>
    </Card>
  );
}
