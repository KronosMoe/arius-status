import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { PingGateway } from './ping.gateway'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class PingCronService implements OnModuleInit {
  private readonly logger = new Logger(PingCronService.name)

  private intervals = new Map<number, NodeJS.Timeout>()

  constructor(
    private readonly prisma: PrismaService,
    private readonly pingGateway: PingGateway,
  ) {}

  async onModuleInit() {
    await this.setupUserCronJobs()
  }

  private async setupUserCronJobs() {
    const users = await this.prisma.user.findMany({
      include: { agents: true },
    })

    for (const user of users) {
      this.scheduleUserPing(user.id, user.ping_interval, user.agents)
    }
  }

  private scheduleUserPing(
    userId: number,
    intervalSeconds: number,
    agents: { id: number; address: string }[],
  ) {
    const intervalMs = intervalSeconds * 1000

    if (this.intervals.has(userId)) {
      clearInterval(this.intervals.get(userId))
    }

    const intervalHandle = setInterval(async () => {
      for (const agent of agents) {
        const socket = this.pingGateway.getAgentSocket(agent.id)
        if (!socket) {
          this.logger.warn(
            `Agent ${agent.id} for user ${userId} is disconnected`,
          )
          continue
        }

        try {
          const result = await this.pingGateway.sendPingToAgentWithResult(
            socket.id,
            agent.address,
          )
          this.logger.log(
            `Ping result from agent ${agent.id}: ${JSON.stringify(result)}`,
          )
        } catch (err) {
          this.logger.error(`Ping failed for agent ${agent.id}: ${err.message}`)
        }
      }
    }, intervalMs)

    this.intervals.set(userId, intervalHandle)
    this.logger.log(
      `Scheduled ping for user ${userId} every ${intervalSeconds} seconds`,
    )
  }
}
