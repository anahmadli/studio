
"use client";

import { useState, useEffect } from 'react';
import { parse, differenceInSeconds, addDays, isBefore } from 'date-fns';
import type { PrayerTimesData } from '@/lib/types';

const prayerOrder: (keyof PrayerTimesData)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export function useNextPrayer(prayerTimes: PrayerTimesData | null) {
  const [nextPrayer, setNextPrayer] = useState<keyof PrayerTimesData | null>(null);
  const [timeToNextPrayer, setTimeToNextPrayer] = useState<number | null>(null);
  
  useEffect(() => {
    if (!prayerTimes) {
      setNextPrayer(null);
      setTimeToNextPrayer(null);
      return;
    }

    const calculateNextPrayer = () => {
      const now = new Date();
      let nextPrayerTime: Date | null = null;
      let nextPrayerName: keyof PrayerTimesData | null = null;

      for (const prayer of prayerOrder) {
        // Al-Adhan API returns times in "HH:mm" format. We parse this for today's date.
        const prayerTimeStr = prayerTimes[prayer];
        const todayPrayerTime = parse(prayerTimeStr, 'HH:mm', new Date());

        // If this prayer time is in the future, it's a candidate for the next prayer.
        if (isBefore(now, todayPrayerTime)) {
          nextPrayerTime = todayPrayerTime;
          nextPrayerName = prayer;
          break; // Found the next prayer for today, exit the loop.
        }
      }

      // If all of today's prayers are past, the next prayer is tomorrow's Fajr.
      if (!nextPrayerName) {
        const tomorrowFajrTimeStr = prayerTimes['Fajr'];
        nextPrayerTime = addDays(parse(tomorrowFajrTimeStr, 'HH:mm', new Date()), 1);
        nextPrayerName = 'Fajr';
      }

      setNextPrayer(nextPrayerName);

      if (nextPrayerTime) {
        const diffSeconds = differenceInSeconds(nextPrayerTime, now);
        setTimeToNextPrayer(diffSeconds);
      } else {
        setTimeToNextPrayer(null);
      }
    };
    
    // Calculate immediately on load
    calculateNextPrayer();
    
    // Then, update every second
    const interval = setInterval(calculateNextPrayer, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);
  
  return { nextPrayer, timeToNextPrayer };
}
