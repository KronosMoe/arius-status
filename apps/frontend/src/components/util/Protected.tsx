import { Navigate, Outlet } from 'react-router-dom'
import { SIGN_IN_PATH } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import Loading from './Loading'

const Protected: React.FC = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to={SIGN_IN_PATH} replace />
  }

  return <Outlet />
}

export default Protected
