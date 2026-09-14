import { Args, Query, Resolver } from '@nestjs/graphql';
import { ActivityForecastInput } from './dto/activity-forecast.input.js';
import { ActivityForecastType } from './dto/activity-forecast.type.js';
import { ForecastService } from './forecast.service.js';

@Resolver(() => ActivityForecastType)
export class ForecastResolver {
  constructor(private readonly forecastService: ForecastService) {}

  @Query(() => ActivityForecastType)
  activityForecast(
    @Args('input') input: ActivityForecastInput,
  ): ReturnType<ForecastService['getActivityForecast']> {
    return this.forecastService.getActivityForecast(input.place);
  }
}
