import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Monitor } from './entities/monitor.entity'
import { CreateMonitorInput } from './dto/create-monitor.input'
import { MonitorGateway } from './monitors.gateway'
import { MonitorAgent } from './entities/monitor-agent.entity'

@Injectable()
export class MonitorsService {
  private logger: Logger = new Logger(MonitorsService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly monitorGateway: MonitorGateway,
  ) {}

  async findMonitorsByUserId(userId: string): Promise<Monitor[]> {
    return await this.prisma.monitors.findMany({
      where: {
        userId,
      },
    })
  }

  async findMonitorById(id: string): Promise<MonitorAgent> {
    return await this.prisma.monitors.findUnique({
      where: {
        id,
      },
      include: {
        agent: true,
      },
    })
  }

  async deleteMonitorById(id: string) {
    const monitor = await this.prisma.monitors.delete({
      where: {
        id,
      },
    })
    this.monitorGateway.stopMonitor(monitor.id)
    this.logger.log(`Monitor ${monitor.id} deleted`)
    return monitor
  }

  async createMonitor(createMonitorInput: CreateMonitorInput, userId: string) {
    const monitor = await this.prisma.monitors.create({
      data: {
        name: createMonitorInput.name,
        address: createMonitorInput.address,
        type: createMonitorInput.type,
        interval: createMonitorInput.interval,
        agentId: createMonitorInput.agentId,
        userId,
      },
    })
    this.monitorGateway.startMonitor(monitor)
    this.logger.log(`Monitor ${monitor.id} created`)
    return monitor
  }
}
