import type React from 'react'

import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { toast } from 'sonner'
import { Settings, Palette, Bell, Smartphone } from 'lucide-react'

import Credit from '@/components/Setting/Credit'
import DeviceManager from '@/components/Setting/DeviceManager'
import NotificationSetting from '@/components/Setting/Notification'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ThemeSwitcher from '@/components/utils/ThemeSwitcher'
import { SETTINGS_QUERY } from '@/gql/settings'
import { useAuth } from '@/hooks/useAuth'
import type { ISetting } from '@/types/setting'
import { Skeleton } from '@/components/ui/skeleton'

interface SettingsSectionProps {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}

function SettingsSection({ icon, title, description, children }: SettingsSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">{icon}</div>
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="w-full">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function Setting() {
  const { auth } = useAuth()

  const [settings, setSettings] = useState<ISetting>({
    theme: auth?.settings.theme || 'light',
  })

  const { data, error, loading } = useQuery(SETTINGS_QUERY, {
    errorPolicy: 'all',
  })

  useEffect(() => {
    if (data?.getSettingsByUserId) {
      setSettings(data.getSettingsByUserId)
    }
  }, [data])

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  if (loading) {
    return (
      <div className="w-full px-4 xl:m-auto xl:w-[1280px] py-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <Settings className="h-8 w-8" />
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <SettingsSkeleton />
      </div>
    )
  }

  return (
    <div className="w-full px-4 xl:m-auto xl:w-[1280px] py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Settings className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      <div className="space-y-6">
        <SettingsSection
          icon={<Palette className="h-5 w-5" />}
          title="Appearance"
          description="Customize how the interface looks and feels"
        >
          <ThemeSwitcher settings={settings} setSettings={setSettings} />
        </SettingsSection>
        <SettingsSection
          icon={<Bell className="h-5 w-5" />}
          title="Notifications"
          description="Configure how and when you receive notifications"
        >
          <NotificationSetting />
        </SettingsSection>
        <SettingsSection
          icon={<Smartphone className="h-5 w-5" />}
          title="Devices"
          description="Manage devices where you're currently signed in"
        >
          <DeviceManager />
        </SettingsSection>
        <Credit />
      </div>
    </div>
  )
}
