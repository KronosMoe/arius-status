import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class RegisterInput {
  @Field(() => String)
  username: string

  @Field(() => String)
  email: string

  @Field(() => String)
  password: string
}
