import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatAgo } from "@/lib/date"
import { IMonitor } from "@/types/monitor"
import { IStatus } from "@/types/status"

type Props = {
    monitor: IMonitor
    barCount: number
    statusHistory: IStatus[]
}

export default function PingLine({ monitor, barCount, statusHistory }: Props) {
  const totalSeconds = monitor.interval * barCount
  const startLabel = formatAgo(totalSeconds)

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
            gridTemplateColumns: `repeat(${barCount}, minmax(0, 1fr))`,
            direction: 'rtl',
          }}
        >
          {Array.from({ length: barCount }).map((_, i) => {
            const statusItem = statusHistory[statusHistory.length - 1 - i]
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
