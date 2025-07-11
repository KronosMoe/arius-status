import { DASHBOARD_PATH, SETTING_PATH, STATUS_PAGE_PATH } from '@/constants/routes'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Link } from 'react-router-dom'
import { Activity, ChevronDown, Gauge, LogOut, Settings } from 'lucide-react'
import { Auth } from '@/types/auth'
import { useTranslation } from 'react-i18next'

type Props = {
  auth: Auth
  logout: () => void
}

export default function NavbarDropdown({ auth, logout }: Props) {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          <img src={auth.image as string} alt="avatar" className="mr-1 h-6 w-6 rounded-full" />
          {auth.username} <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <Link to={DASHBOARD_PATH}>
            <DropdownMenuItem>
              <Gauge className="h-4 w-4" />
              {t('nav.dashboard')}
            </DropdownMenuItem>
          </Link>
          <Link to={STATUS_PAGE_PATH}>
            <DropdownMenuItem>
              <Activity className="h-4 w-4" />
              {t('nav.status-page')}
            </DropdownMenuItem>
          </Link>
          <Link to={SETTING_PATH}>
            <DropdownMenuItem>
              <Settings className="h-4 w-4" />
              {t('nav.settings')}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={logout}>
            <LogOut className="h-4 w-4" />
            {t('nav.sign-out')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
