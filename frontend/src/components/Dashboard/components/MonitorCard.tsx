import { useQuery } from '@apollo/client'
import { STATUS_QUERY } from '@/gql/status'
import type { IMonitor } from '@/types/monitor'
import type { IStatus } from '@/types/status'
import { toast } from 'sonner'
import Loading from '@/components/util/Loading'
import { useEffect, useState, useCallback } from 'react'
import PingLine from '../../Monitor/components/PingLine'
import { Badge } from '@/components/ui/badge'

export default function MonitorCard({ monitor }: { monitor: IMonitor }) {
  const [barCount, setBarCount] = useState(60)
  const [statusHistory, setStatusHistory] = useState<IStatus[]>([])

  const { data, loading, error } = useQuery(STATUS_QUERY, {
    variables: {
      monitorId: monitor.id,
      barCount: barCount,
    },
    pollInterval: 60 * 1000,
    fetchPolicy: 'cache-and-network',
    skip: !monitor || monitor.status === 'PAUSED', // Add monitor check here too
    errorPolicy: 'all',
  })

  const handleResize = useCallback(() => {
    const newBarCount = window.innerWidth < 500 ? 30 : 60
    setBarCount(newBarCount)
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  useEffect(() => {
    if (data?.getStatusByMonitorId) {
      const newStatusData = data.getStatusByMonitorId as IStatus[]

      if (newStatusData.length > 0) {
        setStatusHistory((prev) => {
          const existingIds = new Set(prev.map((item) => item.id))
          const actuallyNewItems = newStatusData.filter((item) => !existingIds.has(item.id))
          if (actuallyNewItems.length === 0 && prev.length > 0) {
            return prev
          }
          const merged = [...prev, ...actuallyNewItems].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          )
          const result = merged.slice(-barCount)

          return result
        })
      }
    }
  }, [data, barCount])

  useEffect(() => {
    if (statusHistory.length > barCount) {
      setStatusHistory((prev) => prev.slice(-barCount))
    }
  }, [barCount, statusHistory.length])

  if (error) toast.error(error.message)

  if (loading && statusHistory.length === 0) return <Loading />

  return (
    <div
      className={`flex cursor-pointer flex-col rounded-md border border-black/20 p-4 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800`}
    >
      <div className="mb-4 flex flex-row items-center gap-2 text-xl font-bold">
        {monitor.name}
        <Badge variant="outline">{monitor.type}</Badge>
      </div>
      <PingLine monitor={monitor} barCount={barCount} statusHistory={statusHistory} />
      <div className="mt-2 text-sm text-zinc-400">
        Check every {monitor.interval} seconds
        {statusHistory.length > 0 && <span className="ml-2">({statusHistory.length} data points)</span>}
      </div>
    </div>
  )
}
