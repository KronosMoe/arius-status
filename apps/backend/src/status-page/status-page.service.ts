import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateStatusPageInput } from './dto/create-status-page.input'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateStatusPageInput } from './dto/update-status-page.input'

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
      .sort((a, b) => a.index - b.index)
      .map((sm) => sm.monitor)

    const statusLines = statusPage.selectedMonitors
      .filter((sm) => sm.type === 'line')
      .sort((a, b) => a.index - b.index)
      .map((sm) => sm.monitor)

    return {
      ...statusPage,
      statusCards,
      statusLines,
    }
  }

  async getStatusPageById(id: string) {
    const statusPage = await this.prisma.statusPages.findUnique({
      where: { id },
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
      .sort((a, b) => a.index - b.index)
      .map((sm) => sm.monitor)

    const statusLines = statusPage.selectedMonitors
      .filter((sm) => sm.type === 'line')
      .sort((a, b) => a.index - b.index)
      .map((sm) => sm.monitor)

    return {
      ...statusPage,
      statusCards,
      statusLines,
    }
  }

  async create(userId: string, input: CreateStatusPageInput) {
    const exiting = await this.prisma.statusPages.findMany({
      where: { slug: input.slug },
      include: { selectedMonitors: true },
    })

    if (exiting.length > 0) {
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
            index: monitor.index,
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

  async update(id: string, input: UpdateStatusPageInput) {
    const exiting = await this.prisma.statusPages.findUnique({
      where: { slug: input.slug },
      include: { selectedMonitors: true },
    })

    if (exiting && exiting.id !== id) {
      throw new BadRequestException('This slug already exists')
    }

    await this.prisma.statusPageMonitor.deleteMany({
      where: { statusPageId: id },
    })

    if (!input.selectedMonitors) {
      throw new BadRequestException('You must select at least one monitor')
    }

    const statusPage = await this.prisma.statusPages.update({
      where: { id },
      data: {
        name: input.name,
        logo: input.logo,
        slug: input.slug,
        footerText: input.footerText,
        isFullWidth: input.isFullWidth,
        showOverallStatus: input.showOverallStatus,
        selectedMonitors: {
          create: input.selectedMonitors.map((monitor) => ({
            monitor: { connect: { id: monitor.id } },
            type: monitor.type,
            index: monitor.index,
          })),
        },
      },
      include: {
        selectedMonitors: {
          include: { monitor: true },
        },
      },
    })

    this.logger.log(`Status page ${statusPage.id} updated`)
    return statusPage
  }

  async delete(id: string) {
    const statusPage = await this.prisma.statusPages.findUnique({
      where: { id },
      include: { selectedMonitors: true },
    })

    if (!statusPage) {
      throw new NotFoundException(`Status page with id ${id} not found`)
    }

    await this.prisma.statusPageMonitor.deleteMany({
      where: { statusPageId: id },
    })

    await this.prisma.statusPages.delete({
      where: { id },
    })

    this.logger.log(`Status page ${statusPage.id} deleted`)
    return statusPage
  }
}
