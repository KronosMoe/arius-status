import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateAgentInput {
  @Field(() => String)
  name: string
}
