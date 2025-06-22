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
import { Calendar, MapPin, Monitor, Shield, Smartphone, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function DeviceCard({
  session,
  onRemove,
  isRemoving,
}: {
  session: ISession
  onRemove: () => void
  isRemoving: boolean
}) {
  const { t } = useTranslation()

  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(session.platform)

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
              </div>
              <div className="text-muted-foreground grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{session.deviceIP}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{t('settings.devices.created')} {formatDate(session.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1 sm:col-span-2">
                  <Shield className="h-3 w-3" />
                  <span>{t('settings.devices.expires')} {formatDate(session.expires)}</span>
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
                <DialogTitle>{t('settings.devices.remove-device-dialog.title')}</DialogTitle>
                <DialogDescription>
                  {t('settings.devices.remove-device-dialog.description')}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t('settings.devices.remove-device-dialog.cancel')}</Button>
                </DialogClose>
                <Button variant="destructive" onClick={onRemove} disabled={isRemoving}>
                  {t('settings.devices.remove-device-dialog.submit')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
