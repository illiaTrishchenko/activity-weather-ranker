export interface GeocodingResultDto {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface GeocodingResponseDto {
  results?: GeocodingResultDto[];
}
