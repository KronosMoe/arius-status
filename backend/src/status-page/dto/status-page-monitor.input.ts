import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class StatusPageMonitorInput {
  @Field(() => String)
  id: string

  @Field(() => String)
  type: string

  @Field(() => Int)
  index: number
}
