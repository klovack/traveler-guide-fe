"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DestinationMap from "./DestinationMap";
import PreferencesFields from "./PreferencesFields";
import GeneratedResult from "./GeneratedResult";

const tripWizardSchema = z.object({
  trip_description: z.string().min(10),
  destinations: z.array(z.string()).min(1),
  dates: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }),
  group_size: z.number().optional(),
  languages: z.array(z.string()).optional(),
  budget: z.enum(["low", "medium", "high"]).optional(),
  interests: z.array(z.string()).optional(),
});

type TripWizardFormValues = z.infer<typeof tripWizardSchema>;

export default function TripWizardForm() {
  const form = useForm<TripWizardFormValues>({
    resolver: zodResolver(tripWizardSchema),
    defaultValues: {
      destinations: [],
      languages: [],
      interests: [],
    },
  });

  const onSubmit = (data: TripWizardFormValues) => {
    // Later: call FastAPI /ai/trip-suggestions
    console.log("Trip preferences:", data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DestinationMap />
        <PreferencesFields />
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Generate Trip
        </button>
        <GeneratedResult />
      </form>
    </FormProvider>
  );
}
