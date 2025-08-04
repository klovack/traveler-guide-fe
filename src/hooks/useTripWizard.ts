import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { getTripWizardByIdApiV1TripWizardTripWizardIdGet, generateTripWizardApiV1TripWizardPost } from 'tg-sdk';
import type { TripWizardResponse, TripWizardRequest } from 'tg-sdk';

// Custom error for Trip Wizard API
export class TripWizardError extends Error {
  public readonly type: 'api' | 'network' | 'unknown';
  public readonly original?: unknown;
  constructor(message: string, type: 'api' | 'network' | 'unknown' = 'unknown', original?: unknown) {
    super(message);
    this.name = 'TripWizardError';
    this.type = type;
    this.original = original;
  }
}

// Query hook to get a trip wizard by ID
export function useTripWizard(
  tripWizardId: string,
  options?: UseQueryOptions<TripWizardResponse, TripWizardError>
) {
  return useQuery<TripWizardResponse, TripWizardError>({
    queryKey: ['tripWizard', tripWizardId],
    queryFn: async () => {
      try {
        const result = await getTripWizardByIdApiV1TripWizardTripWizardIdGet({ path: { trip_wizard_id: tripWizardId } });
        if (result.error) {
          const errAny = result.error as any;
          const msg = typeof errAny === 'string'
            ? errAny
            : (errAny?.detail || JSON.stringify(errAny) || 'API error');
          throw new TripWizardError(msg, 'api', result.error);
        }
        if (!result.data) throw new TripWizardError('No data returned', 'api');
        return result.data;
      } catch (err: any) {
        if (err instanceof TripWizardError) throw err;
        if (err?.name === 'TypeError') throw new TripWizardError('Network error', 'network', err);
        throw new TripWizardError(err?.message || 'Unknown error', 'unknown', err);
      }
    },
    ...options,
  });
}

// Mutation hook to create a trip wizard
export function useGenerateTripWizard(
  options?: UseMutationOptions<TripWizardResponse, TripWizardError, TripWizardRequest>
) {
  return useMutation<TripWizardResponse, TripWizardError, TripWizardRequest>({
    mutationFn: async (data) => {
      try {
        const result = await generateTripWizardApiV1TripWizardPost({ body: data });
        if (result.error) {
          const errAny = result.error as any;
          const msg = typeof errAny === 'string'
            ? errAny
            : (errAny?.detail || JSON.stringify(errAny) || 'API error');
          throw new TripWizardError(msg, 'api', result.error);
        }
        if (!result.data) throw new TripWizardError('No data returned', 'api');
        return result.data;
      } catch (err: any) {
        if (err instanceof TripWizardError) throw err;
        if (err?.name === 'TypeError') throw new TripWizardError('Network error', 'network', err);
        throw new TripWizardError(err?.message || 'Unknown error', 'unknown', err);
      }
    },
    ...options,
  });
}
