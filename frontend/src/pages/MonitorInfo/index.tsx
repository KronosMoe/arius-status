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
  } = useQuery(FIND_MONITOR_BY_ID_QUERY, {
    variables: { findMonitorByIdId: monitorId },
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
      <div className="mt-10"></div>
      <h1 className="my-4 text-4xl font-bold">{monitor.name}</h1>
      <Status monitor={monitor} />
      {/* <PingChart statusHistory={statusData.getStatusByMonitorId} /> */}
    </div>
  )
}
