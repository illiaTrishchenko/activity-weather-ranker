import { AxiosInstance } from 'axios';
import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { describe, expect, it, vi } from 'vitest';
import { OpenMeteoService } from './open-meteo.service.js';

describe('OpenMeteoService', () => {
  it('returns the first matching location from the geocoding API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        results: [
          {
            id: 2643743,
            name: 'London',
            latitude: 51.50853,
            longitude: -0.12574,
            country: 'United Kingdom',
          },
        ],
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await createService({
      OPEN_METEO_GEOCODING_API_URL: 'https://geocoding.example.test',
      OPEN_METEO_GEOCODING_RESULT_COUNT: '3',
    }).geocodePlace('London');

    expect(result).toEqual({
      id: 2643743,
      name: 'London',
      latitude: 51.50853,
      longitude: -0.12574,
      country: 'United Kingdom',
    });

    const requestUrl = new URL(fetchMock.mock.calls[0][0]);
    expect(requestUrl.origin).toBe('https://geocoding.example.test');
    expect(requestUrl.pathname).toBe('/v1/search');
    expect(requestUrl.searchParams.get('name')).toBe('London');
    expect(requestUrl.searchParams.get('count')).toBe('3');
  });

  it('throws a not-found error when geocoding returns no results', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({})));

    await expect(
      createService().geocodePlace('Unknown place'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws a gateway error when Open-Meteo returns an error response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );

    await expect(createService().geocodePlace('London')).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });

  it('requests the daily and hourly variables needed by the scoring models', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        latitude: 51.5,
        longitude: -0.1,
        timezone: 'Europe/London',
        daily: { time: [] },
        hourly: { time: [], snow_depth: [] },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await createService().getWeatherForecast({
      id: 2643743,
      name: 'London',
      latitude: 51.50853,
      longitude: -0.12574,
    });

    const requestUrl = new URL(fetchMock.mock.calls[0][0]);
    expect(requestUrl.origin).toBe('https://api.open-meteo.com');
    expect(requestUrl.pathname).toBe('/v1/forecast');
    expect(requestUrl.searchParams.get('forecast_days')).toBe('7');
    expect(requestUrl.searchParams.get('timezone')).toBe('auto');
    expect(requestUrl.searchParams.get('hourly')).toBe('snow_depth');
    expect(requestUrl.searchParams.get('daily')).toBe(
      'apparent_temperature_max,precipitation_sum,precipitation_hours,wind_speed_10m_max,sunshine_duration,daylight_duration,weather_code,snowfall_sum',
    );
  });
});

function createService(
  environment: Record<string, string> = {},
): OpenMeteoService {
  const geocodingApiUrl =
    environment.OPEN_METEO_GEOCODING_API_URL ??
    'https://geocoding-api.open-meteo.com';

  return new OpenMeteoService(
    new ConfigService({
      OPEN_METEO_GEOCODING_API_URL: 'https://geocoding-api.open-meteo.com',
      OPEN_METEO_GEOCODING_RESULT_COUNT: '1',
      OPEN_METEO_FORECAST_API_URL: 'https://api.open-meteo.com',
      OPEN_METEO_FORECAST_DAYS: '7',
      OPEN_METEO_MARINE_API_URL: 'https://marine-api.open-meteo.com',
      ...environment,
    }),
    {
      get: async (
        url: string,
        config: { params: Record<string, string | number> },
      ) => {
        const requestUrl = new URL(url, geocodingApiUrl);

        for (const [key, value] of Object.entries(config.params)) {
          requestUrl.searchParams.set(key, String(value));
        }

        const response = await fetch(requestUrl);

        if (!response.ok) throw new Error('Request failed');

        return { data: await response.json() };
      },
    } as AxiosInstance,
    {
      get: async (
        url: string,
        config: { params: Record<string, string | number> },
      ) => {
        const requestUrl = new URL(url, 'https://api.open-meteo.com');

        for (const [key, value] of Object.entries(config.params)) {
          requestUrl.searchParams.set(key, String(value));
        }

        const response = await fetch(requestUrl);

        if (!response.ok) throw new Error('Request failed');

        return { data: await response.json() };
      },
    } as AxiosInstance,
    {
      get: async () => ({ data: {} }),
    } as AxiosInstance,
  );
}
