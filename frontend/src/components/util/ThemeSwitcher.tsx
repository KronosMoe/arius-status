import { useCallback, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { ISetting } from '@/types/setting'
import { UPDATE_THEME_MUTATION } from '@/gql/settings'
import { useMutation } from '@apollo/client'
import { useAuth } from '@/hooks/useAuth'

type Props = {
  settings: ISetting
  setSettings: React.Dispatch<React.SetStateAction<ISetting>>
}

export default function ThemeSwitcher({ settings, setSettings }: Props) {
  const { isAuthenticated } = useAuth()
  const [updateTheme] = useMutation(UPDATE_THEME_MUTATION)

  const setTheme = useCallback(
    (newTheme: 'light' | 'dark') => {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      localStorage.setItem('theme', newTheme)
      setSettings((prev) => ({ ...prev, theme: newTheme }))
    },
    [setSettings],
  )

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark')
    } else if (isAuthenticated) {
      setTheme(settings.theme)
    } else {
      setTheme('light')
    }
  }, [settings.theme, isAuthenticated, setTheme])

  const changeTheme = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    if (isAuthenticated) {
      await updateTheme({ variables: { theme: newTheme } })
    }
  }

  const isDark = settings.theme === 'dark'
  const isLight = settings.theme === 'light'

  return (
    <div className="flex flex-row">
      <button
        onClick={() => changeTheme('light')}
        className={`flex cursor-pointer items-center gap-2 rounded-l-md border px-2 py-1 transition-colors ${
          isLight
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black'
            : 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
        } border-black/20 dark:border-white/10`}
      >
        <Sun /> Light Mode
      </button>

      <button
        onClick={() => changeTheme('dark')}
        className={`flex cursor-pointer items-center gap-2 rounded-r-md border px-2 py-1 transition-colors ${
          isDark
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black'
            : 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
        } border-black/20 dark:border-white/10`}
      >
        <Moon /> Dark Mode
      </button>
    </div>
  )
}
