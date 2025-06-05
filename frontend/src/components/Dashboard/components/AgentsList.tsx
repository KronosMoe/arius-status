import type { IAgent } from '@/types/agent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface AgentsListProps {
  agents: IAgent[]
}

export function AgentsList({ agents }: AgentsListProps) {

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{agent.name}</CardTitle>
              <Badge variant={agent.isOnline ? 'default' : 'secondary'}>{agent.isOnline ? 'Online' : 'Offline'}</Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
