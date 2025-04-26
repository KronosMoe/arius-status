import { Args, Query, Resolver } from '@nestjs/graphql'
import { StatusService } from './status.service'
import { UseGuards } from '@nestjs/common'
import { Status } from './entities/status.entity'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'

@Resolver()
export class StatusResolver {
  constructor(private readonly statusService: StatusService) {}

  @Query(() => [Status])
  @UseGuards(GqlAuthGuard)
  async getStatusByMonitorId(@Args('monitorId') monitorId: string) {
    return await this.statusService.getStatusByMonitorId(monitorId)
  }
}
