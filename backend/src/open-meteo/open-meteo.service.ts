import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AxiosInstance } from 'axios';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GeocodingResponseDto,
  GeocodingResultDto,
} from './dto/geocoding-result.dto.js';
import { WeatherForecastDto } from './dto/weather-forecast.dto.js';
import { MarineForecastDto } from './dto/marine-forecast.dto.js';
import { SurfingWeatherForecastDto } from './dto/surfing-weather-forecast.dto.js';
import {
  FORECAST_API_CLIENT,
  GEOCODING_API_CLIENT,
  MARINE_API_CLIENT,
} from './open-meteo.constants.js';

const DAILY_FORECAST_VARIABLES = [
  'apparent_temperature_max',
  'precipitation_sum',
  'precipitation_hours',
  'wind_speed_10m_max',
  'sunshine_duration',
  'daylight_duration',
  'weather_code',
  'snowfall_sum',
];

const HOURLY_FORECAST_VARIABLES = ['snow_depth'];

@Injectable()
export class OpenMeteoService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(GEOCODING_API_CLIENT)
    private readonly geocodingClient: AxiosInstance,
    @Inject(FORECAST_API_CLIENT)
    private readonly forecastClient: AxiosInstance,
    @Inject(MARINE_API_CLIENT)
    private readonly marineClient: AxiosInstance,
  ) {}

  async geocodePlace(place: string): Promise<GeocodingResultDto> {
    const geocodingResultCount = this.configService.getOrThrow<string>(
      'OPEN_METEO_GEOCODING_RESULT_COUNT',
    );

    try {
      const response = await this.geocodingClient.get<GeocodingResponseDto>(
        '/v1/search',
        {
          params: {
            name: place,
            count: geocodingResultCount,
            format: 'json',
          },
        },
      );

      const payload = response.data;
      const [location] = payload.results ?? [];

      if (!location) {
        throw new NotFoundException('Place not found');
      }

      return location;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new BadGatewayException('Open-Meteo geocoding request failed');
    }
  }

  async getWeatherForecast(
    location: GeocodingResultDto,
  ): Promise<WeatherForecastDto> {
    const forecastDays = this.configService.getOrThrow<string>(
      'OPEN_METEO_FORECAST_DAYS',
    );
    try {
      const response = await this.forecastClient.get<WeatherForecastDto>(
        '/v1/forecast',
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            forecast_days: forecastDays,
            timezone: 'auto',
            daily: DAILY_FORECAST_VARIABLES.join(','),
            hourly: HOURLY_FORECAST_VARIABLES.join(','),
          },
        },
      );

      return response.data;
    } catch {
      throw new BadGatewayException('Open-Meteo forecast request failed');
    }
  }

  async getMarineForecast(
    location: GeocodingResultDto,
  ): Promise<MarineForecastDto> {
    const forecastDays = this.configService.getOrThrow<string>(
      'OPEN_METEO_FORECAST_DAYS',
    );

    try {
      const response = await this.marineClient.get<MarineForecastDto>(
        '/v1/marine',
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            forecast_days: forecastDays,
            hourly: 'wave_height,wave_period',
            cell_selection: 'sea',
            timezone: 'auto',
          },
        },
      );

      return response.data;
    } catch {
      throw new BadGatewayException('Open-Meteo marine request failed');
    }
  }

  async getSurfingWeatherForecast(
    location: Pick<GeocodingResultDto, 'latitude' | 'longitude'>,
  ): Promise<SurfingWeatherForecastDto> {
    const forecastDays = this.configService.getOrThrow<string>(
      'OPEN_METEO_FORECAST_DAYS',
    );

    try {
      const response = await this.forecastClient.get<SurfingWeatherForecastDto>(
        '/v1/forecast',
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            forecast_days: forecastDays,
            timezone: 'auto',
            hourly: 'wind_speed_10m,weather_code,is_day',
          },
        },
      );

      return response.data;
    } catch {
      throw new BadGatewayException(
        'Open-Meteo surfing weather request failed',
      );
    }
  }
}
