import { describe, expect, it, vi } from 'vitest';
import { OpenMeteoService } from '../open-meteo/open-meteo.service.js';
import { ForecastService } from './forecast.service.js';

describe('ForecastService', () => {
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
});
