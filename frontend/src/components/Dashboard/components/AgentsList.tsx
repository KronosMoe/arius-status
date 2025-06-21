import type { IAgent } from '@/types/agent'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import DeleteAgentDialog from './DeleteAgentDialog'
import EditAgentForm from './EditAgentForm'
import CopyableAgentId from './CopyableAgentId'
import { dateFnsLocaleMap } from '@/lib/date'
import { useTranslation } from 'react-i18next'

interface AgentsListProps {
  agents: IAgent[]
  refetch: () => void
}

export function AgentsList({ agents, refetch }: AgentsListProps) {
  const { i18n } = useTranslation()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{agent.name}</CardTitle>
              <Badge variant={agent.isOnline ? 'default' : 'secondary'}>{agent.isOnline ? 'Online' : 'Offline'}</Badge>
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
          <CardFooter className="flex justify-end gap-2">
            <EditAgentForm agent={agent} refetch={refetch} />
            <DeleteAgentDialog agentId={agent.id} refetch={refetch} />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
