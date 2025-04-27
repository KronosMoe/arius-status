import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { MonitorsService } from './monitors.service'
import { Monitor } from './entities/monitor.entity'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { Me } from 'src/auth/decorators/me.decorator'
import { UseGuards } from '@nestjs/common'
import { User } from 'src/users/entities/user.entity'
import { CreateMonitorInput } from './dto/create-monitor.input'
import { MonitorAgent } from './entities/monitor-agent.entity'

@Resolver()
export class MonitorsResolver {
  constructor(private readonly monitorsService: MonitorsService) {}

  @Query(() => [Monitor])
  @UseGuards(GqlAuthGuard)
  async findMonitorsByUserId(@Me() user: User): Promise<Monitor[]> {
    return await this.monitorsService.findMonitorsByUserId(user.id)
  }

  @Query(() => MonitorAgent)
  @UseGuards(GqlAuthGuard)
  async findMonitorById(@Args('id') id: string): Promise<MonitorAgent> {
    return await this.monitorsService.findMonitorById(id)
  }

  @Mutation(() => Monitor)
  @UseGuards(GqlAuthGuard)
  async createMonitor(
    @Args('createMonitorInput') createMonitorInput: CreateMonitorInput,
    @Me() user: User,
  ): Promise<Monitor> {
    return await this.monitorsService.createMonitor(createMonitorInput, user.id)
  }
}
