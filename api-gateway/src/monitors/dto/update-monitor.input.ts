import { Field, InputType } from '@nestjs/graphql'

// Use Exclude to define the type
@InputType()
export class UpdateMonitorInput {
  @Field(() => String)
  name: string

  @Field(() => String)
  address: string

  @Field(() => String)
  type: string

  @Field(() => Number)
  interval: number
}
