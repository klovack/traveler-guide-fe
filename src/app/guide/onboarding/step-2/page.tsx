import { Title, Text, Divider } from "@mantine/core";
import { useTranslations } from "next-intl";
import { GuideBasicForm } from "./_components/GuideBasicForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({
    locale,
    namespace: "GuideOnboardingPage",
  });

  return {
    title: t("metadata.title", { step: t("steps.2.title") }),
    description: t("metadata.description"),
  };
}

export default function Step2() {
  const t = useTranslations("GuideOnboardingPage.steps.2");

  return (
    <>
      <Title order={2} size="lg">
        {t("title")}
      </Title>
      <Text c="dimmed" size="sm">
        {t("description")}
      </Text>

      <Divider my="md" />

      <GuideBasicForm />
    </>
  );
}
