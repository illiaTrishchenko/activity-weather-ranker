export interface SurfingWeatherForecastDto {
  hourly: {
    time: string[];
    wind_speed_10m: number[];
    weather_code: number[];
    is_day: number[];
  };
}
