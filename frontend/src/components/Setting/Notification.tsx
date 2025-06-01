import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { toast } from 'sonner'
import { Bell, Settings } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import CreateNotificationForm from './components/CreateNotificationForm'
import { NOTIFICATION_QUERY } from '@/gql/settings'
import type { INotification } from '@/types/setting'
import NotificationCard from './components/NotificationCard'

function NotificationsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function NotificationSetting() {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const { data, loading, error, refetch } = useQuery(NOTIFICATION_QUERY, {
    errorPolicy: 'all',
  })

  useEffect(() => {
    if (data?.getNotificationSettingsByUserId) {
      setNotifications(data.getNotificationSettingsByUserId)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error('Failed to load notifications', {
        description: error.message,
      })
    }
  }, [error])

  if (loading) return <NotificationsSkeleton />

  const defaultNotifications = notifications.filter((n) => n.isDefault)
  const customNotifications = notifications.filter((n) => !n.isDefault)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Configure webhook endpoints to receive uptime alerts and system notifications.
          </p>
        </div>
        <CreateNotificationForm refetch={refetch} />
      </div>

      {/* Default Notifications */}
      {defaultNotifications.length > 0 && (
        <div>
          <h3 className="text-muted-foreground mb-3 text-sm font-medium">
            Default Notifications ({defaultNotifications.length})
          </h3>
          <div className="space-y-3">
            {defaultNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} refetch={refetch} />
            ))}
          </div>
        </div>
      )}

      {/* Custom Notifications */}
      {customNotifications.length > 0 && (
        <div>
          <h3 className="text-muted-foreground mb-3 text-sm font-medium">
            Custom Notifications ({customNotifications.length})
          </h3>
          <div className="space-y-3">
            {customNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} refetch={refetch} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">No Notifications Configured</h3>
            <p className="text-muted-foreground mb-4">
              Set up webhook notifications to receive alerts about your services and uptime monitoring.
            </p>
            <CreateNotificationForm refetch={refetch} />
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      {notifications.length > 0 && (
        <Card className="bg-muted/50 gap-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-xs">
              Notifications are sent when uptime checks fail, services go down, or other important events occur. Make
              sure your webhook URLs are accessible and properly configured.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
