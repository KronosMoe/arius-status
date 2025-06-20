/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import annotationPlugin from 'chartjs-plugin-annotation'
import type { IMonitor } from '@/types/monitor'
import { STATUS_BY_TIME_RANGE_QUERY } from '@/gql/status'
import Loading from '../util/Loading'
import { toast } from 'sonner'
import type { IStatus } from '@/types/status'

ChartJS.register(LineElement, PointElement, TimeScale, LinearScale, Tooltip, annotationPlugin)

type Props = {
  monitor: IMonitor
  selectedTimeRange: { label: string; value: number }
}

export default function PingChart({ monitor, selectedTimeRange }: Props) {
  const from = useMemo(() => new Date(Date.now() - selectedTimeRange.value), [selectedTimeRange])
  const to = useMemo(() => new Date(), [])

  const {
    data: statusData,
    loading,
    error,
  } = useQuery(STATUS_BY_TIME_RANGE_QUERY, {
    variables: { monitorId: monitor.id, from, to },
    fetchPolicy: 'network-only',
    skip: !monitor.id || !selectedTimeRange || monitor.status === 'PAUSED',
    pollInterval: 60 * 1000,
  })

  const statusHistory = statusData?.getStatusByTimeRange as IStatus[]

  const uptimeStats = useMemo(() => {
    if (!statusHistory || statusHistory.length === 0) return null

    const totalChecks = statusHistory.length
    const upChecks = statusHistory.filter((status) => status.responseTime !== -1).length
    const uptimePercentage = ((upChecks / totalChecks) * 100).toFixed(2)

    return {
      total: totalChecks,
      up: upChecks,
      down: totalChecks - upChecks,
      percentage: uptimePercentage,
    }
  }, [statusHistory])

  if (error) {
    toast.error(error.message)
    return null
  }

  if (loading) return <Loading />

  if (monitor.status === 'PAUSED') {
    return (
      <div className="my-4 flex h-[250px] w-full items-center justify-center rounded-md border border-black/20 bg-yellow-400/10 p-4 text-yellow-500 dark:border-white/10">
        Monitor is paused
      </div>
    )
  }

  if (!statusHistory || statusHistory.length === 0) {
    return (
      <div className="my-4 flex h-[250px] w-full items-center justify-center rounded-md border border-black/20 bg-zinc-900 p-4 text-zinc-500 dark:border-white/10">
        No data available for this time range
      </div>
    )
  }

  const reversedHistory = [...statusHistory].reverse()

  const generateCompleteTimeseries = (history: IStatus[], timeRange: number) => {
    if (history.length === 0) return []

    let intervalMs = 15 * 60 * 1000
    if (history.length < 50) {
      intervalMs = 5 * 60 * 1000
    } else if (timeRange <= 3 * 60 * 60 * 1000) {
      intervalMs = 60 * 1000
    } else if (timeRange <= 12 * 60 * 60 * 1000) {
      intervalMs = 5 * 60 * 1000
    }

    const startTime = from.getTime()
    const endTime = to.getTime()

    const dataMap = new Map<number, number | null>()
    history.forEach((status) => {
      const timestamp = new Date(status.createdAt).getTime()
      const roundedTimestamp = Math.round(timestamp / intervalMs) * intervalMs
      dataMap.set(roundedTimestamp, status.responseTime === -1 ? null : status.responseTime)
    })

    const completeTimeseries = []
    for (let time = startTime; time <= endTime; time += intervalMs) {
      const roundedTime = Math.round(time / intervalMs) * intervalMs
      completeTimeseries.push({
        x: roundedTime,
        y: dataMap.get(roundedTime) ?? null,
      })
    }

    return completeTimeseries
  }

  const timeseriesData = generateCompleteTimeseries(reversedHistory, selectedTimeRange.value)

  const data = {
    datasets: [
      {
        label: 'Ping (ms)',
        data: timeseriesData,
        borderColor: (context: any) => {
          const dataPoint = timeseriesData[context.dataIndex]
          return dataPoint?.y === null ? '#DC2626' : '#38F77D'
        },
        backgroundColor: 'rgba(56, 247, 125, 0.1)',
        borderWidth: 2,
        tension: 0.2,
        pointRadius: (context: any) => {
          const dataPoint = timeseriesData[context.dataIndex]
          return dataPoint?.y === null ? 4 : 0
        },
        pointBackgroundColor: (context: any) => {
          const dataPoint = timeseriesData[context.dataIndex]
          return dataPoint?.y === null ? '#DC2626' : '#38F77D'
        },
        fill: true,
        cubicInterpolationMode: 'monotone' as const,
        spanGaps: false, // Don't span gaps to show clear downtime periods
      },
    ],
  }

  const annotations = reversedHistory.reduce(
    (acc, status, index) => {
      if (status.responseTime === -1) {
        const timestamp = new Date(status.createdAt).getTime()
        acc[`downtime-${index}`] = {
          type: 'box',
          xMin: timestamp - 5 * 60 * 1000, // 5 minutes before
          xMax: timestamp + 5 * 60 * 1000, // 5 minutes after
          yMin: 0,
          yMax: 'max',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          borderColor: 'rgba(220, 38, 38, 0.3)',
          borderWidth: 1,
          label: {
            display: false, // Remove the DOWN text from chart
          },
        }
      }
      return acc
    },
    {} as Record<string, any>,
  )

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
          },
          tooltipFormat: 'MMM d, HH:mm:ss',
        },
        display: true,
        ticks: {
          maxTicksLimit: 6,
          color: '#71717A',
          font: {
            size: 10,
          },
        },
        grid: {
          color: 'rgba(113, 113, 122, 0.2)',
          lineWidth: 1,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#71717A',
          font: {
            size: 10,
          },
          display: true,
        },
        grid: {
          color: 'rgba(113, 113, 122, 0.2)',
          lineWidth: 1,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      annotation: {
        clip: false,
        annotations,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#18181B',
        titleColor: '#FFF',
        bodyColor: '#A1A1AA',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const dataPoint = timeseriesData[context.dataIndex]
            if (dataPoint.y === null) {
              return ['Status: DOWN', 'Service unavailable']
            }
            return `Response Time: ${dataPoint.y} ms`
          },
          title: (context) => {
            const dataPoint = timeseriesData[context[0].dataIndex]
            const timestamp = new Date(dataPoint.x)
            return timestamp.toLocaleString()
          },
        },
      },
      legend: {
        display: false,
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    animation: {
      duration: 500,
    },
  }

  return (
    <div>
      <div className="my-4 w-full rounded-md border border-black/20 p-4 dark:border-white/10 dark:bg-zinc-900">
        {uptimeStats && (
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
              <div className="text-sm font-medium text-green-800 dark:text-green-200">Uptime</div>
              <div className="text-lg font-bold text-green-900 dark:text-green-100">{uptimeStats.percentage}%</div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Checks</div>
              <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{uptimeStats.total}</div>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
              <div className="text-sm font-medium text-green-800 dark:text-green-200">Up</div>
              <div className="text-lg font-bold text-green-900 dark:text-green-100">{uptimeStats.up}</div>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
              <div className="text-sm font-medium text-red-800 dark:text-red-200">Down</div>
              <div className="text-lg font-bold text-red-900 dark:text-red-100">{uptimeStats.down}</div>
            </div>
          </div>
        )}
        <div>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  )
}
