import { Field, ObjectType } from '@nestjs/graphql'
import { Monitor } from './monitor.entity'
import { Agent } from 'src/agents/entities/agent.entity'

@ObjectType()
export class MonitorAgent extends Monitor {
  @Field(() => Agent)
  agent: Agent
}
