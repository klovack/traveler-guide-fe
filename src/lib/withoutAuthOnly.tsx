"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePostAuthRedirectUrl } from "@/hooks/usePostRedirectUrl";
import { Skeleton, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function withoutAuthOnly<P extends object>(
  Component: React.ComponentType<P>
) {
  const UnauthenticatedComponent = (props: P) => {
    const { user, isFetchingMe, isLoggingIn } = useAuth();
    const router = useRouter();
    const redirectTo = usePostAuthRedirectUrl();
    const hasRedirected = useRef(false);

    useEffect(() => {
      // Don't redirect if it's still fetching
      if (isFetchingMe || isLoggingIn) {
        return;
      }

      if (user && !hasRedirected.current) {
        hasRedirected.current = true;
        router.replace(redirectTo ?? "/dashboard");
      }
    }, [isFetchingMe, user, router, redirectTo]);

    if (isFetchingMe || isLoggingIn || user) {
      return (
        <Stack gap="md" justify="center" w="60vw">
          <Skeleton height={16} width="15%" />
          <Skeleton height={8} mt={6} width="10%" />
          <Skeleton height={16} mt={6} />
          <Skeleton height={8} mt={6} width="15%" />
          <Skeleton height={16} mt={6} />
        </Stack>
      );
    }

    // If we have already redirected once and now user is null, reset the flag
    if (!user && hasRedirected.current) {
      hasRedirected.current = false;
    }

    return <Component {...props} />;
  };

  return UnauthenticatedComponent;
}
