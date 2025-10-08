import { Center, Stack, Title, Text, Button, Image } from "@mantine/core";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFoundPage() {
  const t = useTranslations("NotFoundPage");

  return (
    <Center w="100vw" h="calc(100vh - 100px)" className="text-center">
      <Stack gap="md" justify="center" w="40vw">
        <Image
          src="/assets/mascots/mimi_read_map.svg"
          alt="Mimi reading upside down map"
          h={200}
          fit="contain"
          mx="auto"
        />
        <Title ta="center" order={1}>
          {t("title")}
        </Title>

        <Text size="xl" c="dimmed" ta="center">
          {t("description")}
        </Text>

        <Link href="/" style={{ textDecoration: "none" }}>
          <Button fullWidth variant="filled" size="md" td="none">
            {t("backHomeButton")}
          </Button>
        </Link>
      </Stack>
    </Center>
  );
}
