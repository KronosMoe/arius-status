import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { StatusPageService } from './status-page.service'
import { StatusPage } from './entities/status-page.entity'
import { CreateStatusPageInput } from './dto/create-status-page.input'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { Me } from 'src/auth/decorators/me.decorator'
import { User } from 'src/users/entities/user.entity'
import { StatusPageExtended } from './entities/status-page-extended.entity'

@Resolver(() => StatusPage)
export class StatusPageResolver {
  constructor(private readonly statusPageService: StatusPageService) {}

  @Query(() => [StatusPageExtended])
  @UseGuards(GqlAuthGuard)
  async getStatusPagesByUserId(
    @Me() user: User,
  ): Promise<StatusPageExtended[]> {
    return await this.statusPageService.getStatusPageByUserId(user.id)
  }

  @Query(() => StatusPageExtended)
  async getStatusPageBySlug(
    @Args('slug') slug: string,
  ): Promise<StatusPageExtended> {
    return await this.statusPageService.getStatusPageBySlug(slug)
  }

  @Query(() => StatusPageExtended)
  async getStatusPageById(@Args('id') id: string): Promise<StatusPageExtended> {
    return await this.statusPageService.getStatusPageById(id)
  }

  @Mutation(() => StatusPage)
  @UseGuards(GqlAuthGuard)
  async createStatusPage(
    @Args('input') input: CreateStatusPageInput,
    @Me() user: User,
  ) {
    return await this.statusPageService.create(user.id, input)
  }

  @Mutation(() => StatusPage)
  @UseGuards(GqlAuthGuard)
  async updateStatusPage(
    @Args('id') id: string,
    @Args('input') input: CreateStatusPageInput,
  ) {
    return await this.statusPageService.update(id, input)
  }

  @Mutation(() => StatusPage)
  @UseGuards(GqlAuthGuard)
  async deleteStatusPage(@Args('id') id: string) {
    return await this.statusPageService.delete(id)
  }
}
