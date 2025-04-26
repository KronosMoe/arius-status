import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Monitor } from './entities/monitor.entity'
import { CreateMonitorInput } from './dto/create-monitor.input'
import { MonitorGateway } from './monitors.gateway'

@Injectable()
export class MonitorsService {
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

    return monitor
  }
}
