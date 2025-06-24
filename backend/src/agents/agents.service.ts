import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateAgentInput } from './dto/create-agent.input'
import { generateToken } from 'src/libs/token'
import axios from 'axios'

@Injectable()
export class AgentsService {
  private logger: Logger = new Logger(AgentsService.name)

  constructor(private readonly prisma: PrismaService) {}

  async getAgentById(agentId: string, userId: string) {
    const agent = await this.prisma.agents.findUnique({
      where: { id: agentId },
    })

    if (!agent) {
      throw new NotFoundException('Agent not found')
    }

    if (agent.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to access this agent',
      )
    }

    return agent
  }

  async findAgentsByUserId(userId: string) {
    const agents = await this.prisma.agents.findMany({ where: { userId } })

    if (!agents) {
      throw new NotFoundException('Agent not found')
    }

    return agents
  }

  async createAgent(createAgentInput: CreateAgentInput, userId: string) {
    const token = generateToken()
    const agent = await this.prisma.agents.create({
      data: {
        name: createAgentInput.name,
        token,
        userId,
      },
    })

    this.logger.log(`Agent ${agent.name} created`)

    return agent
  }

  async renameAgentById(agentId: string, name: string) {
    const agent = await this.prisma.agents.update({
      where: { id: agentId },
      data: { name },
    })
    this.logger.log(
      `Agent ${agent.name} with ID ${agent.id} renamed to ${name}`,
    )
    return agent
  }

  async deleteAgentById(agentId: string) {
    const monitors = await this.prisma.monitors.findMany({
      where: { agentId },
    })

    if (monitors.length > 0) {
      throw new BadRequestException(
        'This agent has monitors assigned, delete them first',
      )
    }

    const agent = await this.prisma.agents.delete({ where: { id: agentId } })
    this.logger.log(`Agent ${agentId} deleted`)
    return agent
  }

  async getAgentLatestTag(): Promise<string | null> {
    const url =
      'https://registry.hub.docker.com/v2/repositories/mirailisc/arius-status-agent/tags?page_size=100'
    const { data } = await axios.get(url)

    const tags = data.results
      .filter((tag: any) => tag.name !== 'latest')
      .map((tag: any) => ({
        name: tag.name,
        tag_last_pushed: tag.tag_last_pushed,
      }))

    if (tags.length === 0) {
      return null
    }

    tags.sort(
      (a: any, b: any) =>
        new Date(b.tag_last_pushed).getTime() -
        new Date(a.tag_last_pushed).getTime(),
    )

    return tags[0].name
  }
}
