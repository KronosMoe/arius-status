import { IMonitor } from '@/types/monitor'
import OverallStatus from './OverallStatus'
import DraggableMonitor from './DraggableMonitor'
import StatusCard from './StatusCard'
import StatusLine from './StatusLine'
import { Monitor, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  moveCard: (from: number, to: number) => void
  moveLine: (from: number, to: number) => void
  name: string
  logo: string
  showOverallStatus: boolean
  selectedIds: string[]
  statusCards: IMonitor[]
  statusLines: IMonitor[]
  footerText: string | undefined
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

export default function Preview({
  moveCard,
  moveLine,
  name,
  logo,
  showOverallStatus,
  selectedIds,
  statusCards,
  statusLines,
  footerText,
  setActiveTab,
}: Props) {
  return (
    <div className="bg-background rounded-lg border p-6">
      {/* Status Page Preview */}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          {logo && <img src={logo || '/placeholder.svg'} alt="Logo" className="h-16 w-16 rounded-lg object-cover" />}
          <div>
            <h1 className="text-3xl font-bold">{name || 'Status Page Title'}</h1>
          </div>
        </div>

        {/* Overall Status */}
        {showOverallStatus && selectedIds.length > 0 && <OverallStatus monitorIds={selectedIds} />}

        {/* Status Cards */}
        {statusCards.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Status Overview</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {statusCards.map((monitor, index) => (
                <DraggableMonitor key={monitor.id} index={index} monitor={monitor} moveMonitor={moveCard} type="card">
                  <StatusCard monitor={monitor} />
                </DraggableMonitor>
              ))}
            </div>
          </div>
        )}

        {/* Status Lines */}
        {statusLines.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Status Timeline</h2>
            <div className="space-y-4">
              {statusLines.map((monitor, index) => (
                <DraggableMonitor key={monitor.id} index={index} monitor={monitor} moveMonitor={moveLine} type="line">
                  <StatusLine monitor={monitor} />
                </DraggableMonitor>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {statusCards.length === 0 && statusLines.length === 0 && (
          <div className="py-12 text-center">
            <Monitor className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-medium">No monitors added</h3>
            <p className="text-muted-foreground mb-4">Add monitors to your status page to get started</p>
            <Button onClick={() => setActiveTab('editor')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Monitors
            </Button>
          </div>
        )}

        {/* Footer */}
        {footerText && (
          <footer className="mt-16 border-t py-8">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">{footerText}</p>
              <p className="text-muted-foreground mt-2 text-xs">Powered by Arius Statuspage</p>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}
