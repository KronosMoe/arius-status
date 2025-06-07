import { useMutation } from '@apollo/client'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Pause, Pencil, Play, Trash } from 'lucide-react'
import { IMonitor } from '@/types/monitor'
import { PAUSE_MONITOR_MUTATION, RESUME_MONITOR_MUTATION, DELETE_MONITOR_MUTATION } from '@/gql/monitors'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import UpdateMonitorForm from './EditMonitorForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'
import { DASHBOARD_PATH } from '@/constants/routes'

type Props = {
  monitor: IMonitor
  refetchMonitor: () => void
}

export default function ActionDropdown({ monitor, refetchMonitor }: Props) {
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
    toast.success('Monitor paused')
    refetchMonitor()
  }

  const handleResume = async () => {
    await resumeMonitor({
      variables: {
        resumeMonitorByIdId: monitor.id,
      },
    })
    toast.success('Monitor resumed')
    refetchMonitor()
  }

  const handleDelete = async () => {
    await deleteMonitor({
      variables: {
        id: monitor.id,
      },
    })
    toast.success('Monitor deleted')
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
            Actions <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {monitor.status === 'PAUSED' ? (
            <DropdownMenuItem onClick={handleResume}>
              <Play /> Resume
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handlePause}>
              <Pause /> Pause
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500" onClick={() => setOpenDeleteDialog(true)}>
            <Trash /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateMonitorForm
        monitor={monitor}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        refetchMonitor={refetchMonitor}
      />
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this monitor?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
