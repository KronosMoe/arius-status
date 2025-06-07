"use client"

import { Activity, Clock, Globe, Server, Wifi, WifiOff } from "lucide-react"
import ActionDropdown from "@/components/Monitor/components/ActionDropdown"
import PingChart from "@/components/Monitor/PingChart"
import Status from "@/components/Monitor/Status"
import Loading from "@/components/util/Loading"
import { FIND_MONITOR_BY_ID_QUERY } from "@/gql/monitors"
import type { IMonitor } from "@/types/monitor"
import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    fetchPolicy: "network-only",
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
      case "UP":
        return {
          color: "bg-green-500",
          label: "Up",
          variant: "default" as const,
          icon: Wifi,
          ringColor: "ring-green-500/20",
        }
      case "DOWN":
        return {
          color: "bg-red-500",
          label: "Down",
          variant: "destructive" as const,
          icon: WifiOff,
          ringColor: "ring-red-500/20",
        }
      case "PAUSED":
        return {
          color: "bg-yellow-500",
          label: "Paused",
          variant: "secondary" as const,
          icon: Clock,
          ringColor: "ring-yellow-500/20",
        }
      default:
        return {
          color: "bg-gray-500",
          label: "Unknown",
          variant: "outline" as const,
          icon: Activity,
          ringColor: "ring-gray-500/20",
        }
    }
  }

  const statusConfig = getStatusConfig(monitor.status)
  const StatusIcon = statusConfig.icon

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "HTTP":
        return Globe
      case "TCP":
        return Server
      case "PING":
        return Activity
      default:
        return Activity
    }
  }

  const TypeIcon = getTypeIcon(monitor.type)

  return (
    <div className="w-full px-4 xl:m-auto xl:w-[1280px] py-6">
      {/* Header Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${statusConfig.color}`} />
                {(monitor.status === "UP" || monitor.status === "DOWN") && (
                  <div
                    className={`absolute inset-0 w-4 h-4 rounded-full ${statusConfig.color} animate-ping opacity-75`}
                  />
                )}
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">{monitor.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TypeIcon className="w-3 h-3" />
                    {monitor.type}
                  </Badge>
                </div>
              </div>
            </div>
            <ActionDropdown monitor={monitor} refetchMonitor={refetchMonitor} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Target</p>
                <p className="text-sm text-muted-foreground break-all">{monitor.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Check Interval</p>
                <p className="text-sm text-muted-foreground">{monitor.interval}s</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Activity className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Monitor Type</p>
                <p className="text-sm text-muted-foreground">{monitor.type}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Status monitor={monitor} />
        </CardContent>
      </Card>

      {/* Performance Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PingChart monitor={monitor} />
        </CardContent>
      </Card>
    </div>
  )
}
