"use client";

import { useState, useEffect } from 'react';
import type { GeolocationPosition } from '@/lib/types';

export function useGeolocation() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Set loading to false initially

  useEffect(() => {
    // No-op: We are not fetching the user's location.
    // This hook is now a placeholder to avoid breaking imports.
  }, []);

  return { position, error, loading };
}
