import { useAuth } from '@/hooks/useAuth'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { DASHBOARD_PATH, SETTING_PATH, SIGN_IN_PATH } from '@/constants/routes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ChevronDown, LayoutDashboard, LayoutPanelTop, LogIn, LogOut, Settings } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const { auth, isAuthenticated, logout } = useAuth()

  return (
    <div className="sticky top-[10px] z-50 w-full px-[10px] xl:mx-auto xl:w-[1280px]">
      <div className="flex items-center justify-between rounded-md border border-black/20 bg-zinc-100/50 px-4 py-2 backdrop-blur-lg dark:border-white/10 dark:bg-zinc-900/50">
        <Link to={isAuthenticated ? DASHBOARD_PATH : SIGN_IN_PATH}>
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {isAuthenticated && auth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <img src={auth.image as string} alt="avatar" className="mr-1 h-6 w-6 rounded-full" />
                  {auth.username} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to={DASHBOARD_PATH}>
                  <DropdownMenuItem>
                    <LayoutDashboard />
                    Dashboard
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={logout}>
                  <LayoutPanelTop />
                  Status page
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link to={SETTING_PATH}>
                  <DropdownMenuItem>
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={SIGN_IN_PATH}>
              <Button className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
