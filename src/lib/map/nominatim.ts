import { AppError } from "@/errors";
import z from "zod";

export const NominatimPropertiesSchema = z.object({
  place_id: z.number(),
  osm_type: z.string(),
  osm_id: z.number(),
  place_rank: z.number(),
  category: z.string(),
  type: z.string(),
  importance: z.number(),
  addresstype: z.string(),
  name: z.string(),
  display_name: z.string(),
  address: z.object({
    city: z.string().optional(),
    "ISO3166-2-lvl4": z.string().optional(),
    country: z.string(),
    country_code: z.string(),
  }).optional(),
});

export const NominatimFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: z.any().optional(),
  properties: NominatimPropertiesSchema,
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
});

export const NominatimFeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(NominatimFeatureSchema),
});

// Types for TypeScript compatibility
export type NominatimProperties = z.infer<typeof NominatimPropertiesSchema>;
export type NominatimFeature = z.infer<typeof NominatimFeatureSchema>;
export type NominatimFeatureCollection = z.infer<
  typeof NominatimFeatureCollectionSchema
>;

export type SearchArgs = {
  lat: number,
  lng: number,
}

export const reverseSearch = async ({
  lat,
  lng
}: SearchArgs): Promise<NominatimFeatureCollection | undefined> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${lat}&lon=${lng}&zoom=10&addressdetails=0`
    );
    const data: NominatimFeatureCollection = await res.json();
    if (!data || data.type !== "FeatureCollection") {
      throw new AppError("No data inside the response body");
    }

    return data;
  } catch (err) {
    console.error("Reverse geocode failed", err);
  }
}

export const querySearch = async (query?: string | number[]): Promise<NominatimFeatureCollection | undefined> => {
  try {
    const request = `https://nominatim.openstreetmap.org/search?q=${query}&format=geojson&addressdetails=0`;
    const response = await fetch(request);
    const geojson: NominatimFeatureCollection = await response.json();
    const validData = NominatimFeatureCollectionSchema.parse(geojson);

    return validData;
  } catch (e) {
    // TODO: Error notification toast
    console.error(`Failed to forwardGeocode with error: ${e}`);
  }
}
