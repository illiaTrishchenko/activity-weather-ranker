import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ActivityForecastInput {
  @Field()
  place: string;
}
