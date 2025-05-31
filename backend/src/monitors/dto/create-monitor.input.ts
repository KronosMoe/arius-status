import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateMonitorInput {
  @Field(() => String)
  name: string

  @Field(() => String)
  address: string

  @Field(() => String)
  type: string

  @Field(() => Number)
  interval: number

  @Field(() => String)
  agentId: string
}
