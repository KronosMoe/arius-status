import { NOTIFICATION_QUERY } from '@/gql/settings'
import { useQuery } from '@apollo/client'
import { toast } from 'sonner'
import Loading from '../utils/Loading'
import { INotification } from '@/types/setting'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

export default function NotificationSetting() {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const { data, loading, error } = useQuery(NOTIFICATION_QUERY)

  useEffect(() => {
    if (data?.getNotificationSettingsByUserId) {
      setNotifications(data.getNotificationSettingsByUserId)
    }
  }, [data])

  if (loading) return <Loading />
  if (error) toast.error(error.message)

  return (
    <div>
      <div className="my-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Notifications</h2>
        <Button size="icon">
          <Plus />
        </Button>
      </div>
      <div>{JSON.stringify(notifications, null, 2)}</div>
    </div>
  )
}
