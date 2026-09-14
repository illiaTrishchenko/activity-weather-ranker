import { describe, expect, it, vi } from 'vitest';
import { ForecastResolver } from './forecast.resolver.js';
import { ForecastService } from './forecast.service.js';

describe('ForecastResolver', () => {
  it('delegates the activity forecast query to ForecastService', async () => {
    const getActivityForecast = vi.fn().mockResolvedValue({
      location: { id: 1, name: 'London', latitude: 51.5, longitude: -0.1 },
      days: [],
    });
    const forecastService = { getActivityForecast } as ForecastService;
    const resolver = new ForecastResolver(forecastService);

    await expect(
      resolver.activityForecast({ place: 'London' }),
    ).resolves.toEqual({
      location: { id: 1, name: 'London', latitude: 51.5, longitude: -0.1 },
      days: [],
    });
    expect(getActivityForecast).toHaveBeenCalledWith('London');
  });
});
