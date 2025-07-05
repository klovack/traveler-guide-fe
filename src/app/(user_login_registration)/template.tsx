"use client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isFetchingUser, setIsFetchingUser] = useState(true);

  const { fetchMe, isLoggedIn } = useAuth();
  const router = useRouter();

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    setIsFetchingUser(true);

    const fetchUser = async () => {
      try {
        if (!isLoggedIn()) {
          const user = await fetchMe();
          if (user) {
            setIsFetchingUser(false);
            // Redirect to dashboard if user is logged in
            router.replace("/dashboard");
            return;
          }
        }
      } catch {
        // If there's an error fetching user, we can assume user is not logged in
        console.debug("User is not logged in");
      } finally {
        setIsFetchingUser(false);
      }
    };
    fetchUser();
  }, []);

  const loading = (
    <Stack gap="md" justify="center" w="60vw">
      <Skeleton height={16} width="15%" />
      <Skeleton height={8} mt={6} width="10%" />
      <Skeleton height={16} mt={6} />
      <Skeleton height={8} mt={6} width="15%" />
      <Skeleton height={16} mt={6} />
    </Stack>
  );

  return <>{isFetchingUser ? loading : children}</>;
}
