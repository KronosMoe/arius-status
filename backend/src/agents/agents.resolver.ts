import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AgentsService } from './agents.service'
import { Agent } from './entities/agent.entity'
import { Me } from 'src/auth/decorators/me.decorator'
import { User } from 'src/users/entities/user.entity'
import { CreateAgentInput } from './dto/create-agent.input'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'

@Resolver()
export class AgentsResolver {
  constructor(private readonly agentsService: AgentsService) {}

  @Query(() => Agent)
  @UseGuards(GqlAuthGuard)
  async getAgentById(@Args('id') agentId: string, @Me() user: User) {
    return await this.agentsService.getAgentById(agentId, user.id)
  }

  @Query(() => [Agent])
  @UseGuards(GqlAuthGuard)
  async findAgentsByUserId(@Me() user: User) {
    return await this.agentsService.findAgentsByUserId(user.id)
  }

  @Query(() => String)
  async getAgentLatestTag() {
    return await this.agentsService.getAgentLatestTag()
  }

  @Mutation(() => Agent)
  @UseGuards(GqlAuthGuard)
  async renameAgentById(
    @Args('id') agentId: string,
    @Args('name') name: string,
  ) {
    return await this.agentsService.renameAgentById(agentId, name)
  }

  @Mutation(() => Agent)
  @UseGuards(GqlAuthGuard)
  async createAgent(
    @Args('createAgentInput') createAgentInput: CreateAgentInput,
    @Me() user: User,
  ) {
    return await this.agentsService.createAgent(createAgentInput, user.id)
  }

  @Mutation(() => Agent)
  @UseGuards(GqlAuthGuard)
  async deleteAgentById(@Args('id') agentId: string) {
    return await this.agentsService.deleteAgentById(agentId)
  }
}
