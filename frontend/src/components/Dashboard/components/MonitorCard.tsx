import { useQuery } from '@apollo/client'
import { STATUS_QUERY } from '@/gql/status'
import { IMonitor } from '@/types/monitor'
import { IStatus } from '@/types/status'
import { toast } from 'sonner'
import Loading from '@/components/utils/Loading'
import { useEffect, useState } from 'react'
import PingLine from './PingLine'
import { Badge } from '@/components/ui/badge'

export default function MonitorCard({ monitor, showTitle = true }: { monitor: IMonitor; showTitle?: boolean }) {
  const [barCount, setBarCount] = useState(60)
  const [statusHistory, setStatusHistory] = useState<IStatus[]>([])

  const { data, loading, error } = useQuery(STATUS_QUERY, {
    variables: {
      monitorId: monitor.id,
      barCount: barCount,
    },
    pollInterval: 60 * 1000,
    fetchPolicy: 'network-only',
    skip: monitor.status === 'PAUSED',
  })

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 500) {
        setBarCount(30)
      } else {
        setBarCount(60)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (data?.getStatusByMonitorId) {
      const newStatus = data.getStatusByMonitorId as IStatus[]

      setStatusHistory((prev) => {
        const merged = [...prev, ...newStatus]
          .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

        return merged.slice(-barCount)
      })
    }
  }, [data, barCount])

  if (error) toast.error(error.message)

  if (loading && statusHistory.length === 0) return <Loading />

  return (
    <div
      className={`flex cursor-pointer flex-col rounded-md border border-black/20 p-4 transition-colors ${showTitle && 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} dark:border-white/10 dark:bg-zinc-900`}
    >
      {showTitle && (
        <div className="mb-4 text-xl flex flex-row items-center gap-2 font-bold">
          {monitor.name}
          <Badge variant='outline'>{monitor.type}</Badge>
        </div>
      )}
      <PingLine monitor={monitor} barCount={barCount} statusHistory={statusHistory} />
      <div className="mt-2 text-sm text-zinc-400">Check every {monitor.interval} seconds</div>
    </div>
  )
}
