import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DELETE_NOTIFICATION_MUTATION } from '@/gql/settings'
import { INotification } from '@/types/setting'
import { useMutation } from '@apollo/client'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type Props = {
  notification: INotification
  refetch: () => void
}

export default function DeleteNotificationDialog({ notification, refetch }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [deleteNotification, { error, loading }] = useMutation(DELETE_NOTIFICATION_MUTATION, {
    variables: {
      deleteNotificationSettingId: notification.id,
    },
  })

  const onDelete = async () => {
    await deleteNotification()
    toast.success(t('settings.notification.remove-dialog.toast'))
    setOpen(false)
    refetch()
  }

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.notification.remove-dialog.title')}</DialogTitle>
          <DialogDescription>{t('settings.notification.remove-dialog.description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>{t('settings.notification.remove-dialog.cancel')}</Button>
          <Button variant="destructive" disabled={loading} onClick={onDelete}>
            {t('settings.notification.remove-dialog.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
