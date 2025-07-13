
"use client";

import { useState, useEffect } from 'react';
import { parse, differenceInSeconds, addDays, isBefore } from 'date-fns';
import type { PrayerTimesData } from '@/lib/types';

const prayerOrder: (keyof PrayerTimesData)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export function useNextPrayer(prayerTimes: PrayerTimesData | null) {
  const [nextPrayer, setNextPrayer] = useState<keyof PrayerTimesData | null>(null);
  const [timeToNextPrayer, setTimeToNextPrayer] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!prayerTimes || !isClient) {
      setNextPrayer(null);
      setTimeToNextPrayer(null);
      return;
    }

    const calculateNextPrayer = () => {
      const now = new Date();
      let nextPrayerTime: Date | null = null;
      let nextPrayerName: keyof PrayerTimesData | null = null;

      for (const prayer of prayerOrder) {
        const prayerTimeStr = prayerTimes[prayer];
        const todayPrayerTime = parse(prayerTimeStr, 'HH:mm', new Date());

        if (isBefore(now, todayPrayerTime)) {
          nextPrayerTime = todayPrayerTime;
          nextPrayerName = prayer;
          break;
        }
      }

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
    
    calculateNextPrayer();
    
    const interval = setInterval(calculateNextPrayer, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes, isClient]);
  
  return { nextPrayer, timeToNextPrayer, isClient };
}
