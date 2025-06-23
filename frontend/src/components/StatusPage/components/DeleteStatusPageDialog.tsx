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
import { DELETE_STATUS_PAGE_MUTATION } from '@/gql/status-page'
import { useMutation } from '@apollo/client'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type Props = {
  statusPageId: string
  refetch: () => void
}

export default function DeleteStatusPageDialog({ statusPageId, refetch }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const [deleteStatusPage, { loading }] = useMutation(DELETE_STATUS_PAGE_MUTATION, {
    variables: {
      id: statusPageId,
    },
    onCompleted: () => {
      toast.success(t('status-page.delete-dialog.toast'))
      setOpen(false)
      refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          <Trash className="mr-2 h-4 w-4" />
          {t('status-page.delete-dialog.button')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('status-page.delete-dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('status-page.delete-dialog.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>{t('status-page.delete-dialog.cancel')}</Button>
          <Button variant="destructive" disabled={loading} onClick={() => deleteStatusPage()}>
            {t('status-page.delete-dialog.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
