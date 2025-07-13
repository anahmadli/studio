"use client";

import React, { useState } from 'react';
import PrayerMap from '@/components/PrayerMap';
import MapFilters from '@/components/MapFilters';
import type { Filters, GeolocationPosition } from '@/lib/types';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    masjid: true,
    home: true,
    wudu: false,
    sisters: false,
    parking: false,
    wheelchair: false,
    jummah: false
  });
  
  const { position, error, loading } = useGeolocation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] h-[calc(100vh-var(--header-height))]">
      <aside className="border-r border-border bg-card/50 p-4 overflow-y-auto">
        <MapFilters 
          filters={filters} 
          setFilters={setFilters} 
          userLocation={position}
        />
      </aside>
      <div className="h-full w-full">
        {loading && (
          <div className="flex flex-col h-full w-full items-center justify-center bg-background p-8 text-center">
             <Skeleton className="h-full w-full" />
          </div>
        )}
        {!loading && (
          <PrayerMap
            filters={filters}
            userLocation={position}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
