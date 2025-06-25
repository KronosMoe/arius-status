import { Field, ObjectType } from '@nestjs/graphql'

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

  @Field(() => Date)
  createdAt: Date

  @Field(() => Boolean)
  isDefault: boolean

  @Field(() => String, { nullable: true })
  webhookUrl?: string

  @Field(() => String, { nullable: true })
  content?: string
}
