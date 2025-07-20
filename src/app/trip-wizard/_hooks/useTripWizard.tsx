"use client";
import { NominatimFeatureSchema } from "@/lib/map/nominatim";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import z from "zod";

// TODO: Move this to Backend
export type LanguageOption = "en" | "id" | "de";
// TODO: Move this to translation file
export const languageOptions: Record<LanguageOption, string> = {
  en: "English",
  de: "German",
  id: "Bahasa Indonesia",
};

// TODO: Move this to Backend
export type InterestOption =
  | "nature"
  | "culture"
  | "spiritual"
  | "food"
  | "adventure"
  | "relaxation";
export const interestOptions: Record<InterestOption, string> = {
  nature: "Nature",
  culture: "Culture",
  spiritual: "Spiritual",
  food: "Food",
  adventure: "Adventure",
  relaxation: "Relaxation",
};

export type DatesFlexibility =
  | "exact"
  | "one_day"
  | "three_days"
  | "seven_days";
export const datesFlexibilityOptions: Record<DatesFlexibility, string> = {
  exact: "Exact",
  one_day: "±1 Day",
  three_days: "±3 Days",
  seven_days: "±7 Days",
};
export const zodDatesFlexibilityOptions = z.enum([
  "exact",
  "one_day",
  "three_days",
  "seven_days",
]);

export const minMax = (
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
) =>
  z.object({
    min: z.number().min(min),
    max: z.number().max(max),
  });

export const tripWizardSchema = z.object({
  tripDescription: z.string().min(10).optional(),
  destinations: z.array(NominatimFeatureSchema).min(1),
  dates: z
    .object({
      start: z.string(),
      end: z.string(),
    }) // range
    .or(z.string()) // single day
    .or(z.array(z.string())), // multi days
  datesFlexibility: zodDatesFlexibilityOptions.optional(),
  groupSize: minMax(1, 1).optional(),
  languages: z.array(z.string()).optional(),
  budget: minMax(100, Infinity).optional(),
  interests: z.array(z.string()).optional(),
});
export type TripWizardFormValues = z.infer<typeof tripWizardSchema>;

type TripWizardContextType = {
  form: UseFormReturn<TripWizardFormValues>;
};

export type UseTripWizardOptions = {};

const TripWizardContext = React.createContext<
  TripWizardContextType | undefined
>(undefined);

export const TripWizardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<TripWizardFormValues>({
    resolver: zodResolver(tripWizardSchema),
    defaultValues: {
      destinations: [],
      languages: [],
      interests: [],
    },
  });

  const providerValue = useMemo(
    () => ({
      form,
    }),
    []
  );

  return (
    <TripWizardContext.Provider value={providerValue}>
      <FormProvider {...form}>{children}</FormProvider>
    </TripWizardContext.Provider>
  );
};

export const useTripWizard = (options: UseTripWizardOptions = {}) => {
  const context = React.useContext(TripWizardContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
