import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { NotificationService } from './notification.service'
import { UseGuards } from '@nestjs/common'
import { Notification } from './entities/notification.entity'
import { Me } from 'src/auth/decorators/me.decorator'
import { User } from 'src/users/entities/user.entity'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { CreateNotificationInput } from './dto/create-notification.input'

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => [Notification])
  @UseGuards(GqlAuthGuard)
  async getNotificationSettingsByUserId(@Me() user: User) {
    return this.notificationService.getNotificationSettingsByUserId(user.id)
  }

  @Mutation(() => Notification)
  @UseGuards(GqlAuthGuard)
  async createNotificationSetting(
    @Args('createNotificationInput')
    createNotificationInput: CreateNotificationInput,
    @Me() user: User,
  ) {
    return this.notificationService.createNotificationSetting(
      createNotificationInput,
      user.id,
    )
  }
}
