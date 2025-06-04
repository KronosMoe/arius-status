import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { CreateStatusPageInput } from './dto/create-status-page.input'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class StatusPageService {
  private logger: Logger = new Logger(StatusPageService.name)

  constructor(private readonly prisma: PrismaService) {}

  async getStatusPageByUserId(userId: string) {
    const statusPages = await this.prisma.statusPages.findMany({
      where: {
        userId,
      },
      include: {
        selectedMonitors: {
          include: {
            monitor: true,
          },
        },
      },
    })

    return statusPages.map((page) => {
      const statusCards = page.selectedMonitors
        .filter((sm) => sm.type === 'card')
        .map((sm) => sm.monitor)

      const statusLines = page.selectedMonitors
        .filter((sm) => sm.type === 'line')
        .map((sm) => sm.monitor)

      return {
        ...page,
        statusCards,
        statusLines,
      }
    })
  }

  async getStatusPageBySlug(slug: string) {
    const statusPage = await this.prisma.statusPages.findUnique({
      where: { slug },
      include: {
        selectedMonitors: {
          include: {
            monitor: true,
          },
        },
      },
    })

    const statusCards = statusPage.selectedMonitors
      .filter((sm) => sm.type === 'card')
      .map((sm) => sm.monitor)

    const statusLines = statusPage.selectedMonitors
      .filter((sm) => sm.type === 'line')
      .map((sm) => sm.monitor)

    return {
      ...statusPage,
      statusCards,
      statusLines,
    }
  }

  async create(userId: string, input: CreateStatusPageInput) {
    const exists = await this.getStatusPageBySlug(input.slug)

    if (exists) {
      throw new BadRequestException('This slug already exists')
    }

    const statusPage = await this.prisma.statusPages.create({
      data: {
        name: input.name,
        logo: input.logo,
        slug: input.slug,
        footerText: input.footerText,
        isFullWidth: input.isFullWidth,
        showOverallStatus: input.showOverallStatus,
        user: { connect: { id: userId } },
        selectedMonitors: {
          create: input.selectedMonitors.map((monitor) => ({
            monitor: { connect: { id: monitor.id } },
            type: monitor.type,
          })),
        },
      },
      include: {
        selectedMonitors: true,
      },
    })

    this.logger.log(`Status page ${statusPage.id} created`)
    return statusPage
  }
}
