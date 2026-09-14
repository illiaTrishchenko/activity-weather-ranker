import { describe, expect, it, vi } from 'vitest';
import { OpenMeteoService } from '../open-meteo/open-meteo.service.js';
import { ForecastService } from './forecast.service.js';

describe('ForecastService', () => {
  it('trims the place before geocoding it', async () => {
    const openMeteoService = {
      geocodePlace: vi.fn(async (place: string) => {
        if (place !== 'London') throw new Error('Place was not normalized');

        return LONDON;
      }),
      getWeatherForecast: vi.fn().mockResolvedValue(createWeatherForecast()),
      getMarineForecast: vi.fn().mockResolvedValue({
        latitude: 0,
        longitude: 0,
        hourly: { time: [], wave_height: [], wave_period: [] },
      }),
    } as unknown as OpenMeteoService;
    const service = new ForecastService(openMeteoService);

    const result = await service.getActivityForecast('  London  ');

    expect(result.location).toEqual(LONDON);
  });

  it('returns scored forecasts after geocoding the requested place', async () => {
    const geocodePlace = vi.fn().mockResolvedValue({
      id: 2643743,
      name: 'London',
      latitude: 51.50853,
      longitude: -0.12574,
    });
    const openMeteoService = {
      geocodePlace,
      getWeatherForecast: vi.fn().mockResolvedValue({
        latitude: 51.5,
        longitude: -0.1,
        timezone: 'Europe/London',
        daily: {
          time: ['2026-09-14'],
          apparent_temperature_max: [-5],
          precipitation_sum: [0],
          precipitation_hours: [0],
          wind_speed_10m_max: [5],
          sunshine_duration: [43200],
          daylight_duration: [43200],
          weather_code: [0],
          snowfall_sum: [5],
        },
        hourly: {
          time: ['2026-09-14T00:00', '2026-09-14T12:00'],
          snow_depth: [0.4, 0.5],
        },
      }),
      getMarineForecast: vi.fn().mockResolvedValue({
        latitude: 0,
        longitude: 0,
        hourly: { time: [], wave_height: [], wave_period: [] },
      }),
    } as unknown as OpenMeteoService;
    const service = new ForecastService(openMeteoService);

    const result = await service.getActivityForecast('London');

    expect(geocodePlace).toHaveBeenCalledWith('London');
    expect(result.location.name).toBe('London');
    expect(result.days).toHaveLength(1);
    expect(result.days[0]).toMatchObject({
      date: '2026-09-14',
      skiing: { score: 100 },
    });
  });

  it('selects the highest-scoring daylight hour for surfing', async () => {
    const openMeteoService = {
      geocodePlace: vi.fn().mockResolvedValue(LONDON),
      getWeatherForecast: vi.fn().mockResolvedValue(createWeatherForecast()),
      getMarineForecast: vi.fn().mockResolvedValue({
        latitude: 51.5,
        longitude: -0.1,
        hourly: {
          time: ['2026-09-14T08:00', '2026-09-14T12:00'],
          wave_height: [0.5, 1.2],
          wave_period: [8, 13],
        },
      }),
      getSurfingWeatherForecast: vi.fn().mockResolvedValue({
        hourly: {
          time: ['2026-09-14T08:00', '2026-09-14T12:00'],
          wind_speed_10m: [25, 5],
          weather_code: [0, 0],
          is_day: [1, 1],
        },
      }),
    } as unknown as OpenMeteoService;
    const service = new ForecastService(openMeteoService);

    const result = await service.getActivityForecast('London');

    expect(result.days[0].surfing).toEqual({
      available: true,
      score: 100,
      reasons: ['Suitable wave height for recreational surfing'],
      bestHour: '2026-09-14T12:00',
    });
  });

  it('returns surfing as unavailable when marine data is missing', async () => {
    const openMeteoService = {
      geocodePlace: vi.fn().mockResolvedValue(LONDON),
      getWeatherForecast: vi.fn().mockResolvedValue(createWeatherForecast()),
      getMarineForecast: vi.fn().mockResolvedValue({
        latitude: 51.5,
        longitude: -0.1,
        hourly: {
          time: ['2026-09-14T08:00'],
          wave_height: [null],
          wave_period: [null],
        },
      }),
      getSurfingWeatherForecast: vi
        .fn()
        .mockRejectedValue(
          new Error('Surfing weather should not be requested'),
        ),
    } as unknown as OpenMeteoService;
    const service = new ForecastService(openMeteoService);

    const result = await service.getActivityForecast('London');

    expect(result.days[0].surfing).toEqual({
      available: false,
      unavailableReason: 'No nearby marine forecast data is available',
    });
  });
});

const LONDON = {
  id: 2643743,
  name: 'London',
  latitude: 51.50853,
  longitude: -0.12574,
};

function createWeatherForecast() {
  return {
    latitude: 51.5,
    longitude: -0.1,
    timezone: 'Europe/London',
    daily: {
      time: ['2026-09-14'],
      apparent_temperature_max: [18],
      precipitation_sum: [0],
      precipitation_hours: [0],
      wind_speed_10m_max: [5],
      sunshine_duration: [43200],
      daylight_duration: [43200],
      weather_code: [0],
      snowfall_sum: [0],
    },
    hourly: {
      time: ['2026-09-14T00:00', '2026-09-14T12:00'],
      snow_depth: [0, 0],
    },
  };
}
