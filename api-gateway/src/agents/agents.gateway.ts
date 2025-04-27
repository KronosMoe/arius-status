import { Logger } from '@nestjs/common'
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { NotificationService } from 'src/notification/notification.service'
import { PrismaService } from 'src/prisma/prisma.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AgentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private logger: Logger = new Logger(AgentsGateway.name)

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token

    if (!token) {
      this.logger.log('Client missing token, disconnecting')
      client.disconnect()
      return
    }

    const agent = await this.prisma.agents.findUnique({
      where: { token },
    })

    if (!agent) {
      this.logger.log(`Invalid agent token: ${token}, disconnecting`)
      client.disconnect()
      return
    }

    this.logger.log(`Agent connected: ${agent.id}`)
    client.data.agentId = agent.id

    client.join(agent.id)

    await this.prisma.agents.update({
      where: { id: agent.id },
      data: { isOnline: true },
    })

    setInterval(() => {
      client.emit('health-check')
    }, 30000)
  }

  async handleDisconnect(client: Socket) {
    const agentId = client.data.agentId
    if (agentId) {
      this.logger.log(`❌ Agent disconnected: ${agentId}`)

      await this.prisma.agents.update({
        where: { id: agentId },
        data: { isOnline: false },
      })
    }
  }

  @SubscribeMessage('health-response')
  handleHealthResponse(
    @MessageBody() data: { status: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `🩺 Health response from agent ${client.data.agentId}: ${data.status}`,
    )
  }

  @SubscribeMessage('command-result')
  async handleCommandResult(
    @MessageBody()
    data: {
      monitorId: string
      responseTime: number
      metadata: any
    },
  ) {
    const latestStatus = await this.prisma.statusResults.findFirst({
      where: { monitorId: data.monitorId },
      orderBy: { createdAt: 'desc' },
    })
    const monitor = await this.prisma.monitors.findUnique({
      where: { id: data.monitorId },
    })

    if (
      latestStatus &&
      latestStatus.responseTime !== -1 &&
      data.responseTime === -1
    ) {
      this.notificationService.sendDiscordNotification({
        embeds: [
          {
            title: `Your service ${monitor.name} is down`,
            description: `**Service Name**\n${monitor.name}\n\n**Service Address**\n${monitor.address}\n\n**Time**\n${new Date()}`,
            color: 16726072,
            footer: {
              text: '©2025 Arius Statuspage',
            },
          },
        ],
      })
    }

    if (
      latestStatus &&
      latestStatus.responseTime === -1 &&
      data.responseTime !== -1
    ) {
      this.notificationService.sendDiscordNotification({
        embeds: [
          {
            title: `Your service ${monitor.name} is up`,
            description: `**Service Name**\n${monitor.name}\n\n**Service Address**\n${monitor.address}\n\n**Time**\n${new Date()}`,
            color: 9240460,
            footer: {
              text: '©2025 Arius Statuspage',
            },
          },
        ],
      })
    }

    await this.prisma.statusResults.create({
      data: {
        monitorId: data.monitorId,
        responseTime: data.responseTime,
        metadata: data.metadata,
      },
    })
  }
}
