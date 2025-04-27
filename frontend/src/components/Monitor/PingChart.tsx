/* eslint-disable @typescript-eslint/no-explicit-any */
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { IStatus } from '@/types/status'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, annotationPlugin)

interface PingChartProps {
  statusHistory: IStatus[]
}

export default function PingChart({ statusHistory }: PingChartProps) {
  const reversedHistory = [...statusHistory].reverse()

  const labels = reversedHistory.map((s) => {
    const date = new Date(s.createdAt)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
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
          display: false,
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
    <div className="my-4 w-full rounded-md border border-black/20 bg-zinc-900 p-4 dark:border-white/10">
      <Line data={data} options={options} />
    </div>
  )
}
