import type { IMonitor } from '@/types/monitor'
import type { IAgent } from '@/types/agent'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { MONITOR_INFO_PATH } from '@/constants/routes'
import { Link } from 'react-router-dom'
import { dateFnsLocaleMap } from '@/lib/date'
import { useTranslation } from 'react-i18next'

interface MonitorsListProps {
  monitors: IMonitor[]
  agents: IAgent[]
}

export function MonitorsList({ monitors, agents }: MonitorsListProps) {
  const { i18n } = useTranslation()

  const badgeBgFilter = (status: string) => {
    switch (status) {
      case 'UP':
        return 'bg-green-600 text-white'
      case 'DOWN':
        return 'bg-red-500 text-white'
      case 'PAUSED':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-zinc-500 text-white'
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {monitors.map((monitor) => {
        const assignedAgent = agents.find((agent) => agent.id === monitor.agentId)

        return (
          <Link key={monitor.id} to={MONITOR_INFO_PATH.replace(':monitorId', monitor.id)}>
            <Card key={monitor.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{monitor.name}</CardTitle>
                  <Badge className={badgeBgFilter(monitor.status)}>{monitor.status}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(monitor.createdAt), {
                    addSuffix: true,
                    locale: dateFnsLocaleMap[i18n.language] ?? dateFnsLocaleMap['en'],
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">URL</span>
                    <span className="max-w-[180px] truncate font-medium">{monitor.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{monitor.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agent</span>
                    <span className="font-medium">{assignedAgent?.name || 'None'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
