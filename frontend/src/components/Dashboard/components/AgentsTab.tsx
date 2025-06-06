import type { IAgent } from '@/types/agent'
import { AgentsSkeletonList } from './AgentsSkeletonList'
import { EmptyState } from './EmptyState'
import { AgentsList } from './AgentsList'
import CreateAgentForm from './CreateAgentForm'

interface AgentsTabProps {
  agents: IAgent[]
  setAgents: React.Dispatch<React.SetStateAction<IAgent[]>>
  isLoading?: boolean
  refetch: () => void
}

export function AgentsTab({ agents, setAgents, isLoading = false, refetch }: AgentsTabProps) {
  if (isLoading) {
    return <AgentsSkeletonList />
  }

  if (agents.length === 0) {
    return (
      <EmptyState
        title="No agents found"
        description="Create your first agent to start monitoring your services."
        action={<CreateAgentForm agents={agents} setAgents={setAgents} />}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Your Agents</h2>
        <CreateAgentForm agents={agents} setAgents={setAgents} />
      </div>
      <AgentsList agents={agents} refetch={refetch} />
    </div>
  )
}
