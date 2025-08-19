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
  isRoundTrip?: boolean;
};

export default function ItineraryMap({
  locations,
  isRoundTrip = false,
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
        if (isRoundTrip) {
          coords.push(coords[0]); // Close the loop for round trips
        }

        // Insert midpoints between each pair of locations and slightly offset them
        const enhancedCoords: number[][] = [];
        for (let i = 0; i < coords.length - 1; i++) {
          enhancedCoords.push(coords[i]);
          const from = turf.point(coords[i]);
          const to = turf.point(coords[i + 1]);
          let midpoint = turf.midpoint(from, to);
          // Move midpoint by 3km perpendicular to the segment
          const bearing = turf.bearing(from, to);
          const perpendicular = bearing + 90;
          const distance = turf.distance(from, to, { units: "kilometers" });
          midpoint = turf.transformTranslate(
            midpoint,
            distance / 10,
            perpendicular,
            {
              units: "kilometers",
            }
          );
          enhancedCoords.push(
            midpoint.geometry.coordinates as [number, number]
          );
        }
        enhancedCoords.push(coords[coords.length - 1]);
        const coordsWithMidpoints = enhancedCoords;

        const line = turf.lineString(coordsWithMidpoints);
        const curvedLine = turf.bezierSpline(line);
        if (mapRef.current!.getSource("itinerary-line")) {
          (
            mapRef.current!.getSource(
              "itinerary-line"
            ) as maplibregl.GeoJSONSource
          ).setData(curvedLine);
        } else {
          mapRef.current!.addSource("itinerary-line", {
            type: "geojson",
            data: curvedLine,
          });
          mapRef.current!.addLayer({
            id: "itinerary-line-layer",
            type: "line",
            source: "itinerary-line",
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-color": "#2c76feff",
              "line-width": 3,
              "line-dasharray": [2, 2],
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
        className="w-full h-[350px] rounded-xl overflow-hidden"
      ></div>
    </Group>
  );
}
