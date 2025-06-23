import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { toast } from 'sonner'
import { Bell } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import CreateNotificationForm from './components/CreateNotificationForm'
import { NOTIFICATION_QUERY } from '@/gql/settings'
import type { INotification } from '@/types/setting'
import NotificationCard from './components/NotificationCard'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
      toast.error(error.message)
    }
  }, [error])

  if (loading) return <NotificationsSkeleton />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="text-xl font-bold">{t('settings.notification.title')}</h2>
          </div>
        </div>
        <CreateNotificationForm refetch={refetch} />
      </div>

      {notifications.length > 0 && (
        <div>
          <h3 className="text-muted-foreground mb-3 text-sm font-medium">{t('settings.notification.list.title')} ({notifications.length})</h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
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
            <h3 className="mb-2 text-lg font-semibold">{t('settings.notification.empty.title')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('settings.notification.empty.description')}
            </p>
            <CreateNotificationForm refetch={refetch} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
