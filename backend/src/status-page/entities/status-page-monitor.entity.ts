import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StatusPageMonitor {
  @Field(() => String)
  id: string

  @Field(() => String)
  monitorId: string

  @Field(() => String)
  type: string

  @Field(() => Date)
  createdAt: Date
}
