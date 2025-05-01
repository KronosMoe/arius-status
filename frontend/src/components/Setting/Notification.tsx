import { NOTIFICATION_QUERY } from '@/gql/settings'
import { useQuery } from '@apollo/client'
import { toast } from 'sonner'
import Loading from '../utils/Loading'
import { INotification } from '@/types/setting'
import { useEffect, useState } from 'react'
import CreateNotificationForm from './components/CreateNotificationForm'
import { Webhook } from 'lucide-react'
import UpdateNotificationForm from './components/UpdateNotificationForm'
import DeleteNotificationDialog from './components/DeleteNotificationDialog'
export default function NotificationSetting() {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const { data, loading, error, refetch } = useQuery(NOTIFICATION_QUERY)

  useEffect(() => {
    if (data?.getNotificationSettingsByUserId) {
      setNotifications(data.getNotificationSettingsByUserId)
    }
  }, [data])

  if (loading) return <Loading />
  if (error) toast.error(error.message)

  const notificationRender = notifications.map((notification) => {
    return (
      <div
        key={notification.id}
        className="flex flex-row justify-between rounded-md border border-black/10 p-4 dark:border-white/10"
      >
        <h3 className="flex flex-row items-center gap-2 text-lg font-bold">
          <span>{(notification.method === 'Discord' || notification.method === 'Slack') && <Webhook />}</span>
          {notification.title}
        </h3>
        <div className="flex flex-row items-center gap-2">
          <DeleteNotificationDialog notification={notification} refetch={refetch} />
          <UpdateNotificationForm notification={notification} refetch={refetch} />
        </div>
      </div>
    )
  })

  return (
    <div>
      <div className="my-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Notifications</h2>
        <CreateNotificationForm refetch={refetch} />
      </div>
      <div className="mt-4 flex flex-col gap-4">{notificationRender}</div>
    </div>
  )
}
