import { Webhook, Bell } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { INotification } from '@/types/setting'
import UpdateNotificationForm from './UpdateNotificationForm'
import DeleteNotificationDialog from './DeleteNotificationDialog'

export default function NotificationCard({
  notification,
  refetch,
}: {
  notification: INotification
  refetch: () => void
}) {
  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'discord':
      case 'slack':
        return <Webhook className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'discord':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
      case 'slack':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'email':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="px-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 items-start gap-3">
            <div className={`rounded-lg p-2 ${getMethodColor(notification.method)}`}>
              {getMethodIcon(notification.method)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold">{notification.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {notification.method}
                </Badge>
                {notification.isDefault && (
                  <Badge variant="outline" className="text-xs text-blue-600">
                    Default
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

              <div className="text-muted-foreground flex items-center gap-4 text-xs">
                {notification.webhookUrl && (
                  <span className="flex items-center gap-1 truncate">
                    <Webhook className="h-3 w-3" />
                    <span className="max-w-32 truncate">{notification.webhookUrl}</span>
                  </span>
                )}
                <span>Created {new Date(notification.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="ml-2 flex items-center gap-1">
            <UpdateNotificationForm notification={notification} refetch={refetch} />
            <DeleteNotificationDialog notification={notification} refetch={refetch} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
