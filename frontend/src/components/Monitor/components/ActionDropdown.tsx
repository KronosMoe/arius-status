import { useMutation } from '@apollo/client'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, Pause, Pencil, Play, Trash } from 'lucide-react'
import { IMonitor } from '@/types/monitor'
import { PAUSE_MONITOR_MUTATION, RESUME_MONITOR_MUTATION, DELETE_MONITOR_MUTATION } from '@/gql/monitors'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import UpdateMonitorForm from './EditMonitorForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'
import { DASHBOARD_PATH } from '@/constants/routes'
import { useTranslation } from 'react-i18next'

type Props = {
  monitor: IMonitor
  refetch: () => void
}

export default function ActionDropdown({ monitor, refetch }: Props) {
  const { t } = useTranslation()
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
  const [pauseMonitor, { error: pauseMonitorError }] = useMutation(PAUSE_MONITOR_MUTATION)
  const [resumeMonitor, { error: resumeMonitorError }] = useMutation(RESUME_MONITOR_MUTATION)
  const [deleteMonitor, { error: deleteMonitorError, loading: deleteLoading }] = useMutation(DELETE_MONITOR_MUTATION, {
    variables: {
      deleteMonitorByIdId: monitor.id,
    },
  })

  const navigate = useNavigate()

  const handlePause = async () => {
    await pauseMonitor({
      variables: {
        pauseMonitorByIdId: monitor.id,
      },
    })
    toast.success(t('monitor.action.pause.toast'))
    refetch()
  }

  const handleResume = async () => {
    await resumeMonitor({
      variables: {
        resumeMonitorByIdId: monitor.id,
      },
    })
    toast.success(t('monitor.action.resume.toast'))
    refetch()
  }

  const handleDelete = async () => {
    await deleteMonitor({
      variables: {
        id: monitor.id,
      },
    })
    toast.success(t('monitor.action.delete.toast'))
    navigate(DASHBOARD_PATH, { replace: true })
    navigate(0)
    setOpenDeleteDialog(false)
  }

  useEffect(() => {
    if (pauseMonitorError) toast.error(pauseMonitorError.message)
    if (resumeMonitorError) toast.error(resumeMonitorError.message)
    if (deleteMonitorError) toast.error(deleteMonitorError.message)
  }, [pauseMonitorError, resumeMonitorError, deleteMonitorError])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t('monitor.action.button')} <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {monitor.status === 'PAUSED' ? (
            <DropdownMenuItem className="text-green-400" onClick={handleResume}>
              <Play className="text-green-400" /> {t('monitor.action.resume.button')}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="text-yellow-400" onClick={handlePause}>
              <Pause className="text-yellow-400" /> {t('monitor.action.pause.button')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil /> {t('monitor.action.edit.button')}
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-400" onClick={() => setOpenDeleteDialog(true)}>
            <Trash className="text-red-400" /> {t('monitor.action.delete.button')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateMonitorForm monitor={monitor} openEdit={openEdit} setOpenEdit={setOpenEdit} refetch={refetch} />
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('monitor.action.delete.confirmation.title')}</DialogTitle>
            <DialogDescription>{t('monitor.action.delete.confirmation.description')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              {t('monitor.action.delete.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {t('monitor.action.delete.button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
