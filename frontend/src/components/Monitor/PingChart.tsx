/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { IMonitor } from '@/types/monitor'
import { STATUS_BY_TIME_RANGE_QUERY } from '@/gql/status'
import Loading from '../utils/Loading'
import { toast } from 'sonner'
import { IStatus } from '@/types/status'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, annotationPlugin)

type Props = {
  monitor: IMonitor
}

const timeRanges = [
  { label: '1h', value: 1 * 60 * 60 * 1000 },
  { label: '3h', value: 3 * 60 * 60 * 1000 },
  { label: '6h', value: 6 * 60 * 60 * 1000 },
  { label: '12h', value: 12 * 60 * 60 * 1000 },
  { label: '24h', value: 24 * 60 * 60 * 1000 },
]

export default function PingChart({ monitor }: Props) {
  const { auth } = useAuth()
  const timezone = auth?.settings?.timezone || 'UTC'

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0])
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

  if (error) {
    toast.error(error.message)
    return null
  }

  if (loading) return <Loading />

  const statusHistory = statusData?.getStatusByTimeRange as IStatus[]

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

  const labels = reversedHistory.map((s) => {
    const date = new Date(s.createdAt)
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    }).format(date)
  })

  const chartData = reversedHistory.map((s) => (s.responseTime === -1 ? null : s.responseTime))

  type AnnotationType = {
    [key: string]: {
      type: 'line'
      xMin: number
      xMax: number
      yMin: 0
      yMax: 'max'
      borderColor: string
      borderWidth: number
      borderDash?: number[]
      label?: {
        display: boolean
      }
    }
  }

  const annotations: AnnotationType = {}

  reversedHistory.forEach((status, index) => {
    if (status.responseTime === -1) {
      annotations[`line-${index}`] = {
        type: 'line',
        xMin: index,
        xMax: index,
        yMin: 0,
        yMax: 'max',
        borderColor: 'rgba(220, 38, 38, 0.5)',
        borderWidth: 10,
        label: {
          display: false,
        },
      }
    }
  })

  const data = {
    labels,
    datasets: [
      {
        label: 'Ping (ms)',
        data: chartData,
        borderColor: '#38F77D',
        backgroundColor: 'rgba(56, 247, 125, 0.5)',
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 0,
        fill: true,
        cubicInterpolationMode: 'monotone' as const,
        spanGaps: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        ticks: {
          maxTicksLimit: 3,
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
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#18181B',
        titleColor: '#FFF',
        bodyColor: '#A1A1AA',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex
            const status = reversedHistory[index]

            if (status.responseTime === -1) {
              return 'Status: Down'
            }
            return `Ping: ${status.responseTime} ms`
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
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                {selectedTimeRange.label} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Time Range</DropdownMenuLabel>
              {timeRanges.map((range) => (
                <DropdownMenuItem key={range.label} onClick={() => setSelectedTimeRange(range)}>
                  {range.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  )
}
