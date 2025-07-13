import { z } from 'zod';

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
  address?: string;
};

export type Home = {
  id: string;
  type: 'home';
  name: string;
  position: GeolocationPosition;
  capacity: number;
  hours: string;
  amenities: string[];
  address?: string;
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


// Schema for Genkit Flow: initiateBackgroundCheck
export const BackgroundCheckInputSchema = z.object({
  firstName: z.string().describe('The first name of the person.'),
  middleName: z.string().optional().describe('The middle name of the person.'),
  lastName: z.string().describe('The last name of the person.'),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in XXX-XX-XXXX format.").describe('The Social Security Number of the person.'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format.").describe('The date of birth of the person (YYYY-MM-DD).'),
  address: z.string().describe('The street address of the person.'),
  city: z.string().describe('The city of the person.'),
  state: z.string().describe('The state of the person (2-letter abbreviation).'),
  zip: z.string().describe('The ZIP code of the person.'),
});
export type BackgroundCheckInput = z.infer<typeof BackgroundCheckInputSchema>;

export const BackgroundCheckOutputSchema = z.object({
  success: z.boolean().describe('Whether the background check was initiated successfully.'),
  reportId: z.string().optional().describe('The ID of the generated report.'),
  message: z.string().describe('A message describing the result.'),
});
export type BackgroundCheckOutput = z.infer<typeof BackgroundCheckOutputSchema>;
