import { Title, Text, Divider } from "@mantine/core";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PREDEFINED_ROLES } from "@/constants/auth";
import { createRedirectUrl } from "@/lib/redirectUrl";
import { withRole } from "@/lib/withRole.server";

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
    title: t("metadata.title", { step: t("steps.5.title") }),
    description: t("metadata.description"),
  };
}

function Step5() {
  const t = useTranslations("GuideOnboardingPage.steps.5");

  return (
    <>
      <Title order={2} size="lg">
        {t("title")}
      </Title>
      <Text c="dimmed" size="sm">
        {t("description")}
      </Text>

      <Divider my="md" />
    </>
  );
}

export default withRole(Step5, PREDEFINED_ROLES.GUIDE_ONLY, {
  redirectInsufficientRoleTo: "/dashboard",
  redirectUnauthenticatedTo: createRedirectUrl("/guide/onboarding/step-5"),
});