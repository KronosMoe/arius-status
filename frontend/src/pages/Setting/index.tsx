import NotificationSetting from '@/components/Setting/Notification'
import Timezone from '@/components/Setting/Timezone'
import { Separator } from '@/components/ui/separator'
import Loading from '@/components/utils/Loading'
import Logo from '@/components/utils/Logo'
import ThemeSwitcher from '@/components/utils/ThemeSwitcher'
import { SETTINGS_QUERY } from '@/gql/settings'
import { useAuth } from '@/hooks/useAuth'
import { ISetting } from '@/types/setting'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Setting() {
  const { auth } = useAuth()

  const [settings, setSettings] = useState<ISetting>({
    theme: auth?.settings.theme || 'light',
    timezone: auth?.settings.timezone || 'Asia/Bangkok',
  })
  const { data, error, loading } = useQuery(SETTINGS_QUERY)

  useEffect(() => {
    if (data?.getSettingsByUserId) {
      setSettings(settings)
    }
  }, [data, settings])

  if (loading) return <Loading />
  if (error) {
    toast.error(error.message)
    return null
  }

  return (
    <div className="w-full px-4 xl:m-auto xl:w-[1280px]">
      <div className="mt-10">
        <h1 className="my-4 text-4xl font-bold">Settings</h1>
        <Separator />
        <div className="my-4">
          <h2 className="my-4 text-xl font-bold">Appearance</h2>
          <ThemeSwitcher settings={data.getSettingsByUserId} setSettings={setSettings} />
        </div>
        <div className="my-4">
          <h2 className="my-4 text-xl font-bold">Timezone</h2>
          <Timezone timezone={settings.timezone} setSettings={setSettings} />
        </div>
        <Separator />
        <div className="my-4">
          <NotificationSetting />
        </div>
        <Separator />
        <div className="my-4">
          <h2 className="my-4 text-xl font-bold">About</h2>
          <div className="flex flex-col items-center justify-center">
            <Logo size={128} />
            <h3 className="mt-4 text-2xl font-bold">Arius Statuspage</h3>
            <p className="text-sm text-zinc-500">Version: {import.meta.env.VITE_APP_VERSION || 'In Development'}</p>
            <a
              href="https://github.com/KronosMoe/arius-status"
              className="mt-2 text-xs text-zinc-500 underline dark:text-zinc-400"
            >
              Check Update On GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
