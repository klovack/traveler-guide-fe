"use client";

import maplibregl, { Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef } from "react";
import { Destination } from "tg-sdk";
import { Group } from "@mantine/core";
import * as turf from "@turf/turf";
import { DEFAULT_MAP_OPTIONS } from "@/lib/map/default";

export type ItineraryMapProps = {
  locations: Destination[];
};

export default function ItineraryMap({
  locations,
}: Readonly<ItineraryMapProps>) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      ...DEFAULT_MAP_OPTIONS,
      container: mapContainerRef.current,
      center:
        locations.length > 0 ? [locations[0].lon, locations[0].lat] : [0, 0],
    });
  }, [mapContainerRef.current]);

  useEffect(() => {
    if (!mapRef.current) return;
    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    // Add new markers
    locations.forEach((loc, index) => {
      const marker = new Marker()
        .setLngLat([loc.lon, loc.lat])
        .addTo(mapRef.current!)
        .setPopup(
          new Popup({
            closeButton: false,
          }).setHTML(`<Text>${index + 1}. ${loc.name}</Text>`)
        )
        .togglePopup();
      markersRef.current.push(marker);
    });
    // Draw line if more than 1 location
    if (locations.length > 1) {
      const drawLine = () => {
        const coords = locations.map((loc) => [loc.lon, loc.lat]);
        const line = turf.lineString(coords);
        if (mapRef.current!.getSource("itinerary-line")) {
          (
            mapRef.current!.getSource(
              "itinerary-line"
            ) as maplibregl.GeoJSONSource
          ).setData(line);
        } else {
          mapRef.current!.addSource("itinerary-line", {
            type: "geojson",
            data: line,
          });
          mapRef.current!.addLayer({
            id: "itinerary-line-layer",
            type: "line",
            source: "itinerary-line",
            paint: {
              "line-color": "#2563eb",
              "line-width": 4,
            },
          });
        }
        // Fit bounds
        const bounds = coords.reduce(
          (b, coord) => b.extend(coord as [number, number]),
          new maplibregl.LngLatBounds(
            coords[0] as [number, number],
            coords[0] as [number, number]
          )
        );
        mapRef.current!.fitBounds(bounds, { padding: 60, duration: 800 });
      };
      if (mapRef.current.isStyleLoaded()) {
        drawLine();
      } else {
        mapRef.current.once("style.load", drawLine);
      }
    }
  }, [locations]);

  return (
    <Group>
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "350px",
          borderRadius: 12,
          overflow: "hidden",
        }}
      ></div>
    </Group>
  );
}
