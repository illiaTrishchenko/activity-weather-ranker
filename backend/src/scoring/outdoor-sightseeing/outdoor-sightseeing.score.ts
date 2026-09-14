import {
  OUTDOOR_COMPONENT_SCORES,
  OUTDOOR_FOG_CODES,
  OUTDOOR_GUARDS,
  OUTDOOR_SCORES,
  OUTDOOR_SEVERE_PRECIPITATION_CODES,
  OUTDOOR_THRESHOLDS,
  OUTDOOR_THUNDERSTORM_CODES,
  OUTDOOR_WEIGHTS,
} from './outdoor-sightseeing.constants.js';

export interface OutdoorSightseeingInput {
  apparentTemperatureC: number;
  precipitationMm: number;
  precipitationHours: number;
  windSpeedKph: number;
  sunshineRatio: number;
  weatherCode: number;
}

export interface OutdoorSightseeingScore {
  score: number;
  reasons: string[];
}

export function scoreOutdoorSightseeing(
  input: OutdoorSightseeingInput,
): OutdoorSightseeingScore {
  const score = Math.round(
    precipitationScore(input.precipitationMm, input.precipitationHours) *
      OUTDOOR_WEIGHTS.precipitation +
      temperatureScore(input.apparentTemperatureC) *
        OUTDOOR_WEIGHTS.temperature +
      sunshineScore(input.sunshineRatio) * OUTDOOR_WEIGHTS.sunshine +
      windScore(input.windSpeedKph) * OUTDOOR_WEIGHTS.wind,
  );

  if (OUTDOOR_THUNDERSTORM_CODES.includes(input.weatherCode as never)) {
    return {
      score: OUTDOOR_GUARDS.thunderstormMax,
      reasons: ['Thunderstorms make outdoor plans unsafe'],
    };
  }

  if (OUTDOOR_SEVERE_PRECIPITATION_CODES.includes(input.weatherCode as never)) {
    return {
      score: Math.min(score, OUTDOOR_GUARDS.severePrecipitationMax),
      reasons: ['Severe precipitation limits sightseeing'],
    };
  }

  if (OUTDOOR_FOG_CODES.includes(input.weatherCode as never)) {
    return {
      score: Math.min(score, OUTDOOR_GUARDS.fogMax),
      reasons: ['Fog reduces visibility'],
    };
  }

  return { score, reasons: outdoorSightseeingReasons(score) };
}

function temperatureScore(value: number): number {
  if (
    value >= OUTDOOR_THRESHOLDS.temperature.idealMin &&
    value <= OUTDOOR_THRESHOLDS.temperature.idealMax
  ) {
    return OUTDOOR_SCORES.excellent;
  }

  if (
    (value >= OUTDOOR_THRESHOLDS.temperature.goodMin &&
      value < OUTDOOR_THRESHOLDS.temperature.idealMin) ||
    (value > OUTDOOR_THRESHOLDS.temperature.idealMax &&
      value <= OUTDOOR_THRESHOLDS.temperature.goodMax)
  ) {
    return OUTDOOR_SCORES.good;
  }

  if (
    (value >= OUTDOOR_THRESHOLDS.temperature.moderateMin &&
      value < OUTDOOR_THRESHOLDS.temperature.goodMin) ||
    (value > OUTDOOR_THRESHOLDS.temperature.goodMax &&
      value <= OUTDOOR_THRESHOLDS.temperature.moderateMax)
  ) {
    return OUTDOOR_SCORES.moderate;
  }

  if (
    (value >= OUTDOOR_THRESHOLDS.temperature.poorMin &&
      value < OUTDOOR_THRESHOLDS.temperature.moderateMin) ||
    (value > OUTDOOR_THRESHOLDS.temperature.moderateMax &&
      value <= OUTDOOR_THRESHOLDS.temperature.poorMax)
  ) {
    return OUTDOOR_SCORES.poor;
  }

  return OUTDOOR_SCORES.veryPoor;
}

function precipitationScore(amount: number, hours: number): number {
  if (amount === 0 && hours === 0) return OUTDOOR_SCORES.excellent;

  if (
    amount <= OUTDOOR_THRESHOLDS.precipitation.lightMm &&
    hours <= OUTDOOR_THRESHOLDS.precipitation.lightHours
  ) {
    return OUTDOOR_SCORES.good;
  }

  if (
    amount <= OUTDOOR_THRESHOLDS.precipitation.moderateMm &&
    hours <= OUTDOOR_THRESHOLDS.precipitation.moderateHours
  ) {
    return OUTDOOR_SCORES.moderate;
  }

  if (
    amount <= OUTDOOR_THRESHOLDS.precipitation.poorMm &&
    hours <= OUTDOOR_THRESHOLDS.precipitation.poorHours
  ) {
    return OUTDOOR_COMPONENT_SCORES.precipitation.prolonged;
  }

  return OUTDOOR_COMPONENT_SCORES.precipitation.heavy;
}

function windScore(value: number): number {
  if (value < OUTDOOR_THRESHOLDS.wind.excellent) {
    return OUTDOOR_SCORES.excellent;
  }

  if (value < OUTDOOR_THRESHOLDS.wind.good) return OUTDOOR_SCORES.good;

  if (value < OUTDOOR_THRESHOLDS.wind.moderate) {
    return OUTDOOR_SCORES.moderate;
  }

  if (value <= OUTDOOR_THRESHOLDS.wind.poor) {
    return OUTDOOR_COMPONENT_SCORES.wind.strong;
  }

  return OUTDOOR_SCORES.veryPoor;
}

function sunshineScore(value: number): number {
  if (value >= OUTDOOR_THRESHOLDS.sunshine.excellent) {
    return OUTDOOR_SCORES.excellent;
  }

  if (value >= OUTDOOR_THRESHOLDS.sunshine.good) {
    return OUTDOOR_SCORES.good;
  }

  if (value >= OUTDOOR_THRESHOLDS.sunshine.moderate) {
    return OUTDOOR_COMPONENT_SCORES.sunshine.cloudy;
  }

  return OUTDOOR_COMPONENT_SCORES.sunshine.overcast;
}

function outdoorSightseeingReasons(score: number): string[] {
  if (score >= OUTDOOR_SCORES.good) {
    return ['Comfortable conditions for sightseeing'];
  }

  return ['Mixed outdoor conditions'];
}
