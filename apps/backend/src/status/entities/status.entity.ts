import { Field, Float, ObjectType } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-type-json'

@ObjectType()
export class Status {
  @Field(() => String)
  id: string

  @Field(() => Float)
  responseTime: number

  @Field(() => GraphQLJSON)
  metadata: any

  @Field(() => Date)
  createdAt: Date
}
