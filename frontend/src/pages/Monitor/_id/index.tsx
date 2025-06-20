'use client'

import { Activity, ChevronDown, Clock, Globe, Server } from 'lucide-react'
import ActionDropdown from '@/components/Monitor/components/ActionDropdown'
import PingChart from '@/components/Monitor/PingChart'
import Status from '@/components/Monitor/Status'
import Loading from '@/components/util/Loading'
import { FIND_MONITOR_BY_ID_QUERY } from '@/gql/monitors'
import type { IMonitor } from '@/types/monitor'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const timeRanges = [
  { label: '1h', value: 1 * 60 * 60 * 1000 },
  { label: '3h', value: 3 * 60 * 60 * 1000 },
  { label: '6h', value: 6 * 60 * 60 * 1000 },
  { label: '12h', value: 12 * 60 * 60 * 1000 },
  { label: '24h', value: 24 * 60 * 60 * 1000 },
]

export default function MonitorInfo() {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0])

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'UP':
        return {
          color: 'bg-green-500',
          label: 'UP',
          variant: 'default' as const,
          ringColor: 'ring-green-500/20',
        }
      case 'DOWN':
        return {
          color: 'bg-red-500',
          label: 'DOWN',
          variant: 'destructive' as const,
          ringColor: 'ring-red-500/20',
        }
      case 'PAUSED':
        return {
          color: 'bg-yellow-500',
          label: 'PAUSED',
          variant: 'secondary' as const,
          ringColor: 'ring-yellow-500/20',
        }
      default:
        return {
          color: 'bg-gray-500',
          label: 'UNKNOWN',
          variant: 'outline' as const,
          ringColor: 'ring-gray-500/20',
        }
    }
  }

  const statusConfig = getStatusConfig(monitor.status)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HTTP':
        return Globe
      case 'TCP':
        return Server
      case 'PING':
        return Activity
      default:
        return Activity
    }
  }

  const TypeIcon = getTypeIcon(monitor.type)

  return (
    <div className="w-full px-4 py-6 xl:m-auto xl:w-[1280px]">
      {/* Header Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`h-4 w-4 rounded-full ${statusConfig.color}`} />
                {(monitor.status === 'UP' || monitor.status === 'DOWN') && (
                  <div
                    className={`absolute inset-0 h-4 w-4 rounded-full ${statusConfig.color} animate-ping opacity-75`}
                  />
                )}
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">{monitor.name}</CardTitle>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                    {statusConfig.label}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TypeIcon className="h-3 w-3" />
                    {monitor.type}
                  </Badge>
                </div>
              </div>
            </div>
            <ActionDropdown monitor={monitor} refetchMonitor={refetchMonitor} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
              <Globe className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Target</p>
                <p className="text-muted-foreground text-sm break-all">{monitor.address}</p>
              </div>
            </div>
            <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
              <Clock className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Check Interval</p>
                <p className="text-muted-foreground text-sm">{monitor.interval}s</p>
              </div>
            </div>
            <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
              <Activity className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Monitor Type</p>
                <p className="text-muted-foreground text-sm">{monitor.type}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Status monitor={monitor} />
        </CardContent>
      </Card>

      {/* Performance Chart Section */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <div>
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
        </CardHeader>
        <CardContent>
          <PingChart selectedTimeRange={selectedTimeRange} monitor={monitor} />
        </CardContent>
      </Card>
    </div>
  )
}
