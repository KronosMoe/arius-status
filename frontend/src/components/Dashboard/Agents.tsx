import { IAgent } from '@/types/agent'
import CreateAgentForm from './components/CreateAgentForm'
import { Separator } from '../ui/separator'
import { Clock, Server } from 'lucide-react'
import { Badge } from '../ui/badge'
import { formatDistanceToNow } from 'date-fns'

type Props = {
  agents: IAgent[]
  setAgents: React.Dispatch<React.SetStateAction<IAgent[]>>
}

export default function Agents({ agents, setAgents }: Props) {
  const AgentsList = () => {
    return (
      <div>
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex flex-row items-end justify-between rounded-md border p-4 dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="flex flex-row items-center gap-4">
              <Server size={50} />
              <div>
                <div className="text-xl">{agent.name}</div>
                <div className="flex flex-row items-center gap-2">
                  <Badge className={`${agent.isOnline ? 'bg-green-400' : 'bg-red-400'} text-black`}>
                    {agent.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-zinc-500 dark:text-zinc-300">
                    token: {agent.token}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 text-xs text-zinc-500">
              <Clock size={16} />
              {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="my-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agents</h1>
        <CreateAgentForm agents={agents} setAgents={setAgents} />
      </div>
      <Separator />
      <div className="mt-4">{agents.length > 0 ? <AgentsList /> : <div>No data</div>}</div>
    </div>
  )
}
