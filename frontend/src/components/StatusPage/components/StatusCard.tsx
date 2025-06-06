import Loading from '@/components/utils/Loading'
import { LATEST_STATUS_QUERY } from '@/gql/status'
import { IMonitor } from '@/types/monitor'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IStatus } from '@/types/status'
import { CircleCheck, CirclePause, CircleX, HelpCircle } from 'lucide-react'

type Props = {
  monitor: IMonitor
}

export default function StatusCard({ monitor }: Props) {
  const [status, setStatus] = useState<IStatus>({
    id: '',
    responseTime: -999,
    createdAt: new Date(),
    metadata: {},
  })

  const { data, loading, error } = useQuery(LATEST_STATUS_QUERY, {
    variables: {
      monitorId: monitor.id,
    },
    pollInterval: 60 * 1000,
    fetchPolicy: 'cache-and-network',
    skip: !monitor || monitor.status === 'PAUSED',
    errorPolicy: 'all',
  })

  useEffect(() => {
    if (data?.getLatestStatusByMonitorId) {
      setStatus(data.getLatestStatusByMonitorId as IStatus)
    }
  }, [data])

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  if (loading) return <Loading />

  const isUnknownStatus = status.responseTime === -999

  const statusIcon = () => {
    if (isUnknownStatus) return <HelpCircle className="text-gray-400" />
    switch (status.responseTime) {
      case -1:
        return <CircleX className="text-red-500" />
      default:
        return <CircleCheck className="text-green-500" />
    }
  }

  const statusText = () => {
    if (isUnknownStatus) return 'Unknown'
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
