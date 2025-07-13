"use client";

import React, { useState, useEffect } from 'react';
import { suggestPrayerTimes } from '@/ai/flows/suggest-prayer-times';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getPrayerMethodId, prayerMethodMap } from '@/lib/prayer-methods';
import type { Filters, GeolocationPosition } from '@/lib/types';
import { Compass, Filter, Droplets, User, ParkingCircle, Accessibility, CalendarCheck } from 'lucide-react';

interface MapFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  userLocation: GeolocationPosition | null;
}

export default function MapFilters({ filters, setFilters, userLocation }: MapFiltersProps) {
  const [suggestedMethods, setSuggestedMethods] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<number>(2); // Default to ISNA
  const { toast } = useToast();

  useEffect(() => {
    if (!userLocation) return;
    
    suggestPrayerTimes({ latitude: userLocation.lat, longitude: userLocation.lng })
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
  }, [userLocation, toast]);

  const handleMethodChange = (value: string) => {
    setSelectedMethod(Number(value));
  };
  
  const handleFilterChange = (filterName: keyof Filters, checked: boolean) => {
    setFilters(f => ({ ...f, [filterName]: checked }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-decorative flex items-center gap-2">
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
            <Switch id="masjid-filter" checked={filters.masjid} onCheckedChange={(checked) => handleFilterChange('masjid', checked)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="home-filter" className="flex items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Homes
            </Label>
            <Switch id="home-filter" checked={filters.home} onCheckedChange={(checked) => handleFilterChange('home', checked)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="wudu-filter" className="flex items-center gap-2 cursor-pointer text-sm">
              <Droplets className="h-4 w-4 text-primary" />
              Wudu Area
            </Label>
            <Switch id="wudu-filter" checked={filters.wudu} onCheckedChange={(checked) => handleFilterChange('wudu', checked)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sisters-filter" className="flex items-center gap-2 cursor-pointer text-sm">
              <User className="h-4 w-4 text-primary" />
              Sister's Area
            </Label>
            <Switch id="sisters-filter" checked={filters.sisters} onCheckedChange={(checked) => handleFilterChange('sisters', checked)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="parking-filter" className="flex items-center gap-2 cursor-pointer text-sm">
              <ParkingCircle className="h-4 w-4 text-primary" />
              Parking
            </Label>
            <Switch id="parking-filter" checked={filters.parking} onCheckedChange={(checked) => handleFilterChange('parking', checked)} />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="wheelchair-filter" className="flex items-center gap-2 cursor-pointer text-sm">
              <Accessibility className="h-4 w-4 text-primary" />
              Wheelchair Accessible
            </Label>
            <Switch id="wheelchair-filter" checked={filters.wheelchair} onCheckedChange={(checked) => handleFilterChange('wheelchair', checked)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="jummah-filter" className="flex items-center gap-2 cursor-pointer text-sm">
              <CalendarCheck className="h-4 w-4 text-primary" />
              Jummah Only
            </Label>
            <Switch id="jummah-filter" checked={filters.jummah} onCheckedChange={(checked) => handleFilterChange('jummah', checked)} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-decorative flex items-center gap-2">
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
