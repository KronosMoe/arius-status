import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { formatAgo } from '@/lib/date'
import type { IMonitor } from '@/types/monitor'
import type { IStatus } from '@/types/status'
import { useMemo } from 'react'

type Props = {
  monitor: IMonitor
  barCount: number
  statusHistory: IStatus[]
}

export default function PingLine({ monitor, barCount, statusHistory }: Props) {
  const totalSeconds = monitor.interval * barCount
  const startLabel = formatAgo(totalSeconds)

  // Memoize the bars data to prevent unnecessary re-renders
  const barsData = useMemo(() => {
    return Array.from({ length: barCount }).map((_, i) => {
      const statusItem = statusHistory[statusHistory.length - 1 - i]
      let bgColor = 'bg-zinc-300 dark:bg-zinc-500'
      let tooltip = 'No Data'

      if (monitor?.status === 'PAUSED') {
        bgColor = 'bg-yellow-400'
        tooltip = 'Paused'
      } else if (statusItem) {
        if (statusItem.responseTime === -1) {
          bgColor = 'bg-red-500'
          tooltip = 'Down'
        } else if (statusItem.responseTime !== null) {
          bgColor = 'bg-green-400'
          tooltip = `${statusItem.responseTime} ms`
        }
      }

      return { bgColor, tooltip, id: statusItem?.id || `empty-${i}` }
    })
  }, [barCount, statusHistory, monitor?.status])

  if (!monitor) {
    return null
  }

  return (
    <>
      <div className="my-2 flex flex-row items-center justify-between">
        <div className="text-xs text-zinc-400">~{startLabel}</div>
        <div className="text-xs text-zinc-400">Now</div>
      </div>

      <TooltipProvider>
        <div className="relative w-full overflow-hidden">
          <div
            className="grid w-full gap-1"
            style={{
              gridTemplateColumns: `repeat(${barCount}, minmax(0, 1fr))`,
              direction: 'rtl',
            }}
          >
            {barsData.map((bar, i) => (
              <Tooltip key={`${bar.id}-${i}`}>
                <TooltipTrigger>
                  <div className={`h-[30px] w-full rounded-md ${bar.bgColor} transition-all hover:scale-110`} />
                </TooltipTrigger>
                <TooltipContent>{bar.tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>
    </>
  )
}
