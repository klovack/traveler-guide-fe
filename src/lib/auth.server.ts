import { AppAuthError } from "@/errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppRoles, AuthUserInfo, getCurrentUserApiV1AuthMeGet } from "tg-sdk";
import { envVar } from "./utils/env";

const REDIRECT_PATH = "/login";

export type RequireUserOptions = {
  allowedRoles?: AppRoles[];
  redirectTo?: string;
}

const defaultRequireUserOptions = {
  redirectTo: REDIRECT_PATH,
}

export async function requireUser({
  allowedRoles,
  redirectTo,
}: RequireUserOptions = defaultRequireUserOptions
): Promise<AuthUserInfo | undefined> {
  const theCookies = await cookies()
  const token = theCookies.get("access_token")?.value;
  const rToken = theCookies.get("'refresh_token'")?.value;
  if (!token) {
    if (redirectTo)
      redirect(redirectTo);

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
      if (redirectTo)
        redirect(redirectTo);

      return;
    }

    return user
  } catch (err) {
    console.warn("User tries to get to protected pages unauthenticated", err)

    if (redirectTo) {
      redirect(redirectTo);
    }
  }
}
