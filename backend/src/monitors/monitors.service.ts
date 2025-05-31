import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Monitor } from './entities/monitor.entity'
import { CreateMonitorInput } from './dto/create-monitor.input'
import { MonitorGateway } from '../gateway/monitors.gateway'
import { MonitorAgent } from './entities/monitor-agent.entity'
import { UpdateMonitorInput } from './dto/update-monitor.input'

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
    const monitor = await this.prisma.monitors.findUnique({
      where: {
        id,
      },
      include: {
        agent: true,
      },
    })

    if (!monitor) {
      throw new NotFoundException('Monitor not found')
    }

    return monitor
  }

  async pauseMonitorById(id: string) {
    const monitor = await this.prisma.monitors.update({
      where: {
        id,
      },
      data: {
        status: 'PAUSED',
      },
      include: {
        agent: true,
      },
    })
    this.monitorGateway.stopMonitor(monitor.id)
    this.logger.log(`Monitor ${monitor.id} paused`)
    return monitor
  }

  async resumeMonitorById(id: string) {
    const monitor = await this.prisma.monitors.update({
      where: {
        id,
      },
      data: {
        status: 'UNKNOWN',
      },
      include: {
        agent: true,
      },
    })
    this.monitorGateway.startMonitor(monitor)
    this.logger.log(`Monitor ${monitor.id} resumed`)
    return monitor
  }

  async deleteMonitorById(id: string) {
    this.monitorGateway.stopMonitor(id)
    await this.prisma.statusResults.deleteMany({
      where: {
        monitorId: id,
      },
    })

    const monitor = await this.prisma.monitors.delete({
      where: {
        id,
      },
    })
    this.logger.log(`Monitor ${monitor.id} deleted`)
    return monitor
  }

  async updateMonitorById(id: string, updateMonitorInput: UpdateMonitorInput) {
    this.monitorGateway.stopMonitor(id)

    const monitor = await this.prisma.monitors.update({
      where: { id },
      data: {
        name: updateMonitorInput.name,
        address: updateMonitorInput.address,
        type: updateMonitorInput.type,
        interval: updateMonitorInput.interval,
        status: 'UNKNOWN',
      },
    })

    this.monitorGateway.startMonitor(monitor)
    this.logger.log(`Monitor ${monitor.id} updated`)
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
