import { Module } from '@nestjs/common';
import { OpenMeteoModule } from '../open-meteo/open-meteo.module.js';
import { ForecastResolver } from './forecast.resolver.js';
import { ForecastService } from './forecast.service.js';

@Module({
  imports: [OpenMeteoModule],
  providers: [ForecastResolver, ForecastService],
})
export class ForecastModule {}
