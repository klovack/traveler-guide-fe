"use client";

import { getPostAuthRedirectUrl } from "@/lib/redirectUrl";
import { useSearchParams } from "next/navigation";

export function usePostAuthRedirectUrl() {
  const searchParams = useSearchParams();
  return getPostAuthRedirectUrl(searchParams);
}
