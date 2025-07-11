import { useQuery } from '@apollo/client'
import { STATUS_QUERY } from '@/gql/status'
import { IMonitor } from '@/types/monitor'
import { IStatus } from '@/types/status'
import { toast } from 'sonner'
import Loading from '@/components/util/Loading'
import { useEffect, useState } from 'react'
import PingLine from './components/PingLine'
import { useTranslation } from 'react-i18next'

export default function Status({ monitor }: { monitor: IMonitor }) {
  const { t } = useTranslation()
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
      className={`flex cursor-pointer flex-col rounded-md border border-black/20 p-4 dark:border-white/10 dark:bg-zinc-900`}
    >
      <PingLine monitor={monitor} barCount={barCount} statusHistory={statusHistory} />
      <div className="mt-2 text-sm text-zinc-400">{t('monitor.info.overview.check', { interval: monitor.interval })}</div>
    </div>
  )
}
