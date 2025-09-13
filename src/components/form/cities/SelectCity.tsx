"use client";

import {
  useCityByIds,
  useCityWithinRadius,
  useCityWithSearch,
} from "@/hooks/useCity";
import { ComboboxItem, Select } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";

export type SelectCityProps = Omit<React.ComponentProps<typeof Select>, "data">;

export function SelectCity(props: Readonly<SelectCityProps>) {
  const t = useTranslations();

  const [searchQuery, setSearchQuery] = useState<string>();
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);

  const { data: cities } = useCityWithinRadius();
  const { data: searchedCities } = useCityWithSearch(
    debouncedSearchQuery || ""
  );

  // Compose city data for the select dropdown
  const dataCities = useMemo(() => {
    const result: ComboboxItem[] = [];

    if (cities) {
      result.push(
        ...cities.map((city) => ({ value: city.id, label: city.name }))
      );
    }

    if (searchedCities && debouncedSearchQuery) {
      result.push(
        ...(searchedCities || []).map((city) => ({
          value: city.id,
          label: city.name,
        }))
      );
    }

    // Remove duplicates by converting to a map and back to an array
    const cityData: Record<string, { value: string; label: string }> = {};
    result.forEach((city) => {
      cityData[city.value] = city;
    });

    return Object.values(cityData);
  }, [cities, searchedCities, debouncedSearchQuery]);

  // Only fetch city by ID if value is not in dataCities
  const shouldFetchSelected =
    props.value && !dataCities.some((city) => city.value === props.value);

  const { data: selected } = useCityByIds(
    shouldFetchSelected ? [props.value] : []
  );

  // Merge selected city if needed
  const mergedDataCities = useMemo(() => {
    if (!selected || !shouldFetchSelected) return dataCities;
    const selectedItems = selected.map((city) => ({
      value: city.id,
      label: city.name,
    }));
    // Avoid duplicates
    const cityMap: Record<string, { value: string; label: string }> = {};
    [...dataCities, ...selectedItems].forEach((city) => {
      cityMap[city.value] = city;
    });
    return Object.values(cityMap);
  }, [dataCities, selected, shouldFetchSelected]);

  return (
    <Select
      label={t("common.city.label")}
      placeholder={t("common.city.placeholder")}
      data={mergedDataCities}
      searchable
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      {...props}
    />
  );
}
