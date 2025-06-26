import { ObjectType, Field } from '@nestjs/graphql'
import { StatusPageMonitor } from './status-page-monitor.entity'

@ObjectType()
export class StatusPage {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  slug: string

  @Field(() => String)
  logo: string

  @Field(() => String)
  footerText: string

  @Field(() => Boolean)
  isFullWidth: boolean

  @Field(() => Boolean)
  showOverallStatus: boolean

  @Field(() => Date)
  createdAt: Date

  @Field(() => [StatusPageMonitor])
  selectedMonitors: StatusPageMonitor[]
}
