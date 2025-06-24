import { useQuery } from '@apollo/client'
import { GET_AGENT_BY_ID_QUERY, GET_AGENT_LATEST_IMAGE_TAG_QUERY } from '@/gql/agents'
import Loading from '@/components/util/Loading'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Calendar, Key, Hash } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import EditAgentForm from '@/components/Agent/EditAgentForm'
import DeleteAgentDialog from '@/components/Agent/DeleteAgentDialog'
import { useTranslation } from 'react-i18next'
import NotFound from '@/pages/NotFound'

export interface IAgent {
  id: string
  name: string
  token: string
  isOnline: boolean
  createdAt: Date
}

export default function Agent() {
  const { t } = useTranslation()
  const { agentId } = useParams()
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const { data, loading, refetch } = useQuery(GET_AGENT_BY_ID_QUERY, {
    variables: { id: agentId },
    skip: !agentId,
    onError: (error) => toast.error(error.message),
  })

  const { data: latestTagData, loading: latestTagLoading } = useQuery(GET_AGENT_LATEST_IMAGE_TAG_QUERY, {
    onError: (error) => toast.error(error.message),
  })

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(item)
      toast.success(t('agent.info.copy.success'))
      setTimeout(() => setCopiedItem(null), 2000)
    } catch {
      toast.error(t('agent.info.copy.error'))
    }
  }

  if (loading || latestTagLoading) return <Loading />

  const agent: IAgent = data?.getAgentById
  const latestTag = latestTagData?.getAgentLatestTag || 'latest'

  if (!agent) return <NotFound />

  const dockerCommand = `docker run -d \\
  --name arius-statuspage-agent \\
  --restart unless-stopped \\
  --cap-add NET_RAW \\
  --cap-add NET_ADMIN \\
  -e TOKEN=${agent.token} \\
  mirailisc/arius-status-agent:${latestTag}`

  const dockerCompose = `version: "3.9"

services:
  agent:
    image: "mirailisc/arius-status-agent:${latestTag}"
    container_name: "arius-statuspage-agent"
    environment:
      - TOKEN=${agent.token}
    restart: unless-stopped
    cap_add:
      - NET_RAW
      - NET_ADMIN`

  return (
    <div className="w-full space-y-6 px-4 py-6 xl:m-auto xl:w-[1280px]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{agent.name}</h1>
          <Badge variant={agent.isOnline ? 'default' : 'secondary'}>{agent.isOnline ? 'Online' : 'Offline'}</Badge>
        </div>
        <div className="flex gap-2">
          <EditAgentForm agent={agent} refetch={refetch} />
          <DeleteAgentDialog agentId={agent.id} />
        </div>
      </div>
      {/* Agent Information */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium">ID:</span>
              <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">{agent.id}</code>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium">{t('agent.info.created')}:</span>
              <span className="text-sm">{new Date(agent.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium">Token:</span>
            <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm dark:bg-gray-800">{agent.token}</code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(agent.token, 'token')}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('agent.info.installation.title')}</CardTitle>
          <CardDescription>{t('agent.info.installation.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="docker" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="docker">Docker</TabsTrigger>
              <TabsTrigger value="compose">Docker Compose</TabsTrigger>
            </TabsList>

            <TabsContent value="docker" className="mt-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('agent.info.installation.docker.message')}
                </p>
                <div className="relative">
                  <SyntaxHighlighter
                    language="bash"
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {dockerCommand}
                  </SyntaxHighlighter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(dockerCommand, 'docker-command')}
                    className="absolute top-2 right-2 border-gray-200 bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    {copiedItem === 'docker-command' ? 'Copied!' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compose" className="mt-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('agent.info.installation.docker-compose.message')}
                </p>
                <div className="relative">
                  <SyntaxHighlighter
                    language="yaml"
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {dockerCompose}
                  </SyntaxHighlighter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(dockerCompose, 'docker-compose')}
                    className="absolute top-2 right-2 border-gray-200 bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    {copiedItem === 'docker-compose' ? 'Copied!' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
