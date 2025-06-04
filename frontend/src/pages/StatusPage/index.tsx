import { Button } from '@/components/ui/button'
import Loading from '@/components/utils/Loading'
import { STATUS_PAGE_CREATION_PATH, STATUS_PAGE_FULL_PATH } from '@/constants/routes'
import { GET_STATUS_PAGES } from '@/gql/status-page'
import { IStatusPage } from '@/types/status-page'
import { useQuery } from '@apollo/client'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function StatusPages() {
  const [statusPages, setStatusPages] = useState<IStatusPage[]>([])

  const { data, loading, error } = useQuery(GET_STATUS_PAGES, {
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (data?.getStatusPagesByUserId) {
      setStatusPages(data.getStatusPagesByUserId)
    }
  }, [data])

  if (loading) return <Loading />

  const statusPageCard = statusPages.map((statusPage) => (
    <Link
      to={STATUS_PAGE_FULL_PATH.replace(':slug', statusPage.slug)}
      key={statusPage.id}
      className="flex cursor-pointer flex-col rounded-md border border-black/20 p-4 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800"
    >
      <div className="flex flex-row items-center gap-4">
        <img src={statusPage.logo} alt="logo" className="size-[64px] rounded-md" />
        <div>
          <div className="text-lg font-bold">{statusPage.name}</div>
          <div className="text-muted-foreground text-sm">/status/{statusPage.slug}</div>
        </div>
      </div>
    </Link>
  ))

  return (
    <div className="w-full px-4 xl:m-auto xl:w-[1280px]">
      <div className="mt-10 mb-20">
        <div className="my-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Status Pages</h1>
            <p className="text-muted-foreground">Manage your status pages</p>
          </div>
          <Link to={STATUS_PAGE_CREATION_PATH}>
            <Button variant="default">
              <CirclePlus />
              Create Status Page
            </Button>
          </Link>
        </div>
        {statusPageCard}
      </div>
    </div>
  )
}
