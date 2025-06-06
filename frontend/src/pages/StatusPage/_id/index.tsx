import Favicon from '@/components/StatusPage/components/Favicon'
import OverallStatus from '@/components/StatusPage/components/OverallStatus'
import StatusCard from '@/components/StatusPage/components/StatusCard'
import StatusLine from '@/components/StatusPage/components/StatusLine'
import Loading from '@/components/util/Loading'
import { GET_STATUS_BY_SLUG } from '@/gql/status-page'
import { IStatusPageExtended } from '@/types/status-page'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

export default function StatusPage() {
  const params = useParams()

  const [statusPage, setStatusPage] = useState<IStatusPageExtended | null>(null)

  const { data, loading, error } = useQuery(GET_STATUS_BY_SLUG, {
    variables: {
      slug: params.slug,
    },
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (data?.getStatusPageBySlug) {
      setStatusPage(data.getStatusPageBySlug)
    }
  }, [data])

  if (loading || !statusPage) return <Loading />

  const selectedIds = statusPage.selectedMonitors.map((monitor) => monitor.id)

  return (
    <div className="mt-10 flex min-h-screen flex-col">
      <Favicon base64Icon={statusPage.logo} />
      <title>{statusPage.name}</title>
      <div
        className={`min-h-screen ${statusPage.isFullWidth ? 'w-full px-4' : 'w-full px-4 xl:m-auto xl:w-[1280px]'}`}
      >
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            {statusPage.logo && (
              <img
                src={statusPage.logo}
                alt="Logo"
                className="h-16 w-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{statusPage.name || 'Status Page Title'}</h1>
            </div>
          </div>
          {statusPage.showOverallStatus && statusPage.selectedMonitors.length > 0 && (
            <OverallStatus monitorIds={selectedIds} />
          )}
          {statusPage.statusCards.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Service Status</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {statusPage.statusCards.map((monitor, index) => (
                  <StatusCard monitor={monitor} key={index} />
                ))}
              </div>
            </div>
          )}
          {statusPage.statusLines.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Response Time</h2>
              <div className="space-y-4">
                {statusPage.statusLines.map((monitor, index) => (
                  <StatusLine monitor={monitor} key={index} />
                ))}
              </div>
            </div>
          )}
          {statusPage.footerText && (
            <footer className="mt-16 border-t pt-8">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">{statusPage.footerText}</p>
                <p className="text-muted-foreground mt-2 text-xs">Powered by Arius Statuspage</p>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}
