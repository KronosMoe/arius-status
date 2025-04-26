import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { DropdownMenuItem } from '../ui/dropdown-menu'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark')
      setTheme('dark')
    } else {
      document.documentElement.classList.remove('dark')
      setTheme('light')
    }
  }, [])

  const toggleTheme = () => {
    const isDark = theme === 'dark'
    const newTheme = isDark ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <DropdownMenuItem onClick={toggleTheme}>
      {theme === 'dark' ? <Sun /> : <Moon />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </DropdownMenuItem>
  )
}
