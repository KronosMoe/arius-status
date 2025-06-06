import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import Loading from '../util/Loading'
import type { IMonitor } from '@/types/monitor'
import { useMutation, useQuery } from '@apollo/client'
import { MONITORS_QUERY } from '@/gql/monitors'
import StatusCard from './components/StatusCard'
import StatusLine from './components/StatusLine'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import OverallStatus from './components/OverallStatus'
import { Switch } from '../ui/switch'
import { Separator } from '../ui/separator'
import DraggableMonitor from './components/DraggableMonitor'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Eye,
  Settings,
  Upload,
  Monitor,
  Activity,
  Save,
  RotateCcw,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { STATUS_PAGE_PATH } from '@/constants/routes'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '../ui/alert'
import { UPDATE_STATUS_PAGE_MUTATION } from '@/gql/status-page'
import { IStatusPageExtended } from '@/types/status-page'

const formSchema = z.object({
  name: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  footerText: z.string().max(200, 'Footer text must be less than 200 characters').optional(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), 'Slug cannot start or end with a hyphen'),
  showOverallStatus: z.boolean(),
  isFullWidth: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

type Props = {
  statusPage: IStatusPageExtended
  refetch: () => void
}

export default function StatusPageEditor({ statusPage, refetch }: Props) {
  const {
    data: monitorData,
    loading: monitorLoading,
    error: monitorError,
  } = useQuery(MONITORS_QUERY, {
    fetchPolicy: 'network-only',
  })

  const [updateStatusPage, { loading: updating }] = useMutation(UPDATE_STATUS_PAGE_MUTATION, {
    onError: (error) => toast.error(error.message),
    onCompleted: () => {
      toast.success('Status page saved successfully!')
      setHasUnsavedChanges(false)
      refetch()
    },
  })

  const [isEditorCollapsed, setEditorCollapsed] = useState(false)
  const [statusCards, setStatusCards] = useState<IMonitor[]>(statusPage.statusCards)
  const [statusLines, setStatusLines] = useState<IMonitor[]>(statusPage.statusLines)
  const [monitors, setMonitors] = useState<IMonitor[]>([])
  const [logo, setLogo] = useState<string>(statusPage.logo)
  const [selectedMonitor, setSelectedMonitor] = useState<{ id: string; type: 'card' | 'line'; index: number }[]>([])
  const [activeTab, setActiveTab] = useState('editor')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false)

  const selectedIds = useMemo(() => Array.from(new Set(selectedMonitor.map((m) => m.id))), [selectedMonitor])

  useEffect(() => {
    setSelectedMonitor(
      statusPage.selectedMonitors.map((m) => ({ id: m.id, type: m.type as 'card' | 'line', index: m.index })),
    )
  }, [statusPage])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: statusPage.name,
      slug: statusPage.slug,
      footerText: statusPage.footerText,
      showOverallStatus: statusPage.showOverallStatus,
      isFullWidth: statusPage.isFullWidth,
    },
  })

  const formValues = watch()
  const { name, slug, footerText, showOverallStatus, isFullWidth } = formValues

  useEffect(() => {
    if (monitorData?.findMonitorsByUserId) {
      setMonitors(monitorData.findMonitorsByUserId)
    }
  }, [monitorData])

  useEffect(() => {
    const selected: { id: string; type: 'card' | 'line'; index: number }[] = [
      ...statusCards.map((m, i) => ({ id: m.id, type: 'card' as const, index: i })),
      ...statusLines.map((m, i) => ({ id: m.id, type: 'line' as const, index: i + statusCards.length })),
    ]
    setSelectedMonitor(selected)
  }, [statusCards, statusLines])

  useEffect(() => {
    if (monitorError) toast.error(monitorError.message)
  }, [monitorError])

  useEffect(() => {
    setHasUnsavedChanges(isDirty || statusCards.length > 0 || statusLines.length > 0)
  }, [isDirty, statusCards.length, statusLines.length])

  if (monitorLoading) return <Loading />

  const handleSelectStatusCardMonitor = (monitorId: string) => {
    const monitorToAdd = monitors.find((m) => m.id === monitorId)
    if (monitorToAdd && !statusCards.some((m) => m.id === monitorId)) {
      setStatusCards((prevCards) => [...prevCards, monitorToAdd])
    }
  }

  const handleSelectStatusLineMonitor = (monitorId: string) => {
    const monitorToAdd = monitors.find((m) => m.id === monitorId)
    if (monitorToAdd && !statusLines.some((m) => m.id === monitorId)) {
      setStatusLines((prevLines) => [...prevLines, monitorToAdd])
    }
  }

  const removeStatusCard = (monitorId: string) => {
    setStatusCards((prev) => prev.filter((m) => m.id !== monitorId))
  }

  const removeStatusLine = (monitorId: string) => {
    setStatusLines((prev) => prev.filter((m) => m.id !== monitorId))
  }

  const availableMonitorsForStatusCard = monitors.filter((monitor) => !statusCards.some((m) => m.id === monitor.id))

  const availableMonitorsForStatusLine = monitors.filter((monitor) => !statusLines.some((m) => m.id === monitor.id))

  const moveCard = (from: number, to: number) => {
    setStatusCards((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      return updated
    })
  }

  const moveLine = (from: number, to: number) => {
    setStatusLines((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      return updated
    })
  }

  const handleReset = () => {
    reset()
    setStatusCards([])
    setStatusLines([])
    setHasUnsavedChanges(false)
  }

  const onSubmit = async (data: FormData) => {
    if (selectedMonitor.length === 0) {
      toast.error('Please select at least one monitor')
      return
    }

    const payload = {
      ...data,
      selectedMonitors: selectedMonitor,
      logo,
    }

    await updateStatusPage({
      variables: {
        id: statusPage.id,
        input: {
          ...payload,
        },
      },
    })
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const maxSizeInBytes = 50 * 1024 * 1024

      if (file.size > maxSizeInBytes) {
        toast.error('File size should not exceed 50MB.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setLogo(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setValue('name', newName)

    // Auto-generate slug if it hasn't been manually edited
    if (!hasManuallyEditedSlug) {
      setValue('slug', generateSlugFromName(newName))
    }
  }

  return (
    <div className="min-h-screen">
      <div className={`min-h-screen ${isFullWidth ? 'px-4' : 'mx-auto max-w-7xl px-4'}`}>
        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <Link to={STATUS_PAGE_PATH}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Status Page Creator</h1>
              <p className="text-muted-foreground text-sm">Design and configure your status page</p>
            </div>
          </div>

          {hasUnsavedChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Unsaved changes
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            {/* Configuration Panel */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Configuration</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setEditorCollapsed(!isEditorCollapsed)}>
                  {isEditorCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </CardHeader>

              {!isEditorCollapsed && (
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Settings */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Page Title *</Label>
                          <Input
                            id="name"
                            {...register('name')}
                            onChange={handleNameChange}
                            placeholder="Enter status page title"
                            className={errors.name ? 'border-red-500' : ''}
                          />
                          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slug">Page URL *</Label>
                          <div className="flex items-center">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                              /page/
                            </span>
                            <Input
                              id="slug"
                              {...register('slug')}
                              onChange={(e) => {
                                setValue('slug', e.target.value)
                                setHasManuallyEditedSlug(true)
                              }}
                              placeholder="my-status-page"
                              className={`rounded-l-none ${errors.slug ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
                          <p className="text-muted-foreground text-xs">
                            Your status page will be available at:{' '}
                            <code className="bg-muted rounded px-1 py-0.5">/page/{slug || 'your-slug'}</code>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="logo">Logo</Label>
                          <div className="flex items-center gap-3">
                            {logo && (
                              <img
                                src={logo || '/placeholder.svg'}
                                alt="Logo"
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                                id="logo-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('logo-upload')?.click()}
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Logo
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="footerText">Footer Text</Label>
                        <Input id="footerText" {...register('footerText')} placeholder="Enter footer text (optional)" />
                        {errors.footerText && <p className="text-sm text-red-600">{errors.footerText.message}</p>}
                      </div>
                    </div>

                    <Separator />

                    {/* Layout Settings */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Layout Settings</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <Label htmlFor="overall-status-toggle" className="font-medium">
                              Overall Status
                            </Label>
                            <p className="text-muted-foreground text-sm">Show aggregated status at the top</p>
                          </div>
                          <Switch
                            id="overall-status-toggle"
                            checked={showOverallStatus}
                            onCheckedChange={(checked) => setValue('showOverallStatus', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <Label htmlFor="full-width-toggle" className="font-medium">
                              Full Width
                            </Label>
                            <p className="text-muted-foreground text-sm">Use full width layout</p>
                          </div>
                          <Switch
                            id="full-width-toggle"
                            checked={isFullWidth}
                            onCheckedChange={(checked) => setValue('isFullWidth', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Monitor Selection */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Monitors</h3>

                      {monitors.length === 0 && (
                        <Alert>
                          <Monitor className="h-4 w-4" />
                          <AlertDescription>
                            No monitors found. Create monitors first to add them to your status page.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Status Cards */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Status Cards</Label>
                            <Badge variant="outline">{statusCards.length}</Badge>
                          </div>

                          <Select onValueChange={handleSelectStatusCardMonitor}>
                            <SelectTrigger>
                              <SelectValue placeholder="Add monitor as card" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableMonitorsForStatusCard.map((monitor) => (
                                <SelectItem key={monitor.id} value={monitor.id}>
                                  <div className="flex items-center gap-2">
                                    <Monitor className="h-4 w-4" />
                                    {monitor.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {statusCards.length > 0 && (
                            <div className="space-y-2">
                              {statusCards.map((monitor) => (
                                <div
                                  key={monitor.id}
                                  className="bg-muted flex items-center justify-between rounded-md p-2"
                                >
                                  <span className="text-sm">{monitor.name}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeStatusCard(monitor.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Status Lines */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Status Lines</Label>
                            <Badge variant="outline">{statusLines.length}</Badge>
                          </div>

                          <Select onValueChange={handleSelectStatusLineMonitor}>
                            <SelectTrigger>
                              <SelectValue placeholder="Add monitor as line" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableMonitorsForStatusLine.map((monitor) => (
                                <SelectItem key={monitor.id} value={monitor.id}>
                                  <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    {monitor.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {statusLines.length > 0 && (
                            <div className="space-y-2">
                              {statusLines.map((monitor) => (
                                <div
                                  key={monitor.id}
                                  className="bg-muted flex items-center justify-between rounded-md p-2"
                                >
                                  <span className="text-sm">{monitor.name}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeStatusLine(monitor.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <Button type="button" variant="outline" onClick={handleReset} disabled={!hasUnsavedChanges}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>

                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => setActiveTab('preview')}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button type="submit" disabled={updating || !hasUnsavedChanges}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Status Page
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background rounded-lg border p-6">
                  {/* Status Page Preview */}
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      {logo && (
                        <img
                          src={logo || '/placeholder.svg'}
                          alt="Logo"
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h1 className="text-3xl font-bold">{name || 'Status Page Title'}</h1>
                      </div>
                    </div>

                    {/* Overall Status */}
                    {showOverallStatus && selectedIds.length > 0 && <OverallStatus monitorIds={selectedIds} />}

                    {/* Status Cards */}
                    {statusCards.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Service Status</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {statusCards.map((monitor, index) => (
                            <DraggableMonitor
                              key={monitor.id}
                              index={index}
                              monitor={monitor}
                              moveMonitor={moveCard}
                              type="card"
                            >
                              <StatusCard monitor={monitor} />
                            </DraggableMonitor>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Lines */}
                    {statusLines.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Response Time</h2>
                        <div className="space-y-4">
                          {statusLines.map((monitor, index) => (
                            <DraggableMonitor
                              key={monitor.id}
                              index={index}
                              monitor={monitor}
                              moveMonitor={moveLine}
                              type="line"
                            >
                              <StatusLine monitor={monitor} />
                            </DraggableMonitor>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {statusCards.length === 0 && statusLines.length === 0 && (
                      <div className="py-12 text-center">
                        <Monitor className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                        <h3 className="mb-2 text-lg font-medium">No monitors added</h3>
                        <p className="text-muted-foreground mb-4">Add monitors to your status page to get started</p>
                        <Button onClick={() => setActiveTab('editor')}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Monitors
                        </Button>
                      </div>
                    )}

                    {/* Footer */}
                    {footerText && (
                      <footer className="mt-16 border-t pt-8">
                        <div className="text-center">
                          <p className="text-muted-foreground text-sm">{footerText}</p>
                          <p className="text-muted-foreground mt-2 text-xs">Powered by Arius Statuspage</p>
                        </div>
                      </footer>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
