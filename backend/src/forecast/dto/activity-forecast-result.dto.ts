import { GeocodingResultDto } from '../../open-meteo/dto/geocoding-result.dto.js';
import { IndoorSightseeingScore } from '../../scoring/indoor-sightseeing/indoor-sightseeing.score.js';
import { OutdoorSightseeingScore } from '../../scoring/outdoor-sightseeing/outdoor-sightseeing.score.js';
import { ActivityScore } from '../../scoring/skiing/skiing.score.js';

export interface SurfingForecastDto {
  available: boolean;
  score?: number;
  reasons?: string[];
  bestHour?: string;
  unavailableReason?: string;
}

export interface DailyActivityForecastDto {
  date: string;
  skiing: ActivityScore;
  outdoorSightseeing: OutdoorSightseeingScore;
  indoorSightseeing: IndoorSightseeingScore;
  surfing: SurfingForecastDto;
}

export interface ActivityForecastResultDto {
  location: GeocodingResultDto;
  days: DailyActivityForecastDto[];
}
