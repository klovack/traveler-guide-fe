"use client";

import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  getDraftApiV1GuideOnboardingDraftGet,
  GuideOnboardingDraftInput,
  zGuideOnboardingDraftInput,
} from "tg-sdk";
import { useEffect, useRef } from "react";

const DRAFT_QUERY_KEY = "onboarding-draft";

const fetchDraft = () => {
  return async () => {
    const response = await getDraftApiV1GuideOnboardingDraftGet();
    if (response.error) {
      if (response.response.status === 409) {
        redirect("/dashboard");
      }

      throw response.error;
    }

    return response.data;
  };
};

export function useOnboardingForm() {
  const { user, isFetchingMe, isLoggingIn } = useAuth();
  const router = useRouter();
  const didInitialCheck = useRef(false);

  useEffect(() => {
    if (!didInitialCheck.current) {
      didInitialCheck.current = true;
      return;
    }

    if (user === undefined && isFetchingMe === false && isLoggingIn === false) {
      router.replace("/login");
    }
  }, [user, isFetchingMe, isLoggingIn, router]);

  const {
    data: draft,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [DRAFT_QUERY_KEY],
    queryFn: fetchDraft(),
    enabled: !!user, // Only fetch if user is present
  });

  const form = useForm<GuideOnboardingDraftInput>({
    resolver: zodResolver(zGuideOnboardingDraftInput),
    values: draft ? { ...draft } : undefined,
  });

  return {
    isError: isError,
    isLoading: isFetchingMe || isLoggingIn || isLoading,
    form: isFetchingMe || isLoggingIn ? null : form,
  };
}
