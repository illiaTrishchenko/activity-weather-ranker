import {
  SURFING_GUARDS,
  SURFING_SCORES,
  SURFING_THRESHOLDS,
  SURFING_THUNDERSTORM_CODES,
  SURFING_WEIGHTS,
} from './surfing.constants.js';

export interface SurfingInput {
  waveHeightM: number;
  wavePeriodSeconds: number;
  windSpeedKph: number;
  weatherCode: number;
}

export interface SurfingScore {
  score: number;
  reasons: string[];
}

export function scoreSurfing(input: SurfingInput): SurfingScore {
  if (SURFING_THUNDERSTORM_CODES.includes(input.weatherCode as never)) {
    return {
      score: SURFING_SCORES.unsuitable,
      reasons: ['Thunderstorms are unsafe for surfing'],
    };
  }

  const score = Math.round(
    waveHeightScore(input.waveHeightM) * SURFING_WEIGHTS.waveHeight +
      wavePeriodScore(input.wavePeriodSeconds) * SURFING_WEIGHTS.wavePeriod +
      windScore(input.windSpeedKph) * SURFING_WEIGHTS.wind,
  );

  if (input.waveHeightM < SURFING_THRESHOLDS.waveHeightM.minimum) {
    return {
      score: Math.min(score, SURFING_GUARDS.tooSmallWavesMax),
      reasons: ['Waves are too small for surfing'],
    };
  }

  if (input.waveHeightM > SURFING_THRESHOLDS.waveHeightM.maximum) {
    return {
      score: Math.min(score, SURFING_GUARDS.tooLargeWavesMax),
      reasons: ['Waves are outside the recreational range'],
    };
  }

  if (input.windSpeedKph > SURFING_THRESHOLDS.windSpeedKph.poor) {
    return {
      score: Math.min(score, SURFING_GUARDS.strongWindMax),
      reasons: ['Strong wind is likely to disrupt the surface'],
    };
  }

  return { score, reasons: surfingReasons(input) };
}

function waveHeightScore(value: number): number {
  if (
    value >= SURFING_THRESHOLDS.waveHeightM.excellentMin &&
    value <= SURFING_THRESHOLDS.waveHeightM.excellentMax
  ) {
    return SURFING_SCORES.excellent;
  }

  if (
    (value >= SURFING_THRESHOLDS.waveHeightM.goodMin &&
      value < SURFING_THRESHOLDS.waveHeightM.excellentMin) ||
    (value > SURFING_THRESHOLDS.waveHeightM.excellentMax &&
      value <= SURFING_THRESHOLDS.waveHeightM.goodMax)
  ) {
    return SURFING_SCORES.good;
  }

  if (
    value >= SURFING_THRESHOLDS.waveHeightM.minimum &&
    value < SURFING_THRESHOLDS.waveHeightM.goodMin
  ) {
    return SURFING_SCORES.moderate;
  }

  if (
    value > SURFING_THRESHOLDS.waveHeightM.goodMax &&
    value <= SURFING_THRESHOLDS.waveHeightM.maximum
  ) {
    return SURFING_SCORES.moderate;
  }

  return SURFING_SCORES.unsuitable;
}

function wavePeriodScore(value: number): number {
  if (
    value >= SURFING_THRESHOLDS.wavePeriodSeconds.excellentMin &&
    value <= SURFING_THRESHOLDS.wavePeriodSeconds.excellentMax
  ) {
    return SURFING_SCORES.excellent;
  }

  if (
    (value >= SURFING_THRESHOLDS.wavePeriodSeconds.goodMin &&
      value < SURFING_THRESHOLDS.wavePeriodSeconds.excellentMin) ||
    (value > SURFING_THRESHOLDS.wavePeriodSeconds.excellentMax &&
      value <= SURFING_THRESHOLDS.wavePeriodSeconds.goodMax)
  ) {
    return SURFING_SCORES.good;
  }

  if (value >= SURFING_THRESHOLDS.wavePeriodSeconds.moderateMin) {
    return SURFING_SCORES.moderate;
  }

  return SURFING_SCORES.poor;
}

function windScore(value: number): number {
  if (value < SURFING_THRESHOLDS.windSpeedKph.excellent) {
    return SURFING_SCORES.excellent;
  }

  if (value < SURFING_THRESHOLDS.windSpeedKph.good) {
    return SURFING_SCORES.good;
  }

  if (value < SURFING_THRESHOLDS.windSpeedKph.moderate) {
    return SURFING_SCORES.moderate;
  }

  if (value <= SURFING_THRESHOLDS.windSpeedKph.poor) {
    return SURFING_SCORES.poor;
  }

  return SURFING_SCORES.unsuitable;
}

function surfingReasons(input: SurfingInput): string[] {
  if (
    input.waveHeightM >= SURFING_THRESHOLDS.waveHeightM.excellentMin &&
    input.waveHeightM <= SURFING_THRESHOLDS.waveHeightM.excellentMax
  ) {
    return ['Suitable wave height for recreational surfing'];
  }

  return ['Mixed surfing conditions'];
}
