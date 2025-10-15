import { LngLatLike } from "maplibre-gl";
import { envVar } from "../utils/env";
import openStreetMapStyleSpec from "./openStreetMap.style.json";
import { DEFAULT_LOCATION } from "@/constants/common";

const getDefaultCenter = (): LngLatLike => {
  const defaultIfEmpty: LngLatLike = DEFAULT_LOCATION; // Default center coordinates near Paris, France
  const fromEnv = envVar.safeGet<string>("NEXT_DEFAULT_MAP_CENTER");

  if (!fromEnv) return defaultIfEmpty;

  const coords = fromEnv.split(",").map(Number);
  if (coords.length !== 2 || coords.some(isNaN)) {
    console.warn(
      "Invalid NEXT_DEFAULT_MAP_CENTER format. Using default center instead."
    );
    return defaultIfEmpty;
  }
  return coords as LngLatLike;
}

export const DEFAULT_MAP_OPTIONS = {
  style: openStreetMapStyleSpec as maplibregl.StyleSpecification,
  center: getDefaultCenter(),
  zoom: 4,
  canvasContextAttributes: { antialias: true },
  attributionControl: { compact: true },
  interactive: true,
  minZoom: 2.5,
  maxZoom: 16,
  // maxBounds: [
  // [-37.717, 30.354], // South-West corner around island of west of canaria
  // [42.531, 72.976], // North-East corner around Murmansk (Russia)
  // ],
} satisfies Omit<maplibregl.MapOptions, "container">;
