import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Setting {
  @Field(() => String)
  id: string

  @Field(() => String)
  theme: string

  @Field(() => String)
  language: string
}
