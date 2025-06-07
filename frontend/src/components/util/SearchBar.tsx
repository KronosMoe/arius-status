import { useEffect, useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { Button } from '../ui/button'
import { Activity, Gauge, LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DASHBOARD_PATH, SETTING_PATH, STATUS_PAGE_PATH } from '@/constants/routes'

type Props = {
  logout: () => void
}

export default function SearchBar({ logout }: Props) {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const navigateTo = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  const handleLogout = () => {
    setOpen(false)
    logout()
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="bg-muted text-muted-foreground flex w-[150px] cursor-pointer justify-between text-sm"
      >
        Search...
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="What are you looking for?" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem value="dashboard" onSelect={() => navigateTo(DASHBOARD_PATH)}>
                <Gauge className="h-4 w-4" /> Dashboard
              </CommandItem>
              <CommandItem value="status" onSelect={() => navigateTo(STATUS_PAGE_PATH)}>
                <Activity className="h-4 w-4" /> Status page
              </CommandItem>
              <CommandItem value="settings" onSelect={() => navigateTo(SETTING_PATH)}>
                <Settings className="h-4 w-4" /> Settings
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Actions">
              <CommandItem value="logout" onSelect={handleLogout}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
