import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class StatusPageMonitorInput {
  @Field(() => String)
  id: string

  @Field(() => String)
  type: string
}
