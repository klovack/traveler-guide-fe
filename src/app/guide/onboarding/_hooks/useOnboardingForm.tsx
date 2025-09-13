"use client";

import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  getDraftApiV1GuideOnboardingDraftGet,
  GuideOnboardingDraftInput,
  zGuideOnboardingDraftInput,
  saveDraftApiV1GuideOnboardingDraftPost,
} from "tg-sdk";
import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "@mantine/hooks";

const DRAFT_QUERY_KEY = "onboarding_draft";
const DRAFT_STORAGE_KEY = "guide_onboarding_draft";
const DRAFT_SAVE_DEBOUNCE_MS = 1000;
const DRAFT_SAVE_MUTATION_KEY = "save_onboarding_draft";

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

const saveDraftFn = async (data: GuideOnboardingDraftInput) => {
  const response = await saveDraftApiV1GuideOnboardingDraftPost({
    body: data,
  });
  if (response.error) {
    throw response.error;
  }

  return response.data;
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
    queryKey: [DRAFT_QUERY_KEY, user?.id],
    queryFn: fetchDraft(),
    enabled: !!user, // Only fetch if user is present
  });

  const form = useForm<GuideOnboardingDraftInput>({
    resolver: zodResolver(zGuideOnboardingDraftInput),
    values: draft ? { ...draft } : undefined,
  });

  const saveDraft = useMutation({
    mutationFn: saveDraftFn,
    mutationKey: [DRAFT_SAVE_MUTATION_KEY, user?.id],
  });
  const debouncedSave = useDebouncedCallback(
    (data: GuideOnboardingDraftInput) => {
      if (user) {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
        saveDraft.mutate(data);
      }
    },
    DRAFT_SAVE_DEBOUNCE_MS
  );

  useEffect(() => {
    const subscription = form.watch((value) => {
      debouncedSave(value as GuideOnboardingDraftInput);
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedSave]);

  // Local resume if server is not available
  useEffect(() => {
    if (!draft && !isLoading) {
      const localDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (localDraft) {
        try {
          const parsed = JSON.parse(localDraft);
          const validated = zGuideOnboardingDraftInput.parse(parsed);
          form.reset(validated);
        } catch (e) {
          console.error("Failed to parse local draft", e);
        }
      }
    }
  }, [draft, isLoading, form]);

  return {
    isError: isError,
    isLoading: isFetchingMe || isLoggingIn || isLoading,
    form: isFetchingMe || isLoggingIn ? null : form,
    saving: saveDraft.isPending,
    save: saveDraft.mutate,
  };
}
