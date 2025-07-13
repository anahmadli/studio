
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
    <div className="relative h-[calc(100vh-var(--header-height))]">
       <SidebarToggle 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          className={cn("absolute top-1/2 z-20 transform -translate-y-1/2 transition-all duration-300", 
            isSidebarOpen ? "left-[380px]" : "left-0"
          )}
        />
      <div 
        className={cn(
          "grid grid-cols-1 transition-all duration-300 ease-in-out h-full",
          isSidebarOpen ? "md:grid-cols-[380px_1fr]" : "md:grid-cols-[0px_1fr]",
        )}
      >
        <aside className="bg-card/50 overflow-hidden border-r border-border">
          <div className="p-4 overflow-y-auto h-full w-[380px]">
            <MapFilters 
              filters={filters} 
              setFilters={setFilters} 
              userLocation={position}
            />
          </div>
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
    </div>
  );
}
