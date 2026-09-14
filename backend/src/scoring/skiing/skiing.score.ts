import {
  SKIING_SCORES,
  SKIING_SEVERE_WEATHER_CODES,
  SKIING_SNOW_GUARD,
  SKIING_THRESHOLDS,
  SKIING_THUNDERSTORM_CODES,
  SKIING_WEIGHTS,
} from './skiing.constants.js';

export interface SkiingInput {
  snowDepthCm: number;
  snowfallCm: number;
  temperatureC: number;
  windSpeedKph: number;
  weatherCode: number;
}

export interface ActivityScore {
  score: number;
  reasons: string[];
}

export function scoreSkiing(input: SkiingInput): ActivityScore {
  const weightedScore = Math.round(
    snowDepthScore(input.snowDepthCm) * SKIING_WEIGHTS.snowDepth +
      snowfallScore(input.snowfallCm) * SKIING_WEIGHTS.snowfall +
      temperatureScore(input.temperatureC) * SKIING_WEIGHTS.temperature +
      windScore(input.windSpeedKph) * SKIING_WEIGHTS.wind +
      weatherScore(input.weatherCode) * SKIING_WEIGHTS.weather,
  );

  if (
    input.snowDepthCm < SKIING_SNOW_GUARD.minDepthCm &&
    input.snowfallCm < SKIING_SNOW_GUARD.minSnowfallCm
  ) {
    return {
      score: Math.min(weightedScore, SKIING_SNOW_GUARD.maxScore),
      reasons: ['No usable snow is forecast'],
    };
  }

  return {
    score: weightedScore,
    reasons: skiingReasons(input),
  };
}

function snowDepthScore(snowDepthCm: number): number {
  if (snowDepthCm >= SKIING_THRESHOLDS.snowDepthCm.excellent)
    return SKIING_SCORES.excellent;

  if (snowDepthCm >= SKIING_THRESHOLDS.snowDepthCm.good)
    return SKIING_SCORES.good;

  if (snowDepthCm >= SKIING_THRESHOLDS.snowDepthCm.moderate)
    return SKIING_SCORES.moderate;

  if (snowDepthCm >= SKIING_THRESHOLDS.snowDepthCm.poor)
    return SKIING_SCORES.poor;

  return SKIING_SCORES.unsuitable;
}

function snowfallScore(snowfallCm: number): number {
  if (
    snowfallCm >= SKIING_THRESHOLDS.snowfallCm.excellentMin &&
    snowfallCm <= SKIING_THRESHOLDS.snowfallCm.excellentMax
  )
    return SKIING_SCORES.excellent;

  if (
    snowfallCm >= SKIING_THRESHOLDS.snowfallCm.good &&
    snowfallCm < SKIING_THRESHOLDS.snowfallCm.excellentMin
  )
    return SKIING_SCORES.good;

  if (
    snowfallCm > SKIING_THRESHOLDS.snowfallCm.excellentMax &&
    snowfallCm <= SKIING_THRESHOLDS.snowfallCm.reducedMax
  )
    return SKIING_SCORES.good;

  if (snowfallCm <= SKIING_THRESHOLDS.snowfallCm.good)
    return SKIING_SCORES.moderate;

  return SKIING_SCORES.poor;
}

function temperatureScore(temperatureC: number): number {
  if (
    temperatureC >= SKIING_THRESHOLDS.temperatureC.idealMin &&
    temperatureC <= SKIING_THRESHOLDS.temperatureC.idealMax
  )
    return SKIING_SCORES.excellent;

  if (
    temperatureC >= SKIING_THRESHOLDS.temperatureC.coldMin &&
    temperatureC < SKIING_THRESHOLDS.temperatureC.idealMin
  )
    return SKIING_SCORES.good;

  if (
    temperatureC > SKIING_THRESHOLDS.temperatureC.idealMax &&
    temperatureC <= SKIING_THRESHOLDS.temperatureC.acceptableMax
  )
    return SKIING_SCORES.moderate;

  if (
    temperatureC > SKIING_THRESHOLDS.temperatureC.acceptableMax &&
    temperatureC <= SKIING_THRESHOLDS.temperatureC.poorMax
  )
    return SKIING_SCORES.poor;

  return SKIING_SCORES.unsuitable;
}

function windScore(windSpeedKph: number): number {
  if (windSpeedKph < SKIING_THRESHOLDS.windSpeedKph.excellent)
    return SKIING_SCORES.excellent;

  if (windSpeedKph < SKIING_THRESHOLDS.windSpeedKph.good)
    return SKIING_SCORES.good;

  if (windSpeedKph < SKIING_THRESHOLDS.windSpeedKph.moderate)
    return SKIING_SCORES.moderate;

  if (windSpeedKph < SKIING_THRESHOLDS.windSpeedKph.poor)
    return SKIING_SCORES.poor;

  return SKIING_SCORES.unsuitable;
}

function weatherScore(weatherCode: number): number {
  if (SKIING_THUNDERSTORM_CODES.includes(weatherCode as never))
    return SKIING_SCORES.unsuitable;

  if (SKIING_SEVERE_WEATHER_CODES.includes(weatherCode as never))
    return SKIING_SCORES.poor;

  return SKIING_SCORES.excellent;
}

function skiingReasons(input: SkiingInput): string[] {
  const reasons: string[] = [];

  if (input.snowDepthCm >= SKIING_THRESHOLDS.snowDepthCm.good)
    reasons.push('Good snow depth');

  if (input.windSpeedKph >= SKIING_THRESHOLDS.windSpeedKph.moderate)
    reasons.push('Strong wind reduces comfort');

  if (input.temperatureC > SKIING_THRESHOLDS.temperatureC.acceptableMax)
    reasons.push('Above-freezing temperatures affect snow quality');

  if (SKIING_THUNDERSTORM_CODES.includes(input.weatherCode as never))
    reasons.push('Thunderstorms are unsafe');

  return reasons.length > 0 ? reasons : ['Mixed skiing conditions'];
}
