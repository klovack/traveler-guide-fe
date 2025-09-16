import { AppAuthError } from "@/errors";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppRoles, AuthUserInfo, getCurrentUserApiV1AuthMeGet } from "tg-sdk";
import { envVar } from "./utils/env";

const REDIRECT_LOGIN_PATH = "/login";
const REDIRECT_HOME_PATH = "/";

export type RequireUserOptions = {
  allowedRoles?: AppRoles[];
  redirectInsufficientRoleTo?: string;
  redirectUnauthenticatedTo?: string;
}

const defaultRequireUserOptions: RequireUserOptions = {
  redirectInsufficientRoleTo: REDIRECT_HOME_PATH,
  redirectUnauthenticatedTo: REDIRECT_LOGIN_PATH,
}

export async function requireUser({
  allowedRoles,
  redirectInsufficientRoleTo,
  redirectUnauthenticatedTo,
}: RequireUserOptions = defaultRequireUserOptions
): Promise<AuthUserInfo | undefined> {
  const theCookies = await cookies()
  const headersList = await headers();
  const token = theCookies.get("access_token")?.value;
  const rToken = theCookies.get("'refresh_token'")?.value;
  if (!token) {
    if (redirectUnauthenticatedTo) {
      // Get the current URL to redirect back after login
      const forwardedHost = headersList.get("x-forwarded-host");
      const forwardedProto = headersList.get("x-forwarded-proto");
      const pathname = headersList.get("x-pathname") || headersList.get("referer");

      if (pathname && !pathname.includes("/login") && !pathname.includes("/register") && !pathname.includes("/email-confirmation")) {
        const redirectUrl = `${redirectUnauthenticatedTo}?redirectTo=${encodeURIComponent(pathname)}`;
        redirect(redirectUrl);
      } else {
        redirect(redirectUnauthenticatedTo);
      }
    }

    return;
  }

  try {
    const res = await getCurrentUserApiV1AuthMeGet({
      headers: {
        Authorization: `Bearer ${token};refresh_token ${rToken}`
      },
      baseUrl: envVar.basePublicURL,
    });

    if (res.error) {
      throw new AppAuthError(`Unexpected Error ${res.error}`, "unexpected_failure")
    }

    const user = res.data;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (redirectInsufficientRoleTo) {
        redirect(redirectInsufficientRoleTo);
      }

      return;
    }

    return user
  } catch (err) {
    console.warn("User tries to get to protected pages unauthenticated", err)

    if (redirectUnauthenticatedTo) {
      redirect(redirectUnauthenticatedTo);
    }
  }
}
