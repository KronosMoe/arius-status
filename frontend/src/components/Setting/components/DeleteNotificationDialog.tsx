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
import { toast } from 'sonner'

type Props = {
  notification: INotification
  refetch: () => void
}

export default function DeleteNotificationDialog({ notification, refetch }: Props) {
  const [open, setOpen] = useState(false)
  const [deleteNotification, { error, loading }] = useMutation(DELETE_NOTIFICATION_MUTATION, {
    variables: {
      deleteNotificationSettingId: notification.id,
    },
  })

  const onDelete = async () => {
    await deleteNotification()
    toast.success('Notification deleted successfully')
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
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your notification{' '}
            <b>&quot;{notification.title}&quot;</b>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" disabled={loading} onClick={onDelete}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
