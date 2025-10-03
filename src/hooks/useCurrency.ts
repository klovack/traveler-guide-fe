import { useQuery } from "@tanstack/react-query"
import { getAllCurrenciesApiV1CurrenciesGet } from "tg-sdk"

export const useCurrency = () => {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const response = await getAllCurrenciesApiV1CurrenciesGet({
        query: {
          used_in_app: true
        }
      })

      if (response.error) {
        const errorDetail = Array.isArray(response.error.detail)
          ? response.error.detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ")
          : response.error.detail;
        throw new Error(errorDetail || 'Failed to fetch currencies');
      }

      return (response.data ?? []).reduce((acc: Record<string, typeof response.data[0]>, currency) => {
        acc[currency.code] = currency;
        return acc;
      }, {});
    },
    enabled: true,
  })
}
