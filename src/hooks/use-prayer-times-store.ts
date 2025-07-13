
"use client";

import { create } from 'zustand';
import type { PrayerTimesData } from '@/lib/types';

interface PrayerTimesState {
  prayerTimes: PrayerTimesData | null;
  isLoading: boolean;
  setPrayerTimes: (prayerTimes: PrayerTimesData | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const usePrayerTimes = create<PrayerTimesState>((set) => ({
  prayerTimes: null,
  isLoading: true,
  setPrayerTimes: (prayerTimes) => set({ prayerTimes }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
