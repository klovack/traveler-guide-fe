import { redirect, useRouter } from "next/navigation";
import { AppRoles, getCurrentUserApiV1AuthMeGet } from "tg-sdk";
import { requireUser } from "./auth.server";

type withRoleOptions<P> = {
  redirectInsufficientRoleTo?: string;
  redirectUnauthenticatedTo?: string;
};

export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: AppRoles[],
  options?: withRoleOptions<P>
) {
  const RoleProtectedComponent = async (props: P) => {
    await requireUser({
      allowedRoles,
      redirectInsufficientRoleTo: options?.redirectInsufficientRoleTo,
      redirectUnauthenticatedTo: options?.redirectUnauthenticatedTo,
    });

    return <Component {...props} />;
  };

  return RoleProtectedComponent;
}
