import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { SettingsService } from './settings.service'
import { Me } from 'src/auth/decorators/me.decorator'
import { Setting } from './entities/setting.entity'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User } from 'src/users/entities/user.entity'
import { Session } from './entities/session.entity'

@Resolver()
export class SettingsResolver {
  constructor(private readonly settingsService: SettingsService) {}

  @Query(() => Setting)
  @UseGuards(GqlAuthGuard)
  async getSettingsByUserId(@Me() user: User) {
    return await this.settingsService.getSettingsByUserId(user.id)
  }

  @Query(() => [Session])
  @UseGuards(GqlAuthGuard)
  async getSessionsByUserId(@Me() user: User) {
    return await this.settingsService.getSessionsByUserId(user.id)
  }

  @Mutation(() => Setting)
  @UseGuards(GqlAuthGuard)
  async updateTheme(@Args('theme') theme: string, @Me() user: User) {
    return await this.settingsService.updateTheme(theme, user.id)
  }

  @Mutation(() => [Session])
  @UseGuards(GqlAuthGuard)
  async clearSessionsByUserId(@Me() user: User) {
    return await this.settingsService.clearSessionsByUserId(user.id)
  }

  @Mutation(() => Session)
  @UseGuards(GqlAuthGuard)
  async clearSessionById(@Args('id') id: string) {
    return await this.settingsService.clearSessionById(id)
  }
}
