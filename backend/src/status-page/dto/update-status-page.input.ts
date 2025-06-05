import { ObjectType } from '@nestjs/graphql'
import { CreateStatusPageInput } from './create-status-page.input'

@ObjectType()
export class UpdateStatusPageInput extends CreateStatusPageInput {}
