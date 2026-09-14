import { describe, expect, it } from 'vitest';
import { scoreOutdoorSightseeing } from './outdoor-sightseeing.score.js';

describe('scoreOutdoorSightseeing', () => {
  it('returns the maximum score for a dry, calm, sunny, comfortable day', () => {
    expect(
      scoreOutdoorSightseeing({
        apparentTemperatureC: 21,
        precipitationMm: 0,
        precipitationHours: 0,
        windSpeedKph: 5,
        sunshineRatio: 0.8,
        weatherCode: 0,
      }).score,
    ).toBe(100);
  });

  it('caps an otherwise excellent day when a thunderstorm is forecast', () => {
    const result = scoreOutdoorSightseeing({
      apparentTemperatureC: 21,
      precipitationMm: 0,
      precipitationHours: 0,
      windSpeedKph: 5,
      sunshineRatio: 0.8,
      weatherCode: 95,
    });

    expect(result.score).toBe(20);
    expect(result.reasons).toContain('Thunderstorms make outdoor plans unsafe');
  });

  it('caps an otherwise excellent day when fog is forecast', () => {
    const result = scoreOutdoorSightseeing({
      apparentTemperatureC: 21,
      precipitationMm: 0,
      precipitationHours: 0,
      windSpeedKph: 5,
      sunshineRatio: 0.8,
      weatherCode: 45,
    });

    expect(result.score).toBe(50);
    expect(result.reasons).toContain('Fog reduces visibility');
  });
});
