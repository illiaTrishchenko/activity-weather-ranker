export interface MarineForecastDto {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    wave_height: Array<number | null>;
    wave_period: Array<number | null>;
  };
}
