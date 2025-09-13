import { DEFAULT_LOCATION } from "@/constants/common";
import { AppError } from "@/errors";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getCitiesWithinRadiusApiV1CitiesGet, getCitiesByNamesApiV1CitiesSearchGet, getCitiesByIdsApiV1CitiesByIdsGet } from "tg-sdk";

export const useCityWithinRadius = (radiusInKm: number = 100) => {
  const [userLoc, setUserLoc] = useState<{ lat: number, lng: number }>(DEFAULT_LOCATION);

  // Get user location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser, using default location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLoc({ lat: latitude, lng: longitude });
      },
      () => {
        console.log("Unable to retrieve your location, using default location.");
      }
    );
  }, []);

  return useQuery({
    queryKey: ['cities-within-radius', userLoc, radiusInKm],
    queryFn: async () => {
      const response = await getCitiesWithinRadiusApiV1CitiesGet({
        query: {
          latitude: userLoc.lat,
          longitude: userLoc.lng,
          radius_meters: radiusInKm * 1000,
        },
      });

      if (response.error) {
        const errorDetail = Array.isArray(response.error.detail)
          ? response.error.detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ")
          : response.error.detail;
        throw new Error(errorDetail || 'Failed to fetch cities');
      }

      return response.data
    },
  });
}

export const useCityWithSearch = (search: string) => {
  return useQuery({
    queryKey: ['cities-search', search],
    queryFn: async () => {
      const response = await getCitiesByNamesApiV1CitiesSearchGet({
        query: {
          names: [search],
        },
      });

      if (response.error) {
        const errorDetail = Array.isArray(response.error.detail)
          ? response.error.detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ")
          : response.error.detail;
        throw new Error(errorDetail || 'Failed to fetch cities');
      }

      return response.data;
    },
    enabled: !!search && search.length > 0,
  });
};

export const useCityByIds = (ids: string[]) => {
  return useQuery({
    queryKey: ['cities-by-ids', ids],
    queryFn: async () => {
      if (ids.length === 0) return [];

      const response = await getCitiesByIdsApiV1CitiesByIdsGet({
        query: { ids },
      });
      if (response.error) {
        const errorDetail = Array.isArray(response.error.detail)
          ? response.error.detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ")
          : response.error.detail;
        throw new AppError(errorDetail || 'Failed to fetch cities by IDs');
      }
      return response.data;
    },
    enabled: ids.length > 0,
  });
}
