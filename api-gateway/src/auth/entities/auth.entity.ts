import { Field, ObjectType } from '@nestjs/graphql'
import { Setting } from 'src/settings/entities/setting.entity'

@ObjectType()
export class Auth {
  @Field(() => String)
  username: string

  @Field(() => String)
  image: string

  @Field(() => Setting)
  settings: Setting
}
