export const SURFING_SCORES = {
  excellent: 100,
  good: 75,
  moderate: 50,
  poor: 25,
  unsuitable: 0,
} as const;

export const SURFING_WEIGHTS = {
  waveHeight: 0.4,
  wavePeriod: 0.3,
  wind: 0.3,
} as const;

export const SURFING_THRESHOLDS = {
  waveHeightM: {
    minimum: 0.4,
    goodMin: 0.5,
    excellentMin: 0.8,
    excellentMax: 1.8,
    goodMax: 2.5,
    maximum: 3,
  },
  wavePeriodSeconds: {
    moderateMin: 7,
    goodMin: 9,
    excellentMin: 12,
    excellentMax: 15,
    goodMax: 18,
  },
  windSpeedKph: {
    excellent: 10,
    good: 20,
    moderate: 30,
    poor: 40,
  },
} as const;

export const SURFING_GUARDS = {
  tooSmallWavesMax: 20,
  tooLargeWavesMax: 35,
  strongWindMax: 30,
} as const;

export const SURFING_THUNDERSTORM_CODES = [95, 96, 99] as const;
