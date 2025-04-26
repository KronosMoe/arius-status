import { Button } from '@/components/ui/button'
import { DASHBOARD_PATH, SIGN_IN_PATH } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="mx-4 w-full xl:m-auto xl:w-[1280px]">
      <div className="mt-20">
        <h1 className="text-2xl font-bold">Arius Status</h1>
        <p className="mt-2 text-zinc-500">Monitor your applications across networks</p>
        {isAuthenticated ? (
          <Link to={DASHBOARD_PATH}>
            <Button className="mt-4">Dashboard</Button>
          </Link>
        ) : (
          <Link to={SIGN_IN_PATH}>
            <Button className="mt-4">Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
