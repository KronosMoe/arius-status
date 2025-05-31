import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Session {
  @Field(() => String)
  id: string

  @Field(() => String)
  platform: string

  @Field(() => String)
  deviceIP: string

  @Field(() => Date)
  expires: Date

  @Field(() => Date)
  createdAt: Date
}
