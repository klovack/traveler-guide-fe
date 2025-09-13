import {
  useCityByIds,
  useCityWithinRadius,
  useCityWithSearch,
} from "@/hooks/useCity";
import { ComboboxItem, MultiSelect, MultiSelectProps } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState, useMemo, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";

export type MultiSelectCityProps = Omit<MultiSelectProps, "data">;

export function MultiSelectCity(props: Readonly<MultiSelectCityProps>) {
  const t = useTranslations();

  const [searchQuery, setSearchQuery] = useState<string>();
  const [debouncedSearch] = useDebouncedValue(searchQuery, 400);
  const [selectedCities, setSelectedCities] = useState<
    Record<string, ComboboxItem>
  >({});

  const { data: cities } = useCityWithinRadius();
  const { data: searchedCities } = useCityWithSearch(debouncedSearch || "");

  // Compose all available city data
  const dataCities = useMemo(() => {
    const result: ComboboxItem[] = [];

    if (cities) {
      result.push(
        ...cities.map((city) => ({ value: city.id, label: city.name }))
      );
    }

    if (searchedCities && debouncedSearch) {
      result.push(
        ...searchedCities.map((city) => ({ value: city.id, label: city.name }))
      );
    }

    // Ensure selected cities are included in the data
    Object.values(selectedCities).forEach((city) => {
      result.push(city);
    });

    // Remove duplicates
    const cityData: Record<string, ComboboxItem> = {};
    result.forEach((city) => {
      cityData[city.value] = city;
    });

    return Object.values(cityData);
  }, [cities, searchedCities, debouncedSearch, selectedCities]);

  // Find missing ids from props.value that are not in dataCities
  const missingIds = useMemo(() => {
    if (!props.value) return [];
    const dataCityIds = new Set(dataCities.map((c) => c.value));
    return props.value.filter((id) => !dataCityIds.has(id));
  }, [props.value, dataCities]);

  // Fetch missing cities only if needed
  const { data: missingCities } = useCityByIds(
    missingIds.length > 0 ? missingIds : []
  );

  // Add missing cities to selectedCities state when fetched
  // This effect ensures missing cities are added only once
  useEffect(() => {
    if (missingCities && missingCities.length > 0) {
      setSelectedCities((prev) => {
        const updated = { ...prev };
        missingCities.forEach((city) => {
          updated[city.id] = { value: city.id, label: city.name };
        });
        return updated;
      });
    }
  }, [missingCities]);

  return (
    <MultiSelect
      label={t("common.city.label")}
      placeholder={t("common.city.placeholder")}
      data={dataCities}
      searchable
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      {...props}
      onChange={(value) => {
        const selected = dataCities.filter((city) =>
          value.includes(city.value)
        );
        const valueMap = Object.fromEntries(
          selected.map((city) => [city.value, city])
        );
        setSelectedCities(valueMap);
        props.onChange?.(value);
        setSearchQuery("");
      }}
    />
  );
}
