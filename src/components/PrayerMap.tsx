"use client";

import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Skeleton } from './ui/skeleton';
import { type PrayerSpace } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Home, Users } from 'lucide-react';

const MasjidIcon = () => (
  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md border-2 border-white">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M2 21h20"/><path d="M4 21V11a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10"/><path d="M12 11V7"/><path d="M12 3l-2 2"/><path d="M12 3l2 2"/></svg>
  </div>
);

const HomeIcon = () => (
  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md border-2 border-white">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  </div>
);


// Mock data - in a real app, this would come from Firestore
const mockPrayerSpaces: PrayerSpace[] = [
  { id: 'm1', type: 'masjid', name: 'Downtown Islamic Center', position: { lat: 34.0522, lng: -118.2437 }, amenities: ['Wudu', 'Parking', 'Wheelchair Accessible'] },
  { id: 'm2', type: 'masjid', name: 'Masjid Al-Noor', position: { lat: 34.0628, lng: -118.2541 }, amenities: ['Wudu', 'Parking'] },
  { id: 'h1', type: 'home', name: 'Ali\'s Prayer Space', position: { lat: 34.0450, lng: -118.2550 }, capacity: 5, hours: 'Fajr, Dhuhr, Asr', amenities: ['Wudu'] },
  { id: 'h2', type: 'home', name: 'Fatima\'s Guest Room', position: { lat: 34.0580, lng: -118.2300 }, capacity: 3, hours: 'All day', amenities: ['Wudu', 'Sisters Area'] },
  { id: 'm3', type: 'masjid', name: 'Westside Community Mosque', position: { lat: 34.0407, lng: -118.4452 }, amenities: ['Wudu', 'Parking'] },
  { id: 'h3', type: 'home', name: 'Ibrahim\'s Garage Musalla', position: { lat: 34.0722, lng: -118.4452 }, capacity: 10, hours: 'Jummah Only', amenities: [] },
];

interface PrayerMapProps {
  filters: { masjid: boolean; home: boolean };
  userPosition: {lat: number, lng: number} | null;
  loadingLocation: boolean;
}

export default function PrayerMap({ filters, userPosition, loadingLocation }: PrayerMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedSpace, setSelectedSpace] = React.useState<PrayerSpace | null>(null);

  if (loadingLocation) {
    return <Skeleton className="h-full w-full" />;
  }

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="text-center p-4">
          <p className="font-bold text-destructive">Error: Google Maps API key is missing.</p>
          <p className="text-sm text-muted-foreground">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.</p>
        </div>
      </div>
    );
  }

  const filteredSpaces = mockPrayerSpaces.filter(space => {
    if (filters.masjid && space.type === 'masjid') return true;
    if (filters.home && space.type === 'home') return true;
    return false;
  });

  return (
    <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API loaded.')}>
      <Map
        defaultCenter={{ lat: 34.0522, lng: -118.2437 }}
        center={userPosition || undefined}
        defaultZoom={12}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId="salaat_spotter_map"
        className="h-full w-full"
        onCameraChanged={(ev) => console.log(ev)}
      >
        {filteredSpaces.map((space) => (
          <AdvancedMarker 
            key={space.id} 
            position={space.position} 
            title={space.name}
            onClick={() => setSelectedSpace(space)}
          >
             {space.type === 'masjid' ? <MasjidIcon /> : <HomeIcon />}
          </AdvancedMarker>
        ))}

        {userPosition && (
          <AdvancedMarker position={userPosition} title="Your Location">
            <Pin background={'#45A0A2'} borderColor={'#fff'} glyphColor={'#fff'} />
          </AdvancedMarker>
        )}

        {selectedSpace && (
          <InfoWindow 
            position={selectedSpace.position} 
            onCloseClick={() => setSelectedSpace(null)}
            pixelOffset={[0, -40]}
          >
            <Card className="max-w-xs border-none shadow-none">
              <CardHeader className="p-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  {selectedSpace.type === 'masjid' ? <MasjidIcon /> : <HomeIcon />}
                  {selectedSpace.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-2">
                {selectedSpace.type === 'home' && (
                  <div className='flex items-center text-sm text-muted-foreground gap-4'>
                    <div className='flex items-center gap-1.5'>
                      <Users className="h-4 w-4" />
                      <span>Capacity: {selectedSpace.capacity}</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <Home className="h-4 w-4" />
                      <span>{selectedSpace.hours}</span>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {selectedSpace.amenities.map(amenity => (
                    <Badge key={amenity} variant="secondary">{amenity}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
