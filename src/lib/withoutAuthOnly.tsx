"use client";

import { useAuth } from "@/hooks/useAuth";
import { Skeleton, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withoutAuthOnly<P extends object>(
  Component: React.ComponentType<P>
) {
  const UnauthenticatedComponent = (props: P) => {
    const { user, isFetchingMe } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isFetchingMe && user) {
        router.replace("/dashboard");
      }
    }, [isFetchingMe, user, router]);

    if (isFetchingMe || user) {
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

    return <Component {...props} />;
  };

  return UnauthenticatedComponent;
}
