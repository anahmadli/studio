"use client";

import React, { useState, useEffect } from 'react';
import { suggestPrayerTimes } from '@/ai/flows/suggest-prayer-times';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getPrayerMethodId, prayerMethodMap } from '@/lib/prayer-methods';
import type { GeolocationPosition, PrayerTimesData } from '@/lib/types';
import { Clock, Compass, Sun, Moon, Sunrise, Sunset, Filter } from 'lucide-react';

interface PrayerTimesProps {
  filters: { masjid: boolean; home: boolean };
  setFilters: React.Dispatch<React.SetStateAction<{ masjid: boolean; home: boolean }>>;
  position: GeolocationPosition | null;
  loadingLocation: boolean;
}

const formatTime = (time: string) => {
  if (!time) return '';
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const formattedHour = hourNum % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

const PrayerTimeRow = ({ name, time, icon }: { name: string; time: string; icon: React.ReactNode }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-muted-foreground">{name}</span>
    </div>
    <span className="font-mono font-semibold">{formatTime(time)}</span>
  </div>
);

export default function PrayerTimes({ filters, setFilters, position, loadingLocation }: PrayerTimesProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loadingPrayerTimes, setLoadingPrayerTimes] = useState(true);
  const [suggestedMethods, setSuggestedMethods] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<number>(2); // Default to ISNA
  const { toast } = useToast();

  useEffect(() => {
    if (position) {
      setLoadingPrayerTimes(true);
      
      const fetchPrayerTimes = async (method: number) => {
        try {
          const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${position.lat}&longitude=${position.lng}&method=${method}&timezonestring=America/New_York`);
          if (!response.ok) throw new Error('Failed to fetch prayer times.');
          const data = await response.json();
          setPrayerTimes(data.data.timings);
        } catch (error) {
          console.error(error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch prayer times.',
          });
        } finally {
          setLoadingPrayerTimes(false);
        }
      };
      
      fetchPrayerTimes(selectedMethod);
      
      suggestPrayerTimes({ latitude: position.lat, longitude: position.lng })
        .then(response => {
          if (response?.suggestedMethods) {
            setSuggestedMethods(response.suggestedMethods);
          }
        })
        .catch(err => {
          console.error("Error fetching prayer time suggestions:", err);
          toast({
            variant: "destructive",
            title: "AI Suggestion Error",
            description: "Could not get suggestions for prayer time calculations.",
          });
        });
    }
  }, [position, selectedMethod, toast]);

  const handleMethodChange = (value: string) => {
    setSelectedMethod(Number(value));
  };

  const PrayerTimesSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2 pt-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
  
  const prayerIcons = {
    Fajr: <Moon className="h-4 w-4 text-primary" />,
    Sunrise: <Sunrise className="h-4 w-4 text-primary" />,
    Dhuhr: <Sun className="h-4 w-4 text-primary" />,
    Asr: <Sun className="h-4 w-4 text-primary opacity-70" />,
    Maghrib: <Sunset className="h-4 w-4 text-primary" />,
    Isha: <Moon className="h-4 w-4 text-primary opacity-70" />,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Clock className="h-5 w-5" />
            Daily Prayer Times
          </CardTitle>
          <CardDescription>Gaithersburg, MD (EST)</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingLocation || loadingPrayerTimes ? (
            <PrayerTimesSkeleton />
          ) : prayerTimes ? (
            <div>
              {Object.entries(prayerTimes).filter(pt => prayerIcons[pt[0] as keyof typeof prayerIcons]).map(([name, time]) => (
                <PrayerTimeRow key={name} name={name} time={time} icon={prayerIcons[name as keyof typeof prayerIcons]} />
              ))}
            </div>
          ) : (
            <p>Could not load prayer times.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Filter className="h-5 w-5" />
            Map Filters
          </CardTitle>
          <CardDescription>Show or hide locations on the map.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
            <Label htmlFor="masjid-filter" className="flex items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M2 21h20"/><path d="M4 21V11a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10"/><path d="M12 11V7"/><path d="M12 3l-2 2"/><path d="M12 3l2 2"/></svg>
              Masjids
            </Label>
            <Switch id="masjid-filter" checked={filters.masjid} onCheckedChange={(checked) => setFilters(f => ({...f, masjid: checked}))} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="home-filter" className="flex items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Homes
            </Label>
            <Switch id="home-filter" checked={filters.home} onCheckedChange={(checked) => setFilters(f => ({...f, home: checked}))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Compass className="h-5 w-5" />
            Calculation Method
          </CardTitle>
          <CardDescription>Adjust the calculation method for your region.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleMethodChange} defaultValue={String(selectedMethod)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a method" />
            </SelectTrigger>
            <SelectContent>
              {suggestedMethods.length > 0 ? (
                <>
                  <p className="p-2 text-xs font-semibold text-muted-foreground">AI Suggestions</p>
                  {suggestedMethods.map((method, index) => {
                    const methodId = getPrayerMethodId(method);
                    return methodId !== undefined ? <SelectItem key={`${methodId}-${index}`} value={String(methodId)}>{method}</SelectItem> : null
                  })}
                  <Separator className="my-2" />
                  <p className="p-2 text-xs font-semibold text-muted-foreground">All Methods</p>
                </>
              ) : <p className="p-2 text-xs font-semibold text-muted-foreground">All Methods</p>}
              {Object.entries(prayerMethodMap).map(([name, id]) => (
                 <SelectItem key={id} value={String(id)}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
