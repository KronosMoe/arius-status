import StatusPageEditor from '@/components/StatusPage/StatusPageEditor'
import Loading from '@/components/util/Loading'
import { GET_STATUS_BY_ID } from '@/gql/status-page'
import { IStatusPageExtended } from '@/types/status-page'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

export default function StatusEditor() {
  const params = useParams()

  const [statusPage, setStatusPage] = useState<IStatusPageExtended | null>(null)

  const { data, loading, error, refetch } = useQuery(GET_STATUS_BY_ID, {
    variables: {
      id: params.id,
    },
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (data?.getStatusPageById) {
      setStatusPage(data.getStatusPageById)
    }
  }, [data])

  useEffect(() => {
    if (statusPage) {
      document.title = `Editing ${statusPage.name} | Arius Statuspage`
    }
  }, [statusPage])

  if (loading || !statusPage) return <Loading />

  return (
    <div>
      <StatusPageEditor statusPage={statusPage} refetch={refetch} />
    </div>
  )
}
