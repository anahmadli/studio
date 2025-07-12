"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { GeolocationPosition, PrayerTimesData } from '@/lib/types';
import { Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

interface PrayerTimesProps {
  position: GeolocationPosition | null;
  loadingLocation: boolean;
}

const formatTime = (time: string) => {
  if (!time) return '';
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const formattedHour = hourNum % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

const PrayerTimeItem = ({ name, time, icon }: { name: string; time: string; icon: React.ReactNode }) => (
  <div className="flex flex-col items-center text-center">
    <div className="flex items-center gap-2">
      {icon}
      <span className="font-semibold">{name}</span>
    </div>
    <span className="font-mono text-lg text-muted-foreground">{formatTime(time)}</span>
  </div>
);


export default function PrayerTimes({ position, loadingLocation }: PrayerTimesProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loadingPrayerTimes, setLoadingPrayerTimes] = useState(true);

  useEffect(() => {
    if (position) {
      setLoadingPrayerTimes(true);
      
      const fetchPrayerTimes = async (method: number) => {
        try {
          const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${position.lat}&longitude=${position.lng}&method=${method}&timezonestring=America/New_York`);
          if (!response.ok) throw new Error('Failed to fetch prayer times.');
          const data = await response.json();
          setPrayerTimes(data.data.timings);
        } catch (error) {
          console.error(error);
          // Don't show toast for this as it's not a user-blocking error
        } finally {
          setLoadingPrayerTimes(false);
        }
      };
      
      fetchPrayerTimes(2); // ISNA
    }
  }, [position]);

  const PrayerTimesSkeleton = () => (
    <div className="flex justify-around">
      {[...Array(5)].map((_, i) => (
         <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
      ))}
    </div>
  );
  
  const prayerIcons = {
    Fajr: <Moon className="h-5 w-5 text-primary" />,
    Dhuhr: <Sun className="h-5 w-5 text-primary" />,
    Asr: <Sun className="h-5 w-5 text-primary opacity-70" />,
    Maghrib: <Sunset className="h-5 w-5 text-primary" />,
    Isha: <Moon className="h-5 w-5 text-primary opacity-70" />,
  }

  return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 font-headline text-2xl">
            <Clock className="h-6 w-6" />
            Daily Prayer Times
          </CardTitle>
          <CardDescription>Gaithersburg, MD (EST)</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingLocation || loadingPrayerTimes ? (
            <PrayerTimesSkeleton />
          ) : prayerTimes ? (
            <div className="flex items-start justify-around flex-wrap gap-4">
              {Object.entries(prayerTimes).filter(pt => prayerIcons[pt[0] as keyof typeof prayerIcons]).map(([name, time]) => (
                <PrayerTimeItem key={name} name={name} time={time} icon={prayerIcons[name as keyof typeof prayerIcons]} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Could not load prayer times. Using default location.</p>
          )}
        </CardContent>
      </Card>
  );
}
