import { redirect, useRouter } from "next/navigation";
import { AppRoles, getCurrentUserApiV1AuthMeGet } from "tg-sdk";
import { requireUser } from "./auth.server";

type withRoleOptions<P> = {
  redirectTo?: string;
};

export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: AppRoles[],
  options?: withRoleOptions<P>
) {
  const RoleProtectedComponent = async (props: P) => {
    await requireUser({ allowedRoles, redirectTo: options?.redirectTo });

    return <Component {...props} />;
  };

  return RoleProtectedComponent;
}
