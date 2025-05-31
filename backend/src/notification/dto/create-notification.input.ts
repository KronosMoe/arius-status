import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateNotificationInput {
  @Field(() => String)
  title: string

  @Field(() => String)
  method: string

  @Field(() => String)
  message: string

  @Field(() => String, { nullable: true })
  webhookUrl?: string

  @Field(() => String, { nullable: true })
  content?: string
}
