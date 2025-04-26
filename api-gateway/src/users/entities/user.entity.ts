import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(() => String)
  id: string

  @Field(() => String)
  username: string

  @Field(() => String)
  email: string

  @Field(() => String)
  image: string
}
