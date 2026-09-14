import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ActivityScoreType {
  @Field(() => Int)
  score: number;

  @Field(() => [String])
  reasons: string[];
}

@ObjectType()
export class LocationType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field({ nullable: true })
  country?: string;
}

@ObjectType()
export class SurfingForecastType {
  @Field()
  available: boolean;

  @Field(() => Int, { nullable: true })
  score?: number;

  @Field(() => [String], { nullable: true })
  reasons?: string[];

  @Field({ nullable: true })
  bestHour?: string;

  @Field({ nullable: true })
  unavailableReason?: string;
}

@ObjectType()
export class DailyActivityForecastType {
  @Field()
  date: string;

  @Field(() => ActivityScoreType)
  skiing: ActivityScoreType;

  @Field(() => ActivityScoreType)
  outdoorSightseeing: ActivityScoreType;

  @Field(() => ActivityScoreType)
  indoorSightseeing: ActivityScoreType;

  @Field(() => SurfingForecastType)
  surfing: SurfingForecastType;
}

@ObjectType()
export class ActivityForecastType {
  @Field(() => LocationType)
  location: LocationType;

  @Field(() => [DailyActivityForecastType])
  days: DailyActivityForecastType[];
}
