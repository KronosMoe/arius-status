import Loading from '@/components/utils/Loading'
import { LATEST_STATUS_QUERY } from '@/gql/status'
import { IMonitor } from '@/types/monitor'
import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { IStatus } from '@/types/status'
import { CircleCheck, CirclePause, CircleX } from 'lucide-react'

type Props = {
  monitor: IMonitor
}

export default function StatusCard({ monitor }: Props) {
  const { data, loading, error } = useQuery(LATEST_STATUS_QUERY, {
    variables: {
      monitorId: monitor.id,
    },
    pollInterval: 60 * 1000,
    fetchPolicy: 'cache-and-network',
    skip: !monitor || monitor.status === 'PAUSED',
    errorPolicy: 'all',
  })
  const status: IStatus = data?.getLatestStatusByMonitorId

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  if (loading) return <Loading />

  const statusIcon = () => {
    switch (status.responseTime) {
      case -1:
        return <CircleX className="text-red-500" />
      default:
        return <CircleCheck className="text-green-500" />
    }
  }

  const statusText = () => {
    switch (status.responseTime) {
      case -1:
        return 'Degraded'
      default:
        return 'Operational'
    }
  }

  return (
    <div className="rounded-md border border-black/20 p-4 dark:border-white/10 dark:bg-zinc-900">
      <div className="flex flex-row items-center justify-between">
        <div className="text-lg">{monitor.name}</div>
        {monitor.status === 'PAUSED' ? <CirclePause className="text-yellow-500" /> : statusIcon()}
      </div>
      <div className="text-sm font-light text-zinc-500 dark:text-zinc-400">
        {monitor.status === 'PAUSED' ? 'Paused' : statusText()}
      </div>
    </div>
  )
}
