'use client'

import type { IMonitor } from '@/types/monitor'
import type { IAgent } from '@/types/agent'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, Filter } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { MONITOR_INFO_PATH } from '@/constants/routes'
import { Link } from 'react-router-dom'
import { dateFnsLocaleMap } from '@/lib/date'
import { useTranslation } from 'react-i18next'
import { useState, useMemo } from 'react'

interface MonitorsListProps {
  monitors: IMonitor[]
  agents: IAgent[]
}

export function MonitorsList({ monitors, agents }: MonitorsListProps) {
  const { i18n, t } = useTranslation()

  // Filter states
  const [selectedAgent, setSelectedAgent] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

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

  // Get unique values for filter options
  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(monitors.map((monitor) => monitor.status)))
  }, [monitors])

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(monitors.map((monitor) => monitor.type)))
  }, [monitors])

  // Filter monitors based on selected filters
  const filteredMonitors = useMemo(() => {
    return monitors.filter((monitor) => {
      const agentMatch = selectedAgent === 'all' || monitor.agentId === selectedAgent
      const statusMatch = selectedStatus === 'all' || monitor.status === selectedStatus
      const typeMatch = selectedType === 'all' || monitor.type === selectedType

      return agentMatch && statusMatch && typeMatch
    })
  }, [monitors, selectedAgent, selectedStatus, selectedType])

  // Reset all filters
  const resetFilters = () => {
    setSelectedAgent('all')
    setSelectedStatus('all')
    setSelectedType('all')
  }

  // Check if any filters are active
  const hasActiveFilters = selectedAgent !== 'all' || selectedStatus !== 'all' || selectedType !== 'all'

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <span className="text-sm font-medium">{t('dashboard.filter.title')}</span>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-muted-foreground hover:text-foreground text-xs underline">
              {t('dashboard.filter.clear.button')}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          {/* Agent Filter */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground min-w-[50px] text-sm">{t('dashboard.filter.agent.label')}:</span>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('dashboard.filter.agent.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboard.filter.agent.default')}</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground min-w-[50px] text-sm">{t('dashboard.filter.status.label')}:</span>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t('dashboard.filter.status.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboard.filter.status.default')}</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground min-w-[50px] text-sm">{t('dashboard.filter.type.label')}:</span>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t('dashboard.filter.type.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboard.filter.type.default')}</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>{t('dashboard.filter.show', { count: filteredMonitors.length, total: monitors.length })}</span>
        {hasActiveFilters && (
          <span className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            {t('dashboard.filter.active')}
          </span>
        )}
      </div>

      {/* Monitors Grid */}
      {filteredMonitors.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-muted-foreground">
            {hasActiveFilters ? 'No monitors match the selected filters.' : 'No monitors found.'}
          </div>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-primary mt-2 text-sm hover:underline">
              {t('dashboard.filter.clear.message')}
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMonitors.map((monitor) => {
            const assignedAgent = agents.find((agent) => agent.id === monitor.agentId)

            return (
              <Link key={monitor.id} to={MONITOR_INFO_PATH.replace(':monitorId', monitor.id)}>
                <Card className="transition-shadow hover:shadow-md">
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
      )}
    </div>
  )
}
