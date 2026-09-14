import { Injectable } from '@nestjs/common';
import { ActivityForecastResultDto } from './dto/activity-forecast-result.dto.js';
import { OpenMeteoService } from '../open-meteo/open-meteo.service.js';
import { scoreIndoorSightseeing } from '../scoring/indoor-sightseeing/indoor-sightseeing.score.js';
import { scoreOutdoorSightseeing } from '../scoring/outdoor-sightseeing/outdoor-sightseeing.score.js';
import { scoreSkiing } from '../scoring/skiing/skiing.score.js';
import { scoreSurfing } from '../scoring/surfing/surfing.score.js';

const CENTIMETRES_PER_METRE = 100;
const MAX_SURFING_DISTANCE_KM = 25;
const EARTH_RADIUS_KM = 6371;

@Injectable()
export class ForecastService {
  constructor(private readonly openMeteoService: OpenMeteoService) {}

  async getActivityForecast(place: string): Promise<ActivityForecastResultDto> {
    const location = await this.openMeteoService.geocodePlace(place);
    const forecast = await this.openMeteoService.getWeatherForecast(location);
    const marineForecast =
      await this.openMeteoService.getMarineForecast(location);
    const marineDistanceKm = this.getDistanceKm(location, marineForecast);
    const hasMarineData = marineForecast.hourly.wave_height.some(
      (waveHeight) => waveHeight !== null,
    );
    const surfingWeather =
      hasMarineData && marineDistanceKm <= MAX_SURFING_DISTANCE_KM
        ? await this.openMeteoService.getSurfingWeatherForecast(marineForecast)
        : undefined;

    return {
      location,
      days: forecast.daily.time.map((date, index) => {
        const sunshineRatio =
          forecast.daily.sunshine_duration[index] /
          forecast.daily.daylight_duration[index];
        const sharedInput = {
          apparentTemperatureC: forecast.daily.apparent_temperature_max[index],
          precipitationMm: forecast.daily.precipitation_sum[index],
          precipitationHours: forecast.daily.precipitation_hours[index],
          windSpeedKph: forecast.daily.wind_speed_10m_max[index],
          sunshineRatio,
          weatherCode: forecast.daily.weather_code[index],
        };

        return {
          date,
          skiing: scoreSkiing({
            snowDepthCm: this.getMaximumSnowDepthCm(forecast.hourly, date),
            snowfallCm: forecast.daily.snowfall_sum[index],
            temperatureC: sharedInput.apparentTemperatureC,
            windSpeedKph: sharedInput.windSpeedKph,
            weatherCode: sharedInput.weatherCode,
          }),
          outdoorSightseeing: scoreOutdoorSightseeing(sharedInput),
          indoorSightseeing: scoreIndoorSightseeing(sharedInput),
          surfing: this.getSurfingForecast(
            date,
            marineForecast,
            surfingWeather,
            marineDistanceKm,
            hasMarineData,
          ),
        };
      }),
    };
  }

  private getMaximumSnowDepthCm(
    hourly: { time: string[]; snow_depth: number[] },
    date: string,
  ): number {
    return (
      hourly.time.reduce((maximum, time, index) => {
        if (!time.startsWith(date)) return maximum;

        return Math.max(maximum, hourly.snow_depth[index]);
      }, 0) * CENTIMETRES_PER_METRE
    );
  }

  private getSurfingForecast(
    date: string,
    marineForecast: {
      hourly: {
        time: string[];
        wave_height: Array<number | null>;
        wave_period: Array<number | null>;
      };
    },
    surfingWeather:
      | {
          hourly: {
            time: string[];
            wind_speed_10m: number[];
            weather_code: number[];
            is_day: number[];
          };
        }
      | undefined,
    distanceKm: number,
    hasMarineData: boolean,
  ) {
    if (!hasMarineData) {
      return {
        available: false,
        unavailableReason: 'No nearby marine forecast data is available',
      };
    }

    if (!surfingWeather)
      return {
        available: false,
        unavailableReason: `Marine forecast is ${Math.round(distanceKm)} km away`,
      };
    const candidates = marineForecast.hourly.time
      .map((time, index) => ({ time, index }))
      .filter(
        ({ time, index }) =>
          time.startsWith(date) && surfingWeather.hourly.is_day[index] === 1,
      )
      .filter(
        ({ index }) =>
          marineForecast.hourly.wave_height[index] !== null &&
          marineForecast.hourly.wave_period[index] !== null,
      )
      .map(({ time, index }) => ({
        time,
        score: scoreSurfing({
          waveHeightM: marineForecast.hourly.wave_height[index] as number,
          wavePeriodSeconds: marineForecast.hourly.wave_period[index] as number,
          windSpeedKph: surfingWeather.hourly.wind_speed_10m[index],
          weatherCode: surfingWeather.hourly.weather_code[index],
        }),
      }));
    const best = candidates.sort((a, b) => b.score.score - a.score.score)[0];
    return best
      ? {
          available: true,
          score: best.score.score,
          reasons: best.score.reasons,
          bestHour: best.time,
        }
      : {
          available: false,
          unavailableReason: 'No daylight marine forecast is available',
        };
  }

  private getDistanceKm(
    a: { latitude: number; longitude: number },
    b: { latitude: number; longitude: number },
  ): number {
    const toRadians = (value: number) => (value * Math.PI) / 180;
    const latitudeDifference = toRadians(b.latitude - a.latitude);
    const longitudeDifference = toRadians(b.longitude - a.longitude);
    const value =
      Math.sin(latitudeDifference / 2) ** 2 +
      Math.cos(toRadians(a.latitude)) *
        Math.cos(toRadians(b.latitude)) *
        Math.sin(longitudeDifference / 2) ** 2;
    return (
      EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
    );
  }
}
