"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import {
  TripWizardDatesFlexibility,
  TripWizardRequest,
  zTripWizardRequest,
} from "tg-sdk";
import z from "zod";

export const languageOptions: Exclude<
  TripWizardRequest["languages"],
  null | undefined
> = [
  "en",
  "id",
  "es",
  "fr",
  "de",
  "it",
  "nl",
  "pt",
  "ru",
  "zh",
  "ja",
  "ko",
  "jawa",
  "sunda",
  "batak",
  "madura",
  "bali",
  "bugis",
  "aceh",
  "banjar",
  "betawi",
  "minangkabau",
  "sasak",
  "toraja",
  "ambon",
  "papua",
];

export type InterestOption =
  | "culture"
  | "nature"
  | "food"
  | "shopping"
  | "nightlife"
  | "wellness"
  | "family"
  | "romantic"
  | "sports"
  | "art"
  | "local";
export const interestOptions: InterestOption[] = [
  "culture",
  "nature",
  "food",
  "shopping",
  "nightlife",
  "wellness",
  "family",
  "romantic",
  "sports",
  "art",
  "local",
];

export const datesFlexibilityOptions: TripWizardDatesFlexibility[] = [
  "exact",
  "one_day",
  "two_days",
  "three_days",
  "seven_days",
];

type TripWizardFormContextType = {
  form: UseFormReturn<TripWizardRequest>;
};

export type UseTripWizardOptions = {};

const TripWizardFormContext = React.createContext<
  TripWizardFormContextType | undefined
>(undefined);

export const TripWizardFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<TripWizardRequest>({
    resolver: zodResolver(zTripWizardRequest),
    defaultValues: {
      destinations: [],
      languages: [],
      interests: [],
      group_size_details: {
        adult: 1,
        children: 0,
        infants: 0,
      },
    },
  });

  const providerValue = useMemo(
    () => ({
      form,
    }),
    []
  );

  return (
    <TripWizardFormContext.Provider value={providerValue}>
      <FormProvider {...form}>{children}</FormProvider>
    </TripWizardFormContext.Provider>
  );
};

export const useTripWizardForm = (options: UseTripWizardOptions = {}) => {
  const context = React.useContext(TripWizardFormContext);
  if (!context) {
    throw new Error(
      "useTripWizardForm must be used within an TripWizardFormProvider"
    );
  }

  return context;
};
