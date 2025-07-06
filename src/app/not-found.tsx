import { Center, Stack, Title, Text, Button } from "@mantine/core";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Center w="100vw" h="calc(100vh - 100px)" className="text-center">
      <Stack gap="md" justify="center" w="40vw">
        <Title ta="center" order={1}>
          Oops! You seem lost.
        </Title>

        <Text size="xl" c="dimmed" ta="center">
          The page you are looking for does not exist or has been moved.
        </Text>

        <Link href="/" style={{ textDecoration: "none" }}>
          <Button fullWidth variant="filled" size="md" td="none">
            Return Home
          </Button>
        </Link>
      </Stack>
    </Center>
  );
}
