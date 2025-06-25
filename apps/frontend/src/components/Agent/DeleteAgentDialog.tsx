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
import { DASHBOARD_PATH } from '@/constants/routes'
import { DELETE_AGENT_MUTATION } from '@/gql/agents'
import { useMutation } from '@apollo/client'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

type Props = {
  agentId: string
}

export default function DeleteAgentDialog({ agentId }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const [deleteAgent, { loading: isDeleting }] = useMutation(DELETE_AGENT_MUTATION, {
    onCompleted: () => {
      toast.success(t('agent.delete.toast'))
      navigate(DASHBOARD_PATH, { replace: true })
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="cursor-pointer">
          <Trash className="mr-2 h-4 w-4" />
          {t('agent.delete.button')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('agent.delete.confirmation.title')}</DialogTitle>
          <DialogDescription>{t('agent.delete.confirmation.description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>{t('agent.delete.cancel')}</Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={() => {
              deleteAgent({ variables: { id: agentId } })
              setOpen(false)
            }}
          >
            {t('agent.delete.button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
