export type BaseRedirectUrl = '/login' | '/register' | "/email-confirmation";

export function createRedirectUrl(postAuthRedirectUrl: string, base: BaseRedirectUrl = '/login') {
  return `${base}?redirectTo=${encodeURIComponent(postAuthRedirectUrl)}`;
}

export function getPostAuthRedirectUrl(searchParams: URLSearchParams) {
  const redirectTo = searchParams.get("redirectTo");
  return redirectTo ? decodeURIComponent(redirectTo) : null;
}
