import { Matches } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ActivityForecastInput {
  @Field()
  @Matches(/\p{L}/u, {
    message: 'Place must contain at least one letter',
  })
  place: string;
}
