import { AppError } from "@/errors";
import { useQuery } from "@tanstack/react-query";
import { getAllInterestsApiV1InterestsGet } from "tg-sdk";

export const useInterest = () => {
  return useQuery({
    queryKey: ["interests"],
    queryFn: async () => {
      const response = await getAllInterestsApiV1InterestsGet();

      if (response.error) {
        throw new AppError("Failed to fetch interests");
      }
      return response.data;
    },
  });
};
