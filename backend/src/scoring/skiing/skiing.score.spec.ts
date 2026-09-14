import { describe, expect, it } from 'vitest';
import { scoreSkiing } from './skiing.score.js';

describe('scoreSkiing', () => {
  it('returns the maximum score for ideal recreational resort conditions', () => {
    const result = scoreSkiing({
      snowDepthCm: 50,
      snowfallCm: 5,
      temperatureC: -5,
      windSpeedKph: 5,
      weatherCode: 0,
    });

    expect(result.score).toBe(100);
    expect(result.reasons).toContain('Good snow depth');
  });

  it('caps the score when there is no usable snow', () => {
    const result = scoreSkiing({
      snowDepthCm: 0,
      snowfallCm: 0,
      temperatureC: -5,
      windSpeedKph: 5,
      weatherCode: 0,
    });

    expect(result.score).toBe(20);
    expect(result.reasons).toContain('No usable snow is forecast');
  });

  it('does not apply the snow guard at exactly 5 cm of snow depth', () => {
    const result = scoreSkiing({
      snowDepthCm: 5,
      snowfallCm: 0,
      temperatureC: -5,
      windSpeedKph: 5,
      weatherCode: 0,
    });

    expect(result.score).toBe(69);
    expect(result.reasons).not.toContain('No usable snow is forecast');
  });

  it('rewards fresh snowfall in the ideal 5 to 15 cm range', () => {
    const result = scoreSkiing({
      snowDepthCm: 30,
      snowfallCm: 5,
      temperatureC: -5,
      windSpeedKph: 5,
      weatherCode: 0,
    });

    expect(result.score).toBe(91);
  });

  it('reduces the score when wind is above 60 km/h', () => {
    const result = scoreSkiing({
      snowDepthCm: 50,
      snowfallCm: 5,
      temperatureC: -5,
      windSpeedKph: 65,
      weatherCode: 0,
    });

    expect(result.score).toBe(80);
    expect(result.reasons).toContain('Strong wind reduces comfort');
  });
});
