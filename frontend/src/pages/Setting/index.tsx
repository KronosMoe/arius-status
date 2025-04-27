import { Separator } from '@/components/ui/separator'
import Loading from '@/components/utils/Loading'
import ThemeSwitcher from '@/components/utils/ThemeSwitcher'
import { SETTINGS_QUERY } from '@/gql/settings'
import { ISetting } from '@/types/setting'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Setting() {
  const [settings, setSettings] = useState<ISetting>({
    theme: 'light',
    displayInterval: 60,
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
      </div>
    </div>
  )
}
