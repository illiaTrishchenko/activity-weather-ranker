import { describe, expect, it } from 'vitest';
import { scoreSurfing } from './surfing.score.js';

describe('scoreSurfing', () => {
  it('returns the maximum score for ideal recreational intermediate conditions', () => {
    const result = scoreSurfing({
      waveHeightM: 1.2,
      wavePeriodSeconds: 13,
      windSpeedKph: 5,
      weatherCode: 0,
    });

    expect(result.score).toBe(100);
    expect(result.reasons).toContain(
      'Suitable wave height for recreational surfing',
    );
  });

  it('caps the score when waves are too small to surf', () => {
    const result = scoreSurfing({
      waveHeightM: 0.2,
      wavePeriodSeconds: 14,
      windSpeedKph: 5,
      weatherCode: 0,
    });

    expect(result.score).toBe(20);
    expect(result.reasons).toContain('Waves are too small for surfing');
  });

  it('caps the score when strong wind disrupts surface conditions', () => {
    const result = scoreSurfing({
      waveHeightM: 1.2,
      wavePeriodSeconds: 13,
      windSpeedKph: 45,
      weatherCode: 0,
    });

    expect(result.score).toBe(30);
    expect(result.reasons).toContain(
      'Strong wind is likely to disrupt the surface',
    );
  });

  it('returns zero for a thunderstorm during the forecast hour', () => {
    const result = scoreSurfing({
      waveHeightM: 1.2,
      wavePeriodSeconds: 13,
      windSpeedKph: 5,
      weatherCode: 95,
    });

    expect(result.score).toBe(0);
    expect(result.reasons).toContain('Thunderstorms are unsafe for surfing');
  });
});
