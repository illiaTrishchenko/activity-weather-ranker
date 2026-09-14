export interface WeatherForecastDailyDto {
  time: string[];
  apparent_temperature_max: number[];
  precipitation_sum: number[];
  precipitation_hours: number[];
  wind_speed_10m_max: number[];
  sunshine_duration: number[];
  daylight_duration: number[];
  weather_code: number[];
  snowfall_sum: number[];
}

export interface WeatherForecastHourlyDto {
  time: string[];
  snow_depth: number[];
}

export interface WeatherForecastDto {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: WeatherForecastDailyDto;
  hourly: WeatherForecastHourlyDto;
}
