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

  constructor(private prisma: PrismaService) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token

    if (!token) {
      this.logger.log('⚠️ Client missing token, disconnecting')
      client.disconnect()
      return
    }

    const agent = await this.prisma.agents.findUnique({
      where: { token },
    })

    if (!agent) {
      this.logger.log(`⚠️ Invalid agent token: ${token}, disconnecting`)
      client.disconnect()
      return
    }

    this.logger.log(`✅ Agent connected: ${agent.id}`)
    client.data.agentId = agent.id

    // 🆕 JOIN room named after agent.id
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
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `🏃 Received result from ${client.id} for monitor ${data.monitorId}`,
    )
    await this.prisma.statusResults.create({
      data: {
        monitorId: data.monitorId,
        responseTime: data.responseTime,
        metadata: data.metadata,
      },
    })
  }
}
