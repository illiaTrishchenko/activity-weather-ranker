import axios from 'axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FORECAST_API_CLIENT,
  GEOCODING_API_CLIENT,
  MARINE_API_CLIENT,
} from './open-meteo.constants.js';
import { OpenMeteoService } from './open-meteo.service.js';

@Module({
  providers: [
    {
      provide: GEOCODING_API_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        axios.create({
          baseURL: configService.getOrThrow<string>(
            'OPEN_METEO_GEOCODING_API_URL',
          ),
          headers: { Accept: 'application/json' },
        }),
    },
    {
      provide: FORECAST_API_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        axios.create({
          baseURL: configService.getOrThrow<string>(
            'OPEN_METEO_FORECAST_API_URL',
          ),
          headers: { Accept: 'application/json' },
        }),
    },
    {
      provide: MARINE_API_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        axios.create({
          baseURL: configService.getOrThrow<string>(
            'OPEN_METEO_MARINE_API_URL',
          ),
          headers: { Accept: 'application/json' },
        }),
    },
    OpenMeteoService,
  ],
  exports: [OpenMeteoService],
})
export class OpenMeteoModule {}
