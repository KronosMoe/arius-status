import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Loading from '../utils/Loading'
import { IMonitor } from '@/types/monitor'
import { useQuery } from '@apollo/client'
import { MONITORS_QUERY } from '@/gql/monitors'
import StatusCard from './components/StatusCard'
import StatusLine from './components/StatusLine'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import OverallStatus from './components/OverallStatus'
import { Switch } from '../ui/switch'
import { Separator } from '../ui/separator'
import DraggableMonitor from './components/DraggableMonitor'
import { Button } from '../ui/button'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DASHBOARD_PATH } from '@/constants/routes'
import Background from './background.webp'

export default function StatusPageEditor() {
  const {
    data: monitorData,
    loading: monitorLoading,
    error: monitorError,
  } = useQuery(MONITORS_QUERY, {
    fetchPolicy: 'network-only',
  })

  const [isCollapse, setCollapse] = useState(false)

  const [showOverallStatus, setShowOverallStatus] = useState(true)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [monitors, setMonitors] = useState<IMonitor[]>([])
  const [statusCards, setStatusCards] = useState<IMonitor[]>([])
  const [statusLines, setStatusLines] = useState<IMonitor[]>([])
  const [selectedMonitorIds, setSelectedMonitorIds] = useState<string[]>([])
  const [footerText, setFooterText] = useState('© 2025 Arius Statuspage. All rights reserved.')

  useEffect(() => {
    if (monitorData?.findMonitorsByUserId) {
      setMonitors(monitorData.findMonitorsByUserId)
    }
  }, [monitorData])

  useEffect(() => {
    const combinedIds = [...statusCards, ...statusLines].map((m) => m.id)
    const uniqueIds = Array.from(new Set(combinedIds))
    setSelectedMonitorIds(uniqueIds)
  }, [statusCards, statusLines])

  useEffect(() => {
    if (monitorError) toast.error(monitorError.message)
  }, [monitorError])

  if (monitorLoading) return <Loading />

  const handleSelectStatusCardMonitor = (monitorId: string) => {
    const monitorToAdd = monitors.find((m) => m.id === monitorId)
    if (monitorToAdd && !statusCards.some((m) => m.id === monitorId)) {
      setStatusCards((prevCards) => [...prevCards, monitorToAdd])
    }
  }

  const handleSelectStatusLineMonitor = (monitorId: string) => {
    const monitorToAdd = monitors.find((m) => m.id === monitorId)
    if (monitorToAdd && !statusLines.some((m) => m.id === monitorId)) {
      setStatusLines((prevLines) => [...prevLines, monitorToAdd])
    }
  }

  const availableMonitorsForStatusCard = monitors.filter((monitor) => !statusCards.some((m) => m.id === monitor.id))

  const availableMonitorsForStatusLine = monitors.filter((monitor) => !statusLines.some((m) => m.id === monitor.id))

  const handleFooterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFooterText(event.target.value)
  }

  const moveCard = (from: number, to: number) => {
    setStatusCards((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      return updated
    })
  }

  const moveLine = (from: number, to: number) => {
    setStatusLines((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      return updated
    })
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div
        className={`bg-zinc-50/70 min-h-screen backdrop-blur-lg dark:bg-zinc-950/70 ${isFullWidth ? 'w-full px-4' : 'w-full px-4 xl:m-auto xl:w-[1280px]'}`}
      >
        <Link to={DASHBOARD_PATH}>
          <Button variant="outline" className="mt-10">
            <ArrowLeft /> Back to Dashboard
          </Button>
        </Link>
        <div className="mt-4 mb-10 rounded-md border border-black/20 p-4 dark:border-white/10">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold">Editor</h1>
            <Button variant="ghost" size="icon" onClick={() => setCollapse(!isCollapse)}>
              {isCollapse ? <ChevronDown /> : <ChevronUp />}
            </Button>
          </div>
          {!isCollapse && (
            <div className="mt-4">
              <div className="my-4 flex items-center justify-between">
                <Label htmlFor="overall-status-toggle">Show Overall Status</Label>
                <Switch id="overall-status-toggle" checked={showOverallStatus} onCheckedChange={setShowOverallStatus} />
              </div>
              <div className="my-4 flex items-center justify-between">
                <Label htmlFor="full-width-toggle">Full Width Content</Label>
                <Switch id="full-width-toggle" checked={isFullWidth} onCheckedChange={setIsFullWidth} />
              </div>
              <Separator />
              <div className="my-4">
                <Label className="my-2">Status Card</Label>
                <Select onValueChange={handleSelectStatusCardMonitor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a monitor for StatusCard" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMonitorsForStatusCard.map((monitor) => (
                      <SelectItem key={monitor.id} value={monitor.id}>
                        {monitor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="my-4">
                <Label className="my-2">Status Line (Ping Line)</Label>
                <Select onValueChange={handleSelectStatusLineMonitor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a monitor for StatusLine" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMonitorsForStatusLine.map((monitor) => (
                      <SelectItem key={monitor.id} value={monitor.id}>
                        {monitor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="my-4">
                <Label className="my-2">Footer Text</Label>
                <Input
                  type="text"
                  value={footerText}
                  onChange={handleFooterChange}
                  placeholder="Enter footer text"
                  className="w-full rounded-md border p-2"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-row items-center gap-4">
            <img
              src="https://play-lh.googleusercontent.com/g8Pdqd0jxo14ZKobgelauvnIc3WvBjYVm_WQRFyS3JBZiZmADCHHojqhueyg_lxyNXDY"
              alt="logo"
              className="size-[64px] rounded-md"
            />
            <h1 className="text-4xl font-bold">Lorem Ipsum</h1>
          </div>
          <div className="mt-4 mb-10 text-sm text-zinc-500 dark:text-zinc-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </div>
          {showOverallStatus && selectedMonitorIds.length > 0 && <OverallStatus monitorIds={selectedMonitorIds} />}

          {statusCards.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {statusCards.map((monitor, index) => (
                <DraggableMonitor key={monitor.id} index={index} monitor={monitor} moveMonitor={moveCard} type="card">
                  <StatusCard monitor={monitor} />
                </DraggableMonitor>
              ))}
            </div>
          ) : null}

          {statusLines.length > 0 ? (
            <div className="mt-4 flex flex-col gap-4">
              {statusLines.map((monitor, index) => (
                <DraggableMonitor key={monitor.id} index={index} monitor={monitor} moveMonitor={moveLine} type="line">
                  <StatusLine monitor={monitor} />
                </DraggableMonitor>
              ))}
            </div>
          ) : null}
          <footer className="text-muted-foreground mt-32 border-t py-8 text-center text-sm">{footerText}</footer>
        </div>
      </div>
    </div>
  )
}
