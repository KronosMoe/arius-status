import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { toast } from 'sonner'
import { Monitor } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { CLEAR_SESSION_BY_ID_MUTATION, CLEAR_SESSIONS_MUTATION, SESSIONS_QUERY } from '@/gql/settings'
import type { ISession } from '@/types/setting'
import DeviceCard from './components/DeviceCard'

function DevicesSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function DeviceManager() {
  const [sessions, setSessions] = useState<ISession[]>([])

  const { data, error, loading } = useQuery(SESSIONS_QUERY, {
    errorPolicy: 'all',
  })

  const [clearAll, { loading: clearAllLoading }] = useMutation(CLEAR_SESSIONS_MUTATION, {
    onCompleted: () => toast.success('Logged out of all devices successfully.'),
    onError: (error) => toast.error('Failed to log out of all devices', { description: error.message }),
    refetchQueries: [{ query: SESSIONS_QUERY }],
  })

  const [clearSession, { loading: clearSessionLoading }] = useMutation(CLEAR_SESSION_BY_ID_MUTATION, {
    onCompleted: () => toast.success('Device session removed successfully.'),
    onError: (error) => toast.error('Failed to remove device session', { description: error.message }),
    refetchQueries: [{ query: SESSIONS_QUERY }],
  })

  useEffect(() => {
    if (data?.getSessionsByUserId) {
      setSessions(data.getSessionsByUserId)
    }
  }, [data])

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  if (loading) return <DevicesSkeleton />

  const activeSessions = sessions || []

  return (
    <div className="space-y-6">
      {activeSessions.length > 0 ? (
        <div>
          <h3 className="text-muted-foreground mb-3 text-sm font-medium">Active Sessions ({activeSessions.length})</h3>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <DeviceCard
                key={session.id}
                session={session}
                onRemove={() => clearSession({ variables: { clearSessionByIdId: session.id } })}
                isRemoving={clearSessionLoading}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Monitor className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">No Active Sessions</h3>
            <p className="text-muted-foreground">You don&apos;t have any active device sessions at the moment.</p>
          </CardContent>
        </Card>
      )}

      {activeSessions.length > 0 && (
        <Card className="border-destructive/20 gap-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-destructive text-lg">Danger Zone</CardTitle>
            <CardDescription>
              Log out of all devices. You&apos;ll need to sign in again on those devices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" disabled={clearAllLoading}>
                  {clearAllLoading ? 'Logging Out...' : 'Log Out All Devices'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Out All Devices?</DialogTitle>
                  <DialogDescription>
                    This will end all active sessions. You&apos;ll be logged out on {activeSessions.length} device
                    {activeSessions.length === 1 ? '' : 's'}.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={() => clearAll()} disabled={clearAllLoading}>
                    {clearAllLoading ? 'Logging Out...' : 'Confirm'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
