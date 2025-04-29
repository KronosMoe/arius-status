import { Field, InputType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'

@InputType()
export class CreateNotificationInput {
  @Field(() => String)
  title: string

  @Field(() => String)
  method: string

  @Field(() => String)
  message: string

  @Field(() => GraphQLJSON)
  metadata: any
}
