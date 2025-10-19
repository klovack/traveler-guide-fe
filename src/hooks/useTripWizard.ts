import { exampleTrip } from '@/app/trip-wizard/example_trip';
import { envVar } from '@/lib/utils/env';
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
      const isDev = process.env.NODE_ENV === 'development';
      if (tripWizardId === 'debug' && isDev) {
        return exampleTrip;
      }

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


// Query hook to get multiple trip wizards by their IDs
// it works by calling get by id endpoint for each id and aggregating the results
export function useTripWizardsByIds(
  tripWizardIds: string[],
  options?: UseQueryOptions<TripWizardResponse[], TripWizardError>
) {
  return useQuery<TripWizardResponse[], TripWizardError>({
    queryKey: ['tripWizards', tripWizardIds],
    queryFn: async () => {
      const tripWizards: TripWizardResponse[] = [];
      // Collect promises for all trip wizard fetches
      const promises = tripWizardIds.map(async (id) => {
        try {
          const result = await getTripWizardByIdApiV1TripWizardTripWizardIdGet({ path: { trip_wizard_id: id } });
          if (result.error) {
            // Ignore this trip wizard if there's an API error
            return null;
          }
          return result.data ?? null;
        } catch {
          // Ignore this trip wizard if there's a network or unknown error
          return null;
        }
      });

      // Wait for all promises to settle
      const results = await Promise.all(promises);

      // Filter out nulls (failed fetches)
      tripWizards.push(...results.filter((tw): tw is TripWizardResponse => !!tw));
      return tripWizards;
    },
    ...options,
  });
}
