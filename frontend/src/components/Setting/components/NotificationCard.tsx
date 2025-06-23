import { Webhook, Bell, Calendar } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { INotification } from '@/types/setting'
import UpdateNotificationForm from './UpdateNotificationForm'
import DeleteNotificationDialog from './DeleteNotificationDialog'
import { formatDate } from '@/lib/date'
import { useTranslation } from 'react-i18next'

export default function NotificationCard({
  notification,
  refetch,
}: {
  notification: INotification
  refetch: () => void
}) {
  const { t } = useTranslation()

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'discord':
        return <Webhook className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'discord':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
      case 'email':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="px-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:gap-0">
          <div className="flex flex-1 items-start gap-3">
            <div className={`rounded-lg p-2 ${getMethodColor(notification.method)} hidden md:block`}>
              {getMethodIcon(notification.method)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold">{notification.title}</h3>
                {notification.isDefault && (
                  <Badge variant="outline" className="hidden text-xs text-blue-600 sm:block">
                    {t('settings.notification.list.default')}
                  </Badge>
                )}
              </div>

              {notification.message && (
                <p className="text-muted-foreground mb-2 line-clamp-2 text-xs">{notification.message}</p>
              )}

              {notification.content && (
                <p className="text-muted-foreground bg-muted mb-2 line-clamp-1 rounded px-2 py-1 font-mono text-xs">
                  {notification.content}
                </p>
              )}

              <div className="text-muted-foreground mt-4 flex flex-col gap-2 text-xs md:mt-auto md:flex-row md:items-center md:gap-4">
                {notification.webhookUrl && (
                  <span className="flex items-center gap-1 truncate">
                    <Webhook className="h-3 w-3" />
                    <span className="max-w-32 truncate">{notification.webhookUrl}</span>
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{t('settings.notification.list.created')} {formatDate(notification.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-end gap-2 md:ml-2 md:w-auto md:justify-normal">
            <UpdateNotificationForm notification={notification} refetch={refetch} />
            <DeleteNotificationDialog notification={notification} refetch={refetch} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
