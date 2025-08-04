import { distance, point } from "@turf/turf";


export const isWithinDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  maxDistance: number = 5 // Default in km
) => {
  const from = point([lon1, lat1]);
  const to = point([lon2, lat2]);
  const dist = distance(from, to, { units: "kilometers" });
  return dist <= maxDistance;
}
