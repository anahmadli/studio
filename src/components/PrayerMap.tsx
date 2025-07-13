
"use client";

import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Skeleton } from './ui/skeleton';
import { type PrayerSpace, type Filters, type GeolocationPosition } from '@/lib/types';
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

const UserLocationMarker = () => (
    <div className="flex flex-col items-center" style={{transform: 'translateY(-50%)'}}>
        <div className="bg-white px-2 py-0.5 rounded-md shadow-md text-xs font-semibold mb-1">You</div>
        <div className="w-4 h-4">
            <div className="w-full h-full rounded-full bg-blue-500 border-2 border-white shadow-md animate-pulse" />
        </div>
    </div>
);


// Mock data - in a real app, this would come from Firestore
const mockPrayerSpaces: PrayerSpace[] = [
  { id: 'm1', type: 'masjid', name: 'Islamic Center of Maryland', position: { lat: 39.1376, lng: -77.1511 }, amenities: ['Wudu', 'Parking', 'Wheelchair Accessible', 'Sisters Area'] },
  { id: 'm2', type: 'masjid', name: 'Islamic Community Center of Potomac', position: { lat: 39.0911, lng: -77.2458 }, amenities: ['Wudu', 'Parking'] },
  { id: 'h1', type: 'home', name: 'Ahmed\'s Prayer Space', position: { lat: 39.1550, lng: -77.2050 }, capacity: 8, hours: 'Dhuhr & Asr', amenities: ['Wudu'] },
  { id: 'h2', type: 'home', name: 'Khadija\'s Guest Room', position: { lat: 39.1280, lng: -77.1800 }, capacity: 4, hours: 'All day', amenities: ['Wudu', 'Sisters Area'] },
  { id: 'm3', type: 'masjid', name: 'Muslim Community Center', position: { lat: 39.1162, lng: -77.0135 }, amenities: ['Wudu', 'Parking'] },
  { id: 'h3', type: 'home', name: 'Yusuf\'s Garage Musalla', position: { lat: 39.1422, lng: -77.2352 }, capacity: 12, hours: 'Jummah Only', amenities: ['Parking'] },
];

const mapStyles = [
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.attraction",
    stylers: [{ visibility: "off" }],
  },
];


interface PrayerMapProps {
  filters: Filters;
  userLocation: GeolocationPosition | null;
  error: string | null;
}

export default function PrayerMap({ filters, userLocation, error }: PrayerMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedSpace, setSelectedSpace] = React.useState<PrayerSpace | null>(null);

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
  
  const defaultCenter = { lat: 39.1434, lng: -77.2014 };
  const center = userLocation ? userLocation : defaultCenter;

  const filteredSpaces = mockPrayerSpaces.filter(space => {
    // Type filters
    if (!filters.masjid && space.type === 'masjid') return false;
    if (!filters.home && space.type === 'home') return false;

    // Amenity filters
    if (filters.wudu && !space.amenities.includes('Wudu')) return false;
    if (filters.sisters && !space.amenities.includes('Sisters Area')) return false;
    if (filters.parking && !space.amenities.includes('Parking')) return false;
    if (filters.wheelchair && !space.amenities.includes('Wheelchair Accessible')) return false;

    // Jummah filter (for home spaces)
    if (filters.jummah && space.type === 'home' && space.hours !== 'Jummah Only') return false;
    if (filters.jummah && space.type === 'masjid') return true; // Assume masjids have Jummah

    return true;
  });

  return (
    <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API loaded.')}>
      {error && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-destructive/90 text-destructive-foreground p-2 rounded-md text-sm">
          {error}
        </div>
      )}
      <Map
        center={center}
        defaultZoom={12}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId="my_masjid_map"
        styles={mapStyles}
        className="h-full w-full"
      >
        {userLocation && (
          <AdvancedMarker position={userLocation} title="Your location">
              <UserLocationMarker />
          </AdvancedMarker>
        )}
        
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
