import {
  INDOOR_BASELINE_SCORE,
  INDOOR_BONUSES,
  INDOOR_GUARDS,
  INDOOR_SEVERE_CODES,
  INDOOR_THRESHOLDS,
  INDOOR_THUNDERSTORM_CODES,
} from './indoor-sightseeing.constants.js';

export interface IndoorSightseeingInput {
  apparentTemperatureC: number;
  precipitationMm: number;
  precipitationHours: number;
  windSpeedKph: number;
  sunshineRatio: number;
  weatherCode: number;
}
export interface IndoorSightseeingScore {
  score: number;
  reasons: string[];
}

export function scoreIndoorSightseeing(
  input: IndoorSightseeingInput,
): IndoorSightseeingScore {
  const score = Math.min(
    100,
    INDOOR_BASELINE_SCORE +
      precipitationBonus(input.precipitationMm, input.precipitationHours) +
      temperatureBonus(input.apparentTemperatureC) +
      windBonus(input.windSpeedKph) +
      sunshineBonus(input.sunshineRatio),
  );

  if (INDOOR_THUNDERSTORM_CODES.includes(input.weatherCode as never))
    return {
      score: Math.min(score, INDOOR_GUARDS.thunderstormMax),
      reasons: ['Thunderstorms may make travel to attractions unsafe'],
    };

  if (INDOOR_SEVERE_CODES.includes(input.weatherCode as never))
    return {
      score: Math.min(score, INDOOR_GUARDS.severeWeatherMax),
      reasons: ['Severe weather may disrupt travel'],
    };

  return {
    score,
    reasons:
      score > INDOOR_BASELINE_SCORE
        ? ['Indoor attractions are a good weather alternative']
        : ['Indoor attractions remain a viable option'],
  };
}

function precipitationBonus(amount: number, hours: number): number {
  if (amount === 0 && hours === 0) return 0;

  if (
    amount <= INDOOR_THRESHOLDS.precipitation.lightMm &&
    hours <= INDOOR_THRESHOLDS.precipitation.lightHours
  )
    return INDOOR_BONUSES.lightRain;

  if (
    amount <= INDOOR_THRESHOLDS.precipitation.moderateMm &&
    hours <= INDOOR_THRESHOLDS.precipitation.moderateHours
  )
    return INDOOR_BONUSES.moderateRain;

  if (
    amount <= INDOOR_THRESHOLDS.precipitation.prolongedMm &&
    hours <= INDOOR_THRESHOLDS.precipitation.prolongedHours
  )
    return INDOOR_BONUSES.prolongedRain;

  return INDOOR_BONUSES.heavyRain;
}

function temperatureBonus(value: number): number {
  if (
    value >= INDOOR_THRESHOLDS.temperature.comfortableMin &&
    value <= INDOOR_THRESHOLDS.temperature.comfortableMax
  )
    return 0;

  if (
    (value >= INDOOR_THRESHOLDS.temperature.mildMin &&
      value < INDOOR_THRESHOLDS.temperature.comfortableMin) ||
    (value > INDOOR_THRESHOLDS.temperature.comfortableMax &&
      value <= INDOOR_THRESHOLDS.temperature.mildMax)
  )
    return INDOOR_BONUSES.mildTemperature;

  if (
    (value >= INDOOR_THRESHOLDS.temperature.poorMin &&
      value < INDOOR_THRESHOLDS.temperature.mildMin) ||
    (value > INDOOR_THRESHOLDS.temperature.mildMax &&
      value <= INDOOR_THRESHOLDS.temperature.poorMax)
  )
    return INDOOR_BONUSES.poorTemperature;

  return INDOOR_BONUSES.extremeTemperature;
}

function windBonus(value: number): number {
  if (value < INDOOR_THRESHOLDS.wind.calm) return 0;

  if (value < INDOOR_THRESHOLDS.wind.light) return INDOOR_BONUSES.lightWind;

  if (value < INDOOR_THRESHOLDS.wind.moderate)
    return INDOOR_BONUSES.moderateWind;

  if (value <= INDOOR_THRESHOLDS.wind.strong) return INDOOR_BONUSES.strongWind;

  return INDOOR_BONUSES.extremeWind;
}

function sunshineBonus(value: number): number {
  if (value >= INDOOR_THRESHOLDS.sunshine.high) return 0;

  if (value >= INDOOR_THRESHOLDS.sunshine.partial)
    return INDOOR_BONUSES.partialSun;

  if (value >= INDOOR_THRESHOLDS.sunshine.low) return INDOOR_BONUSES.lowSun;

  return INDOOR_BONUSES.noSun;
}
