import { Args, Query, Resolver } from '@nestjs/graphql'
import { StatusService } from './status.service'
import { UseGuards } from '@nestjs/common'
import { Status } from './entities/status.entity'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'

@Resolver()
export class StatusResolver {
  constructor(private readonly statusService: StatusService) {}

  @Query(() => [Status])
  async getStatusByMonitorId(
    @Args('monitorId') monitorId: string,
    @Args('barCount', { defaultValue: 60 }) barCount: number = 60,
  ) {
    return await this.statusService.getStatusByMonitorId(monitorId, barCount)
  }

  @Query(() => Status)
  async getLatestStatusByMonitorId(@Args('monitorId') monitorId: string) {
    return await this.statusService.getLatestStatusByMonitorId(monitorId)
  }

  @Query(() => String)
  async getOverallStatus(
    @Args('monitorIds', { type: () => [String] }) monitorIds: string[],
  ) {
    return await this.statusService.getOverallStatus(monitorIds)
  }

  @Query(() => [Status])
  @UseGuards(GqlAuthGuard)
  async getStatusByTimeRange(
    @Args('from') from: Date,
    @Args('to') to: Date,
    @Args('monitorId') monitorId: string,
  ) {
    return await this.statusService.getStatusByTimeRange(monitorId, from, to)
  }
}
