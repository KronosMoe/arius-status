import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateAgentInput } from './dto/create-agent.input'
import { generateToken } from 'src/libs/token'

@Injectable()
export class AgentsService {
  private logger: Logger = new Logger(AgentsService.name)

  constructor(private readonly prisma: PrismaService) {}

  async findAgentsByUserId(userId: string) {
    return await this.prisma.agents.findMany({ where: { userId } })
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

  async deleteAgentById(agentId: string) {
    const monitors = await this.prisma.monitors.findMany({
      where: { agentId },
    })

    if (monitors.length > 0) {
      throw new BadRequestException('This agent has monitors assigned')
    }

    const agent = await this.prisma.agents.delete({ where: { id: agentId } })
    this.logger.log(`Agent ${agentId} deleted`)
    return agent
  }
}
