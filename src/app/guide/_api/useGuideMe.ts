import { useQuery } from "@tanstack/react-query";
import { getMeApiV1GuidesMeGet } from "tg-sdk";

const QUERY_KEY = "guide-me";

export function getQueryKey() {
  return [QUERY_KEY];
}

export function useGuideMe() {
  const query = useQuery({
    queryKey: getQueryKey(),
    queryFn: async () => {
      const response = await getMeApiV1GuidesMeGet();
      if (!response.data) {
        throw new Error("No guide data found");
      }
      return response.data;
    }
  })

  return query;
}
