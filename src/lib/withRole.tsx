"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppRoles } from "tg-sdk";

export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: AppRoles[]
) {
  const RoleProtectedComponent = (props: P) => {
    const { user, isFetchingMe } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isFetchingMe && (!user || !allowedRoles.includes(user.role))) {
        // Replace the path with not-found to avoid exposing different pages for user
        router.replace("/not-found");
      }
    }, [isFetchingMe, user]);

    if (isFetchingMe || !user) {
      return <div className="p-4 text-center">Loading...</div>;
    }

    return <Component {...props} />;
  };

  return RoleProtectedComponent;
}
