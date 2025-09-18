import { createRedirectUrl } from "@/lib/redirectUrl";
import { withRole } from "@/lib/withRole.server";
import { Alert, Text } from "@mantine/core";
import Link from "next/link";

export const metadata = {
  title: "Guide Dashboard | Mihape",
};

function GuideDashboardPage() {
  return (
    <>
      <Alert variant="filled" title="Finish your profile!" mb="md">
        <Text>
          You haven't completed your guide profile yet. Please complete your
          profile to start offering your services{" "}
          <Link href="/guide/onboarding">here</Link>.
        </Text>
      </Alert>
      <h1 className="text-2xl font-bold">Guide Dashboard</h1>
      <p className="mt-4">Welcome to your guide dashboard!</p>
    </>
  );
}

export default withRole(GuideDashboardPage, ["guide", "user_manager"], {
  redirectInsufficientRoleTo: "/dashboard",
  redirectUnauthenticatedTo: createRedirectUrl("/guide/dashboard", "/login"),
});
