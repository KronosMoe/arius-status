import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Monitor {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  address: string

  @Field(() => String)
  type: string

  @Field(() => String)
  agentId: string

  @Field(() => Int)
  interval: number

  @Field(() => Date)
  createdAt: Date
}
