import { describe, expect, it } from 'vitest';
import { scoreIndoorSightseeing } from './indoor-sightseeing.score.js';

describe('scoreIndoorSightseeing', () => {
  it('returns the neutral baseline on a dry, calm, sunny day', () => {
    expect(
      scoreIndoorSightseeing({
        apparentTemperatureC: 22,
        precipitationMm: 0,
        precipitationHours: 0,
        windSpeedKph: 5,
        sunshineRatio: 0.8,
        weatherCode: 0,
      }).score,
    ).toBe(50);
  });

  it('caps the result at 60 during a thunderstorm', () => {
    expect(
      scoreIndoorSightseeing({
        apparentTemperatureC: 22,
        precipitationMm: 10,
        precipitationHours: 10,
        windSpeedKph: 55,
        sunshineRatio: 0,
        weatherCode: 95,
      }).score,
    ).toBe(60);
  });

  it('makes indoor sightseeing more attractive during prolonged rain', () => {
    expect(
      scoreIndoorSightseeing({
        apparentTemperatureC: 18,
        precipitationMm: 6,
        precipitationHours: 6,
        windSpeedKph: 5,
        sunshineRatio: 0.1,
        weatherCode: 63,
      }).score,
    ).toBe(70);
  });

  it('caps severe precipitation at 70 even when all bonuses apply', () => {
    expect(
      scoreIndoorSightseeing({
        apparentTemperatureC: 36,
        precipitationMm: 12,
        precipitationHours: 10,
        windSpeedKph: 55,
        sunshineRatio: 0,
        weatherCode: 65,
      }).score,
    ).toBe(70);
  });
});
