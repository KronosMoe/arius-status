import { Injectable, Logger } from '@nestjs/common'
import { PingGateway } from './ping.gateway'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class PingService {
  private readonly logger = new Logger(PingService.name)

  constructor(
    private readonly gateway: PingGateway,
    private readonly prisma: PrismaService,
  ) {}

  async handleUserPings() {
    const users = await this.prisma.user.findMany({
      include: {
        agents: true,
      },
    })

    for (const user of users) {
      const pingInterval = user.ping_interval || 300000

      this.schedulePingForUser(user.id, pingInterval)
    }
  }

  private schedulePingForUser(userId: number, interval: number) {
    setInterval(async () => {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { agents: true },
      })

      if (!user || user.agents.length === 0) {
        this.logger.warn(`No agents found for user ${userId}`)
        return
      }

      for (const agent of user.agents) {
        this.logger.log(`Pinging agent ${agent.id} for user ${userId}`)
        try {
          await this.gateway.sendPingToAgentWithResult(
            String(agent.id),
            agent.address,
          )
        } catch (error) {
          this.logger.error(
            `Ping failed for agent ${agent.id} (user ${userId}): ${error.message}`,
          )
        }
      }
    }, interval)
  }
}
