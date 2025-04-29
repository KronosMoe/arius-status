import { Field, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'

@ObjectType()
export class Notification {
  @Field(() => String)
  id: string

  @Field(() => String)
  title: string

  @Field(() => String)
  method: string

  @Field(() => String)
  message: string

  @Field(() => GraphQLJSON)
  metadata: any

  @Field(() => Date)
  createdAt: Date
}
