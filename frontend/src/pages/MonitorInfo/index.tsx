import ActionDropdown from '@/components/Monitor/components/ActionDropdown'
import PingChart from '@/components/Monitor/PingChart'
import Status from '@/components/Monitor/Status'
import Loading from '@/components/utils/Loading'
import { FIND_MONITOR_BY_ID_QUERY } from '@/gql/monitors'
import { IMonitor } from '@/types/monitor'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

export default function MonitorInfo() {
  const { monitorId } = useParams<{ monitorId: string }>()
  const [monitor, setMonitor] = useState<IMonitor | null>(null)

  const {
    data: monitorData,
    loading: monitorLoading,
    error: monitorError,
    refetch: refetchMonitor,
  } = useQuery(FIND_MONITOR_BY_ID_QUERY, {
    variables: { findMonitorByIdId: monitorId },
    pollInterval: 60 * 1000,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (monitorData?.findMonitorById) {
      setMonitor(monitorData.findMonitorById)
    }
  }, [monitorData])

  useEffect(() => {
    if (monitorError) toast.error(monitorError.message)
  }, [monitorError])

  if (monitorLoading || !monitor) return <Loading />

  return (
    <div className="w-full px-4 xl:m-auto xl:w-[1280px]">
      <div className="mt-10" />
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <h1 className="my-4 text-4xl font-bold">{monitor.name}</h1>
          {monitor.status === 'PAUSED' && (
            <div className="relative">
              <div className="absolute inset-0 -top-[10px] size-[24px] rounded-full bg-yellow-500" />
            </div>
          )}
          {monitor.status === 'UP' && (
            <div className="relative">
              <div className="absolute inset-0 -top-[10px] size-[24px] rounded-full bg-green-500" />
              <div className="absolute inset-0 -top-[10px] size-[24px] animate-ping rounded-full border-2 border-green-500 bg-green-500 opacity-75" />
            </div>
          )}
          {monitor.status === 'DOWN' && (
            <div className="relative">
              <div className="absolute inset-0 -top-[10px] size-[24px] rounded-full bg-red-500" />
              <div className="absolute inset-0 -top-[10px] size-[24px] animate-ping rounded-full border-2 border-red-500 bg-red-500 opacity-75" />
            </div>
          )}
        </div>
        <ActionDropdown monitor={monitor} refetchMonitor={refetchMonitor} />
      </div>
      <Status monitor={monitor} />
      <PingChart monitor={monitor} />
    </div>
  )
}
