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
  path: '/api/agents',
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

    const updatedAgent = await this.prisma.agents.update({
      where: { id: agent.id },
      data: { isOnline: true },
    })

    if (!agent.isOnline && updatedAgent.isOnline) {
      this.notificationService.sendAgentNotification(agent, agent.userId, false)
    }

    setInterval(() => {
      client.emit('health-check')
    }, 3600000)
  }

  async handleDisconnect(client: Socket) {
    const agentId = client.data.agentId
    if (agentId) {
      this.logger.log(`Agent disconnected: ${agentId}`)

      const agent = await this.prisma.agents.update({
        where: { id: agentId },
        data: { isOnline: false },
      })

      await this.notificationService.sendAgentNotification(
        agent,
        agent.userId,
        true,
      )
    }
  }

  @SubscribeMessage('health-response')
  handleHealthResponse(
    @MessageBody() data: { status: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `Health response from agent ${client.data.agentId}: ${data.status}`,
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

    await this.prisma.monitors.update({
      where: { id: data.monitorId },
      data: { status: data.responseTime === -1 ? 'DOWN' : 'UP' },
    })

    if (
      latestStatus &&
      latestStatus.responseTime !== -1 &&
      data.responseTime === -1
    ) {
      await this.notificationService.sendMonitorNotification(monitor, true)
      this.logger.log(`Monitor ${monitor.id} is down, notifying...`)
    }

    if (
      latestStatus &&
      latestStatus.responseTime === -1 &&
      data.responseTime !== -1
    ) {
      await this.notificationService.sendMonitorNotification(monitor, false)
      this.logger.log(`Monitor ${monitor.id} is up, notifying...`)
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
