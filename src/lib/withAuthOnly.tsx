"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuthOnly<P extends object>(
  Component: React.ComponentType<P>
) {
  const AuthenticatedComponent = (props: P) => {
    const { user, isFetchingMe } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isFetchingMe && !user) {
        router.replace("/login");
      }
    }, [isFetchingMe, user, router]);

    if (isFetchingMe || !user) {
      return <div className="p-4 text-center">Loading...</div>;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
}
