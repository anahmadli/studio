"use client";

import React, { useState } from 'react';
import PrayerMap from '@/components/PrayerMap';
import PrayerTimes from '@/components/PrayerTimes';
import { type PrayerSpace } from '@/lib/types';
import { useGeolocation } from '@/hooks/use-geolocation';

export default function Home() {
  const [filters, setFilters] = useState({ masjid: true, home: true });
  const { position, loading: loadingLocation } = useGeolocation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] h-[calc(100vh-var(--header-height))]">
      <aside className="border-r border-border bg-card/50 p-4 overflow-y-auto">
        <PrayerTimes
          filters={filters}
          setFilters={setFilters}
          position={position}
          loadingLocation={loadingLocation}
        />
      </aside>
      <main className="h-full w-full">
        <PrayerMap
          filters={filters}
          userPosition={position}
          loadingLocation={loadingLocation}
        />
      </main>
    </div>
  );
}
