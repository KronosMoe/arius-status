import { Monitor } from 'src/monitors/entities/monitor.entity'
import { StatusPage } from './status-page.entity'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StatusPageExtended extends StatusPage {
  @Field(() => [Monitor])
  statusCards: Monitor[]

  @Field(() => [Monitor])
  statusLines: Monitor[]
}
