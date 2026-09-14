export const INDOOR_BASELINE_SCORE = 50;

export const INDOOR_BONUSES = {
  lightRain: 5,
  moderateRain: 10,
  prolongedRain: 15,
  heavyRain: 20,
  mildTemperature: 5,
  poorTemperature: 10,
  extremeTemperature: 15,
  lightWind: 2,
  moderateWind: 5,
  strongWind: 8,
  extremeWind: 10,
  partialSun: 1,
  lowSun: 3,
  noSun: 5,
} as const;

export const INDOOR_THRESHOLDS = {
  temperature: {
    comfortableMin: 10,
    comfortableMax: 29,
    mildMin: 5,
    mildMax: 32,
    poorMin: 0,
    poorMax: 35,
  },
  precipitation: {
    lightMm: 1,
    lightHours: 2,
    moderateMm: 3,
    moderateHours: 4,
    prolongedMm: 8,
    prolongedHours: 8,
  },
  wind: { calm: 15, light: 25, moderate: 35, strong: 50 },
  sunshine: { high: 0.7, partial: 0.4, low: 0.2 },
} as const;

export const INDOOR_THUNDERSTORM_CODES = [95, 96, 99] as const;

export const INDOOR_SEVERE_CODES = [65, 67, 75, 82, 86] as const;

export const INDOOR_GUARDS = {
  thunderstormMax: 60,
  severeWeatherMax: 70,
} as const;
