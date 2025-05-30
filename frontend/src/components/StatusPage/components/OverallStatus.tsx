import Loading from '@/components/utils/Loading'
import { OVERALL_STATUS_QUERY } from '@/gql/status'
import { useQuery } from '@apollo/client'
import { CircleCheck, CircleX } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {
  monitorIds: string[]
}

export default function OverallStatus({ monitorIds }: Props) {
  const { data, loading, error } = useQuery(OVERALL_STATUS_QUERY, {
    variables: {
      monitorIds: monitorIds,
    },
    skip: monitorIds.length === 0,
    fetchPolicy: 'network-only',
    pollInterval: 60 * 1000,
  })
  const status = data?.getOverallStatus

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  if (loading) return <Loading />

  const statusIcon = () => {
    switch (status) {
      case 'Degraded':
        return <CircleX />

      case 'Partially Degraded':
        return <CircleX />

      default:
        return <CircleCheck />
    }
  }

  const bgColor = () => {
    switch (status) {
      case 'Degraded':
        return 'bg-red-500'

      case 'Partially Degraded':
        return 'bg-yellow-500'

      default:
        return 'bg-green-500'
    }
  }

  return (
    <div className={`${bgColor()} flex flex-row items-center justify-between rounded-md p-4 text-white`}>
      {statusIcon()}
      {status}
    </div>
  )
}
