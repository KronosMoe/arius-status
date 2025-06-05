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
import { toast } from 'sonner'

type Props = {
  statusPageId: string
  refetch: () => void
}

export default function DeleteStatusPageDialog({ statusPageId, refetch }: Props) {
  const [open, setOpen] = useState(false)

  const [deleteStatusPage, { loading }] = useMutation(DELETE_STATUS_PAGE_MUTATION, {
    variables: {
      id: statusPageId,
    },
    onCompleted: () => {
      toast.success('Status page deleted successfully')
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
        <Button variant='destructive' className='cursor-pointer'>
          <Trash className="sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your status page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" disabled={loading} onClick={() => deleteStatusPage()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
