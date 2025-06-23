import DeleteStatusPageDialog from '@/components/StatusPage/components/DeleteStatusPageDialog'
import { Button } from '@/components/ui/button'
import Loading from '@/components/util/Loading'
import { STATUS_PAGE_CREATION_PATH, STATUS_PAGE_EDIT_PATH, STATUS_PAGE_FULL_PATH } from '@/constants/routes'
import { GET_STATUS_PAGES } from '@/gql/status-page'
import type { IStatusPage } from '@/types/status-page'
import { useQuery } from '@apollo/client'
import { CirclePlus, Pen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function StatusPages() {
  const { t } = useTranslation()
  const [statusPages, setStatusPages] = useState<IStatusPage[]>([])

  const { data, loading, error, refetch } = useQuery(GET_STATUS_PAGES, {
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

  return (
    <div className="w-full px-4 xl:m-auto xl:w-[1280px]">
      <div className="mt-10 mb-20">
        <div className="my-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">{t('status-page.title')}</h1>
            <p className="text-muted-foreground">{t('status-page.description')}</p>
          </div>
          <Link to={STATUS_PAGE_CREATION_PATH}>
            <Button variant="default">
              <CirclePlus className="h-4 w-4" />
              {t('status-page.create-status-page-form.button')}
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {statusPages.length > 0 ? (
            statusPages.map((statusPage) => (
              <div
                key={statusPage.id}
                className="flex flex-col gap-4 rounded-md border border-black/20 p-4 transition-colors hover:bg-zinc-100 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Link
                  to={STATUS_PAGE_FULL_PATH.replace(':slug', statusPage.slug)}
                  className="flex flex-row items-center gap-4"
                >
                  {statusPage.logo && (
                    <img
                      src={statusPage.logo || '/placeholder.svg'}
                      alt={`${statusPage.name} logo`}
                      className="h-16 w-16 rounded-md"
                    />
                  )}
                  <div>
                    <div className="text-lg font-bold">{statusPage.name}</div>
                    <div className="text-muted-foreground text-sm">/status/{statusPage.slug}</div>
                  </div>
                </Link>
                <div className="flex flex-row items-center justify-end gap-2">
                  <Link to={STATUS_PAGE_EDIT_PATH.replace(':id', statusPage.id)}>
                    <Button variant="default" className="cursor-pointer">
                      <Pen className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">{t('status-page.edit-button')}</span>
                    </Button>
                  </Link>
                  <DeleteStatusPageDialog statusPageId={statusPage.id} refetch={refetch} />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <p className="text-muted-foreground mb-4">{t('status-page.empty.title')}</p>
              <Link to={STATUS_PAGE_CREATION_PATH}>
                <Button variant="default">
                  <CirclePlus className="h-4 w-4" />
                  {t('status-page.empty.button')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
