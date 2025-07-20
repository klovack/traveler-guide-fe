"use client";

import maplibregl, { Marker, NavigationControl } from "maplibre-gl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl/dist/maplibre-gl.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import openStreetMapStyleSpec from "./openStreetMap.style.json";
import { Container, Pill, Text } from "@mantine/core";
import Link from "next/link";
import MaplibreGeocoder, {
  CarmenGeojsonFeature,
  MaplibreGeocoderFeatureResults,
} from "@maplibre/maplibre-gl-geocoder";
import {
  NominatimFeature,
  NominatimFeatureSchema,
  querySearch,
  reverseSearch,
} from "@/lib/map/nominatim";
import { TripWizardFormValues } from "../_hooks/useTripWizard";

export default function DestinationMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { setValue, getValues } = useFormContext<TripWizardFormValues>();
  const [destinations, setDestinations] = useState<
    Record<number, NominatimFeature>
  >({});
  const [markers, setMarkers] = useState<Marker[]>([]);
  const markersRef = useRef(markers);

  const fetchDestinationsFromForm = useCallback(() => {
    const destinationsFormValues: NominatimFeature[] =
      getValues<"destinations">("destinations");
    const destinationsMap: Record<number, NominatimFeature> = {};

    destinationsFormValues.forEach((destination) => {
      const id = destination.properties.place_id;
      destinationsMap[id] = destination;
    });

    setDestinations(destinationsMap);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: openStreetMapStyleSpec as maplibregl.StyleSpecification,
      center: [13.398625344283687, 52.657292288329046], // Berlin
      zoom: 5,
      canvasContextAttributes: { antialias: true },
      attributionControl: {
        compact: true,
      },
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
                text: feature.properties.display_name,
                place_name: feature.properties.name,
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
      }
    );

    mapRef.current.addControl(geocoder, "top-left");
    mapRef.current.addControl(new NavigationControl(), "bottom-right");

    geocoder.on("result", (e: { result: NominatimFeature }) => {
      const id = e.result.properties.place_id;
      if (!id) return;

      setDestinations((prevDestinations) => {
        const newDestinations = {
          ...prevDestinations,
          [id]: e.result,
        };
        return newDestinations;
      });
    });

    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      for (const marker of markersRef.current) {
        const { lng: markerLng, lat: markerLat } = marker.getLngLat();

        const lngDistance = Math.abs(markerLng - lng);
        const latDistance = Math.abs(markerLat - lat);

        // if user clicks the same city, we return because it's removed
        if (lngDistance < 0.2 && latDistance < 0.2) {
          return;
        }
      }

      const data = await reverseSearch({ lat, lng });
      if (data) {
        setDestinations((prevDestinations) => {
          const newDestinations: Record<number, NominatimFeature> = {};

          for (const feature of data.features) {
            const id = feature.properties.place_id;
            newDestinations[id] = feature;
          }

          return {
            ...prevDestinations,
            ...newDestinations,
          };
        });
      }
    });

    fetchDestinationsFromForm();
  }, [mapContainerRef.current]);

  useEffect(() => {
    if (!mapRef.current) return;
    markers.forEach((m) => m.remove());
    setMarkers([]);

    const newMarkers = [];

    for (const dest of Object.values(destinations)) {
      if (dest.geometry) {
        let lat = 0;
        let lng = 0;
        switch (dest.geometry.type) {
          case "Point":
            lat = dest.geometry.coordinates[1];
            lng = dest.geometry.coordinates[0];
            break;
          case "MultiPoint":
          case "LineString":
            lat = dest.geometry.coordinates[0][1];
            lng = dest.geometry.coordinates[0][0];
            break;
          case "MultiLineString":
          case "Polygon":
            lat = dest.geometry.coordinates[0][0][1];
            lng = dest.geometry.coordinates[0][0][0];
            break;
          case "MultiPolygon":
          case "GeometryCollection":
            continue;
        }

        const m = new Marker().setLngLat([lng, lat]).addTo(mapRef.current);
        m.getElement().addEventListener("click", () => {
          onRemoveDestinations(dest);
        });
        newMarkers.push(m);
      }
    }

    setMarkers(newMarkers);

    setValue(
      "destinations",
      Object.values(destinations)
        .map((destination) => {
          try {
            return NominatimFeatureSchema.parse(destination);
          } catch (e) {
            console.error("ERROR PARSING", e);
          }
        })
        .filter((destination) => destination !== undefined)
    );
  }, [destinations, mapRef.current]);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  const onRemoveDestinations = (destination: NominatimFeature) => {
    const id = destination.properties.place_id;
    const newDestinations = {
      ...destinations,
    };
    delete newDestinations[id];

    setDestinations(newDestinations);
  };

  return (
    <div className="mb-4">
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "500px",
        }}
      >
        <Container p={2} bg="#fff" className="absolute bottom-0 right-0">
          <Text size="xs">
            Map data from{" "}
            <Link
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
            >
              OpenStreetMap
            </Link>
          </Text>
        </Container>
      </div>

      {Object.values(destinations)?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-700">
          {Object.values(destinations).map((d, i) => (
            <Pill
              key={d.properties.place_id}
              withRemoveButton
              onRemove={() => onRemoveDestinations(d)}
            >
              {d.properties.name}
            </Pill>
          ))}
        </div>
      )}
    </div>
  );
}
