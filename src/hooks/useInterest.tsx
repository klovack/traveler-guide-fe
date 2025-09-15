import { AppError } from "@/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInterestApiV1InterestsCreatePost,
  getAllInterestsApiV1InterestsGet,
} from "tg-sdk";

const QUERY_KEY_INTERESTS = "interests";
const MUTATION_KEY_CREATE_INTEREST = "create-interest";

export const useInterest = () => {
  return useQuery({
    queryKey: [QUERY_KEY_INTERESTS],
    queryFn: async () => {
      const response = await getAllInterestsApiV1InterestsGet();

      if (response.error) {
        throw new AppError("Failed to fetch interests");
      }
      return response.data;
    },
  });
};

export const useCreateInterestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_KEY_CREATE_INTEREST],
    mutationFn: async (name: string) => {
      const response = await createInterestApiV1InterestsCreatePost({
        body: { name },
      });

      if (response.error) {
        throw new AppError("Failed to create personality");
      }

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_INTERESTS] });
    },
  });
};
