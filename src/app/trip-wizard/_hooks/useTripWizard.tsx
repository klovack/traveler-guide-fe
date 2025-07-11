"use client";
import { NominatimFeatureSchema } from "@/lib/map/nominatim";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";

export const tripWizardSchema = z.object({
  trip_description: z.string().min(10),
  destinations: z.array(NominatimFeatureSchema).min(1),
  dates: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
  group_size: z.number().optional(),
  languages: z.array(z.string()).optional(),
  budget: z.enum(["low", "medium", "high"]).optional(),
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
      {children}
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
