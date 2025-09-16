import { createRedirectUrl } from "@/lib/redirectUrl";
import { withRole } from "@/lib/withRole.server";
import { Text } from "@mantine/core";

export const metadata = {
  title: "Guide Dashboard | Mihape",
};

function GuideDashboardPage() {
  return <Text>Guide Dashboard Home</Text>;
}

export default withRole(GuideDashboardPage, ["guide", "user_manager"], {
  redirectUnauthenticatedTo: createRedirectUrl("/guide/dashboard", "/login"),
});
