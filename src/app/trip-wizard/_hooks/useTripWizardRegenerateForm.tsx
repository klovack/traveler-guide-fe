import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  TripWizardRegenerateRequest,
  TripWizardResponse,
  zTripWizardRegenerateRequest,
  regenerateTripWizardApiV1TripWizardTripWizardIdRegeneratePost,
} from "tg-sdk";
import { useMutation } from "@tanstack/react-query";

export function useTripWizardRegenerateForm(tripWizard: TripWizardResponse) {
  const form = useForm<TripWizardRegenerateRequest>({
    resolver: zodResolver(zTripWizardRegenerateRequest),
    defaultValues: {
      description: "",
      travel_vibe: tripWizard?.travel_vibe,
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: async (data: TripWizardRegenerateRequest) => {
      if (!tripWizard) {
        throw new Error("Trip wizard data is not available");
      }

      const response =
        await regenerateTripWizardApiV1TripWizardTripWizardIdRegeneratePost({
          path: {
            trip_wizard_id: tripWizard.id,
          },
          body: data,
        });

      if (response.error || !response.data) {
        throw new Error(
          `Failed to regenerate trip wizard: ${JSON.stringify(response.error)}`
        );
      }

      return response.data;
    },
  });

  return {
    form,
    send: (options?: Parameters<typeof regenerateMutation.mutate>[1]) => {
      const data = form.getValues();

      regenerateMutation.mutate(data, options);
    },
    isPending: regenerateMutation.isPending,
  };
}
