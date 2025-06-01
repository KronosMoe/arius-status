import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatDate } from '@/lib/date'
import { ISession } from '@/types/setting'
import { addDays, isBefore } from 'date-fns'
import { Calendar, Clock, MapPin, Monitor, Shield, Smartphone, X } from 'lucide-react'

export default function DeviceCard({
  session,
  onRemove,
  isRemoving,
}: {
  session: ISession
  onRemove: () => void
  isRemoving: boolean
}) {
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(session.platform)

  const isExpiringSoon = isBefore(session.expires, addDays(new Date(), 1))

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="px-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 items-start gap-3">
            <div
              className={`rounded-lg p-2 ${isMobile ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' : 'bg-green-100 text-green-600 dark:bg-green-900/20'}`}
            >
              {isMobile ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-sm font-semibold">{isMobile ? 'Mobile Device' : 'Desktop'}</h3>
                {isExpiringSoon && (
                  <Badge variant="outline" className="text-xs text-orange-600">
                    <Clock className="mr-1 h-3 w-3" />
                    Expires Soon
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{session.deviceIP}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Created {formatDate(session.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1 sm:col-span-2">
                  <Shield className="h-3 w-3" />
                  <span>Expires {formatDate(session.expires)}</span>
                </div>
              </div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                disabled={isRemoving}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Device Session</DialogTitle>
                <DialogDescription>
                  This will log out this device. You&apos;ll need to sign in again on that device to continue using the
                  service.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={onRemove} disabled={isRemoving}>
                  {isRemoving ? 'Removing...' : 'Remove Device'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
