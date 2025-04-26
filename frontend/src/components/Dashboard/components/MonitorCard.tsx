import { useQuery } from '@apollo/client'
import { STATUS_QUERY } from '@/gql/status'
import { IMonitor } from '@/types/monitor'
import { IStatus } from '@/types/status'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function formatAgo(seconds: number) {
  if (seconds >= 86400) {
    const days = Math.floor(seconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }
}

export default function MonitorCard({ monitor }: { monitor: IMonitor }) {
  const { data, loading, error } = useQuery(STATUS_QUERY, {
    variables: {
      monitorId: monitor.id,
    },
    pollInterval: monitor.interval * 1000,
  })

  const status = (data?.getStatusByMonitorId || []) as IStatus[]

  if (error) toast.error(error.message)

  if (loading) return <div>Loading...</div>

  const StatusRender = () => {
    const BAR_COUNT = 60
    const totalSeconds = monitor.interval * BAR_COUNT
    const startLabel = formatAgo(totalSeconds)

    const sortedStatus = [...status].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    return (
      <>
        <div className="my-2 flex flex-row items-center justify-between">
          <div className="text-xs text-zinc-400">~{startLabel}</div>
          <div className="text-xs text-zinc-400">Now</div>
        </div>

        <div className="relative w-full overflow-hidden">
          <div
            className="grid w-full gap-1"
            style={{
              gridTemplateColumns: `repeat(${BAR_COUNT}, minmax(0, 1fr))`,
              direction: 'rtl',
            }}
          >
            {Array.from({ length: BAR_COUNT }).map((_, i) => {
              const statusItem = sortedStatus[i]
              let bgColor = 'bg-zinc-300 dark:bg-zinc-500'
              let tooltip = 'No Data'

              if (statusItem) {
                if (statusItem.responseTime === -1) {
                  bgColor = 'bg-red-500'
                  tooltip = 'Down'
                } else if (statusItem.responseTime !== null) {
                  bgColor = 'bg-green-400'
                  tooltip = `${statusItem.responseTime} ms`
                }
              }

              return (
                <Tooltip key={i}>
                  <TooltipTrigger>
                    <div className={`h-[30px] w-full rounded-md ${bgColor} transition-all hover:scale-110`} />
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="flex cursor-pointer flex-col rounded-md border border-black/20 p-4 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800">
      <div className="mb-4 text-xl font-bold">{monitor.name}</div>
      <StatusRender />
      <div className="mt-2 text-sm text-zinc-400">Check every {monitor.interval} seconds</div>
    </div>
  )
}
