"use client";

import { useState, useEffect } from 'react';
import type { GeolocationPosition } from '@/lib/types';

export function useGeolocation() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let watchId: number;

    const onSuccess = (pos: globalThis.GeolocationPosition) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setError(null);
      setLoading(false);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(`Location Error: ${err.message}. Showing default location.`);
      setLoading(false);
    };

    if (navigator.geolocation) {
       watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
    
    return () => {
        if(watchId) {
            navigator.geolocation.clearWatch(watchId);
        }
    }
  }, []);

  return { position, error, loading };
}
