import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Loading from '@/components/utils/Loading'
import Agents from '@/components/Dashboard/Agents'
import Monitors from '@/components/Dashboard/Monitors'
import { AGENTS_QUERY } from '@/gql/agents'
import { MONITORS_QUERY } from '@/gql/monitors'
import { IAgent } from '@/types/agent'
import { IMonitor } from '@/types/monitor'

export default function Dashboard() {
  const {
    data: monitorData,
    loading: monitorLoading,
    error: monitorError,
  } = useQuery(MONITORS_QUERY, {
    fetchPolicy: 'network-only',
  })
  const {
    data: agentData,
    loading: agentLoading,
    error: agentError,
  } = useQuery(AGENTS_QUERY, {
    pollInterval: 60 * 1000,
    fetchPolicy: 'network-only',
  })

  const [monitors, setMonitors] = useState<IMonitor[]>([])
  const [agents, setAgents] = useState<IAgent[]>([])

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
    if (monitorError) toast.error(monitorError.message)
    if (agentError) toast.error(agentError.message)
  }, [monitorError, agentError])

  if (monitorLoading || agentLoading) return <Loading />

  const sortedMonitors = [...monitors].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  const sortedAgents = [...agents].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return (
    <div className="w-full px-4 xl:m-auto xl:w-[1280px]">
      <div className="mt-10 mb-20">
        <Tabs defaultValue="monitors">
          <TabsList>
            <TabsTrigger value="monitors">Monitors</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
          </TabsList>
          <TabsContent value="monitors">
            <Monitors monitors={sortedMonitors} setMonitors={setMonitors} agents={agents} />
          </TabsContent>
          <TabsContent value="agents">
            <Agents agents={sortedAgents} setAgents={setAgents} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
