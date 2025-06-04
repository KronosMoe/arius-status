import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { MonitorsService } from './monitors.service'
import { Monitor } from './entities/monitor.entity'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { Me } from 'src/auth/decorators/me.decorator'
import { UseGuards } from '@nestjs/common'
import { User } from 'src/users/entities/user.entity'
import { CreateMonitorInput } from './dto/create-monitor.input'
import { MonitorAgent } from './entities/monitor-agent.entity'
import { UpdateMonitorInput } from './dto/update-monitor.input'

@Resolver()
export class MonitorsResolver {
  constructor(private readonly monitorsService: MonitorsService) {}

  @Query(() => [Monitor])
  @UseGuards(GqlAuthGuard)
  async findMonitorsByUserId(@Me() user: User): Promise<Monitor[]> {
    return await this.monitorsService.findMonitorsByUserId(user.id)
  }

  @Query(() => MonitorAgent)
  async findMonitorById(@Args('id') id: string): Promise<MonitorAgent> {
    return await this.monitorsService.findMonitorById(id)
  }

  @Mutation(() => MonitorAgent)
  @UseGuards(GqlAuthGuard)
  async pauseMonitorById(@Args('id') id: string): Promise<MonitorAgent> {
    return await this.monitorsService.pauseMonitorById(id)
  }

  @Mutation(() => MonitorAgent)
  @UseGuards(GqlAuthGuard)
  async resumeMonitorById(@Args('id') id: string): Promise<MonitorAgent> {
    return await this.monitorsService.resumeMonitorById(id)
  }

  @Mutation(() => Monitor)
  @UseGuards(GqlAuthGuard)
  async deleteMonitorById(@Args('id') id: string): Promise<Monitor> {
    return await this.monitorsService.deleteMonitorById(id)
  }

  @Mutation(() => Monitor)
  @UseGuards(GqlAuthGuard)
  async updateMonitorById(
    @Args('id') id: string,
    @Args('updateMonitorInput') updateMonitorInput: UpdateMonitorInput,
  ): Promise<Monitor> {
    return await this.monitorsService.updateMonitorById(id, updateMonitorInput)
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
