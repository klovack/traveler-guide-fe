import { AppError } from "@/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  createPersonalityApiV1PersonalitiesCreatePost,
  getAllPersonalitiesApiV1PersonalitiesGet,
  getPersonalitiesByNamesApiV1PersonalitiesByNamesGet,
} from "tg-sdk";

const QUERY_KEY_PERSONALITIES = "personalities";
const QUERY_KEY_PERSONALITIES_BY_NAMES = "personalities-by-names";
const MUTATION_KEY_CREATE_PERSONALITY = "create-personality";

export const usePersonality = () =>
  useQuery({
    queryKey: [QUERY_KEY_PERSONALITIES],
    queryFn: async () => {
      const response = await getAllPersonalitiesApiV1PersonalitiesGet({
        query: {
          size: 100,
        },
      });

      if (response.error) {
        throw new AppError("Failed to fetch personalities");
      }

      return response.data;
    },
  });

export const usePersonalityByNames = (names: string[]) => {
  return useQuery({
    queryKey: [QUERY_KEY_PERSONALITIES_BY_NAMES, names],
    queryFn: async () => {
      if (names.length === 0) return [];

      const response =
        await getPersonalitiesByNamesApiV1PersonalitiesByNamesGet({
          query: {
            names,
          },
        });

      if (response.error) {
        throw new AppError("Failed to fetch personalities by names");
      }

      return response.data;
    },
    enabled: names.length > 0,
  });
};

export const useCreatePersonalityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_KEY_CREATE_PERSONALITY],
    mutationFn: async (name: string) => {
      const response = await createPersonalityApiV1PersonalitiesCreatePost({
        body: { name },
      });

      if (response.error) {
        throw new AppError("Failed to create personality");
      }

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_PERSONALITIES] });
    },
  });
};
