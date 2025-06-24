import type { IAgent } from '@/types/agent'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import CopyableAgentId from './CopyableAgentId'
import { dateFnsLocaleMap } from '@/lib/date'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AGENT_INFO_PATH } from '@/constants/routes'

interface AgentsListProps {
  agents: IAgent[]
  refetch: () => void
}

export function AgentsList({ agents }: AgentsListProps) {
  const { i18n } = useTranslation()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Link key={agent.id} to={AGENT_INFO_PATH.replace(':agentId', agent.id)}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{agent.name}</CardTitle>
                <Badge variant={agent.isOnline ? 'default' : 'secondary'}>
                  {agent.isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(agent.createdAt), {
                  addSuffix: true,
                  locale: dateFnsLocaleMap[i18n.language] ?? dateFnsLocaleMap['en'],
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">Agent ID</span>
                <CopyableAgentId token={agent.token} />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
