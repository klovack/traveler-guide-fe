import { AppAuthError } from "@/errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppRoles, AuthUserInfo, getCurrentUserApiV1AuthMeGet } from "tg-sdk";
import { envVar } from "./utils/env";

const REDIRECT_PATH = "/login";

export async function requireUser(
  allowedRoles?: AppRoles[],
): Promise<AuthUserInfo | undefined> {
  const theCookies = await cookies()
  const token = theCookies.get("access_token")?.value;
  const rToken = theCookies.get("'refresh_token'")?.value;
  if (!token) redirect(REDIRECT_PATH);

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
      redirect("/not-found");
    }

    return user
  } catch (err) {
    console.warn("User tries to get to protected pages unauthenticated", err)
    redirect(REDIRECT_PATH)
  }
}
