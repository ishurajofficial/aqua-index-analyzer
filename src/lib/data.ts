export type RawPollutionData = {
  id: number;
  location: string;
  lat: number;
  lon: number;
  As: number; // Arsenic
  Cd: number; // Cadmium
  Cr: number; // Chromium
  Pb: number; // Lead
  Zn: number; // Zinc
};

export type PollutionData = RawPollutionData & {
  hpi: number; // Heavy Metal Pollution Index
  hei: number; // Heavy Metal Evaluation Index
  cf: {
    As: number;
    Cd: number;
    Cr: number;
    Pb: number;
    Zn: number;
  }; // Contamination Factor
  pli: number; // Pollution Load Index
  risk: 'Safe' | 'Moderate' | 'High Risk';
};

export const demoData: RawPollutionData[] = [
  {
    id: 1,
    location: 'Willow Creek',
    lat: 34.0522,
    lon: -118.2437,
    As: 0.015,
    Cd: 0.003,
    Cr: 0.05,
    Pb: 0.01,
    Zn: 1.5,
  },
  {
    id: 2,
    location: 'Crystal Springs',
    lat: 40.7128,
    lon: -74.0060,
    As: 0.005,
    Cd: 0.001,
    Cr: 0.02,
    Pb: 0.005,
    Zn: 0.5,
  },
  {
    id: 3,
    location: 'Redwood River',
    lat: 41.8781,
    lon: -87.6298,
    As: 0.025,
    Cd: 0.008,
    Cr: 0.12,
    Pb: 0.05,
    Zn: 3.2,
  },
  {
    id: 4,
    location: 'Green Valley',
    lat: 29.7604,
    lon: -95.3698,
    As: 0.008,
    Cd: 0.002,
    Cr: 0.03,
    Pb: 0.007,
    Zn: 0.8,
  },
  {
    id: 5,
    location: 'Dustbowl Reservoir',
    lat: 39.9526,
    lon: -75.1652,
    As: 0.018,
    Cd: 0.006,
    Cr: 0.08,
    Pb: 0.02,
    Zn: 2.1,
  },
   {
    id: 6,
    location: 'Silver Lake',
    lat: 33.7701,
    lon: -118.1937,
    As: 0.009,
    Cd: 0.001,
    Cr: 0.025,
    Pb: 0.012,
    Zn: 1.1,
  },
  {
    id: 7,
    location: 'Copper Canyon',
    lat: 34.0522,
    lon: -118.4437,
    As: 0.035,
    Cd: 0.01,
    Cr: 0.15,
    Pb: 0.08,
    Zn: 5.0,
  }
];
