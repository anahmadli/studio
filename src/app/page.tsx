"use client";

import React, { useState } from 'react';
import PrayerMap from '@/components/PrayerMap';
import MapFilters from '@/components/MapFilters';
import type { Filters } from '@/lib/types';

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] h-[calc(100vh-var(--header-height))]">
      <aside className="border-r border-border bg-card/50 p-4 overflow-y-auto">
        <MapFilters filters={filters} setFilters={setFilters} />
      </aside>
      <div className="h-full w-full">
        <PrayerMap
          filters={filters}
        />
      </div>
    </div>
  );
}
