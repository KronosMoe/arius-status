import type { IMonitor } from '@/types/monitor'
import type { IAgent } from '@/types/agent'
import { MonitorsSkeletonList } from './MonitorsSkeletonList'
import { EmptyState } from './EmptyState'
import { MonitorsList } from './MonitorsList'
import CreateMonitorForm from './CreateMonitorForm'
import { useTranslation } from 'react-i18next'

interface MonitorsTabProps {
  monitors: IMonitor[]
  agents: IAgent[]
  refetch: () => void
  isLoading?: boolean
}

export function MonitorsTab({ monitors, refetch, agents, isLoading = false }: MonitorsTabProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return <MonitorsSkeletonList />
  }

  if (monitors.length === 0) {
    return (
      <EmptyState
        title="No monitors found"
        description="Create your first monitor to start tracking your services."
        action={<CreateMonitorForm refetch={refetch} agents={agents} />}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{t('dashboard.list.title-monitor')}</h2>
        <CreateMonitorForm refetch={refetch} agents={agents} />
      </div>
      <MonitorsList monitors={monitors} agents={agents} />
    </div>
  )
}
