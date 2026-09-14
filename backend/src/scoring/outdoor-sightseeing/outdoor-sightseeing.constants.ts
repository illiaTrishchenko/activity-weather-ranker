export const OUTDOOR_SCORES = {
  excellent: 100,
  good: 80,
  moderate: 55,
  poor: 25,
  veryPoor: 5,
} as const;

export const OUTDOOR_COMPONENT_SCORES = {
  precipitation: { prolonged: 35, heavy: 10 },
  wind: { strong: 30 },
  sunshine: { cloudy: 65, overcast: 45 },
} as const;

export const OUTDOOR_WEIGHTS = {
  precipitation: 0.35,
  temperature: 0.3,
  sunshine: 0.2,
  wind: 0.15,
} as const;

export const OUTDOOR_THRESHOLDS = {
  temperature: {
    idealMin: 16,
    idealMax: 25,
    goodMin: 10,
    goodMax: 29,
    moderateMin: 5,
    moderateMax: 32,
    poorMin: 0,
    poorMax: 35,
  },
  precipitation: {
    lightMm: 1,
    lightHours: 2,
    moderateMm: 3,
    moderateHours: 4,
    poorMm: 8,
    poorHours: 8,
  },
  wind: { excellent: 15, good: 25, moderate: 35, poor: 50 },
  sunshine: { excellent: 0.7, good: 0.4, moderate: 0.2 },
} as const;

export const OUTDOOR_THUNDERSTORM_CODES = [95, 96, 99] as const;

export const OUTDOOR_SEVERE_PRECIPITATION_CODES = [65, 67, 75, 82, 86] as const;

export const OUTDOOR_FOG_CODES = [45, 48] as const;

export const OUTDOOR_GUARDS = {
  thunderstormMax: 20,
  severePrecipitationMax: 35,
  fogMax: 50,
} as const;
