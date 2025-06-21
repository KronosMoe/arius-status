import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { toast } from 'sonner'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { AGENTS_QUERY } from '@/gql/agents'
import { MONITORS_QUERY } from '@/gql/monitors'
import { IAgent } from '@/types/agent'
import { IMonitor } from '@/types/monitor'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { DashboardShell } from '@/components/Dashboard/components/DashboardShell'
import { DashboardHeader } from '@/components/Dashboard/components/DashboardHeader'
import { DashboardTabs } from '@/components/Dashboard/components/DashboardTabs'
import { MonitorsTab } from '@/components/Dashboard/components/MonitorsTab'
import { AgentsTab } from '@/components/Dashboard/components/AgentsTab'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string>('monitors')

  const {
    data: monitorData,
    loading: monitorLoading,
    error: monitorError,
    refetch: refetchMonitors,
  } = useQuery(MONITORS_QUERY, {
    fetchPolicy: 'network-only',
  })

  const {
    data: agentData,
    loading: agentLoading,
    error: agentError,
    refetch: refetchAgents,
    networkStatus,
  } = useQuery(AGENTS_QUERY, {
    pollInterval: 60 * 1000,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  })

  const [monitors, setMonitors] = useState<IMonitor[]>([])
  const [agents, setAgents] = useState<IAgent[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (monitorData?.findMonitorsByUserId) {
      setMonitors(monitorData.findMonitorsByUserId)
    }
  }, [monitorData])

  useEffect(() => {
    if (agentData?.findAgentsByUserId) {
      setAgents(agentData.findAgentsByUserId)
    }
  }, [agentData])

  useEffect(() => {
    if (monitorError) toast.error(`Failed to load monitors: ${monitorError.message}`)
    if (agentError) toast.error(`Failed to load agents: ${agentError.message}`)
  }, [monitorError, agentError])

  const sortedMonitors = [...monitors].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const sortedAgents = [...agents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([refetchMonitors(), refetchAgents()])
      toast.success('Data refreshed successfully')
    } catch {
      toast.error('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }

  const isLoading = monitorLoading || agentLoading
  const isError = monitorError || agentError
  const isPolling = networkStatus === 6 // Apollo polling status

  const activeMonitors = sortedMonitors.filter((monitor) => monitor.status !== 'PAUSED').length
  const pausedMonitors = sortedMonitors.filter((monitor) => monitor.status === 'PAUSED').length

  return (
    <DashboardShell>
      <DashboardHeader
        title={t('dashboard.header.title')}
        description={t('dashboard.header.description')}
        action={
          <Button onClick={refreshData} disabled={isRefreshing || isLoading} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing || isPolling ? 'animate-spin' : ''}`} />
            {t('dashboard.header.button.refresh')}
          </Button>
        }
        stats={[
          { label: t('dashboard.header.stats.total-monitors'), value: monitors.length },
          { label: t('dashboard.header.stats.active-monitors'), value: activeMonitors },
          { label: t('dashboard.header.stats.paused-monitors'), value: pausedMonitors },
          { label: t('dashboard.header.stats.total-agents'), value: agents.length },
        ]}
        isLoading={isLoading}
      />

      {isError && !isLoading && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('dashboard.error.title')}</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{t('dashboard.error.message')}</p>
            <Button variant="outline" size="sm" className="w-fit" onClick={refreshData}>
              {t('dashboard.error.button')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <DashboardTabs activeTab={activeTab} onChange={setActiveTab} isLoading={isLoading}>
          <TabsContent value="monitors" className="mt-6">
            <MonitorsTab
              monitors={sortedMonitors}
              agents={agents}
              isLoading={monitorLoading}
              refetch={refetchMonitors}
            />
          </TabsContent>
          <TabsContent value="agents" className="mt-6">
            <AgentsTab agents={sortedAgents} isLoading={agentLoading} refetch={refetchAgents} />
          </TabsContent>
        </DashboardTabs>
      </Tabs>
    </DashboardShell>
  )
}
