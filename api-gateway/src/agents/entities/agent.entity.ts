import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Agent {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  token: string

  @Field(() => Boolean)
  isOnline: boolean
}
