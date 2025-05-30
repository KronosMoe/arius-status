import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
  @Field(() => String)
  username: string

  @Field(() => String)
  password: string

  @Field(() => String)
  platform: string
}
