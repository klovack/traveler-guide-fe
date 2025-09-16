import { PREDEFINED_ROLES } from "@/constants/auth";
import { withRole } from "@/lib/withRole.server";
import {
  Anchor,
  Divider,
  List,
  ListItem,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCircle } from "@tabler/icons-react";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { StartOnboardingForm } from "./_components/StartOnboardingForm";
import { createRedirectUrl } from "@/lib/redirectUrl";

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
    title: t("metadata.title", { step: t("steps.1.title") }),
    description: t("metadata.description"),
  };
}

function OnboardingStep1Page() {
  const t = useTranslations("GuideOnboardingPage.steps.1");
  return (
    <>
      <Title order={2} size="lg">
        {t("title")}
      </Title>
      <Text c="dimmed" size="sm">
        {t("description")}
      </Text>

      <Divider my="md" />

      <Text size="lg" mb="sm">
        {t("whatNeeded")}
      </Text>
      <List
        type="ordered"
        center
        spacing="xs"
        icon={
          <ThemeIcon variant="white" color="gray" size={24} radius="xl">
            <IconCircle size={16} />
          </ThemeIcon>
        }
      >
        <ListItem>{t("whatNeededItems.photo")}</ListItem>
        <ListItem>{t("whatNeededItems.id")}</ListItem>
        <ListItem>{t("whatNeededItems.address")}</ListItem>
        <ListItem>{t("whatNeededItems.bank")}</ListItem>
        <ListItem>{t("whatNeededItems.cert")}</ListItem>
        <ListItem>{t("whatNeededItems.courage")}</ListItem>
        <ListItem>{t("whatNeededItems.adventure")}</ListItem>
      </List>

      <Text mt="md">
        <Anchor href="/guide/community-guidelines" target="_blank">
          {t("guidelines")}
        </Anchor>
      </Text>

      <StartOnboardingForm />
    </>
  );
}

export default withRole(OnboardingStep1Page, PREDEFINED_ROLES.GUIDE_ONLY, {
  redirectInsufficientRoleTo: "/dashboard",
  redirectUnauthenticatedTo: createRedirectUrl("/guide/onboarding/step-1"),
});
