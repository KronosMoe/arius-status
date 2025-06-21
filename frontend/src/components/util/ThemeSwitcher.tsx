import { useCallback } from 'react'
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
    async (newTheme: 'light' | 'dark') => {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      localStorage.setItem('theme', newTheme)
      setSettings((prev) => ({ ...prev, theme: newTheme }))
      if (isAuthenticated) {
        await updateTheme({ variables: { theme: newTheme } })
      }
    },
    [setSettings, updateTheme, isAuthenticated],
  )

  return (
    <div className="flex flex-row">
      <button
        onClick={() => setTheme('light')}
        className={`flex cursor-pointer items-center gap-2 rounded-l-md border px-2 py-1 transition-colors ${
          settings.theme === 'light'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black'
            : 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
        } border-black/20 dark:border-white/10`}
      >
        <Sun /> Light Mode
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`flex cursor-pointer items-center gap-2 rounded-r-md border px-2 py-1 transition-colors ${
          settings.theme === 'dark'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black'
            : 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
        } border-black/20 dark:border-white/10`}
      >
        <Moon /> Dark Mode
      </button>
    </div>
  )
}
