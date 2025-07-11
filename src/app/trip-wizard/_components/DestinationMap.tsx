"use client";

import maplibregl, { Marker, NavigationControl } from "maplibre-gl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import openStreetMapStyleSpec from "./openStreetMap.style.json";
import { Container, Pill, Text } from "@mantine/core";
import Link from "next/link";
import MaplibreGeocoder, {
  CarmenGeojsonFeature,
  MaplibreGeocoderFeatureResults,
} from "@maplibre/maplibre-gl-geocoder";
import { AppError } from "@/errors";

type NominatimProperties = {
  place_id: number;
  osm_type: string;
  osm_id: number;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    city: string;
    "ISO3166-2-lvl4": string;
    country: string;
    country_code: string;
  };
};

type NominatimFeature = GeoJSON.Feature<
  GeoJSON.Geometry,
  NominatimProperties
> & {
  bbox: [number, number, number, number];
};

type NominatimFeatureCollection = {
  type: "FeatureCollection";
  features: Array<NominatimFeature>;
};

export default function DestinationMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { setValue, getValues } = useFormContext();
  const [dests, setDests] = useState<Record<number, NominatimFeature>>({});
  const [markers, setMarkers] = useState<Marker[]>([]);
  const markersRef = useRef(markers);

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
          try {
            const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&addressdetails=0`;
            const response = await fetch(request);
            const geojson: NominatimFeatureCollection = await response.json();
            for (const feature of geojson.features) {
              features.push({
                ...feature,
                id: String(feature.properties.place_id),
                text: feature.properties.display_name,
                place_name: feature.properties.name,
                place_type: [feature.properties.addresstype],
              });
            }
          } catch (e) {
            // TODO: Error notification toast
            console.error(`Failed to forwardGeocode with error: ${e}`);
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
      }
    );

    mapRef.current.addControl(geocoder, "top-left");
    mapRef.current.addControl(new NavigationControl(), "bottom-right");

    geocoder.on("result", (e: { result: NominatimFeature }) => {
      const id = e.result.properties.place_id;
      if (!id) return;

      setDests((prevDests) => {
        const newDests = {
          ...prevDests,
          [id]: e.result,
        };
        return newDests;
      });
    });

    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      const toBeRemovedMarker: number[] = [];
      for (const marker of markersRef.current) {
        const { lng: markerLng, lat: markerLat } = marker.getLngLat();

        const lngDistance = Math.abs(markerLng - lng);
        const latDistance = Math.abs(markerLat - lat);

        // if user clicks the same city, we return because it's removed
        if (lngDistance < 0.2 && latDistance < 0.2) {
          return;
        }
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
        );
        const data: NominatimFeatureCollection = await res.json();
        if (!data || data.type !== "FeatureCollection") {
          throw new AppError("No data inside the response body");
        }

        setDests((prevDests) => {
          const newDests: Record<number, NominatimFeature> = {};

          for (const feature of data.features) {
            const id = feature.properties.place_id;
            newDests[id] = feature;
          }

          return {
            ...prevDests,
            ...newDests,
          };
        });
      } catch (err) {
        console.error("Reverse geocode failed", err);
      }
    });
  }, [mapContainerRef.current]);

  useEffect(() => {
    if (!mapRef.current) return;
    markers.forEach((m) => m.remove());
    setMarkers([]);

    for (const dest of Object.values(dests)) {
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
        setMarkers((prevMarker) => {
          return [...prevMarker, m];
        });
      }
    }

    setValue(
      "destinations",
      Object.values(dests).map((val) => val.properties.display_name)
    );
  }, [dests]);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  const onRemoveDestinations = (destination: NominatimFeature) => {
    const id = destination.properties.place_id;
    const newDests = {
      ...dests,
    };
    delete newDests[id];

    setDests(newDests);
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

      {Object.values(dests)?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-700">
          {Object.values(dests).map((d, i) => (
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
