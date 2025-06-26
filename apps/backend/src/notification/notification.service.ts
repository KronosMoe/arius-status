import { Inject, Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { CreateNotificationInput } from './dto/create-notification.input'
import { Monitor } from 'src/monitors/entities/monitor.entity'
import { UpdateNotificationInput } from './dto/update-notification.input'
import { Agent } from 'src/agents/entities/agent.entity'
import { ClientProxy } from '@nestjs/microservices'
import { Notifications } from '@prisma/client'

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFY_SERVICE') private readonly notifyService: ClientProxy,
  ) {}

  async getNotificationSettingsByUserId(userId: string) {
    const result$ = this.notifyService.send(
      { cmd: 'getNotificationSettingsByUserId' },
      { userId },
    )
    const result = await firstValueFrom(result$)

    return result.map((notification: Notifications) => ({
      ...notification,
      createdAt: new Date(notification.createdAt),
    }))
  }

  async createNotificationSetting(
    createNotificationInput: CreateNotificationInput,
    userId: string,
  ) {
    const result$ = this.notifyService.send(
      { cmd: 'createNotificationSetting' },
      { createNotificationInput, userId },
    )
    const notification = await firstValueFrom(result$)

    return {
      ...notification,
      createdAt: new Date(notification.createdAt),
    }
  }

  async updateNotificationSetting(
    updateNotificationInput: UpdateNotificationInput,
    id: string,
  ) {
    const result$ = this.notifyService.send(
      { cmd: 'updateNotificationSetting' },
      { updateNotificationInput, id },
    )
    const notification = await firstValueFrom(result$)

    return {
      ...notification,
      createdAt: new Date(notification.createdAt),
    }
  }

  async deleteNotificationSetting(id: string) {
    const result$ = this.notifyService.send(
      { cmd: 'deleteNotificationSetting' },
      { id },
    )
    const notification = await firstValueFrom(result$)

    return {
      ...notification,
      createdAt: new Date(notification.createdAt),
    }
  }

  async sendMonitorNotification(
    monitor: Monitor & { userId: string },
    isDown = false,
  ) {
    this.notifyService.emit('sendMonitorNotification', {
      monitor,
      isDown,
    })
  }

  async sendAgentNotification(agent: Agent, userId: string, isDown = false) {
    this.notifyService.emit('sendAgentNotification', {
      agent,
      userId,
      isDown,
    })
  }
}
