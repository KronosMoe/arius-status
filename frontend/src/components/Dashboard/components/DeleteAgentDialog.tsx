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
import { DELETE_AGENT_MUTATION } from '@/gql/agents'
import { useMutation } from '@apollo/client'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  agentId: string
  refetch: () => void
}

export default function DeleteAgentDialog({ agentId, refetch }: Props) {
  const [open, setOpen] = useState(false)

  const [deleteAgent, { loading: isDeleting }] = useMutation(DELETE_AGENT_MUTATION, {
    onCompleted: () => {
      toast.success('Agent deleted successfully')
      refetch()
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="cursor-pointer">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone. This will permanently delete your agent.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={() => {
              deleteAgent({ variables: { id: agentId } })
              setOpen(false)
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
