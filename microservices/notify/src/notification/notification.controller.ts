import { Controller } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { MessagePattern } from '@nestjs/microservices'
import { Agents, Monitors, Notifications } from '@prisma/client'
import { CreateNotificationInput } from './dto/create-notification.input'
import { UpdateNotificationInput } from './dto/update-notification.input'

@Controller()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @MessagePattern({ cmd: 'getNotificationSettingsByUserId' })
  async getNotificationSettingsByUserId(payload: {
    userId: string
  }): Promise<Notifications[]> {
    return await this.notificationService.getNotificationSettingsByUserId(
      payload.userId,
    )
  }

  @MessagePattern({ cmd: 'createNotificationSetting' })
  async createNotificationSetting(payload: {
    createNotificationInput: CreateNotificationInput
    userId: string
  }): Promise<Notifications> {
    return await this.notificationService.createNotificationSetting(
      payload.createNotificationInput,
      payload.userId,
    )
  }

  @MessagePattern({ cmd: 'updateNotificationSetting' })
  async updateNotificationSetting(payload: {
    updateNotificationInput: UpdateNotificationInput
    id: string
  }): Promise<Notifications> {
    return await this.notificationService.updateNotificationSetting(
      payload.updateNotificationInput,
      payload.id,
    )
  }

  @MessagePattern({ cmd: 'deleteNotificationSetting' })
  async deleteNotificationSetting(payload: {
    id: string
  }): Promise<Notifications> {
    return await this.notificationService.deleteNotificationSetting(payload.id)
  }

  @MessagePattern({ cmd: 'sendMonitorNotification' })
  async sendMonitorNotification(payload: {
    monitor: Monitors
    isDown: boolean
  }): Promise<void> {
    return await this.notificationService.sendMonitorNotification(
      payload.monitor,
      payload.isDown,
    )
  }

  @MessagePattern({ cmd: 'sendAgentNotification' })
  async sendAgentNotification(payload: {
    agent: Agents
    userId: string
    isDown: boolean
  }): Promise<void> {
    return await this.notificationService.sendAgentNotification(
      payload.agent,
      payload.userId,
      payload.isDown,
    )
  }
}
