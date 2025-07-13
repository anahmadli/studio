
'use server';

import type { PrayerTimesData } from './types';

interface AlAdhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  // There are other fields, but we only care about these
}

interface AlAdhanResponse {
  code: number;
  status: string;
  data: {
    timings: AlAdhanTimings;
    // ... other data
  };
}

/**
 * Fetches prayer times from the Al-Adhan API.
 * @param latitude The latitude of the location.
 * @param longitude The longitude of the location.
 * @param method The calculation method ID.
 * @returns A promise that resolves to the prayer times data.
 */
export async function getPrayerTimes(
  latitude: number,
  longitude: number,
  method: number
): Promise<PrayerTimesData> {
  try {
    const date = new Date();
    const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    
    const url = `http://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    const data: AlAdhanResponse = await response.json();
    
    if (data.code !== 200) {
        throw new Error(`API returned error status: ${data.status}`);
    }

    const { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha } = data.data.timings;

    return { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha };

  } catch (error) {
    console.error("Failed to fetch prayer times:", error);
    // In a real app, you might want more robust error handling or a fallback.
    throw new Error("Could not retrieve prayer times.");
  }
}
