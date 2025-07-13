"use client";

import React, { useState } from 'react';
import PrayerMap from '@/components/PrayerMap';
import MapFilters from '@/components/MapFilters';
import type { Filters, GeolocationPosition } from '@/lib/types';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import SidebarToggle from '@/components/SidebarToggle';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div 
      className={cn(
        "grid grid-cols-1 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "md:grid-cols-[380px_1fr]" : "md:grid-cols-[0px_1fr]",
        "h-[calc(100vh-var(--header-height))]"
      )}
    >
      <aside className="relative border-r border-border bg-card/50 overflow-hidden">
        <div className="p-4 overflow-y-auto h-full w-[380px]">
          <MapFilters 
            filters={filters} 
            setFilters={setFilters} 
            userLocation={position}
          />
        </div>
        <SidebarToggle 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
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
