"use client";

import maplibregl, { Marker, NavigationControl } from "maplibre-gl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl/dist/maplibre-gl.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Group, Pill, Stack, Switch, Text } from "@mantine/core";
import MaplibreGeocoder, {
  CarmenGeojsonFeature,
  MaplibreGeocoderFeatureResults,
} from "@maplibre/maplibre-gl-geocoder";
import {
  NominatimFeature,
  querySearch,
  reverseSearch,
} from "@/lib/map/nominatim";
import { useLocale, useTranslations } from "next-intl";
import { Destination, TripWizardRequest } from "tg-sdk";
import { isWithinDistance } from "@/lib/map/coordinates_helper";
import { DEFAULT_MAP_OPTIONS } from "@/lib/map/default";

export type DestinationMapProps = {
  onDestinationSelected?: (destinations: Destination[]) => void;
};

export default function DestinationMap({
  onDestinationSelected,
}: Readonly<DestinationMapProps>) {
  const t = useTranslations("TripWizardPage.preferences");
  const locale = useLocale();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { setValue, getValues, watch } = useFormContext<TripWizardRequest>();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const markersRef = useRef(markers);

  const fetchDestinationsFromForm = useCallback(() => {
    const destinationsFormValues: Destination[] =
      getValues<"destinations">("destinations");

    setDestinations(destinationsFormValues);
  }, []);

  const setDestinationsFromNominatim = useCallback(
    (feature: NominatimFeature) => {
      const newDestination: Destination = {
        name:
          feature.properties.address?.city ??
          feature.properties.address?.town ??
          feature.properties.address?.municipality ??
          feature.properties.name,
        country_code:
          feature.properties.address?.country_code.toUpperCase() ?? "DE",
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
      };

      for (const dest of destinations) {
        if (
          dest.name === newDestination.name &&
          dest.country_code === newDestination.country_code
        ) {
          // if the destination already exists, we compare the coordinates
          if (
            isWithinDistance(
              dest.lat,
              dest.lon,
              newDestination.lat,
              newDestination.lon,
              5 // 5 km
            )
          ) {
            // if the coordinates are within 5km, we return
            return;
          }
        }
      }

      setDestinations((prevDestinations) => {
        const newDestinations = [...prevDestinations, newDestination];
        return newDestinations;
      });
    },
    [destinations, setDestinations]
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      ...DEFAULT_MAP_OPTIONS,
      container: mapContainerRef.current,
      locale: locale,
    });

    const geocoder = new MaplibreGeocoder(
      {
        forwardGeocode: async (config) => {
          const features: CarmenGeojsonFeature[] = [];
          const data = await querySearch(config.query);
          if (data) {
            for (const feature of data.features) {
              if (!feature.geometry) continue; // Ensure geometry is present
              features.push({
                ...feature,
                id: String(feature.properties.place_id),
                text: feature.properties.name,
                place_name: feature.properties.display_name,
                place_type: [feature.properties.addresstype],
                geometry: feature.geometry, // Explicitly set geometry
              });
            }
          }

          return {
            type: "FeatureCollection",
            features,
          } as MaplibreGeocoderFeatureResults;
        },
      },
      {
        marker: false,
        zoom: 5,
        flyTo: {
          zoom: 7,
        },
        showResultMarkers: false,
        showResultsWhileTyping: true,
        debounceSearch: 1000,
        placeholder: t("form.destination.searchPlaceholder"),
      }
    );

    mapRef.current.addControl(geocoder, "top-left");
    mapRef.current.addControl(new NavigationControl(), "bottom-right");

    geocoder.on("result", (e: { result: NominatimFeature }) => {
      setDestinationsFromNominatim(e.result);
    });

    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      const data = await reverseSearch({ lat, lng });
      if (data) {
        for (const feature of data.features) {
          setDestinationsFromNominatim(feature);
        }
      }
    });

    fetchDestinationsFromForm();
  }, [mapContainerRef.current]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create a set of destination coordinates for quick lookup
    const destinationCoords = new Set(
      destinations.map((dest) => `${dest.lat},${dest.lon}`)
    );

    // Filter out markers that no longer have a corresponding destination
    const updatedMarkers = markers.filter((marker) => {
      const { lat, lng } = marker.getLngLat();
      return destinationCoords.has(`${lat},${lng}`);
    });

    // Remove markers that are not in destinations
    markers.forEach((marker) => {
      const { lat, lng } = marker.getLngLat();
      if (!destinationCoords.has(`${lat},${lng}`)) {
        marker.remove();
      }
    });

    // Add new markers for destinations that don't have a marker yet
    const markerCoords = new Set(
      updatedMarkers.map((marker) => {
        const { lat, lng } = marker.getLngLat();
        return `${lat},${lng}`;
      })
    );

    const newMarkers = [...updatedMarkers];

    for (const dest of destinations) {
      const coordKey = `${dest.lat},${dest.lon}`;
      if (!markerCoords.has(coordKey)) {
        const m = new Marker()
          .setLngLat([dest.lon, dest.lat])
          .setPopup(
            new maplibregl.Popup({
              closeButton: false,
            }).setHTML(`<Text>${dest.name}</Text>`)
          )
          .addTo(mapRef.current);
        m.getElement().addEventListener("mouseenter", () => {
          m.togglePopup();
        });
        m.getElement().addEventListener("mouseleave", () => {
          m.togglePopup();
        });
        m.getElement().addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          onRemoveDestinations(dest);
        });
        newMarkers.push(m);
      }
    }

    setMarkers(newMarkers);

    setValue(
      "destinations",
      destinations.filter((destination) => destination !== undefined)
    );
  }, [destinations, mapRef.current]);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  const onRemoveDestinations = (destination: Destination) => {
    setDestinations((prevDestinations) => {
      const newDestinations = prevDestinations.filter(
        (d) =>
          d.name !== destination.name ||
          d.country_code !== destination.country_code
      );
      return newDestinations;
    });
  };

  useEffect(() => {
    if (!destinations || destinations.length === 0) return;

    if (destinations.length < 2) {
      setValue("is_round_trip", false);
    }

    onDestinationSelected?.(destinations);
  }, [destinations]);

  return (
    <Stack className="mb-4">
      <Group align="center" gap="md">
        <Text size="sm" fw={500}>
          {t("form.destination.label")}
        </Text>

        {destinations.length >= 2 && (
          <Switch
            size="sm"
            checked={watch("is_round_trip")}
            onChange={(value) => {
              setValue("is_round_trip", value.currentTarget.checked);
            }}
            label={t("form.destination.roundTrip")}
          />
        )}
      </Group>
      <div
        ref={mapContainerRef}
        className="w-full h-[500px] rounded-xl overflow-hidden"
      ></div>

      {destinations.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-700">
          {destinations.map((d, i) => (
            <Pill
              key={d.lat + d.lon + i}
              withRemoveButton
              onRemove={() => onRemoveDestinations(d)}
            >
              {i + 1}. {d.name}
            </Pill>
          ))}

          {getValues("is_round_trip") && (
            <Pill
              key={`round-trip-${destinations.length}`}
              withRemoveButton
              onRemove={() => setValue("is_round_trip", false)}
            >
              {destinations.length}. {destinations[0].name} (Round Trip)
            </Pill>
          )}
        </div>
      )}
    </Stack>
  );
}
