import { InputType, Field } from '@nestjs/graphql'
import { StatusPageMonitorInput } from './status-page-monitor.input'

@InputType()
export class CreateStatusPageInput {
  @Field(() => String)
  name: string

  @Field(() => String)
  logo: string

  @Field(() => String)
  footerText: string

  @Field(() => Boolean)
  isFullWidth: boolean

  @Field(() => Boolean)
  showOverallStatus: boolean

  @Field(() => String)
  slug: string

  @Field(() => [StatusPageMonitorInput])
  selectedMonitors: StatusPageMonitorInput[]
}
