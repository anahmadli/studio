import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { GeolocationPosition } from './types';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @param pos1 - The first position { lat, lng }.
 * @param pos2 - The second position { lat, lng }.
 * @returns The distance in miles.
 */
export function getDistance(
  pos1: GeolocationPosition,
  pos2: GeolocationPosition
): number {
  if (!pos1 || !pos2) {
    return 0;
  }
  
  const R = 3958.8; // Radius of the Earth in miles
  const rlat1 = pos1.lat * (Math.PI / 180); // Convert degrees to radians
  const rlat2 = pos2.lat * (Math.PI / 180); // Convert degrees to radians
  const difflat = rlat2 - rlat1; // Radian difference (latitudes)
  const difflon = (pos2.lng - pos1.lng) * (Math.PI / 180); // Radian difference (longitudes)

  const d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
}
