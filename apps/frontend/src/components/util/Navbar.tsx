import { useAuth } from '@/hooks/useAuth'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { DASHBOARD_PATH, SIGN_IN_PATH } from '@/constants/routes'
import { LogIn } from 'lucide-react'
import Logo from './Logo'
import NavbarDropdown from './NavbarDropdown'
import SearchBar from './SearchBar'

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
            <>
              <div className="hidden md:block">
                <SearchBar logout={logout} />
              </div>
              <NavbarDropdown auth={auth} logout={logout} />
            </>
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
