export type GeolocationPosition = {
  lat: number;
  lng: number;
};

export type Masjid = {
  id: string;
  type: 'masjid';
  name: string;
  position: GeolocationPosition;
  amenities: string[];
};

export type Home = {
  id: string;
  type: 'home';
  name: string;
  position: GeolocationPosition;
  capacity: number;
  hours: string;
  amenities: string[];
};

export type PrayerSpace = Masjid | Home;

export interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface Filters {
  masjid: boolean;
  home: boolean;
  wudu: boolean;
  sisters: boolean;
  parking: boolean;
  wheelchair: boolean;
  jummah: boolean;
}
