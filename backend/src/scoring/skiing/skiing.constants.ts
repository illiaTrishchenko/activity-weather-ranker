export const SKIING_SCORES = {
  excellent: 100,
  good: 75,
  moderate: 50,
  poor: 25,
  unsuitable: 0,
} as const;

export const SKIING_WEIGHTS = {
  snowDepth: 0.35,
  snowfall: 0.1,
  temperature: 0.25,
  wind: 0.2,
  weather: 0.1,
} as const;

export const SKIING_THRESHOLDS = {
  snowDepthCm: { excellent: 50, good: 30, moderate: 15, poor: 5 },
  snowfallCm: { good: 2, excellentMin: 5, excellentMax: 15, reducedMax: 30 },
  temperatureC: {
    coldMin: -15,
    idealMin: -10,
    idealMax: -2,
    acceptableMax: 2,
    poorMax: 5,
  },
  windSpeedKph: { excellent: 15, good: 25, moderate: 40, poor: 60 },
} as const;

export const SKIING_SNOW_GUARD = {
  minDepthCm: 5,
  minSnowfallCm: 2,
  maxScore: 20,
} as const;

export const SKIING_SEVERE_WEATHER_CODES = [
  45, 48, 65, 67, 75, 82, 86,
] as const;

export const SKIING_THUNDERSTORM_CODES = [95, 96, 99] as const;
